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

  exports.PageManager = PageManager;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9waWNNYXBJbnRlcmZhY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL3BhZ2VNYW5hZ2VyL3BhZ2VDb250cm9scy5qcyIsIi4uLy4uL3NyYy9zY3JpcHRzL21vZGVsL3BhZ2VNYW5hZ2VyL3BhZ2VQYW5lbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY3JlYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2FycmF5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbWF0Y2hlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZHJlbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9maWx0ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY29uc3RhbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2pvaW4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc29ydC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lYWNoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3R5bGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi90ZXh0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbG93ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9yZW1vdmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCIuLi8uLi9zcmMvc2NyaXB0cy9tb2RlbC9wYWdlTWFuYWdlci9QYWdlTWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmZ1bmN0aW9uIGdldENvbnRyb2xzKG5DdHJsLCBjb2xTaXplcywgYWxpZ24sIGRhc2hib2FyZD10cnVlKXtcblxuICAgIGxldCBzdW0gPSAoYSxiKT0+YStiO1xuICAgIC8vIHNldCBkZWZhdWx0IGNvbHVtbiBzaXplcyBpZiBubyBkZWZpbmVkXG4gICAgaWYoY29sU2l6ZXMubGVuZ3RoID09IDApe1xuICAgICAgICBmb3IobGV0IGk9MDtpPG5DdHJsO2krKyl7Y29sU2l6ZXMucHVzaCgzKTt9XG4gICAgfVxuICAgIC8vIGdldCB0b3RhbCBudW1iZXIgb2YgY29sdW1ucyBuZWVkZWQgYW5kIGVzdGltYXRlIGF2YWlsYWJsZSBncmlkIChkYXNoYm9hcmQ6WzEyLDFdLCBjb2x1bW46WzYsMl0pXG4gICAgbGV0IHN1bUNvbHMgPSBjb2xTaXplcy5yZWR1Y2Uoc3VtLCAwKSxcbiAgICAgICAgbkNvbHMgPSBkYXNoYm9hcmQgPyAxMiA6IDYsXG4gICAgICAgIG5Sb3dzID0gc3VtQ29scyA8PSBuQ29scyA/IDEgOiAyO1xuICAgIC8vIHNldCB1cCBhcmVhIG5hbWVzIGFuZCBjb2x1bW4gc2l6ZXMsIGlmIGN1bXVsIHNpemUgZXhjZWVkIGF2YWlsYWJsZSBjb2x1bW5zLCBhZGQgYSBuZXcgcm93XG4gICAgbGV0IHJvd3MgPSBbXTtcbiAgICBsZXQgY3VtdWxDb2xzID0gMDtcbiAgICBsZXQgcm93ID0ge307XG4gICAgZm9yKGxldCBpPTA7IGk8bkN0cmw7IGkrKyl7XG4gICAgICAgIGlmKGN1bXVsQ29scytjb2xTaXplc1tpXSA+IG5Db2xzKXtcbiAgICAgICAgICAgIHJvd3MucHVzaCh7Li4ucm93fSk7XG4gICAgICAgICAgICByb3cgPSB7fTtcbiAgICAgICAgICAgIGN1bXVsQ29scyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcm93W2Bjb250cm9sJHtpKzF9YF0gPSBbY29sU2l6ZXNbaV0sIDFdO1xuICAgICAgICBjdW11bENvbHMgKz0gY29sU2l6ZXNbaV07XG4gICAgfVxuICAgIHJvd3MucHVzaCh7Li4ucm93fSk7XG4gICAgLy8gY3JlYXRlIHRoZSBhcmVhIHN0cmluZ3MgZm9yIHRoZSBncmlkIHRlbXBsYXRlXG4gICAgbGV0IGFyZWFTdHJpbmdzID0gcm93cy5tYXAocj0+T2JqZWN0LmVudHJpZXMocikubWFwKChbYXJlYSxzaXplXSk9PihhcmVhKycgJykucmVwZWF0KHNpemVbMF0pKSk7XG4gICAgLy8gZm9yIGVhY2ggcm93LCBidWlsZCB0aGUgZ3JpZCB0ZW1wbGF0ZVxuICAgIGxldCB0ZW1wbGF0ZSA9IFtdO1xuICAgIGZvcihsZXQgaT0wOyBpPHJvd3MubGVuZ3RoOyBpKyspe1xuICAgICAgICBsZXQgcm93VGVtcGxhdGUgPSAnJztcbiAgICAgICAgLy8gZ2V0IHJvdyBzaXplIGluIHRvdGFsXG4gICAgICAgIGxldCByb3dMZW5ndGggPSBPYmplY3QudmFsdWVzKHJvd3NbaV0pLm1hcChzPT5zWzBdKS5yZWR1Y2Uoc3VtLCAwKTtcbiAgICAgICAgLy8gZ2V0IHNwYWNlIGxlZnQgaW4gcm93XG4gICAgICAgIGxldCBzcGFjZSA9IG5Db2xzLXJvd0xlbmd0aDtcbiAgICAgICAgbGV0IGEgPSBhbGlnbjtcbiAgICAgICAgaWYoYXJlYVN0cmluZ3NbaV0ubGVuZ3RoID09IDEgJiYgYWxpZ24gPT0gJ2InKXtcbiAgICAgICAgICAgIGEgPSAncic7XG4gICAgICAgIH0gZWxzZSBpZihhcmVhU3RyaW5nc1tpXS5sZW5ndGggPT0gMSAmJiBhbGlnbiA9PSAnYScpIHtcbiAgICAgICAgICAgIGEgPSAnYyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYoYSA9PT0gJ2wnKXtcbiAgICAgICAgICAgIC8vIGxlZnQgYWxpZ246IGpvaW4gYWxsIGFyZWFzIGFuZCBhZGQgc3BhY2VzIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIHJvd1RlbXBsYXRlID0gYXJlYVN0cmluZ3NbaV0uam9pbignJykrJy4gJy5yZXBlYXQoc3BhY2UpO1xuICAgICAgICB9IGVsc2UgaWYoYSA9PT0gJ3InKXtcbiAgICAgICAgICAgIC8vIHJpZ2h0IGFsaWduOiBhZGQgc3BhY2VzIGFuZCBqb2luIGFsbCBhcmVhcyBhZnRlcndhcmRzXG4gICAgICAgICAgICByb3dUZW1wbGF0ZSA9ICcuICcucmVwZWF0KHNwYWNlKSthcmVhU3RyaW5nc1tpXS5qb2luKCcnKTtcbiAgICAgICAgfSBlbHNlIGlmKGEgPT09ICdjJyl7XG4gICAgICAgICAgICAvLyBjZW50cmUgYWxpZ246IGFkZCBoYWxmIHRoZSBzcGFjZXMsIGpvaW4gYWxsIGFyZWFzLCBhZGQgb3RoZXIgaGFsZiBvZiBzcGFjZXMgKyBleHRyYSBpZiBhbnlcbiAgICAgICAgICAgIGxldCBzcGFjZXMgPSBNYXRoLmZsb29yKHNwYWNlLzIpO1xuICAgICAgICAgICAgbGV0IGV4dHJhID0gc3BhY2UlMjtcbiAgICAgICAgICAgIHJvd1RlbXBsYXRlID0gJy4gJy5yZXBlYXQoc3BhY2VzKSthcmVhU3RyaW5nc1tpXS5qb2luKCcnKSsnLiAnLnJlcGVhdChzcGFjZXMpKycuICcucmVwZWF0KGV4dHJhKTtcbiAgICAgICAgfSBlbHNlIGlmKGEgPT09ICdiJyl7XG4gICAgICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIGFsaWduOiBqb2luIGFyZWFzIHN0cmluZ3MgKyBpbiBiZXR3ZWVuIHNwYWNlLCB0aGVuIGFkZCBhbnkgZXh0cmFcbiAgICAgICAgICAgIGxldCBzcGFjZXMgPSBNYXRoLmZsb29yKHNwYWNlLyhhcmVhU3RyaW5nc1tpXS5sZW5ndGgtMSkpO1xuICAgICAgICAgICAgbGV0IGV4dHJhID0gc3BhY2UlKGFyZWFTdHJpbmdzW2ldLmxlbmd0aC0xKTtcbiAgICAgICAgICAgIHJvd1RlbXBsYXRlID0gYXJlYVN0cmluZ3NbaV0uam9pbignLiAnLnJlcGVhdChzcGFjZXMpKSsnLiAnLnJlcGVhdChleHRyYSk7XG4gICAgICAgIH0gZWxzZSBpZihhID09PSAnYScpe1xuICAgICAgICAgICAgLy8gc3BhY2UgYXJvdW5kIGFsaWduOiBzZXQgaW5pdGlhbCBzcGFjZSwgam9pbiBhcmVhcyBzdHJpbmdzICsgaW4gYmV0d2VlbiBzcGFjZSwgYWRkIHJlbWFpbmluZyBzcGFjZSArIGV4dHJhIGlmIGFueVxuICAgICAgICAgICAgbGV0IHNwYWNlcyA9IE1hdGguZmxvb3Ioc3BhY2UvKGFyZWFTdHJpbmdzW2ldLmxlbmd0aCsxKSk7XG4gICAgICAgICAgICBsZXQgZXh0cmEgPSBzcGFjZSUoYXJlYVN0cmluZ3NbaV0ubGVuZ3RoKzEpO1xuICAgICAgICAgICAgcm93VGVtcGxhdGUgPSAnLiAnLnJlcGVhdChzcGFjZXMpK2FyZWFTdHJpbmdzW2ldLmpvaW4oJy4gJy5yZXBlYXQoc3BhY2VzKSkrJy4gJy5yZXBlYXQoc3BhY2VzKSsnLiAnLnJlcGVhdChleHRyYSk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUucHVzaChyb3dUZW1wbGF0ZSk7XG4gICAgfVxuICAgIGxldCBhcmVhcyA9IHt9O1xuICAgIHJvd3MuZm9yRWFjaChyPT57XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHIpLmZvckVhY2goKFthLHNdKT0+e1xuICAgICAgICAgICAgYXJlYXNbYV0gPSBzO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBhcmVhc1snY29udHJvbFQnXSA9IFtuQ29scywgblJvd3NdO1xuICAgIHJldHVybiB7Y3RybEFyZWFzOiBhcmVhcywgY3RybFRlbXBsYXRlOiB0ZW1wbGF0ZS5tYXAocj0+YFwiJHtyfVwiYCkuam9pbignJyl9O1xufVxuXG5mdW5jdGlvbiBjaGVja0FsaWduKGEpe1xuICAgIGxldCB2YWx1ZXMgPSBbJ2EnLCAnYicsICdjJywgJ2wnLCAnciddO1xuICAgIGlmKHZhbHVlcy5pbmNsdWRlcyhhKSl7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb250cm9sIExheW91dCAtIEJhZCBBbGlnbm1lbnQgLSBEZWZhdWx0IHRvIFxcJ2xlZnRcXCcnKTtcbiAgICAgICAgcmV0dXJuICdsJztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrQ29sU2l6ZXMoYyl7XG4gICAgaWYoYy5zb21lKGlzTmFOKSB8fCBjLnNvbWUocz0+cy5sZW5ndGg8MSkpe1xuICAgICAgICBjb25zb2xlLmVycm9yKCdDb250cm9sIExheW91dCAtIEJhZCBDb2x1bW4gU2l6ZScpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGMubWFwKHM9Pk1hdGgubWluKHBhcnNlSW50KHMpLDYpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnRyb2xzLCBkYXNoYm9hcmQ9dHJ1ZSl7XG5cbiAgICBsZXQgW25DdHJsLCAuLi5yZXN0XSA9IGNvbnRyb2xzLnNwbGl0KCctJyk7XG5cbiAgICBpZihpc05hTihuQ3RybCkgfHwgbkN0cmwubGVuZ3RoPDEpe1xuICAgICAgICBjb25zb2xlLmVycm9yKCdDb250cm9sIExheW91dCAtIEJhZCBJbnB1dCcpO1xuICAgICAgICByZXR1cm4ge2NvbnRyb2xzOiBbXSwgY29udHJvbFRlbXBsYXRlOiAnJ307XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbkN0cmwgPSBwYXJzZUludChuQ3RybCk7XG4gICAgICAgIGxldCBzaXplcywgYWxpZ247XG4gICAgICAgIGlmKG5DdHJsID4gcmVzdC5sZW5ndGggfHwgbkN0cmwgPiA0KXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnRyb2wgTGF5b3V0IC0gQmFkIElucHV0Jyk7XG4gICAgICAgICAgICByZXR1cm4ge2NvbnRyb2xzOiBbXSwgY29udHJvbFRlbXBsYXRlOiAnJ307XG4gICAgICAgIH0gZWxzZSBpZihuQ3RybCA9PSByZXN0Lmxlbmd0aCl7XG4gICAgICAgICAgICBzaXplcyA9IGNoZWNrQ29sU2l6ZXMocmVzdCk7XG4gICAgICAgICAgICBhbGlnbiA9ICdsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsaWduID0gY2hlY2tBbGlnbihyZXN0LnBvcCgpKTtcbiAgICAgICAgICAgIHNpemVzID0gY2hlY2tDb2xTaXplcyhyZXN0KS5zbGljZSgwLG5DdHJsKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzaXplcy5yZWR1Y2UoKGEsYik9PmErYiwwKSA+IDEyKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnRyb2wgTGF5b3V0IC0gQmFkIElucHV0Jyk7XG4gICAgICAgICAgICByZXR1cm4ge2NvbnRyb2xzOiBbXSwgY29udHJvbFRlbXBsYXRlOiAnJ307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldENvbnRyb2xzKG5DdHJsLCBzaXplcywgYWxpZ24sIGRhc2hib2FyZCk7XG4gICAgfVxufSIsImZ1bmN0aW9uIGJ1aWxkQ29sQSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWxUIDogWzYsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTsgXG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaEEoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFsxMiwgMTJdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb2xCKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDI0XVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfVwiXCIke3RlbXBsYXRlUGFuZWwyfVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaEJhKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoQmIoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs4LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs0LCAxMl0sXG4gICAgICAgIHBhbmVsVCA6IFsxMiwgMTJdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbEMoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs2LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzYsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbNiwgMjRdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfVwiXCIke3RlbXBsYXRlUGFuZWwyfVwiXCIke3RlbXBsYXRlUGFuZWwzfVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaENhKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbNiwgNl0sXG4gICAgICAgIHBhbmVsMyA6IFs2LCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzEyLCAxMl1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cIlwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwzfVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaENiKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbOCwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsMyA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzEyLCAxMl1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn1cIlwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwzfVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29sRGEoKXtcbiAgICBsZXQgYXJlYXMgPSB7XG4gICAgICAgIHBhbmVsMSA6IFs2LCAxMl0sXG4gICAgICAgIHBhbmVsMiA6IFs2LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzMsIDZdLFxuICAgICAgICBwYW5lbDQgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsVCA6IFs2LCAyNF1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNCA9ICdwYW5lbDQgJy5yZXBlYXQoYXJlYXMucGFuZWw0WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfVwiXCIke3RlbXBsYXRlUGFuZWwyfVwiXCIke3RlbXBsYXRlUGFuZWwzfSR7dGVtcGxhdGVQYW5lbDR9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb2xEYigpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzMsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsNCA6IFs2LCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzYsIDI0XVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9XCJcIiR7dGVtcGxhdGVQYW5lbDJ9JHt0ZW1wbGF0ZVBhbmVsM31cIlwiJHt0ZW1wbGF0ZVBhbmVsNH1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZERhc2hEYSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzYsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsNCA6IFszLCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzEyLCAxMl1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNCA9ICdwYW5lbDQgJy5yZXBlYXQoYXJlYXMucGFuZWw0WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9XCJcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsM30ke3RlbXBsYXRlUGFuZWw0fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaERiKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzYsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn0ke3RlbXBsYXRlUGFuZWwzfVwiXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDR9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb2xFKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNiwgMTJdLFxuICAgICAgICBwYW5lbDIgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzMsIDZdLFxuICAgICAgICBwYW5lbDUgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsVCA6IFs2LCAyNF1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNCA9ICdwYW5lbDQgJy5yZXBlYXQoYXJlYXMucGFuZWw0WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDUgPSAncGFuZWw1ICcucmVwZWF0KGFyZWFzLnBhbmVsNVswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX1cIlwiJHt0ZW1wbGF0ZVBhbmVsMn0ke3RlbXBsYXRlUGFuZWwzfVwiXCIke3RlbXBsYXRlUGFuZWw0fSR7dGVtcGxhdGVQYW5lbDV9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGREYXNoRSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzYsIDEyXSxcbiAgICAgICAgcGFuZWwyIDogWzMsIDZdLFxuICAgICAgICBwYW5lbDMgOiBbMywgNl0sXG4gICAgICAgIHBhbmVsNCA6IFszLCA2XSxcbiAgICAgICAgcGFuZWw1IDogWzMsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNSA9ICdwYW5lbDUgJy5yZXBlYXQoYXJlYXMucGFuZWw1WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9JHt0ZW1wbGF0ZVBhbmVsM31cIlwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWw0fSR7dGVtcGxhdGVQYW5lbDV9XCJgO1xuICAgIHJldHVybiB7cGFuZWxBcmVhczphcmVhcyxwYW5lbFRlbXBsYXRlOnRlbXBsYXRlfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDb2xGYSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzMsIDhdLFxuICAgICAgICBwYW5lbDIgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsMyA6IFszLCA4XSxcbiAgICAgICAgcGFuZWw0IDogWzMsIDhdLFxuICAgICAgICBwYW5lbDUgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsNiA6IFszLCA4XSxcbiAgICAgICAgcGFuZWxUIDogWzYsIDI0XVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNSA9ICdwYW5lbDUgJy5yZXBlYXQoYXJlYXMucGFuZWw1WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDYgPSAncGFuZWw2ICcucmVwZWF0KGFyZWFzLnBhbmVsNlswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfVwiXCIke3RlbXBsYXRlUGFuZWwzfSR7dGVtcGxhdGVQYW5lbDR9XCJcIiR7dGVtcGxhdGVQYW5lbDV9JHt0ZW1wbGF0ZVBhbmVsNn1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZERhc2hGYSgpe1xuICAgIGxldCBhcmVhcyA9IHtcbiAgICAgICAgcGFuZWwxIDogWzQsIDZdLFxuICAgICAgICBwYW5lbDIgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsMyA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWw0IDogWzQsIDZdLFxuICAgICAgICBwYW5lbDUgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsNiA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWxUIDogWzEyLCAxMl1cbiAgICB9O1xuICAgIGxldCB0ZW1wbGF0ZVBhbmVsMSA9ICdwYW5lbDEgJy5yZXBlYXQoYXJlYXMucGFuZWwxWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDIgPSAncGFuZWwyICcucmVwZWF0KGFyZWFzLnBhbmVsMlswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwzID0gJ3BhbmVsMyAnLnJlcGVhdChhcmVhcy5wYW5lbDNbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNCA9ICdwYW5lbDQgJy5yZXBlYXQoYXJlYXMucGFuZWw0WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDUgPSAncGFuZWw1ICcucmVwZWF0KGFyZWFzLnBhbmVsNVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw2ID0gJ3BhbmVsNiAnLnJlcGVhdChhcmVhcy5wYW5lbDZbMF0pO1xuICAgIGxldCB0ZW1wbGF0ZSA9IGBcIiR7dGVtcGxhdGVQYW5lbDF9JHt0ZW1wbGF0ZVBhbmVsMn0ke3RlbXBsYXRlUGFuZWwzfVwiXCIke3RlbXBsYXRlUGFuZWw0fSR7dGVtcGxhdGVQYW5lbDV9JHt0ZW1wbGF0ZVBhbmVsNn1cImA7XG4gICAgcmV0dXJuIHtwYW5lbEFyZWFzOmFyZWFzLHBhbmVsVGVtcGxhdGU6dGVtcGxhdGV9O1xufVxuXG5mdW5jdGlvbiBidWlsZENvbEZiKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsMiA6IFszLCA4XSxcbiAgICAgICAgcGFuZWwzIDogWzMsIDhdLFxuICAgICAgICBwYW5lbDQgOiBbMywgOF0sXG4gICAgICAgIHBhbmVsNSA6IFszLCA4XSxcbiAgICAgICAgcGFuZWw2IDogWzMsIDhdLFxuICAgICAgICBwYW5lbFQgOiBbNiwgMjRdXG4gICAgfTtcbiAgICBsZXQgdGVtcGxhdGVQYW5lbDEgPSAncGFuZWwxICcucmVwZWF0KGFyZWFzLnBhbmVsMVswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWwyID0gJ3BhbmVsMiAnLnJlcGVhdChhcmVhcy5wYW5lbDJbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMyA9ICdwYW5lbDMgJy5yZXBlYXQoYXJlYXMucGFuZWwzWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDQgPSAncGFuZWw0ICcucmVwZWF0KGFyZWFzLnBhbmVsNFswXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw1ID0gJ3BhbmVsNSAnLnJlcGVhdChhcmVhcy5wYW5lbDVbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNiA9ICdwYW5lbDYgJy5yZXBlYXQoYXJlYXMucGFuZWw2WzBdKTtcbiAgICBsZXQgdGVtcGxhdGUgPSBgXCIke3RlbXBsYXRlUGFuZWwxfSR7dGVtcGxhdGVQYW5lbDJ9XCJcIiR7dGVtcGxhdGVQYW5lbDN9JHt0ZW1wbGF0ZVBhbmVsNH1cIlwiJHt0ZW1wbGF0ZVBhbmVsNX0ke3RlbXBsYXRlUGFuZWw2fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGFzaEZiKCl7XG4gICAgbGV0IGFyZWFzID0ge1xuICAgICAgICBwYW5lbDEgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsMiA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWwzIDogWzQsIDZdLFxuICAgICAgICBwYW5lbDQgOiBbNCwgNl0sXG4gICAgICAgIHBhbmVsNSA6IFs0LCA2XSxcbiAgICAgICAgcGFuZWw2IDogWzQsIDZdLFxuICAgICAgICBwYW5lbFQgOiBbMTIsIDEyXVxuICAgIH07XG4gICAgbGV0IHRlbXBsYXRlUGFuZWwxID0gJ3BhbmVsMSAnLnJlcGVhdChhcmVhcy5wYW5lbDFbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsMiA9ICdwYW5lbDIgJy5yZXBlYXQoYXJlYXMucGFuZWwyWzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDMgPSAncGFuZWwzICcucmVwZWF0KGFyZWFzLnBhbmVsM1swXSksXG4gICAgICAgIHRlbXBsYXRlUGFuZWw0ID0gJ3BhbmVsNCAnLnJlcGVhdChhcmVhcy5wYW5lbDRbMF0pLFxuICAgICAgICB0ZW1wbGF0ZVBhbmVsNSA9ICdwYW5lbDUgJy5yZXBlYXQoYXJlYXMucGFuZWw1WzBdKSxcbiAgICAgICAgdGVtcGxhdGVQYW5lbDYgPSAncGFuZWw2ICcucmVwZWF0KGFyZWFzLnBhbmVsNlswXSk7XG4gICAgbGV0IHRlbXBsYXRlID0gYFwiJHt0ZW1wbGF0ZVBhbmVsMX0ke3RlbXBsYXRlUGFuZWwyfSR7dGVtcGxhdGVQYW5lbDV9XCJcIiR7dGVtcGxhdGVQYW5lbDN9JHt0ZW1wbGF0ZVBhbmVsNH0ke3RlbXBsYXRlUGFuZWw2fVwiYDtcbiAgICByZXR1cm4ge3BhbmVsQXJlYXM6YXJlYXMscGFuZWxUZW1wbGF0ZTp0ZW1wbGF0ZX07XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYXJlYXMsIHRlbXBsYXRlLCBsYXlvdXQsIGRhc2hib2FyZCA9IHRydWUpe1xuICAgIGlmKGxheW91dC5sZW5ndGggPCAxKXtcbiAgICAgICAgY29uc29sZS5lcnJvcignUGFuZWwgTGF5b3V0IC0gQmFkIElucHV0Jyk7XG4gICAgfVxuICAgIGxldCB7cGFuZWxBcmVhcywgcGFuZWxUZW1wbGF0ZX0gPSBsYXlvdXQgPT09ICdBJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hBKCkgOiBidWlsZENvbEEoKSk6XG4gICAgICAgIGxheW91dCA9PT0gJ0JhJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hCYSgpIDogYnVpbGRDb2xCKCkpIDpcbiAgICAgICAgICAgIGxheW91dCA9PT0gJ0JiJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hCYigpIDogYnVpbGRDb2xCKCkpIDpcbiAgICAgICAgICAgICAgICBsYXlvdXQgPT09ICdDYScgPyAoZGFzaGJvYXJkID8gYnVpbGREYXNoQ2EoKSA6IGJ1aWxkQ29sQygpKSA6XG4gICAgICAgICAgICAgICAgICAgIGxheW91dCA9PT0gJ0NiJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hDYigpIDogYnVpbGRDb2xDKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dCA9PT0gJ0RhJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hEYSgpIDogYnVpbGRDb2xEYSgpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnRGInID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaERiKCkgOiBidWlsZENvbERiKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnRScgPyAoZGFzaGJvYXJkID8gYnVpbGREYXNoRSgpIDogYnVpbGRDb2xFKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dCA9PT0gJ0ZhJyA/IChkYXNoYm9hcmQgPyBidWlsZERhc2hGYSgpIDogYnVpbGRDb2xGYSgpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID09PSAnRmInID8gKGRhc2hib2FyZCA/IGJ1aWxkRGFzaEZiKCkgOiBidWlsZENvbEZiKCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGREYXNoQSgpO1xuICAgIGZvcihsZXRbYXJlYSwgc2l6ZV0gb2YgT2JqZWN0LmVudHJpZXMocGFuZWxBcmVhcykpe1xuICAgICAgICBhcmVhc1thcmVhXSA9IHNpemU7XG4gICAgfVxuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUrcGFuZWxUZW1wbGF0ZTtcbiAgICByZXR1cm4ge2FyZWFzLCB0ZW1wbGF0ZX07XG59IiwiZXhwb3J0IHZhciB4aHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuIiwiaW1wb3J0IG5hbWVzcGFjZXMgZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBwcmVmaXggPSBuYW1lICs9IFwiXCIsIGkgPSBwcmVmaXguaW5kZXhPZihcIjpcIik7XG4gIGlmIChpID49IDAgJiYgKHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSkpICE9PSBcInhtbG5zXCIpIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlc1twcmVmaXhdLCBsb2NhbDogbmFtZX0gOiBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xufVxuIiwiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi9uYW1lc3BhY2UuanNcIjtcbmltcG9ydCB7eGh0bWx9IGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZnVuY3Rpb24gY3JlYXRvckluaGVyaXQobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICByZXR1cm4gdXJpID09PSB4aHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbFxuICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckZpeGVkKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcbiAgcmV0dXJuIChmdWxsbmFtZS5sb2NhbFxuICAgICAgPyBjcmVhdG9yRml4ZWRcbiAgICAgIDogY3JlYXRvckluaGVyaXQpKGZ1bGxuYW1lKTtcbn1cbiIsImZ1bmN0aW9uIG5vbmUoKSB7fVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IG5vbmUgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIFwibGVuZ3RoXCIgaW4geFxuICAgID8geCAvLyBBcnJheSwgVHlwZWRBcnJheSwgTm9kZUxpc3QsIGFycmF5LWxpa2VcbiAgICA6IEFycmF5LmZyb20oeCk7IC8vIE1hcCwgU2V0LCBpdGVyYWJsZSwgc3RyaW5nLCBvciBhbnl0aGluZyBlbHNlXG59XG4iLCJmdW5jdGlvbiBlbXB0eSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IGVtcHR5IDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH07XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi4vYXJyYXkuanNcIjtcbmltcG9ydCBzZWxlY3RvckFsbCBmcm9tIFwiLi4vc2VsZWN0b3JBbGwuanNcIjtcblxuZnVuY3Rpb24gYXJyYXlBbGwoc2VsZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JvdXAgPSBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZ3JvdXAgPT0gbnVsbCA/IFtdIDogYXJyYXkoZ3JvdXApO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgPT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gYXJyYXlBbGwoc2VsZWN0KTtcbiAgZWxzZSBzZWxlY3QgPSBzZWxlY3RvckFsbChzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IFtdLCBwYXJlbnRzID0gW10sIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSk7XG4gICAgICAgIHBhcmVudHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHBhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRNYXRjaGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbiIsImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmluZCA9IEFycmF5LnByb3RvdHlwZS5maW5kO1xuXG5mdW5jdGlvbiBjaGlsZEZpbmQobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaW5kLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjaGlsZEZpcnN0KCkge1xuICByZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRDaGlsZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KG1hdGNoID09IG51bGwgPyBjaGlsZEZpcnN0XG4gICAgICA6IGNoaWxkRmluZCh0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaWx0ZXIgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyO1xuXG5mdW5jdGlvbiBjaGlsZHJlbigpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuRmlsdGVyKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3RBbGwobWF0Y2ggPT0gbnVsbCA/IGNoaWxkcmVuXG4gICAgICA6IGNoaWxkcmVuRmlsdGVyKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBtYXRjaGVyIGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIGlmICh0eXBlb2YgbWF0Y2ggIT09IFwiZnVuY3Rpb25cIikgbWF0Y2ggPSBtYXRjaGVyKG1hdGNoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gW10sIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgbWF0Y2guY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXBkYXRlKSB7XG4gIHJldHVybiBuZXcgQXJyYXkodXBkYXRlLmxlbmd0aCk7XG59XG4iLCJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9lbnRlciB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgdGhpcy5fbmV4dCA9IG51bGw7XG4gIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xufVxuXG5FbnRlck5vZGUucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRW50ZXJOb2RlLFxuICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgfSxcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTsgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQge0VudGVyTm9kZX0gZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi4vYXJyYXkuanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9u4oCZdCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgTWFwLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpLFxuICAgICAga2V5VmFsdWU7XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIG5vZGUuXG4gIC8vIElmIG11bHRpcGxlIG5vZGVzIGhhdmUgdGhlIHNhbWUga2V5LCB0aGUgZHVwbGljYXRlcyBhcmUgYWRkZWQgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSArIFwiXCI7XG4gICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIGRhdHVtLlxuICAvLyBJZiB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LCBqb2luIGFuZCBhZGQgaXQgdG8gdXBkYXRlLlxuICAvLyBJZiB0aGVyZSBpcyBub3QgKG9yIHRoZSBrZXkgaXMgYSBkdXBsaWNhdGUpLCBhZGQgaXQgdG8gZW50ZXIuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKHBhcmVudCwgZGF0YVtpXSwgaSwgZGF0YSkgKyBcIlwiO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgbm9kZUJ5S2V5VmFsdWUuZGVsZXRlKGtleVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGFueSByZW1haW5pbmcgbm9kZXMgdGhhdCB3ZXJlIG5vdCBib3VuZCB0byBkYXRhIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSA9PT0gbm9kZSkpIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkYXR1bShub2RlKSB7XG4gIHJldHVybiBub2RlLl9fZGF0YV9fO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIEFycmF5LmZyb20odGhpcywgZGF0dW0pO1xuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IGFycmF5KHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSksXG4gICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgZW50ZXJHcm91cCA9IGVudGVyW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICB1cGRhdGVHcm91cCA9IHVwZGF0ZVtqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgZXhpdEdyb3VwID0gZXhpdFtqXSA9IG5ldyBBcnJheShncm91cExlbmd0aCk7XG5cbiAgICBiaW5kKHBhcmVudCwgZ3JvdXAsIGVudGVyR3JvdXAsIHVwZGF0ZUdyb3VwLCBleGl0R3JvdXAsIGRhdGEsIGtleSk7XG5cbiAgICAvLyBOb3cgY29ubmVjdCB0aGUgZW50ZXIgbm9kZXMgdG8gdGhlaXIgZm9sbG93aW5nIHVwZGF0ZSBub2RlLCBzdWNoIHRoYXRcbiAgICAvLyBhcHBlbmRDaGlsZCBjYW4gaW5zZXJ0IHRoZSBtYXRlcmlhbGl6ZWQgZW50ZXIgbm9kZSBiZWZvcmUgdGhpcyBub2RlLFxuICAgIC8vIHJhdGhlciB0aGFuIGF0IHRoZSBlbmQgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgIGZvciAodmFyIGkwID0gMCwgaTEgPSAwLCBwcmV2aW91cywgbmV4dDsgaTAgPCBkYXRhTGVuZ3RoOyArK2kwKSB7XG4gICAgICBpZiAocHJldmlvdXMgPSBlbnRlckdyb3VwW2kwXSkge1xuICAgICAgICBpZiAoaTAgPj0gaTEpIGkxID0gaTAgKyAxO1xuICAgICAgICB3aGlsZSAoIShuZXh0ID0gdXBkYXRlR3JvdXBbaTFdKSAmJiArK2kxIDwgZGF0YUxlbmd0aCk7XG4gICAgICAgIHByZXZpb3VzLl9uZXh0ID0gbmV4dCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSA9IG5ldyBTZWxlY3Rpb24odXBkYXRlLCBwYXJlbnRzKTtcbiAgdXBkYXRlLl9lbnRlciA9IGVudGVyO1xuICB1cGRhdGUuX2V4aXQgPSBleGl0O1xuICByZXR1cm4gdXBkYXRlO1xufVxuIiwiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZXhpdCB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob25lbnRlciwgb251cGRhdGUsIG9uZXhpdCkge1xuICB2YXIgZW50ZXIgPSB0aGlzLmVudGVyKCksIHVwZGF0ZSA9IHRoaXMsIGV4aXQgPSB0aGlzLmV4aXQoKTtcbiAgZW50ZXIgPSB0eXBlb2Ygb25lbnRlciA9PT0gXCJmdW5jdGlvblwiID8gb25lbnRlcihlbnRlcikgOiBlbnRlci5hcHBlbmQob25lbnRlciArIFwiXCIpO1xuICBpZiAob251cGRhdGUgIT0gbnVsbCkgdXBkYXRlID0gb251cGRhdGUodXBkYXRlKTtcbiAgaWYgKG9uZXhpdCA9PSBudWxsKSBleGl0LnJlbW92ZSgpOyBlbHNlIG9uZXhpdChleGl0KTtcbiAgcmV0dXJuIGVudGVyICYmIHVwZGF0ZSA/IGVudGVyLm1lcmdlKHVwZGF0ZSkub3JkZXIoKSA6IHVwZGF0ZTtcbn1cbiIsImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rpb24pIHtcbiAgaWYgKCEoc2VsZWN0aW9uIGluc3RhbmNlb2YgU2VsZWN0aW9uKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBtZXJnZVwiKTtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBub2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5leHQpIF4gNCkgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoIWNvbXBhcmUpIGNvbXBhcmUgPSBhc2NlbmRpbmc7XG5cbiAgZnVuY3Rpb24gY29tcGFyZU5vZGUoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJlKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHNvcnRncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHNvcnRncm91cCA9IHNvcnRncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNvcnRncm91cFtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRncm91cC5zb3J0KGNvbXBhcmVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHNvcnRncm91cHMsIHRoaXMuX3BhcmVudHMpLm9yZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgbGV0IHNpemUgPSAwO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcykgKytzaXplOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiBzaXplO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5ub2RlKCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4uL25hbWVzcGFjZS5qc1wiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgfHwgbm9kZS5kZWZhdWx0VmlldzsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG59XG4iLCJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gc3R5bGVSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgPyBzdHlsZUZ1bmN0aW9uXG4gICAgICAgICAgICA6IHN0eWxlQ29uc3RhbnQpKG5hbWUsIHZhbHVlLCBwcmlvcml0eSA9PSBudWxsID8gXCJcIiA6IHByaW9yaXR5KSlcbiAgICAgIDogc3R5bGVWYWx1ZSh0aGlzLm5vZGUoKSwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZVZhbHVlKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKVxuICAgICAgfHwgZGVmYXVsdFZpZXcobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuIiwiZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG4iLCJmdW5jdGlvbiBjbGFzc0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzTGlzdChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTGlzdCB8fCBuZXcgQ2xhc3NMaXN0KG5vZGUpO1xufVxuXG5mdW5jdGlvbiBDbGFzc0xpc3Qobm9kZSkge1xuICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgdGhpcy5fbmFtZXMgPSBjbGFzc0FycmF5KG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIik7XG59XG5cbkNsYXNzTGlzdC5wcm90b3R5cGUgPSB7XG4gIGFkZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnB1c2gobmFtZSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5zcGxpY2UoaSwgMSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSkgPj0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY2xhc3NlZEFkZChub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5hZGQobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkUmVtb3ZlKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LnJlbW92ZShuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRUcnVlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkQWRkKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZhbHNlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkUmVtb3ZlKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKG5hbWVzLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgKHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPyBjbGFzc2VkQWRkIDogY2xhc3NlZFJlbW92ZSkodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgbmFtZXMgPSBjbGFzc0FycmF5KG5hbWUgKyBcIlwiKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbGlzdCA9IGNsYXNzTGlzdCh0aGlzLm5vZGUoKSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFsaXN0LmNvbnRhaW5zKG5hbWVzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uIDogdmFsdWVcbiAgICAgID8gY2xhc3NlZFRydWVcbiAgICAgIDogY2xhc3NlZEZhbHNlKShuYW1lcywgdmFsdWUpKTtcbn1cbiIsImZ1bmN0aW9uIHRleHRSZW1vdmUoKSB7XG4gIHRoaXMudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gdGV4dFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdGV4dEZ1bmN0aW9uXG4gICAgICAgICAgOiB0ZXh0Q29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59XG4iLCJmdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cbiIsImZ1bmN0aW9uIHJhaXNlKCkge1xuICBpZiAodGhpcy5uZXh0U2libGluZykgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyYWlzZSk7XG59XG4iLCJmdW5jdGlvbiBsb3dlcigpIHtcbiAgaWYgKHRoaXMucHJldmlvdXNTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIHRoaXMucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuIiwiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn1cbiIsImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmZ1bmN0aW9uIGNvbnN0YW50TnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpLFxuICAgICAgc2VsZWN0ID0gYmVmb3JlID09IG51bGwgPyBjb25zdGFudE51bGwgOiB0eXBlb2YgYmVmb3JlID09PSBcImZ1bmN0aW9uXCIgPyBiZWZvcmUgOiBzZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCJmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cbiIsImZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZVNoYWxsb3coKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKGZhbHNlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lRGVlcCgpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZXApIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGRlZXAgPyBzZWxlY3Rpb25fY2xvbmVEZWVwIDogc2VsZWN0aW9uX2Nsb25lU2hhbGxvdyk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufVxuIiwiZnVuY3Rpb24gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQsIHRoaXMuX19kYXRhX18pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gY29udGV4dExpc3RlbmVyKHZhbHVlKTtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAoKG8gPSBvbltqXSkudHlwZSA9PT0gdHlwZW5hbWUudHlwZSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciA9IGxpc3RlbmVyLCBvLm9wdGlvbnMgPSBvcHRpb25zKTtcbiAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlbmFtZS50eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgbyA9IHt0eXBlOiB0eXBlbmFtZS50eXBlLCBuYW1lOiB0eXBlbmFtZS5uYW1lLCB2YWx1ZTogdmFsdWUsIGxpc3RlbmVyOiBsaXN0ZW5lciwgb3B0aW9uczogb3B0aW9uc307XG4gICAgaWYgKCFvbikgdGhpcy5fX29uID0gW29dO1xuICAgIGVsc2Ugb24ucHVzaChvKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB0aGlzLmVhY2gob24odHlwZW5hbWVzW2ldLCB2YWx1ZSwgb3B0aW9ucykpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gIGlmICh0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZGlzcGF0Y2hGdW5jdGlvblxuICAgICAgOiBkaXNwYXRjaENvbnN0YW50KSh0eXBlLCBwYXJhbXMpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKigpIHtcbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHlpZWxkIG5vZGU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgc2VsZWN0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3QuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCBmcm9tIFwiLi9zZWxlY3RDaGlsZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbiBmcm9tIFwiLi9zZWxlY3RDaGlsZHJlbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdGEgZnJvbSBcIi4vZGF0YS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbnRlciBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9leGl0IGZyb20gXCIuL2V4aXQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fam9pbiBmcm9tIFwiLi9qb2luLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29yZGVyIGZyb20gXCIuL29yZGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NvcnQgZnJvbSBcIi4vc29ydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jYWxsIGZyb20gXCIuL2NhbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZXMgZnJvbSBcIi4vbm9kZXMuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZSBmcm9tIFwiLi9ub2RlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbXB0eSBmcm9tIFwiLi9lbXB0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lYWNoIGZyb20gXCIuL2VhY2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXR0ciBmcm9tIFwiLi9hdHRyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3Byb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NsYXNzZWQgZnJvbSBcIi4vY2xhc3NlZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl90ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faHRtbCBmcm9tIFwiLi9odG1sLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JhaXNlIGZyb20gXCIuL3JhaXNlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2xvd2VyIGZyb20gXCIuL2xvd2VyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2FwcGVuZCBmcm9tIFwiLi9hcHBlbmQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faW5zZXJ0IGZyb20gXCIuL2luc2VydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Nsb25lIGZyb20gXCIuL2Nsb25lLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdHVtIGZyb20gXCIuL2RhdHVtLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29uIGZyb20gXCIuL29uLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Rpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2l0ZXJhdG9yIGZyb20gXCIuL2l0ZXJhdG9yLmpzXCI7XG5cbmV4cG9ydCB2YXIgcm9vdCA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdGlvbihncm91cHMsIHBhcmVudHMpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF1dLCByb290KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3NlbGVjdGlvbigpIHtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgc2VsZWN0Q2hpbGQ6IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCxcbiAgc2VsZWN0Q2hpbGRyZW46IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbixcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIGpvaW46IHNlbGVjdGlvbl9qb2luLFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBzZWxlY3Rpb246IHNlbGVjdGlvbl9zZWxlY3Rpb24sXG4gIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzc2VkLFxuICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gIHJhaXNlOiBzZWxlY3Rpb25fcmFpc2UsXG4gIGxvd2VyOiBzZWxlY3Rpb25fbG93ZXIsXG4gIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgaW5zZXJ0OiBzZWxlY3Rpb25faW5zZXJ0LFxuICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gIGNsb25lOiBzZWxlY3Rpb25fY2xvbmUsXG4gIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gIG9uOiBzZWxlY3Rpb25fb24sXG4gIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2gsXG4gIFtTeW1ib2wuaXRlcmF0b3JdOiBzZWxlY3Rpb25faXRlcmF0b3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbGVjdGlvbjtcbiIsImltcG9ydCB7U2VsZWN0aW9uLCByb290fSBmcm9tIFwiLi9zZWxlY3Rpb24vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcildXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW1tzZWxlY3Rvcl1dLCByb290KTtcbn1cbiIsIlxuaW1wb3J0IENvbnRyb2xzIGZyb20gJy4vcGFnZUNvbnRyb2xzLmpzJztcbmltcG9ydCBQYW5lbHMgZnJvbSAnLi9wYWdlUGFuZWxzLmpzJztcbmltcG9ydCB7c2VsZWN0IGFzIEQzU2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb250YWluZXI9J2JvZHknLCBsYXlvdXQ9J0EnLCBjb250cm9scz0nJyxcbiAgICBoZWFkZXI9JycsIGZvb3Rlcj0nJywgbWluV2lkdGg9NjAwLCBtaW5IZWlnaHQ9NjAwKXtcblxuICAgIC8vIE1hcmdpbiBjb25zdGFudHNcbiAgICBjb25zdCBoZWlnaHRNYXJnaW4gPSAyMCwgLy8gc2FwY2UgdG8gcmVtb3ZlIHdoZW4gY29tcHV0aW5nIHRoZSBhdmFpbGFibGUgaGVpZ2h0XG4gICAgICAgIHdpZHRoTWFyZ2luID0gMjAwLCAvLyBzYXBjZSB0byByZW1vdmUgd2hlbiBjb21wdXRpbmcgdGhlIGF2YWlsYWJsZSB3aWR0aFxuICAgICAgICBwYW5lbE1hcmdpbiA9IDUsIC8vIHNwYWNlIGJldHdlZW4gcGFuZWxzXG4gICAgICAgIGNvbnRyb2xNYXJnaW4gPSA1OyAvLyBzcGFjZSB0byBwdXQgYmVsb3cgY29udHJvbHNcblxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBhdmFpbGFibGUgaGVpZ2h0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG90YWxIZWlnaHQoYmFzZUgpe1xuICAgICAgICBsZXQgaGVhZEggPSAoaGVhZGVyPT09JycpID8gMCA6IEQzU2VsZWN0KGhlYWRlcikubm9kZSgpLm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgIGZvb3RIID0gKGZvb3Rlcj09PScnKSA/IDAgOiBEM1NlbGVjdChmb290ZXIpLm5vZGUoKS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHJldHVybiBiYXNlSCAtIGhlYWRIIC0gZm9vdEggLSBoZWlnaHRNYXJnaW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGF2YWlsYWJsZSB3aWR0aFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRvdGFsdFdpZHRoKGJhc2VXKXtcbiAgICAgICAgcmV0dXJuIGJhc2VXLXdpZHRoTWFyZ2luO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpemVzIGNvbnRhaW5lciBhbmQgYXBwbGllcyBncmRpIGxheW91dFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEdyaWQodywgaCwgYywgdCl7XG4gICAgICAgIHJldHVybiBEM1NlbGVjdChjKVxuICAgICAgICAgICAgLnN0eWxlKCd3aWR0aCcsIHcrJ3B4JylcbiAgICAgICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgaCsncHgnKVxuICAgICAgICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ2dyaWQnKVxuICAgICAgICAgICAgLnN0eWxlKCdncmlkLXRlbXBsYXRlLWFyZWFzJywgdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgc2l6ZXMgdGhlIGNvbnRhaW5lciBmb3IgZWFjaCBjb250cm9sIGFuZCBwYW5lbHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTaXplcyh3aWR0aCwgaGVpZ2h0LCBhcmVhcywgZ3JpZCl7XG4gICAgICAgIGxldCBzaXplcyA9IHt9O1xuICAgICAgICAvLyBmb3IgZXZlcnkgYXJlYXMgKGV4Y2x1ZGluZyB0aGUgdG90YWxzKVxuICAgICAgICBmb3IobGV0IGFyZWEgb2YgT2JqZWN0LmtleXMoYXJlYXMpKXtcbiAgICAgICAgICAgIGlmKGFyZWEgIT09ICd0b3RhbCcgJiYgIWFyZWEuZW5kc1dpdGgoJ1QnKSl7XG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB0aGUgc2l6ZVxuICAgICAgICAgICAgICAgIGxldCBoID0gTWF0aC5mbG9vcigoaGVpZ2h0KmFyZWFzW2FyZWFdWzFdL2FyZWFzWyd0b3RhbCddWzFdKS0ocGFuZWxNYXJnaW4qMikpLFxuICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5mbG9vcigod2lkdGgqYXJlYXNbYXJlYV1bMF0vYXJlYXNbJ3RvdGFsJ11bMF0pLShwYW5lbE1hcmdpbioyKSk7XG4gICAgICAgICAgICAgICAgLy8gZ2VuZXJhdGUgYSBjb250YWluZXJcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGBkaXYjJHthcmVhfWA7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBncmlkLnNlbGVjdChjKTtcbiAgICAgICAgICAgICAgICBpZihzLmVtcHR5KCkpe1xuICAgICAgICAgICAgICAgICAgICBzID0gZ3JpZC5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignaWQnLCBhcmVhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGdyaWQgYXJlYSB0byBjb250YWluZXIgYW5kIHNpemUgaXRcbiAgICAgICAgICAgICAgICBzLnN0eWxlKCdncmlkLWFyZWEnLCBhcmVhKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsIGgrJ3B4JylcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdtYXJnaW4nLCBwYW5lbE1hcmdpbisncHgnKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ21hcmdpbi1ib3R0b20nLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAkeyhhcmVhLmluY2x1ZGVzKCdjb250cm9sJykpID8gY29udHJvbE1hcmdpbitwYW5lbE1hcmdpbiA6IHBhbmVsTWFyZ2lufXB4YDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdGhlIGNvbnRhaW5lciBhbmQgaXRzIHNpemVcbiAgICAgICAgICAgICAgICBzaXplc1thcmVhXSA9IHtjLHcsaH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpemVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1aWxkUGFnZSgpe1xuICAgICAgICAvLyBnZXQgdGhlIGJhc2UgZGltZW5zaW9uIGZvciB0aGUgcGFnZVxuICAgICAgICBjb25zdCBiYXNlSCA9IE1hdGgubWF4KHdpbmRvdy5pbm5lckhlaWdodCwgbWluSGVpZ2h0KSxcbiAgICAgICAgICAgIGJhc2VXID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgsIG1pbldpZHRoKTtcbiAgICAgICAgLy8gZXN0aW1hdGUgdGhlIGF2YWlsYWJsZSBzcGFjZVxuICAgICAgICBsZXQgdG90YWxIID0gZ2V0VG90YWxIZWlnaHQoYmFzZUgpLFxuICAgICAgICAgICAgdG90YWxXID0gZ2V0VG90YWx0V2lkdGgoYmFzZVcpO1xuICAgICAgICAvLyBjaGVjayBpZiBuZWVkcyB0byBiZSBpbiBjb2x1bW4gb3IgZGFzaGJvYXJkIGZvcm1hdFxuICAgICAgICBsZXQgZGFzaGJvYXJkID0gdG90YWxXKjIvMyA+PSB0b3RhbEg7XG4gICAgICAgIC8vIGFkanVzdCBhdmFpbGFibGUgaGVpZ2h0IGlmIGNvbHVtbiBmb3JtYXRcbiAgICAgICAgaWYoIWRhc2hib2FyZCAmJiBsYXlvdXQhPT0nQScpe1xuICAgICAgICAgICAgdG90YWxIICo9IDI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSB0aGUgY29udHJvbHMgYXJlYXMgYW5kIHRlbXBsYXRlXG4gICAgICAgIGxldCB7Y3RybEFyZWFzLCBjdHJsVGVtcGxhdGV9ID0gKGNvbnRyb2xzIT09JycpID8gQ29udHJvbHMoY29udHJvbHMsIGRhc2hib2FyZCkgOiB7Y3RybEFyZWFzOntjb250cm9sVDpbMCwwXX0sIGN0cmxUZW1wbGF0ZTonJ307XG4gICAgICAgIC8vIGNvbXBsZXRlIHdpdGggcGFuZWxzIGFyZWFzIGFuZCB0ZW1wbGF0ZVxuICAgICAgICBsZXQge2FyZWFzLCB0ZW1wbGF0ZX0gPSBQYW5lbHMoY3RybEFyZWFzLCBjdHJsVGVtcGxhdGUsIGxheW91dCwgZGFzaGJvYXJkKTtcbiAgICAgICAgLy8gZ2V0IHRvdGFsIGFyZWEgc2l6ZVxuICAgICAgICBhcmVhc1sndG90YWwnXSA9IFtkYXNoYm9hcmQ/MTI6NiwgYXJlYXMuY29udHJvbFRbMV0rYXJlYXMucGFuZWxUWzFdXTtcbiAgICAgICAgLy8gc2l6ZSBjb250YWluZXIgYW5kIGFwcGx5IGdyaWQgbGF5b3V0XG4gICAgICAgIGxldCBncmlkID0gZ2V0R3JpZCh0b3RhbFcsIHRvdGFsSCwgY29udGFpbmVyLCB0ZW1wbGF0ZSk7XG4gICAgICAgIC8vIGdlbmVyYXRlIGdyaWQgYXJlYXMsIHNpemUgdGhlbSwgYW5kIHJldHVyblxuICAgICAgICByZXR1cm4gIGdldFNpemVzKHRvdGFsVywgdG90YWxILCBhcmVhcywgZ3JpZCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBjb250cm9scyBhbmQgcGFuZWxzXG4gICAgbGV0IHNpemVzID0gYnVpbGRQYWdlKCk7XG5cbiAgICAvLyB3YXRjaCBmdW5jdGlvbiB0byBhdXRvLXJlc2l6ZSBtb2R1bGVzXG4gICAgc2l6ZXMud2F0Y2ggPSBmdW5jdGlvbihtb2R1bGVzKXtcbiAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKCk9PntcbiAgICAgICAgICAgIGxldCBzID0gYnVpbGRQYWdlKCk7XG4gICAgICAgICAgICBmb3IobGV0IFthcmVhLCBtb2R1bGVdIG9mIE9iamVjdC5lbnRyaWVzKG1vZHVsZXMpKXtcbiAgICAgICAgICAgICAgICBpZignc2V0U2l6ZScgaW4gbW9kdWxlKXtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLnNldFNpemUoc1thcmVhXS53aWR0aCwgc1thcmVhXS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FyZWF9IG1pc3Npbmcgc2V0U2l6ZSgpYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gc2l6ZXM7XG59Il0sIm5hbWVzIjpbImdldENvbnRyb2xzIiwibkN0cmwiLCJjb2xTaXplcyIsImFsaWduIiwiZGFzaGJvYXJkIiwic3VtIiwiYSIsImIiLCJsZW5ndGgiLCJpIiwicHVzaCIsInN1bUNvbHMiLCJyZWR1Y2UiLCJuQ29scyIsIm5Sb3dzIiwicm93cyIsImN1bXVsQ29scyIsInJvdyIsImFyZWFTdHJpbmdzIiwibWFwIiwiciIsIk9iamVjdCIsImVudHJpZXMiLCJhcmVhIiwic2l6ZSIsInJlcGVhdCIsInRlbXBsYXRlIiwicm93VGVtcGxhdGUiLCJyb3dMZW5ndGgiLCJ2YWx1ZXMiLCJzIiwic3BhY2UiLCJqb2luIiwic3BhY2VzIiwiTWF0aCIsImZsb29yIiwiZXh0cmEiLCJhcmVhcyIsImZvckVhY2giLCJjdHJsQXJlYXMiLCJjdHJsVGVtcGxhdGUiLCJjaGVja0FsaWduIiwiaW5jbHVkZXMiLCJjb25zb2xlIiwibG9nIiwiY2hlY2tDb2xTaXplcyIsImMiLCJzb21lIiwiaXNOYU4iLCJlcnJvciIsIm1pbiIsInBhcnNlSW50IiwiY29udHJvbHMiLCJzcGxpdCIsInJlc3QiLCJjb250cm9sVGVtcGxhdGUiLCJzaXplcyIsInBvcCIsInNsaWNlIiwiYnVpbGRDb2xBIiwicGFuZWwxIiwicGFuZWxUIiwidGVtcGxhdGVQYW5lbDEiLCJwYW5lbEFyZWFzIiwicGFuZWxUZW1wbGF0ZSIsImJ1aWxkRGFzaEEiLCJidWlsZENvbEIiLCJwYW5lbDIiLCJ0ZW1wbGF0ZVBhbmVsMiIsImJ1aWxkRGFzaEJhIiwiYnVpbGREYXNoQmIiLCJidWlsZENvbEMiLCJwYW5lbDMiLCJ0ZW1wbGF0ZVBhbmVsMyIsImJ1aWxkRGFzaENhIiwiYnVpbGREYXNoQ2IiLCJidWlsZENvbERhIiwicGFuZWw0IiwidGVtcGxhdGVQYW5lbDQiLCJidWlsZENvbERiIiwiYnVpbGREYXNoRGEiLCJidWlsZERhc2hEYiIsImJ1aWxkQ29sRSIsInBhbmVsNSIsInRlbXBsYXRlUGFuZWw1IiwiYnVpbGREYXNoRSIsImJ1aWxkQ29sRmEiLCJwYW5lbDYiLCJ0ZW1wbGF0ZVBhbmVsNiIsImJ1aWxkRGFzaEZhIiwiYnVpbGRDb2xGYiIsImJ1aWxkRGFzaEZiIiwibGF5b3V0IiwiY29udGFpbmVyIiwiaGVhZGVyIiwiZm9vdGVyIiwibWluV2lkdGgiLCJtaW5IZWlnaHQiLCJoZWlnaHRNYXJnaW4iLCJ3aWR0aE1hcmdpbiIsInBhbmVsTWFyZ2luIiwiY29udHJvbE1hcmdpbiIsImdldFRvdGFsSGVpZ2h0IiwiYmFzZUgiLCJoZWFkSCIsIkQzU2VsZWN0Iiwibm9kZSIsIm9mZnNldEhlaWdodCIsImZvb3RIIiwiZ2V0VG90YWx0V2lkdGgiLCJiYXNlVyIsImdldEdyaWQiLCJ3IiwiaCIsInQiLCJzdHlsZSIsImdldFNpemVzIiwid2lkdGgiLCJoZWlnaHQiLCJncmlkIiwiZW5kc1dpdGgiLCJzZWxlY3QiLCJlbXB0eSIsImFwcGVuZCIsImF0dHIiLCJrZXlzIiwiYnVpbGRQYWdlIiwibWF4Iiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJpbm5lcldpZHRoIiwidG90YWxIIiwidG90YWxXIiwiQ29udHJvbHMiLCJjb250cm9sVCIsIlBhbmVscyIsIndhdGNoIiwibW9kdWxlcyIsIm9ucmVzaXplIiwibW9kdWxlIiwic2V0U2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFDQSxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUE0QkMsUUFBNUIsRUFBc0NDLEtBQXRDLEVBQTREO0VBQUEsTUFBZkMsU0FBZSx1RUFBTCxJQUFLOztFQUV4RCxNQUFJQyxHQUFHLEdBQUcsU0FBTkEsR0FBTSxDQUFDQyxDQUFELEVBQUdDLENBQUg7RUFBQSxXQUFPRCxDQUFDLEdBQUNDLENBQVQ7RUFBQSxHQUFWLENBRndEOzs7RUFJeEQs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QUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUNsRyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDNUgsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtFQUN2RixRQUFRLElBQUksVUFBVSxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7RUFDakUsUUFBUSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBQzlCLE9BQU87RUFDUCxLQUFLO0VBQ0wsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDakQ7O0VDaEJlLGNBQVEsQ0FBQyxDQUFDLEVBQUU7RUFDM0IsRUFBRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxRQUFRLElBQUksQ0FBQztFQUMvQyxNQUFNLENBQUM7RUFDUCxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEI7O0VDSkEsU0FBUyxLQUFLLEdBQUc7RUFDakIsRUFBRSxPQUFPLEVBQUUsQ0FBQztFQUNaLENBQUM7QUFDRDtFQUNlLG9CQUFRLENB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QUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3BDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRTtFQUMxRSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7RUFDckIsS0FBSztFQUNMLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDQSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7RUFDckIsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7RUFDdkIsQ0FBQztBQUNEO0VBQ2UsdUJBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0VBQ3BDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RDtFQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxTQUFTO0VBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRO0VBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUI7RUFDQSxFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0Q7RUFDQSxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDbkgsSUFBSSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQzNCLFFBQVEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDekIsUUFBUSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU07RUFDbEMsUUFBUSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUMvRSxRQUFRLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTTtFQUNoQyxRQUFRLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDO0VBQ3JELFFBQVEsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUM7RUFDdkQsUUFBUSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JEO0VBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkU7RUFDQTtFQUNBO0VBQ0E7RUFDQSxJQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFO0VBQ3BFLE1BQU0sSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0VBQ3JDLFFBQVEsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ2xDLFFBQVEsT0FBTyxFQUFFLElBQUksR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLENB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SUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUMxRCxNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO0VBQy9GLFFBQVEsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDaEUsT0FBTyxNQUFNO0VBQ2IsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDcEIsT0FBTztFQUNQLEtBQUs7RUFDTCxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDM0IsU0FBUyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDMUIsR0FBRyxDQUFDO0VBQ0osQ0FBQztBQUNEO0VBQ0EsU0FBUyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7RUFDekMsRUFBRSxPQUFPLFdBQVc7RUFDcEIsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzdELElBQUksSUFBSSxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtFQUN2RCxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRTtFQUMxRSxRQUFRLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ2hFLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQztFQUNsRixRQUFRLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0VBQ3hCLFFBQVEsT0FBTztFQUNmLE9BQU87RUFDUCxLQUFLO0VBQ0wsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQ3ZHLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0IsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3BCLEdBQUcsQ0FBQztFQUNKLENBQUM7QUFDRDtFQUNlLHFCQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7RUFDbEQsRUFBRSxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDNUU7RUFDQSxFQUFFLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDNUIsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO0VBQzlCLElBQUksSUFBSSxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7RUFDMUQsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0VBQ3pDLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFO0VBQ3JFLFVBQVUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3pCLFNBQVM7RUFDVCxPQUFPO0VBQ1AsS0FBSztFQUNMLElBQUksT0FBTztFQUNYLEdBQUc7QUFDSDtFQUNBLEVBQUUsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO0VBQ2hDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLEVBQUUsT0FBTyxJQUFJLENBQUM7RUFDZDs7RUNoRUEsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7RUFDM0Ms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
