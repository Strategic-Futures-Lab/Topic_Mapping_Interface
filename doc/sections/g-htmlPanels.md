
## HTML Panel Modules

The HTML panel modules are view panels with an HTML structure (e.g. table, div, etc.). They all share [the same base API](#panel-api). Currently, the Topic Mapping Interface comprises the following HTML panel modules:
- [Document Table](#document-table)
- [Document Viewer](#document-viewer)

### Panel API

The HTML panel modules are all built from the same base module, meaning that they share a common base API.

> Note that all of the functions below return the panel module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `Panel.setWidth(value)`

Sets the panel width, and automatically adjust its internal elements.
```javascript
let p = tMap.somePanel();
p.setWidth(600); // -> the panel width to 600px
```

#### `Panel.setHeight(value)`

Sets the panel height, and automatically adjust its internal elements.
```javascript
let p = tMap.somePanel();
p.setHeight(300); // -> the panel height to 300px
```

#### `Panel.setSize(width, height)`

Sets the panel's width and height, and automatically adjust its internal elements.
```javascript
let p = tMap.somePanel();
p.setSize(600,300); // -> the panel width to 600px and height to 300px
```

#### `Panel.toggleBorder([boolean])`

Toggles a border around the panel module. The `boolean` parameter lets you specify which state you want: `true` = on, and `false` = off. It is optional will default to the opposite of the visualisation current state. Note that the visualisation border is on by default.
```javascript
let p = tMap.somePanel(); // -> the panel border is on
p.toggleBorder(true); // -> turns on the panel border (no effect)
p.toggleBorder(false); // -> removes the panel border
p.toggleBorder(); // -> turns on the panel border
p.toggleBorder(); // -> turns off the panel border
```

#### `Panel.toggleTitle([text])`

Toggles a title on the visualisation. If `text` is specified, toggles the title on with this text, otherwise toggles the title off. The title is always placed on top of the panel.
```javascript
let p = tMap.somePanel();
p.toggleTitle('Panel A'); // -> puts 'Panel A' as the top of the panel
p.toggleTitle(); // -> removes 'Panel A' from the panel
```

#### `Panel.addDefaultText(string, [, size [, blinking]])`

Puts a message, `string`, at the center of the visualisation. `size` lets you specify the message size in `em`, defaults to 1. `blinking` lets you specify if you want the message to blink `true` or not `false` (default), for example when loading data.
```javascript
let p = tMap.somePanel();
p.addDefaultText('Loading data', 1.5, true); // -> large blinking text saying 'Loading data'
``` 
Note that any message printed this way will be automatically removed once the panel renders data.
