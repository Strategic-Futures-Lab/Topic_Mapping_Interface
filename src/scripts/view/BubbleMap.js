import Visualisation from './visUtils/Visualisation';

import {select as D3Select} from 'd3-selection';
import {scaleLinear as D3ScaleLinear,
    scaleLog as D3ScaleLog} from 'd3-scale';
import {min as D3Min, max as D3Max} from 'd3-array';
import Tippy from 'tippy.js';

import '../../styles/vis/BubbleMap.less';

export default function(container = 'body', width = 800, height = 600){

    let BubbleMap = Visualisation(container, width, height, 'bubblemap');

    // private

    // text size info
    let minTextSize = 1;
    // opacity range values
    let opacityMinV = 0.2,
        opacityClampR = 1,
        opacityScaleType = 'linear';
    // callbacks
    let bubbleClickCB = null;
    let tooltipFunction = null;
    let tooltipChart = null;
    // tooltip nodes
    let bubbleTooltips = [];

    // map group
    let svg = BubbleMap._svgTop.append('g')
        .classed('elements', true)
        .attr('transform', `translate(${BubbleMap._canvas.c},${BubbleMap._canvas.m})`); 
    // bubble group
    let bubbleGroup = svg.append('g')
        .classed('bubbles', true);
    // bubble border group
    let borderGroup = svg.append('g')
        .classed('borders', true);

    // to capitalise a string
    let capitalizeString = str => str.charAt(0).toUpperCase()+str.slice(1);

    // main drawing function
    function drawBubbleMap(dataset){

        let bubblesData = dataset.topics,
            bordersData = dataset.bubbleMapBorder;
            
        let [xScale, yScale] = getPositionScale(bubblesData); 

        // Draw Borders
        let borders = borderGroup.selectAll('path.border')
            .data(bordersData);
        borders.exit().remove();
        borders.enter().append('path').classed('border',true);
        borders = borderGroup.selectAll('path.border');
        borders.attr('d', arc=>arc.d)
            .style('stroke-width', arc=>arc.strokeWidth)
            .attr('transform', arc=>{
                let coords = arc.transform.split('translate(')[1],
                    x = parseFloat(coords.split(',')[0]),
                    y = parseFloat(coords.split(',')[1].split(')')[0]);
                return `translate(${xScale(x)},${yScale(y)})`;
            });

        // Draw Bubbles
        let bubbles = bubbleGroup.selectAll('g.bubble')
            .data(bubblesData);
        bubbles.exit().remove();
        let bubblesEnter = bubbles.enter().append('g').classed('bubble', true);
        bubblesEnter.append('circle');
        bubblesEnter.append('g').classed('labels', true);
        bubbles = bubbleGroup.selectAll('g.bubble');
        let circles = bubbles.select('circle');
        let texts = bubbles.select('g.labels');

        // draw the bubble group
        bubbles.classed('selected', false)
            .classed('highlighted', false)
            .attr('transform', d=>`translate(${xScale(d.bubbleMap.cx)},${yScale(d.bubbleMap.cy)})`);
        
        // draw the bubble circle
        circles.attr('r', d=>d.bubbleMap.r);

        // draw the bubble texts
        let labels = texts.selectAll('text.label')
            .data(d=>d.labels.slice(0,5).map(e=>{return [capitalizeString(e.label),d.bubbleMap.r];}));
        labels.enter().append('text').classed('label',true);
        labels = texts.selectAll('text.label');
        labels.attr('font-size', (d,i)=>{
            return i === 1 || i === 2 ? Math.max(d[1]/3-2, minTextSize+1) :
                i === 3 || i === 4 ? Math.max(d[1]/3-4, minTextSize) :
                    Math.max(d[1]/3, minTextSize+2);
        })
            .attr('dy', (d,i)=>{
                return i === 3 ? d[1]/-1.7 :
                    i === 1 ? d[1]/-4.3 :
                        i === 0 ? d[1]/8.6 :
                            i === 2 ? d[1]/2.2 :
                                d[1]/1.3;
            })
            .text(d=>d[0]);

        // Attaching the callbacks
        attachCallbacks();
        // Setting the tooltips
        setBubbleTooltips();
        
        // Centering Bubble Map
        centerBubbleMap();
    }

    /**
     * Provided the map position data [{cx,cy,r}] computes the scales
     * to have the bubbles positioned somewhat centered around a 0,0 coordinate
     */
    function getPositionScale(bubblesData){
        let xMin = D3Min(bubblesData, d => {
                return d.bubbleMap.cx - d.bubbleMap.r;
            }),
            xMax = D3Max(bubblesData, d => {
                return d.bubbleMap.cx + d.bubbleMap.r;
            }),
            yMin = D3Min(bubblesData, d => {
                return d.bubbleMap.cy - d.bubbleMap.r;
            }),
            yMax = D3Max(bubblesData, d => {
                return d.bubbleMap.cy + d.bubbleMap.r;
            }),
            xRange = xMax - xMin,
            yRange = yMax - yMin;
        let xScale = D3ScaleLinear()
            .domain([xMin, xMax])
            .range([-xRange/2, xRange/2]);
        let yScale = D3ScaleLinear()
            .domain([yMin, yMax])
            .range([-yRange/2, yRange/2]);
        return [xScale, yScale];
    }

    // attaches the click callback to the bubbles
    function attachCallbacks(){
        let bubbles = bubbleGroup.selectAll('g.bubble');

        bubbles.on('click', bubbleClickCB)
            .on('touch', bubbleClickCB);
    }

    // sets the bubbles tooltips, text and chart
    function setBubbleTooltips(){
        // destroy previous tooltips
        bubbleTooltips.forEach(t=>t.destroy());

        let bubbles = bubbleGroup.selectAll('g.bubble');
        bubbles.attr('data-tippy-content', (d,i) =>{
            if(tooltipFunction !== null){
                return tooltipFunction(d,i);
            }
        });
       
        // if tooltips defined, register them in bubbleTooltips
        if(tooltipFunction !== null || tooltipChart !== null){
            bubbleTooltips = Tippy(bubbles.nodes(),{
                theme: tooltipFunction !== null ? 'dark' : 'light',
                duration: [500, 0],
                allowHTML: true,
                onShow(t){
                    if(tooltipChart !== null){
                        let d = D3Select(t.reference).datum();
                        tooltipChart(t.popper, d);
                    }
                },
                onHidden(t){
                    // remove any svg created
                    D3Select(t.popper).select('svg').remove();
                }
            });
        }
    }

    // centers the bubble map inside the svg
    function centerBubbleMap(){
        let svgSize = svg.node().getBBox(),
            w = svgSize.width,
            h = svgSize.height;
        if(w > 0 && h > 0){
            let rX = BubbleMap._canvas.iW/w,
                rY = BubbleMap._canvas.iH/h;
            let s = Math.min(rX, rY);
            svg.attr('transform', `scale(${s}) translate(${BubbleMap._canvas.c/s},${BubbleMap._canvas.m/s})`);
        }
    }

    // sets the opacity of bubbles given a distribution
    function setBubblesOpacity(distributionData, reset){
        let opacityScale = opacityScaleType == 'log' ? D3ScaleLog() : D3ScaleLinear();
        opacityScale.domain([0,D3Max(distributionData, d=>d.value)*opacityClampR])
            .range([opacityMinV, 1])
            .clamp(true);
        bubbleGroup.selectAll('g.bubble')
            .style('opacity', d=>{
                if(reset){return 1;}
                return opacityScale(distributionData.filter(e=>{return e.key == d.topicId;})[0].value);
            });
    }

    // set the resize specificity
    BubbleMap._onResize = ()=>{
        // svg.attr('transform', `translate(${BubbleMap._canvas.c},${BubbleMap._canvas.m})`);
        centerBubbleMap();
    };

    // public

    BubbleMap.render = function(dataset){
        BubbleMap._removeDefaultText();
        drawBubbleMap(dataset);
        return BubbleMap;
    };
    BubbleMap.setBubbleClick = function(cb){
        bubbleClickCB = cb;
        attachCallbacks();
        return BubbleMap;
    };
    BubbleMap.selectBubble = function(topicId = null, idAccessor = d=>d.topicId){
        bubbleGroup.selectAll('g.bubble')
            .classed('selected', d=>idAccessor(d) === topicId ? true : false);
        return BubbleMap;
    };
    BubbleMap.highlightBubbles = function(topicIds = [], idAccessor = d=>d.topicId){
        bubbleGroup.selectAll('g.bubble')
            .classed('highlighted', d=>topicIds.indexOf(idAccessor(d)) > -1);
        return BubbleMap;
    };
    BubbleMap.setBubblesOpacity = function(distributionData, reset = false){
        setBubblesOpacity(distributionData, reset);
        return BubbleMap;
    };
    BubbleMap.setOpacityScale = function(minValue = 0.2, clampRatio = 1, scaleType = 'linear'){
        opacityMinV = minValue;
        opacityClampR = clampRatio;
        opacityScaleType = scaleType;
        return BubbleMap;
    };
    BubbleMap.setTooltip = function(f){
        tooltipFunction = f;
        setBubbleTooltips();
        return BubbleMap;
    };
    BubbleMap.setTooltipChart = function(f){
        tooltipChart = f;
        setBubbleTooltips();
        return BubbleMap;
    };
    BubbleMap.setMinimumTextSize = function(s){
        minTextSize = s;
        return BubbleMap;
    };

    return BubbleMap;
}