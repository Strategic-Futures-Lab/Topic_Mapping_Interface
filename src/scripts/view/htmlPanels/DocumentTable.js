import PanelWrapper from './utils/PanelWrapper';

import {select as D3Select} from 'd3-selection';
import Tippy from 'tippy.js';

import '../../../styles/htmlPanels/DocTable.less';

export default function(container='body', width=800, height=600){

    let DocTable = PanelWrapper(container, width, height, 'doctable');

    // private

    let minRowHeight = DocTable._panelHeight/11,
        minRowHeightSet = -1;

    let columnsInfo = [];

    let nRowsSelectionArray = [],
        nRowsSelectionCB = ()=>{},
        nRowsText = '';

    let cellTooltips = [];

    let docTable = DocTable._wrapper.append('div')
        .classed('table', true);
    let nRowsSelection = docTable.append('span')
        .classed('nRowsSelect', true);
    let table = docTable.append('table'),
        thead = table.append('thead'),
        tbody = table.append('tbody'),
        titleRow = thead.append('tr');

    function addColumnInfo(c){
        let defaultValue = (value, def)=>{
            return typeof value === 'undefined' ? def : value;
        };
        let title = defaultValue(c.title, ''),
            tooltip = defaultValue(c.tooltip, ()=>{}),
            accessor = defaultValue(c.accessor, ()=>{}),
            mouseover = defaultValue(c.mouseover, ()=>{}),
            mouseout = defaultValue(c.mouseout, ()=>{}),
            click = defaultValue(c.click, ()=>{}),
            align = defaultValue(c.align, 'left'),
            decoration = defaultValue(c.decoration, 'none'),
            cursor = defaultValue(c.cursor, 'default');
        columnsInfo.push({title, tooltip, accessor, mouseover, mouseout,
            click, align, decoration, cursor});
    }

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

    function makeCells(rowData){
        let row = D3Select(this);
        let cells = row.selectAll('td')
            .data(columnsInfo);
        cells.exit().remove();
        cells.enter().append('td');
        cells = cells = row.selectAll('td')
            .html(d=>d.accessor(rowData))
            .on('click', (e,d)=>d.click(e,rowData))
            .on('mouseover', (e,d)=>d.mouseover(e,rowData))
            .on('mouseout', (e,d)=>d.mouseout(e,rowData))
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

    function renderNRowsSelection(nRowsTotal){
        nRowsSelection.selectAll('span').remove();
        if(nRowsSelectionArray.length > 0){
            if(nRowsText.length > 0){
                nRowsSelection.append('span')
                    .text(nRowsText+':');
            }
            let options = nRowsSelection.append('span')
                .classed('options',true)
                .selectAll('a')
                .data(nRowsSelectionArray);
            options.enter().append('a')
                .text(d=>d)
                .classed('selected', d=>{return nRowsTotal == d;})
                .on('click', nRowsSelectionCB);
        }
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

    DocTable._onResize = ()=>{
        minRowHeight = Math.max(minRowHeightSet, (DocTable._panelHeight-6)/11.5);
    };

    // public

    DocTable.setMinRowHeight = function(h){
        minRowHeightSet = h;
        minRowHeight = Math.max(minRowHeightSet, minRowHeight);
        return DocTable;
    };
    DocTable.setColumnsInfo = function(columns=[]){
        columnsInfo = [];
        columns.forEach(addColumnInfo);
        return DocTable;
    };
    DocTable.nRowsSelection = function(options=[], cb=()=>{}, text=''){
        nRowsSelectionArray = options,
        nRowsSelectionCB = cb,
        nRowsText = text;
        return DocTable;
    };
    DocTable.render = function(dataset){
        DocTable._removeDefaultText();
        renderTable(dataset);
        return DocTable;
    };
    DocTable.highlightDocs = function(docIds){
        highlightRows(docIds);
        return DocTable;
    };
    DocTable.fadeDocs = function(docIds){
        fadeRows(docIds);
        return DocTable;
    };

    return DocTable;
}