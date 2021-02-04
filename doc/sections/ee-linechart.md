
### Line Chart

The line chart visualisation module renders a set of data point with two scalar attributes (x and y). This chart is typically used to show the model loglikelihood data, which is currently embedded in the [floating menu module](#floating-menu).

A Line Chart is instantiated using `tMap`'s `LineChart` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let lineChart = tMap.LineChart(PM.panel5.c, PM.panel5.w, PM.panel5.h);
```

This module is built with [the visualisation API](#visualisation-api) and therefore has the same base methods.

#### `LineChart.setMarginLeft(value)`

Sets the left margin for the line chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
linechart.setMarginLeft(30); // -> the left margin will now be 30 pixels
```

#### `LineChart.setMarginBottom(value)`

Sets the bottom margin for the line chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
linechart.setMarginBottom(20); // -> the bottom margin will now be 20 pixels
```

#### `LineChart.setXAxisName(name)`

Sets the horizontal axis name (x). This name is used when showing the tooltips for dots on the line chart. The default name is set to `'x'`.
```javascript
linechart.setXAxisName('Iteration'); // -> dot tooltip will display 'Iteration: 30' for example
```

#### `LineChart.setYAxisName(name)`

Sets the vertical axis name (y). This name is used when showing the tooltips for dots on the line chart. The default name is set to `'y'`.
```javascript
linechart.setYAxisName('Likelihood'); // -> dot tooltip will display 'Likelihood: 7.09' for example
```

#### `LineChart.setAxesNames(nameX, nameY)`

Combines the previous two functions. `nameX` will be used for the horizontal axis, and `nameY` for the vertical axis.
```javascript
linechart.setAxesNames('Iteration', 'Likelihood'); // -> dot tooltip will display 'Iteration: 30<br>Likelihood: 7.09' for example
```

#### `LineChart.setXTicks([number [, format]])`

Allows you to the set the number and format of tick marks on the chart's vertical axis (x). By default, there are 10 ticks with no specific format.
```javascript
linechart.setXTicks(5, '.0f'); // -> put 5 tick marks formated to be in fixed notation with no decimal points
```
Refer to [D3's number format module](https://github.com/d3/d3-format) for more details on formats.

#### `LineChart.setYTicks([number [, format]])`

Allows you to the set the number and format of tick marks on the chart's horizontal axis (y). By default, there are 10 ticks with no specific format.
```javascript
linechart.setXTicks(10, '.2e'); // -> put 10 tick marks formated to be in exponent notation with two decimal points
```
Refer to [D3's number format module](https://github.com/d3/d3-format) for more details on formats.

#### `LineChart.setTicks([numberX [, numberY [, formatX [, formatY]]]])`

Combines the previous two functions. `numberX` and `numberY` will be the number of ticks on the horizontal and vertical axes respectively. `formatX` and `formatY` will be the tick format on the horizontal and vertical axes respectively.
```javascript
linechart.setTicks(5, 10, '.0f', '.2e');
// -> put 5 tick marks formated to be in fixed notation with no decimal points on the horizontal axis
//    and put 10 tick marks formated to be in exponent notation with two decimal points on the vertical axis
```

#### `LineChart.render(dataset)`

Renders the line chart using the provided dataset, which assumes the following format: `[{x,y}]`.
```javascript
let data = [{x:10,y:3.78},{x:20,y:4.789},{x:30,y:6.098}];
linechart.render(data); // -> renders data
```
