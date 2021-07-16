
### Document Table

The document table panel module renders a list of document from `mainModel` or `subModel` files, produced by the Topic Mapping Pipeline model export module.

A Document Table is instantiated using `tMap`'s `DocTable` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let docTable = tMap.DocTable(PM.panel3.c, PM.panel3.w, PM.panel3.h);
```

This module is built with [the HTML panel API](#panel-api) and therefore has the same methods.

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `DocTable.setMinRowHeight([value])`

Lets you set the minimum height of rows in the table. The default minimum is set to one eleventh of the table height.
```javascript
docTable.setMinRowHeight(20); // -> the table's row is set to 20px
docTable.setMinRowHeight(); // -> the table's row is set to an eleventh of the table's height
```

#### `DocTable.setColumnsInfo([columns])

Lets you set the data for the table columns. `columns` should be an array, each entry containing the data for one column. For each column you can specify:
- `title`, the column header, defaults to `''`;
- `tooltip`, the tooltip text callback for the column's cells, defaults to `null`;
- `tooltipChart`, the tooltip chart callback for the column's cells, defaults to `null`;
- `accessor`, the value accessor function  for the column's cells, defaults to `()=>{}`;
- `mouseover`, the mouseover callback for the column's cells, defaults to `()=>{}`;
- `mouseout`, the mouseout callback for the column's cells, defaults to `()=>{}`;
- `click`, the click callback for the column's cells, defaults to `()=>{}`;
- `align`, the alignment style for the column's cells, defaults to `'left'`;
- `decoration`, the text decoration style for the column's cells, defaults to `'none'`; and
- `cursor`, the cursor style for the column's cells, defaults to `'default'`.

```javascript
let tableTooltip = d => {
    let fields = [];
    fields.push(`Word Count: ${d.wordCount}`);
    fields.push(`Relevance: ${Math.floor(d.weight*100)}%`);
    return fields.join(' - ');
}; // -> set a tooltip callback with the document's word count and weight, e.g. "Word Count: 104 - Relevance 30%"
let selectDoc = (e,d)=>{
    console.log(d);
    //...
}; // -> set a click callback printing the document data
let redirect = (e,d)=>{
    window.open(d.link, '_blank');
}; // -> set a click callback opening a new browser window to the document link
let formatDate = d=>{
    return format(d, '%b. %Y');
}; // -> set a function to format date values
docTable.setColumnsInfo([
    // set a title column, with tooltip and click callbacks
    {title:'Title',accessor:d=>d.title,tooltip:tableTooltip,click:selectDoc},
    // set an authors column, with tooltip and click callbacks
    {title:'Authors',accessor:d=>d.authors,tooltip:tableTooltip,click:selectDoc},
    // set a date column, showing the document's date formated, with tooltip and click callbacks
    {title:'Date',accessor:d=>formatDate(d.date),tooltip:tableTooltip,click:selectDoc},
    // set a link column, just showin 'link' underline, with tooltip and a redirect click callback
    {title:'Link',accessor:()=>'link',decoration:'underline',tooltip:tableTooltip,click:redirect}
    ]);
```

> Note that the click, mouseover, and mouseout callbacks have to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> In this instance, `datum` refers to the row data.
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details
> 
> The tooltip, tooltipChart, and accessor functions take the row data as unique argument. 

#### `DocTable.rowsFilter([options [, callback [, text]]])`

Lets you set filter options, on top of the table, for the table rows. `options` is the list of of options available for the filter, it defaults to `[]`, which completely removes the filter. `callback` is the callback function for clicks on the filter options. `text` is the text to display before the filter options for context, it defaults to `''`. On render, the filter will also print the number of rows in the table.
```javascript
docTable.rowsFilter([20,60,90],(e,d)=>{docTable.render(DM.getTableRows(50, d2=>Math.floor(d2.weight*100)>=d),d)},'Min Relevance'); // -> dislay 'Min Relevance: 20 60 90' on top of the table
// if the user clicks on 60, the table will have up to 50 rows with a document weight greater or equal to 60%

docTable.rowsFilter([10,20,50],(e,d)=>{docTable.render(DM.getTableRows(d),d)},'N Docs'); // -> dislay 'N Docs: 10 20 50' on top of the table
// if the user clicks on 20, the table will have up to 20 rows
```

> Note that the click callback has to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details


#### `DocTable.render(dataset [,filter])`

Renders the table using `dataset` to fill its rows. Each row will render its cells according to the columns info set previously. `filter` is an optional parameter informing the module if a filter option was used (to highlight it).
```javascript
let DM = tMap.DataManager();
DM.setTableRowsMainTopic('4'); // -> set the table rows to the top documents of main topic 4
docTable.render(DM.getTableRows(50)); // -> render the table using the top 50 documents set in data manager
``` 

#### `DocTable.highlightDocs(docIds)`

Mark the table rows as highlighted (CSS class), if their corresponding document id is part of the `docIds` list.
```javascript
docTable.highlightDocs(['34','56','87']); // -> mark documents 34, 56, and 87 as highlighted
```

#### `DocTable.fadeDocs(docIds)`

Mark the table rows as faded (CSS class), if their corresponding document id is part of the `docIds` list.
```javascript
docTable.highlightDocs(['21','35','67']); // -> mark documents 21, 35, and 67 as faded
```

#### `DocTable.doClusterize([boolean [, chunkSize]])`

Enable the table to utilise [clusterize.js](https://clusterize.js.org/), a third-party library chunking table rows and injecting them in the DOM chunk by chunk in order to process high numbers of rows. `boolean` is a flag for either enabling it (`true`) or disabling it (`false`), it defaults to `false`. `chunkSize` lets you set the number of rows to include in each chunk, it defaults to `100`. By default, the table will not use this option.

**Note that using this option will prevent tooltips from functioning.**

```javascript
docTable.doClusterize(true, 50); // -> table will be rendered by chunks of 50 rows 
```
