function TrendLines(container = 'body', width = 800, height = 600, margL = 30, margB = 20, cumul = false){

    let public = {};

    public.setWidth = function(w){
        width = w;
        resize();
        return public;
    }
    public.setHeight = function(h){
        height = h;
        resize();
        return public;
    }
    public.setMarginLeft = function(m){
        margins.left = m;
        resize();
        return public;
    }
    public.setMarginBottom = function(m){
        margins.bottom = m;
        resize();
        return public;
    }
    public.toggleBorder = function(bool){
        svgBorderThickness = bool ? 1 : 0;
        resize();
        return public;
    }
    public.setCumul = function(bool){
        cumul = bool;
        return public;
    }
    public.setParseTime = function(format){
        parseTime = d3.timeParse(format);
        return public;
    }
    public.setMaxValue = function(v){
        maxYValue = v;
        return public;
    }

    // serie data:
    // [ [{date:YYYY-MM-DD,value:number}, ...], ...]
    public.render = function(series){ 
        render(series);
        return public;
    }

    let svgWidth = width,
        svgHeight = height,
        margins = {top: 10, right:10, left: margL, bottom: margB}
        svgBorderThickness = 1;

    let maxYValue = -1;

    let svgTop = d3.select(container).append('svg')
        .classed('trendLines', true)
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    let svg = svgTop.append('g')
        .classed('chart', true)
        .attr('transform', `translate(${margins.left},${margins.top})`);

    let xScale = d3.scaleTime(),
        yScale = d3.scaleLinear();

    let xAxis = svg.append('g')
        .attr('transform', `translate(0,${svgHeight-margins.bottom})`),
        yAxis = svg.append('g')
        .attr('transform', `translate(0,0)`),
        lines = svg.selectAll('path');

    let parseTime = d3.timeParse('%Y-%m-%d');

    function render(series){

        series = series.map(d=>{return d.map(d2=>{return {date:parseTime(d2.date),value:d2.value}})
                                        .sort((a,b)=>{return a.date-b.date})});
        if(cumul){
            series.forEach(d=>{ d.reduce((acc,val)=>{
                val.value = val.value+acc;
                return val.value;
            },0)})
        }

        xScale.domain([d3.min(series, d=>d3.min(d, d2=>d2.date)), d3.max(series, d=>d3.max(d, d2=>d2.date))])
            .range([ 0, svgWidth-margins.left-margins.right ]);
        xAxis.attr('transform', `translate(0,${svgHeight-margins.top-margins.bottom})`)
            .call(d3.axisBottom(xScale));
  
        yScale.domain([0, (maxYValue === -1 ? d3.max(series, d=>d3.max(d, d2=>d2.value)) : maxYValue)])
            .range([ svgHeight-margins.top-margins.bottom, 0 ]);
        yAxis.attr('transform', `translate(0,0)`)
            .call(d3.axisLeft(yScale));
  
        lines = svg.selectAll('path.line')
            .data(series);
        lines.exit().remove();
        lines.enter().append('path')
            .classed('line', true);
        lines = svg.selectAll('path.line');
        lines.attr('d', d3.line()
            .x(d=>xScale(d.date))
            .y(d=>yScale(d.value))
        )
  
    }

    function resize(){
        svgWidth = width - svgBorderThickness*2;
        svgHeight = height - svgBorderThickness*2;

        svgTop.attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('border-width', svgBorderThickness);
        
        svg.attr('transform', `translate(${margins.left},${margins.top})`);
        // center();
    }

    resize();

    return public;
}