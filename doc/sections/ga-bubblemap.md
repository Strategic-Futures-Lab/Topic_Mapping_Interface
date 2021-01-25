
### Bubble Topic Map

The bubble map visualisation module renders data from `mainMap` and `subMaps` files, produced by the Topic Mapping Pipeline bubble map module.

A Bubble Map is instantiated using `tMap`'s `BubbleMap` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let bubbleMap = tMap.BubbleMap(PM.panel1.c, PM.panel1.w, PM.panel1.h);
```

This module is built with [the visualisation API](#visualisation-api) and therefore has the same base methods.

> Note that all of the functions below return the visualisation module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `BubbleMap.setBubbleClick(callback)`

Sets a callback for click events on the map's bubbles.
```javascript
bubbleMap.setBubbleClick((e,d)=>{console.log(d)}); // -> on bubble click print the bubble's datum
```

> Note that the callback has to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details

#### `BubbleMap.setTooltip(textFunction)`

Sets the function used to build the bubbles' tooltip text. If defined, this text function will be called with the bubble's datum as parameter. You can set this text function to `null` in order to disable the text tooltip.
```javascript
bubbleMap.setTooltip(d=>`Size: ${d.size}`); // bubbles' tooltip will print 'Size: 23.0' for example.
```

#### `BubbleMap.setTooltipChart(charFunction)`

Sets the function used to build the bubbles' tooltip chart. If defined, this chart function will be called with the tooltip's DOM container and the bubble's datum as parameter. You can set this chart function to `null` in order to disable the chart tooltip.
```javascript
let DM = tMap.DataManager();
bubbleMap.setTooltipChart((t,d)=>{
    tMap.HorizontalBarChart(t, 200, 100)
        .render(DM.getMainTopicDistribEntry(d.topicId));
}); // bubbles' tooltip include an horizontal bar chart showing the bubble's topic distribution.
```

#### `BubbleMap.setMinimumTextSize(size)`

Lets you set the minimum `size` the bubble's text can have. Note that the bubble will be scaled to fit inside the visualisation after being rendered, texts might appear larger/smaller than the value of `size`.
```javascript
bubbleMap.setMinimumTextSize(3); // bubbles' text can be no smaller than 3px (before map scaling).
```

#### `BubbleMap.render(dataset)`

Renders the bubble map using the provided `dataset`. This `dataset` can be accessed from the data manager, e.g. `DM.data.mainMap` or `DM.data.subMap`.
```javascript
bubbleMap.render(DM.data.mainMap); // renders the main topic map
bubbleMap.render(DM.getSubMap('2')); // renders the sub topic map for main topic '2'
```

#### `BubbleMap.selectBubble([topicId [,idAccessor]])`

If provided with topic id, will mark the associated bubble *selected* (using CSS class). All other bubbles are marked as not selected, i.e. only one bubble can be selected at a time. If `topicId` is not specified, or set to null, the function will unselect all bubbles. `idAccessor` lets you define how to access the topic id in the bubble map topic data, it defaults to `d=>d.topicId` which corresponds to how topic ids are stored in `mainMap` and `subMaps`.
```javascript
bubbleMap.selectBubble('2'); // bubble for topic '2' will be classed 'selected'
```

#### `BubbleMap.highlightBubbles([topicIds [,idAccessor]])`

Given a list of topic ids, will mark the associated bubbles as *highlighted* (using CSS class). Every other bubbles are marked as not highlighted. If `topicId` is not specified, or set to an empty list `[]`, the function will remove highlight for every bubbles. `idAccessor` lets you define how to access the topic id in the bubble map topic data, it defaults to `d=>d.topicId` which corresponds to how topic ids are stored in `mainMap` and `subMaps`.
```javascript
bubbleMap.selectBubble(['2','3','8','13']); // bubbles for topics '2','3','8', and '13' will be classed 'highlighted'
```

#### `BubbleMap.setBubblesOpacity(distributionData [,reset])

Given a distribution (list of topic ids/keys and weights/values), will adjust the opacity of bubbles to reflect the weights. `reset` is an optional parameter that lets you reset all the opacities to `1` (`true`), it defaults to `false`.
```javascript
bubbleMap.setBubblesOpacity(DM.getMainTopicsDistrib('A')); // sets the opacity of all bubbles using the distribution of field 'A'
```

#### `BubbleMap.setOpacityScale([minValue [, clampRatio [, scaleType]]])`

Lets you adjust the opacity scale used with `.setBubblesOpacity`. `minValue` is minimum opacity value of the scale's range, it defaults to `0.2`. The maximum range value is always `1`. `clampRatio` is a multiplier applied on the maximum value of scale's domain, allowing you to lower or increase the threshold for maximum opacity, it defaults to `1` (no changes). `scaleType` lets you choose what type of scale to use, either `linear` (default) or `log`.
```javascript
bubbleMap.setOpacityScale(0.3, 0.9, 'log'); // use a scale range of [0.3,1], a scale domain of [0, 90% of the distribution maximum value], and a logarithmic scale.
```
