# Topic Mapping Interface - API doc

The Topic Mapping Interface script and stylesheet bundles are located in [`app/dist`](../app/dist).

The stylesheet contains the styles of all page modules as well as default styles for the page overall.
Check [this section](#styles) for more details.

The script sets up `tMap`, the top level library object for interacting with the Topic Map interface and its modules.

- [Page Layout Management](#tmappagemanager)

## `tMap.PageManager`

The page manager sets a grid on the HTML page that will automatically position and size containers for the modules.

It is instantiated as follow:
```javascript
let PM = tMap.PageManager(container, layout, controls, header, footer, minWidth, minHeight)
```
- `container` is a string selector for the DOM element that will contain all modules, e.g. `'div#app'`. It defaults to `'body'`.
- `layout` is a string specifying the desired page layout. It defaults to `'A'` (one panel taking the whole space).
- `controls` is a string specifying the desired page controls and there position. It defaults to `''` (no controls).
- `header` and `footer` are the string selectors for the DOM element acting as page header and footer. Their height will be deducted when computing the page size. They both default to `''` (no element).
- `minWidth` and `minHeight` are integers used to set the page minimum size. They both default to `600`. 

For more detail about the layout and controls parameters, check [this page](./PageLayout.md).

The Page Manager instance created, `PM`, is an object listing the selectors and sizes of each panels generated. For example, if you choose to generate layout with 3 panels and 2 controls, `PM` will contain 5 attributes: `panel1`, `panel2`, `panel3`, `control1`, and `control2`. Each of these attributes will have 3 attributes of their own: `c` the string selector for the container created, `w` the width available for it, and `h` the height.
```javascript
PM.panel1.c // --> the selector for panel1 container, typically 'div#panel1'
PM.panel1.w // --> the width available for panel1, e.g. 500
PM.panel1.h // --> the height available for panel1, e.g. 300
```

### `PageManager.watch`

The Page Manager instance also has a `watch` function available:
```javascript
PM.watch({
    panel: module
})
```

This provides a map between the panels' names and the interface modules. During window resizing, Page Manager will recompute the panels' sizes and automatically updates the modules.

## Styles