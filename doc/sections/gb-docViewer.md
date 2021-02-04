
### Document Viewer

The document viewer panel module renders a document's data from `mainModel` or `subModel` files, produced by the Topic Mapping Pipeline model export module.

A Document Viewer is instantiated using `tMap`'s `DocViewer` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let docViewer = tMap.DocViewer(PM.panel4.c, PM.panel4.w, PM.panel4.h);
```

This module is built with [the HTML panel API](#panel-api) and therefore has the same methods.

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `DocViewer.setFields([fields])`

Lets you specify which document fields the document viewer should display. `fields` is an optional list, it defaults to `null`, meaning to desired fields, and therefore the viewer will disply all document fields in any order. The `fields` list can take multiple forms:
- a list of string, corresponding to the fields' keys (and order of fields) you want displayed for the document data;
- a list of lists, corresponding to the fields and order of fields you wan displayed for the document data:
    - with a first string item: the field's key in the document data;
    - with an optional second item: the key value you want displayed on the viewer;
    - with an optional third item: a transform function for the field's value (e.g. number format).
```javascript
docViewer.setFields(['title','authors',['university','institution',d=>`University of ${d}`],'abstract',['money','grant',d=>format(d,'£.2f')]);
// -> in the doc viewer display the document's title, authors, university, abstract and money, in that order
// university should be renamed institution, and the field value should have 'University of ' prepended to it
//  money should be renamed grant, and the field value should be formatted to a 2 decimal fixed value with a £ prefix
```

#### `DocViewer.render(docData)`

Renders the document viewer with the provided document data.
```javascript
docTable.setColumnsInfo([{
    title:Title,
    accessor:d=>d.docData.title,
    click(e,d)=>{
        docViewer.render(d.docData)
    }
}])
// -> in the document table, show one column for the docuemnts' title. Upon clicking on a title, render the document viewer with the corresponding document data.
```
