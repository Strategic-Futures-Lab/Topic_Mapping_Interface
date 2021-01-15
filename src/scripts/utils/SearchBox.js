// "use strict"; // catches accidental global declarations
import {select as D3Select} from 'd3-selection';
import '../../styles/SearchBox.less';

export default function(container = 'body', width = 500, height = 80){

    let SearchBox = {};

    SearchBox.setWidth = function(w){
        width = w;
        resize();
        return SearchBox;
    };
    SearchBox.setHeight = function(h){
        height = h;
        resize();
        return SearchBox;
    };
    SearchBox.setSize = function(w, h){
        width = w;
        height = h;
        resize();
        return SearchBox;
    };
    SearchBox.setSearchCB = function(cb){
        searchCB = cb;
        setCB();
        return SearchBox;
    };
    SearchBox.activate = function(flag=true){
        input.classed('active', flag);
        return SearchBox;
    };
    SearchBox.setValue = function(str){
        input.node().value = str;
        displayClear(str);
        return SearchBox;
    };
    SearchBox.getValue = function(){
        let v = input.node().value;
        return v == null ? '' : v;
    };

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

    return SearchBox;
}