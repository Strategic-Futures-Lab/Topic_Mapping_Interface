import {timeParse as D3TimeParse,
    timeFormat as D3TimeFormat} from 'd3-time-format';
// import {format as D3Format} from 'd3-format';
import {select as D3Select} from 'd3-selection';
import {transition as D3Transition} from 'd3-transition';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {scaleLinear as D3ScaleLinear,
    scaleBand as D3ScaleBand} from 'd3-scale';
import {max as D3Max} from 'd3-array';
import {line as D3Line,
    curveBasis as D3CurveBasis} from 'd3-shape';
import Tippy from 'tippy.js';
import '../../styles/TrendBars.less';

export default function(container = 'body', width = 800, height = 600, margL = 30, margB = 20){

    let TrendBars = {};

    TrendBars.setWidth = function(w){
        width = w;
        resize();
        return TrendBars;
    };
    TrendBars.setHeight = function(h){
        height = h;
        resize();
        return TrendBars;
    };
    TrendBars.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return TrendBars;
    };
    TrendBars.setMarginLeft = function(m){
        margins.left = m;
        resize();
        return TrendBars;
    };
    TrendBars.setMarginBottom = function(m){
        margins.bottom = m;
        resize();
        return TrendBars;
    };
    TrendBars.toggleBorder = function(bool){
        svgBorderThickness = bool ? 1 : 0;
        resize();
        return TrendBars;
    };
    TrendBars.setParseTime = function(format){
        parseTime = D3TimeParse(format);
        return TrendBars;
    };
    TrendBars.setTickFormat = function(format){
        tickFormat = format;
        return TrendBars;
    };
    TrendBars.setMaxValue = function(v){
        maxYValue = v;
        return TrendBars;
    };
    TrendBars.setTransition = function(du){
        duration = du;
        return TrendBars;
    };
    TrendBars.addDefaultText = function(string, scale=null, blinking=false){
        defaultText = svg.append('text')
            .classed('defaultText', true)
            .classed('blinking', blinking)
            // .attr('transform', `translate(${svgWidth/2-margins.left},${svgHeight/2-margins.top})scale(${scale!=null?scale:1})`)
            .text(string);
        center(scale);
        return TrendBars;
    };

    // serie data:
    // [ [{date:YYYY|MM,value:number}, ...], ...]
    TrendBars.render = function(series){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
            resize();
        }
        render(series);
        return TrendBars;
    };
    // TrendBars.setTooltipText = function(str){
    //     tooltipText = str;
    //     return TrendBars;
    // };
    TrendBars.setTooltip = function(f){
        tooltipFunction = f;
        return TrendBars;
    };
    TrendBars.setClickCB = function(cb){
        barClickCB = cb;
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .on('click', cb);
        return TrendBars;
    };
    TrendBars.selectBar = function(selectDate = null){
        barGroup.selectAll('g.barGroup').selectAll('rect.bar')
            .classed('selected', d=>d.date === selectDate);
        return TrendBars;
    };

    let svgWidth = width,
        svgHeight = height,
        margins = {top: 10, right:10, left: margL, bottom: margB},
        svgBorderThickness = 1;

    let maxYValue = -1;

    let duration = 0,
        delay = 10;

    let svgTop = D3Select(container).append('svg')
        .classed('trendBars', true)
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
        yAxis = svg.append('g')
            .attr('transform', 'translate(0,0)');

    let barGroup = svg.append('g').classed('bars', true),
        lineGroup = svg.append('g').classed('lines', true);

    let parseTime = D3TimeParse('%Y-%m-%d'),
        tickFormat = '%b. %y';

    let barClickCB = null;
    // let tooltipText = 'documents';
    let tooltipFunction = null;
    let barTooltips = [];
    
    let defaultText = null;

    function render(series){

        // series = series.map(d=>{return d.map(d2=>{return {date:parseTime(d2.date),value:d2.value}})
        //                                 .sort((a,b)=>{return a.date-b.date})});

        barTooltips.forEach(t=>t.destroy());

        xScale.domain(series[0].map(d=>d.date))
            .range([ 0, svgWidth-margins.left-margins.right ]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`)
            .call(D3AxisBottom(xScale).tickFormat(d=>D3TimeFormat(tickFormat)(parseTime(d))));
  
        yScale.domain([0, (maxYValue === -1 ? D3Max(series, d=>D3Max(d, d2=>d2.value)) : maxYValue)])
            .range([ svgHeight-margins.top-margins.bottom, 0 ]);
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale));

        let t1 = D3Transition().duration(duration),
            t2 = D3Transition().duration(duration/2);

        let barGroups = barGroup.selectAll('g.barGroup')
            .data(series);
        barGroups.exit().transition(t2).style('opacity',0).remove();
        barGroups.enter().append('g')
            .classed('barGroup', true);
        barGroups = svg.selectAll('g.barGroup');

        let bars = barGroups.selectAll('rect.bar')
            .data(d=>d);
        bars.exit().transition(t1)
            .attr('y', ()=>yScale(0))
            .attr('height', ()=>0)
            .remove();
        bars.enter().append('rect')
            .classed('bar', true)
            .attr('y', ()=>yScale(0))
            .attr('width', d=>{return d.layer == 'main' ? xScale.bandwidth() : xScale.bandwidth()/2;})
            .attr('height', ()=>0);
        bars = barGroups.selectAll('rect.bar');
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
                // let numberFormat = D3Format(',d');
                // let sizeStr = `<b>${numberFormat(d.value)} ${tooltipText}</b>`;
                // return sizeStr;
            })
            .attr('x', d=>{return d.layer == 'main' ? xScale(d.date) : xScale(d.date)+(xScale.bandwidth()/4);})
            .attr('width', d=>{return d.layer == 'main' ? xScale.bandwidth() : xScale.bandwidth()/2;})
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

        let lines = lineGroup.selectAll('path.line')
            .data(series);
        lines.exit().transition(t2).style('opacity', 0).remove();
        lines.enter().append('path')
            .classed('line', true)
            .attr('d', D3Line()
                .x(d=>xScale(d.date)+xScale.bandwidth()/2)
                .y(()=>yScale(0))
                .curve(D3CurveBasis)
            );
        lines = lineGroup.selectAll('path.line');
        lines.transition(t1).attr('d', D3Line()
            .x(d=>xScale(d.date)+xScale.bandwidth()/2)
            .y(d=>yScale(d.value))
            .curve(D3CurveBasis)
        );
    }

    function resizeChart(){

        let barGroups = barGroup.selectAll('g.barGroup');

        xScale.range([ 0, svgWidth-margins.left-margins.right ]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`);
        
        yScale.range([ svgHeight-margins.top-margins.bottom, 0 ]);
        yAxis.attr('transform', 'translate(0,0)');

        if(barGroups.data().length > 0){
            xAxis.call(D3AxisBottom(xScale).tickFormat(d=>D3TimeFormat(tickFormat)(parseTime(d))));
            yAxis.call(D3AxisLeft(yScale));
        }

        let bars = barGroups.selectAll('rect.bar');
        bars.attr('x', d=>{return d.layer == 'main' ? xScale(d.date) : xScale(d.date)+(xScale.bandwidth()/4);})
            .attr('width', d=>{return d.layer == 'main' ? xScale.bandwidth() : xScale.bandwidth()/2;})
            .attr('y', d=>yScale(d.value))
            .attr('height', d=>svgHeight-margins.top-margins.bottom-yScale(d.value));

        let lines = lineGroup.selectAll('path.line');
        lines.attr('d', D3Line()
            .x(d=>xScale(d.date)+xScale.bandwidth()/2)
            .y(d=>yScale(d.value))
            .curve(D3CurveBasis)
        );
    }

    function center(forcedScale=null){
        let svgSize = svg.node().getBBox(),
            w = svgSize.width,
            h = svgSize.height;
        if(w > 0 && h > 0){
            let rX = svgWidth/w,
                rY = svgHeight/h;
            let s = forcedScale == null ? Math.min(rX, rY)-0.05 : forcedScale;
            svg.attr('transform', `scale(${s}) translate(${svgWidth/2/s},${svgHeight/2/s})`);
        }
    }

    function resize(){
        svgWidth = width - svgBorderThickness*2;
        svgHeight = height - svgBorderThickness*2;

        svgTop.attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('border-width', svgBorderThickness);
        
        svg.attr('transform', `translate(${margins.left},${margins.top})`);

        if(defaultText !== null){
            center();
        }

        resizeChart();
    }

    resize();

    return TrendBars;
}