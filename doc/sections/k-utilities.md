
## Other Utilities

`tMap` also integrates a few utilities:
- [Format Functions](#format-functions)
- [Information Function](#information-function)

### Format Functions

The format functions are mostly just accessors for D3's [number](https://github.com/d3/d3-format) and [date](https://github.com/d3/d3-time-format) formatting modules.

#### `tMap.formatNumber(number, format)`

Returns `number` formated using the provided `format`. Typically useful when setting up tooltip functions, or table cells.
```javascript
console.log(tMap.formatNumber(23459.57, ',d')); // -> prints '23,460'
```

#### `tMap.formatDate(date, format)`

Returns `date` formatted using the provided `format`. `date` must be a javascript Date object.
```javascript
console.log(tMap.formatDate(new Date(), '%b. %Y')); // prints 'Feb. 2021'
```

#### `tMap.parseDate(date, format)`

Returns a javascript Date object, by parsing `date` using the provided `format`.
```javascript
console.log(tMap.parseDate('Feb. 2021', '%b. %Y')); // -> prints 'Mon Feb 01 2021 00:00:00 GMT+0000 (Greenwich Mean Time)'
```

#### `tMap.convertDate(date, inFormat, outFormat)`

Returns the provided `date` string, in the format `inFormat`, now formated with `outFormat`.
```javascript
console.log(tMap.convertDate('Feb. 2021', '%b. %Y', '%Y-%m-%d')); // -> prints '2021-02-01'
``` 

#### `tMap.dateConverter(inFormat, outFormat)`

Returns a date converter functions, taing date in the format `inFormat`, and returning them in the format `outFormat`. 
```javascript
let f = tMap.dateConverter('%b. %Y', '%Y-%m-%d');
console.log(f('Feb. 2021')); // -> prints '2021-02-01'
```

This function is duplicated in the [Data Manager's trend features](#datamanagertimeformatconverterinformat-outformat).

### Information Function

There is only one information function currently implemented.

#### `tMap.aboutTopicMapping([docType [, hasTable [, topicSize]]])`

Returns an HTML string providing background detail and references about topic modelling and the Topic Mapping applications. `docType` lets you specify what type of documents are used in your specific case (e.g. `'grant abstracts'`), it defaults to `'documents'`. `hasTable` is a boolean that lets you insert details about the Document Table, it defaults to `false` (i.e. no detail). `topicSize` lets you customise the value used to estimate the size of topics on Bubble Maps (e.g. `'total value of grants'`), it defaults to `'total number of documents'`.
```javascript
let menu = tMap.Menu('body', 50); // -> instantiate a floating menu
menu.addModal('About', tMap.aboutTopicMapping()); // -> adds an option to the floating menu to display an 'About' modal with info about topic mapping
```
