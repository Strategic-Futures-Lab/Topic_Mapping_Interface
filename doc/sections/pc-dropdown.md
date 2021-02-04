
### Dropdown Filter

The dropdown filter module allows you to select a filter value for the topic maps' opacities.

A Dropdown Filter is instantiated using `tMap`'s `Dropdown` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let dropdown = tMap.Dropdown(PM.control2.c, PM.control2.w, PM.control2.h);
```

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `Dropdown.setWidth(value)`

Lets you set the width of the dropdown.
```javascript
dropdown.setWidth(150); // -> dropdown is now 150px wide
```

#### `Dropdown.setHeight(value)`

Lets you set the height of the dropdown.
```javascript
dropdown.setWidth(80); // -> dropdown is now 80px tall
```

#### `Dropdown.setSize(width, height)`

Lets you set the width and height of the dropdown together.
```javascript
dropdown.setSize(200, 90); // -> dropdown is now 200px wide and 90px tall
```

#### `Dropdown.setOptions(values)`

Lets you set the dropdown options. `values` takes the form of a list of text (what is displayed on the page) and value (what is used under the hood) pairs. These pairs are typically returned by the Data Manager [`getDistributionLabels` function](#datamanagergetdistributionlabelstexttransform).

> This triggers the change event, and by extenstion calls the callback function

```javascript
let DM = tMap.DataManager();
// get DM to have distribution data
let distribValues = DM.getDistributionLabels();
distribValues.unshift({text: 'All', value: 'all'}); // -> prepend an entry for no filter
dropdown.setOptions(distribValues); // -> dropdown now has topic distribution labels as options
```

#### `Dropdown.setSelectCB(callback)`

Lets you set the callback function for change event on the option selection. `callback` allows one parameter: the `value` of the option selected.
```javascript
let SM = tMap.StateManager();
dropdown.setSelectCB(value=>{
    SM.state('distrib', value); // -> update the state manager with the new distribution filter value
    // ... set the opacities of topic maps
})
```

#### `Dropdown.setSelected(value)`

Lets you programmatically select one of the dropdown option based on its `value`.

> This triggers the change event, and by extenstion calls the callback function

```javascript
dropdown.setSelected('all'); // -> selects the option with value 'all'
```

#### `Dropdown.getSelected()`

Returns the data (text/value pair) of the currently selected option in the dropdown.
```javascript
dropdown.setSelected('all'); // -> selects the option with value 'all'
dropdown.getSelected('all'); // -> returns {text:'All', value:'all'}
```
