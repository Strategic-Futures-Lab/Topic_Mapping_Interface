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

    let HorBarChart = Visualisation(container, width, height, 'barchart');
    
    // private

    let nTicks = 10;
    let tickFormat = null;
    let maxXValue = -1;
    let duration = 100,
        delay = 50;

    let tooltipFunction = null,
        tooltipChart = null,
        barTooltips = [];

    let barClickCB = null;

    let svg = HorBarChart._svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${HorBarChart._canvas.l},${HorBarChart._canvas.t})`);

    let yScale = D3ScaleBand().padding(0.2),
        xScale = D3ScaleLinear();
    let yAxis = svg.append('g').classed('scale',true).attr('transform', 'translate(0,0)'),
        xAxis = svg.append('g').classed('scale',true).attr('transform', `translate(0,${HorBarChart._canvas.iH})`);

    let barGroup = svg.append('g').classed('bars', true);

    function render(serie){

        yScale.domain(serie.map(d=>d.key))
            .range([ 0, HorBarChart._canvas.iH ]);
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale));

        xScale.domain([0, (maxXValue === -1 ? D3Max(serie, d=>d.value) : maxXValue)])
            .range([0, HorBarChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${HorBarChart._canvas.iH})`)
            .call(D3AxisBottom(xScale).ticks(nTicks, tickFormat));

        let bars = barGroup.selectAll('rect.bar')
            .data(serie, d=>d.key);
        bars.exit().transition()
            .duration(duration)
            .attr('width', ()=>0)
            .remove();
        bars.enter().append('rect')
            .classed('bar', true)
            .attr('y', d=>yScale(d.key))
            .attr('x', ()=>xScale(0))
            .attr('width', ()=>0)
            .attr('height', ()=>yScale.bandwidth());
        bars = barGroup.selectAll('rect.bar');
        bars.transition()
            .duration(duration)
            .attr('y', d=>yScale(d.key))
            .attr('height', ()=>yScale.bandwidth())
            .delay((d,i)=>{return i*delay;})
            .attr('width', d=>xScale(d.value));
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

    HorBarChart._onResize = ()=>{
        svg.attr('transform', `translate(${HorBarChart._canvas.l},${HorBarChart._canvas.t})`);

        let bars = barGroup.selectAll('rect.bar');

        yScale.range([ 0, HorBarChart._canvas.iH ]);
        yAxis.attr('transform', 'translate(0,0)');
  
        xScale.range([ 0, HorBarChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${HorBarChart._canvas.iH})`);

        if(bars.data().length > 0){
            xAxis.call(D3AxisBottom(xScale).ticks(nTicks, tickFormat));
            yAxis.call(D3AxisLeft(yScale));
        }

        bars.attr('y', d=>yScale(d.key))
            .attr('x', ()=>xScale(0))
            .attr('height', ()=>yScale.bandwidth())
            .attr('width', d=>xScale(d.value));

    };
    HorBarChart.setMargin([10, 20, 30, 10]);

    // public

    HorBarChart.setMarginLeft = function(v){
        HorBarChart._svgMargin[2] = v;
        HorBarChart._resize();
        return HorBarChart;
    };
    HorBarChart.setMarginBottom = function(v){
        HorBarChart._svgMargin[1] = v;
        HorBarChart._resize();
        return HorBarChart;
    };
    HorBarChart.setTicks = function(n = 10, format = null){
        nTicks = n;
        tickFormat = format;
        return HorBarChart;
    };
    HorBarChart.setMaxValue = function(v){
        maxXValue = v;
        return HorBarChart;
    };
    HorBarChart.setTransition = function(du = 100, de = 50){
        duration = du;
        delay = de;
        return HorBarChart;
    };
    HorBarChart.setTooltip = function(f){
        tooltipFunction = f;
        setBarTooltips();
        return HorBarChart;
    };
    HorBarChart.setTooltipChart = function(f){
        tooltipChart = f;
        setBarTooltips();
        return HorBarChart;
    };
    HorBarChart.setClickCB = function(cb){
        barClickCB = cb;
        attachCallbacks();
        return HorBarChart;
    };
    HorBarChart.selectBar = function(selectKey = null){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .classed('selected', d=>d.key === selectKey);
        return HorBarChart;
    };
    // serie data:
    // [ {key:string,value:number}, ...]
    HorBarChart.render = function(serie){
        HorBarChart.toggleDefaultText();
        render(serie);
        return HorBarChart;
    };

    return HorBarChart;
}