import Visualisation from './utils/Visualisation';

import {scaleLinear as D3ScaleLinear} from 'd3-scale';
import {extent as D3Extent} from 'd3-array';
import D3Cloud from 'd3-cloud';

import '../../../styles/visualisations/WordCloud.less';

export default function(container = 'body', width = 800, height = 600){

    let WordCloud = Visualisation(container, width, height, 'wordcloud');

    // private

    // text size
    let textScale = D3ScaleLinear(),
        textSizeRange = [10, 25],
        maxNLabels = 50;
    // callbacks
    let wordClick;
    let wordMouseover;
    let wordMouseout;

    // wordcloud group
    let svg = WordCloud._svgTop.append('g')
        .classed('texts', true)
        .attr('transform', `translate(${WordCloud._canvas.c},${WordCloud._canvas.m})`);

    let capitalizeString = str => str.charAt(0).toUpperCase()+str.slice(1);

    function render(labels){
        textScale.domain(D3Extent(labels, l=>l.weight))
            .range(textSizeRange);

        let labelsData = labels.filter((d,i)=>{return i<maxNLabels;}).map(label=>{
            return {t:label.label, s:label.weight};
        });

        D3Cloud()
            .size([WordCloud._canvas.iW, WordCloud._canvas.iH])
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
                .text(d=>d.text);

            attachCallbacks();
            centerWordCloud();
        }
    }

    function centerWordCloud(){
        let svgSize = svg.node().getBBox(),
            w = svgSize.width,
            h = svgSize.height;
        if(w > 0 && h > 0){
            let rX = WordCloud._canvas.iW/w,
                rY = WordCloud._canvas.iH/h;
            // let s = forcedScale == null ? Math.min(rX, rY)-0.1 : forcedScale;
            let s = Math.max(1,Math.min(rX, rY)-0.2);
            // s = 1;
            // svg.attr('transform', `translate(${svgWidth/2},${svgHeight/2})scale(${s})`);
            svg.attr('transform', `translate(${WordCloud._canvas.c},${WordCloud._canvas.m})scale(${s})`);
        }
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

    function attachCallbacks(){
        svg.selectAll('text.label')
            .style('cursor', wordClick?'pointer':'normal')
            .on('click', wordClick)
            .on('mouseover', wordMouseover)
            .on('mouseout', wordMouseout);
    }

    WordCloud._onResize = ()=>{
        centerWordCloud();
    };

    // public

    WordCloud.render = function(labels){
        WordCloud._removeDefaultText();
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
        attachCallbacks();
        return WordCloud;
    };
    WordCloud.setWordMouseover = function(cbOver, cbOut){
        wordMouseover = cbOver;
        wordMouseout = cbOut;
        attachCallbacks();
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

    return WordCloud;
}