
### Trend Chart

The trend chart visualisation module renders date distribution data from the [Data Manager's trend features](#trend-features), itself working with data from the Topic Mapping Pipeline distribute topics module, when applied on dates.

A Trend Chart is instantiated using `tMap`'s `TrendChart` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let trendchart = tMap.TrendChart(PM.panel4.c, PM.panel4.w, PM.panel4.h);
```

This module is built with [the visualisation API](#visualisation-api) and therefore has the same base methods.

> Note that all of the functions below return the visualisation module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `TrendChart.setMarginLeft(value)`

Sets the left margin for the trend chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
trendchart.setMarginLeft(30); // -> the left margin will now be 30 pixels
```

#### `TrendChart.setMarginBottom(value)`

Sets the bottom margin for the trend chart. This function is mostly useful to adjust the space for the axis labels.
```javascript
trendchart.setMarginBottom(20); // -> the left margin will now be 20 pixels
```

#### `TrendChart.setValueTicks([number [, tickFormat]])`

Allows you to the set the number and format of tick marks on the chart's continuous value axis. By default, there are 10 ticks with no specific format.
```javascript
trendchart.setValueTicks(6, '.1f'); // -> put 6 tick marks formated to be fixed 1 decimal with
```
Refer to [D3's number format module](https://github.com/d3/d3-format) for more details on formats.

#### `TrendChart.setDateTicks(inFormat [, outFormat])`

Allows you to set the format of tick marks on the chart's category axis, i.e. the dates. `inFormat` should be the date format in the data. `outFormat` allows you to set a different format for the tick marks, by default it will be the same as the format in the data.
```javascript
trendchart.setDateTicks('%Y-%m'); // -> expecting the date in the data to be like '2013-07', and will have the ticks as such
trendchart.setDateTicks('%Y-%m', '%b. %Y'); // -> expecting the date in the data to be like '2013-07', and will have the ticks like 'Jul. 2013'
```

#### `TrendChart.setMaxValue(value)`

Sets the chart's maximum value on the value axis. Since the continuous scale is adjusted at every render, this allows you to keep the same scale (`0, maxValue`). The default maximum value is `-1`, which is interpreted as no maximum, i.e. use the next render maximum. 
```javascript
trendchart.setMaxValue(1); // -> the maximum value will always be 1, i.e. 100% if formated with '.0%'
```

#### `TrendChart.setTransition([duration [, delay]])`

Sets the duration and delay (per bar) values for transition animation on the trend chart. These values default to `100`ms for `duration` and `50`ms for delay. You can disable transitions by setting the duration value to `0`.
```javascript
trendchart.setTransition(200, 100); // -> sets the transitions to 200ms duration and 100ms delay (per bar)
```

#### `TrendChart.setTooltip(textFunction)`

Sets the function used to build the trend bars' tooltip text. If defined, this text function will be called with the bar's datum as parameter. You can set this text function to `null` in order to disable the text tooltip.
```javascript
trend.setTooltip(d=>`<b>${d.date}</b>: ${d.value}`); // trend bars' tooltip will print '<b>2018</b>: 0.32' for example.
```

#### `TrendChart.setTooltipChart(charFunction)`

Sets the function used to build the trend bars' tooltip chart. If defined, this chart function will be called with the tooltip's DOM container and the bar's datum as parameter. You can set this chart function to `null` in order to disable the chart tooltip.
```javascript
let DM = tMap.DataManager();
trendchart.setTooltipChart((t,d)=>{
    tMap.HorizontalBarChart(t, 200, 100)
        .render(DM.getMainTopicsDistrib(d.date));
}); // tredn bars' tooltip include an horizontal bar chart showing the bar's date/key field distribution.
```

#### `TrendChart.setBarClick(callback)`

Sets the callback for click events on the trend bars.
```javascript
trendchart.setBarClick((e,d)=>{console.log(d.key)}); // -> on bar click print the bar's key
```

> Note that the callback has to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details 

#### `TrendChart.render(trendDataSeries)`

Renders the trend chart using the provided trend data series (in the format: `[[{date,value}]]`). This type of data is typically obtained from the [Data Maneger's tren features](#trend-features). You can pass one or multiple series.
```javascript
let DM = tMap.DataManager();
let sumByYear = DM.timeFormatConverter('%d/%m/%y', '%Y'); // -> reduce the trend data by year
let trendRange = ['%d/%m/%y', '01/01/11', '01/01/20']; // -> get data between 2011 (inc.) and 2020 (exc.)

trendchart.render([DM.getMainTopicTrend('3', sumByYear, trendsRange)]);
// -> renders the trend data for the main topic '3'

trendchart.render([DM.getMainTopicTrend('3', sumByYear, trendsRange),
                   DM.getSubTopicTrend('11', sumByYear, trendsRange)]);
// -> renders the trend data for the main topic '3' and sub topic '11'
```

#### `TrendChart.selectBar([date])`

Sets the trend bar with key `date` as selected, using the CSS class `selected`. The parameter `date` is optional, not providing it, or setting it as `null`, will unselect any previously selected bar.
```javascript
trendchart.selectBar('2013'); // -> bar with date '2013' is marked as selected
trendchart.selectBar(); // -> every bar are unselected
```
