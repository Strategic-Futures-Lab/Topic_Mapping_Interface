// "use strict"; // catches accidental global declarations
import {select as D3Select} from 'd3-selection';
import '../../styles/DocumentViewer.less';

export default function(container = 'body', width = 800, height = 40){

    let DocView = {};

    DocView.setWidth = function(w){
        width = w;
        resize();
        return DocView;
    };
    DocView.setHeight = function(h){
        height = h;
        resize();
        return DocView;
    };

    DocView.setSize = function(w,h){
        width = w;
        height = h;
        resize();
        return DocView;
    };
    DocView.toggleBorder = function(bool){
        docViewBorderThickness = bool ? 1 : 0;
        resize();
        return DocView;
    };
    DocView.addDefaultText = function(string, size=1, blinking=false){
        defaultText = wrapper.append('p')
            .text(string)
            .classed('defaultText', true)
            .classed('blinking', blinking)
            .style('font-size', `${size}em`)
            .style('top', function(){
                let pH = D3Select(this).node().offsetHeight;
                return (docViewHeight/2-pH)+'px';
            });
        return DocView;
    };
    // docData: {key1:value1, key2:value2, etc.}
    DocView.render = function(docData){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
        }
        renderDoc(docData);
        return DocView;
    };

    let docViewWidth = width,
        docViewHeight = height,
        docViewBorderThickness = 1;

    let wrapper = D3Select(container).append('div')
        .classed('docViewWrapper', true)
        .style('width', docViewWidth+'px')
        .style('height', docViewHeight+'px');
        
    let fields = wrapper.selectAll('p.docField');

    let defaultText = null;

    let capitalizeString = str => str.charAt(0).toUpperCase()+str.slice(1);
    
    function renderDoc(docData){
        renderDocFields(docData);
    }

    function renderDocFields(docData){
        let data = Object.entries(docData).map(d=>{return {key:d[0], value:d[1]};});
        fields = wrapper.selectAll('p.docField')
            .data(data, d=>d.key);
        fields.exit().remove();
        let fieldsEnter = fields.enter().append('p').classed('docField', true);
        fieldsEnter.append('span').classed('key', true);
        fieldsEnter.append('span').classed('value', true);
        fields = wrapper.selectAll('p.docField');
        fields.select('span.key')
            .text(d=>capitalizeString(d.key)+':');
        fields.select('span.value')
            .text(d=>d.value);
    }

    function resize(){
        docViewWidth = width - docViewBorderThickness*2;
        docViewHeight = height - docViewBorderThickness*2;

        wrapper.style('width', docViewWidth+'px')
            .style('height', docViewHeight+'px')
            .style('border-width', docViewBorderThickness);

    }
    resize();

    return DocView;
}