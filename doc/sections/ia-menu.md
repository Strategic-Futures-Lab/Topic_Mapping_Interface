
### Floating Menu

The floating menu module allows you to add infromation/functionalities which aren't directly linked to the views (e.g. model information modal, external link, download modal, etc.).

A Floating Menu is instantiated using `tMap`'s `Menu` function. It takes two parameters: a DOM `container`, and an initial button `height`. These parameters are typically returned by the [Page Manager](#page-manager). Note that you can simply pass `'body'` as the DOM `container`, in which case the menu will be displayed on the top-left cormer of the page.
```javascript
let PM = tMap.PageManager(...);
let menu = tMap.Menu(PM.control3.c, PM.control3.h);
```

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `Menu.setSize(value)`

Sets the height (and width) of the menu's button. Note that the button size cannot be smaller than `30px`.
```javascript
menu.setSize(50); // -> the menu's button size will be 50px
```

#### `Menu.addShare(urlCallback)`

Adds an item to the menu to open a modal with a link to the current application view. `urlCallback` will be called to generate the url.
```javascript
let SM = tMap.StateManager();
menu.addShare(()=>{return SM.buildURL();}); // -> adds an menu item that will trigger a modal with a link to share the application in its current state
```

#### `Menu.addScreenshot(selector [, timeout])`

Adds an item to the menu that will capture a screenshot of the application, and launch a save dialog. `selector` should point to the DOM element from which the capture is made, e.g. `'body'` or `'#app'`. `timeout` is the delay afterwhich the capture will be made (e.g. to allow for the menu to be closed), it defaults to 1000ms (1s).
```javascript
menu.addScreenshot('#app'); // -> adds a menu item that will capture the page elements under '#app' and launch a save dialog
```

#### `Menu.addDownload(downloadData)`

Adds an item to the menu that will display a modal with a list of links to data files, making them available for download. `downloadData` is a list of `name` and `url` pairs, `name` being the link's text in the modal, and `url` the address of the data file.
```javascript
menu.addDownload([{name:'Model data',url:'./data/model.csv'},{name:'Model statistics',url:'./data/model_stats.json'}]); // -> adds a menu item that will trigger a modal with two links, one for the model data csv file, one for the model statistic json file.
``` 

#### `Menu.addLink(text, url [, newTab])`

Adds a hyperlink item to the menu. `text` is the link's text, and `url` is the link address. `newTab` is an option allowing you to specify if the link should be open in the same browser tab (`false`) or a new browser tab (`true`, default).
```javascript
menu.addLink('Other map', './otherMap.html', false); // -> adds a link to another topic map application, that will open in the same tab
menu.addLink('Contact', '../contact.html'); // -> adds a link to a contact page, that will open in a new tab
```

#### `Menu.addCharts(title, chartCallbacks)`

Adds an item to the menu that will trigger a modal display one or more chart. `title` lets you set the modal title. `chartCallbacks` is a set of callback functions that should instantiate and render charts. These callbacks will be called using three parameter: the container for the chart inside the modal, the available width, and the available height. Using these dimensions for the chart will ensure a good fit in the modal.
```javascript
menu.addCharts('Model Stats', [
    (c,w,h)=>{
        tMap.LineChart(c,w,h)
            .toggleTitle('Stat A')
            .setAxesNames('Iterations', 'Stat A')
            .render(statAData); // -> renders a line chart of stat A data
    },
    (c,w,h)=>{
        tMap.LineChart(c,w,h)
            .toggleTitle('Stat B')
            .setAxesNames('Iterations', 'Stat B')
            .render(statBData); // -> renders a line chart of stat B data
    }
]);
```

#### `Menu.addModelInfo(mainMetadata [, subMetadata [, extraLines]])`

Adds an item to the menu that will trigger a modal with details about the model(s) extracted from its(their) metadata. `mainMetadata` is the main model's metadata, `subMetadata` is the optional sub model's metadata (defaults to `null`). `extraLines` let you specify (as HTML strings) any custom paragraphs you would like appended.
```javascript
let DM = tMap.DataManager();
menu.addModelInfo(DM.getMainModelMetadata(), DM.getSubModelMetadata(), ['Additional <b>important</b> information.']); // -> adds a menu item triggering a modal showing the main and sub models metadata, along with an custom extra paragraph
```

#### `Menu.addModal(title, content)`

Adds an item to the menu that will trigger a modal with custom `title` and `content` (in HTML).
```javascript
menu.addModal('Contact', '<p>You can contact us <a href="mailto:contact@domain.com">here</a>.</p>'); // -> adds a menu item that triggers a modal showing a contact link
```
