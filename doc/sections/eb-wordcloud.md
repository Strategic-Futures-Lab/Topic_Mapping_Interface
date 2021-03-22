
### Wordcloud

The wordcloud visualisation module renders the label data from a specific topic in `mainMap`, `subMaps`, `mainModel`, and `subModel` files, produced by the Topic Mapping Pipeline bubble map and model export modules.

A Wordcloud is instantiated using `tMap`'s `WordCloud` function. Like most page modules, it takes three parameters: a DOM `container`, and initial `width` and `height`. These parameters are typically returned by the [Page Manager](#page-manager).
```javascript
let PM = tMap.PageManager(...);
let wordcloud = tMap.WordCloud(PM.panel3.c, PM.panel3.w, PM.panel3.h);
```

This module is built with [the visualisation API](#visualisation-api) and therefore has the same base methods.

> Note that all of the functions below return the visualisation module itself, unless specified otherwise.
> This allows you to chain this functions.

#### `WordCloud.setMaxNumberLabels(number)`

Sets the maximum number of labels rendered on the wordcloud. The default value is `50`.
```javascript
wordcloud.setMaxNumberLabels(30); // -> the wordcloud will render a maximum of 30 labels
```

#### `WordCloud.setTextSizeRange([min, max])`

Sets the range, in pixel, at which the labels will be rendered. The default range is set to `[10,25]`.
```javascript
wordcloud.setTextSizeRange([20, 30]); // -> the labels' size will be set between 20 and 30 pixel (small range) 
wordcloud.setTextSizeRange([10, 35]); // -> the labels' size will be set between 10 and 35 pixel (large range)
```

Note that this range is only relative (within labels), the wordcloud is scaled after each render to fit inside its SVG.

#### `WordCloud.setWordClick(callback)`

Sets the callback for click events on the wordcloud's labels.
```javascript
wordcloud.setWordClick((e,d)=>{console.log(d.text)}); // -> on word click print the labels' text
```

> Note that the callback has to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details

#### `WordCloud.setWordMouseover(callbackMouseover, callbackMouseout)`

Sets the callbacks for mouse-over/out events on the wordcloud's labels.
```javascript
wordcloud.setWordMouseover((e,d)=>{console.log(d.text+' over')}, (e,d)=>{console.log(d.text+' out')}); // -> on word click print the labels' text + over/out
```

> Note that the callbacks have to follow D3 v6.0's callback signature:
> `callback(event, datum)`
> Check [D3 v6.0 migration guide](https://observablehq.com/@d3/d3v6-migration-guide#events) for more details

#### `WordCloud.render(labelsData)`

Renders the wordcloud using the provided `labelsData`. Label data can be accessed from topic's data: `topic.labels`.
```javascript
function bubbleClickCallback(e,d){
    wordcloud.render(d.labels);
}
bubblemap.setBubbleClick(bubbleClickCallback); // -> upon clicking on a bubble in bubblemap, will render the associated topic's labels in the wordcloud
```

#### `WordCloud.highlightTexts(words)`

Provided a list of words, will highlight the associated labels using the CSS class `highlighted`.
```javascript
wordcloud.highlightTexts(['label1','label2']); // -> the words 'label1' and 'label2' will be marked as 'highlighted' in the wordcloud
```

#### `WordCloud.highlightTextsOpacity(words)`

Provided a list of words, will lower the opacity of every other words in the wordcloud, using the CSS class `lowerOpacity`.
```javascript
wordcloud.highlightTextsOpacity(['label1','label2']); // -> every words which are not 'label1' or 'label2' will be marked as 'lowerOpacity' in the wordcloud
```
