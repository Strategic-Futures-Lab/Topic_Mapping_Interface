import {select as D3Select} from 'd3-selection';

import '../../../styles/controls/Dropdown.less';

export default function(container='body', width=500, height=80){

    let Dropdown = {};

    // private

    let selectCB = ()=>{};

    let dropdownWrapper = D3Select(container).append('div')
        .classed('dropdownFilterWrapper', true);

    let dropdown = dropdownWrapper.append('select');

    function setOptions(values){
        let options = dropdown.selectAll('option')
            .data(values, d=>d.value);
        options.exit().remove();
        options.enter().append('option');
        options = dropdown.selectAll('option');
        options.attr('value', d=>d.value)
            .text(d=>d.text)
            .filter((d,i)=>i==0)
            .attr('selected', true)
            .each(d=>{
                dropdown.node().value = d.value;
                dropdown.node().dispatchEvent(new Event('change'));
            });
    }

    function setSelection(value){
        dropdown.selectAll('option')
            .attr('selected', null)
            .filter(d=>d.value==value)
            .attr('selected', true);
    }

    function setCallback(){
        dropdown.on('change', ()=>{
            let v = dropdown.node().value;
            setSelection(v);
            selectCB(v);
        });
    }
    setCallback();

    function resize(){
        dropdownWrapper.style('width', width+'px')
            .style('height', height+'px');
    }
    resize();

    // public

    Dropdown.setWidth = function(w){
        width = w;
        resize();
        return Dropdown;
    };
    Dropdown.setHeight = function(h){
        height = h;
        resize();
        return Dropdown;
    };
    Dropdown.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return Dropdown;
    };
    Dropdown.setOptions = function(values){
        setOptions(values);
        return Dropdown;
    };
    Dropdown.setSelectCB = function(cb){
        selectCB = cb;
        setCallback();
        return Dropdown;
    };
    Dropdown.setSelected = function(value){
        dropdown.node().value = value;
        dropdown.node().dispatchEvent(new Event('change'));
        return Dropdown;
    };
    Dropdown.getSelected = function(){
        return dropdown.select('option[selected = true]')
            .datum();
    };

    return Dropdown;
}