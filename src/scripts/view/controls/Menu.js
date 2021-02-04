import Modal from '../utils/Modal';

import {select as D3Select} from 'd3-selection';
import {timeFormat as D3TimeFormat} from 'd3-time-format';
import Tippy from 'tippy.js';
import html2canvas from 'html2canvas';
import {saveAs as FSSaveAs} from 'file-saver';
import has from 'lodash-es/has';

import '../../../styles/controls/Menu.less';

export default function(container='body', buttonSize=50){

    let Menu = {};

    // private

    let menuButtonSize = Math.max(30, buttonSize);

    let activeMenu = false;

    let menu = D3Select(container).append('div')
        .classed('floatingMenu', true)
        .on('click', ()=>{
            activeMenu = !activeMenu;
            menuButton.classed('active', activeMenu);
            menuNav.classed('active', activeMenu);
            arrangeLines(activeMenu);
        })
        .style('position', container=='body'?'absolute':'relative')
        .style('top', container=='body'?'20px':'0px')
        .style('right', container=='body'?'20px':'0px');
    let menuNav = menu.append('div')
        .classed('menuNav', true);
    let menuOptions = menuNav.append('ul');
    let menuButton = menu.append('a')
        .classed('menuBtn', true);
    let lines = menuButton.append('ul');
    for(let i=0; i<3; i++){
        lines.append('li').classed('line', true);
    }

    function resizeButton(){
        let horMar = 0.25*menuButtonSize,
            lineBor = 1,
            verMar = 0.35*(menuButtonSize-lineBor*6),
            horSize = 0.5*menuButtonSize,
            verSpace = 0.15*(menuButtonSize-lineBor*6);

        menuButton.style('padding', `${verMar}px ${horMar}px`)
            .style('width', `${horSize}px`);
        lines.selectAll('li')
            .style('width', `${horSize-lineBor*2}px`)
            .style('border-width', `${lineBor}px`)
            .filter((d,i)=>{return i<2;})
            .style('margin-bottom', `${verSpace}px`);
    }
    resizeButton();

    function arrangeLines(active){
        if(!active){
            lines.selectAll('li')
                .style('transform', 'none')
                .style('visibility', 'visible');
        } else {
            let lineBor = 1,
                verSpace = 0.15*(menuButtonSize-lineBor*6);
            let l = lines.selectAll('li');
            l.filter((d,i)=>{return i==0;}).style('transform', `translate(0px, ${verSpace+lineBor*2}px) rotate(45deg)`);
            l.filter((d,i)=>{return i==1;}).style('visibility', 'hidden');
            l.filter((d,i)=>{return i==2;}).style('transform', `translate(0px, ${-(verSpace+lineBor*2)}px) rotate(-45deg)`);
        }
    }

    // Modal instance re-used by some menu options
    const modal = Modal('body');

    // public

    // two arguments in case it's used by page manager
    // second arguments replaces first if not null
    Menu.setSize = function(v, v2=null){
        v = v2==null ? v : v2;
        menuButtonSize = Math.max(30, v);
        resizeButton();
        return Menu;
    };

    // options 

    // Add share option to menu
    // open modal with url build by callback

    function copyToClipboard(str){
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
    Menu.addShare = function(cb){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            let url = cb();
            modal.reset()
                .setTitle('Share View')
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            let modalCore = modal.getModalBody();
            modalCore.append('div').classed('text', true)
                .append('p')
                .text('To share this view, copy the url below:');
            let actionCore = modalCore.append('div').classed('actionText', true);
            actionCore.append('p').text(url);
            let copyButton = actionCore.append('button')
                .classed('btn', true)
                .text('Copy')
                .attr('data-tippy-content', 'Copied URL!')
                .on('click', ()=>{
                    copyToClipboard(url);
                });
            Tippy(copyButton.node(),{
                theme:'dark',
                duration: [500, 0],
                trigger: 'click'
            });
            modal.toggleModal(true);
        }).append('a').text('Share View');
        return Menu;
    };


    // Add take screenshot option to menu
    // clone specified element, fix style issue
    // render in html canvas
    // save as png, and delete clone
    // function cloneElem(elId){
    //     let clone = document.querySelector(elId);//.cloneNode(true);
    //     // document.body.append(clone);
    //     // clone.style.padding = 20;
    //     return clone;
    // }
    // function setInlineStyles(targetElem) {
    //     const transformProperties = [
    //         'fill',
    //         'color',
    //         'font-size',
    //         'stroke',
    //         'font',
    //         'text-anchor'
    //     ];
    //     let svgElems = Array.from(targetElem.getElementsByTagName('svg'));
    //     for (let svgElement of svgElems) {
    //         recurseElementChildren(svgElement);
    //     }
    //     function recurseElementChildren(node) {
    //         if (!node.style) return;
    //         let styles = getComputedStyle(node);
    //         for (let transformProperty of transformProperties) {
    //             node.style[transformProperty] = styles[transformProperty];
    //         }
    //         for (let child of Array.from(node.childNodes)) {
    //             recurseElementChildren(child);
    //         }
    //     }
    // }
    let formatTime = D3TimeFormat('%Y-%m-%d_%H-%M');
    Menu.addScreenshot = function(elId, timeout=1000){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            setTimeout(()=>{
                // let clone = cloneElem(elId);
                // setInlineStyles(clone);
                html2canvas(document.querySelector(elId)).then(canvas=>{
                    canvas.toBlob(function(blob){
                        FSSaveAs(blob, `SFL_TopicMap_${formatTime(new Date())}.png`);
                    });
                });
                // clone.remove();
            }, timeout);
        }).append('a').text('Take Screenshot');
        return Menu;
    };


    // Add a donwload data option to the menu
    // opens a modal with specified data
    // [{name,url}]
    Menu.addDownload = function(dlData){
        if(dlData.length > 0){
            let option = menuOptions.append('li');
            option.on('click', ()=>{
                modal.reset()
                    .setTitle('Download Data')
                    .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
                let modalCore = modal.getModalBody();
                modalCore.append('div').classed('text', true)
                    .append('p')
                    .text(`Click on the link${dlData.length>1?'s':''} below to download data:`);
                for(let dl of dlData){
                    let actionCore = modalCore.append('div').classed('actionText', true);
                    actionCore.append('button')
                        .classed('btn', true)
                        .classed('btn-lin', true)
                        .text(`Download ${dl.name}`)
                        .on('click', ()=>{
                            window.open(dl.url, '_blank');
                        });
                }
                modal.toggleModal(true);
            }).append('a').text('Download Data');
        }
        return Menu;
    };


    // Add link option to menu
    // opens link in new tab
    Menu.addLink = function(text, url, openNewTab=true){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            let target = openNewTab ? '_blank' : '_self';
            window.open(url, target);
        }).append('a').text(text);
        return Menu; 
    };


    // Add a chart modal option to menu
    // opens new modal with specified title and calls chart callbacks
    // chart callbacks have container, width, height params
    Menu.addCharts = function(title, chartsCB){
        let option = menuOptions.append('li');
        let w = window.innerWidth*0.8-20;
        option.on('click', ()=>{
            modal.reset()
                .setTitle(title)
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            chartsCB.forEach(cb=>{
                cb('div.modalBody', Math.min(800,w), Math.min(400,w/2));
            });
            modal.toggleModal(true);
        }).append('a').text(title);
        return Menu; 
    };


    // Add model info modal to menu options
    // info extracted from model metadata
    Menu.addModelInfo = function(mainMetadata, subMetadata=null, extraLines=[]){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            modal.reset()
                .setTitle('Model information')
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            let modalCore = modal.getModalBody();
            let mainText = modalCore.append('div').classed('text', true);
            // add document info (n docs in model, n docs exluded)
            let docRemoved = mainMetadata.nDocsTooShort == 0 ? '' : `, although ${mainMetadata.nDocsTooShort} were too short (less than ${mainMetadata.minDocSize} words) and therefore excluded`;
            mainText.append('p')
                .html(`The topics were extracted from <b>${mainMetadata.totalDocs}</b> documents${docRemoved}.`);
            // add stop phrases used, if any
            if(has(mainMetadata, 'stopPhrases') && mainMetadata.stopPhrases.length > 0){
                let plural = mainMetadata.stopPhrases.length > 1;
                mainText.append('p')
                    .html(`The following phrase${plural?'s were':' was'} removed from the documents:`);
                let l = mainText.append('ul');
                mainMetadata.stopPhrases.forEach(p=>{
                    l.append('li').html(`<i>"${p}"</i>`);
                });
            }
            // add stop word used
            mainText.append('p')
                .html('Common english words (e.g. articles, or prepositions) were removed from the documents to prevent them from distorting the model.');
            // add custom stop words used
            if(has(mainMetadata, 'stopWords') && mainMetadata.stopWords.length > 0){
                let plural = mainMetadata.stopWords.length > 1;
                mainText.append('p')
                    .html(`The following word${plural?'s were':' was'} judged too generic in this document set, and therefore also removed:`);
                mainText.append('p').html(mainMetadata.stopWords.map(w=>`<i>${w}</i>`).join(', '));
            }
            // check if hierarchical model
            let hModel = subMetadata !== null;
            // add n topics in main model (adapt if only model)
            mainText.append('p')
                .html(`The ${hModel?'main':''} model has <b>${mainMetadata.nTopics}</b> topics.`);
            // add detail about sub model if hierarchy made
            if(hModel){
                mainText.append('p')
                    .html(`The sub model has <b>${subMetadata.nTopics}</b> topics.`);
            }
            // add disclaimer about multi-modality
            mainText.append('p')
                .html(`Note that th${hModel?'ese':'is'} model${hModel?'s are':' is'} only representing one instance of many possible models.`);
            // add any extra specified
            extraLines.forEach(l=>{
                mainText.append('p').html(l);
            });
            modal.toggleModal(true);
        }).append('a').text('Model information');
        return Menu; 
    };


    // Add a simple text modal to menu option
    // specify title and content (in html)
    Menu.addModal = function(title, htmlContent){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            modal.reset()
                .setTitle(title)
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            let modalCore = modal.getModalBody();
            let mainText = modalCore.append('div').classed('text', true);
            mainText.html(htmlContent);
            modal.toggleModal(true);
        }).append('a').text(title);
        return Menu;
    };

    return Menu;
}