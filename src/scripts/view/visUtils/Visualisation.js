import Canvas from './canvas';
import {select as D3Select} from 'd3-selection';

import '../../../styles/vis/visualisation.less';

export default function(container = 'body', width = 800, height = 600, classed = ''){

    let VisObj = {};

    // private

    VisObj._width = width;
    VisObj._height = height;
    VisObj._svgWidth = width - 2;
    VisObj._svgHeight = height - 2;
    VisObj._svgMargin = [10,10,10,10];
    VisObj._border = 1;

    VisObj._resize = function(){
        VisObj._svgWidth = VisObj._width - VisObj._border*2;
        VisObj._svgHeight = VisObj._height - VisObj._border*2;

        VisObj._canvas = Canvas(VisObj._svgWidth, VisObj._svgHeight, VisObj._svgMargin);

        VisObj._svgTop.attr('width', VisObj._canvas.w)
            .attr('height', VisObj._canvas.h)
            .style('border-width', VisObj._border);

        VisObj._buttonTR.attr('transform', `translate(${VisObj._canvas.w-5},5)`);
        VisObj._buttonBR.attr('transform', `translate(${VisObj._canvas.w-5},${VisObj._canvas.h-5})`);
        VisObj._buttonTL.attr('transform', 'translate(5,5)');
        VisObj._buttonBL.attr('transform', `translate(5,${VisObj._canvas.h-5})`);

        VisObj._title.attr('transform', d=>`translate(${VisObj._canvas.c},${d.position=='b'?VisObj._canvas.h-15:25})`);
    
        VisObj._onResize();
    };

    VisObj._toggleButton = function(position=null, text=null, callback=null){
        if(position!==null){
            let button = position === 'BR' ? VisObj._buttonBR :
                position === 'BL' ? VisObj._buttonBL :
                    position === 'TL' ? VisObj._buttonTL :
                        VisObj._buttonTR;
            if(text == null){
                button.select('rect').remove();
                button.select('text').remove();
                button.on('click', null);
            } else {
    
                let rectEl = button.selectAll('rect').data([text]);
                rectEl.enter().append('rect');
    
                let textEl = button.selectAll('text').data([text]);
                textEl.enter().append('text');
                textEl = button.selectAll('text')
                    .text(text)
                    .style('font-size', '16px')
                    .attr('dy', `${position.startsWith('T')?'20':'-10'}`)
                    .attr('dx', `${position.endsWith('L')?'':'-'}5`)
                    .style('text-anchor', `${position.endsWith('L')?'start':'end'}`);
                let {width, height} = textEl.node().getBBox();

                rectEl = button.selectAll('rect')
                    .attr('x',  position.endsWith('L') ? 0 : -width-10)
                    .attr('y', position.startsWith('T') ? 0 : -height-8)
                    .attr('width', width+10)
                    .attr('height', height+8)
                    .attr('rx', 2);
                
                button.on('click', callback);
            }
        }
    };

    VisObj._toggleTitle = function(text=null, position='T'){
        if(text==null){
            VisObj._title.text('');
        } else {
            VisObj._title.data([{text,position}]);

            VisObj._title.text(d=>d.text)
                .style('font-size', '20px')
                .attr('transform', d=>`translate(${VisObj._canvas.c},${d.position=='B'?VisObj._canvas.h-15:25})`);
        }
    };

    // protected
    
    VisObj._canvas = Canvas(VisObj._svgWidth, VisObj._svgHeight, VisObj._svgMargin);

    VisObj._onResize = ()=>{};

    VisObj._svgTop = D3Select(container).append('svg')
        .classed(classed, true)
        .classed('viz', true)
        .attr('width', VisObj._svgWidth)
        .attr('height', VisObj._svgHeight);

    VisObj._buttonTR = VisObj._svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(${VisObj._canvas.w-5},5)`);
    
    VisObj._buttonBR = VisObj._svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(${VisObj._canvas.w-5},${VisObj._canvas.h-5})`);
    
    VisObj._buttonTL = VisObj._svgTop.append('g')
        .classed('button', true)
        .attr('transform', 'translate(5,5)');
    
    VisObj._buttonBL = VisObj._svgTop.append('g')
        .classed('button', true)
        .attr('transform', `translate(5,${VisObj._canvas.h-5})`);
    
    VisObj._title = VisObj._svgTop.append('text')
        .data([{text:null,position:'t'}])
        .classed('title', true);

    VisObj._defaultText = null;
    VisObj._removeDefaultText = ()=>{
        if(VisObj._defaultText != null){
            VisObj._defaultText.remove();
            VisObj._defaultText = null;
        }
    };

    // public

    VisObj.setWidth = function(w){
        VisObj._width = w;
        VisObj._resize();
        return VisObj;
    };
    VisObj.setHeight = function(h){
        VisObj._height = h;
        VisObj._resize();
        return VisObj;
    };
    VisObj.setSize = function(w, h){
        VisObj._width = w;
        VisObj._height = h;
        VisObj._resize();
        return VisObj;
    };
    VisObj.setMargin = function(m){
        VisObj._svgMargin = m;
        VisObj._resize();
        return VisObj;
    };
    VisObj.toggleBorder = function(bool=null){
        bool = bool == null ? VisObj._border == 0 : bool;
        VisObj._border = bool ? 1 : 0;
        VisObj._resize();
        return VisObj;
    };
    VisObj.toggleButton = function(pos, t=null, cb=null){
        VisObj._toggleButton(pos,t,cb);
        return VisObj;
    };
    VisObj.toggleTitle = function(t=null, pos='T'){
        VisObj._toggleTitle(t,pos);
        return VisObj;
    };
    VisObj.addDefaultText = function(string, scale=1, blinking=false){
        if(string != null){
            if(VisObj._defaultText == null){
                VisObj._defaultText = VisObj._svgTop.append('text')
                    .classed('defaultText', true);
            }
            VisObj._defaultText.classed('blinking', blinking)
                .attr('transform', `translate(${VisObj._canvas.c},${VisObj._canvas.m})scale(${scale})`)
                .text(string);
        }
        return VisObj;
    };

    return VisObj;
}