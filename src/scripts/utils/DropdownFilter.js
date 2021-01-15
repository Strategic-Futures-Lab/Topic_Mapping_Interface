import {select as D3Select} from 'd3-selection';
import '../../styles/DropdownFilter.less';

export default function(container = 'body', width = 500, height = 80){

    let DropdownFilter = {};

    // values: [{value,text}]
    DropdownFilter.addOptions = function(values){
        addOptions(values);
        return DropdownFilter;
    };
    DropdownFilter.setWidth = function(w){
        width = w;
        resize();
        return DropdownFilter;
    };
    DropdownFilter.setHeight = function(h){
        height = h;
        resize();
        return DropdownFilter;
    };
    DropdownFilter.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return DropdownFilter;
    };
    DropdownFilter.setSelectCB = function(cb){
        selectCB = cb;
        resetCallback();
        return DropdownFilter;
    };
    DropdownFilter.setSelected = function(value){
        dropdown.selectAll('option')
            .attr('selected', null)
            .filter(d=>d.value==value)
            .attr('selected', true);
        // buttonsWrapper.selectAll('button')
        //     .classed('selected', d=>{
        //         return d.value === value;
        //     })
        return DropdownFilter;
    };

    let dropdownFilterWrapper = D3Select(container).append('div')
        .classed('dropdownFilterWrapper', true);

    let dropdown = dropdownFilterWrapper.append('select');

    let selectCB = ()=>{};

    function addOptions(values){
        let options = dropdown.selectAll('option')
            .data(values, d=>d.value);
        options.exit().remove();
        options.enter().append('option');
        options = dropdown.selectAll('option');
        options.attr('value', d=>d.value)
            .text(d=>d.text);
    }

    function resetCallback(){
        dropdown.on('change', ()=>{
            let v = dropdown.node().value;
            // let d = dropdown.selectAll('option')
            //     .filter(d=>d.value == v)[0]
            //     .datum();
            // console.log(d);
            selectCB(v);
        });
    }

    resetCallback();


    function resize(){
        dropdownFilterWrapper.style('width', width+'px')
            .style('height', height+'px');
    }

    resize();

    return DropdownFilter;
}