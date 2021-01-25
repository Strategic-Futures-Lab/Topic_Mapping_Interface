
### Bar Chart

The bar chart visualisation modules render distribution data from the [Data Manager's distributions features](#distribution-features), itself working with data from the Topic Mapping Pipeline distribute topics module.

There are two versions of bar charts: horizontal and vertical.

A Bar Chart is instantiated using `tMap`'s `HorizontalBarChart` or `VerticalBarChart` functions. Like most page modules, they take three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let barchat1 = tMap.HorizontalBarChart(PM.panel4.c, PM.panel4.w, PM.panel4.h);
let barchat2 = tMap.VerticalBarChart(PM.panel5.c, PM.panel5.w, PM.panel5.h);
```

These modules are built with [the visualisation API](#visualisation-api) and therefore have the same base methods.

> Note that all of the functions below return the visualisation module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `BarChart.setMarginLeft(value)`

Sets the left margin for the bar chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
barchart.setMarginLeft(30); // -> the left margin will now be 30 pixels
```

#### `BarChart.setMarginBottom(value)`

Sets the bottom margin for the bar chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
barchart.setMarginBottom(20); // -> the left margin will now be 20 pixels
```

#### `BarChart.setTicks([number [, format]])`

Allows you to the set the number and format of tick marks on the charts' continuous axis. By default, there are 10 ticks with no specific format.
```javascript
barchart.setTicks(5, '.0%'); // -> put 5 tick marks formated to be percentages with no decimal points
```
Refer to [D3's number format module](https://github.com/d3/d3-format) for more details on formats.

#### `BarChart.setMaxValue(value)`

Sets the chart's maximum value on the continuous axis. Since, the continuous scale is adjust at every render, this allows you to keep the same scale (`0, maxValue`).
```javascript
barchart.setMaxValue(1); // -> the maximum value will always be 1, i.e. 100% if formated with '.0%'
```

#### `BarChart.setTransition([duration [, delay]])`

Sets the duration and delay (per bar) value for transition animation on the bar chart. These values default to `100`ms for `duration` and `50`ms for delay. You can disable transitions by setting the duration value to `0`.
```javascript
barchart.setTransition(200, 100); // -> sets the transitions to 200ms duration and 100ms delay (per bar)
```

#### `BarChart.setTooltip(textFunction)`

Sets the function used to build the bars' tooltip text. If defined, this text function will be called with the bar's datum as parameter. You can set this text function to `null` in order to disable the text tooltip.
```javascript
barchart.setTooltip(d=>`<b>${d.key}</b>: ${d.value}`); // bars' tooltip will print '<b>A</b>: 0.32' for example.
```

#### `BarChart.setTooltipChart(charFunction)`

Sets the function used to build the bars' tooltip chart. If defined, this chart function will be called with the tooltip's DOM container and the bar's datum as parameter. You can set this chart function to `null` in order to disable the chart tooltip.
```javascript
let DM = tMap.DataManager();
barchart.setTooltipChart((t,d)=>{
    tMap.HorizontalBarChart(t, 200, 100)
        .render(DM.getMainTopicsDistrib(d.key));
}); // bars' tooltip include an horizontal bar chart showing the bar's key field distribution.
```

#### `BarChart.setBarClick(callback)`

Sets the callback for click events on the bars.
```javascript
barchart.setBarClick((e,d)=>{console.log(d.key)}); // -> on bar click print the bar's key
```

> Note that the callback has to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details 

#### `BarChart.render(distributionData)`

Renders the bar chart using the provided distribution data (in the format: `[{key,value}]`). This type of data is typically obtained from the [Data Maneger's distribution features](#distribution-features).
```javascript
let DM = tMap.DataManager();
barchart.render(DM.getMainTopicDistribEntry('4')); // -> renders the distribution for the main topic '4'
```

#### `BarChart.selectBar([key])`

Sets the bar with key `key` as selected, using the CSS class `selected`. The parameter `key` is optional, not providing it, or setting it as `null` will unselect any previously selected bar.
```javascript
barchart.selectBar('A'); // -> bar with key 'A' is marked as selected
barchart.selectBar(); // -> every bar are unselected
```
