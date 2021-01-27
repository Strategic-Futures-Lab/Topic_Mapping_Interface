import {select as D3Select} from 'd3-selection';

import '../../../../styles/htmlPanels/panel.less';

export default function(container='body', width=800, height=600, classed=''){

    let WrapperObj = {};

    // private

    WrapperObj._width = width;
    WrapperObj._height = height;
    WrapperObj._panelWidth = width - 2;
    WrapperObj._panelHeight = height - 2;
    WrapperObj._border = 1;

    function positionDefaultText(){
        WrapperObj._defaultText.style('top', function(){
            let pH = D3Select(this).node().offsetHeight;
            let tH = WrapperObj._title.datum().text == null ? 0 : 29;
            return `calc(50% - ${(pH/2+tH)}px`;
        });
    }

    WrapperObj._resize = function(){
        WrapperObj._panelWidth = WrapperObj._width - WrapperObj._border*2;
        WrapperObj._panelHeight = WrapperObj._height - WrapperObj._border*2;

        WrapperObj._wrapper.style('width', WrapperObj._panelWidth+'px')
            .style('height', WrapperObj._panelHeight+'px')
            .style('border-width', WrapperObj._border);

        if(WrapperObj._defaultText !== null){
            positionDefaultText();
        }

        WrapperObj._onResize();
    };

    WrapperObj._toggleTitle = function(text=null, position='T'){
        WrapperObj._title.data([{text,position}]);
        if(text==null){
            WrapperObj._title.text('')
                .style('margin-top', '0px')
                .style('height', '0px');
        } else {
            WrapperObj._title.text(d=>d.text)
                .style('font-size', '20px')
                .style('margin-top', '5px')
                .style('height', '24px'); // TODO align based on position
        }
        if(WrapperObj._defaultText !== null){
            positionDefaultText();
        }
    };

    // protect

    WrapperObj._onResize = () => {};

    WrapperObj._wrapper = D3Select(container).append('div')
        .classed(classed, true)
        .classed('htmlpanel', true)
        .style('width', WrapperObj._panelWidth+'px')
        .style('height', WrapperObj._panelHeight+'px')
        .style('border-width', WrapperObj._border);

    WrapperObj._title = WrapperObj._wrapper.append('p')
        .classed('title', true)
        .data([{text:null,position:'t'}])
        .style('margin-top', '0px')
        .style('height', '0px');

    WrapperObj._defaultText = null;
    WrapperObj._removeDefaultText = ()=>{
        if(WrapperObj._defaultText != null){
            WrapperObj._defaultText.remove();
            WrapperObj._defaultText = null;
        }
    };


    // public

    WrapperObj.setWidth = function(w){
        WrapperObj._width = w;
        WrapperObj._resize();
        return WrapperObj;
    };
    WrapperObj.setHeight = function(h){
        WrapperObj._height = h;
        WrapperObj._resize();
        return WrapperObj;
    };
    WrapperObj.setSize = function(w,h){
        WrapperObj._width = w;
        WrapperObj._height = h;
        WrapperObj._resize();
        return WrapperObj;
    };
    WrapperObj.toggleBorder = function(bool=null){
        bool = bool == null ? WrapperObj._border == 0 : bool;
        WrapperObj._border = bool ? 1 : 0;
        WrapperObj._resize();
        return WrapperObj;
    };
    WrapperObj.toggleTitle = function(t=null, pos='T'){
        WrapperObj._toggleTitle(t,pos);
        return WrapperObj;
    };
    WrapperObj.addDefaultText = function(string, size=1, blinking=false){
        if(string != null){
            if(WrapperObj._defaultText == null){
                WrapperObj._defaultText = WrapperObj._wrapper.append('p')
                    .classed('defaultText', true);
            }
            WrapperObj._defaultText.classed('blinking', blinking)
                .text(string)
                .style('font-size', `${size}em`);
            positionDefaultText();
        }
        return WrapperObj;
    };


    return WrapperObj;
}