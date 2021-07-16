import PanelWrapper from './utils/PanelWrapper';

import {select as D3Select} from 'd3-selection';
import Tippy from 'tippy.js';
import Clusterize from 'clusterize.js';

import '../../../styles/htmlPanels/DocTable.less';

export default function(container='body', width=800, height=600){

    let DocTable = PanelWrapper(container, width, height, 'doctable');

    // private

    let minRowHeight = DocTable._panelHeight/11,
        minRowHeightSet = -1;

    let columnsInfo = [];

    let rowsFilterArray = [],
        rowsFilterCB = ()=>{},
        rowsFilterText = '';

    let cellsTooltips = [];

    let doClusterize = false,
        clusterize = null,
        chunkSize = 100;

    let docTable = DocTable._wrapper.append('div')
        .classed('table', true);
    let rowsFilter = docTable.append('span')
        .classed('rowsFilter', true);
    let table = docTable.append('table'),
        thead = table.append('thead'),
        tbody = table.append('tbody'),
        titleRow = thead.append('tr');

    function setupClusterize(){
        if(doClusterize){
            DocTable._wrapper.attr('id', 'scrollAreaClusterize')
                .classed('clusterize-scroll', true);
            tbody.attr('id', 'contentAreaClusterize')
                .classed('clusterize-content', true);
        } else {
            DocTable._wrapper.attr('id', null)
                .classed('clusterize-scroll', false);
            tbody.attr('id', null)
                .classed('clusterize-content', false);
        }
    }

    function addColumnInfo(c){
        let defaultValue = (value, def)=>{
            return typeof value === 'undefined' ? def : value;
        };
        let title = defaultValue(c.title, ''),
            tooltip = defaultValue(c.tooltip, null),
            tooltipChart = defaultValue(c.tooltipChart, null),
            accessor = defaultValue(c.accessor, ()=>{}),
            mouseover = defaultValue(c.mouseover, ()=>{}),
            mouseout = defaultValue(c.mouseout, ()=>{}),
            click = defaultValue(c.click, ()=>{}),
            align = defaultValue(c.align, 'left'),
            decoration = defaultValue(c.decoration, 'none'),
            cursor = defaultValue(c.cursor, 'default');
        columnsInfo.push({title, tooltip, tooltipChart, accessor, mouseover, mouseout,
            click, align, decoration, cursor});
    }

    function renderTable(dataset, filter=null){
        if(clusterize != null){
            clusterize.destroy();
        }
        renderDataRows(dataset);
        renderRowsFilter(filter, dataset.length);
        renderTitleRow();
        if(doClusterize){
            fitHeaders();
            clusterize = new Clusterize({
                scrollId: 'scrollAreaClusterize',
                contentId: 'contentAreaClusterize',
                rows_in_block: chunkSize,
                callbacks: {
                    clusterChanged: fitHeaders
                }
            });
        }
    }

    function fitHeaders(){
        let firstRow = tbody.select('tr');
        let columnsWidth = [];
        firstRow.selectAll('td').each(function() {
            columnsWidth.push(this.offsetWidth);
        });
        titleRow.selectAll('th').each(function(d,i) {
            D3Select(this).attr('width', columnsWidth[i]);
        });
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
        cellsTooltips.forEach(t=>t.destroy());
        cellsTooltips = [];

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
        cells = row.selectAll('td')
            .html(d=>d.accessor(rowData))
            .on('click', (e,d)=>d.click(e,rowData))
            .on('mouseover', (e,d)=>d.mouseover(e,rowData))
            .on('mouseout', (e,d)=>d.mouseout(e,rowData))
            .call(styleCell)
            .call(attachCellCallback, rowData);
    }

    function styleRow(rows){
        rows.style('height', minRowHeight+'px')
            .style('font-size', Math.max((minRowHeight/4.5),11)+'px');

    }

    function styleCell(cells, isHeader=false){
        cells.style('cursor', d=>{return isHeader ? 'default' : d.cursor;})
            .style('text-align', d=>{return isHeader ? 'center': d.align;})
            .style('text-decoration', d=>{return isHeader ? 'none' : d.decoration;});
    }

    function attachCellCallback(cells, rowData){

        cells.attr('data-tippy-content', d=>{
            if(d.tooltip !== null){
                return d.tooltip(rowData);
            }
        });

        cells.each(function(d){
            if(!doClusterize && (d.tooltip !== null || d.tooltipChart !== null)){
                cellsTooltips.push(
                    Tippy(this,{
                        theme: d.tooltip !== null ? 'dark' : 'light',
                        duration: [500, 0],
                        allowHTML: true,
                        onShow(t){
                            if(d.tooltipChart !== null){
                                d.tooltipChart(t.popper, rowData);
                            }
                        },
                        onHidden(t){
                            // remove any svg created
                            D3Select(t.popper).select('svg').remove();
                        }
                    })
                );
            }

        });

        
    }

    function renderRowsFilter(filter=null, nRows=-1){
        rowsFilter.selectAll('span').remove();
        if(rowsFilterArray.length > 0){
            if(rowsFilterText.length > 0){
                rowsFilter.append('span')
                    .text(rowsFilterText+':');
            }
            let options = rowsFilter.append('span')
                .classed('options',true)
                .selectAll('a')
                .data(rowsFilterArray);
            options.enter().append('a')
                .text(d=>d)
                .classed('selected', d=>{return filter == d;})
                .on('click', rowsFilterCB);
            rowsFilter.append('span')
                .text(`(${nRows} documents)`);
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

    DocTable.setMinRowHeight = function(h=-1){
        minRowHeightSet = h;
        minRowHeight = Math.max(minRowHeightSet, minRowHeight);
        return DocTable;
    };
    DocTable.setColumnsInfo = function(columns=[]){
        columnsInfo = [];
        columns.forEach(addColumnInfo);
        return DocTable;
    };
    DocTable.rowsFilter = function(options=[], cb=()=>{}, text=''){
        rowsFilterArray = options,
        rowsFilterCB = cb,
        rowsFilterText = text;
        return DocTable;
    };
    DocTable.render = function(dataset, filter=null){
        DocTable._removeDefaultText();
        renderTable(dataset, filter);
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
    DocTable.doClusterize = function(bool=false, size=100){
        doClusterize = bool;
        chunkSize = size;
        setupClusterize();
        return DocTable;
    };

    return DocTable;
}