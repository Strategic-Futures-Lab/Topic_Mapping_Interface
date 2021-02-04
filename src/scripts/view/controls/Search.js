import {select as D3Select} from 'd3-selection';

import '../../../styles/controls/Search.less';

export default function(container='body', width=500, height=80){

    let Search = {};

    // private

    let searchCB = ()=>{};

    let searchBoxWrapper = D3Select(container).append('div')
        .classed('searchBoxWrapper', true);
    let span  = searchBoxWrapper.append('span');
    let input = span.append('input')
        .attr('type', 'text')
        .attr('placeholder', 'Search labels...')
        .attr('title', 'Separate labels by a space to search them in the same topics. Use semicolons ; to include multiple searches.');

    let clear = span.append('span')
        .classed('clearInput', true)
        .html('&#10005;')
        .on('click', ()=>{
            input.node().value = '';
            displayClear('');
            searchCB('');
        })
        .attr('title', 'Clear search');

    function setCB(){
        input.on('input', function(){
            let v = D3Select(this).node().value.toLowerCase();
            displayClear(v);
            searchCB(v);
        });
    }

    function displayClear(v){
        if(v === '' || v === null){
            clear.style('display', 'none');
        } else {
            clear.style('display', 'block');
        }
    }

    function resize(){
        searchBoxWrapper.style('width', width+'px')
            .style('height', height+'px');
    }
    resize();

    // public

    Search.setWidth = function(w){
        width = w;
        resize();
        return Search;
    };
    Search.setHeight = function(h){
        height = h;
        resize();
        return Search;
    };
    Search.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return Search;
    };
    Search.setSearchCB = function(cb){
        searchCB = cb;
        setCB();
        return Search;
    };
    Search.activate = function(flag=true){
        input.classed('active', flag);
        return Search;
    };
    Search.setValue = function(str){
        input.node().value = str;
        displayClear(str);
        return Search;
    };
    Search.getValue = function(){
        let v = input.node().value;
        return v == null ? '' : v;
    };

    return Search;
}