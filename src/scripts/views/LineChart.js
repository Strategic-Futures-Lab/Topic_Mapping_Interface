import {select as D3Select} from 'd3-selection';
import {scaleLinear as D3ScaleLinear} from 'd3-scale';
import {axisLeft as D3AxisLeft,
    axisBottom as D3AxisBottom} from 'd3-axis';
import {line as D3Line,
    curveBasis as D3CurveBasis,
    curveCardinal as D3CurveCardinal} from 'd3-shape';
import {extent as D3Extent} from 'd3-array';
// import {format as D3Format} from 'd3-format';
import Tippy from 'tippy.js';
import '../../styles/LineChart.less';

export default function(container='body', width=800, height=600, margL=30, margB=20){

    let LineChart = {};

    LineChart.setWidth = function(w){
        width = w;
        resize();
        return LineChart;
    };
    LineChart.setHeight = function(h){
        height = h;
        resize();
        return LineChart;
    };
    LineChart.setSize = function(w,h){
        width = w;
        height = h;
        resize();
        return LineChart;
    };
    LineChart.setMarginLeft = function(m){
        margins.left = m;
        resize();
        return LineChart;
    };
    LineChart.setMarginBottom = function(m){
        margins.bottom = m;
        resize();
        return LineChart;
    };
    LineChart.toggleBorder = function(bool){
        svgBorderThickness = bool ? 1 : 0;
        resize();
        return LineChart;
    };
    LineChart.addDefaultText = function(string, scale=null, blinking=false){
        defaultText = svg.append('text')
            .classed('defaultText', true)
            .classed('blinking', blinking)
            .attr('transform', `translate(${svgWidth/2-margins.left},${svgHeight/2-margins.top})scale(${scale!=null?scale:1})`)
            .text(string);
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
    // dataset : [{x:...,y:...},...]
    LineChart.render = function(dataset){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
        }
        render(dataset);
        return LineChart;
    };

    let svgWidth = width,
        svgHeight = height,
        margins = {top: 10, right:10, left: margL, bottom: margB},
        svgBorderThickness = 1;

    let svgTop = D3Select(container).append('svg')
        .classed('lineChart', true)
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    let svg = svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margins.left},${margins.top})`);

    let xScale = D3ScaleLinear(),
        yScale = D3ScaleLinear();

    let xAxis = svg.append('g')
            .attr('transform', `translate(0,${svgHeight-margins.bottom})`),
        yAxis = svg.append('g')
            .attr('transform', 'translate(0,0)');

    let line = svg.append('path').classed('line', true),
        dotGroup = svg.append('g').classed('dots', true),
        smoothLine = svg.append('path').classed('line', true).classed('smoothed', true);

    let xAxisName = 'x',
        yAxisName = 'y';
    let dotTooltips = [];
    let defaultText = null;

    function render(dataset){
        updateScales(dataset);
        updateDots(dataset);
        updateLine(line, dataset, false);
        updateLine(smoothLine, dataset, true);
    }

    function updateScales(dataset){
        xScale.domain(D3Extent(dataset, d=>d.x))
            .range([0, svgWidth-margins.left-margins.right]);
        yScale.domain(D3Extent(dataset, d=>d.y))
            .range([svgHeight-margins.top-margins.bottom, 0]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`)
            .call(D3AxisBottom(xScale));
        yAxis.attr('transform', 'translate(0,0)')
            .call(D3AxisLeft(yScale));
    }

    function updateDots(dataset){
        dotTooltips.forEach(t=>t.destroy());
        let dots = dotGroup.selectAll('circle.dot')
            .data(dataset);
        dots.exit().remove();
        dots.enter().append('circle').classed('dot', true);
        dots = dotGroup.selectAll('circle.dot');
        dots.on('mouseover', function(){
            D3Select(this).attr('r', '6px')
                .classed('highlight',true);
        })
            .on('mouseout', function(){
                D3Select(this).attr('r', '4px')
                    .classed('highlight',false);
            })
            .attr('data-tippy-content', d=>{
                let x = `${xAxisName}: <b>${d.x}</b>`,
                    y = `${yAxisName}: <b>${d.y}</b>`;
                return `${x}</br>${y}`;
            })
            .attr('cx', d=>xScale(d.x))
            .attr('cy', d=>yScale(d.y))
            .attr('r', '4px');
        dotTooltips = Tippy(dots.nodes(),{
            theme:'dark',
            duration: [500, 0],
            allowHTML: true
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

    function resizeChart(){

        let dots = dotGroup.selectAll('circle.dot');

        xScale.range([0, svgWidth-margins.left-margins.right]);
        yScale.range([svgHeight-margins.top-margins.bottom, 0]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`);
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

    return LineChart;
}