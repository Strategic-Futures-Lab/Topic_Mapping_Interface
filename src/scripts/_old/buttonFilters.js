// "use strict"; // catches accidental global declarations

function ButtonFilters(container = 'body', width = 800, height = 600){

    let public = {};

    // values: [{value,text}]
    public.render = function(values){
        renderButtons(values);
        return public;
    }
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
    public.setClickCB = function(cb){
        buttonClickCB = cb;
        return public;
    }
    public.setSelected = function(value){
        buttonsWrapper.selectAll('button')
            .classed('selected', d=>{
                return d.value === value;
            })
        return public;
    }

    let buttonsWrapper = d3.select(container).append('div')
        .classed('buttonWrapper', true);

    function renderButtons(data){
        let buttonWidth = (width-2)/data.length,
            buttonHeight = height;
        if(buttonWidth < buttonHeight){
            buttonWidth = buttonWidth*2;
            buttonHeight = buttonHeight/2;
        }
        buttonWidth -= 2;
        buttonHeight -= 2;
        let buttons = buttonsWrapper.selectAll('button').data(data);
        buttons.exit().remove();
        buttons.enter().append('button')
            .merge(buttons)
            .text(d=>d.text)
            .style('width', buttonWidth)
            .style('height', buttonHeight)
            .style('font-size', ()=>{
                return Math.max(buttonHeight/4.5, buttonWidth/10);
            })
            .attr('title', d=>d.value)
            .on('click', buttonClickCB)
    }

    function resize(){
        buttonsWrapper.style('width', width)
            .style('height', height);
    }

    resize()

    return public;
}