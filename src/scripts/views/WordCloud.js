// "use strict"; // catches accidental global declarations
import {select as D3Select} from 'd3-selection';
import {scaleLinear as D3ScaleLinear} from 'd3-scale';
import {extent as D3Extent} from 'd3-array';
import D3Cloud from 'd3-cloud';
import Canvas from './utils/canvas';
import '../../styles/WordCloud.less';

export default function(container = 'body', width = 800, height = 600){

    let WordCloud = {};

    WordCloud.setWidth = function(w){
        width = w;
        resize();
        return WordCloud;
    };
    WordCloud.setHeight = function(h){
        height = h;
        resize();
        return WordCloud;
    };
    WordCloud.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return WordCloud;
    };
    WordCloud.setMargin = function(m){
        margin = m;
        resize();
        return WordCloud;
    };
    WordCloud.toggleBorder = function(bool){
        svgBorderThickness = bool ? 1 : 0;
        resize();
        return WordCloud;
    };
    WordCloud.addDefaultText = function(string, scale=null, blinking=false){
        defaultText = svg.append('text')
            .classed('defaultText', true)
            .classed('blinking', blinking)
            .text(string);
        center(scale);
        return WordCloud;
    };
    WordCloud.setTextSizeRange = function(range = [10,25]){
        textSizeRange = range;
        return WordCloud;
    };
    WordCloud.setMaxNumberLabels = function(n = 50){
        maxNLabels = n;
        return WordCloud;
    };
    // INPUT LABELS: [{'label','weight'}]
    WordCloud.render = function(labels){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
        }
        render(labels);
        return WordCloud;
    };
    WordCloud.highlightTexts = function(labels){
        highlightTexts(labels);
        return WordCloud;
    };
    WordCloud.highlightTextsOpacity = function(labels){
        highlightTextsOpacity(labels);
        return WordCloud;
    };
    WordCloud.setWordClick = function(f){
        wordClick = f;
        return WordCloud;
    };
    WordCloud.setWordMouseover = function(cbOver, cbOut){
        wordMouseover = cbOver;
        wordMouseout = cbOut;
        return WordCloud;
    };
    WordCloud.toggleButton = function(pos, t=null, cb=null){
        toggleButton(pos,t,cb);
        return WordCloud;
    };
    WordCloud.toggleTitle = function(t=null, pos='T'){
        toggleTitle(t,pos);
        return WordCloud;
    };

    let svgWidth = width,
        svgHeight = height,
        margin = [10, 10, 10, 10],
        svgBorderThickness = 1,
        canvas = Canvas(svgWidth, svgHeight, margin);

    let textScale = D3ScaleLinear(),
        textSizeRange = [10, 25],
        maxNLabels = 50;

    let svgTop = D3Select(container).append('svg')
        .classed('wordcloud', true)
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    let svg = svgTop.append('g')
        .classed('texts', true)
        .attr('transform', `translate(${canvas.c},${canvas.m})`);
    
    let buttonTR = svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(${canvas.w-5},5)`);
    
    let buttonBR = svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(${canvas.w-5},${canvas.h-5})`);
    
    let buttonTL = svgTop.append('g')
        .classed('button', true)
        .attr('transform', 'translate(5,5)');
    
    let buttonBL = svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(5,${canvas.h-5})`);
    
    let title = svgTop.append('text')
        .data([{text:null,position:'t'}])
        .classed('title', true);

    let defaultText = null;

    let wordClick = null,
        wordMouseover = null,
        wordMouseout = null;

    let capitalizeString = str => str.charAt(0).toUpperCase()+str.slice(1);

    function render(labels){
        textScale.domain(D3Extent(labels, l=>l.weight))
            .range(textSizeRange);

        // cloning data because wordcloud layout will modify it;
        let labelsData = labels.filter((d,i)=>{return i<maxNLabels;}).map(label=>{
            return {t:label.label, s:label.weight};
        });
        
        D3Cloud()
            .size([canvas.iW, canvas.iH])
            .words(labelsData)
            .rotate(0)
            .fontSize(d=>textScale(d.s))
            .text(d=>capitalizeString(d.t))
            .spiral('archimedean')
            .padding(2)
            .font('\'Open Sans\', sans-serif')
            .random(()=>0.5)
            .on('end', draw)
            .start();

        function draw(){
            let texts = svg.selectAll('text.label').data(labelsData);
            texts.exit().remove();
            texts.enter().append('text')
                .classed('label', true)
                .merge(texts)
                .style('font-size', d=>`${d.size}px`)
                .attr('transform', d=>`translate(${d.x},${d.y})rotate(${d.rotate})`)
                .text(d=>d.text)
                .style('cursor', wordClick?'pointer':'normal')
                .on('click', wordClick)
                .on('mouseover', wordMouseover)
                .on('mouseout', wordMouseout);
        }
        center();
    }

    function highlightTexts(labels){
        svg.selectAll('text.label')
            .classed('highlighted', d=>{
                return labels.indexOf(d.text.toLowerCase()) > -1; 
            });
    }

    function highlightTextsOpacity(labels){
        if(labels.length == 0){
            svg.selectAll('text.label')
                .classed('lowerOpacity', false);
        } else {
            svg.selectAll('text.label')
                .classed('lowerOpacity', d=>{
                    return labels.indexOf(d.text.toLowerCase()) < 0;
                });
        }
    }

    function toggleButton(position=null, text=null, callback=null){
        if(position!==null){
            let button = position === 'BR' ? buttonBR :
                position === 'BL' ? buttonBL :
                    position === 'TL' ? buttonTL :
                        buttonTR;
            if(text == null){
                button.select('rect').remove();
                button.select('text').remove();
                button.on('click', null);
            } else {
    
                let rectEl = button.selectAll('rect').data([text]);
                rectEl.enter().append('rect');
    
                let textEl = button.selectAll('text').data([text]);
                textEl.enter().append('text');
                textEl = button.selectAll('text')
                    .text(text)
                    .style('font-size', '16px')
                    .attr('dy', `${position.startsWith('T')?'20':'-10'}`)
                    .attr('dx', `${position.endsWith('L')?'':'-'}5`)
                    .style('text-anchor', `${position.endsWith('L')?'start':'end'}`);
                let {width, height} = textEl.node().getBBox();

                rectEl = button.selectAll('rect')
                    .attr('x',  position.endsWith('L') ? 0 : -width-10)
                    .attr('y', position.startsWith('T') ? 0 : -height-8)
                    .attr('width', width+10)
                    .attr('height', height+8)
                    .attr('rx', 2);
                
                button.on('click', callback);
            }
        }
    }

    function toggleTitle(text=null, position='T'){
        if(text==null){
            title.text('');
        } else {
            title.data([{text,position}]);

            title.text(d=>d.text)
                .style('font-size', '20px')
                .attr('transform', d=>`translate(${canvas.c},${d.position=='B'?canvas.h-15:25})`);
        }
    }

    function resize(){
        svgWidth = width - svgBorderThickness*2;
        svgHeight = height - svgBorderThickness*2;

        canvas = Canvas(svgWidth, svgHeight, margin);

        svgTop.attr('width', canvas.w)
            .attr('height', canvas.h)
            .style('border-width', svgBorderThickness);
        svg.attr('transform', `translate(${canvas.c},${canvas.m})`);

        buttonTR.attr('transform', `translate(${canvas.w-5},5)`);
        buttonBR.attr('transform', `translate(${canvas.w-5},${canvas.h-5})`);
        buttonTL.attr('transform', 'translate(5,5)');
        buttonBL.attr('transform', `translate(5,${canvas.h-5})`);

        title.attr('transform', d=>`translate(${canvas.c},${d.position=='b'?canvas.h-15:25})`);
        center();
    }

    function center(forcedScale=null){
        let svgSize = svg.node().getBBox(),
            w = svgSize.width,
            h = svgSize.height;
        if(w > 0 && h > 0){
            let rX = svgWidth/w,
                rY = svgHeight/h;
            // let s = forcedScale == null ? Math.min(rX, rY)-0.1 : forcedScale;
            let s = forcedScale == null ? Math.max(1,Math.min(rX, rY)-0.2) : forcedScale;
            // s = 1;
            // svg.attr('transform', `translate(${svgWidth/2},${svgHeight/2})scale(${s})`);
            svg.attr('transform', `translate(${canvas.c},${canvas.m})scale(${s})`);
        }
    }

    resize();

    return WordCloud;
}