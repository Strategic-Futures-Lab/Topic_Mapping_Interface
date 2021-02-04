
### Search Box

The search box module allows you to coordinate the search and highlight of labels accross the different view panels.

A Search Box is instantiated using `tMap`'s `Search` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let search = tMap.Search(PM.control1.c, PM.control1.w, PM.control1.h);
```

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `Search.setWidth(value)`

Lets you set the width of the search box.
```javascript
search.setWidth(150); // -> search box is now 150px wide
```

#### `Search.setHeight(value)`

Lets you set the height of the search box.
```javascript
search.setWidth(80); // -> search box is now 80px tall
```

#### `Search.setSize(width, height)`

Lets you set the width and height of the search box together.
```javascript
search.setSize(200, 90); // -> search box is now 200px wide and 90px tall
```

#### `Search.setPlaceholder(string)`

Lets you set the placeholder text inside the search input. By default the placeholder is set to `'Search labels...'`.
```javascript
search.setPlaceholder('Search topics'); // -> search input placeholder is now 'Search topics'
```

#### `Search.setSearchCB(callback)`

Lets you set the callback function that will be called upon any input in the search. This callback function takes one argument: the current text in the search input (in lower case).
```javascript
let SM = tMap.StateManager();
let DM = tMap.DataManager();
search.setSearchCB(str=>{
    let query = str.length > 0 ? str : null; // -> checks the search value and set it to null if empty
    SM.state('search', query); // -> sets the search state to the search value
    // ...
    DM.setSearchTerm(SM.state('search')); // -> use state manager to set the search value in the data manager, e.g. for later retrieval of topic id
})
```

#### `Search.setValue(string)`

Lets you manually set the search input value.
```javascript
let SM = tMap.StateManager();
search.setValue(SM.state('search')); // -> sets the search input value to the state manager's search state
```

#### `Search.getValue()`

Returns the current search input value.
```javascript
console.log(search.getValue()); // -> returns '' (i.e. empty search);
let SM = tMap.StateManager();
search.setValue(SM.state('search'));
console.log(search.getValue()); // -> returns the updated search value, e.g. 'label1'
```
