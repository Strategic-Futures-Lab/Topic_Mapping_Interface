import PanelWrapper from './utils/PanelWrapper';

import isArray from 'lodash-es/isArray';
import isString from 'lodash-es/isString';

import '../../../styles/htmlPanels/DocViewer.less';

export default function(container='body', width=800, height=600){

    let DocViewer = PanelWrapper(container, width, height, 'docviewer');

    // private

    let fields = null;

    let docView = DocViewer._wrapper.append('div')
        .classed('viewer', true);

    let fieldsPara = docView.selectAll('p.docField');

    let capitalizeString = str => str.charAt(0).toUpperCase()+str.slice(1);

    function renderDoc(docData){
        renderDocFields(docData);
    }
    function renderDocFields(docData){
        let data = fields == null ? Object.keys(docData).map(d=>[d,d,e=>e]) : fields;
        
        // Object.entries(docData).map(d=>{return {key:d[0], value:d[1]};});
        fieldsPara = docView.selectAll('p.docField')
            .data(data, d=>d[0]);
        fieldsPara.exit().remove();
        let fieldsEnter = fieldsPara.enter().append('p').classed('docField', true);
        fieldsEnter.append('span').classed('key', true);
        fieldsEnter.append('span').classed('value', true);
        fieldsPara = docView.selectAll('p.docField');
        fieldsPara.select('span.key')
            .text(d=>capitalizeString(d[1])+':');
        fieldsPara.select('span.value')
            .text(d=>d[2](docData[d[0]]));

    }

    DocViewer._onResize = ()=>{

    };

    // public

    DocViewer.render = function(docData){
        DocViewer._removeDefaultText();
        renderDoc(docData);
        return DocViewer;
    };

    // [[key,text]]
    DocViewer.setFields = function(f=null){
        fields = f;
        if(isArray(fields)){
            fields = fields.map(f=>{
                if(isArray(f)){
                    if(f.length == 3) return f;
                    if(f.length == 2) return [f[0],f[1],d=>d];
                    if(f.length == 1) return [f[0],f[0],d=>d];
                } else if(isString(f)){
                    return [f,f,d=>d];
                }
            });
        }
        return DocViewer;
    };

    return DocViewer;
}