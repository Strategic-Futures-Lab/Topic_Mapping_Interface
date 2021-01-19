var tMap = (function (exports) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function getControls(nCtrl, colSizes, align) {
    var dashboard = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var sum = function sum(a, b) {
      return a + b;
    }; // set default column sizes if no defined


    if (colSizes.length == 0) {
      for (var i = 0; i < nCtrl; i++) {
        colSizes.push(3);
      }
    } // get total number of columns needed and estimate available grid (dashboard:[12,1], column:[6,2])


    var sumCols = colSizes.reduce(sum, 0),
        nCols = dashboard ? 12 : 6,
        nRows = sumCols <= nCols ? 1 : 2; // set up area names and column sizes, if cumul size exceed available columns, add a new row

    var rows = [];
    var cumulCols = 0;
    var row = {};

    for (var _i = 0; _i < nCtrl; _i++) {
      if (cumulCols + colSizes[_i] > nCols) {
        rows.push(_objectSpread2({}, row));
        row = {};
        cumulCols = 0;
      }

      row["control".concat(_i + 1)] = [colSizes[_i], 1];
      cumulCols += colSizes[_i];
    }

    rows.push(_objectSpread2({}, row)); // create the area strings for the grid template

    var areaStrings = rows.map(function (r) {
      return Object.entries(r).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            area = _ref2[0],
            size = _ref2[1];

        return (area + ' ').repeat(size[0]);
      });
    }); // for each row, build the grid template

    var template = [];

    for (var _i2 = 0; _i2 < rows.length; _i2++) {
      var rowTemplate = ''; // get row size in total

      var rowLength = Object.values(rows[_i2]).map(function (s) {
        return s[0];
      }).reduce(sum, 0); // get space left in row

      var space = nCols - rowLength;
      var a = align;

      if (areaStrings[_i2].length == 1 && align == 'b') {
        a = 'r';
      } else if (areaStrings[_i2].length == 1 && align == 'a') {
        a = 'c';
      }

      if (a === 'l') {
        // left align: join all areas and add spaces at the end
        rowTemplate = areaStrings[_i2].join('') + '. '.repeat(space);
      } else if (a === 'r') {
        // right align: add spaces and join all areas afterwards
        rowTemplate = '. '.repeat(space) + areaStrings[_i2].join('');
      } else if (a === 'c') {
        // centre align: add half the spaces, join all areas, add other half of spaces + extra if any
        var spaces = Math.floor(space / 2);
        var extra = space % 2;
        rowTemplate = '. '.repeat(spaces) + areaStrings[_i2].join('') + '. '.repeat(spaces) + '. '.repeat(extra);
      } else if (a === 'b') {
        // space between align: join areas strings + in between space, then add any extra
        var _spaces = Math.floor(space / (areaStrings[_i2].length - 1));

        var _extra = space % (areaStrings[_i2].length - 1);

        rowTemplate = areaStrings[_i2].join('. '.repeat(_spaces)) + '. '.repeat(_extra);
      } else if (a === 'a') {
        // space around align: set initial space, join areas strings + in between space, add remaining space + extra if any
        var _spaces2 = Math.floor(space / (areaStrings[_i2].length + 1));

        var _extra2 = space % (areaStrings[_i2].length + 1);

        rowTemplate = '. '.repeat(_spaces2) + areaStrings[_i2].join('. '.repeat(_spaces2)) + '. '.repeat(_spaces2) + '. '.repeat(_extra2);
      }

      template.push(rowTemplate);
    }

    var areas = {};
    rows.forEach(function (r) {
      Object.entries(r).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            a = _ref4[0],
            s = _ref4[1];

        areas[a] = s;
      });
    });
    areas['controlT'] = [nCols, nRows];
    return {
      ctrlAreas: areas,
      ctrlTemplate: template.map(function (r) {
        return "\"".concat(r, "\"");
      }).join('')
    };
  }

  function checkAlign(a) {
    var values = ['a', 'b', 'c', 'l', 'r'];

    if (values.includes(a)) {
      return a;
    } else {
      console.log('Control Layout - Bad Alignment - Default to \'left\'');
      return 'l';
    }
  }

  function checkColSizes(c) {
    if (c.some(isNaN) || c.some(function (s) {
      return s.length < 1;
    })) {
      console.error('Control Layout - Bad Column Size');
      return [];
    } else {
      return c.map(function (s) {
        return Math.min(parseInt(s), 6);
      });
    }
  }

  function Controls (controls) {
    var dashboard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var _controls$split = controls.split('-'),
        _controls$split2 = _toArray(_controls$split),
        nCtrl = _controls$split2[0],
        rest = _controls$split2.slice(1);

    if (isNaN(nCtrl) || nCtrl.length < 1) {
      console.error('Control Layout - Bad Input');
      return {
        controls: [],
        controlTemplate: ''
      };
    } else {
      nCtrl = parseInt(nCtrl);
      var sizes, align;

      if (nCtrl > rest.length || nCtrl > 4) {
        console.error('Control Layout - Bad Input');
        return {
          controls: [],
          controlTemplate: ''
        };
      } else if (nCtrl == rest.length) {
        sizes = checkColSizes(rest);
        align = 'l';
      } else {
        align = checkAlign(rest.pop());
        sizes = checkColSizes(rest).slice(0, nCtrl);
      }

      if (sizes.reduce(function (a, b) {
        return a + b;
      }, 0) > 12) {
        console.error('Control Layout - Bad Input');
        return {
          controls: [],
          controlTemplate: ''
        };
      }

      return getControls(nCtrl, sizes, align, dashboard);
    }
  }

  function buildColA() {
    var areas = {
      panel1: [6, 12],
      panelT: [6, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]);
    var template = "\"".concat(templatePanel1, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashA() {
    var areas = {
      panel1: [12, 12],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]);
    var template = "\"".concat(templatePanel1, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColB() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 12],
      panelT: [12, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    var template = "\"".concat(templatePanel1, "\"\"").concat(templatePanel2, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashBa() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 12],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashBb() {
    var areas = {
      panel1: [8, 12],
      panel2: [4, 12],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColC() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 6],
      panel3: [6, 6],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    var template = "\"".concat(templatePanel1, "\"\"").concat(templatePanel2, "\"\"").concat(templatePanel3, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashCa() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 6],
      panel3: [6, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"\"").concat(templatePanel1).concat(templatePanel3, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashCb() {
    var areas = {
      panel1: [8, 12],
      panel2: [4, 6],
      panel3: [4, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"\"").concat(templatePanel1).concat(templatePanel3, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColDa() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 6],
      panel3: [3, 6],
      panel4: [3, 6],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    var template = "\"".concat(templatePanel1, "\"\"").concat(templatePanel2, "\"\"").concat(templatePanel3).concat(templatePanel4, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColDb() {
    var areas = {
      panel1: [6, 12],
      panel2: [3, 6],
      panel3: [3, 6],
      panel4: [6, 6],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    var template = "\"".concat(templatePanel1, "\"\"").concat(templatePanel2).concat(templatePanel3, "\"\"").concat(templatePanel4, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashDa() {
    var areas = {
      panel1: [6, 12],
      panel2: [6, 6],
      panel3: [3, 6],
      panel4: [3, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"\"").concat(templatePanel1).concat(templatePanel3).concat(templatePanel4, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashDb() {
    var areas = {
      panel1: [6, 12],
      panel2: [3, 6],
      panel3: [3, 6],
      panel4: [6, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2).concat(templatePanel3, "\"\"").concat(templatePanel1).concat(templatePanel4, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColE() {
    var areas = {
      panel1: [6, 12],
      panel2: [3, 6],
      panel3: [3, 6],
      panel4: [3, 6],
      panel5: [3, 6],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]);
    var template = "\"".concat(templatePanel1, "\"\"").concat(templatePanel2).concat(templatePanel3, "\"\"").concat(templatePanel4).concat(templatePanel5, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashE() {
    var areas = {
      panel1: [6, 12],
      panel2: [3, 6],
      panel3: [3, 6],
      panel4: [3, 6],
      panel5: [3, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2).concat(templatePanel3, "\"\"").concat(templatePanel1).concat(templatePanel4).concat(templatePanel5, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColFa() {
    var areas = {
      panel1: [3, 8],
      panel2: [3, 8],
      panel3: [3, 8],
      panel4: [3, 8],
      panel5: [3, 8],
      panel6: [3, 8],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"\"").concat(templatePanel3).concat(templatePanel4, "\"\"").concat(templatePanel5).concat(templatePanel6, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashFa() {
    var areas = {
      panel1: [4, 6],
      panel2: [4, 6],
      panel3: [4, 6],
      panel4: [4, 6],
      panel5: [4, 6],
      panel6: [4, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2).concat(templatePanel3, "\"\"").concat(templatePanel4).concat(templatePanel5).concat(templatePanel6, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildColFb() {
    var areas = {
      panel1: [3, 8],
      panel2: [3, 8],
      panel3: [3, 8],
      panel4: [3, 8],
      panel5: [3, 8],
      panel6: [3, 8],
      panelT: [6, 24]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2, "\"\"").concat(templatePanel3).concat(templatePanel4, "\"\"").concat(templatePanel5).concat(templatePanel6, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function buildDashFb() {
    var areas = {
      panel1: [4, 6],
      panel2: [4, 6],
      panel3: [4, 6],
      panel4: [4, 6],
      panel5: [4, 6],
      panel6: [4, 6],
      panelT: [12, 12]
    };
    var templatePanel1 = 'panel1 '.repeat(areas.panel1[0]),
        templatePanel2 = 'panel2 '.repeat(areas.panel2[0]),
        templatePanel3 = 'panel3 '.repeat(areas.panel3[0]),
        templatePanel4 = 'panel4 '.repeat(areas.panel4[0]),
        templatePanel5 = 'panel5 '.repeat(areas.panel5[0]),
        templatePanel6 = 'panel6 '.repeat(areas.panel6[0]);
    var template = "\"".concat(templatePanel1).concat(templatePanel2).concat(templatePanel5, "\"\"").concat(templatePanel3).concat(templatePanel4).concat(templatePanel6, "\"");
    return {
      panelAreas: areas,
      panelTemplate: template
    };
  }

  function Panels (areas, template, layout) {
    var dashboard = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (layout.length < 1) {
      console.error('Panel Layout - Bad Input');
    }

    var _ref = layout === 'A' ? dashboard ? buildDashA() : buildColA() : layout === 'Ba' ? dashboard ? buildDashBa() : buildColB() : layout === 'Bb' ? dashboard ? buildDashBb() : buildColB() : layout === 'Ca' ? dashboard ? buildDashCa() : buildColC() : layout === 'Cb' ? dashboard ? buildDashCb() : buildColC() : layout === 'Da' ? dashboard ? buildDashDa() : buildColDa() : layout === 'Db' ? dashboard ? buildDashDb() : buildColDb() : layout === 'E' ? dashboard ? buildDashE() : buildColE() : layout === 'Fa' ? dashboard ? buildDashFa() : buildColFa() : layout === 'Fb' ? dashboard ? buildDashFb() : buildColFb() : buildDashA(),
        panelAreas = _ref.panelAreas,
        panelTemplate = _ref.panelTemplate;

    for (var _i = 0, _Object$entries = Object.entries(panelAreas); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          area = _Object$entries$_i[0],
          size = _Object$entries$_i[1];

      areas[area] = size;
    }

    template = template + panelTemplate;
    return {
      areas: areas,
      template: template
    };
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array(group);
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return this.children;
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {
    if (!(selection instanceof Selection)) throw new Error("invalid merge");

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection_selection() {
    return this;
  }

  Selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function D3Select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function PageManager () {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
    var layout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'A';
    var controls = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var header = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var footer = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var minWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 600;
    var minHeight = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 600;
    // Margin constants
    var heightMargin = 20,
        // sapce to remove when computing the available height
    widthMargin = 200,
        // sapce to remove when computing the available width
    panelMargin = 5,
        // space between panels
    controlMargin = 5; // space to put below controls

    /**
     * Computes the available height
     */

    function getTotalHeight(baseH) {
      var headH = header === '' ? 0 : D3Select(header).node().offsetHeight,
          footH = footer === '' ? 0 : D3Select(footer).node().offsetHeight;
      return baseH - headH - footH - heightMargin;
    }
    /**
     * Computes the available width
     */


    function getTotaltWidth(baseW) {
      return baseW - widthMargin;
    }
    /**
     * Sizes container and applies grdi layout
     */


    function getGrid(w, h, c, t) {
      return D3Select(c).style('width', w + 'px').style('height', h + 'px').style('display', 'grid').style('grid-template-areas', t);
    }
    /**
     * Creates and sizes the container for each control and panels
     */


    function getSizes(width, height, areas, grid) {
      var sizes = {}; // for every areas (excluding the totals)

      var _loop = function _loop() {
        var area = _Object$keys[_i];

        if (area !== 'total' && !area.endsWith('T')) {
          // compute the size
          var h = Math.floor(height * areas[area][1] / areas['total'][1] - panelMargin * 2),
              w = Math.floor(width * areas[area][0] / areas['total'][0] - panelMargin * 2); // generate a container

          var c = "div#".concat(area);
          var s = grid.select(c);

          if (s.empty()) {
            s = grid.append('div').attr('id', area);
          } // assign grid area to container and size it


          s.style('grid-area', area).style('height', h + 'px').style('margin', panelMargin + 'px').style('margin-bottom', function () {
            return "".concat(area.includes('control') ? controlMargin + panelMargin : panelMargin, "px");
          }); // register the container and its size

          sizes[area] = {
            c: c,
            w: w,
            h: h
          };
        }
      };

      for (var _i = 0, _Object$keys = Object.keys(areas); _i < _Object$keys.length; _i++) {
        _loop();
      }

      return sizes;
    }

    function buildPage() {
      // get the base dimension for the page
      var baseH = Math.max(window.innerHeight, minHeight),
          baseW = Math.max(window.innerWidth, minWidth); // estimate the available space

      var totalH = getTotalHeight(baseH),
          totalW = getTotaltWidth(baseW); // check if needs to be in column or dashboard format

      var dashboard = totalW * 2 / 3 >= totalH; // adjust available height if column format

      if (!dashboard && layout !== 'A') {
        totalH *= 2;
      } // make the controls areas and template


      var _ref = controls !== '' ? Controls(controls, dashboard) : {
        ctrlAreas: {
          controlT: [0, 0]
        },
        ctrlTemplate: ''
      },
          ctrlAreas = _ref.ctrlAreas,
          ctrlTemplate = _ref.ctrlTemplate; // complete with panels areas and template


      var _Panels = Panels(ctrlAreas, ctrlTemplate, layout, dashboard),
          areas = _Panels.areas,
          template = _Panels.template; // get total area size


      areas['total'] = [dashboard ? 12 : 6, areas.controlT[1] + areas.panelT[1]]; // size container and apply grid layout

      var grid = getGrid(totalW, totalH, container, template); // generate grid areas, size them, and return

      return getSizes(totalW, totalH, areas, grid);
    } // get the controls and panels


    var sizes = buildPage(); // watch function to auto-resize modules

    sizes.watch = function (modules) {
      window.onresize = function () {
        var s = buildPage();

        for (var _i2 = 0, _Object$entries = Object.entries(modules); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              area = _Object$entries$_i[0],
              module = _Object$entries$_i[1];

          if ('setSize' in module) {
            module.setSize(s[area].width, s[area].height);
          } else {
            console.log("".concat(area, " missing setSize()"));
          }
        }
      };
    };

    return sizes;
  }

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "] || \"\"";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6)
      : year > 9999 ? "+" + pad(year, 6)
      : pad(year, 4);
  }

  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }

  function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows,
      formatRow: formatRow,
      formatValue: formatValue
    };
  }

  var csv = dsvFormat(",");

  var csvParse = csv.parse;

  function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
  }

  function D3Text(input, init) {
    return fetch(input, init).then(responseText);
  }

  function dsvParse(parse) {
    return function(input, init, row) {
      if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
      return D3Text(input, init).then(function(response) {
        return parse(response, row);
      });
    };
  }

  var csv$1 = dsvParse(csvParse);

  function responseJson(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    if (response.status === 204 || response.status === 205) return;
    return response.json();
  }

  function D3Json(input, init) {
    return fetch(input, init).then(responseJson);
  }

  function DataManagerBasic () {
    var Data = {};
    /**
     * Loads data from urls object with following structure:
     * {name: url, ...}
     * Returns promise with loaded data as parameter
     */

    Data.loadDataFromUrls = function (urls) {
      return Promise.all(Object.entries(urls).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            name = _ref2[0],
            url = _ref2[1];

        if (url.endsWith('.json') || url.includes('application/json')) {
          return D3Json(url).then(function (data) {
            return {
              name: name,
              data: data
            };
          });
        } else if (url.endsWith('.csv') || url.includes('text/csv')) {
          return csv$1(url).then(function (data) {
            return {
              name: name,
              data: data
            };
          });
        } else {
          return D3Text(url).then(function (data) {
            return {
              name: name,
              data: data
            };
          });
        }
      }));
    };
    /**
     * Gets a set of  data in the format:
     * [{name, data}, ...]
     * And attaches it to the public object for access
     */


    Data.processData = function (dataArray) {
      Data.data = {};

      var _iterator = _createForOfIteratorHelper(dataArray),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              name = _step$value.name,
              data = _step$value.data;
          Data.data[name] = data;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return Data;
    };
    /**
     * Combines loadDataFromUrls and processData in to one function.
     * Takes urls object as input:
     * {name: url, ...}
     * Return a promise
     */


    Data.loadAndProcessDataFromUrls = function (urls) {
      return Data.loadDataFromUrls(urls).then(function (d) {
        Data.processData(d);
      });
    };

    return Data;
  }

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * The base implementation of `_.has` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHas(object, key) {
    return object != null && hasOwnProperty.call(object, key);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$1 = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol$1 = root$1.Symbol;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$2.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root$1['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$3 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root$1, 'Map');

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map$1 || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) &&
      (isArray(object) || isArguments(object));
  }

  /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': 2 } };
   * var other = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b');
   * // => true
   *
   * _.has(object, ['a', 'b']);
   * // => true
   *
   * _.has(other, 'a');
   * // => false
   */
  function has(object, path) {
    return object != null && hasPath(object, path, baseHas);
  }

  function mapData (Data) {
    /**
     * Given a topic id from main topic map, gets the data to the associated sub map
     * and sets it to subMap data attribute.
     * Will throw error if subMaps not loaded or if no subMap can be found with mainTopicId
     */
    Data.setSubMap = function (mainTopicId) {
      if (!has(Data.data, 'subMaps')) {
        throw new Error('Data Error: subMaps were not loaded');
      }

      var s = Data.data.subMaps.filter(function (d) {
        return d.mainTopicId === mainTopicId;
      });

      if (s.length < 1) {
        throw new Error('Data Error: no subMap were found with mainTopicId ' + mainTopicId);
      }

      Data.data.subMap = Data.data.subMaps.filter(function (d) {
        return d.mainTopicId === mainTopicId;
      })[0].subMap;
      return Data;
    };
    /**
     * Given a topic id from main topic map, gets the data to the associated sub map
     * sets it to subMap data attribute, and returns it.
     * 
     * If main topic id is not specified, directly returns the subMap previously set
     * Will throw error if subMap was not set
     */


    Data.getSubMap = function () {
      var mainTopicId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (mainTopicId == null) {
        if (!has(Data.data, 'submap')) {
          throw new Error('Data Error: subMap was not set');
        }

        return Data.data.subMap;
      } else {
        Data.setSubMap(mainTopicId);
        return Data.data.subMap;
      }
    };
    /**
     * given data structure containing an array of topics (map or model)
     * returns the topic with specified topicId, or null
     */


    function getTopic(data, topicId) {
      var t = data.topics.filter(function (t) {
        return t.topicId === topicId;
      });
      return t.length === 0 ? null : t[0];
    }
    /**
     * Given a topic id return the associated topic data from main bubble map
     * Will throw error if mainMap was not loaded and if topicId not found in mainMap
     */


    Data.getTopicMainMap = function (topicId) {
      if (!has(Data.data, 'mainMap')) {
        throw new Error('Data Error: mainMap was not loaded');
      }

      var t = getTopic(Data.data.mainMap, topicId);

      if (t == null) {
        throw new Error('Data Error: topic ' + topicId + ' was not found in mainMap');
      }

      return t;
    };
    /**
     * Given a topic id return the associated topic data from current sub bubble map
     * Will throw error if subMap was not set and if topicId not found in subMap
     */


    Data.getTopicSubMap = function (topicId) {
      if (!has(Data.data, 'subMap')) {
        throw new Error('Data Error: subMap was not set');
      }

      var t = getTopic(Data.data.subMap, topicId);

      if (t == null) {
        throw new Error('Data Error: topic ' + topicId + ' was not found in subMap');
      }

      return t;
    };
  }

  function docData (Data) {
    /**
     * given data structure containing an array of topics (map or model)
     * returns the topic with specified topicId, or null
     */
    function getTopic(data, topicId) {
      var t = data.topics.filter(function (t) {
        return t.topicId === topicId;
      });
      return t.length === 0 ? null : t[0];
    }
    /**
     * Given a topicId from the main model, will set the table rows to the topics's top documents
     * if the topic isn't found sets it to empty
     * Will throw error if mainModel isn't loaded
     */


    Data.setTableRowsMainTopic = function (topicId) {
      if (!has(Data.data, 'mainModel')) {
        throw new Error('Data Error: mainModel was not loaded');
      }

      var t = getTopic(Data.data.mainModel, topicId);
      Data.data.tableRows = t === null ? [] : t.topDocs;
      return Data;
    };
    /**
     * Given a topicId from the sub model, will set the table rows to the topics's top documents
     * if the topic isn't found sets it to empty
     * Will throw error if subModel isn't loaded
     */


    Data.setTableRowsSubTopic = function (topicId) {
      if (!has(Data.data, 'subModel')) {
        throw new Error('Data Error: subModel was not loaded');
      }

      var t = getTopic(Data.data.subTopicModel, topicId);
      Data.data.tableRows = t === null ? [] : t.topDocs;
      return Data;
    };
    /**
     * Returns the rows data for the table.
     * Can specify a number of rows (def 10), and filter function (def return true)
     * Will throw error if table hasn't been set yet
     */


    Data.getTableRows = function () {
      var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return true;
      };

      if (!has(Data.data, 'tableRows')) {
        throw new Error('Data Error: tableROws were not set');
      }

      return Data.data.tableRows.filter(filter).slice(0, number);
    };
    /**
     * Given a document id, returns the associated document fomr the current table rows 
     * Will throw error if table is not set or empty or if document not found in table
     */


    Data.getDocument = function (docId) {
      if (!has(Data.data, 'tableRows') || Data.data.tableRows.length == 0) {
        throw new Error('Data Error: tableROws were not set or are empty');
      }

      var d = Data.data.tableRows.filter(function (d) {
        return d.docId == docId;
      });

      if (d.length < 0) {
        throw new Error('Data Error: could not find document ' + docId);
      }

      return d[0];
    };
  }

  function distribData (Data) {
    /**
     * Return the distributions labels
     * Can provide a custom function to transform the text
     * Returns [{value, text}]
     * Will throw error if distribution was not loaded
     */
    Data.getDistributionLabels = function () {
      var textFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (d) {
        return d;
      };

      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      var entry = Data.data.distribution.mainTopics[0].distribution;
      return entry.map(function (d) {
        return d.id;
      }).map(function (v) {
        return {
          value: v,
          text: textFunction(v)
        };
      }).sort(function (a, b) {
        return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
      });
    };
    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Will throw error if fieldName not found in any topic distribution
     */


    function getTopicsDistribution(topicDistrib, fieldName) {
      return topicDistrib.filter(function (d) {
        return d.topicId > -1;
      }).map(function (d) {
        var v = d.distribution.filter(function (e) {
          return e.id === fieldName;
        }).map(function (e) {
          return e.weight;
        });

        if (v.length === 0) {
          throw new Error('Data Error: ' + fieldName + ' not found in distribution');
        }

        v = v[0];
        return {
          topicId: d.topicId,
          value: v
        };
      });
    }
    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Normalised across all other fields
     * Will throw error if fieldName not found in any topic distribution
     */


    function getTopicsDistributionNormalisedPerTopic(topicDistrib, fieldName) {
      return topicDistrib.filter(function (d) {
        return d.topicId > -1;
      }).map(function (d) {
        var v = d.distribution.filter(function (e) {
          return e.id === fieldName;
        }).map(function (e) {
          return e.weight / d.total;
        });

        if (v.length === 0) {
          throw new Error('Data Error: ' + fieldName + ' not found in distribution');
        }

        v = v[0];
        return {
          topicId: d.topicId,
          value: v
        };
      });
    }
    /**
     * Returns the list of topics and weights for a particular fieldName in the distribution topicDistrib
     * Normalised across all topics
     * Will throw error if fieldName not found in any topic distribution
     */


    function getTopicsDistributionNormalisedPerField(topicDistrib, fieldName) {
      var fieldDistribution = topicDistrib.filter(function (d) {
        return d.topicId > -1;
      }).map(function (d) {
        var v = d.distribution.filter(function (e) {
          return e.id === fieldName;
        }).map(function (e) {
          return e.weight;
        });

        if (v.length === 0) {
          throw new Error('Data Error: ' + fieldName + ' not found in distribution');
        }

        v = v[0];
        return {
          topicId: d.topicId,
          value: v
        };
      });
      var fieldTotal = fieldDistribution.reduce(function (acc, cur) {
        return acc + cur.value;
      }, 0);
      return fieldDistribution.map(function (d) {
        return {
          topicId: d.topicId,
          value: d.value / fieldTotal
        };
      });
    }
    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */


    Data.getMainTopicsDistrib = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'mainTopics')) {
        throw new Error('Data Error: no distribution for main topics');
      }

      return getTopicsDistribution(Data.data.distribution.mainTopics, fieldName);
    };
    /**
     * Returns the topic distribution from the sub topics given a distribution fieldName 
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */


    Data.getSubTopicsDistrib = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'subTopics')) {
        throw new Error('Data Error: no distribution for sub topics');
      }

      return getTopicsDistribution(Data.data.distribution.subTopics, fieldName);
    };
    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across other fields
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */


    Data.getMainTopicsDistribNormPerTopic = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'mainTopics')) {
        throw new Error('Data Error: no distribution for main topics');
      }

      return getTopicsDistributionNormalisedPerTopic(Data.data.distribution.mainTopics, fieldName);
    };
    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across other fields
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */


    Data.getSubTopicsDistribNormPerTopic = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'subTopics')) {
        throw new Error('Data Error: no distribution for sub topics');
      }

      return getTopicsDistributionNormalisedPerTopic(Data.data.distribution.subTopics, fieldName);
    };
    /**
     * Returns the topic distribution from the main topics given a distribution fieldName 
     * Normalised across all topics
     * Will throw error if distribution no loaded or if distribution doesn't have main topics
     */


    Data.getMainTopicsDistribNormPerField = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'mainTopics')) {
        throw new Error('Data Error: no distribution for main topics');
      }

      return getTopicsDistributionNormalisedPerField(Data.data.distribution.mainTopics, fieldName);
    };
    /**
     * Returns the normalised topic distribution from the sub topics given a distribution fieldName 
     * Normalised across all topics
     * Will throw error if distribution no loaded or if distribution doesn't have sub topics
     */


    Data.getSubTopicsDistribNormPerField = function (fieldName) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'subTopics')) {
        throw new Error('Data Error: no distribution for sub topics');
      }

      return getTopicsDistributionNormalisedPerField(Data.data.distribution.subTopics, fieldName);
    };
    /**
     * Returns the distribution entry for a specific main topic  
     */


    Data.getMainTopicDistribEntry = function (topicId) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'mainTopics')) {
        throw new Error('Data Error: no distribution for main topics');
      }

      var t = Data.data.distribution.mainTopics.filter(function (d) {
        return d.topicId === topicId;
      }).map(function (d) {
        return d.distribution.map(function (d2) {
          return {
            key: d2.id,
            value: d2.weight
          };
        });
      });

      if (t.length === 0) {
        throw new Error('Data Error: no distribution entry for main topic ' + topicId);
      }

      return t[0];
    };
    /**
     * Returns the distribution entry for a specific sub topic  
     */


    Data.getSubTopicDistribEntry = function (topicId) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'subTopics')) {
        throw new Error('Data Error: no distribution for sub topics');
      }

      var t = Data.data.distribution.subTopics.filter(function (d) {
        return d.topicId === topicId;
      }).map(function (d) {
        return d.distribution.map(function (d2) {
          return {
            key: d2.id,
            value: d2.weight
          };
        });
      });

      if (t.length === 0) {
        throw new Error('Data Error: no distribution entry for sub topic ' + topicId);
      }

      return t[0];
    };
    /**
     * Returns the distribution entry for a specific main topic  
     */


    Data.getMainTopicDistribEntryNorm = function (topicId) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'mainTopics')) {
        throw new Error('Data Error: no distribution for main topics');
      }

      var t = Data.data.distribution.mainTopics.filter(function (d) {
        return d.topicId === topicId;
      }).map(function (d) {
        return d.distribution.map(function (d2) {
          return {
            key: d2.id,
            value: d2.weight / d.total
          };
        });
      });

      if (t.length === 0) {
        throw new Error('Data Error: no distribution entry for main topic ' + topicId);
      }

      return t[0];
    };
    /**
     * Returns the distribution entry for a specific sub topic  
     */


    Data.getSubTopicDistribEntryNorm = function (topicId) {
      if (!has(Data.data, 'distribution')) {
        throw new Error('Data Error: distribution was not loaded');
      }

      if (!has(Data.data.distribution, 'subTopics')) {
        throw new Error('Data Error: no distribution for sub topics');
      }

      var t = Data.data.distribution.subTopics.filter(function (d) {
        return d.topicId === topicId;
      }).map(function (d) {
        return d.distribution.map(function (d2) {
          return {
            key: d2.id,
            value: d2.weight / d.total
          };
        });
      });

      if (t.length === 0) {
        throw new Error('Data Error: no distribution entry for sub topic ' + topicId);
      }

      return t[0];
    };
  }

  var t0 = new Date,
      t1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = function(date) {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var durationMinute = 6e4;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var day = newInterval(
    date => date.setHours(0, 0, 0, 0),
    (date, step) => date.setDate(date.getDate() + step),
    (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
    date => date.getDate() - 1
  );

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "g": formatYearISO,
      "G": formatFullYearISO,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear$1,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "g": formatUTCYearISO,
      "G": formatUTCFullYearISO,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "g": parseYear,
      "G": parseFullYear,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
            week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
            week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return localDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad$1(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    return new Map(names.map((name, i) => [name.toLowerCase(), i]));
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad$1(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad$1(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad$1(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad$1(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad$1(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad$1(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad$1(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad$1(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday(d, p) {
    return pad$1(sunday.count(year(d) - 1, d), p, 2);
  }

  function dISO(d) {
    var day = d.getDay();
    return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
  }

  function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad$1(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad$1(monday.count(year(d) - 1, d), p, 2);
  }

  function formatYear$1(d, p) {
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatYearISO(d, p) {
    d = dISO(d);
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad$1(z / 60 | 0, "0", 2)
        + pad$1(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad$1(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad$1(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad$1(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad$1(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad$1(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad$1(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad$1(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad$1(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad$1(utcSunday.count(utcYear(d) - 1, d), p, 2);
  }

  function UTCdISO(d) {
    var day = d.getUTCDay();
    return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  }

  function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad$1(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad$1(utcMonday.count(utcYear(d) - 1, d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale;
  var timeFormat;
  var timeParse;

  defaultLocale({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    timeFormat = locale.format;
    timeParse = locale.parse;
    locale.utcFormat;
    locale.utcParse;
    return locale;
  }

  function ascending$1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function identity(x) {
    return x;
  }

  function rollup(values, reduce, ...keys) {
    return nest(values, identity, reduce, keys);
  }

  function nest(values, map, reduce, keys) {
    return (function regroup(values, i) {
      if (i >= keys.length) return reduce(values);
      const groups = new Map();
      const keyof = keys[i++];
      let index = -1;
      for (const value of values) {
        const key = keyof(value, ++index, values);
        const group = groups.get(key);
        if (group) group.push(value);
        else groups.set(key, [value]);
      }
      for (const [key, values] of groups) {
        groups.set(key, regroup(values, i));
      }
      return map(groups);
    })(values, 0);
  }

  function max(values, valueof) {
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null
            && (max < value || (max === undefined && value >= value))) {
          max = value;
        }
      }
    }
    return max;
  }

  function permute(source, keys) {
    return Array.from(keys, key => source[key]);
  }

  function sum(values, valueof) {
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value = +value) {
          sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          sum += value;
        }
      }
    }
    return sum;
  }

  function sort(values, f = ascending$1) {
    if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
    values = Array.from(values);
    if (f.length === 1) {
      f = values.map(f);
      return permute(values, values.map((d, i) => i).sort((i, j) => ascending$1(f[i], f[j])));
    }
    return values.sort(f);
  }

  function trendData (Data) {
    /**
     * Returns a sum function for date, takes parsing format of input date,
     * and output format
     */
    Data.getTrendSumByFunction = function (inParse, outFormat) {
      return function (d) {
        return timeFormat(outFormat)(timeParse(inParse)(d));
      };
    };
    /* Duplicate of above */


    Data.timeFormatConverter = function (inParse, outFormat) {
      return function (d) {
        return timeFormat(outFormat)(timeParse(inParse)(d));
      };
    };
    /**
     * Returns the topic entry from a trend distribution
     * will throw error if topic not found
     */


    function getTopicTrendEntry(distrib, topicId) {
      var t = distrib.filter(function (d) {
        return d.topicId == topicId;
      });

      if (t.length === 0) {
        throw new Error('Data error: topic ' + topicId + ' not found in trend');
      }

      return t[0];
    }
    /**
     * Filters out the date outside of the time range from the distribution and returns the distribution
     * dateDistrib: [{date,value}]
     * timeRange: [format, minDate, maxDate]
     * will throw error in timeRange is not complete
     */


    function filterTimeRange(dateDistrib, timeRange) {
      if (timeRange.length !== 3) {
        throw new Error('Data Error: time range incomplete: [format, minDate (inc.), maxDate (exc.)]');
      }

      var parse = timeParse(timeRange[0]);
      return dateDistrib.filter(function (d) {
        return parse(d.date) >= parse(timeRange[1]) && parse(d.date) < parse(timeRange[2]);
      });
    }
    /**
     * Groups and sums the entries in the date distribution according to the sumBy function
     * dateDistrib: [{date,value}]
     * sumBy: date=>dateInNewFormat
     */


    function sumDates(dateDistrib, sumBy) {
      return sort(Array.from(rollup(dateDistrib, function (d) {
        return sum(d, function (d2) {
          return d2.value;
        });
      }, function (d) {
        return sumBy(d.date);
      })), function (d) {
        return d.key;
      }).map(function (d) {
        return {
          date: d.key,
          value: d.value
        };
      });
    }
    /**
     * Returns a main topic date distribution given topic id
     * returns in format: [{date:string,value:number}]
     * sumBy: date converter function
     * timeRange: [format, minDate (inc.), maxDate (exc.)]
     * will throw error if trend data not loaded or if trend data doesn't have main topics
     */


    Data.getMainTopicTrend = function (topicId) {
      var sumBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var timeRange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!has(Data.data, 'trend')) {
        throw new Error('Data Error: trend was not loaded');
      }

      if (!has(Data.data.trend, 'mainTopics')) {
        throw new Error('Data Error: no trend for main topics');
      }

      var dateDistrib = getTopicTrendEntry(Data.data.trend.mainTopics, topicId).distribution.map(function (d) {
        return {
          date: d.id,
          value: d.weight
        };
      });

      if (timeRange !== null) {
        dateDistrib = filterTimeRange(dateDistrib, timeRange);
      }

      if (sumBy !== null) {
        dateDistrib = sumDates(dateDistrib, sumBy);
      }

      return dateDistrib;
    };
    /**
     * Returns a sub topic date distribution given topic id
     * returns in format: [{date:string,value:number}]
     * sumBy: date converter function
     * timeRange: [format, minDate (inc.), maxDate (exc.)]
     * will throw error if trend data not loaded or if trend data doesn't have sub topics
     */


    Data.getSubTopicTrend = function (topicId) {
      var sumBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var timeRange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!has(Data.data, 'trend')) {
        throw new Error('Data Error: trend was not loaded');
      }

      if (!has(Data.data.trend, 'subTopics')) {
        throw new Error('Data Error: no trend for sub topics');
      }

      var dateDistrib = getTopicTrendEntry(Data.data.trend.subTopics, topicId).distribution.map(function (d) {
        return {
          date: d.id,
          value: d.weight
        };
      });

      if (timeRange !== null) {
        dateDistrib = filterTimeRange(dateDistrib, timeRange);
      }

      if (sumBy !== null) {
        dateDistrib = sumDates(dateDistrib, sumBy);
      }

      return dateDistrib;
    };
    /**
     * Finds the maximum value in the trend distribution
     * sumBy: date converter function to aggregate values
     * Will throw error in trned was not loaded or if trend has neither main or sub topics
     */


    Data.getMaxTrend = function () {
      var sumBy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var max$1 = -1; // let reduceWeights = d=>d.distribution.reduce((acc,val)=>{return acc+val.weight;},0);

      var maxWeights = function maxWeights(d) {
        return max(d.distribution, function (d2) {
          return d2.weight;
        });
      };

      var maxWeightsSumBy = function maxWeightsSumBy(d) {
        return sumDates(d.distribution, sumBy);
      };

      var fun = sumBy === null ? maxWeights : maxWeightsSumBy;

      if (!has(Data.data, 'trend')) {
        throw new Error('Data Error: trend was not loaded');
      }

      if (has(Data.data.trend, 'subTopics')) {
        max$1 = Math.max(max$1, max(Data.data.trend.subTopics, fun));
      }

      if (has(Data.data.trend, 'mainTopics')) {
        max$1 = Math.max(max$1, max(Data.data.trend.mainTopics, fun));
      }

      if (!has(Data.data.trend, 'subTopics') && !has(Data.data.trend, 'mainSubtopics')) {
        throw new Error('Data Error: no trend data for topics');
      }

      return max$1;
    };
  }

  function searchData (Data) {
    /**
     * Returns the list of labels in the index
     * Will save the list if not accessed before
     * Will trhow error if labels index was not loaded
     */
    function getLabels() {
      if (!has(Data.data, 'labelsIndex')) {
        throw new Error('Data error: labelsIndex was not loaded');
      }

      if (!has(Data.data, 'labels')) {
        Data.data.labels = Object.keys(Data.data.labelsIndex);
      }

      return Data.data.labels;
    }
    /**
     * Separates search terms from a query
     * e.g. "A and B or C and D or E" => [[A,B], [C,D], [E]]
     */


    function getSearchTerms() {
      // split strings for 'or' and 'and' queries
      var orSplits = [';', ' or ', '*'];
      var andSplits = [' and ', '+', ' ']; // ' ' needs to be last!!
      // search query

      var search = []; // building the search query from a string

      if (typeof Data.data.searchTerm !== 'undefined' && Data.data.searchTerm !== null && Data.data.searchTerm.length > 0) {
        search = [Data.data.searchTerm]; // separate 'or' queries

        orSplits.forEach(function (o) {
          var parts = [];
          search.forEach(function (s) {
            return s.split(o).forEach(function (p) {
              return parts.push(p);
            });
          });
          search = parts;
        }); // separate 'and' queries within 'or's

        search = search.map(function (s) {
          return [s];
        });
        andSplits.forEach(function (a) {
          search = search.map(function (s) {
            var parts = [];
            s.forEach(function (t) {
              return t.split(a).forEach(function (p) {
                return parts.push(p);
              });
            });
            return parts;
          });
        });
      }

      return search;
    }
    /**
     * Sets the search string
     */


    Data.setSearchTerm = function (searchTerm) {
      Data.data.searchTerm = searchTerm === '' ? null : searchTerm.toLowerCase();
      return Data;
    };
    /**
     * Fills provided set ids with docIds of documents containing all provided terms
     * Will throw error if labels index was not loaded
     */


    function searchAllTermsInDocuments(terms, docsIds) {
      if (!has(Data.data, 'labelsIndex')) {
        throw new Error('Data error: labelsIndex was not loaded');
      } // get all doc ids with occurrence of terms


      var docs = terms.map(function (t) {
        var l = Data.data.labelsIndex[t];
        return typeof l == 'undefined' ? [] : l.documents;
      }); // filter doc ids with occurrence of all terms

      var ids = docs.reduce(function (acc, cur, idx) {
        return idx == 0 ? cur : acc.filter(function (i) {
          return cur.includes(i);
        });
      }, []); // fill sets

      ids.forEach(function (i) {
        return docsIds.add(i);
      });
    }
    /**
     * Returns doc ids from a search
     * Will throw error if labels index not loaded
     */


    Data.getDocIdsFromSearch = function () {
      if (!has(Data.data, 'labelsIndex')) {
        throw new Error('Data error: labelsIndex was not loaded');
      }

      var search = getSearchTerms();
      var docIds = new Set(); // evaluating query and populating the sets of ids

      if (search.length == 1) {
        // no 'or'
        var last = search[0].pop(); // extract last term

        var terms = search[0].filter(function (t) {
          return t.length > 0;
        }); // remove all empty terms

        terms.push(last); // re-add last term

        if (terms.length == 1 && terms[0].length > 0) {
          // if only one non-empty term
          // partial search
          getLabels().filter(function (l) {
            return l.toLowerCase().includes(terms[0]);
          }).forEach(function (l) {
            Data.data.labelsIndex[l].documents.forEach(function (t) {
              return docIds.add(t);
            });
          });
        } else if (terms.length == 2 && terms[1].length == 0) {
          // if exactly two terms and second one is empty
          // exact search
          searchAllTermsInDocuments([terms[0]], docIds);
        } else if (terms.length >= 2) {
          // if two or more terms
          terms = terms.filter(function (t) {
            return t.length > 0;
          }); // remove potential empty term re-added

          searchAllTermsInDocuments(terms, docIds);
        }
      } else if (search.length >= 2) {
        // one or more 'or'
        search.forEach(function (s) {
          var terms = s.filter(function (t) {
            return t.length > 0;
          }); // remove all empty terms

          searchAllTermsInDocuments(terms, docIds);
        });
      }

      return Array.from(docIds);
    };
    /**
     * Fills provided sets of ids with topicIds of topics containing all provided terms
     * Will throw error if labels index was not loaded
     */


    function searchAllTermsInTopics(terms, mainTopicIds, subTopicIds) {
      if (!has(Data.data, 'labelsIndex')) {
        throw new Error('Data error: labelsIndex was not loaded');
      } // get all topic ids with occurrence of terms


      var mains = terms.map(function (t) {
        var l = Data.data.labelsIndex[t];
        return typeof l == 'undefined' ? [] : l.mainTopics;
      });
      var subs = terms.map(function (t) {
        var l = Data.data.labelsIndex[t];
        return typeof l == 'undefined' ? [] : typeof l.subTopics == 'undefined' ? [] : l.subTopics;
      }); // filter topic ids with occurrence of all terms

      var mainIds = mains.reduce(function (acc, cur, idx) {
        return idx == 0 ? cur : acc.filter(function (i) {
          return cur.includes(i);
        });
      }, []);
      var subIds = subs.reduce(function (acc, cur, idx) {
        return idx == 0 ? cur : acc.filter(function (i) {
          return cur.map(function (c) {
            return c[0];
          }).includes(i[0]);
        });
      }, []); // fill sets

      mainIds.forEach(function (i) {
        return mainTopicIds.add(i);
      });
      subIds.forEach(function (i) {
        subTopicIds.add(i[0]);
        i[1].forEach(function (i2) {
          return mainTopicIds.add(i2);
        });
      });
    }
    /**
     * Return the ids of topics from a search
     * Will throw error if labels index was not loaded
     */


    Data.getTopicIdsFromSearch = function () {
      if (!has(Data.data, 'labelsIndex')) {
        throw new Error('Data error: labelsIndex was not loaded');
      }

      var search = getSearchTerms(); // sets of ids to be returned

      var mainTopicIds = new Set();
      var subTopicIds = new Set(); // evaluating query and populating the sets of ids

      if (search.length == 1) {
        // no 'or'
        var last = search[0].pop(); // extract last term

        var terms = search[0].filter(function (t) {
          return t.length > 0;
        }); // remove all empty terms

        terms.push(last); // re-add last term

        if (terms.length == 1 && terms[0].length > 0) {
          // if only one non-empty term
          // partial search
          getLabels().filter(function (l) {
            return l.toLowerCase().includes(terms[0]);
          }).forEach(function (l) {
            Data.data.labelsIndex[l].mainTopics.forEach(function (t) {
              return mainTopicIds.add(t);
            });

            if (typeof Data.data.labelsIndex[l].subTopics !== 'undefined') {
              Data.data.labelsIndex[l].subTopics.forEach(function (t) {
                subTopicIds.add(t[0]);
                t[1].forEach(function (t2) {
                  return mainTopicIds.add(t2);
                });
              });
            }
          });
        } else if (terms.length == 2 && terms[1].length == 0) {
          // if exactly two terms and second one is empty
          // exact search
          searchAllTermsInTopics([terms[0]], mainTopicIds, subTopicIds);
        } else if (terms.length >= 2) {
          // if two or more terms
          terms = terms.filter(function (t) {
            return t.length > 0;
          }); // remove potential empty term re-added

          searchAllTermsInTopics(terms, mainTopicIds, subTopicIds);
        }
      } else if (search.length >= 2) {
        // one or more 'or'
        search.forEach(function (s) {
          var terms = s.filter(function (t) {
            return t.length > 0;
          }); // remove all empty terms

          searchAllTermsInTopics(terms, mainTopicIds, subTopicIds);
        });
      } // switch from sets to arrays


      mainTopicIds = Array.from(mainTopicIds);
      subTopicIds = Array.from(subTopicIds);
      return {
        mainTopicIds: mainTopicIds,
        subTopicIds: subTopicIds
      };
    };
    /** 
     * Returns a subset of labels from a search
     * Will throw error if labels index not loaded (by proxy)
     */


    Data.getLabelsFromSearch = function () {
      var search = getSearchTerms();
      var labels = []; // evaluating query and populating the sets of labels

      if (search.length == 1) {
        // no 'or'
        var last = search[0].pop(); // extract last term

        var terms = search[0].filter(function (t) {
          return t.length > 0;
        }); // remove all empty terms

        terms.push(last); // re-add last term

        if (terms.length == 1 && terms[0].length > 0) {
          // if only one non-empty term
          // partial search
          getLabels().filter(function (l) {
            return l.toLowerCase().includes(terms[0]);
          }).forEach(function (l) {
            labels.push(l);
          });
        } else if (terms.length == 2 && terms[1].length == 0) {
          // if exactly two terms and second one is empty
          // exact search
          getLabels().filter(function (l) {
            return l.toLowerCase() == terms[0];
          }).forEach(function (l) {
            labels.push(l);
          });
        } else if (terms.length >= 2) {
          // if two or more terms
          terms = terms.filter(function (t) {
            return t.length > 0;
          }); // remove potential empty term re-added

          getLabels().filter(function (l) {
            return terms.includes(l.toLowerCase());
          }).forEach(function (l) {
            labels.push(l);
          });
        }
      } else if (search.length >= 2) {
        // one or more 'or'
        search.forEach(function (s) {
          var terms = s.filter(function (t) {
            return t.length > 0;
          }); // remove all empty terms

          getLabels().filter(function (l) {
            return terms.includes(l.toLowerCase());
          }).forEach(function (l) {
            labels.push(l);
          });
        });
      }

      return labels;
    };
  }

  function DataManager () {
    // urls:
    // {
    //     mainMap, subMaps
    //     mainModel, subModel,
    //     mainLL, subLL,
    //     distribution, trend,
    //     labelsIndex, docCSV
    // }
    // Set the initial data manager
    var Data = DataManagerBasic(); // Add map features

    mapData(Data); // Add document table features

    docData(Data); // Add distribution features

    distribData(Data); // Add trend features

    trendData(Data); // Add search features

    searchData(Data);
    return Data;
  }

  exports.DataManager = DataManager;
  exports.PageManager = PageManager;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9waWNNYXBJbnRlcmZhY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL3BhZ2VNYW5hZ2VyL3BhZ2VDb250cm9scy5qcyIsIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL3BhZ2VNYW5hZ2VyL3BhZ2VQYW5lbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY3JlYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2FycmF5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbWF0Y2hlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZHJlbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9maWx0ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY29uc3RhbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2pvaW4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc29ydC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lYWNoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3R5bGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi90ZXh0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbG93ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9yZW1vdmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCIuLi8uLi9zcmMvc2NyaXB0cy9tb2RlbC9wYWdlTWFuYWdlci9QYWdlTWFuYWdlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1kc3Yvc3JjL2Rzdi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1kc3Yvc3JjL2Nzdi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1mZXRjaC9zcmMvdGV4dC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1mZXRjaC9zcmMvZHN2LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWZldGNoL3NyYy9qc29uLmpzIiwiLi4vLi4vc3JjL3NjcmlwdHMvbW9kZWwvZGF0YU1hbmFnZXIvRGF0YU1hbmFnZXJCYXNpYy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VIYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19mcmVlR2xvYmFsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fcm9vdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldFJhd1RhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX29iamVjdFRvU3RyaW5nLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc1N5bWJvbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzS2V5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc01hc2tlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzTmF0aXZlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXROYXRpdmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19uYXRpdmVDcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoQ2xlYXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoRGVsZXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hIYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoU2V0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9lcS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Fzc29jSW5kZXhPZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUdldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUhhcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZVNldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX0xpc3RDYWNoZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlQ2xlYXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc0tleWFibGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRNYXBEYXRhLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVEZWxldGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUdldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlSGFzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVTZXQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19NYXBDYWNoZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVtb2l6ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21lbW9pemVDYXBwZWQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdHJpbmdUb1BhdGguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hcnJheU1hcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VUb1N0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvdG9TdHJpbmcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jYXN0UGF0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcmd1bWVudHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc0luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0xlbmd0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvS2V5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzUGF0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaGFzLmpzIiwiLi4vLi4vc3JjL3NjcmlwdHMvbW9kZWwvZGF0YU1hbmFnZXIvbWFwRGF0YS5qcyIsIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL2RhdGFNYW5hZ2VyL2RvY0RhdGEuanMiLCIuLi8uLi9zcmMvc2NyaXB0cy9tb2RlbC9kYXRhTWFuYWdlci9kaXN0cmliRGF0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9pbnRlcnZhbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9kdXJhdGlvbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy9kYXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtdGltZS9zcmMvd2Vlay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy95ZWFyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3V0Y0RheS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lL3NyYy91dGNXZWVrLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXRpbWUvc3JjL3V0Y1llYXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtdGltZS1mb3JtYXQvc3JjL2xvY2FsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy10aW1lLWZvcm1hdC9zcmMvZGVmYXVsdExvY2FsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYXNjZW5kaW5nLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9pZGVudGl0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvZ3JvdXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL21heC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvcGVybXV0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvc3VtLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9zb3J0LmpzIiwiLi4vLi4vc3JjL3NjcmlwdHMvbW9kZWwvZGF0YU1hbmFnZXIvdHJlbmREYXRhLmpzIiwiLi4vLi4vc3JjL3NjcmlwdHMvbW9kZWwvZGF0YU1hbmFnZXIvc2VhcmNoRGF0YS5qcyIsIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL2RhdGFNYW5hZ2VyL0RhdGFNYW5hZ2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZnVuY3Rpb24gZ2V0Q29udHJvbHMobkN0cmwsIGNvbFNpemVzLCBhbGlnbiwgZGFzaGJvYXJkPXRydWUpe1xuXG4gICAgbGV0IHN1bSA9IChhLGIpPT5hK2I7XG4gICAgLy8gc2V0IGRlZmF1bHQgY29sdW1uIHNpemVzIGlmIG5vIGRlZmluZWRcbiAgICBpZihjb2xTaXplcy5sZW5ndGggPT0gMCl7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8bkN0cmw7aSsrKXtjb2xTaXplcy5wdXNoKDMpO31cbiAgICB9XG4gICAgLy8gZ2V0IHRvdGFsIG51bWJlciBvZiBjb2x1bW5zIG5lZWRlZCBhbmQgZXN0aW1hdGUgYXZhaWxhYmxlIGdyaWQgKGRhc2hib2FyZDpbMTIsMV0sIGNvbHVtbjpbNiwyXSlcbiAgICBsZXQgc3VtQ29scyA9IGNvbFNpemVzLnJlZHVjZShzdW0sIDApLFxuICAgICAgICBuQ29scyA9IGRhc2hib2FyZCA/IDEyIDogNixcbiAgICAgICAgblJvd3MgPSBzdW1Db2xzIDw9IG5Db2xzID8gMSA6IDI7XG4gICAgLy8gc2V0IHVwIGFyZWEgbmFtZXMgYW5kIGNvbHVtbiBzaXplcywgaWYgY3VtdWwgc2l6ZSBleGNlZWQgYXZhaWxhYmxlIGNvbHVtbnMsIGFkZCBhIG5ldyByb3dcbiAgICBsZXQgcm93cyA9IFtdO1xuICAgIGxldCBjdW11bENvbHMgPSAwO1xuICAgIGxldCByb3cgPSB7fTtcbiAgICBmb3IobGV0IGk9MDsgaTxuQ3RybDsgaSsrKXtcbiAgICAgICAgaWYoY3VtdWxDb2xzK2NvbFNpemVzW2ldID4gbkNvbHMpe1xuICAgICAgICAgICAgcm93cy5wdXNoKHsuLi5yb3d9KTtcbiAgICAgICAgICAgIHJvdyA9IHt9O1xuICAgICAgICAgICAgY3VtdWxDb2xzID0gMDtcbiAgICAgICAgfVxuICAgICAgICByb3dbYGNvbnRyb2wke2krMX1gXSA9IFtjb2xTaXplc1tpXSwgMV07XG4gICAgICAgIGN1bXVsQ29scyArPSBjb2xTaXplc1tpXTtcbiAgICB9XG4gICAgcm93cy5wdXNoKHsuLi5yb3d9KTtcbiAgICAvLyBjcmVhdGUgdGhlIGFyZWEgc3RyaW5ncyBmb3IgdGhlIGdyaWQgdGVtcGxhdGVcbiAgICBsZXQgYXJlYVN0cmluZ3MgPSByb3dzLm1hcChyPT5PYmplY3QuZW50cmllcyhyKS5tYXAoKFthcmVhLHNpemVdKT0+KGFyZWErJyAnKS5yZXBlYXQoc2l6ZVswXSkpKTtcbiAgICAvLyBmb3IgZWFjaCByb3csIGJ1aWxkIHRoZSBncmlkIHRlbXBsYXRlXG4gICAgbGV0IHRlbXBsYXRlID0gW107XG4gICAgZm9yKGxldCBpPTA7IGk8cm93cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCByb3dUZW1wbGF0ZSA9ICcnO1xuICAgICAgICAvLyBnZXQgcm93IHNpemUgaW4gdG90YWxcbiAgICAgICAgbGV0IHJvd0xlbmd0aCA9IE9iamVjdC52YWx1ZXMocm93c1tpXSkubWFwKHM9PnNbMF0pLnJlZHVjZShzdW0sIDApO1xuICAgICAgICAvLyBnZXQgc3BhY2UgbGVmdCBpbiByb3dcbiAgICAgICAgbGV0IHNwYWNlID0gbkNvbHMtcm93TGVuZ3RoO1xuICAgICAgICBsZXQgYSA9IGFsaWduO1xuICAgICAgICBpZihhcmVhU3RyaW5nc1tpXS5sZW5ndGggPT0gMSAmJiBhbGlnbiA9PSAnYicpe1xuICAgICAgICAgICAgYSA9ICdyJztcbiAgICAgICAgfSBlbHNlIGlmKGFyZWFTdHJpbmdzW2ldLmxlbmd0aCA9PSAxICYmIGFsaWduID09ICdhJykge1xuICAgICAgICAgICAgYSA9ICdjJztcbiAgICAgICAgfVxuICAgICAgICBpZihhID09PSAnbCcpe1xuICAgICAgICAgICAgLy8gbGVmdCBhbGlnbjogam9pbiBhbGwgYXJlYXMgYW5kIGFkZCBzcGFjZXMgYXQgdGhlIGVuZFxuICAgICAgICAgICAgcm93VGVtcGxhdGUgPSBhcmVhU3RyaW5nc1tpXS5qb2luKCcnKSsnLiAnLnJlcGVhdChzcGFjZSk7XG4gICAgICAgIH0gZWxzZSBpZihhID09PSAncicpe1xuICAgICAgICAgICAgLy8gcmlnaHQgYWxpZ246IGFkZCBzcGFjZXMgYW5kIGpvaW4gYWxsIGFyZWFzIGFmdGVyd2FyZHNcbiAgICAgICAgICAgIHJvd1RlbXBsYXRlID0gJy4gJy5yZXBlYXQoc3BhY2UpK2FyZWFTdHJpbmdzW2ldLmpvaW4oJycpO1xuICAgICAgICB9IGVsc2UgaWYoYSA9PT0gJ2MnKXtcbiAgICAgICAgICAgIC8vIGNlbnRyZSBhbGlnbjogYWRkIGhhbGYgdGhlIHNwYWNlcywgam9pbiBhbGwgYXJlYXMsIGFkZCBvdGhlciBoYWxmIG9mIHNwYWNlcyArIGV4dHJhIGlmIGFueVxuICAgICAgICAgICAgbGV0IHNwYWNlcyA9IE1hdGguZmxvb3Ioc3BhY2UvMik7XG4gICAgICAgICAgICBsZXQgZXh0cmEgPSBzcGFjZSUyO1xuICAgICAgICAgICAgcm93VGVtcGxhdGUgPSAnLiAnLnJlcGVhdChzcGFjZXMpK2FyZWFTdHJpbmdzW2ldLmpvaW4oJycpKycuICcucmVwZWF0KHNwYWNlcykrJy4gJy5yZXBlYXQoZXh0cmEpO1xuICAgICAgICB9IGVsc2UgaWYoYSA9PT0gJ2InKXtcbiAgICAgICAgICAgIC8vIHNwYWNlIGJldHdlZW4gYWxpZ246IGpvaW4gYXJlYXMgc3RyaW5ncyArIGluIGJldHdlZW4gc3BhY2UsIHRoZW4gYWRkIGFueSBleHRyYVxuICAgICAgICAgICAgbGV0IHNwYWNlcyA9IE1hdGguZmxvb3Ioc3BhY2UvKGFyZWFTdHJpbmdzW2ldLmxlbmd0aC0xKSk7XG4gICAgICAgICAgICBsZXQgZXh0cmEgPSBzcGFjZSUoYXJlYVN0cmluZ3NbaV0ubGVuZ3RoLTEpO1xuICAgICAgICAgICAgcm93VGVtcGxhdGUgPSBhcmVhU3RyaW5nc1tpXS5qb2luKCcuICcucmVwZWF0KHNwYWNlcykpKycuICcucmVwZWF0KGV4dHJhKTtcbiAgICAgICAgfSBlbHNlIGlmKGEgPT09ICdhJyl7XG4gICAgICAgICAgICAvLyBzcGFjZSBhcm91bmQgYWxpZ246IHNldCBpbml0aWFsIHNwYWNlLCBqb2luIGFyZWFzIHN0cmluZ3MgKyBpbiBiZXR3ZWVuIHNwYWNlLCBhZGQgcmVtYWluaW5nIHNwYWNlICsgZXh0cmEgaWYgYW55XG4gICAgICAgICAgICBsZXQgc3BhY2VzID0gTWF0aC5mbG9vcihzcGFjZS8oYXJlYVN0cmluZ3NbaV0ubGVuZ3RoKzEpKTtcbiAgICAgICAgICAgIGxldCBleHRyYSA9IHNwYWNlJShhcmVhU3RyaW5nc1tpXS5sZW5ndGgrMSk7XG4gICAgICAgICAgICByb3dUZW1wbGF0ZSA9ICcuICcucmVwZWF0KHNwYWNlcykrYXJlYVN0cmluZ3NbaV0uam9pbignLiAnLnJlcGVhdChzcGFjZXMpKSsnLiAnLnJlcGVhdChzcGFjZXMpKycuICcucmVwZWF0KGV4dHJhKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZS5wdXNoKHJvd1RlbXBsYXRlKTtcbiAgICB9XG4gICAgbGV0IGFyZWFzID0ge307XG4gICAgcm93cy5mb3JFYWNoKHI9PntcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocikuZm9yRWFjaCgoW2Esc10pPT57XG4gICAgICAgICAgICBhcmVhc1thXSA9IHM7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGFyZWFzWydjb250cm9sVCddID0gW25Db2xzLCBuUm93c107XG4gICAgcmV0dXJuIHtjdHJsQXJlYXM6IGFyZWFzLCBjdHJsVGVtcGxhdGU6IHRlbXBsYXRlLm1hcChyPT5gXCIke3J9XCJgKS5qb2luKCcnKX07XG59XG5cbmZ1bmN0aW9uIGNoZWNrQWxpZ24oYSl7XG4gICAgbGV0IHZhbHVlcyA9IFsnYScsICdiJywgJ2MnLCAnbCcsICdyJ107XG4gICAgaWYodmFsdWVzLmluY2x1ZGVzKGEpKXtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbnRyb2wgTGF5b3V0IC0gQmFkIEFsaWdubWVudCAtIERlZmF1bHQgdG8gXFwnbGVmdFxcJycpO1xuICAgICAgICByZXR1cm4gJ2wnO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tDb2xTaXplcyhjKXtcbiAgICBpZihjLnNvbWUoaXNOYU4pIHx8IGMuc29tZShzPT5zLmxlbmd0aDwxKSl7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnRyb2wgTGF5b3V0IC0gQmFkIENvbHVtbiBTaXplJyk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYy5tYXAocz0+TWF0aC5taW4ocGFyc2VJbnQocyksNikpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29udHJvbHMsIGRhc2hib2FyZD10cnVlKXtcblxuICAgIGxldCBbbkN0cmwsIC4uLnJlc3RdID0gY29udHJvbHMuc3BsaXQoJy0nKTtcblxuICAgIGlmKGlzTmFOKG5DdHJsKSB8fCBuQ3RybC5sZW5ndGg8MSl7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnRyb2wgTGF5b3V0IC0gQmFkIElucHV0Jyk7XG4gICAgICAgIHJldHVybiB7Y29udHJvbHM6IFtdLCBjb250cm9sVGVtcGxhdGU6ICcnfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuQ3RybCA9IHBhcnNlSW50KG5DdHJsKTtcbiAgICAgICAgbGV0IHNpemVzLCBhbGlnbjtcbiAgICAgICAgaWYobkN0cmwgPiByZXN0Lmxlbmd0aCB8fCBuQ3RybCA+IDQpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29udHJvbCBMYXlvdXQgLSBCYWQgSW5wdXQnKTtcbiAgICAgICAgICAgIHJldHVybiB7Y29udHJvbHM6IFtdLCBjb250cm9sVGVtcGxhdGU6ICcnfTtcbiAgICAgICAgfSBlbHNlIGlmKG5DdHJsID09IHJlc3QubGVuZ3RoKXtcbiAgICAgICAgICAgIHNpemVzID0gY2hlY2tDb2xTaXplcyhyZXN0KTtcbiAgICAgICAgICAgIGFsaWduID0gJ2wnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxpZ24gPSBjaGVja0FsaWduKHJlc3QucG9wKCkpO1xuICAgICAgICAgICAgc2l6ZXMgPSBjaGVja0NvbFNpemVzKHJlc3QpLnNsaWNlKDAsbkN0cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHNpemVzLnJlZHVjZSgoYSxiKT0+YStiLDApID4gMTIpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29udHJvbCBMYXlvdXQgLSBCYWQgSW5wdXQnKTtcbiAgICAgICAgICAgIHJldHVybiB7Y29udHJvbHM6IFtdLCBjb250cm9sVGVtcGxhdGU6ICcnfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0Q29udHJvbHMobkN0cmwsIHNpemVzLCBhbGlnbiwgZGFzaGJvYXJkKTtcbiAgICB9XG59IiwiZnVuY3Rpb24gYnVpbGRDb2xBKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbFQgOiBbNiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9OyBcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoQSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzEyLCAxMl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbEIoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMjRdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJcIiR7dGVtcGxhdGVQYW5lbDJ9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoQmEoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZERhc2hCYigpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzgsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzQsIDEyXSxcbiAgICAgICAgcGFuZWxUIDogWzEyLCAxMl1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29sQygpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzYsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbNiwgNl0sXG4gICAgICAgIHBhbmVsVCA6IFs2LCAyNF1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJcIiR7dGVtcGxhdGVQYW5lbDJ9XCJcIiR7dGVtcGxhdGVQYW5lbDN9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoQ2EoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs2LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzYsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfVwiXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDN9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoQ2IoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs4LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzQsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfVwiXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDN9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb2xEYSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzYsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsNCA6IFszLCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzYsIDI0XVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJcIiR7dGVtcGxhdGVQYW5lbDJ9XCJcIiR7dGVtcGxhdGVQYW5lbDN9JHt0ZW1wbGF0ZVBhbmVsNH1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbERiKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzYsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbNiwgMjRdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX1cIlwiJHt0ZW1wbGF0ZVBhbmVsMn0ke3RlbXBsYXRlUGFuZWwzfVwiXCIke3RlbXBsYXRlUGFuZWw0fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaERhKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbNiwgNl0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzMsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cIlwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwzfSR7dGVtcGxhdGVQYW5lbDR9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoRGIoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFszLCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzMsIDZdLFxuICAgICAgICBwYW5lbDQgOiBbNiwgNl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfSR7dGVtcGxhdGVQYW5lbDN9XCJcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsNH1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbEUoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFszLCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzMsIDZdLFxuICAgICAgICBwYW5lbDQgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsNSA6IFszLCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzYsIDI0XVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNSA9ICdwYW5lbDUgJy5yZXBlYXQoYXJlYXMucGFuZWw1WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfVwiXCIke3RlbXBsYXRlUGFuZWwyfSR7dGVtcGxhdGVQYW5lbDN9XCJcIiR7dGVtcGxhdGVQYW5lbDR9JHt0ZW1wbGF0ZVBhbmVsNX1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZERhc2hFKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzMsIDZdLFxuICAgICAgICBwYW5lbDUgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw1ID0gJ3BhbmVsNSAnLnJlcGVhdChhcmVhcy5wYW5lbDVbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn0ke3RlbXBsYXRlUGFuZWwzfVwiXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDR9JHt0ZW1wbGF0ZVBhbmVsNX1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbEZhKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsMiA6IFszLCA4XSxcbiAgICAgICAgcGFuZWwzIDogWzMsIDhdLFxuICAgICAgICBwYW5lbDQgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsNSA6IFszLCA4XSxcbiAgICAgICAgcGFuZWw2IDogWzMsIDhdLFxuICAgICAgICBwYW5lbFQgOiBbNiwgMjRdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw1ID0gJ3BhbmVsNSAnLnJlcGVhdChhcmVhcy5wYW5lbDVbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNiA9ICdwYW5lbDYgJy5yZXBlYXQoYXJlYXMucGFuZWw2WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9XCJcIiR7dGVtcGxhdGVQYW5lbDN9JHt0ZW1wbGF0ZVBhbmVsNH1cIlwiJHt0ZW1wbGF0ZVBhbmVsNX0ke3RlbXBsYXRlUGFuZWw2fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaEZhKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsMiA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzQsIDZdLFxuICAgICAgICBwYW5lbDQgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsNSA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWw2IDogWzQsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNSA9ICdwYW5lbDUgJy5yZXBlYXQoYXJlYXMucGFuZWw1WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDYgPSAncGFuZWw2ICcucmVwZWF0KGFyZWFzLnBhbmVsNlswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfSR7dGVtcGxhdGVQYW5lbDN9XCJcIiR7dGVtcGxhdGVQYW5lbDR9JHt0ZW1wbGF0ZVBhbmVsNX0ke3RlbXBsYXRlUGFuZWw2fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29sRmIoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFszLCA4XSxcbiAgICAgICAgcGFuZWwyIDogWzMsIDhdLFxuICAgICAgICBwYW5lbDMgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsNCA6IFszLCA4XSxcbiAgICAgICAgcGFuZWw1IDogWzMsIDhdLFxuICAgICAgICBwYW5lbDYgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsVCA6IFs2LCAyNF1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNCA9ICdwYW5lbDQgJy5yZXBlYXQoYXJlYXMucGFuZWw0WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDUgPSAncGFuZWw1ICcucmVwZWF0KGFyZWFzLnBhbmVsNVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw2ID0gJ3BhbmVsNiAnLnJlcGVhdChhcmVhcy5wYW5lbDZbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cIlwiJHt0ZW1wbGF0ZVBhbmVsM30ke3RlbXBsYXRlUGFuZWw0fVwiXCIke3RlbXBsYXRlUGFuZWw1fSR7dGVtcGxhdGVQYW5lbDZ9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoRmIoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWwyIDogWzQsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsNCA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWw1IDogWzQsIDZdLFxuICAgICAgICBwYW5lbDYgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw1ID0gJ3BhbmVsNSAnLnJlcGVhdChhcmVhcy5wYW5lbDVbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNiA9ICdwYW5lbDYgJy5yZXBlYXQoYXJlYXMucGFuZWw2WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9JHt0ZW1wbGF0ZVBhbmVsNX1cIlwiJHt0ZW1wbGF0ZVBhbmVsM30ke3RlbXBsYXRlUGFuZWw0fSR7dGVtcGxhdGVQYW5lbDZ9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcmVhcywgdGVtcGxhdGUsIGxheW91dCwgZGFzaGJvYXJkID0gdHJ1ZSl7XG4gICAgaWYobGF5b3V0Lmxlbmd0aCA8IDEpe1xuICAgICAgICBjb25zb2xlLmVycm9yKCdQYW5lbCBMYXlvdXQgLSBCYWQgSW5wdXQnKTtcbiAgICB9XG4gICAgbGV0IHtwYW5lbEFyZWFzLCBwYW5lbFRlbXBsYXRlfSA9IGxheW91dCA9PT0gJ0EnID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaEEoKSA6IGJ1aWxkQ29sQSgpKTpcbiAgICAgICAgbGF5b3V0ID09PSAnQmEnID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaEJhKCkgOiBidWlsZENvbEIoKSkgOlxuICAgICAgICAgICAgbGF5b3V0ID09PSAnQmInID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaEJiKCkgOiBidWlsZENvbEIoKSkgOlxuICAgICAgICAgICAgICAgIGxheW91dCA9PT0gJ0NhJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hDYSgpIDogYnVpbGRDb2xDKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnQ2InID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaENiKCkgOiBidWlsZENvbEMoKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnRGEnID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaERhKCkgOiBidWlsZENvbERhKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQgPT09ICdEYicgPyAoZGFzaGJvYXJkID8gYnVpbGREYXNoRGIoKSA6IGJ1aWxkQ29sRGIoKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQgPT09ICdFJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hFKCkgOiBidWlsZENvbEUoKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnRmEnID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaEZhKCkgOiBidWlsZENvbEZhKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQgPT09ICdGYicgPyAoZGFzaGJvYXJkID8gYnVpbGREYXNoRmIoKSA6IGJ1aWxkQ29sRmIoKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZERhc2hBKCk7XG4gICAgZm9yKGxldFthcmVhLCBzaXplXSBvZiBPYmplY3QuZW50cmllcyhwYW5lbEFyZWFzKSl7XG4gICAgICAgIGFyZWFzW2FyZWFdID0gc2l6ZTtcbiAgICB9XG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZStwYW5lbFRlbXBsYXRlO1xuICAgIHJldHVybiB7YXJlYXMsIHRlbXBsYXRlfTtcbn0iLCJleHBvcnQgdmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiB4aHRtbCxcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG4iLCJpbXBvcnQgbmFtZXNwYWNlcyBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHByZWZpeCA9IG5hbWUgKz0gXCJcIiwgaSA9IHByZWZpeC5pbmRleE9mKFwiOlwiKTtcbiAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzW3ByZWZpeF0sIGxvY2FsOiBuYW1lfSA6IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG59XG4iLCJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuL25hbWVzcGFjZS5qc1wiO1xuaW1wb3J0IHt4aHRtbH0gZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuIiwiZnVuY3Rpb24gbm9uZSgpIHt9XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gbm9uZSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9O1xufVxuIiwiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvcihzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIHN1Ym5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpKSB7XG4gICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIHN1Ymdyb3VwW2ldID0gc3Vibm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgXCJsZW5ndGhcIiBpbiB4XG4gICAgPyB4IC8vIEFycmF5LCBUeXBlZEFycmF5LCBOb2RlTGlzdCwgYXJyYXktbGlrZVxuICAgIDogQXJyYXkuZnJvbSh4KTsgLy8gTWFwLCBTZXQsIGl0ZXJhYmxlLCBzdHJpbmcsIG9yIGFueXRoaW5nIGVsc2Vcbn1cbiIsImZ1bmN0aW9uIGVtcHR5KCkge1xuICByZXR1cm4gW107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gZW1wdHkgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IGFycmF5IGZyb20gXCIuLi9hcnJheS5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yQWxsIGZyb20gXCIuLi9zZWxlY3RvckFsbC5qc1wiO1xuXG5mdW5jdGlvbiBhcnJheUFsbChzZWxlY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBncm91cCA9IHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBncm91cCA9PSBudWxsID8gW10gOiBhcnJheShncm91cCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCA9PT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBhcnJheUFsbChzZWxlY3QpO1xuICBlbHNlIHNlbGVjdCA9IHNlbGVjdG9yQWxsKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gW10sIHBhcmVudHMgPSBbXSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKTtcbiAgICAgICAgcGFyZW50cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZE1hdGNoZXIoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuIiwiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaW5kID0gQXJyYXkucHJvdG90eXBlLmZpbmQ7XG5cbmZ1bmN0aW9uIGNoaWxkRmluZChtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbmQuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoaWxkRmlyc3QoKSB7XG4gIHJldHVybiB0aGlzLmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QobWF0Y2ggPT0gbnVsbCA/IGNoaWxkRmlyc3RcbiAgICAgIDogY2hpbGRGaW5kKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCJpbXBvcnQge2NoaWxkTWF0Y2hlcn0gZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxudmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG5cbmZ1bmN0aW9uIGNoaWxkcmVuKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5GaWx0ZXIobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaWx0ZXIuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdEFsbChtYXRjaCA9PSBudWxsID8gY2hpbGRyZW5cbiAgICAgIDogY2hpbGRyZW5GaWx0ZXIodHlwZW9mIG1hdGNoID09PSBcImZ1bmN0aW9uXCIgPyBtYXRjaCA6IGNoaWxkTWF0Y2hlcihtYXRjaCkpKTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cbiIsImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2VudGVyIHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnRlck5vZGUocGFyZW50LCBkYXR1bSkge1xuICB0aGlzLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgdGhpcy5uYW1lc3BhY2VVUkkgPSBwYXJlbnQubmFtZXNwYWNlVVJJO1xuICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB0aGlzLl9fZGF0YV9fID0gZGF0dW07XG59XG5cbkVudGVyTm9kZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBFbnRlck5vZGUsXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fbmV4dCk7IH0sXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24oY2hpbGQsIG5leHQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5leHQpOyB9LFxuICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOyB9LFxuICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpOyB9XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCB7RW50ZXJOb2RlfSBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IGFycmF5IGZyb20gXCIuLi9hcnJheS5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuLi9jb25zdGFudC5qc1wiO1xuXG5mdW5jdGlvbiBiaW5kSW5kZXgocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSkge1xuICB2YXIgaSA9IDAsXG4gICAgICBub2RlLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGZpdCBpbnRvIHVwZGF0ZS5cbiAgLy8gUHV0IGFueSBudWxsIG5vZGVzIGludG8gZW50ZXIuXG4gIC8vIFB1dCBhbnkgcmVtYWluaW5nIGRhdGEgaW50byBlbnRlci5cbiAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBkb27igJl0IGZpdCBpbnRvIGV4aXQuXG4gIGZvciAoOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kS2V5KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEsIGtleSkge1xuICB2YXIgaSxcbiAgICAgIG5vZGUsXG4gICAgICBub2RlQnlLZXlWYWx1ZSA9IG5ldyBNYXAsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGtleVZhbHVlcyA9IG5ldyBBcnJheShncm91cExlbmd0aCksXG4gICAgICBrZXlWYWx1ZTtcblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggbm9kZS5cbiAgLy8gSWYgbXVsdGlwbGUgbm9kZXMgaGF2ZSB0aGUgc2FtZSBrZXksIHRoZSBkdXBsaWNhdGVzIGFyZSBhZGRlZCB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGtleVZhbHVlc1tpXSA9IGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApICsgXCJcIjtcbiAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggZGF0dW0uXG4gIC8vIElmIHRoZXJlIGEgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXksIGpvaW4gYW5kIGFkZCBpdCB0byB1cGRhdGUuXG4gIC8vIElmIHRoZXJlIGlzIG5vdCAob3IgdGhlIGtleSBpcyBhIGR1cGxpY2F0ZSksIGFkZCBpdCB0byBlbnRlci5cbiAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGtleVZhbHVlID0ga2V5LmNhbGwocGFyZW50LCBkYXRhW2ldLCBpLCBkYXRhKSArIFwiXCI7XG4gICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZS5kZWxldGUoa2V5VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZXNbaV0pID09PSBub2RlKSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRhdHVtKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuX19kYXRhX187XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLCBkYXR1bSk7XG5cbiAgdmFyIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4LFxuICAgICAgcGFyZW50cyA9IHRoaXMuX3BhcmVudHMsXG4gICAgICBncm91cHMgPSB0aGlzLl9ncm91cHM7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGNvbnN0YW50KHZhbHVlKTtcblxuICBmb3IgKHZhciBtID0gZ3JvdXBzLmxlbmd0aCwgdXBkYXRlID0gbmV3IEFycmF5KG0pLCBlbnRlciA9IG5ldyBBcnJheShtKSwgZXhpdCA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50c1tqXSxcbiAgICAgICAgZ3JvdXAgPSBncm91cHNbal0sXG4gICAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBkYXRhID0gYXJyYXkodmFsdWUuY2FsbChwYXJlbnQsIHBhcmVudCAmJiBwYXJlbnQuX19kYXRhX18sIGosIHBhcmVudHMpKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59XG4iLCJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9leGl0IHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbmVudGVyLCBvbnVwZGF0ZSwgb25leGl0KSB7XG4gIHZhciBlbnRlciA9IHRoaXMuZW50ZXIoKSwgdXBkYXRlID0gdGhpcywgZXhpdCA9IHRoaXMuZXhpdCgpO1xuICBlbnRlciA9IHR5cGVvZiBvbmVudGVyID09PSBcImZ1bmN0aW9uXCIgPyBvbmVudGVyKGVudGVyKSA6IGVudGVyLmFwcGVuZChvbmVudGVyICsgXCJcIik7XG4gIGlmIChvbnVwZGF0ZSAhPSBudWxsKSB1cGRhdGUgPSBvbnVwZGF0ZSh1cGRhdGUpO1xuICBpZiAob25leGl0ID09IG51bGwpIGV4aXQucmVtb3ZlKCk7IGVsc2Ugb25leGl0KGV4aXQpO1xuICByZXR1cm4gZW50ZXIgJiYgdXBkYXRlID8gZW50ZXIubWVyZ2UodXBkYXRlKS5vcmRlcigpIDogdXBkYXRlO1xufVxuIiwiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdGlvbikge1xuICBpZiAoIShzZWxlY3Rpb24gaW5zdGFuY2VvZiBTZWxlY3Rpb24pKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIG1lcmdlXCIpO1xuXG4gIGZvciAodmFyIGdyb3VwczAgPSB0aGlzLl9ncm91cHMsIGdyb3VwczEgPSBzZWxlY3Rpb24uX2dyb3VwcywgbTAgPSBncm91cHMwLmxlbmd0aCwgbTEgPSBncm91cHMxLmxlbmd0aCwgbSA9IE1hdGgubWluKG0wLCBtMSksIG1lcmdlcyA9IG5ldyBBcnJheShtMCksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAwID0gZ3JvdXBzMFtqXSwgZ3JvdXAxID0gZ3JvdXBzMVtqXSwgbiA9IGdyb3VwMC5sZW5ndGgsIG1lcmdlID0gbWVyZ2VzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cDBbaV0gfHwgZ3JvdXAxW2ldKSB7XG4gICAgICAgIG1lcmdlW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKDsgaiA8IG0wOyArK2opIHtcbiAgICBtZXJnZXNbal0gPSBncm91cHMwW2pdO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24obWVyZ2VzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IC0xLCBtID0gZ3JvdXBzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGlmIChuZXh0ICYmIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obmV4dCkgXiA0KSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmICghY29tcGFyZSkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICBmdW5jdGlvbiBjb21wYXJlTm9kZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmUoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc29ydGdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc29ydGdyb3VwID0gc29ydGdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc29ydGdyb3VwW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGdyb3VwLnNvcnQoY29tcGFyZU5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc29ydGdyb3VwcywgdGhpcy5fcGFyZW50cykub3JkZXIoKTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgYXJndW1lbnRzWzBdID0gdGhpcztcbiAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIG5vZGUgPSBncm91cFtpXTtcbiAgICAgIGlmIChub2RlKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBsZXQgc2l6ZSA9IDA7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzKSArK3NpemU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIHNpemU7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi4vbmFtZXNwYWNlLmpzXCI7XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmVOUyhmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb25OUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdik7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgIHJldHVybiBmdWxsbmFtZS5sb2NhbFxuICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKVxuICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKGZ1bGxuYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0clJlbW92ZU5TIDogYXR0clJlbW92ZSkgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSkpKGZ1bGxuYW1lLCB2YWx1ZSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIC8vIG5vZGUgaXMgYSBOb2RlXG4gICAgICB8fCAobm9kZS5kb2N1bWVudCAmJiBub2RlKSAvLyBub2RlIGlzIGEgV2luZG93XG4gICAgICB8fCBub2RlLmRlZmF1bHRWaWV3OyAvLyBub2RlIGlzIGEgRG9jdW1lbnRcbn1cbiIsImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIHN0eWxlUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdiwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyBzdHlsZVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHN0eWxlRnVuY3Rpb25cbiAgICAgICAgICAgIDogc3R5bGVDb25zdGFudCkobmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKVxuICAgICAgOiBzdHlsZVZhbHVlKHRoaXMubm9kZSgpLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlVmFsdWUobm9kZSwgbmFtZSkge1xuICByZXR1cm4gbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpXG4gICAgICB8fCBkZWZhdWx0Vmlldyhub2RlKS5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG59XG4iLCJmdW5jdGlvbiBwcm9wZXJ0eVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0gdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gcHJvcGVydHlSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gcHJvcGVydHlGdW5jdGlvblxuICAgICAgICAgIDogcHJvcGVydHlDb25zdGFudCkobmFtZSwgdmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKVtuYW1lXTtcbn1cbiIsImZ1bmN0aW9uIGNsYXNzQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NMaXN0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0IHx8IG5ldyBDbGFzc0xpc3Qobm9kZSk7XG59XG5cbmZ1bmN0aW9uIENsYXNzTGlzdChub2RlKSB7XG4gIHRoaXMuX25vZGUgPSBub2RlO1xuICB0aGlzLl9uYW1lcyA9IGNsYXNzQXJyYXkobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuQ2xhc3NMaXN0LnByb3RvdHlwZSA9IHtcbiAgYWRkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgdGhpcy5fbmFtZXMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjbGFzc2VkQWRkKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LmFkZChuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRSZW1vdmUobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QucmVtb3ZlKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFRydWUobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRBZGQodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRmFsc2UobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRSZW1vdmUodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24obmFtZXMsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAodmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IGNsYXNzZWRBZGQgOiBjbGFzc2VkUmVtb3ZlKSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBuYW1lcyA9IGNsYXNzQXJyYXkobmFtZSArIFwiXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBsaXN0ID0gY2xhc3NMaXN0KHRoaXMubm9kZSgpKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWxpc3QuY29udGFpbnMobmFtZXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb24gOiB2YWx1ZVxuICAgICAgPyBjbGFzc2VkVHJ1ZVxuICAgICAgOiBjbGFzc2VkRmFsc2UpKG5hbWVzLCB2YWx1ZSkpO1xufVxuIiwiZnVuY3Rpb24gdGV4dFJlbW92ZSgpIHtcbiAgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHRleHRDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyB0ZXh0UmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyB0ZXh0RnVuY3Rpb25cbiAgICAgICAgICA6IHRleHRDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcbn1cbiIsImZ1bmN0aW9uIGh0bWxSZW1vdmUoKSB7XG4gIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gaHRtbENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlubmVySFRNTCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gaHRtbFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gaHRtbEZ1bmN0aW9uXG4gICAgICAgICAgOiBodG1sQ29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufVxuIiwiZnVuY3Rpb24gcmFpc2UoKSB7XG4gIGlmICh0aGlzLm5leHRTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJhaXNlKTtcbn1cbiIsImZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChsb3dlcik7XG59XG4iLCJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZnVuY3Rpb24gY29uc3RhbnROdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSksXG4gICAgICBzZWxlY3QgPSBiZWZvcmUgPT0gbnVsbCA/IGNvbnN0YW50TnVsbCA6IHR5cGVvZiBiZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IGJlZm9yZSA6IHNlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn1cbiIsImZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyZW1vdmUpO1xufVxuIiwiZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lU2hhbGxvdygpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVEZWVwKCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZGVlcCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZGVlcCA/IHNlbGVjdGlvbl9jbG9uZURlZXAgOiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG59XG4iLCJmdW5jdGlvbiBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCwgdGhpcy5fX2RhdGFfXyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlKHR5cGVuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb247XG4gICAgaWYgKCFvbikgcmV0dXJuO1xuICAgIGZvciAodmFyIGogPSAwLCBpID0gLTEsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGlmIChvID0gb25bal0sICghdHlwZW5hbWUudHlwZSB8fCBvLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUpICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25bKytpXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgrK2kpIG9uLmxlbmd0aCA9IGk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fX29uO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkFkZCh0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbiwgbywgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIodmFsdWUpO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8ub3B0aW9ucyA9IG9wdGlvbnMpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBvcHRpb25zOiBvcHRpb25zfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGVuYW1lcyA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiksIGksIG4gPSB0eXBlbmFtZXMubGVuZ3RoLCB0O1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBvbiA9IHRoaXMubm9kZSgpLl9fb247XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgZm9yIChpID0gMCwgbyA9IG9uW2pdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICgodCA9IHR5cGVuYW1lc1tpXSkudHlwZSA9PT0gby50eXBlICYmIHQubmFtZSA9PT0gby5uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG8udmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb24gPSB2YWx1ZSA/IG9uQWRkIDogb25SZW1vdmU7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBvcHRpb25zKSk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3cuanNcIjtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgaWYgKHR5cGVvZiBldmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBkaXNwYXRjaEZ1bmN0aW9uXG4gICAgICA6IGRpc3BhdGNoQ29uc3RhbnQpKHR5cGUsIHBhcmFtcykpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qKCkge1xuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgeWllbGQgbm9kZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBzZWxlY3Rpb25fc2VsZWN0IGZyb20gXCIuL3NlbGVjdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RBbGwgZnJvbSBcIi4vc2VsZWN0QWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkIGZyb20gXCIuL3NlbGVjdENoaWxkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuIGZyb20gXCIuL3NlbGVjdENoaWxkcmVuLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2ZpbHRlciBmcm9tIFwiLi9maWx0ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VudGVyIGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2V4aXQgZnJvbSBcIi4vZXhpdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9qb2luIGZyb20gXCIuL2pvaW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb3JkZXIgZnJvbSBcIi4vb3JkZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc29ydCBmcm9tIFwiLi9zb3J0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NhbGwgZnJvbSBcIi4vY2FsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlcyBmcm9tIFwiLi9ub2Rlcy5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlIGZyb20gXCIuL25vZGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2l6ZSBmcm9tIFwiLi9zaXplLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VtcHR5IGZyb20gXCIuL2VtcHR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VhY2ggZnJvbSBcIi4vZWFjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hdHRyIGZyb20gXCIuL2F0dHIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcHJvcGVydHkgZnJvbSBcIi4vcHJvcGVydHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xhc3NlZCBmcm9tIFwiLi9jbGFzc2VkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9odG1sIGZyb20gXCIuL2h0bWwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmFpc2UgZnJvbSBcIi4vcmFpc2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbG93ZXIgZnJvbSBcIi4vbG93ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXBwZW5kIGZyb20gXCIuL2FwcGVuZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnNlcnQgZnJvbSBcIi4vaW5zZXJ0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xvbmUgZnJvbSBcIi4vY2xvbmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0dW0gZnJvbSBcIi4vZGF0dW0uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb24gZnJvbSBcIi4vb24uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faXRlcmF0b3IgZnJvbSBcIi4vaXRlcmF0b3IuanNcIjtcblxuZXhwb3J0IHZhciByb290ID0gW251bGxdO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0aW9uKGdyb3VwcywgcGFyZW50cykge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XV0sIHJvb3QpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fc2VsZWN0aW9uKCkge1xuICByZXR1cm4gdGhpcztcbn1cblxuU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZWxlY3Rpb24sXG4gIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICBzZWxlY3RDaGlsZDogc2VsZWN0aW9uX3NlbGVjdENoaWxkLFxuICBzZWxlY3RDaGlsZHJlbjogc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuLFxuICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgam9pbjogc2VsZWN0aW9uX2pvaW4sXG4gIG1lcmdlOiBzZWxlY3Rpb25fbWVyZ2UsXG4gIHNlbGVjdGlvbjogc2VsZWN0aW9uX3NlbGVjdGlvbixcbiAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzZWQsXG4gIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgcmFpc2U6IHNlbGVjdGlvbl9yYWlzZSxcbiAgbG93ZXI6IHNlbGVjdGlvbl9sb3dlcixcbiAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICBpbnNlcnQ6IHNlbGVjdGlvbl9pbnNlcnQsXG4gIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgY2xvbmU6IHNlbGVjdGlvbl9jbG9uZSxcbiAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgb246IHNlbGVjdGlvbl9vbixcbiAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaCxcbiAgW1N5bWJvbC5pdGVyYXRvcl06IHNlbGVjdGlvbl9pdGVyYXRvclxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VsZWN0aW9uO1xuIiwiaW1wb3J0IHtTZWxlY3Rpb24sIHJvb3R9IGZyb20gXCIuL3NlbGVjdGlvbi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKV1dLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbW3NlbGVjdG9yXV0sIHJvb3QpO1xufVxuIiwiXG5pbXBvcnQgQ29udHJvbHMgZnJvbSAnLi9wYWdlQ29udHJvbHMuanMnO1xuaW1wb3J0IFBhbmVscyBmcm9tICcuL3BhZ2VQYW5lbHMuanMnO1xuaW1wb3J0IHtzZWxlY3QgYXMgRDNTZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnRhaW5lcj0nYm9keScsIGxheW91dD0nQScsIGNvbnRyb2xzPScnLFxuICAgIGhlYWRlcj0nJywgZm9vdGVyPScnLCBtaW5XaWR0aD02MDAsIG1pbkhlaWdodD02MDApe1xuXG4gICAgLy8gTWFyZ2luIGNvbnN0YW50c1xuICAgIGNvbnN0IGhlaWdodE1hcmdpbiA9IDIwLCAvLyBzYXBjZSB0byByZW1vdmUgd2hlbiBjb21wdXRpbmcgdGhlIGF2YWlsYWJsZSBoZWlnaHRcbiAgICAgICAgd2lkdGhNYXJnaW4gPSAyMDAsIC8vIHNhcGNlIHRvIHJlbW92ZSB3aGVuIGNvbXB1dGluZyB0aGUgYXZhaWxhYmxlIHdpZHRoXG4gICAgICAgIHBhbmVsTWFyZ2luID0gNSwgLy8gc3BhY2UgYmV0d2VlbiBwYW5lbHNcbiAgICAgICAgY29udHJvbE1hcmdpbiA9IDU7IC8vIHNwYWNlIHRvIHB1dCBiZWxvdyBjb250cm9sc1xuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGF2YWlsYWJsZSBoZWlnaHRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUb3RhbEhlaWdodChiYXNlSCl7XG4gICAgICAgIGxldCBoZWFkSCA9IChoZWFkZXI9PT0nJykgPyAwIDogRDNTZWxlY3QoaGVhZGVyKS5ub2RlKCkub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgZm9vdEggPSAoZm9vdGVyPT09JycpID8gMCA6IEQzU2VsZWN0KGZvb3Rlcikubm9kZSgpLm9mZnNldEhlaWdodDtcbiAgICAgICAgcmV0dXJuIGJhc2VIIC0gaGVhZEggLSBmb290SCAtIGhlaWdodE1hcmdpbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgYXZhaWxhYmxlIHdpZHRoXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG90YWx0V2lkdGgoYmFzZVcpe1xuICAgICAgICByZXR1cm4gYmFzZVctd2lkdGhNYXJnaW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2l6ZXMgY29udGFpbmVyIGFuZCBhcHBsaWVzIGdyZGkgbGF5b3V0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0R3JpZCh3LCBoLCBjLCB0KXtcbiAgICAgICAgcmV0dXJuIEQzU2VsZWN0KGMpXG4gICAgICAgICAgICAuc3R5bGUoJ3dpZHRoJywgdysncHgnKVxuICAgICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCBoKydweCcpXG4gICAgICAgICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnZ3JpZCcpXG4gICAgICAgICAgICAuc3R5bGUoJ2dyaWQtdGVtcGxhdGUtYXJlYXMnLCB0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuZCBzaXplcyB0aGUgY29udGFpbmVyIGZvciBlYWNoIGNvbnRyb2wgYW5kIHBhbmVsc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNpemVzKHdpZHRoLCBoZWlnaHQsIGFyZWFzLCBncmlkKXtcbiAgICAgICAgbGV0IHNpemVzID0ge307XG4gICAgICAgIC8vIGZvciBldmVyeSBhcmVhcyAoZXhjbHVkaW5nIHRoZSB0b3RhbHMpXG4gICAgICAgIGZvcihsZXQgYXJlYSBvZiBPYmplY3Qua2V5cyhhcmVhcykpe1xuICAgICAgICAgICAgaWYoYXJlYSAhPT0gJ3RvdGFsJyAmJiAhYXJlYS5lbmRzV2l0aCgnVCcpKXtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlIHRoZSBzaXplXG4gICAgICAgICAgICAgICAgbGV0IGggPSBNYXRoLmZsb29yKChoZWlnaHQqYXJlYXNbYXJlYV1bMV0vYXJlYXNbJ3RvdGFsJ11bMV0pLShwYW5lbE1hcmdpbioyKSksXG4gICAgICAgICAgICAgICAgICAgIHcgPSBNYXRoLmZsb29yKCh3aWR0aCphcmVhc1thcmVhXVswXS9hcmVhc1sndG90YWwnXVswXSktKHBhbmVsTWFyZ2luKjIpKTtcbiAgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIGxldCBjID0gYGRpdiMke2FyZWF9YDtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IGdyaWQuc2VsZWN0KGMpO1xuICAgICAgICAgICAgICAgIGlmKHMuZW1wdHkoKSl7XG4gICAgICAgICAgICAgICAgICAgIHMgPSBncmlkLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdpZCcsIGFyZWEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gZ3JpZCBhcmVhIHRvIGNvbnRhaW5lciBhbmQgc2l6ZSBpdFxuICAgICAgICAgICAgICAgIHMuc3R5bGUoJ2dyaWQtYXJlYScsIGFyZWEpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgaCsncHgnKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ21hcmdpbicsIHBhbmVsTWFyZ2luKydweCcpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnbWFyZ2luLWJvdHRvbScsICgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7KGFyZWEuaW5jbHVkZXMoJ2NvbnRyb2wnKSkgPyBjb250cm9sTWFyZ2luK3BhbmVsTWFyZ2luIDogcGFuZWxNYXJnaW59cHhgO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciB0aGUgY29udGFpbmVyIGFuZCBpdHMgc2l6ZVxuICAgICAgICAgICAgICAgIHNpemVzW2FyZWFdID0ge2MsdyxofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2l6ZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRQYWdlKCl7XG4gICAgICAgIC8vIGdldCB0aGUgYmFzZSBkaW1lbnNpb24gZm9yIHRoZSBwYWdlXG4gICAgICAgIGNvbnN0IGJhc2VIID0gTWF0aC5tYXgod2luZG93LmlubmVySGVpZ2h0LCBtaW5IZWlnaHQpLFxuICAgICAgICAgICAgYmFzZVcgPSBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aCwgbWluV2lkdGgpO1xuICAgICAgICAvLyBlc3RpbWF0ZSB0aGUgYXZhaWxhYmxlIHNwYWNlXG4gICAgICAgIGxldCB0b3RhbEggPSBnZXRUb3RhbEhlaWdodChiYXNlSCksXG4gICAgICAgICAgICB0b3RhbFcgPSBnZXRUb3RhbHRXaWR0aChiYXNlVyk7XG4gICAgICAgIC8vIGNoZWNrIGlmIG5lZWRzIHRvIGJlIGluIGNvbHVtbiBvciBkYXNoYm9hcmQgZm9ybWF0XG4gICAgICAgIGxldCBkYXNoYm9hcmQgPSB0b3RhbFcqMi8zID49IHRvdGFsSDtcbiAgICAgICAgLy8gYWRqdXN0IGF2YWlsYWJsZSBoZWlnaHQgaWYgY29sdW1uIGZvcm1hdFxuICAgICAgICBpZighZGFzaGJvYXJkICYmIGxheW91dCE9PSdBJyl7XG4gICAgICAgICAgICB0b3RhbEggKj0gMjtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHRoZSBjb250cm9scyBhcmVhcyBhbmQgdGVtcGxhdGVcbiAgICAgICAgbGV0IHtjdHJsQXJlYXMsIGN0cmxUZW1wbGF0ZX0gPSAoY29udHJvbHMhPT0nJykgPyBDb250cm9scyhjb250cm9scywgZGFzaGJvYXJkKSA6IHtjdHJsQXJlYXM6e2NvbnRyb2xUOlswLDBdfSwgY3RybFRlbXBsYXRlOicnfTtcbiAgICAgICAgLy8gY29tcGxldGUgd2l0aCBwYW5lbHMgYXJlYXMgYW5kIHRlbXBsYXRlXG4gICAgICAgIGxldCB7YXJlYXMsIHRlbXBsYXRlfSA9IFBhbmVscyhjdHJsQXJlYXMsIGN0cmxUZW1wbGF0ZSwgbGF5b3V0LCBkYXNoYm9hcmQpO1xuICAgICAgICAvLyBnZXQgdG90YWwgYXJlYSBzaXplXG4gICAgICAgIGFyZWFzWyd0b3RhbCddID0gW2Rhc2hib2FyZD8xMjo2LCBhcmVhcy5jb250cm9sVFsxXSthcmVhcy5wYW5lbFRbMV1dO1xuICAgICAgICAvLyBzaXplIGNvbnRhaW5lciBhbmQgYXBwbHkgZ3JpZCBsYXlvdXRcbiAgICAgICAgbGV0IGdyaWQgPSBnZXRHcmlkKHRvdGFsVywgdG90YWxILCBjb250YWluZXIsIHRlbXBsYXRlKTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgZ3JpZCBhcmVhcywgc2l6ZSB0aGVtLCBhbmQgcmV0dXJuXG4gICAgICAgIHJldHVybiAgZ2V0U2l6ZXModG90YWxXLCB0b3RhbEgsIGFyZWFzLCBncmlkKTtcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIGNvbnRyb2xzIGFuZCBwYW5lbHNcbiAgICBsZXQgc2l6ZXMgPSBidWlsZFBhZ2UoKTtcblxuICAgIC8vIHdhdGNoIGZ1bmN0aW9uIHRvIGF1dG8tcmVzaXplIG1vZHVsZXNcbiAgICBzaXplcy53YXRjaCA9IGZ1bmN0aW9uKG1vZHVsZXMpe1xuICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKT0+e1xuICAgICAgICAgICAgbGV0IHMgPSBidWlsZFBhZ2UoKTtcbiAgICAgICAgICAgIGZvcihsZXQgW2FyZWEsIG1vZHVsZV0gb2YgT2JqZWN0LmVudHJpZXMobW9kdWxlcykpe1xuICAgICAgICAgICAgICAgIGlmKCdzZXRTaXplJyBpbiBtb2R1bGUpe1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuc2V0U2l6ZShzW2FyZWFdLndpZHRoLCBzW2FyZWFdLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7YXJlYX0gbWlzc2luZyBzZXRTaXplKClgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiBzaXplcztcbn0iLCJ2YXIgRU9MID0ge30sXG4gICAgRU9GID0ge30sXG4gICAgUVVPVEUgPSAzNCxcbiAgICBORVdMSU5FID0gMTAsXG4gICAgUkVUVVJOID0gMTM7XG5cbmZ1bmN0aW9uIG9iamVjdENvbnZlcnRlcihjb2x1bW5zKSB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oXCJkXCIsIFwicmV0dXJuIHtcIiArIGNvbHVtbnMubWFwKGZ1bmN0aW9uKG5hbWUsIGkpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobmFtZSkgKyBcIjogZFtcIiArIGkgKyBcIl0gfHwgXFxcIlxcXCJcIjtcbiAgfSkuam9pbihcIixcIikgKyBcIn1cIik7XG59XG5cbmZ1bmN0aW9uIGN1c3RvbUNvbnZlcnRlcihjb2x1bW5zLCBmKSB7XG4gIHZhciBvYmplY3QgPSBvYmplY3RDb252ZXJ0ZXIoY29sdW1ucyk7XG4gIHJldHVybiBmdW5jdGlvbihyb3csIGkpIHtcbiAgICByZXR1cm4gZihvYmplY3Qocm93KSwgaSwgY29sdW1ucyk7XG4gIH07XG59XG5cbi8vIENvbXB1dGUgdW5pcXVlIGNvbHVtbnMgaW4gb3JkZXIgb2YgZGlzY292ZXJ5LlxuZnVuY3Rpb24gaW5mZXJDb2x1bW5zKHJvd3MpIHtcbiAgdmFyIGNvbHVtblNldCA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICBjb2x1bW5zID0gW107XG5cbiAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIGZvciAodmFyIGNvbHVtbiBpbiByb3cpIHtcbiAgICAgIGlmICghKGNvbHVtbiBpbiBjb2x1bW5TZXQpKSB7XG4gICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW5TZXRbY29sdW1uXSA9IGNvbHVtbik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29sdW1ucztcbn1cblxuZnVuY3Rpb24gcGFkKHZhbHVlLCB3aWR0aCkge1xuICB2YXIgcyA9IHZhbHVlICsgXCJcIiwgbGVuZ3RoID0gcy5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oMCkgKyBzIDogcztcbn1cblxuZnVuY3Rpb24gZm9ybWF0WWVhcih5ZWFyKSB7XG4gIHJldHVybiB5ZWFyIDwgMCA/IFwiLVwiICsgcGFkKC15ZWFyLCA2KVxuICAgIDogeWVhciA+IDk5OTkgPyBcIitcIiArIHBhZCh5ZWFyLCA2KVxuICAgIDogcGFkKHllYXIsIDQpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgdmFyIGhvdXJzID0gZGF0ZS5nZXRVVENIb3VycygpLFxuICAgICAgbWludXRlcyA9IGRhdGUuZ2V0VVRDTWludXRlcygpLFxuICAgICAgc2Vjb25kcyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpLFxuICAgICAgbWlsbGlzZWNvbmRzID0gZGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgcmV0dXJuIGlzTmFOKGRhdGUpID8gXCJJbnZhbGlkIERhdGVcIlxuICAgICAgOiBmb3JtYXRZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgNCkgKyBcIi1cIiArIHBhZChkYXRlLmdldFVUQ01vbnRoKCkgKyAxLCAyKSArIFwiLVwiICsgcGFkKGRhdGUuZ2V0VVRDRGF0ZSgpLCAyKVxuICAgICAgKyAobWlsbGlzZWNvbmRzID8gXCJUXCIgKyBwYWQoaG91cnMsIDIpICsgXCI6XCIgKyBwYWQobWludXRlcywgMikgKyBcIjpcIiArIHBhZChzZWNvbmRzLCAyKSArIFwiLlwiICsgcGFkKG1pbGxpc2Vjb25kcywgMykgKyBcIlpcIlxuICAgICAgOiBzZWNvbmRzID8gXCJUXCIgKyBwYWQoaG91cnMsIDIpICsgXCI6XCIgKyBwYWQobWludXRlcywgMikgKyBcIjpcIiArIHBhZChzZWNvbmRzLCAyKSArIFwiWlwiXG4gICAgICA6IG1pbnV0ZXMgfHwgaG91cnMgPyBcIlRcIiArIHBhZChob3VycywgMikgKyBcIjpcIiArIHBhZChtaW51dGVzLCAyKSArIFwiWlwiXG4gICAgICA6IFwiXCIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWxpbWl0ZXIpIHtcbiAgdmFyIHJlRm9ybWF0ID0gbmV3IFJlZ0V4cChcIltcXFwiXCIgKyBkZWxpbWl0ZXIgKyBcIlxcblxccl1cIiksXG4gICAgICBERUxJTUlURVIgPSBkZWxpbWl0ZXIuY2hhckNvZGVBdCgwKTtcblxuICBmdW5jdGlvbiBwYXJzZSh0ZXh0LCBmKSB7XG4gICAgdmFyIGNvbnZlcnQsIGNvbHVtbnMsIHJvd3MgPSBwYXJzZVJvd3ModGV4dCwgZnVuY3Rpb24ocm93LCBpKSB7XG4gICAgICBpZiAoY29udmVydCkgcmV0dXJuIGNvbnZlcnQocm93LCBpIC0gMSk7XG4gICAgICBjb2x1bW5zID0gcm93LCBjb252ZXJ0ID0gZiA/IGN1c3RvbUNvbnZlcnRlcihyb3csIGYpIDogb2JqZWN0Q29udmVydGVyKHJvdyk7XG4gICAgfSk7XG4gICAgcm93cy5jb2x1bW5zID0gY29sdW1ucyB8fCBbXTtcbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUm93cyh0ZXh0LCBmKSB7XG4gICAgdmFyIHJvd3MgPSBbXSwgLy8gb3V0cHV0IHJvd3NcbiAgICAgICAgTiA9IHRleHQubGVuZ3RoLFxuICAgICAgICBJID0gMCwgLy8gY3VycmVudCBjaGFyYWN0ZXIgaW5kZXhcbiAgICAgICAgbiA9IDAsIC8vIGN1cnJlbnQgbGluZSBudW1iZXJcbiAgICAgICAgdCwgLy8gY3VycmVudCB0b2tlblxuICAgICAgICBlb2YgPSBOIDw9IDAsIC8vIGN1cnJlbnQgdG9rZW4gZm9sbG93ZWQgYnkgRU9GP1xuICAgICAgICBlb2wgPSBmYWxzZTsgLy8gY3VycmVudCB0b2tlbiBmb2xsb3dlZCBieSBFT0w/XG5cbiAgICAvLyBTdHJpcCB0aGUgdHJhaWxpbmcgbmV3bGluZS5cbiAgICBpZiAodGV4dC5jaGFyQ29kZUF0KE4gLSAxKSA9PT0gTkVXTElORSkgLS1OO1xuICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoTiAtIDEpID09PSBSRVRVUk4pIC0tTjtcblxuICAgIGZ1bmN0aW9uIHRva2VuKCkge1xuICAgICAgaWYgKGVvZikgcmV0dXJuIEVPRjtcbiAgICAgIGlmIChlb2wpIHJldHVybiBlb2wgPSBmYWxzZSwgRU9MO1xuXG4gICAgICAvLyBVbmVzY2FwZSBxdW90ZXMuXG4gICAgICB2YXIgaSwgaiA9IEksIGM7XG4gICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGopID09PSBRVU9URSkge1xuICAgICAgICB3aGlsZSAoSSsrIDwgTiAmJiB0ZXh0LmNoYXJDb2RlQXQoSSkgIT09IFFVT1RFIHx8IHRleHQuY2hhckNvZGVBdCgrK0kpID09PSBRVU9URSk7XG4gICAgICAgIGlmICgoaSA9IEkpID49IE4pIGVvZiA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKChjID0gdGV4dC5jaGFyQ29kZUF0KEkrKykpID09PSBORVdMSU5FKSBlb2wgPSB0cnVlO1xuICAgICAgICBlbHNlIGlmIChjID09PSBSRVRVUk4pIHsgZW9sID0gdHJ1ZTsgaWYgKHRleHQuY2hhckNvZGVBdChJKSA9PT0gTkVXTElORSkgKytJOyB9XG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGogKyAxLCBpIC0gMSkucmVwbGFjZSgvXCJcIi9nLCBcIlxcXCJcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbmQgbmV4dCBkZWxpbWl0ZXIgb3IgbmV3bGluZS5cbiAgICAgIHdoaWxlIChJIDwgTikge1xuICAgICAgICBpZiAoKGMgPSB0ZXh0LmNoYXJDb2RlQXQoaSA9IEkrKykpID09PSBORVdMSU5FKSBlb2wgPSB0cnVlO1xuICAgICAgICBlbHNlIGlmIChjID09PSBSRVRVUk4pIHsgZW9sID0gdHJ1ZTsgaWYgKHRleHQuY2hhckNvZGVBdChJKSA9PT0gTkVXTElORSkgKytJOyB9XG4gICAgICAgIGVsc2UgaWYgKGMgIT09IERFTElNSVRFUikgY29udGludWU7XG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGosIGkpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXR1cm4gbGFzdCB0b2tlbiBiZWZvcmUgRU9GLlxuICAgICAgcmV0dXJuIGVvZiA9IHRydWUsIHRleHQuc2xpY2UoaiwgTik7XG4gICAgfVxuXG4gICAgd2hpbGUgKCh0ID0gdG9rZW4oKSkgIT09IEVPRikge1xuICAgICAgdmFyIHJvdyA9IFtdO1xuICAgICAgd2hpbGUgKHQgIT09IEVPTCAmJiB0ICE9PSBFT0YpIHJvdy5wdXNoKHQpLCB0ID0gdG9rZW4oKTtcbiAgICAgIGlmIChmICYmIChyb3cgPSBmKHJvdywgbisrKSkgPT0gbnVsbCkgY29udGludWU7XG4gICAgICByb3dzLnB1c2gocm93KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZWZvcm1hdEJvZHkocm93cywgY29sdW1ucykge1xuICAgIHJldHVybiByb3dzLm1hcChmdW5jdGlvbihyb3cpIHtcbiAgICAgIHJldHVybiBjb2x1bW5zLm1hcChmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFZhbHVlKHJvd1tjb2x1bW5dKTtcbiAgICAgIH0pLmpvaW4oZGVsaW1pdGVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdChyb3dzLCBjb2x1bW5zKSB7XG4gICAgaWYgKGNvbHVtbnMgPT0gbnVsbCkgY29sdW1ucyA9IGluZmVyQ29sdW1ucyhyb3dzKTtcbiAgICByZXR1cm4gW2NvbHVtbnMubWFwKGZvcm1hdFZhbHVlKS5qb2luKGRlbGltaXRlcildLmNvbmNhdChwcmVmb3JtYXRCb2R5KHJvd3MsIGNvbHVtbnMpKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Qm9keShyb3dzLCBjb2x1bW5zKSB7XG4gICAgaWYgKGNvbHVtbnMgPT0gbnVsbCkgY29sdW1ucyA9IGluZmVyQ29sdW1ucyhyb3dzKTtcbiAgICByZXR1cm4gcHJlZm9ybWF0Qm9keShyb3dzLCBjb2x1bW5zKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Um93cyhyb3dzKSB7XG4gICAgcmV0dXJuIHJvd3MubWFwKGZvcm1hdFJvdykuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFJvdyhyb3cpIHtcbiAgICByZXR1cm4gcm93Lm1hcChmb3JtYXRWYWx1ZSkuam9pbihkZWxpbWl0ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IFwiXCJcbiAgICAgICAgOiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyBmb3JtYXREYXRlKHZhbHVlKVxuICAgICAgICA6IHJlRm9ybWF0LnRlc3QodmFsdWUgKz0gXCJcIikgPyBcIlxcXCJcIiArIHZhbHVlLnJlcGxhY2UoL1wiL2csIFwiXFxcIlxcXCJcIikgKyBcIlxcXCJcIlxuICAgICAgICA6IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwYXJzZTogcGFyc2UsXG4gICAgcGFyc2VSb3dzOiBwYXJzZVJvd3MsXG4gICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgZm9ybWF0Qm9keTogZm9ybWF0Qm9keSxcbiAgICBmb3JtYXRSb3dzOiBmb3JtYXRSb3dzLFxuICAgIGZvcm1hdFJvdzogZm9ybWF0Um93LFxuICAgIGZvcm1hdFZhbHVlOiBmb3JtYXRWYWx1ZVxuICB9O1xufVxuIiwiaW1wb3J0IGRzdiBmcm9tIFwiLi9kc3YuanNcIjtcblxudmFyIGNzdiA9IGRzdihcIixcIik7XG5cbmV4cG9ydCB2YXIgY3N2UGFyc2UgPSBjc3YucGFyc2U7XG5leHBvcnQgdmFyIGNzdlBhcnNlUm93cyA9IGNzdi5wYXJzZVJvd3M7XG5leHBvcnQgdmFyIGNzdkZvcm1hdCA9IGNzdi5mb3JtYXQ7XG5leHBvcnQgdmFyIGNzdkZvcm1hdEJvZHkgPSBjc3YuZm9ybWF0Qm9keTtcbmV4cG9ydCB2YXIgY3N2Rm9ybWF0Um93cyA9IGNzdi5mb3JtYXRSb3dzO1xuZXhwb3J0IHZhciBjc3ZGb3JtYXRSb3cgPSBjc3YuZm9ybWF0Um93O1xuZXhwb3J0IHZhciBjc3ZGb3JtYXRWYWx1ZSA9IGNzdi5mb3JtYXRWYWx1ZTtcbiIsImZ1bmN0aW9uIHJlc3BvbnNlVGV4dChyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzICsgXCIgXCIgKyByZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIGZldGNoKGlucHV0LCBpbml0KS50aGVuKHJlc3BvbnNlVGV4dCk7XG59XG4iLCJpbXBvcnQge2NzdlBhcnNlLCBkc3ZGb3JtYXQsIHRzdlBhcnNlfSBmcm9tIFwiZDMtZHN2XCI7XG5pbXBvcnQgdGV4dCBmcm9tIFwiLi90ZXh0LmpzXCI7XG5cbmZ1bmN0aW9uIGRzdlBhcnNlKHBhcnNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihpbnB1dCwgaW5pdCwgcm93KSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIGluaXQgPT09IFwiZnVuY3Rpb25cIikgcm93ID0gaW5pdCwgaW5pdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGV4dChpbnB1dCwgaW5pdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHBhcnNlKHJlc3BvbnNlLCByb3cpO1xuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkc3YoZGVsaW1pdGVyLCBpbnB1dCwgaW5pdCwgcm93KSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIHR5cGVvZiBpbml0ID09PSBcImZ1bmN0aW9uXCIpIHJvdyA9IGluaXQsIGluaXQgPSB1bmRlZmluZWQ7XG4gIHZhciBmb3JtYXQgPSBkc3ZGb3JtYXQoZGVsaW1pdGVyKTtcbiAgcmV0dXJuIHRleHQoaW5wdXQsIGluaXQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gZm9ybWF0LnBhcnNlKHJlc3BvbnNlLCByb3cpO1xuICB9KTtcbn1cblxuZXhwb3J0IHZhciBjc3YgPSBkc3ZQYXJzZShjc3ZQYXJzZSk7XG5leHBvcnQgdmFyIHRzdiA9IGRzdlBhcnNlKHRzdlBhcnNlKTtcbiIsImZ1bmN0aW9uIHJlc3BvbnNlSnNvbihyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzICsgXCIgXCIgKyByZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA0IHx8IHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA1KSByZXR1cm47XG4gIHJldHVybiByZXNwb25zZS5qc29uKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBmZXRjaChpbnB1dCwgaW5pdCkudGhlbihyZXNwb25zZUpzb24pO1xufVxuIiwiaW1wb3J0IHtqc29uIGFzIEQzSnNvbixcbiAgICBjc3YgYXMgRDNDc3YsXG4gICAgdGV4dCBhcyBEM1RleHR9IGZyb20gJ2QzLWZldGNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXtcbiAgICBsZXQgRGF0YSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTG9hZHMgZGF0YSBmcm9tIHVybHMgb2JqZWN0IHdpdGggZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAgICAgKiB7bmFtZTogdXJsLCAuLi59XG4gICAgICogUmV0dXJucyBwcm9taXNlIHdpdGggbG9hZGVkIGRhdGEgYXMgcGFyYW1ldGVyXG4gICAgICovXG4gICAgRGF0YS5sb2FkRGF0YUZyb21VcmxzID0gZnVuY3Rpb24odXJscyl7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyh1cmxzKS5tYXAoKFtuYW1lLCB1cmxdKT0+e1xuICAgICAgICAgICAgaWYodXJsLmVuZHNXaXRoKCcuanNvbicpIHx8IHVybC5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gRDNKc29uKHVybCkudGhlbihkYXRhPT57cmV0dXJuIHtuYW1lLCBkYXRhfTt9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih1cmwuZW5kc1dpdGgoJy5jc3YnKSB8fCB1cmwuaW5jbHVkZXMoJ3RleHQvY3N2Jykpe1xuICAgICAgICAgICAgICAgIHJldHVybiBEM0Nzdih1cmwpLnRoZW4oZGF0YT0+e3JldHVybiB7bmFtZSwgZGF0YX07fSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBEM1RleHQodXJsKS50aGVuKGRhdGE9PntyZXR1cm4ge25hbWUsIGRhdGF9O30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBzZXQgb2YgIGRhdGEgaW4gdGhlIGZvcm1hdDpcbiAgICAgKiBbe25hbWUsIGRhdGF9LCAuLi5dXG4gICAgICogQW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBwdWJsaWMgb2JqZWN0IGZvciBhY2Nlc3NcbiAgICAgKi9cbiAgICBEYXRhLnByb2Nlc3NEYXRhID0gZnVuY3Rpb24oZGF0YUFycmF5KXtcbiAgICAgICAgRGF0YS5kYXRhID0ge307XG4gICAgICAgIGZvcihsZXQge25hbWUsIGRhdGF9IG9mIGRhdGFBcnJheSl7XG4gICAgICAgICAgICBEYXRhLmRhdGFbbmFtZV0gPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEYXRhO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb21iaW5lcyBsb2FkRGF0YUZyb21VcmxzIGFuZCBwcm9jZXNzRGF0YSBpbiB0byBvbmUgZnVuY3Rpb24uXG4gICAgICogVGFrZXMgdXJscyBvYmplY3QgYXMgaW5wdXQ6XG4gICAgICoge25hbWU6IHVybCwgLi4ufVxuICAgICAqIFJldHVybiBhIHByb21pc2VcbiAgICAgKi9cbiAgICBEYXRhLmxvYWRBbmRQcm9jZXNzRGF0YUZyb21VcmxzID0gZnVuY3Rpb24odXJscyl7XG4gICAgICAgIHJldHVybiBEYXRhLmxvYWREYXRhRnJvbVVybHModXJscykudGhlbihkPT57XG4gICAgICAgICAgICBEYXRhLnByb2Nlc3NEYXRhKGQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERhdGE7XG59IiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXMob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSGFzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXk7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5leHBvcnQgZGVmYXVsdCBmcmVlR2xvYmFsO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhd1RhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBvYmplY3RUb1N0cmluZztcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBnZXRSYXdUYWcgZnJvbSAnLi9fZ2V0UmF3VGFnLmpzJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL19vYmplY3RUb1N0cmluZy5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0VGFnO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNTeW1ib2w7XG4iLCJpbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzU3ltYm9sIGZyb20gJy4vaXNTeW1ib2wuanMnO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuZXhwb3J0IGRlZmF1bHQgY29yZUpzRGF0YTtcbiIsImltcG9ydCBjb3JlSnNEYXRhIGZyb20gJy4vX2NvcmVKc0RhdGEuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Tb3VyY2U7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTWFza2VkIGZyb20gJy4vX2lzTWFza2VkLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRWYWx1ZTtcbiIsImltcG9ydCBiYXNlSXNOYXRpdmUgZnJvbSAnLi9fYmFzZUlzTmF0aXZlLmpzJztcbmltcG9ydCBnZXRWYWx1ZSBmcm9tICcuL19nZXRWYWx1ZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE5hdGl2ZTtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlQ3JlYXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaERlbGV0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoR2V0O1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hIYXM7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoU2V0O1xuIiwiaW1wb3J0IGhhc2hDbGVhciBmcm9tICcuL19oYXNoQ2xlYXIuanMnO1xuaW1wb3J0IGhhc2hEZWxldGUgZnJvbSAnLi9faGFzaERlbGV0ZS5qcyc7XG5pbXBvcnQgaGFzaEdldCBmcm9tICcuL19oYXNoR2V0LmpzJztcbmltcG9ydCBoYXNoSGFzIGZyb20gJy4vX2hhc2hIYXMuanMnO1xuaW1wb3J0IGhhc2hTZXQgZnJvbSAnLi9faGFzaFNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBIYXNoO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVDbGVhcjtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBlcTtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXNzb2NJbmRleE9mO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlR2V0O1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlSGFzO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZVNldDtcbiIsImltcG9ydCBsaXN0Q2FjaGVDbGVhciBmcm9tICcuL19saXN0Q2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbGlzdENhY2hlRGVsZXRlIGZyb20gJy4vX2xpc3RDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbGlzdENhY2hlR2V0IGZyb20gJy4vX2xpc3RDYWNoZUdldC5qcyc7XG5pbXBvcnQgbGlzdENhY2hlSGFzIGZyb20gJy4vX2xpc3RDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbGlzdENhY2hlU2V0IGZyb20gJy4vX2xpc3RDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTGlzdENhY2hlO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBNYXA7XG4iLCJpbXBvcnQgSGFzaCBmcm9tICcuL19IYXNoLmpzJztcbmltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUNsZWFyO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0tleWFibGU7XG4iLCJpbXBvcnQgaXNLZXlhYmxlIGZyb20gJy4vX2lzS2V5YWJsZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TWFwRGF0YTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUdldDtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZUhhcztcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlU2V0O1xuIiwiaW1wb3J0IG1hcENhY2hlQ2xlYXIgZnJvbSAnLi9fbWFwQ2FjaGVDbGVhci5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVEZWxldGUgZnJvbSAnLi9fbWFwQ2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IG1hcENhY2hlR2V0IGZyb20gJy4vX21hcENhY2hlR2V0LmpzJztcbmltcG9ydCBtYXBDYWNoZUhhcyBmcm9tICcuL19tYXBDYWNoZUhhcy5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVTZXQgZnJvbSAnLi9fbWFwQ2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ2FjaGU7XG4iLCJpbXBvcnQgTWFwQ2FjaGUgZnJvbSAnLi9fTWFwQ2FjaGUuanMnO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW9pemU7XG4iLCJpbXBvcnQgbWVtb2l6ZSBmcm9tICcuL21lbW9pemUuanMnO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW9pemVDYXBwZWQ7XG4iLCJpbXBvcnQgbWVtb2l6ZUNhcHBlZCBmcm9tICcuL19tZW1vaXplQ2FwcGVkLmpzJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChzdHJpbmcuY2hhckNvZGVBdCgwKSA9PT0gNDYgLyogLiAqLykge1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgfVxuICBzdHJpbmcucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdWJTdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdUb1BhdGg7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcnJheU1hcDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBhcnJheU1hcCBmcm9tICcuL19hcnJheU1hcC5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzU3ltYm9sIGZyb20gJy4vaXNTeW1ib2wuanMnO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgcmV0dXJuIGFycmF5TWFwKHZhbHVlLCBiYXNlVG9TdHJpbmcpICsgJyc7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlVG9TdHJpbmc7XG4iLCJpbXBvcnQgYmFzZVRvU3RyaW5nIGZyb20gJy4vX2Jhc2VUb1N0cmluZy5qcyc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9TdHJpbmc7XG4iLCJpbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzS2V5IGZyb20gJy4vX2lzS2V5LmpzJztcbmltcG9ydCBzdHJpbmdUb1BhdGggZnJvbSAnLi9fc3RyaW5nVG9QYXRoLmpzJztcbmltcG9ydCB0b1N0cmluZyBmcm9tICcuL3RvU3RyaW5nLmpzJztcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2FzdFBhdGg7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNBcmd1bWVudHM7XG4iLCJpbXBvcnQgYmFzZUlzQXJndW1lbnRzIGZyb20gJy4vX2Jhc2VJc0FyZ3VtZW50cy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJndW1lbnRzO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0luZGV4O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0xlbmd0aDtcbiIsImltcG9ydCBpc1N5bWJvbCBmcm9tICcuL2lzU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvS2V5O1xuIiwiaW1wb3J0IGNhc3RQYXRoIGZyb20gJy4vX2Nhc3RQYXRoLmpzJztcbmltcG9ydCBpc0FyZ3VtZW50cyBmcm9tICcuL2lzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNJbmRleCBmcm9tICcuL19pc0luZGV4LmpzJztcbmltcG9ydCBpc0xlbmd0aCBmcm9tICcuL2lzTGVuZ3RoLmpzJztcbmltcG9ydCB0b0tleSBmcm9tICcuL190b0tleS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNQYXRoO1xuIiwiaW1wb3J0IGJhc2VIYXMgZnJvbSAnLi9fYmFzZUhhcy5qcyc7XG5pbXBvcnQgaGFzUGF0aCBmcm9tICcuL19oYXNQYXRoLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiB7ICdiJzogMiB9IH07XG4gKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXMob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob3RoZXIsICdhJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhcztcbiIsImltcG9ydCBoYXMgZnJvbSAnbG9kYXNoLWVzL2hhcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKERhdGEpe1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB0b3BpYyBpZCBmcm9tIG1haW4gdG9waWMgbWFwLCBnZXRzIHRoZSBkYXRhIHRvIHRoZSBhc3NvY2lhdGVkIHN1YiBtYXBcbiAgICAgKiBhbmQgc2V0cyBpdCB0byBzdWJNYXAgZGF0YSBhdHRyaWJ1dGUuXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBzdWJNYXBzIG5vdCBsb2FkZWQgb3IgaWYgbm8gc3ViTWFwIGNhbiBiZSBmb3VuZCB3aXRoIG1haW5Ub3BpY0lkXG4gICAgICovXG4gICAgRGF0YS5zZXRTdWJNYXAgPSBmdW5jdGlvbihtYWluVG9waWNJZCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnc3ViTWFwcycpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogc3ViTWFwcyB3ZXJlIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcyA9IERhdGEuZGF0YS5zdWJNYXBzLmZpbHRlcihkPT57cmV0dXJuIGQubWFpblRvcGljSWQgPT09IG1haW5Ub3BpY0lkO30pO1xuICAgICAgICBpZihzLmxlbmd0aCA8IDEpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBubyBzdWJNYXAgd2VyZSBmb3VuZCB3aXRoIG1haW5Ub3BpY0lkICcrbWFpblRvcGljSWQpO1xuICAgICAgICB9XG4gICAgICAgIERhdGEuZGF0YS5zdWJNYXAgPSBEYXRhLmRhdGEuc3ViTWFwcy5maWx0ZXIoZD0+e3JldHVybiBkLm1haW5Ub3BpY0lkID09PSBtYWluVG9waWNJZDt9KVswXS5zdWJNYXA7XG4gICAgICAgIHJldHVybiBEYXRhO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHRvcGljIGlkIGZyb20gbWFpbiB0b3BpYyBtYXAsIGdldHMgdGhlIGRhdGEgdG8gdGhlIGFzc29jaWF0ZWQgc3ViIG1hcFxuICAgICAqIHNldHMgaXQgdG8gc3ViTWFwIGRhdGEgYXR0cmlidXRlLCBhbmQgcmV0dXJucyBpdC5cbiAgICAgKiBcbiAgICAgKiBJZiBtYWluIHRvcGljIGlkIGlzIG5vdCBzcGVjaWZpZWQsIGRpcmVjdGx5IHJldHVybnMgdGhlIHN1Yk1hcCBwcmV2aW91c2x5IHNldFxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgc3ViTWFwIHdhcyBub3Qgc2V0XG4gICAgICovXG4gICAgRGF0YS5nZXRTdWJNYXAgPSBmdW5jdGlvbihtYWluVG9waWNJZD1udWxsKXtcbiAgICAgICAgaWYobWFpblRvcGljSWQgPT0gbnVsbCl7XG4gICAgICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ3N1Ym1hcCcpKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IHN1Yk1hcCB3YXMgbm90IHNldCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIERhdGEuZGF0YS5zdWJNYXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEYXRhLnNldFN1Yk1hcChtYWluVG9waWNJZCk7XG4gICAgICAgICAgICByZXR1cm4gRGF0YS5kYXRhLnN1Yk1hcDtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIGdpdmVuIGRhdGEgc3RydWN0dXJlIGNvbnRhaW5pbmcgYW4gYXJyYXkgb2YgdG9waWNzIChtYXAgb3IgbW9kZWwpXG4gICAgICogcmV0dXJucyB0aGUgdG9waWMgd2l0aCBzcGVjaWZpZWQgdG9waWNJZCwgb3IgbnVsbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRvcGljKGRhdGEsIHRvcGljSWQpe1xuICAgICAgICBsZXQgdCA9IGRhdGEudG9waWNzLmZpbHRlcih0PT57cmV0dXJuIHQudG9waWNJZCA9PT0gdG9waWNJZDt9KTtcbiAgICAgICAgcmV0dXJuIHQubGVuZ3RoID09PSAwID8gbnVsbCA6IHRbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB0b3BpYyBpZCByZXR1cm4gdGhlIGFzc29jaWF0ZWQgdG9waWMgZGF0YSBmcm9tIG1haW4gYnViYmxlIG1hcFxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgbWFpbk1hcCB3YXMgbm90IGxvYWRlZCBhbmQgaWYgdG9waWNJZCBub3QgZm91bmQgaW4gbWFpbk1hcFxuICAgICAqL1xuICAgIERhdGEuZ2V0VG9waWNNYWluTWFwID0gZnVuY3Rpb24odG9waWNJZCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnbWFpbk1hcCcpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbWFpbk1hcCB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9IFxuICAgICAgICBsZXQgdCA9IGdldFRvcGljKERhdGEuZGF0YS5tYWluTWFwLCB0b3BpY0lkKTtcbiAgICAgICAgaWYodCA9PSBudWxsKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogdG9waWMgJyt0b3BpY0lkKycgd2FzIG5vdCBmb3VuZCBpbiBtYWluTWFwJyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHRvcGljIGlkIHJldHVybiB0aGUgYXNzb2NpYXRlZCB0b3BpYyBkYXRhIGZyb20gY3VycmVudCBzdWIgYnViYmxlIG1hcFxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgc3ViTWFwIHdhcyBub3Qgc2V0IGFuZCBpZiB0b3BpY0lkIG5vdCBmb3VuZCBpbiBzdWJNYXBcbiAgICAgKi9cbiAgICBEYXRhLmdldFRvcGljU3ViTWFwID0gZnVuY3Rpb24odG9waWNJZCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnc3ViTWFwJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBzdWJNYXAgd2FzIG5vdCBzZXQnKTtcbiAgICAgICAgfSBcbiAgICAgICAgbGV0IHQgPSBnZXRUb3BpYyhEYXRhLmRhdGEuc3ViTWFwLCB0b3BpY0lkKTtcbiAgICAgICAgaWYodCA9PSBudWxsKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogdG9waWMgJyt0b3BpY0lkKycgd2FzIG5vdCBmb3VuZCBpbiBzdWJNYXAnKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbn0iLCJpbXBvcnQgaGFzIGZyb20gJ2xvZGFzaC1lcy9oYXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihEYXRhKXtcblxuICAgIC8qKlxuICAgICAqIGdpdmVuIGRhdGEgc3RydWN0dXJlIGNvbnRhaW5pbmcgYW4gYXJyYXkgb2YgdG9waWNzIChtYXAgb3IgbW9kZWwpXG4gICAgICogcmV0dXJucyB0aGUgdG9waWMgd2l0aCBzcGVjaWZpZWQgdG9waWNJZCwgb3IgbnVsbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRvcGljKGRhdGEsIHRvcGljSWQpe1xuICAgICAgICBsZXQgdCA9IGRhdGEudG9waWNzLmZpbHRlcih0PT57cmV0dXJuIHQudG9waWNJZCA9PT0gdG9waWNJZDt9KTtcbiAgICAgICAgcmV0dXJuIHQubGVuZ3RoID09PSAwID8gbnVsbCA6IHRbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB0b3BpY0lkIGZyb20gdGhlIG1haW4gbW9kZWwsIHdpbGwgc2V0IHRoZSB0YWJsZSByb3dzIHRvIHRoZSB0b3BpY3MncyB0b3AgZG9jdW1lbnRzXG4gICAgICogaWYgdGhlIHRvcGljIGlzbid0IGZvdW5kIHNldHMgaXQgdG8gZW1wdHlcbiAgICAgKiBXaWxsIHRocm93IGVycm9yIGlmIG1haW5Nb2RlbCBpc24ndCBsb2FkZWRcbiAgICAgKi9cbiAgICBEYXRhLnNldFRhYmxlUm93c01haW5Ub3BpYyA9IGZ1bmN0aW9uKHRvcGljSWQpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ21haW5Nb2RlbCcpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbWFpbk1vZGVsIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHQgPSBnZXRUb3BpYyhEYXRhLmRhdGEubWFpbk1vZGVsLCB0b3BpY0lkKTtcbiAgICAgICAgRGF0YS5kYXRhLnRhYmxlUm93cyA9IHQ9PT1udWxsID8gW10gOiB0LnRvcERvY3M7XG4gICAgICAgIHJldHVybiBEYXRhO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHRvcGljSWQgZnJvbSB0aGUgc3ViIG1vZGVsLCB3aWxsIHNldCB0aGUgdGFibGUgcm93cyB0byB0aGUgdG9waWNzJ3MgdG9wIGRvY3VtZW50c1xuICAgICAqIGlmIHRoZSB0b3BpYyBpc24ndCBmb3VuZCBzZXRzIGl0IHRvIGVtcHR5XG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBzdWJNb2RlbCBpc24ndCBsb2FkZWRcbiAgICAgKi9cbiAgICBEYXRhLnNldFRhYmxlUm93c1N1YlRvcGljID0gZnVuY3Rpb24odG9waWNJZCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnc3ViTW9kZWwnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IHN1Yk1vZGVsIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHQgPSBnZXRUb3BpYyhEYXRhLmRhdGEuc3ViVG9waWNNb2RlbCwgdG9waWNJZCk7XG4gICAgICAgIERhdGEuZGF0YS50YWJsZVJvd3MgPSB0PT09bnVsbCA/IFtdIDogdC50b3BEb2NzO1xuICAgICAgICByZXR1cm4gRGF0YTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcm93cyBkYXRhIGZvciB0aGUgdGFibGUuXG4gICAgICogQ2FuIHNwZWNpZnkgYSBudW1iZXIgb2Ygcm93cyAoZGVmIDEwKSwgYW5kIGZpbHRlciBmdW5jdGlvbiAoZGVmIHJldHVybiB0cnVlKVxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgdGFibGUgaGFzbid0IGJlZW4gc2V0IHlldFxuICAgICAqL1xuICAgIERhdGEuZ2V0VGFibGVSb3dzID0gZnVuY3Rpb24obnVtYmVyID0gMTAsIGZpbHRlciA9ICgpPT50cnVlKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICd0YWJsZVJvd3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IHRhYmxlUk93cyB3ZXJlIG5vdCBzZXQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGF0YS5kYXRhLnRhYmxlUm93cy5maWx0ZXIoZmlsdGVyKS5zbGljZSgwLCBudW1iZXIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGRvY3VtZW50IGlkLCByZXR1cm5zIHRoZSBhc3NvY2lhdGVkIGRvY3VtZW50IGZvbXIgdGhlIGN1cnJlbnQgdGFibGUgcm93cyBcbiAgICAgKiBXaWxsIHRocm93IGVycm9yIGlmIHRhYmxlIGlzIG5vdCBzZXQgb3IgZW1wdHkgb3IgaWYgZG9jdW1lbnQgbm90IGZvdW5kIGluIHRhYmxlXG4gICAgICovXG4gICAgRGF0YS5nZXREb2N1bWVudCA9IGZ1bmN0aW9uKGRvY0lkKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICd0YWJsZVJvd3MnKSB8fCBEYXRhLmRhdGEudGFibGVSb3dzLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogdGFibGVST3dzIHdlcmUgbm90IHNldCBvciBhcmUgZW1wdHknKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IERhdGEuZGF0YS50YWJsZVJvd3MuZmlsdGVyKGQ9PmQuZG9jSWQ9PWRvY0lkKTtcbiAgICAgICAgaWYoZC5sZW5ndGggPCAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogY291bGQgbm90IGZpbmQgZG9jdW1lbnQgJytkb2NJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRbMF07XG4gICAgfTtcbn0iLCJpbXBvcnQgaGFzIGZyb20gJ2xvZGFzaC1lcy9oYXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihEYXRhKXtcblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgZGlzdHJpYnV0aW9ucyBsYWJlbHNcbiAgICAgKiBDYW4gcHJvdmlkZSBhIGN1c3RvbSBmdW5jdGlvbiB0byB0cmFuc2Zvcm0gdGhlIHRleHRcbiAgICAgKiBSZXR1cm5zIFt7dmFsdWUsIHRleHR9XVxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZGlzdHJpYnV0aW9uIHdhcyBub3QgbG9hZGVkXG4gICAgICovXG4gICAgRGF0YS5nZXREaXN0cmlidXRpb25MYWJlbHMgPSBmdW5jdGlvbih0ZXh0RnVuY3Rpb24gPSBkPT5kKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdkaXN0cmlidXRpb24nKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IGRpc3RyaWJ1dGlvbiB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbnRyeSA9IERhdGEuZGF0YS5kaXN0cmlidXRpb24ubWFpblRvcGljc1swXS5kaXN0cmlidXRpb247XG4gICAgICAgIHJldHVybiBlbnRyeS5tYXAoZD0+ZC5pZCkubWFwKHY9PntcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6diwgdGV4dDp0ZXh0RnVuY3Rpb24odil9O1xuICAgICAgICB9KS5zb3J0KChhLGIpPT57XG4gICAgICAgICAgICByZXR1cm4gKGEudGV4dCA8IGIudGV4dCkgPyAtMSA6IChhLnRleHQgPiBiLnRleHQpID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIHRvcGljcyBhbmQgd2VpZ2h0cyBmb3IgYSBwYXJ0aWN1bGFyIGZpZWxkTmFtZSBpbiB0aGUgZGlzdHJpYnV0aW9uIHRvcGljRGlzdHJpYlxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZmllbGROYW1lIG5vdCBmb3VuZCBpbiBhbnkgdG9waWMgZGlzdHJpYnV0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG9waWNzRGlzdHJpYnV0aW9uKHRvcGljRGlzdHJpYiwgZmllbGROYW1lKXtcbiAgICAgICAgcmV0dXJuIHRvcGljRGlzdHJpYi5maWx0ZXIoZD0+e1xuICAgICAgICAgICAgcmV0dXJuIGQudG9waWNJZCA+IC0xO1xuICAgICAgICB9KS5tYXAoZD0+e1xuICAgICAgICAgICAgbGV0IHYgPSBkLmRpc3RyaWJ1dGlvblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZT0+e3JldHVybiBlLmlkID09PSBmaWVsZE5hbWU7fSlcbiAgICAgICAgICAgICAgICAubWFwKGU9PmUud2VpZ2h0KTtcbiAgICAgICAgICAgIGlmKHYubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6ICcrZmllbGROYW1lKycgbm90IGZvdW5kIGluIGRpc3RyaWJ1dGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdiA9IHZbMF07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRvcGljSWQ6IGQudG9waWNJZCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGlzdCBvZiB0b3BpY3MgYW5kIHdlaWdodHMgZm9yIGEgcGFydGljdWxhciBmaWVsZE5hbWUgaW4gdGhlIGRpc3RyaWJ1dGlvbiB0b3BpY0Rpc3RyaWJcbiAgICAgKiBOb3JtYWxpc2VkIGFjcm9zcyBhbGwgb3RoZXIgZmllbGRzXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBmaWVsZE5hbWUgbm90IGZvdW5kIGluIGFueSB0b3BpYyBkaXN0cmlidXRpb25cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUb3BpY3NEaXN0cmlidXRpb25Ob3JtYWxpc2VkUGVyVG9waWModG9waWNEaXN0cmliLCBmaWVsZE5hbWUpe1xuICAgICAgICByZXR1cm4gdG9waWNEaXN0cmliLmZpbHRlcihkPT57XG4gICAgICAgICAgICByZXR1cm4gZC50b3BpY0lkID4gLTE7XG4gICAgICAgIH0pLm1hcChkPT57XG4gICAgICAgICAgICBsZXQgdiA9IGQuZGlzdHJpYnV0aW9uXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlPT57cmV0dXJuIGUuaWQgPT09IGZpZWxkTmFtZTt9KVxuICAgICAgICAgICAgICAgIC5tYXAoZT0+ZS53ZWlnaHQvZC50b3RhbCk7XG4gICAgICAgICAgICBpZih2Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiAnK2ZpZWxkTmFtZSsnIG5vdCBmb3VuZCBpbiBkaXN0cmlidXRpb24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYgPSB2WzBdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3BpY0lkOiBkLnRvcGljSWQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgdG9waWNzIGFuZCB3ZWlnaHRzIGZvciBhIHBhcnRpY3VsYXIgZmllbGROYW1lIGluIHRoZSBkaXN0cmlidXRpb24gdG9waWNEaXN0cmliXG4gICAgICogTm9ybWFsaXNlZCBhY3Jvc3MgYWxsIHRvcGljc1xuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZmllbGROYW1lIG5vdCBmb3VuZCBpbiBhbnkgdG9waWMgZGlzdHJpYnV0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG9waWNzRGlzdHJpYnV0aW9uTm9ybWFsaXNlZFBlckZpZWxkKHRvcGljRGlzdHJpYiwgZmllbGROYW1lKXtcbiAgICAgICAgbGV0IGZpZWxkRGlzdHJpYnV0aW9uID0gdG9waWNEaXN0cmliLmZpbHRlcihkPT57IHJldHVybiBkLnRvcGljSWQgPiAtMTsgfSlcbiAgICAgICAgICAgIC5tYXAoZD0+e1xuICAgICAgICAgICAgICAgIGxldCB2ID0gZC5kaXN0cmlidXRpb25cbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihlPT57cmV0dXJuIGUuaWQgPT09IGZpZWxkTmFtZTt9KVxuICAgICAgICAgICAgICAgICAgICAubWFwKGU9PmUud2VpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZih2Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogJytmaWVsZE5hbWUrJyBub3QgZm91bmQgaW4gZGlzdHJpYnV0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHYgPSB2WzBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcGljSWQ6IGQudG9waWNJZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGxldCBmaWVsZFRvdGFsID0gZmllbGREaXN0cmlidXRpb24ucmVkdWNlKChhY2MsIGN1cik9PntyZXR1cm4gYWNjK2N1ci52YWx1ZTt9LCAwKTtcbiAgICAgICAgcmV0dXJuIGZpZWxkRGlzdHJpYnV0aW9uLm1hcChkPT57cmV0dXJuIHt0b3BpY0lkOmQudG9waWNJZCx2YWx1ZTpkLnZhbHVlL2ZpZWxkVG90YWx9O30pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHRvcGljIGRpc3RyaWJ1dGlvbiBmcm9tIHRoZSBtYWluIHRvcGljcyBnaXZlbiBhIGRpc3RyaWJ1dGlvbiBmaWVsZE5hbWUgXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBkaXN0cmlidXRpb24gbm8gbG9hZGVkIG9yIGlmIGRpc3RyaWJ1dGlvbiBkb2Vzbid0IGhhdmUgbWFpbiB0b3BpY3NcbiAgICAgKi9cbiAgICBEYXRhLmdldE1haW5Ub3BpY3NEaXN0cmliID0gZnVuY3Rpb24oZmllbGROYW1lKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdkaXN0cmlidXRpb24nKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IGRpc3RyaWJ1dGlvbiB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbiwgJ21haW5Ub3BpY3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBmb3IgbWFpbiB0b3BpY3MnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0VG9waWNzRGlzdHJpYnV0aW9uKERhdGEuZGF0YS5kaXN0cmlidXRpb24ubWFpblRvcGljcywgZmllbGROYW1lKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdG9waWMgZGlzdHJpYnV0aW9uIGZyb20gdGhlIHN1YiB0b3BpY3MgZ2l2ZW4gYSBkaXN0cmlidXRpb24gZmllbGROYW1lIFxuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZGlzdHJpYnV0aW9uIG5vIGxvYWRlZCBvciBpZiBkaXN0cmlidXRpb24gZG9lc24ndCBoYXZlIHN1YiB0b3BpY3NcbiAgICAgKi9cbiAgICBEYXRhLmdldFN1YlRvcGljc0Rpc3RyaWIgPSBmdW5jdGlvbihmaWVsZE5hbWUpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ2Rpc3RyaWJ1dGlvbicpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogZGlzdHJpYnV0aW9uIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLCAnc3ViVG9waWNzJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBubyBkaXN0cmlidXRpb24gZm9yIHN1YiB0b3BpY3MnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0VG9waWNzRGlzdHJpYnV0aW9uKERhdGEuZGF0YS5kaXN0cmlidXRpb24uc3ViVG9waWNzLCBmaWVsZE5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0b3BpYyBkaXN0cmlidXRpb24gZnJvbSB0aGUgbWFpbiB0b3BpY3MgZ2l2ZW4gYSBkaXN0cmlidXRpb24gZmllbGROYW1lIFxuICAgICAqIE5vcm1hbGlzZWQgYWNyb3NzIG90aGVyIGZpZWxkc1xuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZGlzdHJpYnV0aW9uIG5vIGxvYWRlZCBvciBpZiBkaXN0cmlidXRpb24gZG9lc24ndCBoYXZlIG1haW4gdG9waWNzXG4gICAgICovXG4gICAgRGF0YS5nZXRNYWluVG9waWNzRGlzdHJpYk5vcm1QZXJUb3BpYyA9IGZ1bmN0aW9uKGZpZWxkTmFtZSl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnZGlzdHJpYnV0aW9uJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBkaXN0cmlidXRpb24gd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaGFzKERhdGEuZGF0YS5kaXN0cmlidXRpb24sICdtYWluVG9waWNzJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBubyBkaXN0cmlidXRpb24gZm9yIG1haW4gdG9waWNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldFRvcGljc0Rpc3RyaWJ1dGlvbk5vcm1hbGlzZWRQZXJUb3BpYyhEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLm1haW5Ub3BpY3MsIGZpZWxkTmFtZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5vcm1hbGlzZWQgdG9waWMgZGlzdHJpYnV0aW9uIGZyb20gdGhlIHN1YiB0b3BpY3MgZ2l2ZW4gYSBkaXN0cmlidXRpb24gZmllbGROYW1lIFxuICAgICAqIE5vcm1hbGlzZWQgYWNyb3NzIG90aGVyIGZpZWxkc1xuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgZGlzdHJpYnV0aW9uIG5vIGxvYWRlZCBvciBpZiBkaXN0cmlidXRpb24gZG9lc24ndCBoYXZlIHN1YiB0b3BpY3NcbiAgICAgKi9cbiAgICBEYXRhLmdldFN1YlRvcGljc0Rpc3RyaWJOb3JtUGVyVG9waWMgPSBmdW5jdGlvbihmaWVsZE5hbWUpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ2Rpc3RyaWJ1dGlvbicpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogZGlzdHJpYnV0aW9uIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLCAnc3ViVG9waWNzJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBubyBkaXN0cmlidXRpb24gZm9yIHN1YiB0b3BpY3MnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0VG9waWNzRGlzdHJpYnV0aW9uTm9ybWFsaXNlZFBlclRvcGljKERhdGEuZGF0YS5kaXN0cmlidXRpb24uc3ViVG9waWNzLCBmaWVsZE5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0b3BpYyBkaXN0cmlidXRpb24gZnJvbSB0aGUgbWFpbiB0b3BpY3MgZ2l2ZW4gYSBkaXN0cmlidXRpb24gZmllbGROYW1lIFxuICAgICAqIE5vcm1hbGlzZWQgYWNyb3NzIGFsbCB0b3BpY3NcbiAgICAgKiBXaWxsIHRocm93IGVycm9yIGlmIGRpc3RyaWJ1dGlvbiBubyBsb2FkZWQgb3IgaWYgZGlzdHJpYnV0aW9uIGRvZXNuJ3QgaGF2ZSBtYWluIHRvcGljc1xuICAgICAqL1xuICAgIERhdGEuZ2V0TWFpblRvcGljc0Rpc3RyaWJOb3JtUGVyRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWUpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ2Rpc3RyaWJ1dGlvbicpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogZGlzdHJpYnV0aW9uIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLCAnbWFpblRvcGljcycpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gZGlzdHJpYnV0aW9uIGZvciBtYWluIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRUb3BpY3NEaXN0cmlidXRpb25Ob3JtYWxpc2VkUGVyRmllbGQoRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbi5tYWluVG9waWNzLCBmaWVsZE5hbWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBub3JtYWxpc2VkIHRvcGljIGRpc3RyaWJ1dGlvbiBmcm9tIHRoZSBzdWIgdG9waWNzIGdpdmVuIGEgZGlzdHJpYnV0aW9uIGZpZWxkTmFtZSBcbiAgICAgKiBOb3JtYWxpc2VkIGFjcm9zcyBhbGwgdG9waWNzXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBkaXN0cmlidXRpb24gbm8gbG9hZGVkIG9yIGlmIGRpc3RyaWJ1dGlvbiBkb2Vzbid0IGhhdmUgc3ViIHRvcGljc1xuICAgICAqL1xuICAgIERhdGEuZ2V0U3ViVG9waWNzRGlzdHJpYk5vcm1QZXJGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZSl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnZGlzdHJpYnV0aW9uJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBkaXN0cmlidXRpb24gd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaGFzKERhdGEuZGF0YS5kaXN0cmlidXRpb24sICdzdWJUb3BpY3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBmb3Igc3ViIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRUb3BpY3NEaXN0cmlidXRpb25Ob3JtYWxpc2VkUGVyRmllbGQoRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbi5zdWJUb3BpY3MsIGZpZWxkTmFtZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3IgYSBzcGVjaWZpYyBtYWluIHRvcGljICBcbiAgICAgKi9cbiAgICBEYXRhLmdldE1haW5Ub3BpY0Rpc3RyaWJFbnRyeSA9IGZ1bmN0aW9uKHRvcGljSWQpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ2Rpc3RyaWJ1dGlvbicpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogZGlzdHJpYnV0aW9uIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLCAnbWFpblRvcGljcycpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gZGlzdHJpYnV0aW9uIGZvciBtYWluIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ID0gRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbi5tYWluVG9waWNzLmZpbHRlcihkPT57XG4gICAgICAgICAgICByZXR1cm4gZC50b3BpY0lkID09PSB0b3BpY0lkO1xuICAgICAgICB9KS5tYXAoZD0+ZC5kaXN0cmlidXRpb24ubWFwKGQyPT57cmV0dXJuIHtrZXk6ZDIuaWQsdmFsdWU6ZDIud2VpZ2h0fTt9KSk7XG4gICAgICAgIGlmKHQubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gZGlzdHJpYnV0aW9uIGVudHJ5IGZvciBtYWluIHRvcGljICcrdG9waWNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRbMF07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3IgYSBzcGVjaWZpYyBzdWIgdG9waWMgIFxuICAgICAqL1xuICAgIERhdGEuZ2V0U3ViVG9waWNEaXN0cmliRW50cnkgPSBmdW5jdGlvbih0b3BpY0lkKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdkaXN0cmlidXRpb24nKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IGRpc3RyaWJ1dGlvbiB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbiwgJ3N1YlRvcGljcycpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gZGlzdHJpYnV0aW9uIGZvciBzdWIgdG9waWNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHQgPSBEYXRhLmRhdGEuZGlzdHJpYnV0aW9uLnN1YlRvcGljcy5maWx0ZXIoZD0+e1xuICAgICAgICAgICAgcmV0dXJuIGQudG9waWNJZCA9PT0gdG9waWNJZDtcbiAgICAgICAgfSkubWFwKGQ9PmQuZGlzdHJpYnV0aW9uLm1hcChkMj0+e3JldHVybiB7a2V5OmQyLmlkLHZhbHVlOmQyLndlaWdodH07fSkpO1xuICAgICAgICBpZih0Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3Igc3ViIHRvcGljICcrdG9waWNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRbMF07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3IgYSBzcGVjaWZpYyBtYWluIHRvcGljICBcbiAgICAgKi9cbiAgICBEYXRhLmdldE1haW5Ub3BpY0Rpc3RyaWJFbnRyeU5vcm0gPSBmdW5jdGlvbih0b3BpY0lkKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdkaXN0cmlidXRpb24nKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IGRpc3RyaWJ1dGlvbiB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbiwgJ21haW5Ub3BpY3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBmb3IgbWFpbiB0b3BpY3MnKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdCA9IERhdGEuZGF0YS5kaXN0cmlidXRpb24ubWFpblRvcGljcy5maWx0ZXIoZD0+e1xuICAgICAgICAgICAgcmV0dXJuIGQudG9waWNJZCA9PT0gdG9waWNJZDtcbiAgICAgICAgfSkubWFwKGQ9PmQuZGlzdHJpYnV0aW9uLm1hcChkMj0+e3JldHVybiB7a2V5OmQyLmlkLHZhbHVlOmQyLndlaWdodC9kLnRvdGFsfTt9KSk7XG4gICAgICAgIGlmKHQubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gZGlzdHJpYnV0aW9uIGVudHJ5IGZvciBtYWluIHRvcGljICcrdG9waWNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRbMF07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3IgYSBzcGVjaWZpYyBzdWIgdG9waWMgIFxuICAgICAqL1xuICAgIERhdGEuZ2V0U3ViVG9waWNEaXN0cmliRW50cnlOb3JtID0gZnVuY3Rpb24odG9waWNJZCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnZGlzdHJpYnV0aW9uJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBkaXN0cmlidXRpb24gd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaGFzKERhdGEuZGF0YS5kaXN0cmlidXRpb24sICdzdWJUb3BpY3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBmb3Igc3ViIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ID0gRGF0YS5kYXRhLmRpc3RyaWJ1dGlvbi5zdWJUb3BpY3MuZmlsdGVyKGQ9PntcbiAgICAgICAgICAgIHJldHVybiBkLnRvcGljSWQgPT09IHRvcGljSWQ7XG4gICAgICAgIH0pLm1hcChkPT5kLmRpc3RyaWJ1dGlvbi5tYXAoZDI9PntyZXR1cm4ge2tleTpkMi5pZCx2YWx1ZTpkMi53ZWlnaHQvZC50b3RhbH07fSkpO1xuICAgICAgICBpZih0Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIGRpc3RyaWJ1dGlvbiBlbnRyeSBmb3Igc3ViIHRvcGljICcrdG9waWNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRbMF07XG4gICAgfTtcblxuXG5cblxufSIsInZhciB0MCA9IG5ldyBEYXRlLFxuICAgIHQxID0gbmV3IERhdGU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQsIGZpZWxkKSB7XG5cbiAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyBuZXcgRGF0ZSA6IG5ldyBEYXRlKCtkYXRlKSksIGRhdGU7XG4gIH1cblxuICBpbnRlcnZhbC5mbG9vciA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICB9O1xuXG4gIGludGVydmFsLmNlaWwgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZmxvb3JpKGRhdGUpLCBkYXRlO1xuICB9O1xuXG4gIGludGVydmFsLnJvdW5kID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkMCA9IGludGVydmFsKGRhdGUpLFxuICAgICAgICBkMSA9IGludGVydmFsLmNlaWwoZGF0ZSk7XG4gICAgcmV0dXJuIGRhdGUgLSBkMCA8IGQxIC0gZGF0ZSA/IGQwIDogZDE7XG4gIH07XG5cbiAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIHJldHVybiBvZmZzZXRpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSksIHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApKSwgZGF0ZTtcbiAgfTtcblxuICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgdmFyIHJhbmdlID0gW10sIHByZXZpb3VzO1xuICAgIHN0YXJ0ID0gaW50ZXJ2YWwuY2VpbChzdGFydCk7XG4gICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgIGRvIHJhbmdlLnB1c2gocHJldmlvdXMgPSBuZXcgRGF0ZSgrc3RhcnQpKSwgb2Zmc2V0aShzdGFydCwgc3RlcCksIGZsb29yaShzdGFydCk7XG4gICAgd2hpbGUgKHByZXZpb3VzIDwgc3RhcnQgJiYgc3RhcnQgPCBzdG9wKTtcbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgaW50ZXJ2YWwuZmlsdGVyID0gZnVuY3Rpb24odGVzdCkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBpZiAoZGF0ZSA+PSBkYXRlKSB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBpZiAoZGF0ZSA+PSBkYXRlKSB7XG4gICAgICAgIGlmIChzdGVwIDwgMCkgd2hpbGUgKCsrc3RlcCA8PSAwKSB7XG4gICAgICAgICAgd2hpbGUgKG9mZnNldGkoZGF0ZSwgLTEpLCAhdGVzdChkYXRlKSkge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxuICAgICAgICB9IGVsc2Ugd2hpbGUgKC0tc3RlcCA+PSAwKSB7XG4gICAgICAgICAgd2hpbGUgKG9mZnNldGkoZGF0ZSwgKzEpLCAhdGVzdChkYXRlKSkge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIGludGVydmFsLmV2ZXJ5ID0gZnVuY3Rpb24oc3RlcCkge1xuICAgICAgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICByZXR1cm4gIWlzRmluaXRlKHN0ZXApIHx8ICEoc3RlcCA+IDApID8gbnVsbFxuICAgICAgICAgIDogIShzdGVwID4gMSkgPyBpbnRlcnZhbFxuICAgICAgICAgIDogaW50ZXJ2YWwuZmlsdGVyKGZpZWxkXG4gICAgICAgICAgICAgID8gZnVuY3Rpb24oZCkgeyByZXR1cm4gZmllbGQoZCkgJSBzdGVwID09PSAwOyB9XG4gICAgICAgICAgICAgIDogZnVuY3Rpb24oZCkgeyByZXR1cm4gaW50ZXJ2YWwuY291bnQoMCwgZCkgJSBzdGVwID09PSAwOyB9KTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGludGVydmFsO1xufVxuIiwiZXhwb3J0IHZhciBkdXJhdGlvblNlY29uZCA9IDFlMztcbmV4cG9ydCB2YXIgZHVyYXRpb25NaW51dGUgPSA2ZTQ7XG5leHBvcnQgdmFyIGR1cmF0aW9uSG91ciA9IDM2ZTU7XG5leHBvcnQgdmFyIGR1cmF0aW9uRGF5ID0gODY0ZTU7XG5leHBvcnQgdmFyIGR1cmF0aW9uV2VlayA9IDYwNDhlNTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbC5qc1wiO1xuaW1wb3J0IHtkdXJhdGlvbkRheSwgZHVyYXRpb25NaW51dGV9IGZyb20gXCIuL2R1cmF0aW9uLmpzXCI7XG5cbnZhciBkYXkgPSBpbnRlcnZhbChcbiAgZGF0ZSA9PiBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApLFxuICAoZGF0ZSwgc3RlcCkgPT4gZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCksXG4gIChzdGFydCwgZW5kKSA9PiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIGR1cmF0aW9uTWludXRlKSAvIGR1cmF0aW9uRGF5LFxuICBkYXRlID0+IGRhdGUuZ2V0RGF0ZSgpIC0gMVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZGF5O1xuZXhwb3J0IHZhciBkYXlzID0gZGF5LnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsLmpzXCI7XG5pbXBvcnQge2R1cmF0aW9uTWludXRlLCBkdXJhdGlvbldlZWt9IGZyb20gXCIuL2R1cmF0aW9uLmpzXCI7XG5cbmZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICByZXR1cm4gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIGR1cmF0aW9uTWludXRlKSAvIGR1cmF0aW9uV2VlaztcbiAgfSk7XG59XG5cbmV4cG9ydCB2YXIgc3VuZGF5ID0gd2Vla2RheSgwKTtcbmV4cG9ydCB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcbmV4cG9ydCB2YXIgdHVlc2RheSA9IHdlZWtkYXkoMik7XG5leHBvcnQgdmFyIHdlZG5lc2RheSA9IHdlZWtkYXkoMyk7XG5leHBvcnQgdmFyIHRodXJzZGF5ID0gd2Vla2RheSg0KTtcbmV4cG9ydCB2YXIgZnJpZGF5ID0gd2Vla2RheSg1KTtcbmV4cG9ydCB2YXIgc2F0dXJkYXkgPSB3ZWVrZGF5KDYpO1xuXG5leHBvcnQgdmFyIHN1bmRheXMgPSBzdW5kYXkucmFuZ2U7XG5leHBvcnQgdmFyIG1vbmRheXMgPSBtb25kYXkucmFuZ2U7XG5leHBvcnQgdmFyIHR1ZXNkYXlzID0gdHVlc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgd2VkbmVzZGF5cyA9IHdlZG5lc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgdGh1cnNkYXlzID0gdGh1cnNkYXkucmFuZ2U7XG5leHBvcnQgdmFyIGZyaWRheXMgPSBmcmlkYXkucmFuZ2U7XG5leHBvcnQgdmFyIHNhdHVyZGF5cyA9IHNhdHVyZGF5LnJhbmdlO1xuIiwiaW1wb3J0IGludGVydmFsIGZyb20gXCIuL2ludGVydmFsLmpzXCI7XG5cbnZhciB5ZWFyID0gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xufSk7XG5cbi8vIEFuIG9wdGltaXplZCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhpcyBzaW1wbGUgY2FzZS5cbnllYXIuZXZlcnkgPSBmdW5jdGlvbihrKSB7XG4gIHJldHVybiAhaXNGaW5pdGUoayA9IE1hdGguZmxvb3IoaykpIHx8ICEoayA+IDApID8gbnVsbCA6IGludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKE1hdGguZmxvb3IoZGF0ZS5nZXRGdWxsWWVhcigpIC8gaykgKiBrKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXAgKiBrKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB5ZWFyO1xuZXhwb3J0IHZhciB5ZWFycyA9IHllYXIucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWwuanNcIjtcbmltcG9ydCB7ZHVyYXRpb25EYXl9IGZyb20gXCIuL2R1cmF0aW9uLmpzXCI7XG5cbnZhciB1dGNEYXkgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uRGF5O1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRVVENEYXRlKCkgLSAxO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y0RheTtcbmV4cG9ydCB2YXIgdXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcbiIsImltcG9ydCBpbnRlcnZhbCBmcm9tIFwiLi9pbnRlcnZhbC5qc1wiO1xuaW1wb3J0IHtkdXJhdGlvbldlZWt9IGZyb20gXCIuL2R1cmF0aW9uLmpzXCI7XG5cbmZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICByZXR1cm4gaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25XZWVrO1xuICB9KTtcbn1cblxuZXhwb3J0IHZhciB1dGNTdW5kYXkgPSB1dGNXZWVrZGF5KDApO1xuZXhwb3J0IHZhciB1dGNNb25kYXkgPSB1dGNXZWVrZGF5KDEpO1xuZXhwb3J0IHZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbmV4cG9ydCB2YXIgdXRjV2VkbmVzZGF5ID0gdXRjV2Vla2RheSgzKTtcbmV4cG9ydCB2YXIgdXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuZXhwb3J0IHZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuZXhwb3J0IHZhciB1dGNTYXR1cmRheSA9IHV0Y1dlZWtkYXkoNik7XG5cbmV4cG9ydCB2YXIgdXRjU3VuZGF5cyA9IHV0Y1N1bmRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjTW9uZGF5cyA9IHV0Y01vbmRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5LnJhbmdlO1xuZXhwb3J0IHZhciB1dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjRnJpZGF5cyA9IHV0Y0ZyaWRheS5yYW5nZTtcbmV4cG9ydCB2YXIgdXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXkucmFuZ2U7XG4iLCJpbXBvcnQgaW50ZXJ2YWwgZnJvbSBcIi4vaW50ZXJ2YWwuanNcIjtcblxudmFyIHV0Y1llYXIgPSBpbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG59KTtcblxuLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxudXRjWWVhci5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgcmV0dXJuICFpc0Zpbml0ZShrID0gTWF0aC5mbG9vcihrKSkgfHwgIShrID4gMCkgPyBudWxsIDogaW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoTWF0aC5mbG9vcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgLyBrKSAqIGspO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCAqIGspO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHV0Y1llYXI7XG5leHBvcnQgdmFyIHV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcbiIsImltcG9ydCB7XG4gIHRpbWVEYXksXG4gIHRpbWVTdW5kYXksXG4gIHRpbWVNb25kYXksXG4gIHRpbWVUaHVyc2RheSxcbiAgdGltZVllYXIsXG4gIHV0Y0RheSxcbiAgdXRjU3VuZGF5LFxuICB1dGNNb25kYXksXG4gIHV0Y1RodXJzZGF5LFxuICB1dGNZZWFyXG59IGZyb20gXCJkMy10aW1lXCI7XG5cbmZ1bmN0aW9uIGxvY2FsRGF0ZShkKSB7XG4gIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGQueSk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKGQueSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCk7XG59XG5cbmZ1bmN0aW9uIHV0Y0RhdGUoZCkge1xuICBpZiAoMCA8PSBkLnkgJiYgZC55IDwgMTAwKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygtMSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCkpO1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZC55KTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG59XG5cbmZ1bmN0aW9uIG5ld0RhdGUoeSwgbSwgZCkge1xuICByZXR1cm4ge3k6IHksIG06IG0sIGQ6IGQsIEg6IDAsIE06IDAsIFM6IDAsIEw6IDB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXRMb2NhbGUobG9jYWxlKSB7XG4gIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsXG4gICAgICBsb2NhbGVfZGF0ZSA9IGxvY2FsZS5kYXRlLFxuICAgICAgbG9jYWxlX3RpbWUgPSBsb2NhbGUudGltZSxcbiAgICAgIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsXG4gICAgICBsb2NhbGVfd2Vla2RheXMgPSBsb2NhbGUuZGF5cyxcbiAgICAgIGxvY2FsZV9zaG9ydFdlZWtkYXlzID0gbG9jYWxlLnNob3J0RGF5cyxcbiAgICAgIGxvY2FsZV9tb250aHMgPSBsb2NhbGUubW9udGhzLFxuICAgICAgbG9jYWxlX3Nob3J0TW9udGhzID0gbG9jYWxlLnNob3J0TW9udGhzO1xuXG4gIHZhciBwZXJpb2RSZSA9IGZvcm1hdFJlKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgIHBlcmlvZExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfcGVyaW9kcyksXG4gICAgICB3ZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgd2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgc2hvcnRXZWVrZGF5UmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICBzaG9ydFdlZWtkYXlMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX3Nob3J0V2Vla2RheXMpLFxuICAgICAgbW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9tb250aHMpLFxuICAgICAgbW9udGhMb29rdXAgPSBmb3JtYXRMb29rdXAobG9jYWxlX21vbnRocyksXG4gICAgICBzaG9ydE1vbnRoUmUgPSBmb3JtYXRSZShsb2NhbGVfc2hvcnRNb250aHMpLFxuICAgICAgc2hvcnRNb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRNb250aHMpO1xuXG4gIHZhciBmb3JtYXRzID0ge1xuICAgIFwiYVwiOiBmb3JtYXRTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IGZvcm1hdFdlZWtkYXksXG4gICAgXCJiXCI6IGZvcm1hdFNob3J0TW9udGgsXG4gICAgXCJCXCI6IGZvcm1hdE1vbnRoLFxuICAgIFwiY1wiOiBudWxsLFxuICAgIFwiZFwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgIFwiZVwiOiBmb3JtYXREYXlPZk1vbnRoLFxuICAgIFwiZlwiOiBmb3JtYXRNaWNyb3NlY29uZHMsXG4gICAgXCJnXCI6IGZvcm1hdFllYXJJU08sXG4gICAgXCJHXCI6IGZvcm1hdEZ1bGxZZWFySVNPLFxuICAgIFwiSFwiOiBmb3JtYXRIb3VyMjQsXG4gICAgXCJJXCI6IGZvcm1hdEhvdXIxMixcbiAgICBcImpcIjogZm9ybWF0RGF5T2ZZZWFyLFxuICAgIFwiTFwiOiBmb3JtYXRNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IGZvcm1hdE1vbnRoTnVtYmVyLFxuICAgIFwiTVwiOiBmb3JtYXRNaW51dGVzLFxuICAgIFwicFwiOiBmb3JtYXRQZXJpb2QsXG4gICAgXCJxXCI6IGZvcm1hdFF1YXJ0ZXIsXG4gICAgXCJRXCI6IGZvcm1hdFVuaXhUaW1lc3RhbXAsXG4gICAgXCJzXCI6IGZvcm1hdFVuaXhUaW1lc3RhbXBTZWNvbmRzLFxuICAgIFwiU1wiOiBmb3JtYXRTZWNvbmRzLFxuICAgIFwidVwiOiBmb3JtYXRXZWVrZGF5TnVtYmVyTW9uZGF5LFxuICAgIFwiVVwiOiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5LFxuICAgIFwiVlwiOiBmb3JtYXRXZWVrTnVtYmVySVNPLFxuICAgIFwid1wiOiBmb3JtYXRXZWVrZGF5TnVtYmVyU3VuZGF5LFxuICAgIFwiV1wiOiBmb3JtYXRXZWVrTnVtYmVyTW9uZGF5LFxuICAgIFwieFwiOiBudWxsLFxuICAgIFwiWFwiOiBudWxsLFxuICAgIFwieVwiOiBmb3JtYXRZZWFyLFxuICAgIFwiWVwiOiBmb3JtYXRGdWxsWWVhcixcbiAgICBcIlpcIjogZm9ybWF0Wm9uZSxcbiAgICBcIiVcIjogZm9ybWF0TGl0ZXJhbFBlcmNlbnRcbiAgfTtcblxuICB2YXIgdXRjRm9ybWF0cyA9IHtcbiAgICBcImFcIjogZm9ybWF0VVRDU2hvcnRXZWVrZGF5LFxuICAgIFwiQVwiOiBmb3JtYXRVVENXZWVrZGF5LFxuICAgIFwiYlwiOiBmb3JtYXRVVENTaG9ydE1vbnRoLFxuICAgIFwiQlwiOiBmb3JtYXRVVENNb250aCxcbiAgICBcImNcIjogbnVsbCxcbiAgICBcImRcIjogZm9ybWF0VVRDRGF5T2ZNb250aCxcbiAgICBcImVcIjogZm9ybWF0VVRDRGF5T2ZNb250aCxcbiAgICBcImZcIjogZm9ybWF0VVRDTWljcm9zZWNvbmRzLFxuICAgIFwiZ1wiOiBmb3JtYXRVVENZZWFySVNPLFxuICAgIFwiR1wiOiBmb3JtYXRVVENGdWxsWWVhcklTTyxcbiAgICBcIkhcIjogZm9ybWF0VVRDSG91cjI0LFxuICAgIFwiSVwiOiBmb3JtYXRVVENIb3VyMTIsXG4gICAgXCJqXCI6IGZvcm1hdFVUQ0RheU9mWWVhcixcbiAgICBcIkxcIjogZm9ybWF0VVRDTWlsbGlzZWNvbmRzLFxuICAgIFwibVwiOiBmb3JtYXRVVENNb250aE51bWJlcixcbiAgICBcIk1cIjogZm9ybWF0VVRDTWludXRlcyxcbiAgICBcInBcIjogZm9ybWF0VVRDUGVyaW9kLFxuICAgIFwicVwiOiBmb3JtYXRVVENRdWFydGVyLFxuICAgIFwiUVwiOiBmb3JtYXRVbml4VGltZXN0YW1wLFxuICAgIFwic1wiOiBmb3JtYXRVbml4VGltZXN0YW1wU2Vjb25kcyxcbiAgICBcIlNcIjogZm9ybWF0VVRDU2Vjb25kcyxcbiAgICBcInVcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlck1vbmRheSxcbiAgICBcIlVcIjogZm9ybWF0VVRDV2Vla051bWJlclN1bmRheSxcbiAgICBcIlZcIjogZm9ybWF0VVRDV2Vla051bWJlcklTTyxcbiAgICBcIndcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlclN1bmRheSxcbiAgICBcIldcIjogZm9ybWF0VVRDV2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogbnVsbCxcbiAgICBcIlhcIjogbnVsbCxcbiAgICBcInlcIjogZm9ybWF0VVRDWWVhcixcbiAgICBcIllcIjogZm9ybWF0VVRDRnVsbFllYXIsXG4gICAgXCJaXCI6IGZvcm1hdFVUQ1pvbmUsXG4gICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgdmFyIHBhcnNlcyA9IHtcbiAgICBcImFcIjogcGFyc2VTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IHBhcnNlV2Vla2RheSxcbiAgICBcImJcIjogcGFyc2VTaG9ydE1vbnRoLFxuICAgIFwiQlwiOiBwYXJzZU1vbnRoLFxuICAgIFwiY1wiOiBwYXJzZUxvY2FsZURhdGVUaW1lLFxuICAgIFwiZFwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgXCJlXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICBcImZcIjogcGFyc2VNaWNyb3NlY29uZHMsXG4gICAgXCJnXCI6IHBhcnNlWWVhcixcbiAgICBcIkdcIjogcGFyc2VGdWxsWWVhcixcbiAgICBcIkhcIjogcGFyc2VIb3VyMjQsXG4gICAgXCJJXCI6IHBhcnNlSG91cjI0LFxuICAgIFwialwiOiBwYXJzZURheU9mWWVhcixcbiAgICBcIkxcIjogcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IHBhcnNlTW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IHBhcnNlTWludXRlcyxcbiAgICBcInBcIjogcGFyc2VQZXJpb2QsXG4gICAgXCJxXCI6IHBhcnNlUXVhcnRlcixcbiAgICBcIlFcIjogcGFyc2VVbml4VGltZXN0YW1wLFxuICAgIFwic1wiOiBwYXJzZVVuaXhUaW1lc3RhbXBTZWNvbmRzLFxuICAgIFwiU1wiOiBwYXJzZVNlY29uZHMsXG4gICAgXCJ1XCI6IHBhcnNlV2Vla2RheU51bWJlck1vbmRheSxcbiAgICBcIlVcIjogcGFyc2VXZWVrTnVtYmVyU3VuZGF5LFxuICAgIFwiVlwiOiBwYXJzZVdlZWtOdW1iZXJJU08sXG4gICAgXCJ3XCI6IHBhcnNlV2Vla2RheU51bWJlclN1bmRheSxcbiAgICBcIldcIjogcGFyc2VXZWVrTnVtYmVyTW9uZGF5LFxuICAgIFwieFwiOiBwYXJzZUxvY2FsZURhdGUsXG4gICAgXCJYXCI6IHBhcnNlTG9jYWxlVGltZSxcbiAgICBcInlcIjogcGFyc2VZZWFyLFxuICAgIFwiWVwiOiBwYXJzZUZ1bGxZZWFyLFxuICAgIFwiWlwiOiBwYXJzZVpvbmUsXG4gICAgXCIlXCI6IHBhcnNlTGl0ZXJhbFBlcmNlbnRcbiAgfTtcblxuICAvLyBUaGVzZSByZWN1cnNpdmUgZGlyZWN0aXZlIGRlZmluaXRpb25zIG11c3QgYmUgZGVmZXJyZWQuXG4gIGZvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgZm9ybWF0cyk7XG4gIGZvcm1hdHMuWCA9IG5ld0Zvcm1hdChsb2NhbGVfdGltZSwgZm9ybWF0cyk7XG4gIGZvcm1hdHMuYyA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZVRpbWUsIGZvcm1hdHMpO1xuICB1dGNGb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIHV0Y0Zvcm1hdHMpO1xuICB1dGNGb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIHV0Y0Zvcm1hdHMpO1xuICB1dGNGb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCB1dGNGb3JtYXRzKTtcblxuICBmdW5jdGlvbiBuZXdGb3JtYXQoc3BlY2lmaWVyLCBmb3JtYXRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBzdHJpbmcgPSBbXSxcbiAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgICAgYyxcbiAgICAgICAgICBwYWQsXG4gICAgICAgICAgZm9ybWF0O1xuXG4gICAgICBpZiAoIShkYXRlIGluc3RhbmNlb2YgRGF0ZSkpIGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSk7XG5cbiAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGlmIChzcGVjaWZpZXIuY2hhckNvZGVBdChpKSA9PT0gMzcpIHtcbiAgICAgICAgICBzdHJpbmcucHVzaChzcGVjaWZpZXIuc2xpY2UoaiwgaSkpO1xuICAgICAgICAgIGlmICgocGFkID0gcGFkc1tjID0gc3BlY2lmaWVyLmNoYXJBdCgrK2kpXSkgIT0gbnVsbCkgYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKTtcbiAgICAgICAgICBlbHNlIHBhZCA9IGMgPT09IFwiZVwiID8gXCIgXCIgOiBcIjBcIjtcbiAgICAgICAgICBpZiAoZm9ybWF0ID0gZm9ybWF0c1tjXSkgYyA9IGZvcm1hdChkYXRlLCBwYWQpO1xuICAgICAgICAgIHN0cmluZy5wdXNoKGMpO1xuICAgICAgICAgIGogPSBpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdHJpbmcucHVzaChzcGVjaWZpZXIuc2xpY2UoaiwgaSkpO1xuICAgICAgcmV0dXJuIHN0cmluZy5qb2luKFwiXCIpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBuZXdQYXJzZShzcGVjaWZpZXIsIFopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICB2YXIgZCA9IG5ld0RhdGUoMTkwMCwgdW5kZWZpbmVkLCAxKSxcbiAgICAgICAgICBpID0gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcgKz0gXCJcIiwgMCksXG4gICAgICAgICAgd2VlaywgZGF5O1xuICAgICAgaWYgKGkgIT0gc3RyaW5nLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIC8vIElmIGEgVU5JWCB0aW1lc3RhbXAgaXMgc3BlY2lmaWVkLCByZXR1cm4gaXQuXG4gICAgICBpZiAoXCJRXCIgaW4gZCkgcmV0dXJuIG5ldyBEYXRlKGQuUSk7XG4gICAgICBpZiAoXCJzXCIgaW4gZCkgcmV0dXJuIG5ldyBEYXRlKGQucyAqIDEwMDAgKyAoXCJMXCIgaW4gZCA/IGQuTCA6IDApKTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyB1dGNQYXJzZSwgbmV2ZXIgdXNlIHRoZSBsb2NhbCB0aW1lem9uZS5cbiAgICAgIGlmIChaICYmICEoXCJaXCIgaW4gZCkpIGQuWiA9IDA7XG5cbiAgICAgIC8vIFRoZSBhbS1wbSBmbGFnIGlzIDAgZm9yIEFNLCBhbmQgMSBmb3IgUE0uXG4gICAgICBpZiAoXCJwXCIgaW4gZCkgZC5IID0gZC5IICUgMTIgKyBkLnAgKiAxMjtcblxuICAgICAgLy8gSWYgdGhlIG1vbnRoIHdhcyBub3Qgc3BlY2lmaWVkLCBpbmhlcml0IGZyb20gdGhlIHF1YXJ0ZXIuXG4gICAgICBpZiAoZC5tID09PSB1bmRlZmluZWQpIGQubSA9IFwicVwiIGluIGQgPyBkLnEgOiAwO1xuXG4gICAgICAvLyBDb252ZXJ0IGRheS1vZi13ZWVrIGFuZCB3ZWVrLW9mLXllYXIgdG8gZGF5LW9mLXllYXIuXG4gICAgICBpZiAoXCJWXCIgaW4gZCkge1xuICAgICAgICBpZiAoZC5WIDwgMSB8fCBkLlYgPiA1MykgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICghKFwid1wiIGluIGQpKSBkLncgPSAxO1xuICAgICAgICBpZiAoXCJaXCIgaW4gZCkge1xuICAgICAgICAgIHdlZWsgPSB1dGNEYXRlKG5ld0RhdGUoZC55LCAwLCAxKSksIGRheSA9IHdlZWsuZ2V0VVRDRGF5KCk7XG4gICAgICAgICAgd2VlayA9IGRheSA+IDQgfHwgZGF5ID09PSAwID8gdXRjTW9uZGF5LmNlaWwod2VlaykgOiB1dGNNb25kYXkod2Vlayk7XG4gICAgICAgICAgd2VlayA9IHV0Y0RheS5vZmZzZXQod2VlaywgKGQuViAtIDEpICogNyk7XG4gICAgICAgICAgZC55ID0gd2Vlay5nZXRVVENGdWxsWWVhcigpO1xuICAgICAgICAgIGQubSA9IHdlZWsuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICBkLmQgPSB3ZWVrLmdldFVUQ0RhdGUoKSArIChkLncgKyA2KSAlIDc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2VlayA9IGxvY2FsRGF0ZShuZXdEYXRlKGQueSwgMCwgMSkpLCBkYXkgPSB3ZWVrLmdldERheSgpO1xuICAgICAgICAgIHdlZWsgPSBkYXkgPiA0IHx8IGRheSA9PT0gMCA/IHRpbWVNb25kYXkuY2VpbCh3ZWVrKSA6IHRpbWVNb25kYXkod2Vlayk7XG4gICAgICAgICAgd2VlayA9IHRpbWVEYXkub2Zmc2V0KHdlZWssIChkLlYgLSAxKSAqIDcpO1xuICAgICAgICAgIGQueSA9IHdlZWsuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBkLm0gPSB3ZWVrLmdldE1vbnRoKCk7XG4gICAgICAgICAgZC5kID0gd2Vlay5nZXREYXRlKCkgKyAoZC53ICsgNikgJSA3O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFwiV1wiIGluIGQgfHwgXCJVXCIgaW4gZCkge1xuICAgICAgICBpZiAoIShcIndcIiBpbiBkKSkgZC53ID0gXCJ1XCIgaW4gZCA/IGQudSAlIDcgOiBcIldcIiBpbiBkID8gMSA6IDA7XG4gICAgICAgIGRheSA9IFwiWlwiIGluIGQgPyB1dGNEYXRlKG5ld0RhdGUoZC55LCAwLCAxKSkuZ2V0VVRDRGF5KCkgOiBsb2NhbERhdGUobmV3RGF0ZShkLnksIDAsIDEpKS5nZXREYXkoKTtcbiAgICAgICAgZC5tID0gMDtcbiAgICAgICAgZC5kID0gXCJXXCIgaW4gZCA/IChkLncgKyA2KSAlIDcgKyBkLlcgKiA3IC0gKGRheSArIDUpICUgNyA6IGQudyArIGQuVSAqIDcgLSAoZGF5ICsgNikgJSA3O1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBhIHRpbWUgem9uZSBpcyBzcGVjaWZpZWQsIGFsbCBmaWVsZHMgYXJlIGludGVycHJldGVkIGFzIFVUQyBhbmQgdGhlblxuICAgICAgLy8gb2Zmc2V0IGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIHRpbWUgem9uZS5cbiAgICAgIGlmIChcIlpcIiBpbiBkKSB7XG4gICAgICAgIGQuSCArPSBkLlogLyAxMDAgfCAwO1xuICAgICAgICBkLk0gKz0gZC5aICUgMTAwO1xuICAgICAgICByZXR1cm4gdXRjRGF0ZShkKTtcbiAgICAgIH1cblxuICAgICAgLy8gT3RoZXJ3aXNlLCBhbGwgZmllbGRzIGFyZSBpbiBsb2NhbCB0aW1lLlxuICAgICAgcmV0dXJuIGxvY2FsRGF0ZShkKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcsIGopIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICBtID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgYyxcbiAgICAgICAgcGFyc2U7XG5cbiAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgIGlmIChqID49IG0pIHJldHVybiAtMTtcbiAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckNvZGVBdChpKyspO1xuICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgIGMgPSBzcGVjaWZpZXIuY2hhckF0KGkrKyk7XG4gICAgICAgIHBhcnNlID0gcGFyc2VzW2MgaW4gcGFkcyA/IHNwZWNpZmllci5jaGFyQXQoaSsrKSA6IGNdO1xuICAgICAgICBpZiAoIXBhcnNlIHx8ICgoaiA9IHBhcnNlKGQsIHN0cmluZywgaikpIDwgMCkpIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYyAhPSBzdHJpbmcuY2hhckNvZGVBdChqKyspKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gajtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUGVyaW9kKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gcGVyaW9kUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQucCA9IHBlcmlvZExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTaG9ydFdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBzaG9ydFdlZWtkYXlSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC53ID0gc2hvcnRXZWVrZGF5TG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSB3ZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9IHdlZWtkYXlMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU2hvcnRNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IHNob3J0TW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5tID0gc2hvcnRNb250aExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG1vbnRoUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQubSA9IG1vbnRoTG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZVRpbWUsIHN0cmluZywgaSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlLCBzdHJpbmcsIGkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VMb2NhbGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfdGltZSwgc3RyaW5nLCBpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldERheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0TW9udGgoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldE1vbnRoKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGVyaW9kKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldEhvdXJzKCkgPj0gMTIpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFF1YXJ0ZXIoZCkge1xuICAgIHJldHVybiAxICsgfn4oZC5nZXRNb250aCgpIC8gMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydFdlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtkYXkoZCkge1xuICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTaG9ydE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNb250aChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1BlcmlvZChkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRVVENIb3VycygpID49IDEyKV07XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENRdWFydGVyKGQpIHtcbiAgICByZXR1cm4gMSArIH5+KGQuZ2V0VVRDTW9udGgoKSAvIDMpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIGYgPSBuZXdGb3JtYXQoc3BlY2lmaWVyICs9IFwiXCIsIGZvcm1hdHMpO1xuICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgcmV0dXJuIGY7XG4gICAgfSxcbiAgICBwYXJzZTogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICB2YXIgcCA9IG5ld1BhcnNlKHNwZWNpZmllciArPSBcIlwiLCBmYWxzZSk7XG4gICAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICByZXR1cm4gcDtcbiAgICB9LFxuICAgIHV0Y0Zvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgdXRjRm9ybWF0cyk7XG4gICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICByZXR1cm4gZjtcbiAgICB9LFxuICAgIHV0Y1BhcnNlOiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBwID0gbmV3UGFyc2Uoc3BlY2lmaWVyICs9IFwiXCIsIHRydWUpO1xuICAgICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9O1xufVxuXG52YXIgcGFkcyA9IHtcIi1cIjogXCJcIiwgXCJfXCI6IFwiIFwiLCBcIjBcIjogXCIwXCJ9LFxuICAgIG51bWJlclJlID0gL15cXHMqXFxkKy8sIC8vIG5vdGU6IGlnbm9yZXMgbmV4dCBkaXJlY3RpdmVcbiAgICBwZXJjZW50UmUgPSAvXiUvLFxuICAgIHJlcXVvdGVSZSA9IC9bXFxcXF4kKis/fFtcXF0oKS57fV0vZztcblxuZnVuY3Rpb24gcGFkKHZhbHVlLCBmaWxsLCB3aWR0aCkge1xuICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIixcbiAgICAgIHN0cmluZyA9IChzaWduID8gLXZhbHVlIDogdmFsdWUpICsgXCJcIixcbiAgICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJlcXVvdGUocykge1xuICByZXR1cm4gcy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFJlKG5hbWVzKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OlwiICsgbmFtZXMubWFwKHJlcXVvdGUpLmpvaW4oXCJ8XCIpICsgXCIpXCIsIFwiaVwiKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TG9va3VwKG5hbWVzKSB7XG4gIHJldHVybiBuZXcgTWFwKG5hbWVzLm1hcCgobmFtZSwgaSkgPT4gW25hbWUudG9Mb3dlckNhc2UoKSwgaV0pKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VXZWVrZGF5TnVtYmVyU3VuZGF5KGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gKGQudyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlck1vbmRheShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMSkpO1xuICByZXR1cm4gbiA/IChkLnUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJTdW5kYXkoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5VID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VXZWVrTnVtYmVySVNPKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuViA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla051bWJlck1vbmRheShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLlcgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA0KSk7XG4gIHJldHVybiBuID8gKGQueSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWm9uZShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSAvXihaKXwoWystXVxcZFxcZCkoPzo6PyhcXGRcXGQpKT8vLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA2KSk7XG4gIHJldHVybiBuID8gKGQuWiA9IG5bMV0gPyAwIDogLShuWzJdICsgKG5bM10gfHwgXCIwMFwiKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VRdWFydGVyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gKGQucSA9IG5bMF0gKiAzIC0gMywgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vbnRoTnVtYmVyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQubSA9IG5bMF0gLSAxLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZURheU9mWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUhvdXIyNChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLkggPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5NID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWlsbGlzZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gIHJldHVybiBuID8gKGQuTCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWljcm9zZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA2KSk7XG4gIHJldHVybiBuID8gKGQuTCA9IE1hdGguZmxvb3IoblswXSAvIDEwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gcGVyY2VudFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gaSArIG5bMF0ubGVuZ3RoIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5peFRpbWVzdGFtcChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gIHJldHVybiBuID8gKGQuUSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5peFRpbWVzdGFtcFNlY29uZHMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICByZXR1cm4gbiA/IChkLnMgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREYXlPZk1vbnRoKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldERhdGUoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhvdXIyNChkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRIb3VycygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0SG91cjEyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdERheU9mWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoMSArIHRpbWVEYXkuY291bnQodGltZVllYXIoZCksIGQpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldE1pbGxpc2Vjb25kcygpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWljcm9zZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIGZvcm1hdE1pbGxpc2Vjb25kcyhkLCBwKSArIFwiMDAwXCI7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoTnVtYmVyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWludXRlcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRTZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtkYXlOdW1iZXJNb25kYXkoZCkge1xuICB2YXIgZGF5ID0gZC5nZXREYXkoKTtcbiAgcmV0dXJuIGRheSA9PT0gMCA/IDcgOiBkYXk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKHRpbWVTdW5kYXkuY291bnQodGltZVllYXIoZCkgLSAxLCBkKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGRJU08oZCkge1xuICB2YXIgZGF5ID0gZC5nZXREYXkoKTtcbiAgcmV0dXJuIChkYXkgPj0gNCB8fCBkYXkgPT09IDApID8gdGltZVRodXJzZGF5KGQpIDogdGltZVRodXJzZGF5LmNlaWwoZCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJJU08oZCwgcCkge1xuICBkID0gZElTTyhkKTtcbiAgcmV0dXJuIHBhZCh0aW1lVGh1cnNkYXkuY291bnQodGltZVllYXIoZCksIGQpICsgKHRpbWVZZWFyKGQpLmdldERheSgpID09PSA0KSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtkYXlOdW1iZXJTdW5kYXkoZCkge1xuICByZXR1cm4gZC5nZXREYXkoKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQodGltZU1vbmRheS5jb3VudCh0aW1lWWVhcihkKSAtIDEsIGQpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0WWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0WWVhcklTTyhkLCBwKSB7XG4gIGQgPSBkSVNPKGQpO1xuICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMCwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDAwMCwgcCwgNCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZ1bGxZZWFySVNPKGQsIHApIHtcbiAgdmFyIGRheSA9IGQuZ2V0RGF5KCk7XG4gIGQgPSAoZGF5ID49IDQgfHwgZGF5ID09PSAwKSA/IHRpbWVUaHVyc2RheShkKSA6IHRpbWVUaHVyc2RheS5jZWlsKGQpO1xuICByZXR1cm4gcGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Wm9uZShkKSB7XG4gIHZhciB6ID0gZC5nZXRUaW1lem9uZU9mZnNldCgpO1xuICByZXR1cm4gKHogPiAwID8gXCItXCIgOiAoeiAqPSAtMSwgXCIrXCIpKVxuICAgICAgKyBwYWQoeiAvIDYwIHwgMCwgXCIwXCIsIDIpXG4gICAgICArIHBhZCh6ICUgNjAsIFwiMFwiLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRGF5T2ZNb250aChkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENEYXRlKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENIb3VyMjQoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDSG91cnMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0hvdXIxMihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENEYXlPZlllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKDEgKyB1dGNEYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDMpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENNaWxsaXNlY29uZHMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCksIHAsIDMpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENNaWNyb3NlY29uZHMoZCwgcCkge1xuICByZXR1cm4gZm9ybWF0VVRDTWlsbGlzZWNvbmRzKGQsIHApICsgXCIwMDBcIjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENNaW51dGVzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01pbnV0ZXMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDU2Vjb25kcygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlck1vbmRheShkKSB7XG4gIHZhciBkb3cgPSBkLmdldFVUQ0RheSgpO1xuICByZXR1cm4gZG93ID09PSAwID8gNyA6IGRvdztcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQodXRjU3VuZGF5LmNvdW50KHV0Y1llYXIoZCkgLSAxLCBkKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIFVUQ2RJU08oZCkge1xuICB2YXIgZGF5ID0gZC5nZXRVVENEYXkoKTtcbiAgcmV0dXJuIChkYXkgPj0gNCB8fCBkYXkgPT09IDApID8gdXRjVGh1cnNkYXkoZCkgOiB1dGNUaHVyc2RheS5jZWlsKGQpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVySVNPKGQsIHApIHtcbiAgZCA9IFVUQ2RJU08oZCk7XG4gIHJldHVybiBwYWQodXRjVGh1cnNkYXkuY291bnQodXRjWWVhcihkKSwgZCkgKyAodXRjWWVhcihkKS5nZXRVVENEYXkoKSA9PT0gNCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENXZWVrZGF5TnVtYmVyU3VuZGF5KGQpIHtcbiAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKHV0Y01vbmRheS5jb3VudCh1dGNZZWFyKGQpIC0gMSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENZZWFySVNPKGQsIHApIHtcbiAgZCA9IFVUQ2RJU08oZCk7XG4gIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRnVsbFllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRnVsbFllYXJJU08oZCwgcCkge1xuICB2YXIgZGF5ID0gZC5nZXRVVENEYXkoKTtcbiAgZCA9IChkYXkgPj0gNCB8fCBkYXkgPT09IDApID8gdXRjVGh1cnNkYXkoZCkgOiB1dGNUaHVyc2RheS5jZWlsKGQpO1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDWm9uZSgpIHtcbiAgcmV0dXJuIFwiKzAwMDBcIjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGl0ZXJhbFBlcmNlbnQoKSB7XG4gIHJldHVybiBcIiVcIjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VW5peFRpbWVzdGFtcChkKSB7XG4gIHJldHVybiArZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VW5peFRpbWVzdGFtcFNlY29uZHMoZCkge1xuICByZXR1cm4gTWF0aC5mbG9vcigrZCAvIDEwMDApO1xufVxuIiwiaW1wb3J0IGZvcm1hdExvY2FsZSBmcm9tIFwiLi9sb2NhbGUuanNcIjtcblxudmFyIGxvY2FsZTtcbmV4cG9ydCB2YXIgdGltZUZvcm1hdDtcbmV4cG9ydCB2YXIgdGltZVBhcnNlO1xuZXhwb3J0IHZhciB1dGNGb3JtYXQ7XG5leHBvcnQgdmFyIHV0Y1BhcnNlO1xuXG5kZWZhdWx0TG9jYWxlKHtcbiAgZGF0ZVRpbWU6IFwiJXgsICVYXCIsXG4gIGRhdGU6IFwiJS1tLyUtZC8lWVwiLFxuICB0aW1lOiBcIiUtSTolTTolUyAlcFwiLFxuICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICBkYXlzOiBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgc2hvcnREYXlzOiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG4gIG1vbnRoczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gIHNob3J0TW9udGhzOiBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWZhdWx0TG9jYWxlKGRlZmluaXRpb24pIHtcbiAgbG9jYWxlID0gZm9ybWF0TG9jYWxlKGRlZmluaXRpb24pO1xuICB0aW1lRm9ybWF0ID0gbG9jYWxlLmZvcm1hdDtcbiAgdGltZVBhcnNlID0gbG9jYWxlLnBhcnNlO1xuICB1dGNGb3JtYXQgPSBsb2NhbGUudXRjRm9ybWF0O1xuICB1dGNQYXJzZSA9IGxvY2FsZS51dGNQYXJzZTtcbiAgcmV0dXJuIGxvY2FsZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4geDtcbn1cbiIsImltcG9ydCBpZGVudGl0eSBmcm9tIFwiLi9pZGVudGl0eS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBncm91cCh2YWx1ZXMsIC4uLmtleXMpIHtcbiAgcmV0dXJuIG5lc3QodmFsdWVzLCBpZGVudGl0eSwgaWRlbnRpdHksIGtleXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBzKHZhbHVlcywgLi4ua2V5cykge1xuICByZXR1cm4gbmVzdCh2YWx1ZXMsIEFycmF5LmZyb20sIGlkZW50aXR5LCBrZXlzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvbGx1cCh2YWx1ZXMsIHJlZHVjZSwgLi4ua2V5cykge1xuICByZXR1cm4gbmVzdCh2YWx1ZXMsIGlkZW50aXR5LCByZWR1Y2UsIGtleXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm9sbHVwcyh2YWx1ZXMsIHJlZHVjZSwgLi4ua2V5cykge1xuICByZXR1cm4gbmVzdCh2YWx1ZXMsIEFycmF5LmZyb20sIHJlZHVjZSwga2V5cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmRleCh2YWx1ZXMsIC4uLmtleXMpIHtcbiAgcmV0dXJuIG5lc3QodmFsdWVzLCBpZGVudGl0eSwgdW5pcXVlLCBrZXlzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZGV4ZXModmFsdWVzLCAuLi5rZXlzKSB7XG4gIHJldHVybiBuZXN0KHZhbHVlcywgQXJyYXkuZnJvbSwgdW5pcXVlLCBrZXlzKTtcbn1cblxuZnVuY3Rpb24gdW5pcXVlKHZhbHVlcykge1xuICBpZiAodmFsdWVzLmxlbmd0aCAhPT0gMSkgdGhyb3cgbmV3IEVycm9yKFwiZHVwbGljYXRlIGtleVwiKTtcbiAgcmV0dXJuIHZhbHVlc1swXTtcbn1cblxuZnVuY3Rpb24gbmVzdCh2YWx1ZXMsIG1hcCwgcmVkdWNlLCBrZXlzKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gcmVncm91cCh2YWx1ZXMsIGkpIHtcbiAgICBpZiAoaSA+PSBrZXlzLmxlbmd0aCkgcmV0dXJuIHJlZHVjZSh2YWx1ZXMpO1xuICAgIGNvbnN0IGdyb3VwcyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBrZXlvZiA9IGtleXNbaSsrXTtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgY29uc3Qga2V5ID0ga2V5b2YodmFsdWUsICsraW5kZXgsIHZhbHVlcyk7XG4gICAgICBjb25zdCBncm91cCA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICAgIGlmIChncm91cCkgZ3JvdXAucHVzaCh2YWx1ZSk7XG4gICAgICBlbHNlIGdyb3Vwcy5zZXQoa2V5LCBbdmFsdWVdKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZXNdIG9mIGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLnNldChrZXksIHJlZ3JvdXAodmFsdWVzLCBpKSk7XG4gICAgfVxuICAgIHJldHVybiBtYXAoZ3JvdXBzKTtcbiAgfSkodmFsdWVzLCAwKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1heCh2YWx1ZXMsIHZhbHVlb2YpIHtcbiAgbGV0IG1heDtcbiAgaWYgKHZhbHVlb2YgPT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWUgIT0gbnVsbFxuICAgICAgICAgICYmIChtYXggPCB2YWx1ZSB8fCAobWF4ID09PSB1bmRlZmluZWQgJiYgdmFsdWUgPj0gdmFsdWUpKSkge1xuICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAoKHZhbHVlID0gdmFsdWVvZih2YWx1ZSwgKytpbmRleCwgdmFsdWVzKSkgIT0gbnVsbFxuICAgICAgICAgICYmIChtYXggPCB2YWx1ZSB8fCAobWF4ID09PSB1bmRlZmluZWQgJiYgdmFsdWUgPj0gdmFsdWUpKSkge1xuICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1heDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNvdXJjZSwga2V5cykge1xuICByZXR1cm4gQXJyYXkuZnJvbShrZXlzLCBrZXkgPT4gc291cmNlW2tleV0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3VtKHZhbHVlcywgdmFsdWVvZikge1xuICBsZXQgc3VtID0gMDtcbiAgaWYgKHZhbHVlb2YgPT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlID0gK3ZhbHVlKSB7XG4gICAgICAgIHN1bSArPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWUgPSArdmFsdWVvZih2YWx1ZSwgKytpbmRleCwgdmFsdWVzKSkge1xuICAgICAgICBzdW0gKz0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59XG4iLCJpbXBvcnQgYXNjZW5kaW5nIGZyb20gXCIuL2FzY2VuZGluZy5qc1wiO1xuaW1wb3J0IHBlcm11dGUgZnJvbSBcIi4vcGVybXV0ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzb3J0KHZhbHVlcywgZiA9IGFzY2VuZGluZykge1xuICBpZiAodHlwZW9mIHZhbHVlc1tTeW1ib2wuaXRlcmF0b3JdICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ2YWx1ZXMgaXMgbm90IGl0ZXJhYmxlXCIpO1xuICB2YWx1ZXMgPSBBcnJheS5mcm9tKHZhbHVlcyk7XG4gIGlmIChmLmxlbmd0aCA9PT0gMSkge1xuICAgIGYgPSB2YWx1ZXMubWFwKGYpO1xuICAgIHJldHVybiBwZXJtdXRlKHZhbHVlcywgdmFsdWVzLm1hcCgoZCwgaSkgPT4gaSkuc29ydCgoaSwgaikgPT4gYXNjZW5kaW5nKGZbaV0sIGZbal0pKSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlcy5zb3J0KGYpO1xufVxuIiwiaW1wb3J0IHt0aW1lUGFyc2UgYXMgRDNUaW1lUGFyc2UsXG4gICAgdGltZUZvcm1hdCBhcyBEM1RpbWVGb3JtYXR9IGZyb20gJ2QzLXRpbWUtZm9ybWF0JztcbmltcG9ydCB7c29ydCBhcyBEM1NvcnQsXG4gICAgc3VtIGFzIEQzU3VtLFxuICAgIG1heCBhcyBEM01heCxcbiAgICByb2xsdXAgYXMgRDNSb2xsdXB9IGZyb20gJ2QzLWFycmF5JztcblxuaW1wb3J0IGhhcyBmcm9tICdsb2Rhc2gtZXMvaGFzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oRGF0YSl7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3VtIGZ1bmN0aW9uIGZvciBkYXRlLCB0YWtlcyBwYXJzaW5nIGZvcm1hdCBvZiBpbnB1dCBkYXRlLFxuICAgICAqIGFuZCBvdXRwdXQgZm9ybWF0XG4gICAgICovXG4gICAgRGF0YS5nZXRUcmVuZFN1bUJ5RnVuY3Rpb24gPSBmdW5jdGlvbihpblBhcnNlLCBvdXRGb3JtYXQpe1xuICAgICAgICByZXR1cm4gZD0+RDNUaW1lRm9ybWF0KG91dEZvcm1hdCkoRDNUaW1lUGFyc2UoaW5QYXJzZSkoZCkpO1xuICAgIH07XG4gICAgLyogRHVwbGljYXRlIG9mIGFib3ZlICovXG4gICAgRGF0YS50aW1lRm9ybWF0Q29udmVydGVyID0gZnVuY3Rpb24oaW5QYXJzZSwgb3V0Rm9ybWF0KXtcbiAgICAgICAgcmV0dXJuIGQ9PkQzVGltZUZvcm1hdChvdXRGb3JtYXQpKEQzVGltZVBhcnNlKGluUGFyc2UpKGQpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdG9waWMgZW50cnkgZnJvbSBhIHRyZW5kIGRpc3RyaWJ1dGlvblxuICAgICAqIHdpbGwgdGhyb3cgZXJyb3IgaWYgdG9waWMgbm90IGZvdW5kXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG9waWNUcmVuZEVudHJ5KGRpc3RyaWIsIHRvcGljSWQpe1xuICAgICAgICBsZXQgdCA9IGRpc3RyaWIuZmlsdGVyKGQ9PntyZXR1cm4gZC50b3BpY0lkID09IHRvcGljSWQ7fSk7XG4gICAgICAgIGlmKHQubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBlcnJvcjogdG9waWMgJyt0b3BpY0lkKycgbm90IGZvdW5kIGluIHRyZW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsdGVycyBvdXQgdGhlIGRhdGUgb3V0c2lkZSBvZiB0aGUgdGltZSByYW5nZSBmcm9tIHRoZSBkaXN0cmlidXRpb24gYW5kIHJldHVybnMgdGhlIGRpc3RyaWJ1dGlvblxuICAgICAqIGRhdGVEaXN0cmliOiBbe2RhdGUsdmFsdWV9XVxuICAgICAqIHRpbWVSYW5nZTogW2Zvcm1hdCwgbWluRGF0ZSwgbWF4RGF0ZV1cbiAgICAgKiB3aWxsIHRocm93IGVycm9yIGluIHRpbWVSYW5nZSBpcyBub3QgY29tcGxldGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJUaW1lUmFuZ2UoZGF0ZURpc3RyaWIsIHRpbWVSYW5nZSl7XG4gICAgICAgIGlmKHRpbWVSYW5nZS5sZW5ndGggIT09IDMpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiB0aW1lIHJhbmdlIGluY29tcGxldGU6IFtmb3JtYXQsIG1pbkRhdGUgKGluYy4pLCBtYXhEYXRlIChleGMuKV0nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGFyc2UgPSBEM1RpbWVQYXJzZSh0aW1lUmFuZ2VbMF0pO1xuICAgICAgICByZXR1cm4gZGF0ZURpc3RyaWIuZmlsdGVyKGQ9PntyZXR1cm4gcGFyc2UoZC5kYXRlKSA+PSBwYXJzZSh0aW1lUmFuZ2VbMV0pICYmIHBhcnNlKGQuZGF0ZSkgPCBwYXJzZSh0aW1lUmFuZ2VbMl0pO30pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdyb3VwcyBhbmQgc3VtcyB0aGUgZW50cmllcyBpbiB0aGUgZGF0ZSBkaXN0cmlidXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzdW1CeSBmdW5jdGlvblxuICAgICAqIGRhdGVEaXN0cmliOiBbe2RhdGUsdmFsdWV9XVxuICAgICAqIHN1bUJ5OiBkYXRlPT5kYXRlSW5OZXdGb3JtYXRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdW1EYXRlcyhkYXRlRGlzdHJpYiwgc3VtQnkpe1xuICAgICAgICByZXR1cm4gRDNTb3J0KEFycmF5LmZyb20oRDNSb2xsdXAoZGF0ZURpc3RyaWIsIGQ9PkQzU3VtKGQsIGQyPT5kMi52YWx1ZSksIGQ9PnN1bUJ5KGQuZGF0ZSkpKSwgZD0+ZC5rZXkpXG4gICAgICAgICAgICAubWFwKGQ9PntyZXR1cm4ge2RhdGU6ZC5rZXksdmFsdWU6ZC52YWx1ZX07fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG1haW4gdG9waWMgZGF0ZSBkaXN0cmlidXRpb24gZ2l2ZW4gdG9waWMgaWRcbiAgICAgKiByZXR1cm5zIGluIGZvcm1hdDogW3tkYXRlOnN0cmluZyx2YWx1ZTpudW1iZXJ9XVxuICAgICAqIHN1bUJ5OiBkYXRlIGNvbnZlcnRlciBmdW5jdGlvblxuICAgICAqIHRpbWVSYW5nZTogW2Zvcm1hdCwgbWluRGF0ZSAoaW5jLiksIG1heERhdGUgKGV4Yy4pXVxuICAgICAqIHdpbGwgdGhyb3cgZXJyb3IgaWYgdHJlbmQgZGF0YSBub3QgbG9hZGVkIG9yIGlmIHRyZW5kIGRhdGEgZG9lc24ndCBoYXZlIG1haW4gdG9waWNzXG4gICAgICovXG4gICAgRGF0YS5nZXRNYWluVG9waWNUcmVuZCA9IGZ1bmN0aW9uKHRvcGljSWQsIHN1bUJ5PW51bGwsIHRpbWVSYW5nZT1udWxsKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICd0cmVuZCcpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogdHJlbmQgd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaGFzKERhdGEuZGF0YS50cmVuZCwgJ21haW5Ub3BpY3MnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IG5vIHRyZW5kIGZvciBtYWluIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRlRGlzdHJpYiA9IGdldFRvcGljVHJlbmRFbnRyeShEYXRhLmRhdGEudHJlbmQubWFpblRvcGljcywgdG9waWNJZCkuZGlzdHJpYnV0aW9uXG4gICAgICAgICAgICAubWFwKGQ9PntyZXR1cm4ge2RhdGU6ZC5pZCx2YWx1ZTpkLndlaWdodH07fSk7XG4gICAgICAgIGlmKHRpbWVSYW5nZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICBkYXRlRGlzdHJpYiA9IGZpbHRlclRpbWVSYW5nZShkYXRlRGlzdHJpYiwgdGltZVJhbmdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdW1CeSAhPT0gbnVsbCl7XG4gICAgICAgICAgICBkYXRlRGlzdHJpYiA9IHN1bURhdGVzKGRhdGVEaXN0cmliLCBzdW1CeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGVEaXN0cmliO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3ViIHRvcGljIGRhdGUgZGlzdHJpYnV0aW9uIGdpdmVuIHRvcGljIGlkXG4gICAgICogcmV0dXJucyBpbiBmb3JtYXQ6IFt7ZGF0ZTpzdHJpbmcsdmFsdWU6bnVtYmVyfV1cbiAgICAgKiBzdW1CeTogZGF0ZSBjb252ZXJ0ZXIgZnVuY3Rpb25cbiAgICAgKiB0aW1lUmFuZ2U6IFtmb3JtYXQsIG1pbkRhdGUgKGluYy4pLCBtYXhEYXRlIChleGMuKV1cbiAgICAgKiB3aWxsIHRocm93IGVycm9yIGlmIHRyZW5kIGRhdGEgbm90IGxvYWRlZCBvciBpZiB0cmVuZCBkYXRhIGRvZXNuJ3QgaGF2ZSBzdWIgdG9waWNzXG4gICAgICovXG4gICAgRGF0YS5nZXRTdWJUb3BpY1RyZW5kID0gZnVuY3Rpb24odG9waWNJZCwgc3VtQnk9bnVsbCwgdGltZVJhbmdlPW51bGwpe1xuICAgICAgICBpZighaGFzKERhdGEuZGF0YSwgJ3RyZW5kJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiB0cmVuZCB3YXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLnRyZW5kLCAnc3ViVG9waWNzJykpe1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIEVycm9yOiBubyB0cmVuZCBmb3Igc3ViIHRvcGljcycpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRlRGlzdHJpYiA9IGdldFRvcGljVHJlbmRFbnRyeShEYXRhLmRhdGEudHJlbmQuc3ViVG9waWNzLCB0b3BpY0lkKS5kaXN0cmlidXRpb25cbiAgICAgICAgICAgIC5tYXAoZD0+e3JldHVybiB7ZGF0ZTpkLmlkLHZhbHVlOmQud2VpZ2h0fTt9KTtcbiAgICAgICAgaWYodGltZVJhbmdlICE9PSBudWxsKXtcbiAgICAgICAgICAgIGRhdGVEaXN0cmliID0gZmlsdGVyVGltZVJhbmdlKGRhdGVEaXN0cmliLCB0aW1lUmFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN1bUJ5ICE9PSBudWxsKXtcbiAgICAgICAgICAgIGRhdGVEaXN0cmliID0gc3VtRGF0ZXMoZGF0ZURpc3RyaWIsIHN1bUJ5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZURpc3RyaWI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVuZCBkaXN0cmlidXRpb25cbiAgICAgKiBzdW1CeTogZGF0ZSBjb252ZXJ0ZXIgZnVuY3Rpb24gdG8gYWdncmVnYXRlIHZhbHVlc1xuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaW4gdHJuZWQgd2FzIG5vdCBsb2FkZWQgb3IgaWYgdHJlbmQgaGFzIG5laXRoZXIgbWFpbiBvciBzdWIgdG9waWNzXG4gICAgICovXG4gICAgRGF0YS5nZXRNYXhUcmVuZCA9IGZ1bmN0aW9uKHN1bUJ5PW51bGwpe1xuICAgICAgICBsZXQgbWF4ID0gLTE7XG4gICAgICAgIC8vIGxldCByZWR1Y2VXZWlnaHRzID0gZD0+ZC5kaXN0cmlidXRpb24ucmVkdWNlKChhY2MsdmFsKT0+e3JldHVybiBhY2MrdmFsLndlaWdodDt9LDApO1xuICAgICAgICBsZXQgbWF4V2VpZ2h0cyA9IGQ9PkQzTWF4KGQuZGlzdHJpYnV0aW9uLCBkMj0+ZDIud2VpZ2h0KTtcbiAgICAgICAgbGV0IG1heFdlaWdodHNTdW1CeSA9IGQ9PnN1bURhdGVzKGQuZGlzdHJpYnV0aW9uLCBzdW1CeSk7XG4gICAgICAgIGxldCBmdW4gPSBzdW1CeSA9PT0gbnVsbCA/IG1heFdlaWdodHMgOiBtYXhXZWlnaHRzU3VtQnk7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAndHJlbmQnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgRXJyb3I6IHRyZW5kIHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaGFzKERhdGEuZGF0YS50cmVuZCwgJ3N1YlRvcGljcycpKXtcbiAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgRDNNYXgoRGF0YS5kYXRhLnRyZW5kLnN1YlRvcGljcywgZnVuKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaGFzKERhdGEuZGF0YS50cmVuZCwgJ21haW5Ub3BpY3MnKSl7XG4gICAgICAgICAgICBtYXggPSBNYXRoLm1heChtYXgsIEQzTWF4KERhdGEuZGF0YS50cmVuZC5tYWluVG9waWNzLCBmdW4pKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaGFzKERhdGEuZGF0YS50cmVuZCwgJ3N1YlRvcGljcycpICYmICFoYXMoRGF0YS5kYXRhLnRyZW5kLCAnbWFpblN1YnRvcGljcycpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBFcnJvcjogbm8gdHJlbmQgZGF0YSBmb3IgdG9waWNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICB9O1xuXG59IiwiaW1wb3J0IGhhcyBmcm9tICdsb2Rhc2gtZXMvaGFzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oRGF0YSl7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIGxhYmVscyBpbiB0aGUgaW5kZXhcbiAgICAgKiBXaWxsIHNhdmUgdGhlIGxpc3QgaWYgbm90IGFjY2Vzc2VkIGJlZm9yZVxuICAgICAqIFdpbGwgdHJob3cgZXJyb3IgaWYgbGFiZWxzIGluZGV4IHdhcyBub3QgbG9hZGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGFiZWxzKCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnbGFiZWxzSW5kZXgnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZXJyb3I6IGxhYmVsc0luZGV4IHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdsYWJlbHMnKSl7XG4gICAgICAgICAgICBEYXRhLmRhdGEubGFiZWxzID0gT2JqZWN0LmtleXMoRGF0YS5kYXRhLmxhYmVsc0luZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGF0YS5kYXRhLmxhYmVscztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXBhcmF0ZXMgc2VhcmNoIHRlcm1zIGZyb20gYSBxdWVyeVxuICAgICAqIGUuZy4gXCJBIGFuZCBCIG9yIEMgYW5kIEQgb3IgRVwiID0+IFtbQSxCXSwgW0MsRF0sIFtFXV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hUZXJtcygpe1xuICAgICAgICAvLyBzcGxpdCBzdHJpbmdzIGZvciAnb3InIGFuZCAnYW5kJyBxdWVyaWVzXG4gICAgICAgIGxldCBvclNwbGl0cyA9IFsnOycsICcgb3IgJywgJyonXTtcbiAgICAgICAgbGV0IGFuZFNwbGl0cyA9IFsnIGFuZCAnLCAnKycsICcgJ107IC8vICcgJyBuZWVkcyB0byBiZSBsYXN0ISFcbiAgICAgICAgLy8gc2VhcmNoIHF1ZXJ5XG4gICAgICAgIGxldCBzZWFyY2ggPSBbXTtcbiAgICAgICAgLy8gYnVpbGRpbmcgdGhlIHNlYXJjaCBxdWVyeSBmcm9tIGEgc3RyaW5nXG4gICAgICAgIGlmKHR5cGVvZihEYXRhLmRhdGEuc2VhcmNoVGVybSkgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAmJiBEYXRhLmRhdGEuc2VhcmNoVGVybSAhPT0gbnVsbFxuICAgICAgICAgICAgJiYgRGF0YS5kYXRhLnNlYXJjaFRlcm0ubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICBzZWFyY2ggPSBbRGF0YS5kYXRhLnNlYXJjaFRlcm1dO1xuICAgICAgICAgICAgLy8gc2VwYXJhdGUgJ29yJyBxdWVyaWVzXG4gICAgICAgICAgICBvclNwbGl0cy5mb3JFYWNoKG89PntcbiAgICAgICAgICAgICAgICBsZXQgcGFydHMgPSBbXTtcbiAgICAgICAgICAgICAgICBzZWFyY2guZm9yRWFjaChzPT5zLnNwbGl0KG8pLmZvckVhY2gocD0+cGFydHMucHVzaChwKSkpO1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHBhcnRzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBzZXBhcmF0ZSAnYW5kJyBxdWVyaWVzIHdpdGhpbiAnb3Inc1xuICAgICAgICAgICAgc2VhcmNoID0gc2VhcmNoLm1hcChzPT5bc10pO1xuICAgICAgICAgICAgYW5kU3BsaXRzLmZvckVhY2goYT0+e1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHNlYXJjaC5tYXAocz0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcy5mb3JFYWNoKHQ9PnQuc3BsaXQoYSkuZm9yRWFjaChwPT5wYXJ0cy5wdXNoKHApKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJ0cztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWFyY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc2VhcmNoIHN0cmluZ1xuICAgICAqL1xuICAgIERhdGEuc2V0U2VhcmNoVGVybSA9IGZ1bmN0aW9uKHNlYXJjaFRlcm0pe1xuICAgICAgICBEYXRhLmRhdGEuc2VhcmNoVGVybSA9IHNlYXJjaFRlcm0gPT09ICcnID8gbnVsbCA6IHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIERhdGE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbGxzIHByb3ZpZGVkIHNldCBpZHMgd2l0aCBkb2NJZHMgb2YgZG9jdW1lbnRzIGNvbnRhaW5pbmcgYWxsIHByb3ZpZGVkIHRlcm1zXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBsYWJlbHMgaW5kZXggd2FzIG5vdCBsb2FkZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZWFyY2hBbGxUZXJtc0luRG9jdW1lbnRzKHRlcm1zLCBkb2NzSWRzKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdsYWJlbHNJbmRleCcpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBlcnJvcjogbGFiZWxzSW5kZXggd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXQgYWxsIGRvYyBpZHMgd2l0aCBvY2N1cnJlbmNlIG9mIHRlcm1zXG4gICAgICAgIGxldCBkb2NzID0gdGVybXMubWFwKHQ9PntcbiAgICAgICAgICAgIGxldCBsID0gRGF0YS5kYXRhLmxhYmVsc0luZGV4W3RdO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihsKT09J3VuZGVmaW5lZCc/W106bC5kb2N1bWVudHM7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBmaWx0ZXIgZG9jIGlkcyB3aXRoIG9jY3VycmVuY2Ugb2YgYWxsIHRlcm1zXG4gICAgICAgIGxldCBpZHMgPSBkb2NzLnJlZHVjZSgoYWNjLGN1cixpZHgpPT57XG4gICAgICAgICAgICByZXR1cm4gaWR4PT0wID8gY3VyIDogYWNjLmZpbHRlcihpPT5jdXIuaW5jbHVkZXMoaSkpO1xuICAgICAgICB9LCBbXSk7XG4gICAgICAgIC8vIGZpbGwgc2V0c1xuICAgICAgICBpZHMuZm9yRWFjaChpPT5kb2NzSWRzLmFkZChpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkb2MgaWRzIGZyb20gYSBzZWFyY2hcbiAgICAgKiBXaWxsIHRocm93IGVycm9yIGlmIGxhYmVscyBpbmRleCBub3QgbG9hZGVkXG4gICAgICovXG4gICAgRGF0YS5nZXREb2NJZHNGcm9tU2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIWhhcyhEYXRhLmRhdGEsICdsYWJlbHNJbmRleCcpKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBlcnJvcjogbGFiZWxzSW5kZXggd2FzIG5vdCBsb2FkZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VhcmNoID0gZ2V0U2VhcmNoVGVybXMoKTtcbiAgICAgICAgbGV0IGRvY0lkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gZXZhbHVhdGluZyBxdWVyeSBhbmQgcG9wdWxhdGluZyB0aGUgc2V0cyBvZiBpZHNcbiAgICAgICAgaWYoc2VhcmNoLmxlbmd0aCA9PSAxKXsgLy8gbm8gJ29yJ1xuICAgICAgICAgICAgbGV0IGxhc3QgPSBzZWFyY2hbMF0ucG9wKCk7IC8vIGV4dHJhY3QgbGFzdCB0ZXJtXG4gICAgICAgICAgICBsZXQgdGVybXMgPSBzZWFyY2hbMF0uZmlsdGVyKHQ9PnQubGVuZ3RoID4gMCk7IC8vIHJlbW92ZSBhbGwgZW1wdHkgdGVybXNcbiAgICAgICAgICAgIHRlcm1zLnB1c2gobGFzdCk7IC8vIHJlLWFkZCBsYXN0IHRlcm1cbiAgICAgICAgICAgIGlmKHRlcm1zLmxlbmd0aCA9PSAxICYmIHRlcm1zWzBdLmxlbmd0aCA+IDApeyAvLyBpZiBvbmx5IG9uZSBub24tZW1wdHkgdGVybVxuICAgICAgICAgICAgICAgIC8vIHBhcnRpYWwgc2VhcmNoXG4gICAgICAgICAgICAgICAgZ2V0TGFiZWxzKCkuZmlsdGVyKGw9PmwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0ZXJtc1swXSkpXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGw9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEuZGF0YS5sYWJlbHNJbmRleFtsXS5kb2N1bWVudHMuZm9yRWFjaCh0PT5kb2NJZHMuYWRkKHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYodGVybXMubGVuZ3RoID09IDIgJiYgdGVybXNbMV0ubGVuZ3RoID09IDApIHsgLy8gaWYgZXhhY3RseSB0d28gdGVybXMgYW5kIHNlY29uZCBvbmUgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAvLyBleGFjdCBzZWFyY2hcbiAgICAgICAgICAgICAgICBzZWFyY2hBbGxUZXJtc0luRG9jdW1lbnRzKFt0ZXJtc1swXV0sZG9jSWRzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0ZXJtcy5sZW5ndGggPj0yKXsgLy8gaWYgdHdvIG9yIG1vcmUgdGVybXNcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLmZpbHRlcih0PT57cmV0dXJuIHQubGVuZ3RoID4gMDt9KTsgLy8gcmVtb3ZlIHBvdGVudGlhbCBlbXB0eSB0ZXJtIHJlLWFkZGVkXG4gICAgICAgICAgICAgICAgc2VhcmNoQWxsVGVybXNJbkRvY3VtZW50cyh0ZXJtcyxkb2NJZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLmxlbmd0aCA+PSAyKXsgLy8gb25lIG9yIG1vcmUgJ29yJ1xuICAgICAgICAgICAgc2VhcmNoLmZvckVhY2gocz0+e1xuICAgICAgICAgICAgICAgIGxldCB0ZXJtcyA9IHMuZmlsdGVyKHQ9PnQubGVuZ3RoID4gMCk7IC8vIHJlbW92ZSBhbGwgZW1wdHkgdGVybXNcbiAgICAgICAgICAgICAgICBzZWFyY2hBbGxUZXJtc0luRG9jdW1lbnRzKHRlcm1zLGRvY0lkcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZG9jSWRzKTtcblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaWxscyBwcm92aWRlZCBzZXRzIG9mIGlkcyB3aXRoIHRvcGljSWRzIG9mIHRvcGljcyBjb250YWluaW5nIGFsbCBwcm92aWRlZCB0ZXJtc1xuICAgICAqIFdpbGwgdGhyb3cgZXJyb3IgaWYgbGFiZWxzIGluZGV4IHdhcyBub3QgbG9hZGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2VhcmNoQWxsVGVybXNJblRvcGljcyh0ZXJtcywgbWFpblRvcGljSWRzLCBzdWJUb3BpY0lkcyl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnbGFiZWxzSW5kZXgnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZXJyb3I6IGxhYmVsc0luZGV4IHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IGFsbCB0b3BpYyBpZHMgd2l0aCBvY2N1cnJlbmNlIG9mIHRlcm1zXG4gICAgICAgIGxldCBtYWlucyA9IHRlcm1zLm1hcCh0PT57XG4gICAgICAgICAgICBsZXQgbCA9IERhdGEuZGF0YS5sYWJlbHNJbmRleFt0XTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YobCk9PSd1bmRlZmluZWQnP1tdOmwubWFpblRvcGljcztcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBzdWJzID0gdGVybXMubWFwKHQ9PntcbiAgICAgICAgICAgIGxldCBsID0gRGF0YS5kYXRhLmxhYmVsc0luZGV4W3RdO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihsKT09J3VuZGVmaW5lZCc/W106dHlwZW9mKGwuc3ViVG9waWNzKT09J3VuZGVmaW5lZCc/W106bC5zdWJUb3BpY3M7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBmaWx0ZXIgdG9waWMgaWRzIHdpdGggb2NjdXJyZW5jZSBvZiBhbGwgdGVybXNcbiAgICAgICAgbGV0IG1haW5JZHMgPSBtYWlucy5yZWR1Y2UoKGFjYyxjdXIsaWR4KT0+e1xuICAgICAgICAgICAgcmV0dXJuIGlkeD09MCA/IGN1ciA6IGFjYy5maWx0ZXIoaT0+Y3VyLmluY2x1ZGVzKGkpKTtcbiAgICAgICAgfSwgW10pO1xuICAgICAgICBsZXQgc3ViSWRzID0gc3Vicy5yZWR1Y2UoKGFjYyxjdXIsaWR4KT0+e1xuICAgICAgICAgICAgcmV0dXJuIGlkeD09MCA/IGN1ciA6IGFjYy5maWx0ZXIoaT0+Y3VyLm1hcChjPT5jWzBdKS5pbmNsdWRlcyhpWzBdKSk7XG4gICAgICAgIH0sIFtdKTtcbiAgICAgICAgLy8gZmlsbCBzZXRzXG4gICAgICAgIG1haW5JZHMuZm9yRWFjaChpPT5tYWluVG9waWNJZHMuYWRkKGkpKTtcbiAgICAgICAgc3ViSWRzLmZvckVhY2goaT0+e1xuICAgICAgICAgICAgc3ViVG9waWNJZHMuYWRkKGlbMF0pO1xuICAgICAgICAgICAgaVsxXS5mb3JFYWNoKGkyPT5tYWluVG9waWNJZHMuYWRkKGkyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgaWRzIG9mIHRvcGljcyBmcm9tIGEgc2VhcmNoXG4gICAgICogV2lsbCB0aHJvdyBlcnJvciBpZiBsYWJlbHMgaW5kZXggd2FzIG5vdCBsb2FkZWRcbiAgICAgKi9cbiAgICBEYXRhLmdldFRvcGljSWRzRnJvbVNlYXJjaCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCFoYXMoRGF0YS5kYXRhLCAnbGFiZWxzSW5kZXgnKSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZXJyb3I6IGxhYmVsc0luZGV4IHdhcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlYXJjaCA9IGdldFNlYXJjaFRlcm1zKCk7XG5cbiAgICAgICAgLy8gc2V0cyBvZiBpZHMgdG8gYmUgcmV0dXJuZWRcbiAgICAgICAgbGV0IG1haW5Ub3BpY0lkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IHN1YlRvcGljSWRzID0gbmV3IFNldCgpO1xuXG4gICAgICAgIC8vIGV2YWx1YXRpbmcgcXVlcnkgYW5kIHBvcHVsYXRpbmcgdGhlIHNldHMgb2YgaWRzXG4gICAgICAgIGlmKHNlYXJjaC5sZW5ndGggPT0gMSl7IC8vIG5vICdvcidcbiAgICAgICAgICAgIGxldCBsYXN0ID0gc2VhcmNoWzBdLnBvcCgpOyAvLyBleHRyYWN0IGxhc3QgdGVybVxuICAgICAgICAgICAgbGV0IHRlcm1zID0gc2VhcmNoWzBdLmZpbHRlcih0PT50Lmxlbmd0aCA+IDApOyAvLyByZW1vdmUgYWxsIGVtcHR5IHRlcm1zXG4gICAgICAgICAgICB0ZXJtcy5wdXNoKGxhc3QpOyAvLyByZS1hZGQgbGFzdCB0ZXJtXG4gICAgICAgICAgICBpZih0ZXJtcy5sZW5ndGggPT0gMSAmJiB0ZXJtc1swXS5sZW5ndGggPiAwKXsgLy8gaWYgb25seSBvbmUgbm9uLWVtcHR5IHRlcm1cbiAgICAgICAgICAgICAgICAvLyBwYXJ0aWFsIHNlYXJjaFxuICAgICAgICAgICAgICAgIGdldExhYmVscygpLmZpbHRlcihsPT5sLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybXNbMF0pKVxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChsPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhLmRhdGEubGFiZWxzSW5kZXhbbF0ubWFpblRvcGljcy5mb3JFYWNoKHQ9Pm1haW5Ub3BpY0lkcy5hZGQodCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKERhdGEuZGF0YS5sYWJlbHNJbmRleFtsXS5zdWJUb3BpY3MpIT09J3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhLmRhdGEubGFiZWxzSW5kZXhbbF0uc3ViVG9waWNzLmZvckVhY2godD0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUb3BpY0lkcy5hZGQodFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRbMV0uZm9yRWFjaCh0Mj0+bWFpblRvcGljSWRzLmFkZCh0MikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0ZXJtcy5sZW5ndGggPT0gMiAmJiB0ZXJtc1sxXS5sZW5ndGggPT0gMCkgeyAvLyBpZiBleGFjdGx5IHR3byB0ZXJtcyBhbmQgc2Vjb25kIG9uZSBpcyBlbXB0eVxuICAgICAgICAgICAgICAgIC8vIGV4YWN0IHNlYXJjaFxuICAgICAgICAgICAgICAgIHNlYXJjaEFsbFRlcm1zSW5Ub3BpY3MoW3Rlcm1zWzBdXSxtYWluVG9waWNJZHMsc3ViVG9waWNJZHMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHRlcm1zLmxlbmd0aCA+PTIpeyAvLyBpZiB0d28gb3IgbW9yZSB0ZXJtc1xuICAgICAgICAgICAgICAgIHRlcm1zID0gdGVybXMuZmlsdGVyKHQ9PntyZXR1cm4gdC5sZW5ndGggPiAwO30pOyAvLyByZW1vdmUgcG90ZW50aWFsIGVtcHR5IHRlcm0gcmUtYWRkZWRcbiAgICAgICAgICAgICAgICBzZWFyY2hBbGxUZXJtc0luVG9waWNzKHRlcm1zLG1haW5Ub3BpY0lkcyxzdWJUb3BpY0lkcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZihzZWFyY2gubGVuZ3RoID49IDIpeyAvLyBvbmUgb3IgbW9yZSAnb3InXG4gICAgICAgICAgICBzZWFyY2guZm9yRWFjaChzPT57XG4gICAgICAgICAgICAgICAgbGV0IHRlcm1zID0gcy5maWx0ZXIodD0+dC5sZW5ndGggPiAwKTsgLy8gcmVtb3ZlIGFsbCBlbXB0eSB0ZXJtc1xuICAgICAgICAgICAgICAgIHNlYXJjaEFsbFRlcm1zSW5Ub3BpY3ModGVybXMsbWFpblRvcGljSWRzLHN1YlRvcGljSWRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN3aXRjaCBmcm9tIHNldHMgdG8gYXJyYXlzXG4gICAgICAgIG1haW5Ub3BpY0lkcyA9IEFycmF5LmZyb20obWFpblRvcGljSWRzKTtcbiAgICAgICAgc3ViVG9waWNJZHMgPSBBcnJheS5mcm9tKHN1YlRvcGljSWRzKTtcbiAgICAgICAgcmV0dXJuIHttYWluVG9waWNJZHMsIHN1YlRvcGljSWRzfTtcbiAgICB9O1xuXG4gICAgLyoqIFxuICAgICAqIFJldHVybnMgYSBzdWJzZXQgb2YgbGFiZWxzIGZyb20gYSBzZWFyY2hcbiAgICAgKiBXaWxsIHRocm93IGVycm9yIGlmIGxhYmVscyBpbmRleCBub3QgbG9hZGVkIChieSBwcm94eSlcbiAgICAgKi9cbiAgICBEYXRhLmdldExhYmVsc0Zyb21TZWFyY2ggPSBmdW5jdGlvbigpe1xuICAgICAgICBsZXQgc2VhcmNoID0gZ2V0U2VhcmNoVGVybXMoKTtcbiAgICAgICAgbGV0IGxhYmVscyA9IFtdO1xuICAgICAgICAvLyBldmFsdWF0aW5nIHF1ZXJ5IGFuZCBwb3B1bGF0aW5nIHRoZSBzZXRzIG9mIGxhYmVsc1xuICAgICAgICBpZihzZWFyY2gubGVuZ3RoID09IDEpeyAvLyBubyAnb3InXG4gICAgICAgICAgICBsZXQgbGFzdCA9IHNlYXJjaFswXS5wb3AoKTsgLy8gZXh0cmFjdCBsYXN0IHRlcm1cbiAgICAgICAgICAgIGxldCB0ZXJtcyA9IHNlYXJjaFswXS5maWx0ZXIodD0+dC5sZW5ndGggPiAwKTsgLy8gcmVtb3ZlIGFsbCBlbXB0eSB0ZXJtc1xuICAgICAgICAgICAgdGVybXMucHVzaChsYXN0KTsgLy8gcmUtYWRkIGxhc3QgdGVybVxuICAgICAgICAgICAgaWYodGVybXMubGVuZ3RoID09IDEgJiYgdGVybXNbMF0ubGVuZ3RoID4gMCl7IC8vIGlmIG9ubHkgb25lIG5vbi1lbXB0eSB0ZXJtXG4gICAgICAgICAgICAgICAgLy8gcGFydGlhbCBzZWFyY2hcbiAgICAgICAgICAgICAgICBnZXRMYWJlbHMoKS5maWx0ZXIobD0+bC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm1zWzBdKSkuZm9yRWFjaChsPT57bGFiZWxzLnB1c2gobCk7fSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYodGVybXMubGVuZ3RoID09IDIgJiYgdGVybXNbMV0ubGVuZ3RoID09IDApIHsgLy8gaWYgZXhhY3RseSB0d28gdGVybXMgYW5kIHNlY29uZCBvbmUgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAvLyBleGFjdCBzZWFyY2hcbiAgICAgICAgICAgICAgICBnZXRMYWJlbHMoKS5maWx0ZXIobD0+bC50b0xvd2VyQ2FzZSgpID09IHRlcm1zWzBdKS5mb3JFYWNoKGw9PntsYWJlbHMucHVzaChsKTt9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0ZXJtcy5sZW5ndGggPj0yKXsgLy8gaWYgdHdvIG9yIG1vcmUgdGVybXNcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLmZpbHRlcih0PT57cmV0dXJuIHQubGVuZ3RoID4gMDt9KTsgLy8gcmVtb3ZlIHBvdGVudGlhbCBlbXB0eSB0ZXJtIHJlLWFkZGVkXG4gICAgICAgICAgICAgICAgZ2V0TGFiZWxzKCkuZmlsdGVyKGw9PnRlcm1zLmluY2x1ZGVzKGwudG9Mb3dlckNhc2UoKSkpLmZvckVhY2gobD0+e2xhYmVscy5wdXNoKGwpO30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLmxlbmd0aCA+PSAyKXsgLy8gb25lIG9yIG1vcmUgJ29yJ1xuICAgICAgICAgICAgc2VhcmNoLmZvckVhY2gocz0+e1xuICAgICAgICAgICAgICAgIGxldCB0ZXJtcyA9IHMuZmlsdGVyKHQ9PnQubGVuZ3RoID4gMCk7IC8vIHJlbW92ZSBhbGwgZW1wdHkgdGVybXNcbiAgICAgICAgICAgICAgICBnZXRMYWJlbHMoKS5maWx0ZXIobD0+dGVybXMuaW5jbHVkZXMobC50b0xvd2VyQ2FzZSgpKSkuZm9yRWFjaChsPT57bGFiZWxzLnB1c2gobCk7fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFiZWxzO1xuICAgIH07XG59IiwiaW1wb3J0IERhdGFNYW5hZ2VyQmFzaWMgZnJvbSAnLi9EYXRhTWFuYWdlckJhc2ljJztcbmltcG9ydCBtYXBEYXRhIGZyb20gJy4vbWFwRGF0YSc7XG5pbXBvcnQgZG9jRGF0YSBmcm9tICcuL2RvY0RhdGEnO1xuaW1wb3J0IGRpc3RyaWJEYXRhIGZyb20gJy4vZGlzdHJpYkRhdGEnO1xuaW1wb3J0IHRyZW5kRGF0YSBmcm9tICcuL3RyZW5kRGF0YSc7XG5pbXBvcnQgc2VhcmNoRGF0YSBmcm9tICcuL3NlYXJjaERhdGEnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xuXG4gICAgLy8gdXJsczpcbiAgICAvLyB7XG4gICAgLy8gICAgIG1haW5NYXAsIHN1Yk1hcHNcbiAgICAvLyAgICAgbWFpbk1vZGVsLCBzdWJNb2RlbCxcbiAgICAvLyAgICAgbWFpbkxMLCBzdWJMTCxcbiAgICAvLyAgICAgZGlzdHJpYnV0aW9uLCB0cmVuZCxcbiAgICAvLyAgICAgbGFiZWxzSW5kZXgsIGRvY0NTVlxuICAgIC8vIH1cblxuICAgIC8vIFNldCB0aGUgaW5pdGlhbCBkYXRhIG1hbmFnZXJcbiAgICBsZXQgRGF0YSA9IERhdGFNYW5hZ2VyQmFzaWMoKTtcbiAgICAvLyBBZGQgbWFwIGZlYXR1cmVzXG4gICAgbWFwRGF0YShEYXRhKTtcbiAgICAvLyBBZGQgZG9jdW1lbnQgdGFibGUgZmVhdHVyZXNcbiAgICBkb2NEYXRhKERhdGEpO1xuICAgIC8vIEFkZCBkaXN0cmlidXRpb24gZmVhdHVyZXNcbiAgICBkaXN0cmliRGF0YShEYXRhKTtcbiAgICAvLyBBZGQgdHJlbmQgZmVhdHVyZXNcbiAgICB0cmVuZERhdGEoRGF0YSk7XG4gICAgLy8gQWRkIHNlYXJjaCBmZWF0dXJlc1xuICAgIHNlYXJjaERhdGEoRGF0YSk7XG5cbiAgICByZXR1cm4gRGF0YTtcblxufSJdLCJuYW1lcyI6WyJnZXRDb250cm9scyIsIm5DdHJsIiwiY29sU2l6ZXMiLCJhbGlnbiIsImRhc2hib2FyZCIsInN1bSIsImEiLCJiIiwibGVuZ3RoIiwiaSIsInB1c2giLCJzdW1Db2xzIiwicmVkdWNlIiwibkNvbHMiLCJuUm93cyIsInJvd3MiLCJjdW11bENvbHMiLCJyb3ciLCJhcmVhU3RyaW5ncyIsIm1hcCIsInIiLCJPYmplY3QiLCJlbnRyaWVzIiwiYXJlYSIsInNpemUiLCJyZXBlYXQiLCJ0ZW1wbGF0ZSIsInJvd1RlbXBsYXRlIiwicm93TGVuZ3RoIiwidmFsdWVzIiwicyIsInNwYWNlIiwiam9pbiIsInNwYWNlcyIsIk1hdGgiLCJmbG9vciIsImV4dHJhIiwiYXJlYXMiLCJmb3JFYWNoIiwiY3RybEFyZWFzIiwiY3RybFRlbXBsYXRlIiwiY2hlY2tBbGlnbiIsImluY2x1ZGVzIiwiY29uc29sZSIsImxvZyIsImNoZWNrQ29sU2l6ZXMiLCJjIiwic29tZSIsImlzTmFOIiwiZXJyb3IiLCJtaW4iLCJwYXJzZUludCIsImNvbnRyb2xzIiwic3BsaXQiLCJyZXN0IiwiY29udHJvbFRlbXBsYXRlIiwic2l6ZXMiLCJwb3AiLCJzbGljZSIsImJ1aWxkQ29sQSIsInBhbmVsMSIsInBhbmVsVCIsInRlbXBsYXRlUGFuZWwxIiwicGFuZWxBcmVhcyIsInBhbmVsVGVtcGxhdGUiLCJidWlsZERhc2hBIiwiYnVpbGRDb2xCIiwicGFuZWwyIiwidGVtcGxhdGVQYW5lbDIiLCJidWlsZERhc2hCYSIsImJ1aWxkRGFzaEJiIiwiYnVpbGRDb2xDIiwicGFuZWwzIiwidGVtcGxhdGVQYW5lbDMiLCJidWlsZERhc2hDYSIsImJ1aWxkRGFzaENiIiwiYnVpbGRDb2xEYSIsInBhbmVsNCIsInRlbXBsYXRlUGFuZWw0IiwiYnVpbGRDb2xEYiIsImJ1aWxkRGFzaERhIiwiYnVpbGREYXNoRGIiLCJidWlsZENvbEUiLCJwYW5lbDUiLCJ0ZW1wbGF0ZVBhbmVsNSIsImJ1aWxkRGFzaEUiLCJidWlsZENvbEZhIiwicGFuZWw2IiwidGVtcGxhdGVQYW5lbDYiLCJidWlsZERhc2hGYSIsImJ1aWxkQ29sRmIiLCJidWlsZERhc2hGYiIsImxheW91dCIsImNvbnRhaW5lciIsImhlYWRlciIsImZvb3RlciIsIm1pbldpZHRoIiwibWluSGVpZ2h0IiwiaGVpZ2h0TWFyZ2luIiwid2lkdGhNYXJnaW4iLCJwYW5lbE1hcmdpbiIsImNvbnRyb2xNYXJnaW4iLCJnZXRUb3RhbEhlaWdodCIsImJhc2VIIiwiaGVhZEgiLCJEM1NlbGVjdCIsIm5vZGUiLCJvZmZzZXRIZWlnaHQiLCJmb290SCIsImdldFRvdGFsdFdpZHRoIiwiYmFzZVciLCJnZXRHcmlkIiwidyIsImgiLCJ0Iiwic3R5bGUiLCJnZXRTaXplcyIsIndpZHRoIiwiaGVpZ2h0IiwiZ3JpZCIsImVuZHNXaXRoIiwic2VsZWN0IiwiZW1wdHkiLCJhcHBlbmQiLCJhdHRyIiwia2V5cyIsImJ1aWxkUGFnZSIsIm1heCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiaW5uZXJXaWR0aCIsInRvdGFsSCIsInRvdGFsVyIsIkNvbnRyb2xzIiwiY29udHJvbFQiLCJQYW5lbHMiLCJ3YXRjaCIsIm1vZHVsZXMiLCJvbnJlc2l6ZSIsIm1vZHVsZSIsInNldFNpemUiLCJkc3YiLCJ0ZXh0IiwiY3N2IiwiRGF0YSIsImxvYWREYXRhRnJvbVVybHMiLCJ1cmxzIiwiUHJvbWlzZSIsImFsbCIsIm5hbWUiLCJ1cmwiLCJEM0pzb24iLCJ0aGVuIiwiZGF0YSIsIkQzQ3N2IiwiRDNUZXh0IiwicHJvY2Vzc0RhdGEiLCJkYXRhQXJyYXkiLCJsb2FkQW5kUHJvY2Vzc0RhdGFGcm9tVXJscyIsImQiLCJyb290IiwiU3ltYm9sIiwib2JqZWN0UHJvdG8iLCJoYXNPd25Qcm9wZXJ0eSIsIm5hdGl2ZU9iamVjdFRvU3RyaW5nIiwic3ltVG9TdHJpbmdUYWciLCJmdW5jUHJvdG8iLCJmdW5jVG9TdHJpbmciLCJIQVNIX1VOREVGSU5FRCIsIk1hcCIsIk1BWF9TQUZFX0lOVEVHRVIiLCJJTkZJTklUWSIsInNldFN1Yk1hcCIsIm1haW5Ub3BpY0lkIiwiaGFzIiwiRXJyb3IiLCJzdWJNYXBzIiwiZmlsdGVyIiwic3ViTWFwIiwiZ2V0U3ViTWFwIiwiZ2V0VG9waWMiLCJ0b3BpY0lkIiwidG9waWNzIiwiZ2V0VG9waWNNYWluTWFwIiwibWFpbk1hcCIsImdldFRvcGljU3ViTWFwIiwic2V0VGFibGVSb3dzTWFpblRvcGljIiwibWFpbk1vZGVsIiwidGFibGVSb3dzIiwidG9wRG9jcyIsInNldFRhYmxlUm93c1N1YlRvcGljIiwic3ViVG9waWNNb2RlbCIsImdldFRhYmxlUm93cyIsIm51bWJlciIsImdldERvY3VtZW50IiwiZG9jSWQiLCJnZXREaXN0cmlidXRpb25MYWJlbHMiLCJ0ZXh0RnVuY3Rpb24iLCJlbnRyeSIsImRpc3RyaWJ1dGlvbiIsIm1haW5Ub3BpY3MiLCJpZCIsInYiLCJ2YWx1ZSIsInNvcnQiLCJnZXRUb3BpY3NEaXN0cmlidXRpb24iLCJ0b3BpY0Rpc3RyaWIiLCJmaWVsZE5hbWUiLCJlIiwid2VpZ2h0IiwiZ2V0VG9waWNzRGlzdHJpYnV0aW9uTm9ybWFsaXNlZFBlclRvcGljIiwidG90YWwiLCJnZXRUb3BpY3NEaXN0cmlidXRpb25Ob3JtYWxpc2VkUGVyRmllbGQiLCJmaWVsZERpc3RyaWJ1dGlvbiIsImZpZWxkVG90YWwiLCJhY2MiLCJjdXIiLCJnZXRNYWluVG9waWNzRGlzdHJpYiIsImdldFN1YlRvcGljc0Rpc3RyaWIiLCJzdWJUb3BpY3MiLCJnZXRNYWluVG9waWNzRGlzdHJpYk5vcm1QZXJUb3BpYyIsImdldFN1YlRvcGljc0Rpc3RyaWJOb3JtUGVyVG9waWMiLCJnZXRNYWluVG9waWNzRGlzdHJpYk5vcm1QZXJGaWVsZCIsImdldFN1YlRvcGljc0Rpc3RyaWJOb3JtUGVyRmllbGQiLCJnZXRNYWluVG9waWNEaXN0cmliRW50cnkiLCJkMiIsImtleSIsImdldFN1YlRvcGljRGlzdHJpYkVudHJ5IiwiZ2V0TWFpblRvcGljRGlzdHJpYkVudHJ5Tm9ybSIsImdldFN1YlRvcGljRGlzdHJpYkVudHJ5Tm9ybSIsImludGVydmFsIiwiZm9ybWF0WWVhciIsImRheSIsInRpbWVNb25kYXkiLCJ0aW1lRGF5IiwicGFkIiwidGltZVllYXIiLCJ0aW1lU3VuZGF5IiwidGltZVRodXJzZGF5IiwiYXNjZW5kaW5nIiwiZ2V0VHJlbmRTdW1CeUZ1bmN0aW9uIiwiaW5QYXJzZSIsIm91dEZvcm1hdCIsIkQzVGltZUZvcm1hdCIsIkQzVGltZVBhcnNlIiwidGltZUZvcm1hdENvbnZlcnRlciIsImdldFRvcGljVHJlbmRFbnRyeSIsImRpc3RyaWIiLCJmaWx0ZXJUaW1lUmFuZ2UiLCJkYXRlRGlzdHJpYiIsInRpbWVSYW5nZSIsInBhcnNlIiwiZGF0ZSIsInN1bURhdGVzIiwic3VtQnkiLCJEM1NvcnQiLCJBcnJheSIsImZyb20iLCJEM1JvbGx1cCIsIkQzU3VtIiwiZ2V0TWFpblRvcGljVHJlbmQiLCJ0cmVuZCIsImdldFN1YlRvcGljVHJlbmQiLCJnZXRNYXhUcmVuZCIsIm1heFdlaWdodHMiLCJEM01heCIsIm1heFdlaWdodHNTdW1CeSIsImZ1biIsImdldExhYmVscyIsImxhYmVscyIsImxhYmVsc0luZGV4IiwiZ2V0U2VhcmNoVGVybXMiLCJvclNwbGl0cyIsImFuZFNwbGl0cyIsInNlYXJjaCIsInNlYXJjaFRlcm0iLCJvIiwicGFydHMiLCJwIiwic2V0U2VhcmNoVGVybSIsInRvTG93ZXJDYXNlIiwic2VhcmNoQWxsVGVybXNJbkRvY3VtZW50cyIsInRlcm1zIiwiZG9jc0lkcyIsImRvY3MiLCJsIiwiZG9jdW1lbnRzIiwiaWRzIiwiaWR4IiwiYWRkIiwiZ2V0RG9jSWRzRnJvbVNlYXJjaCIsImRvY0lkcyIsIlNldCIsImxhc3QiLCJzZWFyY2hBbGxUZXJtc0luVG9waWNzIiwibWFpblRvcGljSWRzIiwic3ViVG9waWNJZHMiLCJtYWlucyIsInN1YnMiLCJtYWluSWRzIiwic3ViSWRzIiwiaTIiLCJnZXRUb3BpY0lkc0Zyb21TZWFyY2giLCJ0MiIsImdldExhYmVsc0Zyb21TZWFyY2giLCJEYXRhTWFuYWdlckJhc2ljIiwibWFwRGF0YSIsImRvY0RhdGEiLCJkaXN0cmliRGF0YSIsInRyZW5kRGF0YSIsInNlYXJjaERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQ0EsU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEJDLFFBQTVCLEVBQXNDQyxLQUF0QyxFQUE0RDtFQUFBLE1BQWZDLFNB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LEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ25ILElBQUksSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztFQUMzQixRQUFRLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQ3pCLFFBQVEsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNO0VBQ2xDLFFBQVEsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDL0UsUUFBUSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU07RUFDaEMsUUFBUSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQztFQUNyRCxRQUFRLFdBQVcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDO0VBQ3ZELFFBQVEsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRDtFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZFO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRTtFQUNwRSxNQUFNLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtFQUNyQyxRQUFRLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNsQyxRQUFRLE9BQU8sRUFBRSxJQUFJLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7RUFDL0QsUUFBUSxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUM7RUFDdEMsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQSxFQUFFLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDMUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztFQUN4QixFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0VBQ3RCLEVBQUUsT0FBTyxNQUFNLENBQUM7RUFDaEI7O0VDakhlLHVCQUFRLEdBQUc7RUFDMUIsRUFBRSxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQzlFOztFQ0xlLHVCQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7RUFDbkQsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzlELEVBQUUsS0FBSyxHQUFHLE9BQU8sT0FBTyxLQUFLLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUM7RUFDdEYsRUFBRSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNsRCxFQUFFLElBQUksTUFBTSxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdkQsRUFBRSxPQUFPLEtBQUssSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUM7RUFDaEU7O0VDSmUsd0JBQVEsQ0FBQyxTQUFTLEVBQUU7RUFDbkMsRUFBRSxJQUFJLEVBQUUsU0FBUyxZQUFZLFNBQVMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDMUU7RUFDQSxFQUFFLEtBQUssSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUMzSyxJQUFJLEtBQUssSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3JJLE1BQU0sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJ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QUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ3hHLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7RUFDaEMsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7RUFDbkcsR0FBRyxDQUFDLENBQUM7RUFDTDs7RUNiQSxTQUFTLE1BQU0sR0FBRztFQUNsQixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDL0IsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3ZDLENBQUM7QUFDRDtFQUNlLHlCQUFRLEdBQUc7RUFDMUIsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDM0I7O0VDUEEsU0FBUyxzQkFBc0IsR0FBRztFQUNsQyxFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDOUQsRUFBRSxPQUFPLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDO0VBQ3ZFLENBQUM7QUFDRDtFQUNBLFNBQVMsbUJBQW1CLEdBQUc7RUFDL0IsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0VBQzdELEVBQUUsT0FBTyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQztFQUN2RSxDQUFDO0FBQ0Q7RUFDZSx3QkFBUSxDQUFD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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JELENBQUM7QUFDRDtFQUNBLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtFQUNwQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUU7RUFDN0IsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNwRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdCLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNILEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQy9ELENBQUM7QUFDRDtFQUNBLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0VBQzFCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwRCxDQUFDO0FBQ0Q7RUFDZSxT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LElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RTtFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQztFQUNBO0VBQ0EsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM5QztFQUNBO0VBQ0EsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RDtFQUNBO0VBQ0EsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7RUFDcEIsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDO0VBQzdDLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNqQyxRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtFQUN0QixVQUFVLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEtBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7RUFDckUsVUFBVSxJQUFJLEdBQUdBLEtBQUcsR0FBRyxDQUFDLElBQUlBLEtBQUcsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDL0UsVUFBVSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNwRCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0VBQ3RDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7RUFDbkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNsRCxTQUFTLE1BQU07RUFDZixVQUFVLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUVBLEtBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDcEUsVUFBVSxJQUFJLEdBQUdBLEtBQUcsR0FBRyxDQUFDLElBQUlBLEtBQUcsS0FBSyxDQUFDLEdBQUdDLE1BQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUdBLE1BQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNqRixVQUFVLElBQUksR0FBR0MsR0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNyRCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0VBQ25DLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJ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QUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztFQUMvRSxDQUFDO0FBQ0Q7RUFDQSxTQUFTLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtFQUNwQyxFQUFFLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDaEQsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3hELENBQUM7QUFDRDtFQUNBLFNBQVMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7RUFDeEMsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2hELEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3BELENBQUM7QUFDRDtFQUNBLFNBQVMsZUFBZSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZDLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztF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
