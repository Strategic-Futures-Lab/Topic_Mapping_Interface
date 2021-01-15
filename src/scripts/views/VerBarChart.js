import {select as D3Select} from 'd3-selection';
import {transition as D3Transition} from 'd3-transition';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {scaleLinear as D3ScaleLinear,
    scaleBand as D3ScaleBand} from 'd3-scale';
import {max as D3Max} from 'd3-array';
import Tippy from 'tippy.js';
import '../../styles/BarChart.less';

export default function(container = 'body', width = 800, height = 600, margL = 30, margB = 20){

    let VerBarChart = {};

    VerBarChart.setWidth = function(w){
        width = w;
        resize();
        return VerBarChart;
    };
    VerBarChart.setHeight = function(h){
        height = h;
        resize();
        return VerBarChart;
    };
    VerBarChart.setSize = function(w,h){
        width = w;
        height = h;
        resize();
        return VerBarChart;
    };
    VerBarChart.setMarginLeft = function(m){
        margins.left = m;
        resize();
        return VerBarChart;
    };
    VerBarChart.setMarginBottom = function(m){
        margins.bottom = m;
        resize();
        return VerBarChart;
    };
    VerBarChart.toggleBorder = function(bool){
        svgBorderThickness = bool ? 1 : 0;
        resize();
        return VerBarChart;
    };
    VerBarChart.setTicks = function(n = 10, format = null){
        nTicks = n;
        tickFormat = format;
        return VerBarChart;
    };
    VerBarChart.setMaxValue = function(v){
        maxYValue = v;
        return VerBarChart;
    };
    VerBarChart.setTransition = function(du){
        duration = du;
        return VerBarChart;
    };
    VerBarChart.addDefaultText = function(string, scale=null, blinking=false){
        defaultText = svg.append('text')
            .classed('defaultText', true)
            .classed('blinking', blinking)
            .attr('transform', `translate(${svgWidth/2-margins.left},${svgHeight/2-margins.top})scale(${scale!=null?scale:1})`)
            .text(string);
        // center(scale);
        return VerBarChart;
    };

    // serie data:
    // [ {key:string,value:number}, ...]
    VerBarChart.render = function(serie){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
        }
        render(serie);
        return VerBarChart;
    };
    VerBarChart.setTooltip = function(f){
        tooltipFunction = f;
        return VerBarChart;
    };
    VerBarChart.setClickCB = function(cb){
        barClickCB = cb;
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .on('click', cb);
        return VerBarChart;
    };
    VerBarChart.selectBar = function(selectKey = null){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .classed('selected', d=>d.key === selectKey);
        return VerBarChart;
    };

    let svgWidth = width,
        svgHeight = height,
        margins = {top: 10, right:10, left: margL, bottom: margB},
        svgBorderThickness = 1;

    let maxYValue = -1;

    let duration = 0,
        delay = 10;

    let svgTop = D3Select(container).append('svg')
        .classed('barChart', true)
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    let svg = svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margins.left},${margins.top})`);

    let xScale = D3ScaleBand()
            .padding(0.2),
        yScale = D3ScaleLinear();

    let xAxis = svg.append('g')
            .attr('transform', `translate(0,${svgHeight-margins.bottom})`),
        nTicks = 10, tickFormat = null,
        yAxis = svg.append('g')
            .attr('transform', 'translate(0,0)');

    let barGroup = svg.append('g').classed('bars', true);

    let barClickCB = null;
    let tooltipFunction = null;
    let barTooltips = [];
    
    let defaultText = null;

    function render(serie){

        barTooltips.forEach(t=>t.destroy());

        xScale.domain(serie.map(d=>d.key))
            .range([ 0, svgWidth-margins.left-margins.right ]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`)
            .call(D3AxisLeft(xScale));
  
        yScale.domain([0, (maxYValue === -1 ? D3Max(serie, d=>d.value) : maxYValue)])
            .range([svgHeight-margins.top-margins.bottom, 0 ]);
        yAxis.attr('transform', `translate(0,0)`)
            .call(D3AxisBottom(yScale).ticks(nTicks, tickFormat));

        let t1 = D3Transition().duration(duration);

        let bars = barGroup.selectAll('rect.bar')
            .data(serie, d=>d.key);
        bars.exit().transition(t1)
            .attr('y', ()=>yScale(0))
            .attr('height', ()=>0)
            .remove();
        bars.enter().append('rect')
            .classed('bar', true)
            .attr('y', ()=>yScale(0))
            .attr('x', d=>xScale(d.key))
            .attr('width', ()=>xScale.bandwidth())
            .attr('height', ()=>0);
        bars = barGroup.selectAll('rect.bar');
        bars.on('mouseover', function(){
            D3Select(this).classed('highlight', true);
        })
            .on('mouseout', function(){
                D3Select(this).classed('highlight', false);
            })
            .on('click', barClickCB)
            .on('touch', barClickCB)
            .attr('data-tippy-content', (d,i) =>{
                if(tooltipFunction !== null){
                    return tooltipFunction(d,i);
                }
            })
            .attr('x', d=>xScale(d.key))
            .attr('width', ()=>xScale.bandwidth())
            .transition(t1).delay((d,i)=>{return i*delay;})
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>svgHeight-margins.top-margins.bottom-yScale(d.value));
        
        if(tooltipFunction !== null){
            barTooltips = Tippy(bars.nodes(),{
                theme:'dark',
                duration: [500, 0],
                allowHTML: true
            });
        }
    }

    function resizeChart(){

        let bars = barGroup.selectAll('rect.bar')

        xScale.range([ 0, svgWidth-margins.left-margins.right ]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`)
  
        yScale.range([svgHeight-margins.top-margins.bottom, 0 ]);
        yAxis.attr('transform', `translate(0,0)`)

        if(bars.data().length > 0){
            xAxis.call(D3AxisLeft(xScale));
            yAxis.call(D3AxisBottom(yScale).ticks(nTicks, tickFormat));
        }
        
        bars.attr('x', d=>xScale(d.key))
            .attr('width', ()=>xScale.bandwidth())
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>svgHeight-margins.top-margins.bottom-yScale(d.value));
    }

    function resize(){
        svgWidth = width - svgBorderThickness*2;
        svgHeight = height - svgBorderThickness*2;

        svgTop.attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('border-width', svgBorderThickness);
        
        svg.attr('transform', `translate(${margins.left},${margins.top})`);
        resizeChart();
    }

    resize();

    return VerBarChart;
}