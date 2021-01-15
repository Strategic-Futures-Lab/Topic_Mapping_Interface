
import {select as D3Select} from 'd3-selection';
import {timeFormat as D3TimeFormat} from 'd3-time-format';
import Modal from './Modal.js';
import '../../styles/FloatingMenu.less';
import Tippy from 'tippy.js';
import html2canvas from 'html2canvas';
import {saveAs as FSSaveAs} from 'file-saver';
import LineChart from '../views/LineChart.js';

export default function(container='body', buttonSize=50){

    let FloatingMenu = {};

    FloatingMenu.setSize = function(w, h){
        menuButtonSize = Math.max(30, h);
        resizeButton();
        return FloatingMenu;
    };

    const modal = Modal('body');

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    FloatingMenu.addShareView = function(cb){
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
        return FloatingMenu;
    };

    function cloneElem(elId){
        let clone = document.querySelector(elId).cloneNode(true);
        document.body.append(clone);
        return clone;
    }

    function setInlineStyles(targetElem) {
        const transformProperties = [
            'fill',
            'color',
            'font-size',
            'stroke',
            'font',
            'text-anchor'
        ];
        let svgElems = Array.from(targetElem.getElementsByTagName('svg'));
        for (let svgElement of svgElems) {
            recurseElementChildren(svgElement);
        }
        function recurseElementChildren(node) {
            if (!node.style) return;
            let styles = getComputedStyle(node);
            for (let transformProperty of transformProperties) {
                node.style[transformProperty] = styles[transformProperty];
            }
            for (let child of Array.from(node.childNodes)) {
                recurseElementChildren(child);
            }
        }
    }

    let formatTime = D3TimeFormat('%Y-%m-%d_%H-%M');

    FloatingMenu.addTakeScreenshot = function(elId, timeout=500){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            setTimeout(()=>{
                let clone = cloneElem(elId);
                setInlineStyles(clone);
                html2canvas(clone).then(canvas=>{
                    canvas.toBlob(function(blob){
                        FSSaveAs(blob, `SFL_TopicMap_${formatTime(new Date())}.png`);
                    });
                });
                clone.remove();
            }, timeout);
        }).append('a').text('Take Screenshot');
        return FloatingMenu;
    };


    FloatingMenu.addDownloadData = function(dlData){
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
        return FloatingMenu;
    };

    FloatingMenu.addLink = function(text, url, openNewTab=true){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            let target = openNewTab ? '_blank' : '_self';
            window.open(url, target);
        }).append('a').text(text);
        return FloatingMenu; 
    };

    FloatingMenu.addLLChart = function(mainLL, subLL = null){
        let option = menuOptions.append('li');
        let hModel = subLL!==null;
        let w = window.innerWidth*0.8-20;
        option.on('click', ()=>{
            modal.reset()
                .setTitle(`Model${hModel?'s':''} log-likelihood`)
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            let modalCore = modal.getModalBody();
            let mainText = modalCore.append('div').classed('text', true);
            if(hModel){
                mainText.append('h3')
                    .text('Main model');
            }
            mainText.append('p')
                .html(`Number of iterations: <b>${mainLL.nIter}</b>  -  Final Log-Likelihood: <b>${mainLL.LL}</b>`);
            LineChart('div.modalBody', Math.min(800,w), Math.min(400,w/2), 50, 20)
                .setAxesNames('Iteration','Log-Likelihood')
                .render(mainLL.entries.map(d=>{return{x:d.iter,y:d.LL};}));
            if(hModel){
                let subText = modalCore.append('div').classed('text', true);
                subText.append('h3')
                    .text('Sub model');
                subText.append('p')
                    .html(`Number of iterations: <b>${subLL.nIter}</b>  -  Final Log-Likelihood: <b>${subLL.LL}</b>`);
                LineChart('div.modalBody', Math.min(800,w), Math.min(400,w/2), 50, 20)
                    .setAxesNames('Iteration','Log-Likelihood')
                    .render(subLL.entries.map(d=>{return{x:d.iter,y:d.LL};}));
            }
            modal.toggleModal(true);
        }).append('a').text(`Model${hModel?'s':''} log-likelihood`);
        return FloatingMenu; 
    };

    FloatingMenu.addModelInfo = function(mainMetadata, subMetadata=null, extraLines=[]){
        let option = menuOptions.append('li');
        option.on('click', ()=>{
            modal.reset()
                .setTitle('Model information')
                .setActions([{'name': 'Close', 'action': ()=>{modal.toggleModal(false);}, 'disabled': false, 'class': 'btn-inv'}]);
            let modalCore = modal.getModalBody();
            let mainText = modalCore.append('div').classed('text', true);
            let docRemoved = mainMetadata.nDocsTooShort == 0 ? '' : `, although ${mainMetadata.nDocsTooShort} were too short (less than ${mainMetadata.minDocSize} words) and therefore excluded`;
            mainText.append('p')
                .html(`The topics were extracted from <b>${mainMetadata.totalDocs}</b> documents${docRemoved}.`);
            if(mainMetadata.stopPhrases.length > 0){
                let plural = mainMetadata.stopPhrases.length > 1;
                mainText.append('p')
                    .html(`The following phrase${plural?'s were':' was'} removed from the documents:`);
                let l = mainText.append('ul');
                mainMetadata.stopPhrases.forEach(p=>{
                    l.append('li').html(`<i>"${p}"</i>`);
                });
            }
            mainText.append('p')
                .html('Common english words (e.g. articles, or prepositions) were removed from the documents to prevent them from distorting the model.');
            if(mainMetadata.stopWords.length > 0){
                let plural = mainMetadata.stopWords.length > 1;
                mainText.append('p')
                    .html(`The following word${plural?'s were':' was'} judged too generic in this document set, and therefore also removed:`);
                mainText.append('p').html(mainMetadata.stopWords.map(w=>`<i>${w}</i>`).join(', '));
            }
            let hModel = subMetadata !== null;
            // let w = options.showWords ? `their top <b>${mainMetadata.nWords}</b> labels` : null,
            //     d = options.showDocs ? `their top <b>${mainMetadata.nDocs}</b> documents` : null,
            //     details = w && d ? `${w} and ${d}` : w ? `${w}` : d ? `${d}` : null,
            //     detailsString = details ? `, each detailed with ${details}` : '';
            mainText.append('p')
                .html(`The ${hModel?'main':''} model has <b>${mainMetadata.nTopics}</b> topics.`);
            if(hModel){
                // let w = options.showWords ? `their top <b>${subMetadata.nWords}</b> labels` : null,
                //     d = options.showDocs ? `their top <b>${subMetadata.nDocs}</b> documents` : null,
                //     details = w && d ? `${w} and ${d}` : w ? `${w}` : d ? `${d}` : null,
                //     detailsString = details ? `, each detailed with ${details}` : '';
                mainText.append('p')
                    .html(`The sub model has <b>${subMetadata.nTopics}</b> topics.`);
            }
            mainText.append('p')
                .html(`Note that th${hModel?'ese':'is'} model${hModel?'s are':' is'} only representing one instance of many possible models.`);
            extraLines.forEach(l=>{
                mainText.append('p').html(l);
            });
            modal.toggleModal(true);
        }).append('a').text('Model information');
        return FloatingMenu; 
    };

    FloatingMenu.addModal = function(title, htmlContent){
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
        return FloatingMenu;
    };

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
    // for(let i=0; i<5; i++){
    //     menuOptions.append('li').append('a').text(`Option${i}`);
    // }

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

    resizeButton();

    return FloatingMenu;
}