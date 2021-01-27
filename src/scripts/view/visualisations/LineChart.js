import Visualisation from './utils/Visualisation';

import {select as D3Select} from 'd3-selection';
import {scaleLinear as D3ScaleLinear} from 'd3-scale';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {line as D3Line,
    curveBasis as D3CurveBasis,
    curveCardinal as D3CurveCardinal} from 'd3-shape';
import {extent as D3Extent} from 'd3-array';
import Tippy from 'tippy.js';

import '../../../styles/visualisations/LineChart.less';

export default function(container='body', width=800, height=600){

    let LineChart = Visualisation(container, width, height, 'linechart');

    // private 

    let xAxisName = 'x',
        yAxisName = 'y',
        nTickX = 10,
        tickFormatX = null,
        nTickY = 10,
        tickFormatY = null,
        dotTooltips = [];

    let svg = LineChart._svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${LineChart._canvas.l},${LineChart._canvas.t})`);

    let line = svg.append('path').classed('line', true),
        dotGroup = svg.append('g').classed('dots', true),
        smoothLine = svg.append('path').classed('line', true).classed('smoothed', true);

    let xScale = D3ScaleLinear(),
        yScale = D3ScaleLinear();
    let xAxis = svg.append('g').classed('scale',true)
        .attr('transform', `translate(0,${LineChart._canvas.iH})`);
    let yAxis = svg.append('g').classed('scale',true)
        .attr('transform', 'translate(0,0)');

    function render(dataset){
        updateScales(dataset);
        updateDots(dataset);
        updateLine(line, dataset, false);
        updateLine(smoothLine, dataset, true);
    }

    function updateScales(dataset){
        xScale.domain(D3Extent(dataset, d=>d.x))
            .range([0, LineChart._canvas.iW]);
        yScale.domain(D3Extent(dataset, d=>d.y))
            .range([LineChart._canvas.iH, 0]);
        xAxis.attr('transform', `translate(0,${LineChart._canvas.iH})`)
            .call(D3AxisBottom(xScale).ticks(nTickX, tickFormatX));
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale).ticks(nTickY, tickFormatY));
    }

    function updateDots(dataset){
        let dots = dotGroup.selectAll('circle.dot')
            .data(dataset);
        dots.exit().remove();
        dots.enter().append('circle').classed('dot', true);
        dots = dotGroup.selectAll('circle.dot');
        dots.attr('cx', d=>xScale(d.x))
            .attr('cy', d=>yScale(d.y))
            .attr('r', '4px');
        setDotsTooltips();
        attachDotsCallbacks();
    }

    function setDotsTooltips(){
        dotTooltips.forEach(t=>t.destroy());
        let dots = dotGroup.selectAll('circle.dot');
        dots.selectAll('circle.dot')
            .attr('data-tippy-content', d=>{
                let x = `${xAxisName}: <b>${d.x}</b>`,
                    y = `${yAxisName}: <b>${d.y}</b>`;
                return `${x}</br>${y}`;
            });
        dotTooltips = Tippy(dots.nodes(),{
            theme:'dark',
            duration: [500, 0],
            allowHTML: true
        });
    }

    function attachDotsCallbacks(){
        dotGroup.selectAll('circle.dot')
            .on('mouseover', function(){
                D3Select(this).attr('r', '6px')
                    .classed('highlight',true);
            })
            .on('mouseout', function(){
                D3Select(this).attr('r', '4px')
                    .classed('highlight',false);
            });
    }

    function updateLine(line, dataset, smoothed=false){
        let c = smoothed ? D3CurveBasis : D3CurveCardinal.tension(0.5);
        line.datum(dataset)
            .attr('d', D3Line()
                .x(d=>xScale(d.x))
                .y(d=>yScale(d.y))
                .curve(c)
            );
    }

    LineChart._onResize = ()=>{

        svg.attr('transform', `translate(${LineChart._canvas.l},${LineChart._canvas.t})`);

        let dots = dotGroup.selectAll('circle.dot');

        xScale.range([0, LineChart._canvas.iW]);
        yScale.range([LineChart._canvas.iH, 0]);
        xAxis.attr('transform', `translate(0,${LineChart._canvas.iH})`);
        yAxis.attr('transform', 'translate(0,0)');

        if(dots.data().length > 0){
            xAxis.call(D3AxisBottom(xScale));
            yAxis.call(D3AxisLeft(yScale));
        

            dots.attr('cx', d=>xScale(d.x))
                .attr('cy', d=>yScale(d.y));
            
            line.attr('d', D3Line()
                .x(d=>xScale(d.x))
                .y(d=>yScale(d.y))
                .curve(D3CurveCardinal.tension(0.5))
            );

            smoothLine.attr('d', D3Line()
                .x(d=>xScale(d.x))
                .y(d=>yScale(d.y))
                .curve(D3CurveBasis)
            );
        }
    };

    LineChart.setMargin([10, 20, 30, 10]);

    // public

    LineChart.setMarginLeft = function(v){
        LineChart._svgMargin[2] = v;
        LineChart._resize();
        return LineChart;
    };
    LineChart.setMarginBottom = function(v){
        LineChart._svgMargin[1] = v;
        LineChart._resize();
        return LineChart;
    };
    LineChart.setXAxisName = function(str){
        xAxisName = str;
        return LineChart;
    };
    LineChart.setYAxisName = function(str){
        yAxisName = str;
        return LineChart;
    };
    LineChart.setAxesNames = function(xStr, yStr){
        xAxisName = xStr;
        yAxisName = yStr;
        return LineChart;
    };
    LineChart.setXTicks = function(n=10, format=null){
        nTickX = n;
        tickFormatX = format;
        return LineChart;
    };
    LineChart.setYTicks = function(n=10, format=null){
        nTickY = n;
        tickFormatY = format;
        return LineChart;
    };
    LineChart.setTicks = function(nX=10, nY=10, formatX=null, formatY=null){
        nTickX = nX;
        tickFormatX = formatX;
        nTickY = nY;
        tickFormatY = formatY;
        return LineChart;
    };
    // dataset : [{x:...,y:...},...]
    LineChart.render = function(dataset){
        LineChart._removeDefaultText();
        render(dataset);
        return LineChart;
    };
}