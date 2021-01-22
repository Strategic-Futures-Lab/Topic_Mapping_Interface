import Visualisation from './visUtils/Visualisation';

import {select as D3Select} from 'd3-selection';
import 'd3-transition';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {scaleLinear as D3ScaleLinear,
    scaleBand as D3ScaleBand} from 'd3-scale';
import {max as D3Max} from 'd3-array';
import Tippy from 'tippy.js';

import '../../styles/vis/BarChart.less';

export default function(container='body', width=800, height=600){

    let VerBarChart = Visualisation(container, width, height, 'barchart');
    
    // private

    let nTicks = 10;
    let tickFormat = null;
    let maxYValue = -1;
    let duration = 100,
        delay = 50;

    let tooltipFunction = null,
        tooltipChart = null,
        barTooltips = [];

    let barClickCB = null;

    let svg = VerBarChart._svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${VerBarChart._canvas.l},${VerBarChart._canvas.t})`);

    let xScale = D3ScaleBand().padding(0.2),
        yScale = D3ScaleLinear();
    let yAxis = svg.append('g').attr('transform', 'translate(0,0)'),
        xAxis = svg.append('g').attr('transform', `translate(0,${VerBarChart._canvas.iH})`);

    let barGroup = svg.append('g').classed('bars', true);

    function render(serie){

        xScale.domain(serie.map(d=>d.key))
            .range([ 0, VerBarChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${VerBarChart._canvas.iH})`)
            .call(D3AxisBottom(xScale));

        yScale.domain([0, (maxYValue === -1 ? D3Max(serie, d=>d.value) : maxYValue)])
            .range([ VerBarChart._canvas.iH, 0 ]);
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale).ticks(nTicks, tickFormat));

        let bars = barGroup.selectAll('rect.bar')
            .data(serie, d=>d.key);
        bars.exit().transition()
            .duration(duration)
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
        bars.transition()
            .duration(duration)
            .attr('x', d=>xScale(d.key))
            .attr('width', ()=>xScale.bandwidth())
            .delay((d,i)=>{return i*delay;})
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>VerBarChart._canvas.iH-yScale(d.value));
    }

    function attachCallbacks(){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .on('click', barClickCB)
            .on('touch', barClickCB)
            .on('mouseover', function(){
                D3Select(this).classed('highlight', true);
            })
            .on('mouseout', function(){
                D3Select(this).classed('highlight', false);
            });
    }

    function setBarTooltips(){
        // destroy previous tooltips
        barTooltips.forEach(t=>t.destroy());

        let bars = barGroup.selectAll('rect.bar');
        bars.attr('data-tippy-content', (d,i) =>{
            if(tooltipFunction !== null){
                return tooltipFunction(d,i);
            }
        });
       
        // if tooltips defined, register them in bubbleTooltips
        if(tooltipFunction !== null || tooltipChart !== null){
            barTooltips = Tippy(bars.nodes(),{
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

    VerBarChart._onResize = ()=>{
        svg.attr('transform', `translate(${VerBarChart._canvas.l},${VerBarChart._canvas.t})`);

        let bars = barGroup.selectAll('rect.bar');

        yScale.range([ VerBarChart._canvas.iH, 0 ]);
        yAxis.attr('transform', 'translate(0,0)');
  
        xScale.range([ 0, VerBarChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${VerBarChart._canvas.iH})`);

        if(bars.data().length > 0){
            xAxis.call(D3AxisBottom(xScale));
            yAxis.call(D3AxisLeft(yScale).ticks(nTicks, tickFormat));
        }

        bars.attr('x', d=>xScale(d.key))
            .attr('width', ()=>xScale.bandwidth())
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>VerBarChart._canvas.iH-yScale(d.value));

    };
    VerBarChart.setMargin([10, 20, 30, 10]);

    // public

    VerBarChart.setMarginLeft = function(v){
        VerBarChart._svgMargin[2] = v;
        VerBarChart._resize();
        return VerBarChart;
    };
    VerBarChart.setMarginBottom = function(v){
        VerBarChart._svgMargin[1] = v;
        VerBarChart._resize();
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
    VerBarChart.setTransition = function(du = 100, de = 50){
        duration = du;
        delay = de;
        return VerBarChart;
    };
    VerBarChart.setTooltip = function(f){
        tooltipFunction = f;
        setBarTooltips();
        return VerBarChart;
    };
    VerBarChart.setTooltipChart = function(f){
        tooltipChart = f;
        setBarTooltips();
        return VerBarChart;
    };
    VerBarChart.setClickCB = function(cb){
        barClickCB = cb;
        attachCallbacks();
        return VerBarChart;
    };
    VerBarChart.selectBar = function(selectKey = null){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .classed('selected', d=>d.key === selectKey);
        return VerBarChart;
    };
    // serie data:
    // [ {key:string,value:number}, ...]
    VerBarChart.render = function(serie){
        VerBarChart.toggleDefaultText();
        render(serie);
        return VerBarChart;
    };

    return VerBarChart;
}