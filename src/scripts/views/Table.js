// "use strict"; // catches accidental global declarations
import {select as D3Select} from 'd3-selection';
import Tippy from 'tippy.js';
import '../../styles/Table.less';

export default function(container = 'body', width = 800, height = 40){

    let Table = {};

    Table.setWidth = function(w){
        width = w;
        resize();
        return Table;
    };
    Table.setHeight = function(h){
        height = h;
        resize();
        return Table;
    };
    Table.setSize = function(w,h){
        width = w;
        height = h;
        resize();
        return Table;
    };
    Table.setMinRowHeight = function(h){
        minRowHeight = h;
        return Table;
    };
    Table.toggleBorder = function(bool){
        tableBorderThickness = bool ? 1 : 0;
        resize();
        return Table;
    };
    Table.setColumnsInfo = function(columns){
        columnsInfo = [];
        columns.forEach(c=>addColumnInfo(c));
        return Table;
    };
    Table.addDefaultText = function(string, size=1, blinking=false){
        defaultText = wrapper.append('p')
            .text(string)
            .classed('defaultText', true)
            .classed('blinking', blinking)
            .style('font-size', `${size}em`)
            .style('top', function(){
                let pH = D3Select(this).node().offsetHeight;
                return (tableHeight/2-pH)+'px';
            });
        return Table;
    };
    Table.render = function(dataset){
        if(defaultText !== null){
            defaultText.remove();
            defaultText = null;
        }
        renderTable(dataset);
        return Table;
    };
    Table.nRowSelection = function(options = [], cb = ()=>{}, text = ''){
        nRowsSelectionArray = options;
        nRowSelectionCB = cb;
        nRowsText = text+':';
        return Table;
    };
    Table.highlightDocs = function(docIds){
        highlightRows(docIds);
        return Table;
    };
    Table.fadeDocs = function(docIds){
        fadeRows(docIds);
        return Table;
    };

    let tableWidth = width,
        tableHeight = height,
        tableBorderThickness = 1,
        minRowHeight = tableHeight/11;

    let columnsInfo = [],
        nRowsSelectionArray = [],
        nRowsText = '',
        nRowSelectionCB = ()=>{};

    let cellTooltips = [];

    let wrapper = D3Select(container).append('div')
        .classed('tableWrapper', true)
        .style('width', tableWidth+'px')
        .style('height', tableHeight+'px');
    let nRowsSelection = wrapper.append('span')
        .classed('nRowsSelect', true);
    let table = wrapper.append('table'),
        thead = table.append('thead'),
        tbody = table.append('tbody'),
        titleRow = thead.append('tr');

    let defaultText = null;
    
    function renderTable(dataset){
        renderDataRows(dataset);
        renderNRowsSelection(dataset.length);
        renderTitleRow();
    }

    function renderTitleRow(){
        titleRow.call(styleRow);
        let titleCells = titleRow.selectAll('th')
            .data(columnsInfo);
        titleCells.exit().remove();
        titleCells.enter().append('th')
            .merge(titleCells)
            .text(d=>d.title)
            .call(styleCell, true);
    }

    function renderDataRows(dataset){
        cellTooltips.forEach(t=>t.destroy());
        let rows = tbody.selectAll('tr')
            .data(dataset);
        rows.exit().remove();
        rows.enter().append('tr')
            .merge(rows)
            .call(styleRow)
            .each(makeCells);
    }

    function highlightRows(docIds){
        let rows = tbody.selectAll('tr');
        rows.classed('highlight', false);
        rows.filter(d=>docIds.indexOf(d.docId) > -1)
            .classed('highlight', true);
    }

    function fadeRows(docIds){
        let rows = tbody.selectAll('tr');
        rows.classed('faded', false);
        rows.filter(d=>docIds.indexOf(d.docId) > -1)
            .classed('faded', true);
    }

    function makeCells(rowData){
        let row = D3Select(this);
        let cells = row.selectAll('td')
            .data(columnsInfo);
        cells.exit().remove();
        cells.enter().append('td');
        cells = cells = row.selectAll('td')
            .html(d=>d.accessor(rowData))
            .on('click', d=>d.click(rowData))
            .on('mouseover', d=>d.mouseover(rowData))
            .on('mouseout', d=>d.mouseout(rowData))
            .attr('data-tippy-content', d=>d.tooltip(rowData))
            .call(styleCell);
        
        Tippy(cells.nodes(),{
            theme:'dark',
            duration: [500, 0],
            allowHTML: true
        }).forEach(t=>cellTooltips.push(t));
    }

    function styleRow(row){
        row.style('height', minRowHeight+'px')
            .style('font-size', Math.max((minRowHeight/4.5),11)+'px');
    }

    function styleCell(cell, isHeader=false){
        cell.style('cursor', d=>{return isHeader ? 'default' : d.cursor;})
            .style('text-align', d=>{return isHeader ? 'center': d.align;})
            .style('text-decoration', d=>{return isHeader ? 'none' : d.decoration;});
    }

    function addColumnInfo(column){
        function defaultValue(value, def){
            return typeof value === 'undefined' ? def : value;
        }
        let title = defaultValue(column.title, ''),
            tooltip = defaultValue(column.tooltip, ()=>{}),
            accessor = defaultValue(column.accessor, ()=>{}),
            mouseover = defaultValue(column.mouseover, ()=>{}),
            mouseout = defaultValue(column.mouseout, ()=>{}),
            click = defaultValue(column.click, ()=>{}),
            align = defaultValue(column.align, 'left'),
            decoration = defaultValue(column.decoration, 'none'),
            cursor = defaultValue(column.cursor, 'default');
        columnsInfo.push({title,tooltip,accessor,mouseover,mouseout,click,align,decoration,cursor});
    }

    function renderNRowsSelection(nRows){
        nRowsSelection.selectAll('span').remove();
        if(nRowsSelectionArray.length > 0){
            nRowsSelection.append('span')
                .text(nRowsText);
            let options = nRowsSelection.append('span').classed('options',true).selectAll('a').data(nRowsSelectionArray);
            options.enter().append('a')
                .text(d=>d)
                .classed('selected', d=>{return nRows == d;})
                .on('click', nRowSelectionCB);
        }
    }

    function resize(){
        tableWidth = width - tableBorderThickness*2;
        tableHeight = height - tableBorderThickness*2;
        minRowHeight = (tableHeight-6)/11.5;

        wrapper.style('width', tableWidth+'px')
            .style('height', tableHeight+'px')
            .style('border-width', tableBorderThickness);

        if(defaultText !== null){
            defaultText.style('top', function(){
                let pH = D3Select(this).node().offsetHeight;
                return (tableHeight/2-pH)+'px';
            });
        }

        // table.style('width', tableWidth-6);
    }
    resize();

    return Table;
}