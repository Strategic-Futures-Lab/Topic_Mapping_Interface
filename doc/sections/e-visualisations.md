
## Visualisation Modules

The visualisation modules are view panels with an SVG structure. They all share [the same base API](#visualisation-api). At this stage, the Topic Mapping Interface comprises the following visualisation modules:
- [Bubble Topic Map](#bubble-topic-map)
- [Wordcloud](#worcloud)
- [Trend Chart](#trend-chart)
- [Bar Chart](#bar-chart)
- [Line Chart](#line-chart)

### Visualisation API

The visualisation modules are all built from the same base module, meaning that they share a common base API.

> Note that all of the functions below return the visualisation module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `Visualisation.setWidth(value)`

Sets the width of the visualisation, and automatically adjust its internal elements.
```javascript
let v = tMap.someVisualisation();
v.setWidth(600); // -> the visualisation width to 600 px
```

#### `Visualisation.setHeight(value)`

Sets the height of the visualisation, and automatically adjust its internal elements.
```javascript
let v = tMap.someVisualisation();
v.setHeight(300); // -> the visualisation height to 300 px
```

#### `Visualisation.setSize(width, height)`

Sets the width and height of the visualisation, and automatically adjust its internal elements.
```javascript
let v = tMap.someVisualisation();
v.setSize(600,300); // -> the visualisation width to 600 px and height to 300 px
```

#### `Visualisation.setMargin(values)`

Sets the margins of the visualisation, and automatically adjust its internal elements. The margins are given as a list: `[top, bottom, left, right]`.
```javascript
let v = tMap.someVisualisation();
v.setMargin([10,20,30,10]); // -> the visualisation margins to 10px top, 20px bottom, 30px left, and 10px right
```

#### `Visualisation.toggleBorder([boolean])`

Toggles a border around the visualisation module. The `boolean` parameter lets you specify which state you want: `true` = on, and `false` = off. It is optional will default to the opposite of the visualisation current state. Note that the visualisation border is on by default.
```javascript
let v = tMap.someVisualisation(); // -> the visualisation border is on
v.toggleBorder(true); // -> turns on the visualisation border (no effect)
v.toggleBorder(false); // -> removes the visualisation border
v.toggleBorder(); // -> turns on the visualisation border
v.toggleBorder(); // -> turns off the visualisation border
```

#### `Visualisation.toggleButton(position [,text, callback])`

Toggles a button on the visualisation. Each visualisation module can have four buttons, each identified by a `position`: `'TL'` for the top-left corner, `'TR'` for the top-right corner, `'BL'` for the bottom-left corner, and `'BR'` for the bottom-right corner. To toggle a button on, you must specify its `text` and `callback` function too. To turn it off, just specify the `position`.
```javascript
let v = tMap.someVisualisation();
v.toggleButton('BL', 'Action', ()=>{console.log('action BL')}); // adds a button to the bottom-left corner, with text 'Action', that prints 'action BL' to the console.
v.toggleButton('BL'); // removes the button at the bottom-left corner.
```

#### `Visualisation.toggleTitle([text, [position]])`

Toggles a title on the visualisation. If `text` is specified, toggles the title on with this text, otherwise toggles the title off. `position` lets you choose where you want the title, either at the top `'T'` (default) or bottom `'B'` of the visualisation.
```javascript
let v = tMap.someVisualisation();
v.toggleTitle('Visualisation'); // -> puts 'Visualisation' as the top of the visualisation
v.toggleTitle('Visualisation', 'B'); // -> moves 'Visualisation' as the bottom of the visualisation
v.toggleTitle(); // -> removes 'Visualisation' from the visualisation
```

#### `Visualisation.addDefaultText(string [,scale [,blinking]])

Puts a message, `string`, at the center of the visualisation. `scale` lets you specify the message size, defaults to 1. `blinking` lets you specify if you want the message to blink `true` or not `false` (default), for example when loading data.
```javascript
let v = tMap.someVisualisation();
v.addDefaultText('Loading data', 1.5, true); // -> large blinking text saying 'Loading data'
``` 
Note that any message printed this way will be automatically removed once the visualisation is rendered.
