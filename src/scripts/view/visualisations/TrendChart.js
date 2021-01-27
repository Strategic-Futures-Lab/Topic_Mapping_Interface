import Visualisation from './utils/Visualisation';

import {timeParse as D3TimeParse,
    timeFormat as D3TimeFormat} from 'd3-time-format';
import {select as D3Select} from 'd3-selection';
import 'd3-transition';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {scaleLinear as D3ScaleLinear,
    scaleBand as D3ScaleBand} from 'd3-scale';
import {max as D3Max} from 'd3-array';
import {line as D3Line,
    curveBasis as D3CurveBasis} from 'd3-shape';
import Tippy from 'tippy.js';

import '../../../styles/visualisations/TrendChart.less';

export default function(container='body', width=800, height=600){

    let TrendChart = Visualisation(container, width, height, 'trendchart');

    // private

    let maxYValue = -1,
        nValueTicks = 10,
        valueTickFormat = '.2f',
        parseDate = null,
        formatDate = null;

    let duration = 100,
        delay = 50;

    let tooltipFunction = null,
        tooltipChart = null,
        barTooltips = [];

    let barClickCB = null;

    let svg = TrendChart._svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${TrendChart._canvas.l},${TrendChart._canvas.t})`);

    let xScale = D3ScaleBand().padding(0.2),
        yScale = D3ScaleLinear();

    let xAxis = svg.append('g').classed('scale', true)
        .attr('transform', `translate(0,${TrendChart._canvas.iH})`);
    let yAxis = svg.append('g').classed('scale', true)
        .attr('transform', 'translate(0,0)');

    let barGroup = svg.append('g').classed('bars', true),
        lineGroup = svg.append('g').classed('lines', true);

    function render(series){

        xScale.domain(series[0].map(d=>d.date))
            .range([ 0, TrendChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${TrendChart._canvas.iH})`)
            .call(D3AxisBottom(xScale).tickFormat(d=>formatDate(parseDate(d))));

        yScale.domain([ 0, (maxYValue === -1 ? D3Max(series, d=>D3Max(d, d2=>d2.value)) : maxYValue)])
            .range([ TrendChart._canvas.iH, 0 ]);
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale).ticks(nValueTicks, valueTickFormat));

        let barGroups = barGroup.selectAll('g.barGroup')
            .data(series);
        barGroups.exit().transition().duration(duration)
            .style('opacity', 0).remove();
        barGroups = barGroups.enter().append('g')
            .classed('barGroup', true)
            .merge(barGroups);

        let bars = barGroups.selectAll('rect.bar')
            .data(d=>d);
        bars.exit().transition().duration(duration)
            .attr('y', yScale(0)).attr('height', 0).remove();
        bars.enter().append('rect').classed('bar', true)
            .attr('y', yScale(0)).attr('height', 0)
            .merge(bars)
            .attr('x', d=>xScale(d.date)+(xScale.bandwidth()*(1-d.width)/2))
            .attr('width', d=>xScale.bandwidth()*d.width)
            .transition().duration(duration).delay((d,i)=>{return i*delay;})
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>TrendChart._canvas.iH-yScale(d.value));
    
        let lines  = lineGroup.selectAll('path.line')
            .data(series);
        lines.exit().transition().duration(duration)
            .attr('d', D3Line()
                .x(d=>xScale(d.date)+xScale.bandwidth()/2)
                .y(()=>yScale(0))
                .curve(D3CurveBasis)
            )
            .style('opacity', 0)
            .remove();
        lines.enter().append('path')
            .classed('line', true)
            .attr('d', D3Line()
                .x(d=>xScale(d.date)+xScale.bandwidth()/2)
                .y(()=>yScale(0))
                .curve(D3CurveBasis)
            )
            .merge(lines)
            .transition().duration(duration)
            .attr('d', D3Line()
                .x(d=>xScale(d.date)+xScale.bandwidth()/2)
                .y(d=>yScale(d.value))
                .curve(D3CurveBasis)
            );

        attachCallbacks();
        setBarTooltips();
    }

    function setBarTooltips(){
        barTooltips.forEach(t=>t.destroy());

        let bars = barGroup.selectAll('g.barGroup').selectAll('rect.bar');
        
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

    function attachCallbacks(){
        let bars = barGroup.selectAll('g.barGroup').selectAll('rect.bar');
        bars.on('click', barClickCB)
            .on('touch', barClickCB)
            .on('mouseover', function(){
                D3Select(this).classed('highlight', true);
            })
            .on('mouseout', function(){
                D3Select(this).classed('highlight', false);
            });
    }

    TrendChart._onResize = ()=>{

        let barGroups = barGroup.selectAll('g.barGroup');
        let bars = barGroups.selectAll('rect.bar');
        let lines = lineGroup.selectAll('path.line');

        svg.attr('transform', `translate(${TrendChart._canvas.l},${TrendChart._canvas.t})`);

        yScale.range([ TrendChart._canvas.iH, 0 ]);
        yAxis.attr('transform', 'translate(0,0)');
  
        xScale.range([ 0, TrendChart._canvas.iW ]);
        xAxis.attr('transform', `translate(0,${TrendChart._canvas.iH})`);

        if(barGroups.data().length > 0){
            xAxis.call(D3AxisBottom(xScale).tickFormat(d=>formatDate(parseDate(d))));
            yAxis.call(D3AxisLeft(yScale).ticks(nValueTicks, valueTickFormat));
        }

        bars.attr('x', d=>xScale(d.date)+(xScale.bandwidth()*(1-d.width)/2))
            .attr('width', d=>xScale.bandwidth()*d.width)
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>TrendChart._canvas.iH-yScale(d.value));

        lines.attr('d', D3Line()
            .x(d=>xScale(d.date)+xScale.bandwidth()/2)
            .y(d=>yScale(d.value))
            .curve(D3CurveBasis)
        );
    };

    TrendChart.setMargin([10, 20, 30, 10]);

    // public

    TrendChart.setMarginLeft = function(v){
        TrendChart._svgMargin[2] = v;
        TrendChart._resize();
        return TrendChart;
    };
    TrendChart.setMarginBottom = function(v){
        TrendChart._svgMargin[1] = v;
        TrendChart._resize();
        return TrendChart;
    };
    TrendChart.setValueTicks = function(n = 10, format = '.2f'){
        nValueTicks = n;
        valueTickFormat = format;
        return TrendChart;
    };
    TrendChart.setDateTicks = function(inFormat, outFormat = inFormat){
        parseDate = D3TimeParse(inFormat);
        formatDate = D3TimeFormat(outFormat);
        return TrendChart;
    };
    TrendChart.setMaxValue = function(v){
        maxYValue = v;
        return TrendChart;
    };
    TrendChart.setTransition = function(du = 100, de = 50){
        duration = du;
        delay = de;
        return TrendChart;
    };
    // serie data:
    // [ [{date:YYYY|MM,value:number}, ...], ...]
    TrendChart.render = function(series){
        TrendChart._removeDefaultText();
        series = series.map((d,i)=>{
            let width = i == 0 ? 1 : i == 1 ? 0.6 : 0.3;
            return d.map(d2=>{
                return {date:d2.date,value:d2.value,width};
            });
        });
        render(series);
        return TrendChart;
    };
    TrendChart.setTooltip = function(f){
        tooltipFunction = f;
        setBarTooltips();
        return TrendChart;
    };TrendChart.setTooltipChart = function(f){
        tooltipChart = f;
        setBarTooltips();
        return TrendChart;
    };
    TrendChart.setBarClick = function(cb){
        barClickCB = cb;
        attachCallbacks();
        return TrendChart;
    };
    TrendChart.selectBar = function(selectDate = null){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .classed('selected', d=>d.date === selectDate);
        return TrendChart;
    };

    return TrendChart;
}