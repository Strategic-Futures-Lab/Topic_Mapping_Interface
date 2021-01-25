
## State Manager

The state manager offers a centralised system to set and access the various state of the application, e.g. selected main topic, current search value, or selected distribution.

It is instantiated as follow:
```javascript
let SM = tMap.StateManager();
```

You can then access the state management methods from `SM`.

- [Setting/Accessing States](#states)
- [URL features](#url-features)

### States

There are currently six states controlled by the State Manager:
- `mainTopic`: the topic selected on a main map;
- `subTopic`: the topic selected on a sub map;
- `doc`: the document selected in a document table;
- `distrib`: the distribution field selected to set the maps' opacity;
- `date`: the date selected on a trend chart to filter documents; and
- `search`: the search string entered in the search box.

#### `StateManager.state(name [, value])`

If `value` is specified, lets you set it as the value for the state associated with `name`. If no `value` is given, returns the current value of the state associated with `name`. If no state can be found with `name`, the function will throw an error.
```javascript
SM.state('mainTopic', '20'); // -> set the currently selected topic on the main map to the topic with id '20'
SM.state('search', 'label1 label2'); // -> set the current search string to 'label1 label2'
SM.state('mainTopic'); // -> returns '20'
```

#### `StateManager.reset()`

Resets the state values to their default: `null`.
```javascript
SM.reset();
SM.state('mainTopic'); // -> returns null
```

### URL features

The State Managers includes features allowing you to build and parse URLs with the states' values embedded in them.

#### `StateManager.buildURL([customBase])`

Returns a URL string with the states' values embedded. `customBase` is an optional string letting you define your own domain and path.
```javascript
// page is at domain.com/page.html
SM.state('mainTopic', '20');
SM.state('search', 'label1 label2');
SM.state('doc', '34');
let url = SM.buildURL();
console.log(url); // -> https://domain.com/page.html?t=20&d=34&s=label1%20label2 

let url = SM.buildURL('domain.com/otherPage.html');
console.log(url); // -> https://domain.com/otherPage.html?t=20&d=34&s=label1%20label2 
```

#### `StateManager.parseURL()`

Parses the HTML document's URL and sets the states accordingly.
```javascript
// document URL : https://domain.com/page.html?t=20&d=34&s=label1%20label2
SM.parseURL();
console.log(SM.state('mainTopic')); // -> '20'
console.log(SM.state('search')); // -> 'label1 label2'
``` 
