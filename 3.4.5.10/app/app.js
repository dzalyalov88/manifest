/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 67);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var loader = __webpack_require__(13);

  var _Promise = window.Promise;
  var Promise = _Promise;

  if (!Promise) {
    /** @constructor */
    Promise = function Promise(resolver) {
      if (this instanceof Promise) {
        return new _Promise(resolver);
      }
      return _Promise(resolver);
    };

    loader.load('/lib/contrib/es6-promise.auto.min.js', 'Promise', function () {
      _Promise = window.Promise;
      Promise.accept = _Promise['accept'];
      Promise.all = _Promise['all'];
      Promise.defer = _Promise['defer'];
      Promise.race = _Promise['race'];
      Promise.reject = _Promise['reject'];
      Promise.resolve = _Promise['resolve'];
    });
  }

  module.exports = Promise;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  function safeParse(jso) {
    try {
      return JSON.parse(jso);
    } catch (e) {
    }
  }
  
  function errmsg(e) {
    if (typeof(e) === 'undefined') {
      return 'undefined';
    }
    return JSON.stringify(e, Object.getOwnPropertyNames(e));
  }
  
  function stringifyJSON(o) {
    return (typeof(o) === 'undefined' || o instanceof Error) ? errmsg(o) : JSON.stringify(o);
  }
  
  function getProperties(o, properties) {
    var keyvalues = [];
    properties = properties || Object.getOwnPropertyNames(o); 
    for (var i = 0, ilen = properties.length; i < ilen; i++) {
      var property = properties[i]; 
      keyvalues.push(property + ': ' + stringifyProperties(o[property]));
    }
    return keyvalues;
  }
  
  function getValues(a) {
    var values = [];
    for (var i = 0, len = a.length; i < len; i++) {
      var elem = a[i];
      values.push(stringifyProperties(elem));
    }
    return values;
  }

  function stringifyProperties(o, properties) {
    var result;
    var otype = typeof o;
    if (otype === 'number') {
      result = o.toString();
    } else if (otype === 'string') {
      result = '\'' + o.toString() + '\'';
    } else if (otype === 'undefined') {
      result = 'undefined';
    } else if (o === null) {
      result = 'null';
    } else if (o) {
      if (o.constructor === Object) {
        var keyvalues = getProperties(o, properties);
        result = '{' + keyvalues.join(', ') + '}';
      } else if (o.constructor === Array) { 
        var values = getValues(o);
        result = '[' + values.join(', ') + ']';
      } else {
        result = o.toString();
      }
    } else {
      result = '???'; // should never get here...
    }
    return result;
  }
    
  function getArraysDiff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
  }
  
  function getArraysSymmDiff(a, b) {
    var diffAdded = getArraysDiff(a, b);
    var diffRemoved = getArraysDiff(b, a);
    var diff = diffAdded.concat(diffRemoved);
    return diff;
  }
  
  function getArraysUnion(a, b) 
  {
    var r = a.slice(0);
    b.forEach(function(i) { if (r.indexOf(i) < 0) { r.push(i); } });
    return r;
  }
  
  function compareObjects(a, b, properties) {
    var propertyChanges = [];
    var propertyPath = [];
    var compare = function (a, b, properties) {
      var aconstructor = a.constructor;
      if (aconstructor === Object ||
         (aconstructor !== Number && 
          aconstructor !== String &&
          aconstructor !== Date && 
          aconstructor !== RegExp &&
          aconstructor !== Boolean &&
          aconstructor !== Array &&
          aconstructor !== Function)) {
        if (!properties) {
          properties = getArraysUnion(Object.getOwnPropertyNames(a), Object.getOwnPropertyNames(b)); 
        }  
        for (var i = 0, len = properties.length; i < len; i++) {
        // for (var property in a) {
          var property = properties[i]; 
          propertyPath.push(propertyPath.length === 0 ? property : '.' + property);
          if (a[property] && b[property]) {
            if (a[property].constructor !== Function) {
              compare(a[property], b[property]);
            }
          } else if (a[property] !== b[property]) {
            propertyChanges.push({ 'property': propertyPath.join(''), 'a': a[property], 'b': b[property] });
          }
          propertyPath.pop();
        }
      } else if (aconstructor === Array) { // use special comparison for Arrays
        var da = getArraysDiff(a, b);
        var db = getArraysDiff(b, a);
        if (da.length > 0 || db.length > 0) {
          propertyChanges.push({ 'property': propertyPath.join(''), 'a': da, 'b': db });
        }
      } else if (aconstructor !== Function) { // skip comparison for Functions
        if (a !== b) {
          propertyChanges.push({ 'property': propertyPath.join(''), 'a': a, 'b': b });
        }
      }
    };
    compare(a, b, properties);
    return propertyChanges;
  }

  function extractUrlArg(context, item) {
    item = item.split('=');
    var key = item.shift();
    if (key) {
      context[key] = decodeURIComponent(item.join('=')).replace(/\+/g, ' ');
    }
    return context;
  }
  function extractUrlInfo(s, bag) {
    return s.substr(1).split('&').reduce(extractUrlArg, bag);
  }
  
  function updateDescription(odesc, ndesc, id) {
    var re = /(^|\s)=====+[^=]+\[Zang\:[^\]]*\]\s*=====+(\s|$)/im;

    if (ndesc) {
      var pre = '==================================================';
      var pos = '[Zang:' + id + ']\n' + pre;
      ndesc = pre + '\n\n' + ndesc + '\n\n' + pos + '\n';
    }

    var done = false;
    var desc = odesc.replace(re, function () {
      if (!done || !ndesc) {
        done = true;
        return ndesc;
      }
    });

    if (!done && ndesc) {
      desc = odesc + '\n' + ndesc;
    }
    return desc;
  }

  function getObjectInfo(obj, fields) {
    if (typeof(obj) === 'object') {
      return '{ ' + getLogInfo(obj, fields) + ' }';
    }
    return getLogInfo(obj, fields);
  }

  function getLogInfo(obj, fields) {
    if (typeof(obj) === 'string') {
      return '"' + obj + '"';
    }
    if (!obj) {
      return (String(obj));
    }
    if (typeof(obj) === 'function') {
      // return (String(obj));
      return 'function() { ... }';
    }
    if (typeof(obj) === 'object') {
      if (Object.getOwnPropertyNames(obj).length === 0) {
        return '';
      }
      fields = fields || Object.getOwnPropertyNames(obj);
      var res = '';
      for (var i = 0; i < fields.length; i++) {
        var names = fields[i].split('.');
        var val = obj;
        for (var j = 0; j < names.length; j++) {
          val = val[names[j]];
          if (!val) {
            break;
          }
        }
        if (val instanceof Array) {
          var arr = '[ ';
          for (var k = 0; k < val.length; k++) {
            if (k !== 0) {
              arr += ', ';
            }
            arr += getObjectInfo(val[k]);
          }
          arr += ' ]';
          val = arr;
        } else {
          val = getObjectInfo(val);
        }
        if (i !== 0) {
          res += ', ';
        }
        res += fields[i] + ': ' + val;
      }
      return res;
    }
    return '' + obj;
  }

  function prepareLogInfo(point, obj, fields, exclude) {
    // return;
    if (typeof(obj) === 'undefined') {
      return point;
    }
    if (fields && exclude) {
      var ofields = Object.getOwnPropertyNames(obj);
      fields.forEach(function (field) {
        var index = ofields.indexOf(field);
        if (index !== -1) {
          ofields.splice(index, 1);
        }
      });
      fields = ofields;
    }
    var info = point + ': ' + getObjectInfo(obj, fields);
    return info;
  }

  function showLogInfo(point, obj, fields, exclude) {
    var info = prepareLogInfo(point, obj, fields, exclude);
    if (typeof(info) === 'undefined') {
      return;
    }
    console.info(info);
  }

  function mergeConfigs(config1, config2) {
    if (!config1 && !config2) {
      return {};
    }
    if (!config1) {
      return config2;
    }
    if (!config2) {
      return config1;
    }
    var config = {};
    var fields = Object.getOwnPropertyNames(config1);
    for (var i = 0; i < fields.length; i++) {
      config[fields[i]] = config1[fields[i]];
    }
    fields = Object.getOwnPropertyNames(config2);
    for (i = 0; i < fields.length; i++) {
      config[fields[i]] = config2[fields[i]];
    }
    return config;
  }

  var utils = {
    safeParse: safeParse,
    errmsg: errmsg,
    stringifyJSON: stringifyJSON,
    getArraysDiff: getArraysDiff,
    getArraysSymmDiff: getArraysSymmDiff,
    getArraysUnion: getArraysUnion,
    compareObjects : compareObjects,
    stringifyProperties: stringifyProperties,
    extractUrlInfo: extractUrlInfo,
    updateDescription: updateDescription,
    getObjectInfo: getObjectInfo,
    getLogInfo: getLogInfo,
    prepareLogInfo: prepareLogInfo,
    showLogInfo: showLogInfo,
    mergeConfigs: mergeConfigs
  };

  module.exports = utils;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  /** @constructor */
  function Event() {
    this.clear();
  }
  Event.prototype.clear = function () {
    this._handlers = [];
    return this;
  };
  Event.prototype.dispatch = function () {
    var i;
    var h = this._handlers;
    for (i = 0; i < h.length; i += 2) {
      h[i].apply(h[i + 1], arguments);
    }
    return this;
  };
  Event.prototype.addListener = function (cb, context) {
    if (cb) {
      var h = this._handlers;
      h.push(cb);
      h.push(context || null);
    }
    return this;
  };
  Event.prototype.removeListener = function (cb) {
    var h = this._handlers;
    var n = h.indexOf(cb);
    if (n >= 0) {
      h.splice(n, 2);
      this.removeListener(cb);
    }
    return this;
  };
  
  module.exports = Event; 
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';
  function noop() {
  }

  function wrapLogger(c, f, tag, lev) {
    if (!f) {
      return noop;
    }
    return f.bind(c, tag, lev);
  }

  function Log() {
  }

  Log.prototype.createLogger = function (tag) {
    if (window && window.location) {
      var path = (window.location.pathname || '').split('/');
      var app = path[path.length - 1].split('.')[0];
      if (app) {
        tag = app.toUpperCase() + ':' + tag;
      }
      tag = '[' + tag + ']';
    }
    var logger = {
      _info: wrapLogger(console, console.info || noop, tag, '[i]'),
      _log: wrapLogger(console, console.log || noop, tag, '[l]'),
      _warn: wrapLogger(console, console.warn || noop, tag, '[w]'),
      _error: wrapLogger(console, console.error || noop, tag, '[e]'),
      _debug: wrapLogger(console, console.debug || noop, tag, '[d]'),
      _assert: wrapLogger(console, console.assert || noop, tag, '[a]'),
      _trace: wrapLogger(console, console.trace || noop, tag, '[t]'),
      _cred: wrapLogger(null, function () {
        var args = Array.prototype.slice.apply(arguments);
        var last = (args.pop() || '').replace(/[^a-z0-9]/ig, '\\$&');
        if (last) {
          var re = new RegExp(last, 'ig');
          args = args.map(function (item) {
            return item.replace(re, '********');
          });
        }
        console.info.apply(console, args);
      }, tag, '[i]'),
      _empty: noop,
      enable: function (v) {
        this.cred = v ? this._cred : this._empty;
        this.info = v ? this._info : this._empty;
        this.log = v ? this._log : this._empty;
        this.warn = v ? this._warn : this._empty;
        this.error = v ? this._error : this._empty;
        this.debug = v ? this._debug : this._empty;
        this.assert = v ? this._assert : this._empty;
        this.trace = v ? this._trace : this._empty;
      }
    };
    logger.enable(true);
    return logger;
  };

  Log.prototype.getErrInfo = function (err) {
    err = err || { };
    return err.message ? (err.message + ', ' + err.stack) : JSON.stringify(err);
  }

  Log.prototype.getInfo = function (o) {
    return typeof(o) === 'undefined' ? 'undefined' : JSON.stringify(o);
  }

  module.exports = new Log();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var global = window;

  function hasKey(key, object) {
    object = object || global;
    return (key in object);
  }
  function safeProp(key, def, object) {
    object = object || global;
    if (key in object) {
      return object[key];
    }
    return def;
  }
  function wrapString(v) {
    if (typeof (v) !== 'string') {
      v = String(v);
    }
    return v;
  }

  module.exports = { hasKey: hasKey, safeProp: safeProp, wrapString: wrapString, global: global };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var base = __webpack_require__(8);
  
  var keys = {
    text: '$t', html: '$h',
    cssClass: '@class', id: '@id', href: '@href', style: '@style', _id: '@jslid', src: '@src', tip: '@title', hint: '@placeholder', tab: '@tabIndex', align: '@align', target: '@target',
    click: '^click', dblclick: '^dblclick'
  };
  var rkeys = base.reverseMap(keys);
  
  function get(arg) {
    if (arg instanceof Element) {
      return new element(arg);
    }
    else if (arg instanceof element) {
      return arg;
    }
    return new element(document.getElementById(arg) || document.body);
  }
  
  function node(tag) {
    return function (args) {
      return get(document.createElement(tag)).set(args);
    };
  }
  function parse(el, level) {
    var sb = [];
    level = level || 1;
    var pad = '\n' + new Array(level*2 + 1).join(' ');
    var pad2 = '\n' + new Array((level - 1)*2 + 1).join(' ');
    
    sb.push('dom.' + el.tagName.toLowerCase() + '(');
    var args = [];
    var attrs = [];
    for (var i = 0 ; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      var n = '@' + a.name;
      attrs.push((rkeys[n] || n) + ':\'' +  a.value + '\'');
    }
    if (attrs.length) {
      sb.push('{');
      sb.push(attrs.join(', '));
      sb.push('}');
    }

    var nodes = el.childNodes;
    var p = nodes.length > 1 ? pad : '';
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3) {
        args.push(p + '\'' + nodes[i].nodeValue + '\'');
      } else {
        args.push(p + parse(nodes[i], level + 1));
      }
    }
    if (args.length) {
      if ((args.length > 1) || attrs.length)
        sb.push(').add(')
      sb.push(args.join(','));
    }
    if (p)
      sb.push(pad2);
    sb.push(')');
    return sb.join('');
  }
  

  /** @constructor */
  var element = function element(el) {
    this.node = el;
  };
  element.prototype.clear = function () {
    this.node.innerHTML = '';
  }
  element.prototype.add = function () {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg instanceof element) {
        this.node.appendChild(arg.node);
      } else if (arg instanceof Element) {
        this.node.appendChild(arg);
      } else if (typeof (arg) === 'string') {
        this.node.appendChild(document.createTextNode(arg));
      }
    }
    return this;
  };
  element.prototype.del = function (final) {
    var n = this.node;
    if (n && n.parentElement) {
      n.parentElement.removeChild(n);
    }
    if (final) {
      this.node = undefined;
    }
    return n;
  };
  element.prototype.set = function (args) {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof (arg) === 'string') {
        this.add(arg);
      }
      else if (arg instanceof element) {
        this.add(arg);
      } else {
        for (var k in arg) {
          var kk = keys[k] || k;
          if (kk[0] === '@') {
            this.node.setAttribute(kk.substr(1), arg[k]);
          } else if (kk[0] === '^') {
            this.node.addEventListener(kk.substr(1), arg[k]);
          } else if (kk === '$t') {
            this.node.textContent = arg[k];
          } else if (kk === '$h') {
            this.node.innerHTML = arg[k];
          }
        }
      }
    }
    return this;
  };
  element.prototype.addClass = function (c) {
    if (!c) {
      return this;
    }
    var i;
    c = Array.isArray(c) ? c : c.split(' ');
    for (i = 0; i < c.length; i++) {
      this.node.classList.add(c[i]);
    }
    return this;
  };
  element.prototype.delClass = function (c) {
    if (!c) {
      return this;
    }
    var i;
    c = Array.isArray(c) ? c : c.split(' ');
    for (i = 0; i < c.length; i++) {
      this.node.classList.remove(c[i]);
    }
    return this;
  };
  element.prototype.hasClass = function (c) {
    return this.node.classList.contains(c);
  };
  element.prototype.toggleClass = function (c, v) {
    return v ? this.addClass(c) : this.delClass(c);
  };
  element.prototype.mixClass = function (lst, lstKeep) {
    var i, cl = this.node.classList, hn = [], hd = [];
    lstKeep = lstKeep || [];

    for (i = 0; i < cl.length; i++) {
      if ((lst.indexOf(cl[i]) < 0) && (lstKeep.indexOf(cl[i]) < 0)) {
        hd.push(cl[i]);
      }
    }
    for (i = 0; i < lst.length; i++) {
      if (!cl.contains[lst[i]]) {
        hn.push(lst[i]);
      }
    }
    this.delClass(hd);
    this.addClass(hn);
    return this;
  };
  element.prototype.setText = function (t) {
    this.node.textContent = t || '';
    return this;
  };
  
  var dom = {
    html: get(document.documentElement),
    head: get(document.head),
    body: get(document.body),
    title: get(document.title),
    
    br: node('br'), hr: node('hr'),
    div: node('div'), span: node('span'), p: node('p'), pre: node('pre'),
    h1: node('h1'), h2: node('h2'), h3: node('h3'),
    header: node('header'), footer: node('footer'), section: node('section'),
    
    img: node('img'),
    ul: node('ul'), li: node('li'),
    
    a: node('a'), link: node('link'),
    input: node('input'), textarea: node('textarea'), select: node('select'), option: node('option'), button: node('button'), label: node('label'),

    audio: node('audio'), video: node('video'),
    
    get: get, parse: parse, element: base.extend(element)
  };
  
  module.exports = dom;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  "use strict";

  var strings = {
    "sourceTitle": "Source",
    "sourceEquinox": "Equinox Rooms",
    "sourceSpaces": "Spaces",
    "actionOk": "Ok",
    "actionCancel": "Cancel",
    "hintPassword": "Password",
    "titleUnknownInvitation": "Unknown invitation",
    "titleSpaceUrl": "Space URL",
    "titleMeetingPlaces": "Places to Meet",
    "actionCreateTopic": "Create Topic",
    "titleMeetingDetails2": "Your meeting details have been added!",
    "errorSourceInitialization": "Could not retrieve your $source meeting information",
    "retrySourceInitialization": "Retrying retrieve your $source meeting information",
    "hintSpacesSearch": "Search",
    "noteAppInitializing": "Initializing application",
    "notePleaseWait": "Please wait...",
    "noteLoading": "Loading",
    "noteAppNotInitialized": "Application not initialized",
    "noteUnknown": "Unknown",
    "noteInitializing": "Initializing",
    "noteNotInitialized": "Not initialized",
    "noteInitialized": "Initialized",
    "noteAuthorizing": "Authorizing",
    "noteNotAuthorized": "Not authorized",
    "noteAuthorized": "Authorized",
    "noteUnauthorizing": "Unauthorizing",
    "noteNotUnauthorized": "Not unauthorized",
    "noteUnauthorized": "Unauthorized",
    "noteFetching": "Fetching",
    "noteNotFetched": "NotFetched",
    "noteFetched": "Fetched",
    "noteChecking": "Checking",
    "noteNotChecked": "Not checked",
    "noteChecked": "Checked",
    "partyTypeSelectLabel": "Invite participants as:",
    "partyTypeMembers": "Members",
    "partyTypeGuests": "Guests",
    "partiesMeOnly": "Me only",
    "partiesMePlus": "Me + ",
    "partiesOtherMembers": " member(s)",
    "topicCreateNew": "Create new $source",
    "errorUnknown": "Unknown error",
    "errorNoOffice": "Office is not initialized...",
    "errorAccountDisabled": "Account disabled",
    "errorLoginBlocked": "Login window blocked",
    "errorLoginClosed": "Login window closed",
    "errorLoginTimeout": "Login timed out",
    "errorNoInvite": "No invite",
    "errorNetwork": "Network error while accessing $source",
    "errorSignInRequired": "Please sign-in in your browser to access $source",
    "errorLoginRequired": "Please login to access $source",
    "errorNoAppConfiguration": "Please provide configuration to start application",
    "errorNoSourceConfiguration": "Please provide configuration to access $source",
    "errorNoValidSources": "No valid sources",
    "errorUnknownSource": "Unknown source",
    "errorInviteEmpty": "Invite is empty",
    "errorInviteContentEmpty": "Invite content is empty",
    "errorTemplate": "The template could not be accessed.",
    "notificationMeetingJoined": "Joined meeting",
    "notificationMeetingNotJoined": "Failed to join meeting",
    "notificationNoMeetingLink": "Meeting link not found",
    "errorPopupBlocked" : "Popup blocked",

    "askResetConfiguration": "Reset the configuration?",
    "actionReset": "Reset",
    "titleAddinAds": "Schedule Avaya Equinox and Avaya Spaces meetings.",
    "titleSetupMeetingDetails": "Let’s setup your meeting details!<br/>Enter your email address.",
    "hintEmailAddress": "Email address",
    "titleAccountAds": "Don't have an Avaya Equinox or Avaya Spaces account?",
    "titleAccountAdsLink": "Get a demo, purchase or learn more about our services here",
    "actionNext": "Next",
    "actionSkip": "Skip",
    "actionClear": "Clear",
    "titleCheckingCloudAccount": "Checking your Avaya Cloud account...",
    "titleEnterCloudCredentials": "Enter your credentials<br/>for Avaya Cloud",
    "titleOpensInBrowser": "(Opens in separate browser window)",
    "linkClickToLogin": "Click here to login",
    "titleLoggingToCloud": "Logging in to Avaya Cloud",
    "hintUsername": "Username",
    "titleCheckingEquinoxAccount": "Checking your Equinox account...",
    "titleChooseEquinoxEnvironment": "Choose your environment",
    "titleEnterAEMOCredentials": "Enter your credentials<br/>for Equinox Meetings Online",
    "titleEnterEquinoxCredentials": "Enter your credentials<br/>for Equinox Meetings",
    "titleLoggingToAEMO": "Logging in to Equinox Meetings Online",
    "titleLoggingToEquinox": "Logging in to Equinox Meetings",
    "errorBadCredentials": "Incorrect Username or Password",
    "errorConfigureAccount": "Unable to configure account at this time.",
    "errorNoConfiguredAccounts": "Sorry, your account could not be found.<br/>You may want to:<ul><li>check your email address and try again</li><li>check with your organization to see if you have a Equinox Meetings Online or Equinox Conferencing account</li><li><a href=\"https://spaces.zang.io\" target=\"_blank\">sign up</a> for a Spaces account.</li></ul>",
    "titleSettingAddin": "Setting up your add-in...",

    "titleRequestInfo": "Retrieving Portal Info...",
    "titleMeetingDetails": "Your Meeting Details",

    "titleConferenceAccessNumber": "Conference Access Number",
    "titleMeetingId": "Meeting ID",
    "titleConferenceAccessUrl": "Conference Access URL",

    "actionAddDetails": "Add Details",
    "actionAddingDetails": "Adding Details...",
    "actionStart": "Start Meeting",
    "actionJoin": "Join Meeting",
    "actionRemoveDetails": "Remove Details",
    "actionRemovingDetails": "Removing Details...",
    "actionLogin": "Login",
    "actionRetry": "Retry",
    "actionAllow": "Allow",
    "actionIgnore": "Ignore",
    "actionTryAgain": "Try Again",

    "linkEquinoxSettings": "Go to Equinox Settings",
    "linkResetConfiguration": "Reset Add-in Configuration",

    "additionalNumbersTitle": "Additional numbers:",
    "titlePasswordDetails": "Specify your password:",
    "titleUserId": "User name:",
    "titlePassword": "Password:",

    "aacRoomName": "Default AAC",
    "aacLabel": "Avaya Aura Conferencing",

    "ipoRoomName": "Default IP Office",
    "ipoLabel": "Avaya IP Office Conferencing",

    "statusOffline": "Add-in is running in offline mode",
    "statusCached": "Only cached rooms information is currently available.",

    "errorNoConfiguration": "Configuration settings are incomplete. Go to your portal settings to reconfigure.",
    "errorPortal": "The Portal could not be accessed.",
    "errorInvalidCredentials": "Your user credentials were invalid. Check your Equinox Settings or contact support for details.",
    "errorNoRooms": "Error while fetching conference rooms.",
    "errorInternal": "Internal application error.",

    "promptDisplayNewWindow": "$1 wants to display a new window",
  };


  var i18n = {
    ready: false,
    languageId: "en-US", // default

    i18n: strings
  };

  i18n.loadI18n = function (id) {
    if (i18n.ready) {
      return Promise.resolve(i18n.languageId);
    }
    if (i18n.loading) {
      return i18n.loading;
    }
    i18n.loading = new Promise(function(resolve, reject) {
      var setReady = function(failed) {
        i18n.ready = true;
        delete i18n.loading;
        if (!failed) {
          i18n.languageId = id;
        }
        resolve(i18n.languageId);
      };

      try {
        id = id.toLowerCase();
        var langid = id.split('-')[0];
        switch (id) {
          case 'pt-br':
          case 'zh-cn':
          case 'zh-tw':
            langid = id.replace('-', '_');
        }
        var url = 'i18n.json';
        fetch(url).then(function (r) {
          if (!r.ok) {
            throw null;
          }
          return r.text();
        }).then(function (text) {
          try {
            var langstrings = JSON.parse(text);
            Object.getOwnPropertyNames(langstrings).forEach(function (lcid) {
              langstrings[lcid.toLowerCase()] = langstrings[lcid];
            });
            
            var ln_strings = langstrings[langid] || {};
            var en_strings = langstrings['en'] || {};
            
            Object.getOwnPropertyNames(en_strings).forEach(function(key) {
              strings[key] = ln_strings[key] || en_strings[key];
            });
            setReady(false);
          } catch (e) {
            setReady(true);
          }
        }, function () {
          setReady(true);
        });
      } catch (e) {
        setReady(true);
      }
    });
    return i18n.loading;
  };

  module.exports = i18n;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(4);
  
  var _chrome = globals.safeProp('chrome');
  if (!_chrome || !('runtime' in _chrome)) {
    _chrome = globals.safeProp('browser');
  }
  if (!_chrome || !('runtime' in _chrome)) {
    _chrome = { };
  }
  
  module.exports = _chrome;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  function empty() {
  }
  
  function keys(o) {
    return Object.getOwnPropertyNames(o || {});
  }
  function mergeKey(context, key) {
    if (key !== 'constructor') {
      context.dst[key] = context.src[key];
    }
    return context;
  }
  function merge(src, dst) {
    return keys(src).reduce(mergeKey, { src: src, dst: dst }).dst;
  }

  function declare(constructor, instance, statics) {
    constructor = constructor || empty;
    instance    = instance    || constructor.prototype;
    merge(instance, constructor.prototype);
    merge(statics, constructor);
    return constructor;
  }
  function extend(base, constructor, instance, statics) {
    statics = statics || {};
    return derive(constructor, base, instance, statics);
  }
  function derive(constructor, base, instance, statics) {
    var proto;
    constructor = constructor || empty;
    proto       = constructor.prototype;
    base        = base || Object;
    statics     = statics  || base.statics || {};
    
    constructor.prototype = Object.create(base.prototype, { constructor: { value: constructor, enumerable: false }, $base: { value: base.prototype, enumerable: false } });
    merge(proto, constructor.prototype);
    merge(instance, constructor.prototype);
    merge(statics, constructor);
    constructor.extend = extend.bind(null, constructor);
    constructor.statics = constructor.statics || {};
    merge(statics, constructor.statics);
    return constructor;
  }
  function mix(constructor) {
    constructor = constructor || empty;
    var i, len;
    for (i = 1, len = arguments.length; i < len; i++) {
      merge(arguments[i], constructor.prototype);
    }
    return constructor;
  }
  function reverseMap(o) {
    var r = {}, k = keys(o), i;
    for (i = 0; i < k.length; i++) {
      r[o[k[i]]] = k[i];
    }
    return r;
  }
  function reduce(bag, f, context) {
    if (!Array.isArray(bag)) {
      bag = keys(bag);
    }
    bag.reduce(f, context);
  }
  function findFunction(o, f) {
    var key;
    for (key in o) {
      if (o[key] === f) {
        return key;
      }
    }
    return null;
  }
  
  /** @constructor */
  function Base() {
    //console.info('base', this);
  }
  Base.prototype.$call = function (f, args) {
    f = f;
    args = args;
    //var k = this.$this;
  }; 
  Base.prototype.$super = function () {
    var t = this.$this;
    this.$this = (t || this).$base;
    this.$this.constructor.apply(this, arguments);
    this.$this = t;
  }; 
  
  module.exports = derive(Base, Object, {}, {
    empty: empty,
    declare: declare,
    derive: derive,
    mix: mix,
    keys: keys,
    reduce: reduce,
    reverseMap: reverseMap,
  });
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var Control = __webpack_require__(32);
  
  /** @constructor */
  function Panel(opt) {
    this.$super(opt)
    this.addClass('panel');
  }

  module.exports = Control.extend(Panel);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var chrome = __webpack_require__(7);
  var fetch = __webpack_require__(44);

  function fetchproxy(url, opt) {
    if (!chrome || !chrome.runtime || !chrome.runtime.id) {
      //var proxypath = location.href.replace(/(.*)\/.*\/.*(\.html)($|\??.*)/i, '$1/proxy/proxy.ashx?url=');
      var proxypath = '../proxy/proxy.ashx?url=';
      url = proxypath + url;

      console.log('fetchproxy:' + url);
    }
    return fetch(url, opt);
  }
  
  module.exports = fetchproxy;  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var _empty = {
    bag: {},
    set: function (key, val) {
      this.bag[key] = val;
    },
    get: function (key) {
      return this.bag[key];
    },
    del: function (key) {
      delete this.bag[key];
    }
  };
  var _local = {
    set: function (key, val) {
      localStorage.setItem(key, val);
    },
    get: function (key) {
      return localStorage.getItem(key);
    },
    del: function (key) {
      localStorage.removeItem(key);
    }
  };

  /** @constructor */
  function Storage() {
    this.enabled = true;
    this.empty = _empty;
    this.local = _local;
    this._store = _local;
  }
  
  Storage.prototype.setStore = function (store) {
    if (store) {
      this._store = store;
    }
  };

  Storage.prototype.getItem = function (key) {
    if (!this.enabled) {
      return null;
    }
    return this._store.get(key);
  };

  Storage.prototype.setItem = function(key, val) {
    if (!this.enabled) {
      return;
    }
    if ((val === null) || (typeof (val) === 'undefined')) {
      this.removeItem(key);
      return;
    }
    this._store.set(key, val);
  };

  Storage.prototype.removeItem = function (key) {
    if (!this.enabled) {
      return;
    }
    this._store.del(key);
  };

  module.exports = new Storage();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var Log = __webpack_require__(3);
  var Timer = __webpack_require__(14);

  var globals = __webpack_require__(4);
  var Office = globals.safeProp('Office');

  var officeNative = __webpack_require__(33);
  var officeStorage = __webpack_require__(34);

  var logger = Log.createLogger('OFFICE');

  var office = {
    getStore: officeStorage.getStore
  };
  var strings_defaults = {
    appName: '',
    actionAllow: 'Allow',
    actionIgnore: 'Ignore',
    promptDisplayNewWindow:  '$1 wants to display a new window.'
  };
  var strings = {
  };

  if (officeNative.missing) {
    Office.initialize = function (reason) {
      logger.info('Office.initialize: ' + reason);
      office.webAPI = true;
      office.initialized = true;
      office.hostName = Office.context.mailbox.diagnostics.hostName;
      office.joinMode = typeof(Office.context.mailbox.item.itemId) !== 'undefined';
    };
  } else {
    office.webAPI = false;
    office.initialized = true;
    Office = officeNative;
    office.hostName = Office.context.mailbox.diagnostics.hostName;
    if ('apiVersion' in Office.context.mailbox.diagnostics) {
      office.apiVersion = Office.context.mailbox.diagnostics.apiVersion;
    }
  }

  function callback(action, resolve, reject) {
    return function(result) {
      if (result.error) {
        reject(result.error);
        return;
      }
      try {
        var value = result.value;
        if (action) {
          value = action(value);
        }
        resolve(value);
      } catch (e) {
        reject(e);
      }
    };
  }

  function checkOffice() {
    return new Promise(function(resolve, reject) {
      var timer;
      var delay = 0;
      var interval = 100;
      var wait = 15000;
      var checkInitialized = function () {
        if (office.initialized) {
          timer.reset();
          office.version = Office.context.mailbox.diagnostics.hostVersion.toString() || '';
          logger.info('Office initialized, webAPI: ' + office.webAPI + ', version: ' + office.version + ', apiVersion: ' + office.apiVersion + ', delay: ' + delay);
          logger.info('Office userProfile displayName: ' + office.getDisplayName() + ', emailAddress: ' + office.getEmailAddress());
          officeStorage.init(Office.context.roamingSettings);
          resolve({ checkOffice: true, delay: delay });
        } else {
          if (delay >= wait) {
            timer.reset();
            logger.info('Office not initialized, delay: ' + delay);
            resolve({ checkOffice: false, delay: delay });
          } else {
            timer.start(interval);
            delay += interval;
          }
        }
      };
      timer = new Timer(checkInitialized, 0);
    });
  }

  function getDialogApi() {
    try {
      return Office.context.requirements.isSetSupported('DialogAPI', '1.1');
    } catch (ex) {
      return false;
    }
  }

  function setTranslations(s) {
    s = s || {};
    strings.actionAllow = s.actionAllow;
    strings.actionIgnore = s.actionIgnore;
    strings.appName = s.manifest_DisplayName;
    strings.promptDisplayNewWindow = strings.promptDisplayNewWindow;
  }

  function getDisplayName() {
    var displayName;

    var mailbox = Office.context.mailbox;
    if ('userProfile' in mailbox) {
      var userProfile = mailbox.userProfile;
      if ('displayName' in userProfile) {
        displayName = userProfile.displayName;
      }
    }
    return typeof(displayName) === 'string' ?  displayName : null;
  }

  function getEmailAddress() {
    var emailAddress;

    var mailbox = Office.context.mailbox;
    if ('userProfile' in mailbox) {
      var userProfile = mailbox.userProfile;
      if ('emailAddress' in userProfile) {
        emailAddress = userProfile.emailAddress;
      }
    }

    return typeof(emailAddress) === 'string' ?  emailAddress : null;
  }

  function getSubject() {
    return new Promise(function(resolve, reject) {
      var action = function (subject) {
        return subject || '';
      };
      Office.context.mailbox.item.subject.getAsync(callback(action, resolve, reject));
    });
  }

  function setSubject(subject) {
    return new Promise(function(resolve, reject) {
      Office.context.mailbox.item.subject.setAsync(subject, {}, callback(null, resolve, reject));
    });
  }

  function getParties(member) {
    return new Promise(function(resolve, reject) {
      var action = function (recipients) {
        var _recipients = typeof(recipients) === 'string' ? recipients.split(';') : recipients;
        var parties = [];
        for (var i = 0; i < _recipients.length; i++) {
          parties.push({ email: _recipients[i].emailAddress || _recipients[i], member: member });
        }
        return parties;
      };
      Office.context.mailbox.item.requiredAttendees.getAsync(callback(action, resolve, reject));
    });
  }

  function getDescription(type) {
    return new Promise(function(resolve, reject) {
      var action = function (desc) {
        return(desc);
      };
      var coercion = type || 'text';
      Office.context.mailbox.item.body.getAsync(coercion, callback(action, resolve, reject));
    });
  }

  function setDescription(desc, type) {
    return new Promise(function(resolve, reject) {
      var coercion = { coercionType: type || 'text' };
      Office.context.mailbox.item.body.setAsync(desc, coercion, callback(null, resolve, reject));
    });
  }

  function prependDescription(desc, type) {
    return new Promise(function(resolve, reject) {
      var coercion = { coercionType: type || 'text' };
      Office.context.mailbox.item.body.prependAsync(desc, coercion, callback(null, resolve, reject));
    });
  }

  function insertDescription(desc, type) {
    return new Promise(function(resolve, reject) {
      var coercion = { coercionType: type || 'text' };
      if ('setSelectedDataAsync' in Office.context.mailbox.item.body) {
        Office.context.mailbox.item.body.setSelectedDataAsync(desc, coercion, callback(null, resolve, reject));
      } else {
        Office.context.mailbox.item.body.prependAsync(desc, coercion, callback(null, resolve, reject));
      }
    });
  }

  function setLocation(value) {
    return new Promise(function(resolve, reject) {
      Office.context.mailbox.item.location.setAsync(value, { }, callback(null, resolve, reject));
    });
  }

  function getLocation() {
    return new Promise(function(resolve, reject) {
      var action = function (value) {
        return(value);
      };
      if (typeof(Office.context.mailbox.item.location) === 'string') {
        resolve(action(Office.context.mailbox.item.location));
      } else {
        Office.context.mailbox.item.location.getAsync(callback(action, resolve, reject));
      }
    });
  }

  function getLanguageSync() {
    var language = Office.context.displayLanguage;
    return typeof(language) === 'string' ?  language : null;
  }

  function notifyInfo(key, icon, message) {
    Office.context.mailbox.item.notificationMessages.replaceAsync(key, { type: 'informationalMessage', icon: icon, message: message, persistent: false });
  }

  function notifyError(key, message) {
    Office.context.mailbox.item.notificationMessages.replaceAsync(key, { type: 'errorMessage', message: message });
  }

  function displayDialog2016RTM(url, opt) {
    Microsoft.Office.WebExtension.EventType = Microsoft.Office.WebExtension.EventType || {};
    Microsoft.Office.WebExtension.EventType.DialogEventReceived = 'dialogEventReceived';
    Microsoft.Office.WebExtension.EventType.DialogMessageReceived = 'dialogMessageReceived';

    return new Promise(function (resolve, reject) {
      var elBkg, elDlg;

      function clearPrompt() {
        if (elDlg) {
          elDlg.parentElement.removeChild(elDlg);
          elDlg = null;
        }
        if (elBkg) {
          elBkg.parentElement.removeChild(elBkg);
          elBkg = null;
        }
      }
      function createPrompt(cb) {
        if (!elBkg) {
          elBkg = document.createElement('div');
          elBkg.setAttribute('style', 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(198, 198, 198, 0.5); z-index: 99998;');
          document.body.appendChild(elBkg);
        }
        if (!elDlg) {
          elDlg = document.createElement('div');
          elDlg.id = 'newWindowNotificaiton';
          elDlg.setAttribute('role', 'dialog');
          elDlg.setAttribute('style', 'width: 100%; height: 190px; position: absolute; z-index: 99999; background-color: rgb(255, 255, 255); left: 0px; top: 50%; margin-top: -95px;');

          var elHead, elText, elAct, elAccept, elIgnore;
          elHead = document.createElement('div');
          elHead.id = 'dialogNotificationTextPanel';
          elHead.setAttribute('style', 'margin: 20px 14px; font-family: &quot;Segoe UI&quot;, Arial, Verdana, sans-serif; font-size: 14px; height: 100px; line-height: 100px; padding-left: 30px;');

          elText = document.createElement('span');
          elText.setAttribute('style', 'display: inline-block; line-height: normal; vertical-align: middle;');
          elText.textContent = (strings.promptDisplayNewWindow || strings_defaults.promptDisplayNewWindow || '').replace('$1', strings.appName || strings_defaults.appName || '');

          elAct = document.createElement('div');
          elAct.setAttribute('style', 'margin: 0px 9px; float: right;');

          elAccept = document.createElement('input');
          elAccept.type = 'button';
          elAccept.setAttribute('style', 'text-align: center; width: 100px; height: 25px; font-size: 14px; font-family: Segoe UI, Arial, Verdana, sans-serif; margin: 0px 5px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(255, 255, 255);');
          elAccept.value = strings.actionAllow || strings_defaults.actionAllow || '';
          elAccept.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            clearPrompt();
            cb(true);
          });

          elIgnore = document.createElement('input');
          elIgnore.type = 'button';
          elIgnore.setAttribute('style', 'text-align: center; width: 100px; height: 25px; font-size: 14px; font-family: Segoe UI, Arial, Verdana, sans-serif; margin: 0px 5px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(255, 255, 255);');
          elIgnore.value = strings.actionIgnore || strings_defaults.actionIgnore || '';
          elIgnore.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            clearPrompt();
            cb(false);
          });

          elDlg.appendChild(elHead);
          elDlg.appendChild(elAct);

          elHead.appendChild(elText);

          elAct.appendChild(elAccept);
          elAct.appendChild(elIgnore);

          document.body.appendChild(elDlg);
        }
      }
      function checkWindow(context) {
        if (context.stop) {
          return;
        }
        if (!context.wnd || context.wnd.closed) {
          context.cb();
        } else {
          setTimeout(checkWindow, 100, context);
        }
      }

      opt = opt || { width: 100, height: 100, requireHTTPS: true };
      var result = { value: null, status: Office.AsyncResultStatus.Failed, error: null };
      createPrompt(function (res) {
        if (res) {
          var t, l, w, h;
          w = 0 | (opt.width*window.screen.availWidth/100);
          h = 0 | (opt.height*window.screen.availHeight/100);
          l = 0 | ((window.screen.availWidth - w)/2);
          t = 0 | ((window.screen.availHeight - h)/2);

          var wnd = window.open(url, 'DialogAPI', 'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l + ',resizable,scrollbars=yes');
          if (!wnd) {
            // result update;
            reject(result);
          } else {
            var context = { wnd: wnd, stop: false }, handler;

            result.value = {
              close: function () {
                context.stop = true;
                if (context.wnd) {
                  context.wnd.close();
                  context.wnd = null;
                }

                handler = null;
              },
              addEventHandler: function (name, h) {
                if (name === Microsoft.Office.WebExtension.EventType.DialogEventReceived) {
                  handler = h;
                }
              }
            };

            context.cb = function () {
              if (handler) {
                handler({ error: 12006 });
              }
            };
            checkWindow(context);
            
            result.status = Office.AsyncResultStatus.Succeeded;
            resolve(result);
          }
        } else {
          // result update;
          reject(result);
        }
      });
    });
  }

  function displayDialog(url, opt) {
    if (!('ui' in Office.context) || !('displayDialogAsync' in Office.context.ui)) {
      return displayDialog2016RTM(url, opt);
    }

    return new Promise(function (resolve, reject) {
      opt = opt || { width: 100, height: 100, requireHTTPS: true };
      Office.context.ui.displayDialogAsync(url, opt, function (result) {
        result = result || { };
        result = { value: result.value, status: result.status, error: result.error };
        logger.info('displayDialogAsync, opt: ' + JSON.stringify(opt) + ', result: ' + JSON.stringify(result));
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }

  function getCustomProp(name) {
    return new Promise(function(resolve, reject) {
      var action = function (customProps) {
        var value = customProps.get(name);
        if (!value) {
          return value;
        }
        return JSON.parse(value);
      };
      Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
    });
  }

  function setCustomProp(name, value) {
    if (typeof(value) === 'undefined') {
      return delCustomProp(name);
    }
    return new Promise(function(resolve, reject) {
      var action = function (customProps) {
        customProps.set(name, JSON.stringify(value));
        customProps.saveAsync(callback(null, resolve, reject));
      };
      Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
    });
  }

  function delCustomProp(name) {
    return new Promise(function(resolve, reject) {
      var action = function (customProps) {
        customProps.remove(name);
        customProps.saveAsync(callback(null, resolve, reject));
      };
      Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
    });
  }

  function save() {
    return new Promise(function(resolve, reject) {
      Office.context.mailbox.item.saveAsync(callback(null, resolve, reject));
    });
  }

  function invokeCallback(type, data) {
    Office.context.mailbox.item.location.callback(type, data);
  }

  function execCmd0(cmd) {
    return function () {
      if (!office.initialized) {
        return Promise.reject({ error: { nooffice: true } });
      }
      return cmd.apply(this, arguments); // pass provided arguments to cmd itself
    };
  }

  function execCmd(cmd) {
    var args = arguments;
    return function () {
      if (office.initialized === undefined) {
        // return Promise.reject({ error: { nooffice: true } });
        // sometimes Office.initialize is called later than checkInvite in case of auto login, 
        // so we need to wait a bit before reject 'not intitialized' error
        return new Promise(function(resolve, reject) 
        {
          setTimeout(function()
          {
             if (!office.initialized) {
               reject({ error: { nooffice: true } });
             } else {
               resolve(cmd.apply(this, args)); // pass provided arguments to cmd itself
             } 
          }, 500);
        });
      } else if (!office.initialized) {
        return Promise.reject({ error: { nooffice: true } });
      } else {
        return cmd.apply(this, arguments); // pass provided arguments to cmd itself
      }
    };
  }

  office.checkOffice = checkOffice;
  office.getDialogApi = getDialogApi;
  office.getDisplayName = execCmd(getDisplayName);
  office.getEmailAddress = execCmd(getEmailAddress);
  office.getSubject = execCmd(getSubject);
  office.setSubject = execCmd(setSubject);
  office.getParties = execCmd(getParties);
  office.getDescription = execCmd(getDescription);
  office.setDescription = execCmd(setDescription);
  office.prependDescription = execCmd(prependDescription);
  office.insertDescription = execCmd(insertDescription);
  office.getLocation = execCmd(getLocation);
  office.setLocation = execCmd(setLocation);
  office.getLanguageSync = execCmd(getLanguageSync);
  office.notifyInfo = execCmd(notifyInfo);
  office.notifyError = execCmd(notifyError);
  office.displayDialog = execCmd(displayDialog);
  office.getCustomProp = execCmd(getCustomProp);
  office.setCustomProp = execCmd(setCustomProp);
  office.delCustomProp = execCmd(delCustomProp);
  office.save = execCmd(save);
  office.invokeCallback = execCmd(invokeCallback);
  office.setTranslations = setTranslations;
  
  module.exports = office;  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Timer = __webpack_require__(14);

  var modules = { }; 
  var lmodules = [];
  var monitors = [];
  var timer = new Timer(onTimer, 10);
  
  var pageUrl = location.href;
  var rootUrl = getRootUrl();
  var baseUrl = getBaseUrl(rootUrl, pageUrl);

  function getBaseUrl(root, page) {
    var url = page.replace(root, '').replace(/(\#|\?).*/ig, '').split('/');
    // remove leading /
    url.shift();
    // remove trailing /
    url.pop();
    for (var i = 0; i < url.length; i++) {
      url[i] = '..';
    }
    return url.join('/');
  }
  
  function getRootUrl() {
    var re = /\/?boot\.js/i;
    var els = document.getElementsByTagName('script');
    for (var i = 0; i < els.length; i++) {
      var url = els[i].src;
      if (re.exec(url)) {
        return commonUrl(pageUrl, url);
      }
    }
  }
  function commonUrl(url1, url2) {
    for (var i = 0; i < url1.length; i++) {
      if (url1[i] !== url2[i]) {
        return url1.substr(0, url1[i - 1] === '/' ? i - 1 : i);
      }
    }
    return '';
  }
  function adjustUrl(base, url) {
    if ((url[0] === '/') && (url[1] !== '/')) {
      if (base === '') {
        url = url.substr(1);
      }
      return base + url;
    }
    return url;
  }
  
  function loadScript(url, isAsync) {
    url = adjustUrl(baseUrl, url);
    var d = document; 
    var j = d.createElement('script'); 
    j.async = isAsync; 
    j.src = url; 
    d.head.appendChild(j); 
  }  

  
  function load(url, check, cb) {
    console.info('load', url);
    var key = adjustUrl(rootUrl, url);
    var mod = modules[key];
    if (!mod) {
      mod = modules[key] = { url: url, notify: [], check: check, loaded: false };
      lmodules.push(mod);
      if (false) {
        loadScript(url, true);
      }
    }
    if (cb) {
      mod.notify.push(cb);
    }
    onTimer();
  }
  function wait(cb) {
    monitors.push(cb);
    onTimer();
  }
  function loadMany(items, cb) {
    var item = items.shift();
    if (!item) {
      return;
    }
    var i = items.length;
    load(item.url, item.name, function () {
      if (i) {
        loadMany(items, cb);
      } else {
        cb();
      }
    });
  }
  
  function exec(lcb) {
    for (var i = 0; i < lcb.length; i++) {
      lcb[i]();
    }
    return [];
  }
  function checkObject(o) {
    var p = window;
    for (o = o.split('.'); o.length && !!(p = p[o.shift()]);) {
      p = p;
    }
    return !!p;
  }
  function checkLoaded(mod) {
    if (!mod.loaded) {
      var c = mod.check;
      if (typeof (c) === 'function') {
        mod.loaded = c();
      } else if (typeof (c) === 'string') {
        mod.loaded = checkObject(c);
      }
    }
    return mod.loaded;
  }
  
  function onTimer() {
    var i, mod, mods = [];
    for (var i = 0; i < lmodules.length; i++) {
      mods.push(lmodules[i]);
    }
    for (i = 0; i < mods.length; i++) {
      mod = mods[i];
      if (checkLoaded(mod)) {
        mod.notify = exec(mod.notify);
      }
    }
    mods = [];
    for (i = 0; i < lmodules.length; i++) {
      mod = lmodules[i];
      if (!mod.loaded) {
        mods.push(mod);
      }
    }
    lmodules = mods;

    if (lmodules.length === 0) {
      monitors = exec(monitors);
    } else {
      timer.start(25);
    }
  }
  
  function Loader() {
  }
  Loader.prototype.load = load;
  Loader.prototype.loadMany = loadMany;
  Loader.prototype.wait = wait;

  module.exports = new Loader();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  /** @constructor */
  function Timer(cb, delay, arg) {
    this._cb = cb;
    this.start(delay, arg);
  }
  Timer.prototype.start = function (delay, arg) {
    this.reset();
    if (!delay && delay !== 0) {
      return;
    }
    
    this._timer = setTimeout(this._cb, delay, arg);
  };
  Timer.prototype.reset = function () {
    if (this._timer) {
      this._timer = clearTimeout(this._timer) || null;
    }
  };
  
  module.exports = Timer;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event = __webpack_require__(2);

  function rpcMethodOneWay() {
  }
  function rpcMethodCallback() {
  }
  function rpcMethodPromise() {
  }
 
  var rpcEventBroadcast = new Event(); 
  var rpcEventUnicast = new Event();

  var RPCSchemaDefs = {
    methodOneWay: rpcMethodOneWay,
    methodCallback: rpcMethodCallback,
    methodPromise: rpcMethodPromise,

    eventBroadcast: rpcEventBroadcast,
    eventUnicast: rpcEventUnicast
  };

  module.exports = RPCSchemaDefs;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(8);
  var LiteralMap = __webpack_require__(25);
  var Guid = __webpack_require__(26);
  var Promise = __webpack_require__(0);
  var Utils = __webpack_require__(1);
  var fetchproxy = __webpack_require__(10);

  var chrome = __webpack_require__(7);

  var JWT = __webpack_require__(46);
  var OAuthInteractive = __webpack_require__(47);

  var authMap = new LiteralMap({
    state: 'state', clientUrl: 'redirect_uri', responseType: 'response_type', clientId: 'client_id', resource: 'resource',
    scope: 'scope', prompt: 'prompt', accessType: 'access_type', approvalPrompt: 'approval_prompt', loginHint: 'login_hint',
    nonce: 'nonce', incremental: 'include_granted_scopes', clientSecret: 'client_secret', grantType: 'grant_type',
    code: 'code', refreshToken: 'refresh_token'
  });
  var responseMap = new LiteralMap({
    token: 'access_token', tokenType: 'token_type', idToken: 'id_token', expiry: 'expires_in', scope: 'scope', state: 'state',
    accountIndex: 'authuser', accountDomain: 'hd', prompt: 'prompt', sessionState: 'session_state', code: 'code', refreshToken: 'refresh_token',
  });

  function encode(s) {
    //return encodeURIComponent(s);
    return s;
  }  
  function applyArgument(context, key) {
    context.args.push(key + '=' + encode(context.opt[key]));
    return context;
  }
  function prepareArgs(args) {
    args = Object.getOwnPropertyNames(args).reduce(applyArgument, { args: [], opt: args }).args;
    return args.join('&');
  }
  function prepareUrl(url, args) {
    args = prepareArgs(args);
    if (url.indexOf('?') === -1) {
      return url + '?' + args;
    } else {
      return url + encodeURIComponent('?' + args);
    }
  }
  function prepareMappedUrl(url, args) {
    args = authMap.mapDirect(args);
    return prepareUrl(url, args);
  }

  function getToken(provider, args) {
    args = authMap.mapDirect(args);
    args = prepareArgs(args);
    Utils.showLogInfo('identity: OAuthProvider.getToken, provider: ' + (provider || { }).clientType + ', args', args);
    var opt = { 'method': 'POST', 'body': args, 'headers': { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' } }; 
    return fetchproxy(provider.urlToken, opt).then(function (r) {
      try {
        return r.json();
      } catch (e) {
        Utils.showLogInfo('identity: OAuthProvider.getToken, error: ' + e.message + ', r: ' + r.toString());
        return Promise.reject({ error: { fetch: true } });
      }
    });
  }
  function getTokenByCode(provider, code, state) {
    var args = { clientId: provider.clientId, clientSecret: provider.clientSecret, clientUrl: provider.clientUrl, grantType: 'authorization_code', code: code, state: state };
    return getToken(provider, args).then(function (r) {
      //debugger;
      r = responseMap.mapReverse(r);
      r = provider.extractInteractiveResult(r);
      return r;
    });
  }
  function getTokenByRefreshToken(provider, refreshToken) {
    var args = { clientId: provider.clientId, clientSecret: provider.clientSecret, clientUrl: provider.clientUrl, grantType: 'refresh_token', refreshToken: refreshToken };
    Utils.showLogInfo('identity: OAuthProvider.getTokenByRefreshToken, provider: ' + (provider || { }).clientType + ', args', args);
    return getToken(provider, args).then(function (r) {
      if (r && r.error) { // r = { error: { message: ..., code: ... } } if refreshToken is bad
        Utils.showLogInfo('identity: OAuthProvider.getTokenByRefreshToken error', r);
        return Promise.reject(); // reject no result
      }
      r = responseMap.mapReverse(r);
      r = provider.extractInteractiveResult(r);
      return r;
    });
  }
  function getTokenInteractive(provider, opt) {
    Utils.showLogInfo('identity: OAuthProvider.getTokenInteractive, provider: ' + (provider || { }).clientType + ', opt', opt, ['cancelToken'], true);
    var args = provider.getInteractiveArgs(opt);
    var url = opt.logout ?  provider.urlLogout : provider.urlLogin;
    url = url || provider.urlLogin;
    url = prepareMappedUrl(url, args);

    //!! adjust no ui
    opt.nosilent = true;

    return OAuthInteractive({ url: url, redirect: provider.clientUrl, state: args.state, cancelToken: opt.cancelToken, noui: opt.noui, nosilent: opt.nosilent, asyncui: opt.asyncui, logout: opt.logout }).then(function (r) {
      Utils.showLogInfo('identity: OAuthProvider getTokenInteractive resolved', r);
      r = responseMap.mapReverse(r);
      if (r.code) {
        return getTokenByCode(provider, r.code, args.state);
      }
      r = provider.extractInteractiveResult(r);
      Utils.showLogInfo('identity: OAuthProvider getTokenInteractive, extractInteractiveResult', r);
      return r;
    });
  }
  
  function exec(cmd, cancel) {
    var ap = [cmd];
    if (cancel) {
      ap.push(cancel);
    }
    return Promise.race(ap);
  } 

  function validateCache(provider, opt) {
    Utils.showLogInfo('identity: OAuthProvider.validateCache');
    var info;
    if (provider.storage) {
      if (opt.primary) {
        info = provider.storage.getPrimary();
      } else if (opt.userId) {
        info = provider.storage.getByType(provider.clientType, opt.userId);
      }
    }
    if (info) {
      if (info.accountsUrl && info.accountsUrl === provider.urlRoot) {
        var dt = Date.now();
        if (opt.login) {
          if ((info.identity && (new Date(info.identity.expiry).valueOf() > dt + 10000)) &&
            (info.token && (info.token.expiry.valueOf() > dt + 10000)))
          {
            Utils.showLogInfo('identity: OAuthProvider.validateCache resolve', info);
            return Promise.resolve(info);
          }
          Utils.showLogInfo('identity: OAuthProvider.validateCache expired', { 'identityExpiry': (info.identity || { }).expiry, 'tokenExpiry': (info.token || { }).expiry });
        } else {
          if (info.token && (info.token.expiry.valueOf() > dt + 10000)) {
            Utils.showLogInfo('identity: OAuthProvider.validateCache resolve', info);
            return Promise.resolve(info);
          }
          Utils.showLogInfo('identity: OAuthProvider.validateCache expired', { 'tokenExpiry': (info.token || { }).expiry });
        }
        if (provider.supportsOffline() && info.refreshToken) {
          var cmd = getTokenByRefreshToken(provider, info.refreshToken);
          return exec(cmd, opt.cancelToken);
        }
        Utils.showLogInfo('identity: OAuthProvider.validateCache no refresh', { 'offline': provider.supportsOffline(), 'refreshToken': info.refreshToken });
      }
      Utils.showLogInfo('identity: OAuthProvider.validateCache no url', { 'accounts': info.accountsUrl, 'provider':  provider.urlRoot });
    } else {
      Utils.showLogInfo('identity: OAuthProvider.validateCache no info');
    }
    var err = { error: { nocache: true } };
    Utils.showLogInfo('identity: OAuthProvider.validateCache reject', err);
    return Promise.reject(err);
  }
  function validate(provider, opt) {
    Utils.showLogInfo('identity: OAuthProvider.validate, provider: ' + (provider || { }).clientType + ', opt: ', opt, ['cancelToken'], true);
    if (opt.token) {
      if (opt.token.error) {
        return Promise.reject(new Error(opt.token.error));
      }
      return Promise.resolve({ token: opt.token });
    }
    return validateCache(provider, opt).then(null, function (res) {
      if (res && res.error && res.cancel) {
        return Promise.reject(res);
      }
      var cmd = getTokenInteractive(provider, opt);
      return exec(cmd, opt.cancelToken);
    }).then(null, function (res) {
      return Promise.reject(res);
    });
  }
  
  /** @constructor */  
  function OAuthProvider() {
  }
  OAuthProvider.prototype.setStorage = function (storage) {
    this.storage = storage;
  };
  OAuthProvider.prototype.initUrls = function (opt) {
    opt = opt || {};
    this.urlRoot = opt.urlRoot || '';
    this.urlLogin = opt.urlLogin || '';
    this.urlLogout = opt.urlLogout || '';
    this.urlToken = opt.urlToken || '';
  };
  OAuthProvider.prototype.initClient = function (opt) {
    opt = opt || {};
    this.clientType = opt.clientType || this.clientType;
    this.clientId = opt.clientId || '';
    this.clientSecret = opt.clientSecret || '';
    this.clientUrl = opt.clientUrl || '';
  };
  OAuthProvider.prototype.supportsOffline = function () {
    return !!this.clientSecret;
  };
  OAuthProvider.prototype.supportsIncremental = function () {
    return true;
  };
  OAuthProvider.prototype.supportsOpenId = function () {
    return true;
  };

  OAuthProvider.prototype.applyPrompt = function (opt, args) {
    var prompt = [];
    if (!opt.userId) {
      prompt.push('select_account');
      //prompt.push('login');
    }
    if (opt.consent) {
      prompt.push('consent');
    }
    prompt = prompt.join(' ');
    //if (!prompt) {
    //  prompt = 'none';
    //}
    if (prompt) {
      args.prompt = prompt;
    }
  };
  OAuthProvider.prototype.applyOffline = function (opt, args) {
    if (this.supportsOffline() && opt.offline) {
      args.accessType = 'offline';
    }
  };
  OAuthProvider.prototype.applyIncremental = function (opt, args) {
    if (this.supportsIncremental()) {
      args.incremental = true;
    }
  };
  OAuthProvider.prototype.applyLoginHint = function (opt, args) {
    if (opt.userId) {
      args.loginHint = opt.userId;
    }
  };
  OAuthProvider.prototype.applyResponseType = function (opt, args) {
    if (this.supportsOffline()) {
      args.responseType = 'code';
    } else if (opt.login && this.supportsOpenId()) {
      args.responseType = 'token id_token';
    } else {
      args.responseType = 'token';
    }
  };
  OAuthProvider.prototype.applyLoginScope = function (scope) {
    scope.push('openid');
    scope.push('profile');
    scope.push('email');
  };
  OAuthProvider.prototype.applyScope = function (opt, args) {
    var scopes = [];
    if (opt.scopes) {
      for (var i = 0; i < opt.scopes.length; i++) {
        scopes.push(opt.scopes[i]);
      }
    }
    if (opt.login) {
      this.applyLoginScope(scopes);
    }
    args.scope = scopes.join(' ');
  };
  OAuthProvider.prototype.applyState = function (opt, args) {
    if (opt.state) {
      args.state = opt.state;
    } else {
      args.state = Guid.NewGuid().toString(); 
    }

    var id = location.hostname;
    if (chrome && chrome.runtime && chrome.runtime.id) {
      id = chrome.runtime.id;
    }

    if (location.protocol === 'moz-extension:') {
      id = 'MOZ:' + id;
    }
    if (location.protocol === 'ms-browser-extension:') {
      id = 'MSE:' + id;
    }
    if (location.protocol === 'https:') {
      var page = location.protocol + '//' + location.hostname + location.pathname;
      id = page.replace(/\/[^\/]*\.html/i, '/auth.html');
    }

    args.state = args.state + '---' + id + '---';
  };
  OAuthProvider.prototype.applyNonce = function (opt, args) {
    args.nonce = Guid.NewGuid().toString();
  };
  
  OAuthProvider.prototype.getInteractiveArgs = function (opt) {
    var args = { clientId: this.clientId, clientUrl: this.clientUrl };

    this.applyResponseType(opt, args);
    this.applyLoginHint(opt, args);
    this.applyIncremental(opt, args);
    this.applyOffline(opt, args);
    this.applyPrompt(opt, args);
    this.applyScope(opt, args);
    this.applyState(opt, args);
    this.applyNonce(opt, args);
    
    return args;
  };
  
  OAuthProvider.prototype.login = function (opt) {
    opt.login = true;
    return validate(this, opt);
  };
  OAuthProvider.prototype.logout = function (opt) {
    var self = this;
    if (self.storage) {
      self.storage.remove(opt);
    }
  };

  OAuthProvider.prototype.extractInteractiveResult = function (args) {
    var res = { };
    if (args.scope) {
      res.scope = args.scope.split(' ');
    }
    if (args.token) {
      var expiry = Date.now() + (0 | (args.expiry || 3600)) * 1000;
      res.token = { token: args.token, type: args.tokenType || 'Bearer', expiry: expiry };
    }
    if (args.refreshToken) {
      res.refreshToken = args.refreshToken;
    }
    if (args.idToken) {
      res.identity = new JWT(args.idToken);
    }
    if (args.accountDomain) {
      (res.account = res.account || {}).domain = args.accountDomain;  
    }
    if (args.accountIndex) {
      (res.account = res.account || {}).index = args.accountIndex;  
    }
    if (args.sessionState) {
      (res.account = res.account || {}).state = args.sessionState;  
    }
    return res;
  };  

  OAuthProvider.prototype.getUserInfo = function (r) {
    return Promise.resolve(r);
  };

  OAuthProvider.prototype._getUserInfo = function (r) {
    if (!r.userInfo) {
      return this.getUserInfo(r);
    } else {
      return Promise.resolve(r);
    }
  };
  OAuthProvider.prototype._saveUserInfo = function (r) {
    if (this.storage) {
      r.userId = r.userInfo.user;
      r.accountsUrl = this.urlRoot;
      this.storage.add(r);
    }
  };
  OAuthProvider.prototype._applyUserInfo = function (r) {
    var self = this;
    return self._getUserInfo(r).then(function (r) {
      self._saveUserInfo(r);
      return r;
    });
  };

  OAuthProvider.prototype.getToken = function (opt) {
    Utils.showLogInfo('identity: OAuthProvider.getToken', opt, ['cancelToken'], true);
    var self = this;
    return validate(this, opt).then(function (r) {
      Utils.showLogInfo('identity: OAuthProvider.getToken resolved', r);
      if (!r.token || !r.token.token) {
        var err = { error: { notoken: true } };
        Utils.showLogInfo('identity: OAuthProvider.getToken reject', err);
        return Promise.reject(err);
      }
      r.type = opt.type;
      r.primary = opt.primary;

      if (!opt.login) {
        return r.token.token;
      }
      return self._applyUserInfo(r);
    });
  };
  
  module.exports = Base.extend(OAuthProvider);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var dom = __webpack_require__(5);
  var Control = __webpack_require__(32);
  
  /** @constructor */
  function Action(opt) {
    //this.$super(opt).addClass('action').addClass(opt.cssClass).add(opt.text);
    this.$super(opt);
    this.addClass('action');
  }
  Action.prototype.create = function (opt) {
    return this.node || dom.a(opt).node;
  };
 
  module.exports = Control.extend(Action);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise      = __webpack_require__(0);
  var Log          = __webpack_require__(3);

  var i18n         = __webpack_require__(6);
  var office       = __webpack_require__(12);

  var roomsConfig  = __webpack_require__(27);
  var spacesConfig = __webpack_require__(28);

  var rooms        = __webpack_require__(29);
  var spaces       = __webpack_require__(30);

  var SOURCE_SPACES = 'spaces';
  var SOURCE_ROOMS = 'rooms';
  var KNOWN_SOURCES = [SOURCE_SPACES, SOURCE_ROOMS];

  var logger = Log.createLogger('INVITE');

  var store;
  var configuration;
  var configuredSources;

  function getStore() {
    if (!store) {
      store = office.getStore();
      if (!store) {
        throw ({ error: { nooffice: true } });
      }
    }
    return store;
  }

  function getStoreItem(key) {
    var item = getStore().get(key); // store: office, Storage.getItem(key);
    logger.info('Get store item \'' + key + '\': ' + ((typeof(item) === 'undefined' || item === null) ? 'not defined' : (item && item.length ? 'length = ' + item.length : '\'' + item.toString() + '\'')));
    return item;
  }

  function delStoreItem(key) {
    logger.info('Remove store item \'' + key + '\'');
    // getStore().del(key);
    getStore().set(key, ''); // set empty string instead of deleting key to avoid settings.remove() call
  }

  function setStoreItem(key, item) {
    logger.info('Set store item \'' + key + '\': ' + 'length = ' + item.length);
    getStore().set(key, item);
  }

  function getConfiguration(force) {
    var manual = false;
    if (force) {
      configuration = null;
    }
    if (!configuration) {
      var configurationItem = getStoreItem('configuration');
      if (!configurationItem) {
        configurationItem = getStoreItem('configuration-manual');
        manual = true;
      }
      if (configurationItem) {
        try {
          configuration = JSON.parse(configurationItem);
          configuration['manual'] = manual;
        } catch (e) {
          logger.error('Configuration parse error: ' + e.message);
        }
      }
      if (!configuration) {
        configuration = { };
      }
      logger.cred('Use stored configuration: ' + JSON.stringify(configuration), configuration['Password']);
    } else {
      logger.cred('Use cached configuration');
    }
    return configuration;
  }

  function setConfiguration(cfg, save) {
    configuration = cfg;
    configuredSources = null;
    if (save) {
      setStoreItem('configuration-manual', JSON.stringify(configuration));
    }
    configuration['manual'] = true;
  }

  function updateMeetingInfo() {
    logger.info('Force meeting info update');
    office.getLocation().then(function (res) {
      office.setLocation(res);
    }, function (err) {
      logger.error('Force meeting info update error: ', Log.getErrInfo(err));
    })
  }

  function resetConfiguration() {
    configuration = { };
    configuredSources = null;
    delStoreItem('configuration');
    delStoreItem('configuration-manual');
  }

  function getConfiguredSources(force) {
    if (force || !configuredSources) {
      getConfiguration(force);
      configuredSources = [];
      var srcConfigs = { };
      srcConfigs[SOURCE_ROOMS] = roomsConfig;
      srcConfigs[SOURCE_SPACES] = spacesConfig;
      Object.getOwnPropertyNames(srcConfigs).forEach(function (source) {
        try {
          var isValid = srcConfigs[source].isValid(configuration);
          logger.info(source + ' configuration validation: ' + isValid);
          if (isValid) {
            configuredSources.push(source);
          }
        } catch (err) {
          logger.error(source + ' configuration validation error: ', Log.getErrInfo(err));
        }
      });

      logger.info('Use configured sources: [ ' + configuredSources.toString() + ' ]');
      if (configuredSources.length === 0) {
        // configuredSources = null; // need retry???
        throw new Error('nosources');
      }
    } else {
      logger.info('Use cached configured sources');
    }
    return configuredSources;
  };

  function setSpacesOpt(spaces, cfg) {
    if (!cfg) {
      getConfiguration();
      cfg = configuration;
    }
    var spacesUri = cfg['AVAYA_CLOUD_SPACES_API_URI'] || cfg['AVAYA_CLOUD_SPACES_URI'];
    if (spacesUri) {
      spacesUri = spacesUri.replace('spaces.zang.io', 'spacesapis.zang.io');
      spaces.setOpt({ url: spacesUri });
    }
  };

 function getMeetingInfo(opt) {
    var getInfo = [];
    if (opt.location) {
      getInfo.push(office.getLocation());
    }
    if (opt.body) {
      var type = opt.type || '';
      getInfo.push(office.getDescription(type));
    }
    return Promise.all(getInfo);
  };

  function extractMeetingInfo(extractor) {
    logger.info('extractMeetingInfo extractor: ' + extractor);
    var sources;
    var languageId = 'en'; // default languageId
    return office.checkOffice().then(function () { // catch office.initialized flag
      ////sources = getConfiguredSources(true);
      ////if (sources.indexOf(SOURCE_SPACES) > 0) {
      ////  sources = sources.slice(0);
      ////  sources = sources.splice(sources.indexOf(SOURCE_SPACES), 1).concat(sources); // set spaces extractor first
      ////}
      sources = KNOWN_SOURCES;
      logger.info('extractMeetingInfo sources: [ ' + sources.join(', ') + ' ]');
      languageId = office.getLanguageSync() || languageId;
      return i18n.loadI18n(languageId);
    }).then(function(r) { // languageId
      languageId = r;
      var getters = [office.getLocation(), office.getDescription('')];
      if (office.webAPI) {
        getters.push(office.getDescription('html'));
      }
      return Promise.all(getters);
    }).then(function (r) {
      var location = r[0];
      var bodyText = r[1];
      var bodyHtml = r[2];
      var extractors = [ ];
      ////sources.forEach(function (name) {
      ////  switch (name) {
      ////    case SOURCE_SPACES:
            setSpacesOpt(spaces);
            extractors.push(spaces[extractor](bodyText));
      ////      break;
      ////    case SOURCE_ROOMS:
            extractors.push(rooms[extractor](JSON.stringify(getConfiguration()), languageId, location, office.webAPI ? bodyHtml : bodyText));
      ////      break;
      ////  }
      ////});
      return Promise.all(extractors);
    }).then(function (r) {
      var result = [];
      for (var i = 0; i < sources.length; i++) {
        result.push({ source: sources[i], info: r[i]});
      }
      return Promise.resolve(result);
    });
  }

  function extractMeetingInfoNative() {
    logger.info('extractMeetingInfoNative');
    return extractMeetingInfo('getInviteInfo').then(function (r) {
      logger.info('extractMeetingInfoNative meetings: [ ' + r.map(function (info) { return JSON.stringify(info); }).join(', ') + ' ]');
      for (var i = 0; i < r.length; i++) {
        var info = r[i].info;
        if (info && info.type !== 'empty') {
           info.type = info.type || r[i].source;
           info.isHost = typeof(info.isHost) === 'undefined' ? true : info.isHost;
           return info;
        }
      }
    }).catch (function (err) {
      logger.error('extractMeetingInfoNative error: ', Log.getErrInfo(err));
    }).then(function (info) { // finally
      info = info || { };
      info = { url: info.url || '', dial: info.dial || '', room: info.room || '', pin: info.pin || '', isHost: info.isHost || false, type: info.type || 'empty' };
      logger.info('extractMeetingInfoNative, info: ' + JSON.stringify(info));
      office.invokeCallback('meetingInfo', info);
    });
  }

  function getJoinMeetingUrl() {
    return extractMeetingInfo('getInviteUrl').then(function (r) {
      logger.info('getJoinMeetingUrl urls: [ ' + r.map(function (info) { return JSON.stringify(info); }).join(', ') + ' ]');
      for (var i = 0; i < r.length; i++) {
        var url = r[i].info;
        if (url) {
          var source = r[i].source;
          logger.info('getJoinMeetingUrl url: ' + url + ', source: ' + source);
          return Promise.resolve({ source: source, url: url });
        }
      }
      throw new Error('nomeetingurl');
    }).catch (function (err) {
      logger.error('getJoinMeetingUrl error: ' + Log.getErrInfo(err));
      return Promise.resolve();
    });
  }

  window.extractMeetingInfoNative = extractMeetingInfoNative;

  function clear() {
    configuration = null;
    configuredSources = null;
  }

  document.title = 'bkgLoaded';

  module.exports = {
    getConfiguration: getConfiguration,
    setConfiguration: setConfiguration,
    resetConfiguration: resetConfiguration,
    getConfiguredSources: getConfiguredSources,
    updateMeetingInfo: updateMeetingInfo,
    setSpacesOpt: setSpacesOpt,
    getMeetingInfo: getMeetingInfo,
    getJoinMeetingUrl: getJoinMeetingUrl,
    clear: clear
  };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var partyType = {
    member: 'member',
    guest: 'guest'
  };

  module.exports = partyType;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var appStates = ["Unknown",
    "Initializing", "NotInitialized", "Initialized",
    "Configuring", "NotConfigured", "Configured",
    "SrcInitializing", "SrcNotInitialized", "SrcInitialized"];

  var srcStates = ["Unknown",
    "Initializing", "NotInitialized", "Initialized",
    "Authorizing", "NotAuthorized", "Authorized",
    "Unauthorizing", "NotUnauthorized", "Unauthorized",
    "Fetching", "NotFetched", "Fetched",
    "Checking", "NotChecked", "Checked"];

  var states = { };

  states.App = appStates.reduce(function (r, n, i) {
    r[n] = i;
    return r;
  }, { });
  states.App.names = appStates;

  states.Src = srcStates.reduce(function (r, n, i) {
    r[n] = i;
    return r;
  }, { });
  states.Src.names = srcStates;

  module.exports = states;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event = __webpack_require__(2);
  var Promise = __webpack_require__(0);
  var PromiseCancel = __webpack_require__(40);
  var Utils = __webpack_require__(1);
  
  var OAuth = __webpack_require__(41);
  //var OAuthGeneric = require('/lib/jsl/id/oauth.provider');
  var OAuthGoogle = __webpack_require__(43);
  var OAuthSalesforce = __webpack_require__(50);
  var OAuthEsna = __webpack_require__(51);
  var OAuthMicrosoft = __webpack_require__(52);

  var OnEsna = __webpack_require__(53);

  var channel = __webpack_require__(55);

  var schema = __webpack_require__(60);
  var states = __webpack_require__(22); 
  
  function updateState(identity, account, state) {
    if (account.state !== state) {
      Utils.showLogInfo('Identity: model.updateState', { account: account, state: state });
      account.state = state;
      identity.onAccount.dispatch(account);
    }
  }
  function cancelCommand(pending, id) {
    var p = pending[id];
    if (!p) {
      return Promise.resolve();
    }
    delete pending[id];
    // return p.cancel();
    p.cancel();
    return p;
  }

  
  /** @constructor */
  function Identity() {
    this.accounts = {};
    this.pending = {};
    this.tokens = {};

    this.onesna = new OnEsna();

    this.onAccount = new Event();
    this.onAccounts = new Event();

    this.onPrimary = new Event();

    channel.onConnect.addListener(this.evConnect, this);
  }
  Identity.prototype._schema = schema;
  Identity.prototype.state = states;
  Identity.prototype.providers = { google: OAuthGoogle, esna: OAuthEsna, salesforce: OAuthSalesforce, microsoft: OAuthMicrosoft };

  Identity.prototype.init = function (opt) {
    this.oauth = new OAuth({ key: opt.app, allowSave: opt.allowSave });
    var items = opt.providers || [];
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var provider = new item.provider();
      provider.init(item);
      this.oauth.registerProvider(provider);
    }
  };
  Identity.prototype.shut = function () {
    this.logout();
  };

    
  Identity.prototype.evConnect = function (portInfo) {
    if (portInfo.id) {
      this.onAccounts.dispatch(portInfo.id, this.accounts);
    }
  };

  // login  
  Identity.prototype.login = function (opt) {
    if (!this.oauth) { // not initialized yet... (init moved from loading to get ready storage in Office case)
      var providers = service.providers;
      var accountsUrls = opt.accountsUrls || { };
      service.init({
        app: 'zangAgenda',
        allowSave: true,
        providers: [
          // onesna
          { primary: true, provider: providers.esna, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '7edbde34c699f670da574d047a6d409bb74d7cfad40980d3a3d1826495548428', clientSecret: '7375341cc70b0bb02463ca2ad78782a2' }, accountsUrl: accountsUrls.esna },
          // google
          { primary: false, provider: providers.google, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '132802444345-nni4g5350ou4afgddedcc4shofjbja70.apps.googleusercontent.com' /*clientSecret: 'HZHq0ZAzmzijXsXmSo7IQBE3'*/ } },
          // office 365
          //{ primary: false, provider: providers.microsoft, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '472976097227.apps.googleusercontent.com' /*clientSecret: 'eXC0s4A36ONswicIvN8HNws_'*/ } },
          // salesforce
          //{ primary: false, provider: providers.salesforce, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '472976097227.apps.googleusercontent.com' /*clientSecret: 'eXC0s4A36ONswicIvN8HNws_'*/ } },
        ],
        accountsUrls: opt.accountsUrls || { }
      });
    }
    opt = opt || {};
    return this.createAccount({ type: this.providers.esna.clientType, primary: true, scopes: ['https://www.onesna.com/auth/logan'], accountsUrl: (opt.accountsUrls || { }).esna, noui: opt.noui, asyncui: opt.asyncui, logout: opt.logout, token: opt.token });
  };
  // Logout
  Identity.prototype.logout = function () {
    Utils.showLogInfo('Identity: model.logout');
    this.onesna.shut();
    if (this.oauth) {
      this.oauth.storage.clear();
      return this.removeAccount({ primary: true });
    } else {
      return Promise.resolve();
    }
  };

  // get token
  Identity.prototype.getToken = function (opt) {
    Utils.showLogInfo('Identity: model.getToken', opt);
    var id = opt.primary ? 'primary' : (opt.id || ('' + Date.now()));
    var account = this.accounts[id];
    if (account) {
      if (account.state !== states.Authorized) { // exclude state switch if Authorized (due to periodic poll requests)
        updateState(this, account, states.Authorizing);
      }
      if (this.pending[id]) {
        return this.pending[id];
      }
    } else {
      var err = { error: { noitem: true } };
      Utils.showLogInfo('Identity: model.getToken reject', err);
      return Promise.reject(err);
    }
    
    var token = this.tokens[account.id];
    if (token) {
      var dtn = Date.now();
      token = token.token;
      
      if (token && (dtn < (token.expiry - 60000))) {
        Utils.showLogInfo('Identity: model.getToken resolve', token);
        return Promise.resolve(token);
      }
    }

    var pc = new PromiseCancel();
    var args = { type: account.info.type, primary: opt.primary, login: true, noui: true, userId: account.info.user, scopes: account.info.scopes, cancelToken: pc.token };  
    var self = this;
    
    var cmd = this.oauth.getToken(args);
    // var pending = this.pending[id] = pc.exec(cmd);
    var pending = this.pending[id] = pc.exec(cmd).then(function (res) {
      Utils.showLogInfo('Identity: model.getToken resolved', res);
      delete self.pending[account.id];
      self.tokens[account.id] = res;
      updateState(self, account, states.Authorized);
      Utils.showLogInfo('Identity: model.getToken resolve', res.token);
      return Promise.resolve(res.token);
    }, function (err) {
      Utils.showLogInfo('Identity: model.getToken rejected', err);
      delete self.pending[account.id];
      delete self.tokens[account.id];

      if (account.primary) {
        self.removePrimaryAccount();
      }
      updateState(self, account, states.Unauthorized);
      Utils.showLogInfo('Identity: model.getToken reject', err);
      return Promise.reject(err);
    });
    return pending;
  };

  // providers
  Identity.prototype.getProviders = function () {
  };

  // accounts
  Identity.prototype.getPrimaryAccount = function () {
    return this.accounts['primary'];
  };
  Identity.prototype.getAccounts = function () {
    return this.accounts;
  };

  // account operations
  Identity.prototype.createAccount = function (opt) {
    Utils.showLogInfo('Identity: model.createAccount', opt);
    var id = opt.primary ? 'primary' : (opt.id || ('' + Date.now()));
    var account = this.accounts[id];
    if (account) {
      if (this.pending[id]) {
        return this.pending[id];
      }
    } else {
      var enabled = typeof (opt.enabled) === 'undefined' ? true : opt.enabled;
      account = { id: id, info: { type: opt.type, primary: !!opt.primary, user: opt.user || '', enabled: enabled, scopes: opt.scopes || [] }, state: states.Unknown };
      this.accounts[id] = account;
    }

    if (!account.info.enabled) {
      updateState(this, account, states.Unauthorized);
      return Promise.reject({ error: { disabled: true } });
    }

    var pc = new PromiseCancel();
    var args = { type: account.info.type, primary: account.info.primary, login: true, noui: opt.noui, asyncui: opt.asyncui, logout: opt.logout, token: opt.token, userId: account.info.user, scopes: account.info.scopes, cancelToken: pc.token, offline: true };
    var self = this;
    
    updateState(this, account, states.Authorizing);

    var cmd = this.oauth.getToken(args);
    var pending = this.pending[id] = pc.exec(cmd);
    
    return pending.then(function (res) {
      Utils.showLogInfo('Identity: model.createAccount resolved', res);
      account.info.enabled = true;
      delete self.pending[account.id];

      if (res.identity) {
        account.info.user = res.identity.email || account.info.user;
      }      
      if (res.userInfo) {
        account.userInfo        = account.userInfo || {};
        account.userInfo.name   = res.userInfo.name;
        account.userInfo.user   = res.userInfo.user;
        account.userInfo.image  = res.userInfo.image;
        account.info.user       = account.info.user || res.userInfo.user;
      }

      if (!account.info.primary) {
        var ids = Object.getOwnPropertyNames(self.accounts);
        for (var i = 0; i < ids.length; i++) {
          var user = self.accounts[ids[i]];
          if ((user.info.type === account.info.type) && (user.info.user === account.info.user) && (user.id !== account.id)) {
            self.removeAccount({ id: account.id });
            account = user;
          }
        }
      }

      self.tokens[account.id] = res;
 
      if (account.info.primary) {
        self.onesna.init({ sku: '', getToken: self.getToken.bind(self, { primary: true }), accountsUrl: opt.accountsUrl });
        return self.onesna.loadProfileSection('accounts').then(function (r) {
          //self.onesna.saveProfileSection('accounts', []).then(function (r) { }, function (r) { });

          self.restoreAccounts(r).then(function (r) {
          }, function (e) {
          });
          
          self.onPrimary.dispatch({ connected: true });
          
          updateState(self, account, states.Authorized);
          return res;
        });
      } else {
        self.saveAccounts();
      }

      updateState(self, account, states.Authorized);
      return Promise.resolve(res);
    }, function (err) {
      Utils.showLogInfo('Identity: model.createAccount rejected', err);
      delete self.pending[account.id];
      delete self.tokens[account.id];

      if (account.primary) {
        self.removePrimaryAccount();
      } else if (account.info.user) {
        account.info.enabled = false;
        self.saveAccounts();
      } else {
        self.removeAccount(account);
        return Promise.reject(err);
      }
      
      updateState(self, account, states.Unauthorized);
      return Promise.reject(err);
    });
  };
  
  Identity.prototype.updateAccount = function (opt) {
    Utils.showLogInfo('Identity: model.getToken updateAccount', opt);
    var account = this.accounts[opt.id];
    if (!account) {
      return Promise.reject({ error: { noitem: true } });
    }

    if (opt.enabled && !account.info.enabled) {
      account.info.enabled = true;
      account.state = states.Unknown;
      updateState(this, account, states.Unauthorized);
      return this.createAccount({ id: opt.id, noui: false });
    } else if (!opt.enabled && account.info.enabled) {
      account.info.enabled = false;
      account.state = states.Unknown;
      delete this.tokens[account.id];
      updateState(this, account, states.Unauthorized);
      this.saveAccounts();
      return cancelCommand(this.pending, account.id);
    }

    updateState(this, account, account.state);
    return Promise.resolve(account);
  };
  
  Identity.prototype.removeAccount = function (opt, logout) {
    Utils.showLogInfo('Identity: model.removeAccount', {opt: opt, logout: logout });
    var id, account;
    if (opt.primary) {
      return this.removePrimaryAccount();
    }

    id = opt.id;    
    account = this.accounts[id];
    if (!account) {
      return Promise.reject({ error: { noitem: true } });
    }
    
    Utils.showLogInfo('Identity: model.removeAccount delete', account);
    delete this.accounts[id];
    account.deleted = true;
    account.state = states.Unknown;

    updateState(this, account, states.Unauthorized);
    if (!logout) {
      this.saveAccounts();
    }

    var args = { type: account.info.type, primary: account.info.primary, userId: account.info.user };  
    this.oauth.logout(args);

    return cancelCommand(this.pending, id);
  };
  Identity.prototype.removePrimaryAccount = function () {
    Utils.showLogInfo('Identity: model.removePrimaryAccount');
    this.onPrimary.dispatch({ connected: false });
    
    var id, account, primary;
    var keys = Object.getOwnPropertyNames(this.accounts);
    for (var i = 0; i < keys.length; i++) {
      id = keys[i];
      account = this.accounts[id];
      if (!account.info.primary) {
        this.removeAccount(account, true).then(function () { });
      } else {
        primary = account;
        return this.removeAccount({ id: primary.id }, true);
      }
    }
    return Promise.reject({ error: { noitem: true } }); // ???
  };

  Identity.prototype.restoreAccounts = function (accounts) {
    if (!accounts) {
      return Promise.resolve({ done: true });
    }
    var item = accounts.shift();
    if (!item) {
      return this.saveAccounts();
    }
    var self = this;
    return this.createAccount({ user: item.user, type: item.type, enabled: item.enabled, scopes: item.scopes || [] }).then(function (r) {
      r = r;
      self.restoreAccounts(accounts);
    }, function (e) {
      e = e;
      self.restoreAccounts(accounts);
    });
  };
  
  Identity.prototype.saveAccounts = function () {
    var items = Object.getOwnPropertyNames(this.accounts);
    var p = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item = this.accounts[item];
      
      if (item && !item.info.primary) {
        var info = { type: item.info.type, enabled: item.info.enabled, user: item.info.user, scopes: item.info.scopes };
        if (info.user) {
          p.push(info);
        }
      }
    }
    return this.onesna.saveProfileSection('accounts', p);
  };


  var service = new Identity();

  module.exports = service;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var states = {
    Unknown: 0,
    Unauthorized: 1,
    Authorizing: 2,
    Authorized: 3,
    Unauthorizing: 4,
    LicenseCheck: 5,
    AcceptLicense: 6,
    LoadProfile: 7
  };

  module.exports = states;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(8);
  var Log = __webpack_require__(3);

  var logger = Log.createLogger('API');

  function API(serverBase) {
    this.serverBase = serverBase;
  }
  
  API.prototype._prepareValue = function (def, value) {
    var flags = def.flags;
    if (typeof(value) === 'undefined') {
      value = def.default;
    }
    
    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      switch (flag) {
        case 's':
          // if (typeof(value) !== 'string') {
          //   logger.warn(def.key + ': should be valid string');
          // }
          if (typeof(value) !== 'undefined') {
            value = '' + value;
          }
          break;
        case 'S':
          // if (typeof(value) !== 'string') {
          //   logger.warn(def.key + ': should be valid string');
          // }
          if (typeof(value) !== 'undefined') {
            value = '' + value;
            // if (value.length === 0) {
            //   logger.warn(def.key + ': should be non-empty string');
            // }
          }
          break;
        case 'b':
          // if (typeof(value) !== 'boolean') {
          //   logger.warn(def.key + ': should be valid boolean');
          // }
          break;
        case 'B':
          // if (typeof(value) !== 'string') {
          //   logger.warn(def.key + ': should be base64 string');
          // }
          if (value) {
            value = atob(value);
          }
          value = value || '';
          break;
        case 'i':
          if (typeof(value) !== 'number') {
            // logger.warn(def.key + ': should be valid number');
            value = 0 | value;
          }
          break;
        case 'e':
          // if (typeof(value) !== 'string') {
          //   logger.warn(def.key + ': should be valid string');
          // }
          break;
        case 'r':
          // if (typeof(value) === 'undefined') {
          //   logger.error(def.key + ': value is required');
          // }
          break;
        case 'D':
          // if (typeof(value) !== 'string') {
          //   logger.warn(def.key + ': should be valid string');
          // }
          break;
      }
    }

    if (def.format && (typeof(value) !== 'undefined')) {
      value = def.format.replace(/\$0/ig, value);
    }

    return value;
  };
  API.prototype._prepareArgs = function (command, args) {
    var argsDefs = command.args;
    var argsKeys = Object.getOwnPropertyNames(argsDefs);

    var self = this;
    return argsKeys.reduce(function (res, key) {
      var def = argsDefs[key];
      res[def.key] = self._prepareValue(def, args[key]);
      return res;
    }, { });
  };
  API.prototype._extractVars = function (template) {
    var re = /\$\([^\)]*\)/ig;
    for (var items = {}, m; !!(m = re.exec(template)); ) {
      items[m[0]] = 1;
    }
    return Object.getOwnPropertyNames(items);
  };
  API.prototype._replaceAll = function (s, f, r) {
    var re = new RegExp(f.replace(/([^a-z0-9])/ig, '\\$1'), 'ig');
    return s.replace(re, r);
  };
  API.prototype._substitute = function (template, args) {
    if (!template) {
      return null;
    }

    var self = this;
    var keys = Object.getOwnPropertyNames(template);
    return keys.reduce(function (res, key) {
      var t = template[key];
      res[key] = self._extractVars(t).reduce(function (r, key) {
        var v = args[key];
        if (r === key) {
          return v;
        }
        return self._replaceAll(r, key, v);
      }, t);
      if (typeof(res[key]) === 'undefined') {
        delete res[key];
      }
      return res;
    }, { });
  };
  API.prototype._extractData = function (schema, data, index) {
    var self = this;
    var keys = Object.getOwnPropertyNames(schema);
    return keys.reduce(function (res, key) {
      if (typeof(res) === 'undefined') {
        return;
      }

      var def = schema[key];

      if (Array.isArray(def)) {
        res[key] = [];
        var item, ndx = 0;
        while (!!(item = self._extractData(def[0], data, ndx++))) {
          res[key].push(item);
        }
      } else if (def.$v) {
        res[key] = self._extractData(def.$v, data);
      } else {
        var path = def.key.replace(/\.\#\./ig, '.' + index + '.').split('.');

        var c = data;
        for (var j = 0; j < path.length; j++) {
          c = c[path[j]];
          if (typeof(c) === 'undefined') {
            if (('' + index) === path[j]) {
              return;
            }
            break;
          }
        }
        c = self._prepareValue(def, c);
        if (typeof (c) !== 'undefined') {
          res[key] = c;
        }
      }

      return res;
    }, {});
  };

  API.prototype._exec = function (command, args) {
    var _args = this._prepareArgs(command, args);

    var _body = this._substitute(command.body, _args);
    var _hdrs = this._substitute(command.headers, _args);
    var _uri  = this._substitute({ uri: command.uri }, _args);

    var uri  = this.serverBase + _uri.uri;
    var hdrs = _hdrs || {};
    var body = null;
    if (command.headers['content-type'] === 'application/x-www-form-urlencoded') {
      body = Object.getOwnPropertyNames(_body).reduce(function (r, key) {
        r.push(key + '=' + _body[key]);
        return r;
      }, []).join('&');
    } else {
      body = _body ? JSON.stringify(_body) : null;
    }

    var opt = { method: command.method, mode: 'cors', headers: hdrs || {}, body: body };
    if (!body) {
      delete opt.body;
    }

    var self = this;
    logger.info('fetch: ' + uri);
    return fetch(uri, opt).then(function (r) {
      logger.info('fetch:result: ' + r.ok);
      if (!r.ok) {
        throw { error: { httpStatus: r.status, httpStatusText: r.statusText }};
      }
      return r.json();
    }, function (e) {
      logger.error('fetch:error: ' + e.message);
      throw { error: { fetch: true }};
    }).then(function (r) {
      logger.info('fetch:payload: ' + JSON.stringify(r));
      var res = self._extractData(command.response, r);
      return res;
    });
  };

  module.exports = Base.extend(API);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  function reverse(context, key) {
    context.reverse[context.direct[key]] = key;
    return context;
  }
  function applyProperty(context, key) {
    var _key = context.map[key];
    if (_key) {
      var val = context.src[key];
      if (typeof (val) !== 'undefined') {
        context.dst[_key] = val;
      }
    }
    return context;
  }

  /** @constructor */  
  function LiteralMap(map) {
    this.direct = map;
    this.reverse = {};
    Object.getOwnPropertyNames(map).reduce(reverse, this);
  }
  LiteralMap.prototype.mapDirect = function (src, dst) {
    return Object.getOwnPropertyNames(src).reduce(applyProperty, { dst: dst || { }, src: src, map: this.direct }).dst;
  };
  LiteralMap.prototype.mapReverse = function (src, dst) {
    return Object.getOwnPropertyNames(src).reduce(applyProperty, { dst: dst || { }, src: src, map: this.reverse }).dst;
  };

  module.exports = LiteralMap;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var globals = __webpack_require__(4);
  
  function hex(v) {
    var n = Math.abs(v).toString(16);
    return (n.length === 1) ? '0' + n : n;
  }
  function toUid(v) {
    var r = Array.prototype.map.call(v, hex);
    return r.join('').toUpperCase();
  }
  function toHex(s) {
    var r = [];
    for (var i = 0; i < s.length; i++) {
      r.push(hex(s.charCodeAt(i)));
    }
    return r.join('');
  }
  function formatUid(uid) {
    var s = '';
    for (var i = 0; i < uid.length; i++) {
      s += hex(uid[i]);
      if ((i === 5) || (i === 7) || (i === 9) || (i === 11)) {
        s += '-';
      }
    }
    return s.toUpperCase();
  }
  function getUid() {
    var r;
    var crypto = globals.safeProp('crypto', { });
    if (globals.hasKey('getRandomValues', crypto)) {
      r = crypto.getRandomValues(new Int8Array(16));
    }
    if (!r) {
      r = [];
      for (var i = 0; i < 16; i++) {
        r.push(Math.ceil(Math.random() * 255));
      }
    }
    return r;
  }

  function Guid(r) {
    this.guid = r;
  }
  Guid.prototype.toString = function () {
    return formatUid(this.guid);
  };
  Guid.NewGuid = function () {
    return new Guid(getUid());
  };
  
  module.exports = Guid;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  /** @constructor */
  function SrcConfig() {
  }

  SrcConfig.prototype.isValid = function(configuration) {
    return !!configuration['UNIFIEDPORTALENABLED'] ||
      !!configuration['CONFERENCE_MODERATOR_URL'] ||
      !!configuration['CONFERENCE_PARTICIPANT_URL'];
  };

  module.exports = new SrcConfig();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var office = __webpack_require__(12);

  /** @constructor */
  function SrcConfig(configuration) {
  }

  function checkMinVersion(version, major, minor) {
    console.info('checkMinVersion:', version, major, minor);
    if (!version || typeof(version) !== 'string') {
      return false;
    }
    var nums = version.split('.').map(function (num) {
      return parseInt(num);
    });
    var numMajor = nums[0] || 0;
    if (major < numMajor) {
      return true;
    }
    if (major > numMajor) {
      return false;
    }
    if (major < numMajor) {
      return true;
    }
    var numMinor = nums[1] || 0;
    return minor <= numMinor;
  }

  SrcConfig.prototype.isValid = function(configuration) {
    // uncomment before 3.4 release
    if (true) {
    // if (office.webAPI || checkMinVersion(office.apiVersion, 3, 4)) { // check apiVersion major/minor
      // this is deprecated but was referenced in SRAD
      //var eac = configuration['ENABLE_AVAYA_CLOUD'];
      //if (typeof(eac) === 'undefined') {
      //  eac = true;
      //}

      // this is new way of zang enablement control
      var eaca = configuration['ENABLE_AVAYA_CLOUD_ACCOUNTS'];
      if (typeof(eaca) === 'undefined') {
        eaca = true;
      }

      if (eaca) {
        // SRAD change Feb 01 2018
        var acl = configuration['AVAYA_CLOUD_LOGIN_ID'];
        if ((typeof(acl) === 'undefined') || !!acl) {
          return true;
        }
      }
    }
    return false;
  };

  module.exports = new SrcConfig();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var Storage = __webpack_require__(11);
  var Log     = __webpack_require__(3);

  var RoomsSettings = __webpack_require__(35);
  var RoomsAPI = __webpack_require__(36);
  var TOM = __webpack_require__(37);
  var Templates = __webpack_require__(38);

  var logger = Log.createLogger('ROOMS');

  function Rooms() {
    this.rooms = {};
  }

  Rooms.prototype.setConfig = function (config) {
    logger.info('setConfig, refresh: ' + config.forceRefresh);
    this.config = config;
    this.config.cacheKey = 'rooms.v2';
    
    var portalInfo = this._extractPortalInfo(this.config.portalUri);
    this.config.serverBase = portalInfo.serverBase;
    this.config.tenantId = portalInfo.tenantId;

    this.config.conferenceRoomName = 'Default';
    if (this.config.conferenceType === 'aac') {
      this.config.conferenceRoomName = this.i18n.aacRoomName || 'Default AAC';
      this.config.locationFormatConference = '$(bridgeNumber),,,$(room), $(conferenceJoinUrl)';
    } else if (this.config.conferenceType === 'ipo') {
      this.config.conferenceRoomName = this.i18n.ipoRoomName || 'Default IP Office';
      this.config.locationFormatConference = '$(bridgeNumber),,,$(room), $(conferenceJoinUrl)';
    }

    this.config.locationFormatEquinox = '$(portalJoinUrl)$(room)$(pinE164)';

    if (this.config.forceRefresh) {
      this._updateTokenInfo(null);
      this._updateCachedRooms(null);
    }
    this.roomsAPI = new RoomsAPI(config.serverBase);
  };

  Rooms.prototype.configure = function (configuration, languageId, i18n) {
    if (this.config) {
      return Promise.resolve(this.config);
    }
    logger.info('configure, languageId: ' + languageId);
    this.i18n = i18n || this.i18n || { };
    var self = this;
    return RoomsSettings.getAPIConfig(configuration, languageId).then(function (config) {
      self.setConfig(config);
      return Promise.resolve(config);
    });
  };

  Rooms.prototype._safeJSONParse = function (s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return {};
    }
  };

  Rooms.prototype._extractPortalInfo = function (url) {
    var re = /(https?\:\/\/)?([^\/\:]*):?([0-9]*)?\/?(.*tenants\/([^\/]*))?/i;
    var m = re.exec(url);
    var proto = m[1] || 'https://';
    var server = m[2];

    var port = m[3] || '443';
    port = (port === '443') ? '' : ':' + port;

    var tenantId = m[5] || 'default';
      return { serverBase: proto + server + port, tenantId: tenantId };
  };

  Rooms.prototype._fetchTokenInfo = function () {
    var key = 'token:' + this.config.user;
    var stokenInfo = Storage.getItem(key);
    logger.info('token, use cached token ' + key + ':' + stokenInfo);
    var tokenInfo = stokenInfo ? this._safeJSONParse(stokenInfo) : null;
    return tokenInfo; // comment this to skip token check & refresh
    var dtn = Date.now();
    if (tokenInfo && (tokenInfo.expires || 0) - dtn < 60 * 1000) {
      logger.info('token, expired cached token ' + key + ':' + stokenInfo);
      tokenInfo = null;
      this._updateTokenInfo(null);
    }
    return tokenInfo;
  };
  Rooms.prototype._updateTokenInfo = function (info) {
    var key = 'token:' + this.config.user;
    if (!info) {
      if (Storage.getItem(key)) {
        logger.info('token, remove cached token ' + key);
      }
    } else {
      var stokenInfo = JSON.stringify(info);
      if (Storage.getItem(key) !== stokenInfo) {
        Storage.setItem(key, stokenInfo);
        logger.info('token, update cached token ' + key + ':' + stokenInfo);
      }
    }
  };

  Rooms.prototype.resources = function (args) {
    args.tenantId = args.tenantId || this.config.tenantId;
    if (args.token && this._infoUser) {
      return Promise.resolve(this._infoUser);
    }
    if (!args.token && this._infoGuest) {
      return Promise.resolve(this._infoGuest);
    }
    logger.info('resources: get API info args: ', Log.getInfo(args));
    var self = this;
    return this.roomsAPI.info(args).then(function (r) {
      logger.info('resources: get API info result (' + (args.token ? 'user' : 'guest') + '):', Log.getInfo(r));
      if (args.token) {
        return (self._infoUser = r);
      }
      return (self._infoGuest = r);
    }, function (e) {
      logger.info('resources: get API info error: ', Log.getErrInfo(e));
      if (args.token) {
        self._updateTokenInfo(null);
        self._infoUser = null;
      } else {
        self._infoGuest = null;
      }
      throw e;
    });
  };

  Rooms.prototype._login = function (args) {
    var info = this._infoGuest || { };
    var dfd;
    if (info.iwaEnabled) {
      logger.info('login: API loginIWA');
      dfd = self.roomsAPI.loginIWA(args);
    } else {
      dfd = Promise.reject();
    }
    var self = this;
    return dfd.then(function (r) {
      return r;
    }, function () {
    logger.info('login: API login');
    return self.roomsAPI.login(args);
  });
  };

  Rooms.prototype._getToken = function () {
    var tokenInfo;
    var self = this;
    // always start with resources call
    return this.resources({ }).then(function () {
      tokenInfo = self._fetchTokenInfo(); // allows to skip token check & refresh (see above)
      if (tokenInfo) {
        var args = { tenantId: self.config.tenantId, token: tokenInfo.token, userId: self.config.user, passwordHash: tokenInfo.passwordHash, aliasId: self.config.tenantId };
        // check vaild token or refresh expired one via password hash
        return self.roomsAPI.refreshToken(args).then(function (r) {
          logger.info('getToken: cached token is valid');
          if (tokenInfo.token !== r.token) {
            // store refreshed token
            tokenInfo = { token: r.token, expires: new Date(r.expires).valueOf(), passwordHash: r.passwordHash };
            logger.info('getToken: token refresh result: ', Log.getInfo(tokenInfo));
            self._updateTokenInfo(tokenInfo);
          }
          return Promise.resolve(true); // valid token, no login required
        }, function (e) {
          logger.info('getToken: cached token is invalid, error: ', Log.getErrInfo(e));
          return Promise.resolve(false); // invalid token, try login with user credentials
        })
      } else {
        return Promise.resolve(false); // no token info, try login with user credentials
      }
    }).then( function (r) {
      if (r) {
        return Promise.resolve();
      }
      // perform login
      var args = { userId: self.config.user, password: self.config.password, tenantId: self.config.tenantId, aliasId: self.config.tenantId };
      logger.cred('getToken: login: ' + Log.getInfo(args), args['password']);
      return self._login(args).then(function (r) {
        // store new token
        tokenInfo = { token: r.token, expires: new Date(r.expires).valueOf(), passwordHash: r.passwordHash };
        logger.info('getToken: login result: ', Log.getInfo(tokenInfo));
        self._updateTokenInfo(tokenInfo);
      }, function (e) {
        logger.error('getToken: login error: ', Log.getErrInfo(e));
        self._updateTokenInfo(null);
        return Promise.reject(e, true);
      });
    }).then(function (r) {
      return self.resources({ token: tokenInfo.token });
    }, function (e, f) {
      if (!f) { // just skip already logged errors
        logger.error('getToken: error: ', Log.getErrInfo(e));
      }
      throw e;
    }).then(function () { // should never get here without without valid token
      return tokenInfo.token;
    });
  };

  Rooms.prototype.login = function () {
    return this._getToken().then(function () {
      return Promise.resolve(); // just to not return token as result
    }, function (err) {
      throw err;
    });
  };

  Rooms.prototype.logout = function () {
    delete this.config;
    RoomsSettings.clear();
    return Promise.resolve();
  }

  var _cacheVersion = 20170622;
  Rooms.prototype._fetchCachedRooms = function () {
    var srooms = Storage.getItem(this.config.cacheKey + ':' + this.config.user);
    var rooms = this._safeJSONParse(srooms) || {};
    var dtn = Date.now();
    if ((rooms.expires || 0) - dtn > 60*1000) {
      if (!rooms.version || (rooms.version < _cacheVersion)) {
        return null;
      }
      return rooms;
    }
    return null;
  };
  Rooms.prototype._updateCachedRooms = function (rooms) {
    if (rooms) {
      rooms.expires = Date.now() + 30*60*1000;
      rooms.version = _cacheVersion;
    }
    var srooms = JSON.stringify(rooms || {});
    Storage.setItem(this.config.cacheKey + ':' + this.config.user, srooms);
  };
  
  Rooms.prototype._addConferenceRoom = function (rooms) {
    var url = this.config.conferenceParticipantUrl || this.config.conferenceModeratorUrl || '';
    var pin = this.config.conferenceParticipantPIN || this.config.conferenceModeratorPIN || '';

    if (!url) {
      logger.info('getRooms: no conference room with empty conference url');
      return rooms;
    }

    var room = pin || ((/(\/|participantCode=)([0-9]+)/i.exec(url) || [])[2]) || '';
    this.config.conferenceParticipantPIN = room;
    
    rooms.push({ id: room || 'default', name: this.config.conferenceRoomName, meetingId: room || '', number: room || '', conferenceAccessUrl: url, type: this.config.conferenceType, conferenceAccessNumber: this.config.bridgeNumber, own: true });

    return rooms;
  };

  var _delegateMapping = {
    // test ones
    'sergeyv': ['georgeu'],
  };

  Rooms.prototype.__getRooms = function (args) {
    if (!args._users) {
      var delegateName = this.config.delegateName;
      if (delegateName) {
        args._users = [ delegateName, args.userId ];
      } else {
        args._users = (_delegateMapping[args.userId] || []).concat(args.userId);
      }
    }

    args.userId = args._users.shift();

    var self = this;
    logger.info('getRooms: API getRooms');
    return this.roomsAPI.getRooms(args).then(function (r) {
      r.rooms = r.rooms.map(function (room) {
        room.userId = args.userId;
        return room;
      });

      if (!args._result) {
        args._result = r;
      } else {
        args._result.rooms = args._result.rooms.concat(r.rooms);
      }

      if (!args._users.length) {
        return args._result;
      }

      return self.__getRooms(args);
    });
  };

  Rooms.prototype._getRooms = function (args) {
    logger.info('getRooms: ' + JSON.stringify(args));
    if (this.config.mode !== 'equinox') {
      logger.info('getRooms resolve: no virtual rroms in non-equinox mode');
      return Promise.resolve({ rooms: [] });
    }

    if (!args.forceFetch) {
      var rooms = this._fetchCachedRooms();
      if (rooms) {
        logger.info('getRooms resolve: cached rooms');
        return Promise.resolve(rooms);
      }
      if (args.cachedOnly) {
        return Promise.resolve({ rooms: [] });
      }
    }
    
    var self = this;
    return this._getToken().then(function (r) {
      args.token = r;
      args.tenantId = self.config.tenantId;
      args.aliasId = self.config.tenantId;
      args.userId = self.config.user;
      return self.__getRooms(args);
    }).then(function (r) {
      self._updateCachedRooms(r);
      logger.info('getRooms resolve: fetched rooms');
      return r;
    }, function (err) {
      logger.error('getRooms error: ' + Log.getErrInfo(err));
      self._updateCachedRooms(null);
      self._updateTokenInfo(null);
      if (!args.retry && (err.error && !(err.error.httpStatus === 400 || err.error.httpStatus === 401))) {
        args.retry = true;
        return self.getRooms(args);
      }
      throw err;
    });
  };

  Rooms.prototype.getRooms = function (args) {
    var self = this;
    return this._getRooms(args).then(function (r) {
      var rooms = r.rooms.map(function (room) {
        var ruserId = (room.userId || '').toLowerCase();
        var cuserId = (self.config.user || '').toLowerCase();

        return {
          id: room.id, name: room.name, conferenceAccessNumber: '',
          meetingId: room.number, conferenceAccessUrl: room.url || self.config.portalUri,
          accessPIN: room.accessPIN, type: 'equinox', own: (ruserId === cuserId), userId: room.userId,
        };
      });
      rooms = self._addConferenceRoom(rooms);

      self.rooms = { };
      rooms.forEach(function (room) {
        self.rooms[room.id] = room;
      });

      return Promise.resolve(rooms);
    });
  };

  Rooms.prototype._replaceAll = function (s, f, r) {
    var re = new RegExp(f.replace(/([^a-z0-9])/ig, '\\$1'), 'ig');
    return s.replace(re, r);
  };

  Rooms.prototype._patchDialInfo = function (dialingInfo, args) {
    var bridgeNumber = this.config.bridgeNumber || '';
    var location = args.conference ? this.config.locationFormatConference : this.config.locationFormatEquinox;
    location = this._replaceAll(location, '$(bridgePrefix)', (this.config.bridgePrefix || ''));
    location = this._replaceAll(location, '$(bridgeNumber)', (bridgeNumber || ''));

    if (args.conference) {
      var room = args.dialableNumber || '';
      if (room && (room[room.length - 1] !== '#')) {
        room += '#';
      }
      location = this._replaceAll(location, '$(room)', room);

      location = this._replaceAll(location, '$(conferenceJoinUrl)', (this.config.conferenceParticipantUrl || ''));
    } else {
      location = this._replaceAll(location, '$(room)', (args.dialableNumber || ''));
      location = this._replaceAll(location, '$(pinE164)', (args.accessPIN ? '***' + atob(args.accessPIN) : ''));
      location = this._replaceAll(location, '$(pin)', (args.accessPIN ? atob(args.accessPIN) : ''));

      var portal = this.config.serverBase + '/portal/tenants/' + this.config.tenantId + '/?ID=';
      location = this._replaceAll(location, '$(portalJoinUrl)', (portal || ''));
    }
    if (!bridgeNumber) {
      location = location.substr(location.indexOf('http'));
    }
    location = location.trim();
    dialingInfo.location = location;

    var numbers = args.conference ? this.config.additionalNumbers : '';
    if (!numbers) {
      return;
    }

    dialingInfo.dialingInfoText = typeof(dialingInfo.dialingInfoText) === 'undefined' ? '' : (dialingInfo.dialingInfoText + '\n');
    dialingInfo.dialingInfoHTML  = '<div>' + dialingInfo.dialingInfoHTML;
    dialingInfo.dialingInfoHTML += '<div><br/>';

    if (args.additionalNumbersTitle) {
      dialingInfo.dialingInfoText += args.additionalNumbersTitle;
      dialingInfo.dialingInfoText += '\n';

      dialingInfo.dialingInfoHTML += args.additionalNumbersTitle;   
      dialingInfo.dialingInfoHTML += '<br/>';   
    }

    numbers.split(',').forEach(function (item) {
      var kv = item.split(':');
      dialingInfo.dialingInfoText += kv[0] + ' ' + kv[1];
      dialingInfo.dialingInfoText += '\n';

      dialingInfo.dialingInfoHTML += kv[0] + '&nbsp;' + kv[1];   
      dialingInfo.dialingInfoHTML += '<br/>';
    });
    dialingInfo.dialingInfoHTML += '</div>';
    dialingInfo.dialingInfoHTML += '</div>';
  };

  Rooms.prototype.getDialInfoCustom = function (args) {
    logger.info('getDialInfoCustom');
    var self = this;
    var type = (args.conference ? 'aac' : 'scopia');
    var langId = self.config.languageId;
    var opt = { html: true, logger: logger, i18n: self.i18n, langId: langId };
    return new Templates(opt).getTemplate(type).then(function (r) {
      var content = r;
      var bridgeNumber = self.config.bridgeNumber || '';
      content = self._replaceAll(content, '$(bridgePrefix)', (self.config.bridgePrefix || ''));
      content = self._replaceAll(content, '$(bridgeNumber)', (bridgeNumber || ''));

      if (args.conference) {
        var room = args.dialableNumber || '';
        if (room && (room[room.length - 1] !== '#')) {
          room += '#';
        }
        content = self._replaceAll(content, '$(room)', room);

        var typeLabel = '';
        if (self.config.conferenceType === 'aac') {
          typeLabel = self.i18n.aacLabel;
        } else if (self.config.conferenceType === 'ipo') {
          typeLabel = self.i18n.ipoLabel;
        }
        content = self._replaceAll(content, '$(conferenceType)', (typeLabel || ''));
      } else {
        content = self._replaceAll(content, '$(room)', (args.dialableNumber || ''));
        content = self._replaceAll(content, '$(pinE164)', (args.accessPIN ? '***' + atob(args.accessPIN) : ''));
        content = self._replaceAll(content, '$(pin)', (args.accessPIN ? atob(args.accessPIN) : ''));
        content = self._replaceAll(content, '$(roomName)', (args.name || ''));
      }
      var portal = self.config.serverBase + '/portal/tenants/' + self.config.tenantId + '/?ID=';
      content = self._replaceAll(content, '$(portalJoinUrl)', (portal || ''));

      var scopiaUrl = (self._infoUser || self._infoGuest || {}).scopiaUrl;
      scopiaUrl = null;
      if (!scopiaUrl) {
        scopiaUrl = self.config.serverBase + '/portal/tenants/' + self.config.tenantId + '/';
      }
      var scopiaBaseUrl = (/https?\:\/\/[^\/]*/i.exec(scopiaUrl) || [])[0] || '';
      var scopiaJoinUrl = scopiaUrl + '?ID=';

      content = self._replaceAll(content, '$(conferenceJoinUrl)', (self.config.conferenceParticipantUrl || ''));
      content = self._replaceAll(content, '$(scopiaBaseUrl)', scopiaBaseUrl);
      content = self._replaceAll(content, '$(scopiaJoinUrl)', scopiaJoinUrl);
      content = self._replaceAll(content, '$(autojoin)', args.autojoin ? '&amp;autojoin' : '');
  
      var dialingInfo = { };
      dialingInfo.dialingInfoHTML = content;
      return Promise.resolve(dialingInfo);
    });
  };

  Rooms.prototype._compareVersion = function (v1, v2) {
    for (var i = 0; i < v1.length; i++) {
      var xv1 = 0 | (v1[i] || '0');
      var xv2 = 0 | (v2[i] || '0');
      var x = xv1 - xv2;
      if (x) {
        return x;
      }
    }
    return 0;
  };

  
  Rooms.prototype._isGetDialInfoFromPortalSupported = function (args) {
    if (args.conference) {
      return false;
    }
    var version = (this._infoGuest || this._infoUser || {}).portalVersion || '';
    var versionBase = '3.2.0.0.228';
    if (this._compareVersion(version.split('.'), versionBase.split('.')) < 0) {
      return false;
    }

    return true;
  };

  Rooms.prototype.getDialInfo = function (args) {
    if (args.accessPIN) {
      args.accessPIN = btoa(args.accessPIN);
    }
    return this.getDialInfoPatched(args);
  };

  Rooms.prototype.getDialInfoPatched = function (args) {
    var self = this;
    if (self.config.mode !== 'equinox') {
      return self.getDialInfoWithRetry(args, true);
    }
    return self.resources({ }).then(function (r) {
      if (!self._isGetDialInfoFromPortalSupported(args)) {
        return self.getDialInfoWithRetry(args, true);
      }

      return self._getToken().then(function (r) {
        args.token = r;
        args.tenantId = self.config.tenantId;
        return self.getDialInfoWithRetry(args);
      }, function (e) {
        self._updateTokenInfo(null);
        if (!args.retry) {
          args.retry = true;
          return self.getDialInfoPatched(args);
        }
        throw e;
      });
    }, function (e) {
      return self.getDialInfoWithRetry(args, true);
    });
    
  };
  Rooms.prototype.getDialInfoWithRetry = function (args, fallBack) {
    var deferred;
    if (fallBack) {
      deferred = this.getDialInfoCustom(args);
    } else {
      logger.info('getDialInfo: API getDialInfo');
      deferred = this.roomsAPI.getDialInfo(args);
    }

    var self = this;
    return deferred.then(function (r) {
      if (!r.location) {
        self._patchDialInfo(r, args);
      }
      return r;
    }, function (e) {
      if (!fallBack) {
        return self.getDialInfoWithRetry(args, true);
      }
      throw e;
    });
  };

  Rooms.prototype.getTopics = function () {
    var res = Object.getOwnPropertyNames(this.rooms).reduce(function (r, key) {
      var room = r.rooms[key];
      r.result.push({ id: room.id, title: room.name, room: room });
      return r;
    }, { result: [], rooms: this.rooms }).result;
    return { items: res };
  };
  Rooms.prototype.getTopic = function (id) {
    var room = this.rooms[id];
    if (room) {
      return { id: room.id, title: room.name, room: room };
    }
  };

  Rooms.prototype.createInvite = function (invite) {
    var room = this.rooms[invite.id];
    var self = this;
    return this.getDialInfo({ name: room.name, accessPIN: room.accessPIN, dialableNumber: room.meetingId, conference: room.type !== 'equinox', additionalNumbersTitle: this.i18n.additionalNumbersTitle }).then(function (r) {
      var meeting = { 'location': r.location, 'body': r.dialingInfoText || r.dialingInfoHTML };
      var meetingInfo = TOM.extractMeetingInfo(self.config.settings, self.rooms, meeting);
      var joinUrl = TOM.getJoinMeetingUri(meetingInfo);
      var info = {
        topicId: invite.id,
        topicTitle: room.name,
        conferenceAccessNumber: room.conferenceAccessNumber,
        meetingId: room.type === 'equinox' ? room.meetingId : '',
        conferenceAccessUrl: room.conferenceAccessUrl,
        joinUrl: joinUrl
      };
      var res = { id: room.id, type: room.type, location: r.location, content: { 'text': r.dialingInfoText, 'html': r.dialingInfoHTML }, info: info};
      logger.info('createInvite res: ' + JSON.stringify(res));
      return Promise.resolve(res);
    });
  };

  Rooms.prototype.getInviteInfo = function (configuration, languageId, location, body) {
    var config;
    var self = this;
    var rooms;
    return this.configure(configuration, languageId).then(function (r) {
      config = r;
      return self._getRooms({ });
    }).then(function (r) {
      rooms = (r.rooms || []).map(function (room) {
        var pin = room.accessPIN;
        return { id: room.id, name: room.name, meetingId: room.number, conferenceAccessUrl: room.url, accessPIN: pin || '', moderatorPIN: room.moderatorPIN };
      });
    }, function (err) {
      logger.error('getInviteInfo error: ' + Log.getErrInfo(err));
      rooms = [];
    }).then(function () {
      var meeting = { 'location': location, 'body': body };
      var res = TOM.extractMeetingInfo(config.settings, rooms, meeting)
      logger.info('getInviteInfo res: ' + JSON.stringify(res));
      return Promise.resolve(res);
    });
  };

  Rooms.prototype.getInviteUrl = function (configuration, languageId, location, body) {
    var self = this;
    return this.getInviteInfo(configuration, languageId, location, body).then(function (r) {
      return Promise.resolve(TOM.getJoinMeetingUri(r));
    });
  };

  Rooms.prototype.checkInvite = function (configuration, languageId, location, body) {
    var self = this;
    return this.getInviteInfo(configuration, languageId, location, body).then(function (r) {
      if (!r || r.type === 'empty') {
        return Promise.resolve(null);
      }
      var inviteId;
      var ids = Object.getOwnPropertyNames(self.rooms);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        if ((self.rooms[id].meetingId === r.room) || (r.url && self.rooms[id].conferenceAccessUrl === r.url)) {
          inviteId = id;
          break;
        }
      }
      if (!inviteId) {
        return Promise.resolve(null);
      }
      var room = self.rooms[inviteId];
      var joinUrl = TOM.getJoinMeetingUri(r);
      var info = {
        topicId: inviteId,
        topicTitle: room.name,
        conferenceAccessNumber: room.conferenceAccessNumber,
        meetingId: room.type === 'equinox' ? room.meetingId : '',
        conferenceAccessUrl: room.conferenceAccessUrl,
        joinUrl: joinUrl
      };
      var res = { id: inviteId, isHost: r.isHost, info: info };
      logger.info('checkInvite res: ' + JSON.stringify(res));
      return Promise.resolve(res);
    });
  };

  module.exports = new Rooms();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var Log     = __webpack_require__(3);
  var Event   = __webpack_require__(2);
  var Timer   = __webpack_require__(14);
  var Utils   = __webpack_require__(1);

  var schema = __webpack_require__(39);

  var identity = __webpack_require__(21);
  var identityStates = __webpack_require__(22);

  var modelParties = __webpack_require__(31);
  var modelPartiesTypes = __webpack_require__(19);

  var ZangSpaces = __webpack_require__(62);

  var logger = Log.createLogger('SPACES');

  function Spaces() {
    this.onTopic = new Event();
    this.onReady = new Event();
    this.onSearch = new Event();

    this.service = new ZangSpaces();
    this.evTimer = this.evTimer.bind(this);
    this.reschedule = this.reschedule.bind(this);
    this.pollTopics = this.pollTopics.bind(this);

    identity.onAccount.addListener(this.evAccount, this);
  }
  Spaces.prototype._schema = schema;
  
  Spaces.prototype.setOpt = function (opt) {
    logger.info('setOpt: ' + JSON.stringify(opt));
    this.opt = opt || {};
  };
  Spaces.prototype.init = function (opt) {
    logger.info('init: ' + JSON.stringify(opt));
    this.opt = opt || {};
    this.topics = {};
    this.service.init(opt);
    this.timer = new Timer(this.evTimer);
    this.lastUpdate = 0;

    // this.refresh(); // do not start pollTopics on init
  };
  Spaces.prototype.shut = function () {
    this.topics = {};
    this.service.shut();
    if (this.timer) {
      this.timer.reset();
      this.timer = null;
    }
    this.lastUpdate = 0;
  };
  Spaces.prototype.evAccount = function (account) {
    if (!account || account.info.type !== 'esna') {
      return;
    }
    // so far supporting only primary account
    if (!account.info.primary) {
      return;
    }

    if (account.state === identityStates.Authorized) {
      var opt = this.opt || { };
      opt.user = account.info.user;
      opt.token = identity.getToken.bind(identity, { id: account.id, primary:  account.id === 'primary' });
      this.init(opt);
    } else {
      this.shut();
    }
  };

  Spaces.prototype.pollTopics = function (r) {
    Utils.showLogInfo('spaces: model.pollTopics', r ? { next: r.next, items: (r.items || []).length } : r);
    if (!this.service.opt) {
      Utils.showLogInfo('spaces: model.pollTopics skip', 'service not configured or shutted down');
      this.onReady.dispatch({ skip: true });
      return Promise.resolve({ skip: true });
    }
    if (!r) {
      var dtn = Date.now();
      if (dtn - this.lastUpdate < 5 * 60000) {
        Utils.showLogInfo('spaces: model.pollTopics skip', 'topics are up to date');
        this.onReady.dispatch({ skip: true });
        return Promise.resolve({ skip: true });
      }
      return this.service.fetchTopics().then(this.pollTopics);
    }
    
    this.lastUpdate = Date.now();
    for (var i = 0; i < r.items.length; i++) {
      this.reportTopic(r.items[i]);
    }
    if (r.next) {
      return this.service.fetchTopics({ url: r.next }).then(this.pollTopics);
    }
    this.onReady.dispatch({ done: true });
    return Promise.resolve({ done: true });
  };
  Spaces.prototype.reportTopic = function (topic) {
    if (!topic.selfMember) {
      Utils.showLogInfo('spaces: model.reportTopic skip', 'role: guest, id: ' + topic.id);
      return;
    }
    this.topics[topic.id] = topic;
    this.onTopic.dispatch({ item: topic });
  };
  
  Spaces.prototype.reschedule = function () {
    // periodic polling switched off
    //if (this.timer) {
    //  this.timer.start(60000);
    //}
  };
  Spaces.prototype.evTimer = function () {
    if (this.timer) {
      Utils.showLogInfo('spaces: model.evTimer');
      this.timer.reset();
      return this.pollTopics().then(this.reschedule, this.reschedule);
    }
  };

  
  Spaces.prototype.refresh = function () {
    Utils.showLogInfo('spaces: model.refresh');
    this.lastUpdate = 0;
    return this.evTimer();
  };
  Spaces.prototype.getTopics = function () {
    Utils.showLogInfo('spaces: model.getTopics');
    var res = Object.getOwnPropertyNames(this.topics).reduce(function (r, key) {
      r.result.push(r.topics[key]);
      return r;
    }, { result: [], topics: this.topics }).result;
    return { items: res };
  };
  Spaces.prototype.getTopic = function (id) {
    return this.topics[id];
  };

  Spaces.prototype.searchTopics = function () {
  };

  Spaces.prototype.createTopic = function (topic) {
    if (!topic.parties) {
      var parties = modelParties.getParties();
      var partiesType = modelParties.getPartiesType();
      modelParties.clear();

      var keys = Object.getOwnPropertyNames(parties);
      var p = [];
      for (var i = 0; i < keys.length; i++) {
        p.push({ email: keys[i], member: partiesType === modelPartiesTypes.member });
      }
      topic.parties = p;
    }
    
    var self = this;
    return this.service.createTopic(topic).then(function (r) {
      self.reportTopic(r);
      if (topic.join) {
        self.joinTopic(r.id);
      }
      if (!r.invite) {
        return r;
      }
      r.invite.topicId = r.id;
      var inviteUrl = (self._getInviteInfo(r.invite.content.text) || { }).url;
      r.invite.location = inviteUrl;
      var info = {
        topicId: r.id,
        topicTitle: r.title,
        spaceUrl: inviteUrl
      };
      r.invite.info = info;
      return r;
    });
  };
  Spaces.prototype.removeTopic = function () {
  };

  Spaces.prototype.createInvite = function (invite) {
    if (!invite.parties) {
      var parties = modelParties.getParties();
      var partiesType = modelParties.getPartiesType();
      modelParties.clear();

      var keys = Object.getOwnPropertyNames(parties);
      var p = [];
      for (var i = 0; i < keys.length; i++) {
        p.push({ email: keys[i], member: partiesType === modelPartiesTypes.member });
      }
      invite.parties = p;
    }
    
    var self = this;
    return this.service.createInvite(invite).then(function (r) {
      if (invite.join) {
        self.joinInvite(r.id);
      }
      var inviteUrl = (self._getInviteInfo(r.content.text) || { }).url;
      r.location = inviteUrl;
      var topic = self.topics[invite.id] || { };
      var info = {
        topicId: invite.id,
        topicTitle: topic.title,
        spaceUrl: inviteUrl
      };
      r.info = info;
      return r;
    });
  };
  
  Spaces.prototype.removeInvite = function (inviteId) {
    return this.service.removeInvite(inviteId);
  };

  Spaces.prototype._getInviteInfo = function (body) {
    function escapeRegExp(v) {
      v = v.replace(/([./:])/ig, '\\$1');
      return v;
    }

    // var endpoint = (this.opt || {}).url || 'https://spaces.zang.io';
    // var reText = escapeRegExp(endpoint) + '\/spaces\/invites\/(.*?)\/(join|meet)';
    var reText = 'https:\/\/[^\/]*\/spaces\/invites\/(.*?)\/(join|meet)';
    logger.info('getInviteInfo search: ' + reText);

    var re = new RegExp(reText, 'i');
    var result = re.exec(body) || [];
    var id = result[1];
    var url = result[0];
    var res = id ? { id: id, url: url } : null;
    logger.info('getInviteInfo res: ' + JSON.stringify(res));
    return res;
  };

  Spaces.prototype.getInviteInfo = function (body) {
    return Promise.resolve(this._getInviteInfo(body));
  };

  Spaces.prototype.getInviteUrl = function (body) {
    return this.getInviteInfo(body).then(function (r) {
      return Promise.resolve(r? r.url : null);
    });
  };

  Spaces.prototype.checkInvite0 = function (body) {
    return this.getInviteInfo(body).then(function (r) {
      return Promise.resolve(r ? { inviteId: r.id } : null);
    });
  };

  Spaces.prototype.checkInvite = function (body, precheck) {
    var inviteInfo;
    var self = this;
    return this.getInviteInfo(body).then(function (r) {
      if (precheck) {
        return Promise.resolve(!!r);
      }
      if (!r) {
        return Promise.resolve(null);
      }
      inviteInfo = r;
      return self.service.getTopic({ id: inviteInfo.id }).then(function (r) {
        var info = {
          topicId: r.topic._id,
          topicTitle: r.topic.title,
          spaceUrl: inviteInfo.url
        };
        return Promise.resolve(r ? { inviteId: inviteInfo.id, info: info } : null);
      }, function (err) {
        return Promise.resolve({ inviteId: inviteInfo.id, info: { spaceUrl: inviteInfo.url } });
      });
    });
  };

  Spaces.prototype.joinTopic = function (id) {
    var url = this.service.getJoinUrl(id);
    // Window.open(url, '_blank');
  };
  Spaces.prototype.joinInvite = function (id) {
    var url = this.service.getInviteJoinUrl(id);
    Window.open(url, '_blank');
  };

  module.exports = new Spaces();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event = __webpack_require__(2);

  var schema = __webpack_require__(61);

  var modelIdentity = __webpack_require__(21);
  var partyType = __webpack_require__(19);

  var _storageKey = 'spaces:partiesType';

  function Parties() {
    this.parties = { };
    this.partiesType = localStorage.getItem(_storageKey) || partyType.member;

    this.onParties = new Event();
    this.onPartiesType = new Event();

    modelIdentity.onPrimary.addListener(this.evIdentity, this);
  }
  Parties.prototype._schema = schema;
  
  Parties.prototype.evIdentity = function (info) {
    if (!info.connected) {
      this.clear();
    } else {
      this.parties = {};
    }
  };
  
  Parties.prototype.getParties = function () {
    return this.parties;
  };
  Parties.prototype.createParty = function (party) {
    var p = this.parties[party.id];
    if (p) {
      var update = false;
      if (party.image && (p.image !== party.image)) {
        update = true;
        p.image = party.image; 
      }
      if (party.name && (p.name !== party.name)) {
        update = true;
        p.name = party.name; 
      }
      if (party.member) {
        update = true;
        p.member = true;
      }
      if (update) {
        this.onParties.dispatch({ item: p });
      }
      return;
    }
    this.parties[party.id] = party;
    this.onParties.dispatch({ item: party });
  };
  Parties.prototype.removeParty = function (id) {
    var p = this.parties[id];
    if (!p) {
      return;
    }
    delete this.parties[id];
    this.onParties.dispatch({ deleted: true, item: p });
  };
  Parties.prototype.getPartiesType = function () {
    return this.partiesType;
  };
  Parties.prototype.setPartiesType = function (type) {
    this.partiesType = type;
    localStorage.setItem(_storageKey, this.partiesType);

    this.onPartiesType.dispatch({ type: this.partiesType });
  };

  Parties.prototype.clear = function () {
    this.parties = {};
    this.onParties.dispatch({ cleared: true });
  };

  module.exports = new Parties();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var dom = __webpack_require__(5);
  
  function getEventPrefixed(name) {
    switch (name) {
      case 'animationend':
        return [name, 'webkitAnimationEnd'];
    }
    return [name];
  }
  function onanimate(opt, ev) {
    if (opt.final) {
      return;
    }
    
    var node = opt.node;
    var css = opt.stages[opt.index];
    if (css && opt.clearCss) {
      node.classList.remove(css);
    }
    css = opt.stages[opt.index + 1];
    if (css) {
      node.classList.add(css);
      opt.index = opt.index + 1;
    } else if (ev) {
      opt.final = 1;
      
      var names = getEventPrefixed(opt.track);
      for (var i = 0; i < names.length; i++) {
        node.removeEventListener(names[i], opt.handler);
      }
      
      if (opt.remove) {
        node.parentElement.removeChild(node);
      }
      if (opt.cb) {
        opt.cb();
      }
    }
  }
  
  /** @constructor */
  function Control(opt) {
    this.node = this.create(opt);
  }
  Control.prototype.create = function (opt) {
    return this.node || dom.div(opt).node;
  };
  Control.prototype.attach = function (p) {
    this.del();
    p.appendChild(this.node);
  };
  Control.prototype.remove = function () {
    return this.del();
  };
  Control.prototype.render = function (opt) {
  };
  Control.prototype.mutate = function (opt) {
    opt = { node: opt.node || this.node, handler: onanimate, track: opt.track || 'animationend', cb: opt.cb, index: -1, stages: opt.stages || [], remove: opt.remove, clearCss: 1 };
    opt.handler = opt.handler.bind(opt, opt);

    var names = getEventPrefixed(opt.track);
    for (var i = 0; i < names.length; i++)
      opt.node.addEventListener(names[i], opt.handler);

    onanimate(opt, null);
  };
  
  module.exports = dom.element.extend(Control);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var officeNative = { missing: true };

  if (window.external && ('context' in window.external)) {
    officeNative = window.external;
  }

  module.exports = officeNative;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';
  
  var globals = __webpack_require__(4);
  var Office = globals.safeProp('Office');

  var _settings;
  var store;

  function save() {
    var cb = function() {};
    _settings.saveAsync(cb);
  }
  function get(key) {
    return _settings.get(key);
  }
  function set(key, val) {
    _settings.set(key, val);
    save();
  }
  function del(key) {
    _settings.remove(key);
    save();
  }

  function init(settings) {
    _settings = settings;
    store = _settings ? { get: get, set: set, del: del } : null;
  }

  function getStore() {
    if (typeof(store) !== 'undefined') {
      return store;
    }
    if (typeof(Office) === 'undefined' ||
        !Office.context || 
        !Office.context.roamingSettings) {
      _settings = null;
    } else {
      _settings = Office.context.roamingSettings;
    }
    init();
    return store;
  }

  var storage = { init: init, getStore: getStore };

  module.exports = storage;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var loader  = __webpack_require__(13);

  var Promise = __webpack_require__(0);
  var Storage = __webpack_require__(11);
  var Log     = __webpack_require__(3);

  var logger = Log.createLogger('SETTINGS');

  var settings = null;

  function toHexString(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
      var value = view.getUint32(i);
      var stringValue = value.toString(16);
      var padding = '00000000';
      var paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }

    // Join all the hex strings into one
    return hexCodes.join('');
  }

  function getHash(v) {
    v = v || '';

  if (!window.crypto && window.md5) {
    return Promise.resolve(window.md5(v));
  }

    var buffer = new ArrayBuffer(v.length * 2);
    var bufView = new Uint16Array(buffer);
    for (var i = 0; i < v.length; i++) {
      bufView[i] = v.charCodeAt(i);
    }

    //var buffer = String.fromCharCode.apply(null, new Uint16Array(buf));new TextEncoder('utf-8').encode(v);
    return window.crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
      return toHexString(hash);
    });
  }

  function loadSettings(configuration, languageId) {
    if (settings !== null) {
      return Promise.resolve(settings);
    }

    if (!configuration) {
      return Promise.reject({ error: { noconfiguration: true } });
    }

    configuration = JSON.parse(configuration);
    settings = {
      languageId: languageId,
      manual: configuration.manual || Object.getOwnPropertyNames(configuration).length === 0,
      outlookCallContact: configuration['OUTLOOK_CALL_CONTACT'] || '',
      conferenceAccessNumber: configuration['CONFERENCE_ACCESS_NUMBER'] || '',
      conferenceAdditionalNumbers: configuration['ADDITIONAL_CONFERENCE_ACCESS_NUMBER_LIST'] || '',

      unifiedPortalEnabled: !!configuration['UNIFIEDPORTALENABLED'],

      // equinox properties
      unifiedPortalUri: configuration['UNIFIED_PORTAL_URI'] || '', // to be removed
      unifiedPortalUsername: configuration['UNIFIED_PORTAL_USERNAME'] || '',
      unifiedPortalSSO: !!configuration['UNIFIED_PORTAL_SSO'],
      unifiedPortalPassword: configuration['Password'] || '',

      unifiedPortalDelegateName: configuration['delegateName'] || '',

      conferenceFQDNSIPDialList: configuration['CONFERENCE_FQDN_SIP_DIAL_LIST'] || '',
      uccpEnabled: !!configuration['UCCPENABLED'],
      sipEnabled: !!configuration['SIP_ENABLED'],
      conferencePortalUri: configuration['CONFERENCE_PORTAL_URI'] || '',

      // conference properties
      conferenceModeratorCode: configuration['CONFERENCE_MODERATOR_CODE'] || '',
      conferenceModeratorUrl: configuration['CONFERENCE_MODERATOR_URL'] || '',
      conferenceParticipantCode: configuration['CONFERENCE_PARTICIPANT_CODE'] || '',
      conferenceParticipantUrl: configuration['CONFERENCE_PARTICIPANT_URL'] || '',

      conferenceType: configuration['ENABLE_IPO'] ? 'ipo' : 'aac',
    };

    var validateArray = [
      settings.conferenceAccessNumber,
      settings.conferenceAdditionalNumbers,
      settings.unifiedPortalEnabled,
      settings.unifiedPortalUri,
      settings.unifiedPortalUsername,
      settings.unifiedPortalSSO,
      settings.unifiedPortalPassword,
      settings.unifiedPortalDelegateName,
      settings.conferenceFQDNSIPDialList,
      settings.conferencePortalUri,
      settings.conferenceModeratorCode,
      settings.conferenceModeratorUrl,
      settings.conferenceParticipantCode,
      settings.conferenceParticipantUrl,
      settings.conferenceType,
    ];
    var sValidate = validateArray.join(',');

    return getHash(sValidate).then(function (hash) {
      var oldHash = Storage.getItem('equinox-config-hash') || '';
      logger.info('compare-config:' + hash + ':' + oldHash);

      settings.forceRefresh = oldHash !== hash;
      Storage.setItem('equinox-config-hash', hash);

      return Promise.resolve(settings);
    }, function () {

      settings.forceRefresh = true;
      return Promise.resolve(settings);
    });
  }

  function buildAPIConfig(settings) {
    var config = { };
    config.mode = settings.unifiedPortalEnabled ? 'equinox' : settings.conferenceType;

    config.languageId = settings.languageId;

    config.bridgeNumber = settings.conferenceAccessNumber;
    config.additionalNumbers = settings.conferenceAdditionalNumbers;

    config.portalUri = settings.unifiedPortalUri || settings.conferencePortalUri;
    config.user = settings.unifiedPortalUsername;
    config.password = settings.unifiedPortalPassword;
    config.delegateName = settings.unifiedPortalDelegateName;

    config.conferenceModeratorPIN = settings.conferenceModeratorCode;
    config.conferenceModeratorUrl = settings.conferenceModeratorUrl;
    config.conferenceParticipantPIN = settings.conferenceParticipantCode;
    config.conferenceParticipantUrl = settings.conferenceParticipantUrl;
    config.conferenceType = settings.conferenceType;

    config.forceRefresh = settings.forceRefresh;

    return config;
  }

  function getAPIConfig(configuration, languageId) {
    return loadSettings(configuration, languageId).then(function (settings) {
      var config = buildAPIConfig(settings);
      config.settings = settings;
      return Promise.resolve(config);
    });
  }

  function clear() {
    settings = null;
  }

  loader.load('/lib/contrib/webcrypto-shim.js', 'crypto');

  module.exports = { getAPIConfig: getAPIConfig, clear: clear };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var API = __webpack_require__(23);

  var methods = {
    info: {
      uri: '/ups/resources/$(tenantId)',
      method: 'GET',
      headers: {
        'authorization': '$(token)'
      },
      body: null,
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        token: { key: '$(token)', flags: 's', format: 'UPToken $0' }
      },
      response: {
        portalVersion: { key: 'portalVersion', flags: 'Sr' },
        multitenant: { key: 'multitenant', flags: 'br' },
        iwaEnabled: { key: 'iwaEnabled', flags: 'br' },
        scopiaUrl: { key: 'scopiaDesktopServerURL', flags: 's' },
        self: {
          $v: {
            email: { key: 'self.email', flags: 'sr' },
            firstName: { key: 'self.firstName', flags: 's' },
            lastName: { key: 'self.lastName', flags: 's' },
            userId: { key: 'self.userId', flags: 's' },
            scopiaUserId: { key: 'self.scopiaUserId', flags: 's' },
            scopiaTenantId: { key: 'self.scopiaMemberId', flags: 's' }
          }
        }
      },
    },
    refreshToken: {
      uri: '/ups/resources/$(tenantId)authentication/login',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': '$(token)'
      },
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        token: { key: '$(token)', flags: 'Sr', format: 'UPToken $0' },
        userId: { key: '$(userId)', flags: 's' },
        passwordHash: { key: '$(passwordHash)', flags: 's' },
        aliasId: { key: '$(aliasId)', flags: 's', default: 'default' }
      },
      body: {
        'login': '$(userId)',
        'encryptedPassword': '$(passwordHash)',
        'organizationAlias': '$(aliasId)'
      },
      response: {
        token: { key: 'token', flags: 'Sr' },
        expires: { key: 'expirationTime', flags: 'D' },
        passwordHash: { key: 'encryptedPassword', flags: 's' }
      }
    },
    login: {
      uri: '/ups/resources/$(tenantId)authentication/login',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        aliasId: { key: '$(aliasId)', flags: 's', default: 'default' },
        userId: { key: '$(userId)', flags: 's' },
        password: { key: '$(password)', flags: 's' }
      },
      body: {
        'login': '$(userId)',
        'organizationAlias': '$(aliasId)',
        'password': '$(password)'
      },
      response: {
        token: { key: 'token', flags: 'Sr' },
        expires: { key: 'expirationTime', flags: 'D' },
        passwordHash: { key: 'encryptedPassword', flags: 's' }
      }
    },
    loginIWA: {
      uri: '/ups/resources/$(tenantId)authentication/login?useSSO=true',
      method: 'POST',
      credentials: true,
      headers: {
        'content-type': 'application/json'
      },
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        aliasId: { key: '$(aliasId)', flags: 's', default: 'default' },
      },
      body: {
        'organizationAlias': '$(aliasId)',
      },
      response: {
        token: { key: 'token', flags: 'Sr' },
        expires: { key: 'expirationTime', flags: 'D' },
        passwordHash: { key: 'encryptedPassword', flags: 's' }
      }
    },
    getRooms: {
      uri: '/ups/resources/$(tenantId)conference/virtual_room',
      method: 'POST',
      headers: {
        'content-type': 'application/vnd.avaya.portal.conference.virtual_room.v1+json',
        'authorization': '$(token)'
      },
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        aliasId: { key: '$(aliasId)', flags: 's', default: 'default' },
        token: { key: '$(token)', flags: 'Sr', format: 'UPToken $0' },
        offset: { key: '$(offset)', flags: 'i', default: 1 },
        pageSize: { key: '$(pageSize)', flags: 'i', default: 20 },
        userId: { key: '$(userId)', flags: 'Sr' }
      },
      body: {
        memberId: '$(aliasId)',
        offset: '$(offset)',
        pageSize: '$(pageSize)',
        loginId: '$(userId)'
      },
      response: {
        totalCount: { key: 'totalCount ', flags: 'i' },
        rooms: [{
          id: { key: 'virtualRoom.#.virtualRoomId', flags: 'Sr' },
          name: { key: 'virtualRoom.#.name', flags: 'Sr' },
          number: { key: 'virtualRoom.#.number', flags: 'Sr' },
          userId: { key: 'virtualRoom.#.userId', flags: 'Sr' },
          accessPIN: { key: 'virtualRoom.#.accessPIN', flags: 'B', default: '' },
          
          autoExtend: { key: 'virtualRoom.#.autoExtend', flags: 'br' },
          blockDialIn: { key: 'virtualRoom.#.blockDialIn', flags: 'br' },
          isDefault: { key: 'virtualRoom.#.default', flags: 'br' },
          maxParticipants: { key: 'virtualRoom.#.maxParticipants', flags: 'ir' },
          moderatorPIN: { key: 'virtualRoom.#.moderatorPIN', flags: 'B' },
          oneTimePINRequired: { key: 'virtualRoom.#.oneTimePINRequired', flags: 'b' },
          priority: { key: 'virtualRoom.#.priority', flags: 'er' },
          isPublic: { key: 'virtualRoom.#.public', flags: 'br' },
          servicePrefix: { key: 'virtualRoom.#.servicePrefix', flags: 'sr' },
          serviceTemplateId: { key: 'virtualRoom.#.serviceTemplateId', flags: 'sr' },
          streamingStatus: { key: 'virtualRoom.#.streamingStatus', flags: 'er' },
          waitingRoom: { key: 'virtualRoom.#.waitingRoom', flags: 'br' },
          
          allowKnocking: { key: 'virtualRoom.#.allowKnocking', flags: 'br' },
          allowRecording: { key: 'virtualRoom.#.allowRecording', flags: 'er' },
          allowStreaming: { key: 'virtualRoom.#.allowStreaming', flags: 'er' },

          durationAfterLeft: { key: 'virtualRoom.#.advancedProperties.durationAfterLeft', flags: 'T' },
          minutesBeforeTermination: { key: 'virtualRoom.#.advancedProperties.minutesBeforeTermination', flags: 'T' },
          terminationCondition: { key: 'virtualRoom.#.advancedProperties.terminationCondition', flags: 'e' },

          portsFullHD: { key: 'virtualRoom.#.reservedPorts.fullHD', flags: 'i', default: 0 },
          portsHD: { key: 'virtualRoom.#.reservedPorts.hd', flags: 'i', default: 0 },
          portsRegular: { key: 'virtualRoom.#.reservedPorts.regular', flags: 'i', default: 0 },
          portsSD: { key: 'virtualRoom.#.reservedPorts.sd', flags: 'i', default: 0 }
        }]
      }
    },
    getDialInfo: {
      uri: '/ups/resources/$(tenantId)conference/dialing_info',
      method: 'POST',
      headers: {
        'authorization': '$(token)',
        'content-type': 'application/vnd.avaya.portal.conference.dialing_info.v1+json'
      },
      args: {
        tenantId: { key: '$(tenantId)', flags: 's', format: 'tenants/$0/', default: 'default' },
        token: { key: '$(token)', flags: 'S', format: 'UPToken $0' },

        accessPIN: { key: '$(accessPIN)', flags: 's' },
        confGID: { key: '$(confGID)', flags: 's' },
        dialableNumber: { key: '$(dialableNumber)', flags: 'Sr' },
        loginId: { key: '$(loginId)', flags: 's' },
        memberId: { key: '$(memberId)', flags: 's' },
        servicePrefix: { key: '$(servicePrefix)', flags: 's' },
        serviceTemplateId: { key: '$(serviceTemplateId)', flags: 's' },
        userId: { key: '$(userId)', flags: 's' },
      },
      body: {
        'AccessPIN': '$(accessPIN)',
        'ConfGID': '$(confGID)',
        'DialableNumber': '$(dialableNumber)',
        'LoginId': '$(loginId)',
        'MemberId': '$(memberId)',
        'ServicePrefix': '$(servicePrefix)',
        'ServiceTemplateId': '$(serviceTemplateId)',
        'UserId': '$(userId)',
      },
      response: {
        dialingInfoText: { key: 'DialingInfo.Description', flags: 's' },
        dialingInfoHTML: { key: 'DialingInfo.DescriptionOfHTML', flags: 's' },
        location: { key: 'DialingInfo.LocationInfo', flags: 's' },
        requestId: { key: 'RequestID', flags: 's' },
        result: { key: 'ReturnValue', flags: 'er' }
      }
    }
  };

  function RoomsAPI(serverBase) {
    this.$super(serverBase);
  }

  Object.getOwnPropertyNames(methods).forEach(function (name) {
    RoomsAPI.prototype[name] = function(args) {
      return this._exec(methods[name], args);
    }
  }, this);

  module.exports = API.extend(RoomsAPI);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Log = __webpack_require__(3);

  var logger = Log.createLogger('TOM');

  var reUri = /(https?\:\/\/)(([^\. ]+(\.[^\. \/\:]+)*)(\:[0-9]+)?)(\/[^\,\.\!\?\r\n]?[^\? \r\n]*)?((\?[^ \r\n"<>]*))?/igm;
  var reTel = /([\=\&]?(\+[0-9])?((?:[- .()]*)[0-9](?:[- .()]*)){8,20})((?:[ ]*)?([\,0-9\*\#]+))?/igm;

  function unquote(v) {
    if (v && v[v.length - 1] === '"') {
      return v.substr(0, v.length - 1);
    }
    return v;
  }
  function extractUrls(s) {
    var r = [];
    for (var m; (m = reUri.exec(s)) && m[3]; ) {
      var uri = { proto: m[1] || 'http://', serverName: m[3].toLowerCase(), port: m[5] || '', path: m[6] || '', query: m[7] || '' };
      uri.server = unquote(uri.server);
      uri.query = uri.query.replace(/[\,\. \?\!\;]$/ig, '');
      uri.query = unquote(uri.query);
      uri.path = uri.path.replace(/[\,\. \?\!\;]$/ig, '');
      uri.path = unquote(uri.path);
      uri.url = [uri.proto, uri.serverName, uri.port, uri.path, uri.query].join('');
      r.push(uri);
    }
    return r;
  }
  function extractTels(s) {
    var r = [];

    for (var m; (m = reTel.exec(s)); ) {
      if (m[1] && ((m[1].indexOf('=') === 0) || (m[1].indexOf('&') === 0))) {
        continue;
      }
      var tel = { phone: m[1], pin: m[4] || '' };
      tel.tel = tel.phone.replace(/[^0-9\+\*\#]/ig, '');
      r.push(tel);
    }
    return r;
  }
  function parseUrl(url) {
    url = url || '';
    if ((url.indexOf('http://') < 0) && (url.indexOf('https://') < 0)) {
      url += 'https://';
    }
    return extractUrls(url)[0];
  }

  // Equinox validation
  function validateEquinoxMeetingUrl(config, url) {
    var path = url.path;
    var query = url.query;

    var reQuery = /^\?ID=([0-9]+)(\*+([0-9]+)?)?/ig;
    var room, pin;
    var mQuery = reQuery.exec(query);
    if (mQuery) {
      room = mQuery[1];
      pin = mQuery[3] || '';
    }

    var rePath = /recording\/?$/ig;
    var mPath = rePath.exec(path);
    if (mPath) {
      return null;
    }

    return { url: url, room: room, pin: pin };
  }
  function validateEquinoxMeetingCode(info) {
    var reRoom = /VirtualRoom([: -,.]*)([0-9]*)/ig;
    var rePIN = /VirtualRoomPin([: -,.]*)([0-9\#\*]*)/ig;
    var location = info.location.value;

    var res = { room: '', pin: '' };
    var mRoom = reRoom.exec(location);
    if (mRoom && mRoom[2]) {
      res.room = mRoom[2];
    }
    var mPIN = rePIN.exec(location);
    if (mPIN && mPIN[2]) {
      res.pin = mPIN[2];
    }

    return res;
  }
  function validateEquinoxMeetingInfo(config, rooms, info) {
    var confInfo = { type: 'equinox', url: '', tel: '', room: '', dial: '', isHost: false, clientUrl: !config.manual };
    confInfo = info.urls.reduce(function (r, item) {
      if (r.room) {
        return r;
      }
      var res = validateEquinoxMeetingUrl(config, item);
      if (res) {
        if (res.room) {
          r.url = res.url.url;
          r.room = res.room;
          r.pin = res.pin || '';
        } else {
          r.url = r.url || res.url.url;
        }
      }
      return r;
    }, confInfo);

    var res = validateEquinoxMeetingCode(info);
    if (!confInfo.room && res) {
      confInfo.room = res.room;
      confInfo.pin = res.pin;
    } else if (!confInfo.pin && res) {
      confInfo.pin = res.pin;
    }

    var telInfo = info.tels.reduce(function (r, item){
      var pin = item.pin.replace(/[^0-9*#]/ig, '');
      var tel = item.tel.replace(/[^0-9*#]/ig, '');

      if (tel === r.room) {
        return r;
      }

      if (pin && (pin.indexOf(r.room) === 0)) {
        r.telRoom = r.telRoom || item.tel;
      } else {
        r.telFirst = r.telFirst || item.tel;
      }
      return r;
    }, { room: confInfo.room.replace(/[^0-9*#]/ig, '') });
    confInfo.tel = telInfo.telRoom || telInfo.telFirst || '';

    if (!confInfo.room) {
      logger.info('validateEquinoxMeetingInfo (no room): ' + JSON.stringify(confInfo));
      return null;
    }
    
    var sipFQDNS = (config.conferenceFQDNSIPDialList || '').split(',');
    var sipUrls = sipFQDNS.map(function (item) {
      if ((item.indexOf('http://') !== 0) && (item.indexOf('https://') !== 0)) {
        item = 'https://' + item;
      }
      return (parseUrl(item || '') || {}).serverName || '';
    });
    var confUrl = (parseUrl(confInfo.url || '') || {}).serverName;
    var sipDial = confUrl && (sipUrls.indexOf(confUrl) >= 0);

    var pin = confInfo.pin;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].meetingId === confInfo.room) {
        confInfo.id = rooms[i].id;
        confInfo.isHost = true;
        // ACMACOS-10934, ACW-11836
        //if (rooms[i].moderatorPIN) {
        //  confInfo.pin = pin = rooms[i].moderatorPIN;
        //}
        break;
      }
    }

    if (sipDial) {
      confInfo.dial = confInfo.room + (pin ? '***' + pin : '');
      confInfo.bridge = confInfo.room || '';
    } else {
      if (!confInfo.tel) {
        logger.info('validateEquinoxMeetingInfo (no tel): ' + JSON.stringify(confInfo));
        return null;
      }
      // ACMACOS-10934, ACW-11836 - should we add moderator code for non-sipDial case?
      confInfo.dial = confInfo.tel ? confInfo.tel + ',,,' + (confInfo.room || '') + (pin ? '***' + pin : '') : '';
      confInfo.bridge = confInfo.tel || '';
    }

    return confInfo;
  }
  // Equinox validation

  // Cponference Validation
  function getConferenceInfoFromCodeAdjusted(code) {
    code = (code || '').replace(/^\,+/ig, '').replace(/\,+$/, '');
    var av = code.split(',');
    var room = av.shift().replace(/\#+$/, '');
    var pin = av.join(',');
    if (pin) {
      pin = ',' + pin;
    }
    return { room: room, pin: pin.replace(/^\,+/ig, ''), pinOrig: pin };
  }
  function validateConferenceMeetingUrl(config, url) {
    //if ((config.conferenceFQDNSIPDialList || '').indexOf(url.serverName) < 0) {
    //  return null;
    //}

    var q = url.path + url.query;
    var re = /(\/|\?participantCode=)(\d+)$/ig;
    var m = re.exec(q);
    if (m && m[2]) {
      var info = getConferenceInfoFromCodeAdjusted(m[2]);
      return { url: url, room: info.room || '', pin: info.pin || '' };
    }
  }
  function validateConferenceMeetingCode(info) {
    var reCode = /(PC|PIN|Passcode)([\#\:])?[ ]*([0-9\#\*\,]+)/ig;

    var _info;
    var mlCode = reCode.exec(info.location.value);
    if (mlCode && mlCode[3]) {
      _info = getConferenceInfoFromCodeAdjusted(mlCode[3]);
      return { room: _info.room, _info: info.pin };
    }
    var mbCode = reCode.exec(info.body.value);
    if (mbCode && mbCode[3]) {
      _info = getConferenceInfoFromCodeAdjusted(mbCode[3]);
      
      return { room: _info.room, _info: info.pin };
    }
  }
  function validateConferenceMeetingInfo(config, info) {
    var confInfo = { type: config.conferenceType, url: '', tel: '', room: '', dial: '', isHost: false };
    confInfo = info.urls.reduce(function (r, item) {
      if (r.room) {
        return r;
      }

      var res = validateConferenceMeetingUrl(config, item);
      if (res) {
        if (res.room) {
          r.url = res.url.url;
          r.room = res.room;
        } else {
          r.url = r.url || res.url.url;
        }
      }
      return r;
    }, confInfo);

    var res = validateConferenceMeetingCode(info);
    if (!confInfo.room && res) {
      confInfo.room = res.room;
      confInfo.pin = res.pin || '';
    } else if (!confInfo.pin && res) {
      confInfo.pin = res.pin || '';
    }
    // in above block should we care if pin retrieved from url somehow, or forcing it from PC code or tels is ok

    var telInfo = info.tels.reduce(function (r, item){
      var info = getConferenceInfoFromCodeAdjusted(item.pin);

      if (info.pin && ((info.room === r.room) || !r.room)) {
        r.telRoom = r.telRoom || item.tel;

        r.telPIN = r.telPIN || info.pin;
        if (!r.room) {
          r._room = r._room || info.room;
        }
      } else {
        r.telFirst = r.telFirst || item.tel;
      }
      return r;
    }, { room: confInfo.room.replace(/[^0-9*#]/ig, '') });
    confInfo.tel = telInfo.telRoom || telInfo.telFirst || '';

    if (!confInfo.room && telInfo._room) {
      confInfo.room = telInfo._room || '';
    }
    if (!confInfo.pin && telInfo.telPIN) {
      confInfo.pin = (telInfo.telPIN || '');
    }

    if (!confInfo.room || (!confInfo.url && !confInfo.tel)) {
      logger.info('validateConferenceMeetingInfo (no room/url+tel): ' + JSON.stringify(confInfo));
      return null;
    }
    
    var confPC = (config.conferenceParticipantCode || '').replace(/[^0-9\*\#\,]/ig, '');
    var confPCInfo = getConferenceInfoFromCodeAdjusted(confPC);
    var confMC = (config.conferenceModeratorCode || '').replace(/[^0-9\*\#\,]/ig, '');
    var confMCInfo = getConferenceInfoFromCodeAdjusted(confMC);

    var roomNP = (confInfo.room || '');
    
    var hostServer = (parseUrl(config.conferenceModeratorUrl) || {}).serverName || '-';
    var confServer = (parseUrl(confInfo.url) || {}).serverName || '';
    confInfo.isHost = /*(!confServer || (hostServer === confServer)) &&*/ (roomNP === confPCInfo.room);
    if (config.conferenceParticipantUrl && (config.conferenceParticipantUrl === confInfo.url)) {
      confInfo.isHost = true;
    }
    confInfo.tel = confInfo.tel;

    var dtmf = '';
    if (confInfo.isHost) {
      dtmf = confMCInfo.room + '#';
      if (confMCInfo.pinOrig) {
        confInfo.pin = confMCInfo.pinOrig;
        dtmf = dtmf + confMCInfo.pinOrig;
      }
    }
    if (!dtmf) {
      dtmf = confInfo.room + '#';
      if (confInfo.pin) {
        dtmf = dtmf + ',,' + confInfo.pin;
      }
    }

    confInfo.dial = confInfo.tel ? confInfo.tel + (dtmf ? ',,,' + dtmf : '') : '';

    return confInfo;
  }
  // Conference Validation

  function extractMeetingInfo(config, rooms, meeting) {
    rooms = rooms || [];
    logger.info('extractMeetingInfo rooms: ' + JSON.stringify(rooms));
    var extracted = { };
    extracted.location = { urls: extractUrls(meeting.location || ''), tels: extractTels(meeting.location || ''), value: meeting.location || '' };
    logger.info('extracted location: urls: ' + JSON.stringify(extracted.location.urls) + ', tels: ' + JSON.stringify(extracted.location.tels));
    extracted.body = { urls: extractUrls(meeting.body || ''), tels: extractTels(meeting.body || ''), value: meeting.body || '' };
    logger.info('extracted body: urls: ' + JSON.stringify(extracted.body.urls) + ', tels: ' + JSON.stringify(extracted.body.tels));
    extracted.urls = [].concat(extracted.location.urls, extracted.body.urls);
    extracted.tels = [].concat(extracted.location.tels, extracted.body.tels);
    var confInfo = validateEquinoxMeetingInfo(config, rooms, extracted);
    if (!confInfo) {
      confInfo = validateConferenceMeetingInfo(config, extracted);
    }
    if (!confInfo) {
      confInfo = { url: '', dial: '', room: '', pin: '', isHost: false, type: 'empty' };
    }
    logger.info('extractMeetingInfo: ' + JSON.stringify(confInfo));
    return confInfo;
  }

  function getJoinConferenceMeetingUri(info) {
    logger.info('getJoinConferenceMeetingUri');
    if (info.dial) {
      var uri = 'avaya://video?' + info.dial;
      logger.info('getJoinConferenceMeetingUri:' + uri);
      return uri;
    }
    return '';
  }
  function getJoinEquinoxMeetingUri(info) {
    logger.info('getJoinEquinoxMeetingUri:' + JSON.stringify(info));
    if (info.bridge) {
      var uri;
      if (!info.clientUrl) {
        uri = info.url;
      } else {
        var args = { };
        if (info.pin) {
          args['MeetingPasscode'] = info.pin;
        }
        if (info.room) {
          args['MeetingId'] = info.room;
        }
        if (info.url) {
          args['portalUrl'] = info.url;
        }

        var urlArgs = Object.getOwnPropertyNames(args).reduce(function (r, key) {
          // r.push([key, encodeURIComponent(args[key])].join('='));
          r.push([key, args[key]].join('='));
          return r;
        }, []);
        if (urlArgs.length) {
          urlArgs = '&' + urlArgs.join('&');
        }
        uri = 'avaya://video?' + info.bridge + urlArgs;
      }
      logger.info('getJoinEquinoxMeetingUri:' + uri);
      return uri;
    }
  }

  function getJoinMeetingUri(meetingInfo) {
    logger.info('getJoinMeetingUri');
    if (meetingInfo.type !== 'equinox') {
      return getJoinConferenceMeetingUri(meetingInfo);
    } else {
      return getJoinEquinoxMeetingUri(meetingInfo);
    }
  }

  function joinMeeting(meetingInfo) {
    var uri = getJoinMeetingUri(meetingInfo);
    if (uri) {
      window.open(uri, '_self');
    }
  }

  var TopOfMind = {
    extractMeetingInfo: extractMeetingInfo,
    getJoinMeetingUri: getJoinMeetingUri,
    joinMeeting: joinMeeting,
  };

  module.exports = TopOfMind;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  function Templates(opt) {
    this._url = opt.url || '../templates/';
    this._langId = opt.langId || 'en';
    this._html = !!opt.html;
    this._maxLineLength = opt.maxLineLength || 68;
    this._logger = opt.logger;
    this.i18n = opt.i18n;
  }
  Templates.prototype._limitLineLength = function (s, len) {
    var words = s.split(' ');
    var lines = words.reduce(function (r, word) {
      var line = r[r.length - 1] || '';
      if (!line.length) {
        line = word;
      } else if (line.length + word.length + 1 > len) {
        line = word;
        r.push('');
      } else {
        line = line + ' ' + word;
      }
      r[r.length - 1] = line;
  
      return r;
    }, ['']);
  
    return lines.join('\r\n');
  };

  Templates.prototype._splitCompoundValues = function (strings) {
    Object.getOwnPropertyNames(strings).forEach(function(key) {
      var value = strings[key];
      if (value.indexOf('%%') !== -1) {
        delete strings[key];
        var pp = value.split('%%');
        strings[key + '_PREFIX'] = pp[0];
        strings[key + '_POSTFIX'] = pp[2];
      } else {
        var re = /(.*)?<a xsubst>(.*)?<\/a>(.*)?/;
        var m = re.exec(value);
        if (m && m.length === 4) {
          delete strings[key];
          strings[key + '_PREFIX'] = m[1] || '';
          strings[key + '_LINK'] = m[2] || '';
          strings[key + '_POSTFIX'] = m[3] || '';
        }
      }
   });
  }
    
  Templates.prototype.applyTranslations = function(content, type, langId, html) {
    var self = this;
    langId = langId || self._langId || 'en';

    var ln_strings = self.i18n[langId] || self.i18n;
    this._splitCompoundValues(ln_strings);
    var langIdEn = 'en';
    var en_strings = self.i18n[langIdEn] || { };
    this._splitCompoundValues(en_strings);

    var lineTag = html ? '--' + Date.now() + '--' : '';
  
    var re = /\$\(([^\)]+)\)/gm;
    content = content.replace(re, function (m, key) {
      var s = typeof(ln_strings[type + '_' + key]) !== 'undefined' ? ln_strings[type + '_' + key] : en_strings[type + '_' + key];
      if (typeof(s) !== 'undefined') {
        return lineTag + (s);
      }
      return m;
    });
  
    var reTag = /--\d+--/ig;
    var reLines = /^.*(--\d+--).*$/gm;
    var maxLen = this._maxLineLength;
    content = content.replace(reLines, function (m, tag) {
      if (tag !== lineTag) {
        return m;
      }
      m = m.replace(reTag, '');
      return self._limitLineLength(m, maxLen);
    });
  
    return content;
  };
    
  Templates.prototype.getTemplate = function (type) {
    var self = this;
    var templateUrl = self._url + type + (self._html ? '.html' : '.txt');
    if (self._logger) {
      self._logger.info('getTemplate: ' + templateUrl);
    }
    return fetch(templateUrl).then(function (r) {
      return r.text();
    }).then(function (content) {
      return self.applyTranslations(content, type.toUpperCase(), self._langId, self._html);
    }, function (err) {
      throw { error: { fetchTemplate: true } };
    });
  };

  module.exports = Templates;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var schema = __webpack_require__(15);

  var SpacesSchema = {
    onTopic: schema.eventBroadcast,
    onSearch: schema.eventUnicast,

    getTopics: schema.methodPromise,
    searchTopics: schema.methodPromise,

    createInvite: schema.methodPromise,
    removeInvite: schema.methodPromise,

    createTopic: schema.methodPromise,    
    removeTopic: schema.methodPromise,
    
    refresh: schema.methodPromise,

    joinTopic: schema.methodOneWay,
  };

  module.exports = SpacesSchema;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);

  function createToken() {
    var self = { };
    self.token = new Promise(function (resolve, reject) {
      self.cancel = reject.bind(null, { error: { canceled: true } });
    });
    return self;
  }
  
  function PromiseCancel() {
    var token = createToken();
    this.token = token.token;
    this.cancel = token.cancel;
  }
  PromiseCancel.prototype.exec = function (promise) {
    var cmd = Promise.race([promise, this.token]);
    cmd.cancel = this.cancel;
    return cmd;
  };

  module.exports = PromiseCancel;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(8);  
  var Promise = __webpack_require__(0);
  var Utils = __webpack_require__(1);
  var OAuthStorage = __webpack_require__(42);

  /** @constructor */  
  function OAuth(opt) {
    this.storage = opt.storage || new OAuthStorage(opt);
    this.providers = [];
  }
  OAuth.prototype.registerProvider = function (provider) {
    provider.setStorage(this.storage);
    
    this.providers.push(provider);
  };
  OAuth.prototype.getProvider = function (type) {
    var providers = this.providers;
    for (var i = 0; i < providers.length; i++) {
      var provider = providers[i];
      if (provider.clientType === type) {
        return provider;
      }
    }
  };
  
  OAuth.prototype.login = function (opt) {
    if (!opt.type) {
      var p = this.storage.getPrimary();
      if (p) {
        opt.type = p.type;
      }
    }
    
    var provider = this.getProvider(opt.type);
    if (!provider) {
      return Promise.reject({ error: { provider: true } });
    }
    
    return provider.login(opt);
  };
  OAuth.prototype.logout = function (opt) {
    var provider = this.getProvider(opt.type);
    if (!provider) {
      return Promise.reject({ error: { provider: true } });
    }
    return provider.logout(opt);
  };
  OAuth.prototype.getToken = function (opt) {
    Utils.showLogInfo('identity: OAuth.getToken', opt, ['cancelToken'], true);
    var provider = this.getProvider(opt.type);
    if (!provider) {
      return Promise.reject({ error: { provider: true } });
    }
    return provider.getToken(opt);
  };

  module.exports = Base.extend(OAuth);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(8);
  var Storage = __webpack_require__(11);
  var Utils = __webpack_require__(1);

  /** @constructor */  
  function OAuthStorage(opt) {
    this.key = opt.key || 'oauth_storage';
    this.allowSave = !!opt.allowSave;

    this.load();
  }
  OAuthStorage.prototype.load = function () {
    var jso = Storage.getItem(this.key) || null;
    this.items = Utils.safeParse(jso) || {};
  };
  OAuthStorage.prototype.save = function () {
    if (!this.allowSave) {
      return;
    }
    var jso = JSON.stringify(this.items);
    Storage.setItem(this.key, jso);
  };
  OAuthStorage.prototype.clear = function () {
    this.items = {};
    this.save();
  };
  OAuthStorage.prototype.getAll = function () {
    var res = [];
    var types = Object.getOwnPropertyNames(this.items);
    for (var i = 0; i < types.length; i++) {
      res.push(this.items[types[i]]);
    }
    return res;
  };
  OAuthStorage.prototype.getPrimary = function () {
    var items = this.getAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].primary) {
        return items[i];
      }
    }
  };
  OAuthStorage.prototype.getByType = function (type, userId) {
    if (!type) {
      return null;
    }
    var key = type;
    if (userId) {
      key = key + '-' + userId;
    }
    return this.items[key] || null;
  };
  OAuthStorage.prototype.add = function (item) {
    if (item && item.type) {
      var key = item.type;
      if (!item.primary && item.userId) {
        key = key + '-' + item.userId;
      }
      this.items[key] = item;
      this.save();
    }
  };
  OAuthStorage.prototype.remove = function (item) {
    if (item && item.type) {
      var key = item.type;
      if (!item.primary && item.userId) {
        key = key + '-' + item.userId;
      }
      delete this.items[key];
      this.save();
    }
  };
  
  module.exports = Base.extend(OAuthStorage);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(16);
  var fetchproxy = __webpack_require__(10);

  var clientType = 'google';

  /** @constructor */
  function OAuthProviderGoogle() {
    this.clientType = clientType;
  }
  OAuthProviderGoogle.clientType = clientType;
  
  OAuthProviderGoogle.prototype.init = function (opt) {
    this.initUrls({ urlLogin: 'https://accounts.google.com/o/oauth2/auth', urlToken: 'https://accounts.google.com/o/oauth2/token' });
    this.initClient(opt.client);
  };
  OAuthProviderGoogle.prototype.getUserInfo = function (info) {
    var url = 'https://www.googleapis.com/oauth2/v1/userinfo';

    var opt = { 'method': 'GET', 'headers': { 'authorization': 'Bearer ' + info.token.token } };
    return fetchproxy(url, opt).then(function (r) {
      return r.json();
    }).then(function (r) {
      info.userInfo = {};
      info.userInfo.user = r['email'] || '';
      info.userInfo.image = r['picture'] || '';
      info.userInfo.name = r['name'] || '';
      return info;
    });
  };
  
  module.exports = OAuthProvider.extend(OAuthProviderGoogle);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module){
  'use strict';
  
  var globals = __webpack_require__(4);
  //var fetch = require('./fetch.poly');
  var fetchDefs = __webpack_require__(45);

  var loader = __webpack_require__(13);

  var _fetch = globals.safeProp(fetchDefs.fetchKey);
  var fetch = _fetch;

  if (!fetch) {
    fetch = function fetch() {
      return _fetch.apply(null, arguments);
    };
    loader.load('/lib/contrib/fetch.js', 'fetch', function () {
      _fetch = globals.safeProp(fetchDefs.fetchKey);
    });
  }

  module.exports = fetch;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var globals = __webpack_require__(4);

  var debug = '';

  var fetchMethods = {
    get: 'GET',
    delete: 'DELETE',
    head: 'HEAD',
    options: 'OPTIONS',
    post: 'POST',
    put: 'PUT'
  };

  var fetchDefinitions = {
    sEmpty: '',
    sEqual: '=',
    sSpace: ' ',
    sAmp: '&',
    sLF: '\n',
    sColon: ':',

    encodedSpace: /\+/g,
    
    headersKey: debug + 'Headers',
    headersValidator: /[^a-z0-9\-#$%&'*+.\^_`|~]/i,
    headersInvalidHeader: 'Invalid character in header field name',
    headersContentType: 'content-type',
    headersLocation: 'location',
    headersXRequestUrl: 'X-Request-URL',

    errBodyUnsupported: 'unsupported type',
    errBodyConsumed: 'already read',
    errBodyFormBlob: 'could not read FormData body as blob',
    errBodyFormText: 'could not read FormData body as text',
    errRedirectStatus: 'Invalid status code',
    errRequestBody: 'Body not allowed for GET or HEAD requests',
    errRequestFailed: 'Network request failed',

    hasFormData: globals.hasKey('FormData'),
    hasBlob: globals.hasKey('FileReader') && globals.hasKey('Blob'),
    hasSearchParams: globals.hasKey('URLSearchParams'),
    hasArrayBuffer: globals.hasKey('ArrayBuffer'),

    mimeTextUTF8: 'text/plain;charset=UTF-8',
    mimeFormUTF8: 'application/x-www-form-urlencoded;charset=UTF-8',

    fetchKey: debug + 'fetch',

    requestKey: debug + 'Request',
    requestCredentialsInclude: 'include',

    responseKey: debug + 'Response',    
    responseTypeDefault: 'default',
    responseTypeError: 'error',
    responseTypeKeyXHR: 'responseType',
    responseTypeBlobXHR: 'blob',
    responseKeyXHR: 'response',
    responseURLKeyXHR: 'responseURL',
    
    redirectCodes: [301, 302, 303, 307, 308],
    requestMethods: fetchMethods,
    requestMethodsNormalize: [ fetchMethods.get, fetchMethods.post, fetchMethods.delete, fetchMethods.put, fetchMethods.head, fetchMethods.options ],
  };

  module.exports = fetchDefinitions;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var LiteralMap = __webpack_require__(25);

  var jwtProps = new LiteralMap({
    audience: 'aud', nonce: 'nonce', issuer: 'iss', issued: 'iat', expiry: 'exp', verified: 'email_verified', email: 'email',
    client: 'azp', hash: 'at_hash', subject: 'sub' 
  });

  /** @constructor */  
  function JWT(data) {
    if (!(this instanceof JWT)) {
      return new JWT(data);
    }
    if (typeof (data) === 'string') {
      var jso = JSON.parse(atob(data.split('.')[1]));
      jwtProps.mapReverse(jso, this);

      var dt = Date.now() / 1000;
      this.expiry = new Date((this.expiry || dt)*1000);
      this.issued = new Date((this.issued || dt)*1000);
      this.token = data;
    }
  }

  module.exports = JWT;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Timer = __webpack_require__(14);  
  var Promise = __webpack_require__(0);
  var Utils = __webpack_require__(1);
  var chrome = __webpack_require__(7);
  var Window = __webpack_require__(48);

  var authErrKey = 'auth-error';

  function exec(promise, cancel, cleanup) {
    var ap = [promise];
    if (cancel) {
      ap.push(cancel);
    }
    var resolve = function (res) {
      if (cleanup) {
        cleanup();
      }
      return Promise.resolve(res);
    };
    var reject = function (err) {
      if (cleanup) {
        cleanup();
      }
      return Promise.reject(err);
    };
    return Promise.race(ap).then(resolve, reject);
  }

  function clearAuthInfo() {
    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      if (key && localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    }
  }
  function extractAuthInfo(hash) {
    var info = {};
    Utils.extractUrlInfo(hash || '', info);
    return info;
  }
  
  function addFrame(url, cb) {
    var frame = document.createElement('iframe');
    frame.src = url;
    frame.style.display = 'none';
    frame.addEventListener('load', cb);
    document.body.appendChild(frame);
    return frame;
  }

  function UnattendedValidator(opt) {
    Utils.showLogInfo('identity: UnattendedValidator', opt, ['cancelToken'], true);
    this.opt = opt;
  }  
  UnattendedValidator.prototype.init = function (resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;

    if (this.opt.nosilent) {
      return this.reject({ error: { nosilent: true } });
    }

    clearAuthInfo(this.opt.state, authErrKey); // just for case
    this.frame = addFrame(this.opt.url, function () {
      this._waitFrame = setTimeout(this.check.bind(this, true), 2000);
    }.bind(this));

    window.addEventListener('message', this.cbMessage = function (ev) {
      //debugger;
      console.info('RECV:', ev);
      var data = ev.data || {};

      if (data.validate) {
        if (data.id === chrome.runtime.id) {
          ev.source.postMessage({ id: data.id }, '*');
        }
      } else if (typeof(data.hash) !== 'undefined') {
        localStorage.setItem(this.opt.state, data.hash);
        this.check(true);
      }
    }.bind(this));  

    this._waitEvent = this.check.bind(this);
    window.addEventListener('storage', this._waitEvent);
  };
  UnattendedValidator.prototype.shut = function () {
    if (this.frame) {
      this.frame.parentElement.removeChild(this.frame);
      this.frame = null;
    }
    if (this.cbMessage) {
      window.removeEventListener('message', this.cbMessage);
      this.cbMessage = null;
    }
    if (this._waitFrame) {
      this._waitFrame = clearTimeout(this._waitFrame) || 0;
    }
    if (this._waitEvent) {
      window.removeEventListener('storage', this._waitEvent);
      this._waitEvent = null;
    }
  };
  UnattendedValidator.prototype.check = function (force) {
    var hash = localStorage.getItem(this.opt.state);
    if (hash) {
      if (this._waitFrame) {
        this._waitFrame = clearTimeout(this._waitFrame) || 0;
      }
      clearAuthInfo(this.opt.state);
      Utils.showLogInfo('identity: UnattendedValidator.check', hash);
      var res = extractAuthInfo(hash);
      Utils.showLogInfo('identity: UnattendedValidator.check resolve', res);
      if (!res.error) {
        this.resolve(res);
      } else {
        this.reject(res);
      }
    } else if (force) {
      clearAuthInfo(authErrKey);
      var err = { error: { unattended: true } };
      Utils.showLogInfo('identity: UnattendedValidator.check reject', err);
      this.reject(err);
    }
  };
  UnattendedValidator.prototype.async = function () {
    var cmd = new Promise(this.init.bind(this));
    return exec(cmd, this.opt.cancelToken, this.shut.bind(this));
  };

  var FORCEGETITEM = 'forceGetItem'; // Force MS Outlook catch state on check (see below), storage event never occurs
  
  function AttendedValidator(opt) {
    Utils.showLogInfo('identity: AttendedValidator', opt, ['cancelToken'], true);
    this.opt = opt;
  }
  AttendedValidator.prototype.init = function (resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;

    if (this.opt.noui) {
      var err = { error: { noui: true } };
      Utils.showLogInfo('identity: AttendedValidator reject', err);
      return this.reject(err);
    }
    var self = this;
    var apppath = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
// self.wnd = window.open(self.opt.url, '_self'); // open auth url in the app window
// localStorage.setItem('myAppPath', apppath);
    if (!this.opt.asyncui) {
      var url = this.opt.url;
      if (!(chrome && chrome.runtime)) { // allow Chrome (Edge, Firefox) open auth window directly (or as tab)
        var redirectpath = apppath.replace(/(.*)\/.*\.html$/i, '$1/redirect.html'); // but use redirect for IE
        url = redirectpath + '?' + this.opt.url;
      }
      this.wnd = Window.open(url, this.opt.target || '_blank');
      if (!this.wnd) {
        var err = { error: { blocked: true } };
        Utils.showLogInfo('identity: AttendedValidator reject', err);
        return this.reject(err);
      }
      this.checkWndClosed = true;
    } else {
      var url;
      if (this.opt.asyncui.hostName === 'Outlook') {
        url = apppath.replace(/(.*)\/.*\.html$/i, '$1/redirect.html') + '?' + this.opt.url;
      } else {
        url = this.opt.url;
      }

      this.opt.asyncui.open(url).then(function (result) {
        function closePending() {
          window.removeEventListener('unload', closePending);
          if (self.wnd) {
            self.wnd.close();
            self.wnd = null;
          }
        }
        window.addEventListener('unload', closePending);
        self.wnd = result.value;
        if (self.wnd) { // all known browsers open OAuth window via DialogAPI
          var asyncDialog = typeof(self.wnd) === 'object' && 'addEventHandler' in self.wnd;
          self.checkWndClosed = !asyncDialog;
          if (asyncDialog) {
            self.wnd.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, function (event) {
              if (!self.wnd) {
                return;
              }
              console.info('dialog event received:', event.message);
              if (event.error === 12002) {
                if (self.wnd) {
                  self.wnd.close();
                  self.wnd = null;
                }
                self.reject({ error: { blocked: true } });
                return;
              }
              if (event.error === 12006) {
                self.wnd = null;
              }
              self.reject({ error: { closed: true } });
            });
          }
        // } else if (self.opt.asyncui.hostName === 'Outlook') { // but old Outlook desktop client returns 5001 error
        //   // self.wnd = window.open(self.opt.url, '_blank'); // redirect is not required // avoid allow popups request
        //   self.wnd = window.open(self.opt.url, '_self'); // open auth url in the app window instead
        //   localStorage.setItem('myAppPath', apppath);
        }
        if (!self.wnd) {
          return self.reject({ error: { blocked: true } });
        }
      }, function (result) {
          return self.reject({ error: { blocked: true } });
      });
    }
    clearAuthInfo(this.opt.state, this.opt.authErrKey, FORCEGETITEM); // just for case
    window.addEventListener('storage', this.onStorage = function onStorage(e) {
      if (e.key === self.opt.state && e.newValue) {
        var hash = e.newValue;
        window.removeEventListener('storage', onStorage);
        clearAuthInfo(self.opt.state, FORCEGETITEM);
        Utils.showLogInfo('identity: AttendedValidator event resolve', hash);
        self.resolve(extractAuthInfo(hash));
      } 
      if (e.key === authErrKey && e.newValue) {
        var err = e.newValue;
        window.removeEventListener('storage', onStorage);
        clearAuthInfo(authErrKey, FORCEGETITEM);
        Utils.showLogInfo('identity: AttendedValidator event reject', err);
        self.reject(err);
      } 
    });
    this.timerInterval = this.opt.checkInterval || 1000;
    this.checks = 0;
    this.timer = new Timer(this.check.bind(this), 0);
  };
  AttendedValidator.prototype.shut = function () {
    if (this.wnd) {
      this.wnd.close();
      this.wnd = null;
    }
    if (this.timer) {
      this.timer.reset();
      this.timer = null;
    }
  };
  AttendedValidator.prototype.check = function () {
    this.checks += 1;
    localStorage.setItem(FORCEGETITEM, '!!!'); // MS Outlook never gets state item without some setItem call
    var hash = localStorage.getItem(this.opt.state);
    if (hash) {
      window.removeEventListener('storage', this.onStorage);
      clearAuthInfo(this.opt.state, FORCEGETITEM);
      Utils.showLogInfo('identity: AttendedValidator.check (' + this.checks + ') resolve', hash);
      this.resolve(extractAuthInfo(hash));
    }

    if (this.checkWndClosed) {
      if (chrome) { //  && chrome.runtime???
        var closed;
        try {
          // if window.close() executed in web browser control could lead to exception here
          closed = this.wnd.closed || (this.wnd.opener !== window.self);
        } catch (e) {
          closed = true; // wnd.opener on closed window causes error in IE
        }
        if (closed) {
          // skip cleanup for window that is reported as closed anyway
          this.wnd = null; 
          var err = { error: { closed: true } };
          Utils.showLogInfo('identity: AttendedValidator.check (' + this.checks + ') reject', err);
          return this.reject(err);
        }
      }
    }
    if (this.timeout > Date.now()) {
      var err = { error: { timeout: true } };
      Utils.showLogInfo('identity: AttendedValidator.check (' + this.checks + ') reject', err);
      return this.reject(err);
    }

    this.timer.start(this.timerInterval);
  };
  AttendedValidator.prototype.async = function () {
    var cmd = new Promise(this.init.bind(this));
    return exec(cmd, this.opt.cancelToken, this.shut.bind(this));
  };

 
  function OAuthInteractive(opt) {
    return new UnattendedValidator(opt).async().then(null, function (res) {
      Utils.showLogInfo('identity: OAuthInteractive rejected', res);
      if (res && res.error && res.error.canceled) {
        return Promise.reject(res);
      }
      return new AttendedValidator(opt).async();
    });
  }

  module.exports = OAuthInteractive;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var ChromeTabs = __webpack_require__(49);

  function open(url, target) {
    switch (window.location.protocol) {
      case 'moz-extension:':
        return ChromeTabs.create(url);
      default:
        return window.open(url, target);
    }
  }
  
  module.exports = { open: open };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  // chrome.tabs is only available in background scripts
  if (window.location.protocol !== 'moz-extension:') { // see ChromeTabs usage in ./window
    module.exports = { };
    return;
  }

  var chrome = __webpack_require__(7);
  var Utils = __webpack_require__(1);

  var OAUTH_PROVIDER = 'https://manage1.esna.com/oauth/token.redirect';

  /** @constructor */
  function ChromeTabs() {
    this.tabs = { };
    chrome.tabs.onRemoved.addListener(function (id, info) {
      if (this.tabs[id]) {
        this.tabs[id].closed = true;
        delete this.tabs[id];
      }
    }.bind(this));
    chrome.tabs.onUpdated.addListener(function (id, info) {
      if (!this.tabs[id] || !info || !info.url || info.url.indexOf(OAUTH_PROVIDER) !== 0) {
        return;
      }
      var auth = info.url.substr(OAUTH_PROVIDER.length);
      var state = Utils.extractUrlInfo(auth, {})['state'];
      localStorage.setItem(state, auth);
    }.bind(this));
  }

  ChromeTabs.prototype.create = function (url) {
    var objtab = { opener: window };
    var self = this;
    chrome.tabs.create({ 'url': url }, function (tab) {
      objtab.id = tab.id;
      self.tabs[tab.id] = objtab;
    });
    objtab.close = function() {
      if (this.id && !this.closed) {
        chrome.tabs.remove(this.id);
      }
      this.closed = true;
    };
    objtab.closed = false;
    return objtab;
  };

  module.exports = new ChromeTabs();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(16);

  var clientType = 'salesforce';
  
  /** @constructor */  
  function OAuthProviderSalesforce() {
    this.clientType = clientType;
  }
  OAuthProviderSalesforce.clientType = clientType;
  
  OAuthProviderSalesforce.prototype.init = function (opt) {
    opt = opt || {};
    if (!opt.urls) {
      opt.urls = { urlLogin: 'https://login.salesforce.com/services/oauth2/authorize', urlToken: 'https://login.salesforce.com/services/oauth2/token' };
    }
    this.initUrls(opt.urls);
    this.initClient(opt.client);
  };
  
  module.exports = OAuthProvider.extend(OAuthProviderSalesforce);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(16);
  var Utils = __webpack_require__(1);
  var fetchproxy = __webpack_require__(10);

  var clientType = 'esna';

  /** @constructor */  
  function OAuthProviderEsna() {
    this.clientType = clientType;
  }
  OAuthProviderEsna.clientType = clientType;
  
  OAuthProviderEsna.prototype.init = function (opt) {
    opt = opt || {};
    if (!opt.urls) {
      var root = opt.accountsUrl || 'https://accounts.zang.io';
      if (opt.staging) {
        root = 'https://onesnastaging.appspot.com';
      } else if (opt.testing) {
        root = 'https://onesnatesting.appspot.com';
      }
      var urlLogin = root + '/oauth2/authorize';
      var urlLogout = root + '/account/logout' + '?next=' +  encodeURIComponent(urlLogin);
      opt.urls = { urlRoot: root, urlLogin: urlLogin, urlLogout: urlLogout, urlToken: root + '/oauth2/access_token' };
    }
    this.initUrls(opt.urls);
    this.initClient(opt.client);
  };
  OAuthProviderEsna.prototype.supportsIncremental = function () {
    return false;
  };
  OAuthProviderEsna.prototype.supportsOpenId = function () {
    return false;
  };
  OAuthProviderEsna.prototype.applyLoginScope = function (scope) {
    scope.push('https://www.onesna.com/auth/userinfo.email');
    scope.push('https://www.onesna.com/auth/userinfo.profile');
  };
  OAuthProviderEsna.prototype.getUserInfo = function (info) {
    var root = this.urlRoot;
    
    var url = '/api/1.0/user/self/';
    //var url = '/api/users/me/';
    url = root + url;

    var opt = { 'method': 'GET', 'headers': { 'authorization': 'Bearer ' + info.token.token } };
    return fetchproxy(url, opt).then(function (r) {
      try {
        return r.json();
      } catch (e) {
        Utils.showLogInfo('identity: OAuthProviderEsna.getUserInfo, error: ' + e.message + ', r: ' + r.toString());
        return Promise.reject({ error: { fetch: true } });
      }
    }).then(function (r) {
      info.userInfo = { };
      info.userInfo.user = r['username'];    
      info.userInfo.image = r['picture_url'];
      var n = [], name = r['name'];
      if (name['formatted']) {
        n.push(name['formatted']);
      } else {
        if (name['givenname']) {
          n.push(name['givenname']);
        }
        if (name['familyname']) {
          n.push(name['familyname']);
        }
      }
      info.userInfo.name = n.join(' ') || '';
      Utils.showLogInfo('identity: OAuthProviderEsna.getUserInfo', info);
      return info;
    });
  };
  
  module.exports = OAuthProvider.extend(OAuthProviderEsna);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(16);

  var clientType = 'microsoft';

  /** @constructor */
  function OAuthProviderMicrosoft() {
    this.clientType = clientType;
  }
  OAuthProviderMicrosoft.clientType = clientType;
  
  OAuthProviderMicrosoft.prototype.init = function (opt) {
    opt = opt || {};
    if (!opt.urls) {
      opt.urls = { urlLogin: 'https://login.windows.net/common/oauth2/authorize', urlToken: 'https://login.windows.net/common/oauth2/token' };
    }
    this.initUrls(opt.urls);
    this.initClient(opt.client);
  };
  
  module.exports = OAuthProvider.extend(OAuthProviderMicrosoft);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var PromiseQueue = __webpack_require__(54);
  var fetchproxy = __webpack_require__(10);
  var Utils = __webpack_require__(1);

  var commands = {
    check: {
      url: '/api/1.0/licenses/self/check',
      method: 'GET',
      'authorization': 'Bearer '
    },
    accept: {
      url: '/api/1.0/users/self/products/{0}/agreement/',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer '
      }
    },
    load: {
      url: '/api/1.0/users/self/products/{0}/app_profile_setting/',
      method: 'GET',
      headers: {
        'authorization': 'Bearer '
      }
    },
    save: {
      url: '/api/1.0/users/self/products/{0}/app_profile_setting/',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer '
      }
    }
  };

  function getToken(provider, opt) {
    var args = opt.args;
    if (!args.headers || !args.headers['authorization']) {
      return Promise.resolve(opt);
    }
    return provider.getToken().then(function (r) {
      args.headers['authorization'] = 'Bearer ' + r.token;
      return opt;
    });
  }
  function execQueued(provider, queue, opt) {
    var url = opt.endpoint + opt.cmd.url;
    url = url.replace(/\{0\}/ig, opt.sku);

    var data = opt.data;
    var headers = { };
    var h = opt.cmd.headers || {};
    for (var key in h) {
      headers[key] = h[key];
    }
    
    opt = { url: url, args: { 'method': opt.cmd.method, 'body': data, 'headers': headers } };
    return queue.ready().then(function (r) {
      r = r;
      return getToken(provider, opt);
    }).then(function (opt) {
      return fetchproxy(opt.url, opt.args);
    }).then(function (res) {
      queue.done();
      if (!res.ok) {
        return {};
      }
      return res.json();
    }, function (err) {
      queue.done();
      return Promise.reject(err);
    });
  }

  /** @constructor */  
  function OnEsna() {
    this.local = true;
    
    this.queue = new PromiseQueue({ max: 1 });
  }
  OnEsna.prototype.init = function (opt) {
    this.sku      = opt.sku || 'kale';
    this.endpoint = opt.endpoint || opt.accountsUrl;
    this.getToken = opt.getToken;
  };
  OnEsna.prototype.shut = function () {
    delete this.sprofile;
    delete this.profile;
    
    this.queue.clear();
  };

  OnEsna.prototype.checkLicense = function () {
    //var self = this;
    return execQueued(this, this.queue, { endpoint: this.endpoint, sku: this.sku, cmd: commands.check }).then(function (res) {
      res = res;
      return Promise.resolve(true);
    }, function (res) {
      res = res;
      return Promise.resolve(false);
    });
  };
  OnEsna.prototype.loadProfile = function () {
    if (typeof (this.profile) !== 'undefined') {
      return Promise.resolve(this.profile);
    }

    if (this.local) {
      var r = localStorage.getItem('jsl_onesna');
      r = Utils.safeParse(r) || {};
      this.profile = r;
      this.sprofile = JSON.stringify(r);
      return Promise.resolve(r);
    }
    
    var self = this;
    return execQueued(this, this.queue, { endpoint: this.endpoint, sku: this.sku, cmd: commands.load }).then(function (res) {
      self.profile = res;
      self.sprofile = JSON.stringify(self.profile);
      return Promise.resolve(self.profile);
    });
  };
  OnEsna.prototype.saveProfile = function (data) {
    var profile = JSON.stringify(data);
    if (profile === this.sprofile) {
      return Promise.resolve(data);
    }
    
    if (this.local) {
      this.sprofile = JSON.stringify(this.profile);
      localStorage.setItem('jsl_onesna', this.sprofile);
      return Promise.resolve(this.profile);
    }

    var self = this;
    return execQueued(this, this.queue, { endpoint: this.endpoint, sku: this.sku, cmd: commands.save, data: profile }).then(function (res) {
      self.profile = data;
      self.sprofile = profile;
      return Promise.resolve(res);
    });
  };
  OnEsna.prototype.loadProfileSection = function (key) {
    return this.loadProfile().then(function (r) {
      return (r || {})[key] || null;
    });
  };
  OnEsna.prototype.saveProfileSection = function (key, val) {
    if (!this.profile) {
      return;
    }
    this.profile[key] = val;
    return this.saveProfile(this.profile);
  };

  module.exports = OnEsna;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  //var PromiseCancel = require('./promise.cancel');

  function next(queue) {
    var n = queue.current.length;
    for (var i = n; i < queue.max; i++) {
      var qi = queue.items.shift();
      if (!qi) {
        return;
      }
      queue.current.push(qi.resolve(queue));
    }
  }

  function PromiseQueue(opt) {
    this.max     = opt.max || 1;
    this.items   = [];
    this.current = [];
  }
  PromiseQueue.prototype.ready = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.items.push({ resolve: resolve, cancel: reject.bind(null, { error: { canceled: true } }) });
      next(self);
    });
  };
  PromiseQueue.prototype.done = function () {
    if (this.current.length) {
      this.current.pop();
      next(this);
    }
  };
  PromiseQueue.prototype.clear = function () {
    var items = this.items;
    var current = this.current;

    var item;    
    while (item = items.pop()) {
      if (item.cancel) {
        item.cancel();
      }
    }
    while (item = current.pop()) {
      if (item.cancel) {
        item.cancel();
      }
    }
  };

  module.exports = PromiseQueue;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var channel = __webpack_require__(56);

  function Channel() {
    this.onConnect = channel.onConnect;
    this.onDisconnect = channel.onDisconnect;
  }

  module.exports = new Channel();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(4);
  var chrome = __webpack_require__(7);

  var Event = __webpack_require__(2);

  var RPCPort = __webpack_require__(57);
  var RPCRouter = __webpack_require__(58);
  var RPCProxy = __webpack_require__(59);

  /** @constructor */  
  function RPCServer() {
    this.router = new RPCRouter();
    
    this.onRecv = new Event();
    
    this.onConnectInternal = this.onConnect.bind(this, 'internal');
    //this.onConnectExternal = this.onConnect.bind(this, 'external');
  }
  RPCServer.prototype.connect = function () {
    this.router.init();
    
    chrome.runtime['onConnect']['addListener'](this.onConnectInternal);
    //chrome.runtime['onConnectExternal']['addListener'](this.onConnectExternal);

    this.onRecv.dispatch({ msg: { open: true }, sender: { server: true } });
  };
  RPCServer.prototype.disconnect = function () {
    this.router.shut();
    
    chrome.runtime['onConnect']['removeListener'](this.onConnectInternal);
    //chrome.runtime['onConnectExternal']['removeListener'](this.onConnectExternal);

    this.onRecv.dispatch({ msg: { close: true }, sender: { server: true } });
  };
  RPCServer.prototype.onConnect = function (type, port) {
    var rpc = new RPCPort();
    rpc.attach(port);
    this.router.addPort(rpc);
    this.router.addServices(rpc.id, type);

    var sender = port['sender'] || null;
    if (sender) {
      sender = { id: rpc.id, appId: sender['id'] || null, tabId: (sender['tab'] || {})['id'] || null, frameId: sender['frameId'] || null, url: sender['url'] || null, tls: sender['tlsChannelId'] || null };
    } else {
      sender = { id: rpc.id };
    }
    this.onRecv.dispatch({ msg: { open: true }, sender: sender });
    rpc.send({ open: true, sender: sender });
    
    rpc.onRecv.addListener(function (sender, packet) {
      // disconnected
      if (!packet) {
        this.router.delPort(sender.id);
        this.onRecv.dispatch({ msg: { close: true }, sender: sender });
        return;
      }

      // subscribe services
      if (packet.msg.services) {
        if (!packet.msg.remove) {
          this.router.addServices(sender.id, packet.msg.services);
        } else {
          this.router.delServices(sender.id, packet.msg.services);
        }  
        return;
      }

      packet.sender = sender;
      this.onRecv.dispatch(packet);
    }.bind(this, sender));
  };
  RPCServer.prototype.send = function (msg, destination) {
    var ports = this.router.getPorts(destination);
    for (var i = 0; i < ports.length; i++) {
      var port = this.router.ports[ports[i]];
      if (port) {
        port.send(msg);
      }
    }
  };
  RPCServer.prototype.subscribe = function () {
  };

  module.exports = new RPCProxy(new RPCServer());
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(4);
  var Event = __webpack_require__(2);
  var Guid = __webpack_require__(26);
  var chrome = __webpack_require__(7);

  function RPCPort() {
    this.id       = Guid.NewGuid().toString();
    this.services = [];
    
    this.onRecv   = new Event();
  }
  RPCPort.prototype.attach = function (port) {
    this.port = port;
    var self = this;    
    port['onMessage']['addListener'](function (msg) {
      self.onRecv.dispatch({ msg: msg });
    });
    port['onDisconnect']['addListener'](function () {
      self.onRecv.dispatch(null);
    });
  };
  RPCPort.prototype.connect = function (name) {
    this.attach(chrome.runtime.connect({ 'name': name }));
  };
  RPCPort.prototype.disconnect = function () {
    if (this.port) {
      this.port['disconnect']();
      this.port = null;
    }
  };
  RPCPort.prototype.send = function (msg) {
    if (this.port) {
      this.port['postMessage'](msg);
    }
  };

  module.exports = RPCPort;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  function RPCRouter() {
    this.init();
  }
  RPCRouter.prototype.init = function () {
    this.ports = {};
    this.services = {};
  };
  RPCRouter.prototype.shut = function () {
    this.ports = {};
    this.services = {};
  };
  RPCRouter.prototype.addPort = function (port) {
    this.ports[port.id] = port;
  };
  RPCRouter.prototype.delPort = function (portId) {
    var port = this.ports[portId];
    if (port) {
      delete this.ports[portId];
      if (port.services) {
        for (var i = 0; i < port.services.length; i++) {
          var service = this.services[port.services[i]];
          if (service) {
            delete service[portId];
          }
        }
      }
    }
  };
  
  RPCRouter.prototype.addServices = function (portId, services) {
    var port = this.ports[portId];
    if (port) {
      var ps = port.services;
      if (typeof (services) === 'string') {
        services = [services];
      }
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        if (ps.indexOf(service) < 0) {
          ps.push(service);

          var all = this.services[service];
          if (!all) {
            all = this.services[service] = {};
          }
          all[portId] = 1;
        }
      }
    }
  };
  RPCRouter.prototype.delServices = function (portId, services) {
    var port = this.ports[portId];
    if (port) {
      var ps = port.services;
      if (typeof (services) === 'string') {
        services = [services];
      }
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var n = ps.indexOf(service); 
        if (n >= 0) {
          ps.splice(n, 1);

          var all = this.services[service];
          if (all) {
            delete all[portId];
          }
        }
      }
    }
  };
  
  RPCRouter.prototype.getPorts = function (filter) {
    if (!filter) {
      return [];
    }
    if (typeof (filter) === 'string') {
      return [filter];
    }
    var res = {};
    var fs = filter.services;
    if (fs) {
      for (var i = 0; i < fs.length; i++) {
        var sc = this.services[fs[i]];
        if (sc) {
          var clients = Object.getOwnPropertyNames(sc);
          for (var j = 0; j < clients.length; j++) {
            res[clients[j]] = 1;
          }
        }
      }
    }
    var ports = filter.ports;
    if (ports) {
      for (var k = 0; k < ports.length; k++) {
        res[ports[k]] = 1;
      }
    }
    var exclude = filter.exclude;
    if (typeof (exclude) === 'string') {
      delete res[exclude];
    } else if (exclude) {
      for (var l = 0; l < exclude.length; l++) {
        delete res[exclude[l]];
      }
    }
    return Object.getOwnPropertyNames(res);
  };

  module.exports = RPCRouter;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var Event = __webpack_require__(2);
  
  var RPCSchema = __webpack_require__(15);

  function reportError(proxy, e) {
    proxy.onError.dispatch(e);
  }

  function bindMethod(proxy, service, method, opt) {
    // if registering non-proxy method, then return original
    if (service.server || (service.service && service.service.rpc) || !opt) {
      var f = service.service[method];
      if (!f) {
        throw new Error('Method is not defined:' + service.id + ':' + method);
      }
      return f;
    }

    // otherwise proxy method
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var msg = { id: service.id, method: method, args: args };

      // methods could be one way, or return result either via promise or callback      
      var cb = null;
      var promise;
      if (opt.promise) {
        promise = new Promise(function (resolve, reject) {
          cb = { resolve: resolve, reject: reject };
        });
      } else if (!opt.oneway) {
        cb = (typeof (args[args.length - 1]) === 'function') ? args.pop() : null;
        cb = cb ? { resolve: cb, reject: cb } : null;
      }

      // register callback if required
      if (cb) {
        msg.rid = service.rid++;
        service.pending[msg.rid] = cb;
      }
      
      proxy.send(msg);
      return promise;
    };
  }
  
  function bindEvent(proxy, service, event, opt) {
    var evt = !service.service ? new Event() : service.service[event];
    if (!evt) {
      throw new Error('Event not defined:' + service.id + ':' + event);
    }
    opt = opt || { notify: evt.notify };
    
    // if registering server event
    if (service.server || (service.service && service.service.rpc)) {
      // bind to server event
      evt.addListener(function () {
        var args = Array.prototype.slice.call(arguments);
        var msg = { id: service.id, event: event, args: args };

        var dst = { services: [service.id] };
        // if event declared to provide explicit destination
        if (opt.notify) {
          dst = args.shift();
        }
        proxy.send(msg, dst);
      });
    }
    return evt;
  }


  function bindService(proxy, serviceId, service) {
    var id = serviceId;
    if (!id) {
      throw new RangeError('Service id not defined');
    }
    var svc = proxy.services[id] = { id: id, rid: 1, service: service, proxy: {}, pending: {} };
    
    var keys = Object.getOwnPropertyNames(service);
    keys = keys.concat(Object.getOwnPropertyNames(service.constructor.prototype));
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var item = service[key];

      if (typeof (item) === 'function') {
        svc.proxy[key] = bindMethod(proxy, svc, key, item.rpc);
      } else if (item instanceof Event) {
        svc.proxy[key] = bindEvent(proxy, svc, key);
      }
    }
    return svc.proxy;
  }
  function unbindService(proxy, serviceId) {
    var id = serviceId;
    if (!id) {
      throw new RangeError('Service id not defined');
    }
    delete proxy.services[id];
  }  
  

  function bindSchema(proxy, schemaId, schema, service) {
    var id = schemaId;
    if (!id) {
      throw new RangeError('Schema id not defined');
    }
    var svc = proxy.services[id] = { id: id, rid: 1, service: service, proxy: {}, pending: {}, server: !!service };

    var wrap = !svc.server ? schema : {};
    var keys = Object.getOwnPropertyNames(schema);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var item = schema[key];

      if (item === RPCSchema.methodOneWay) {
        wrap[key] = svc.proxy[key] = bindMethod(proxy, svc, key, { oneway: true });
      } else if (item === RPCSchema.methodPromise) {
        wrap[key] = svc.proxy[key] = bindMethod(proxy, svc, key, { promise: true });
      } else if (item === RPCSchema.methodCallback) {
        wrap[key] = svc.proxy[key] = bindMethod(proxy, svc, key, { });
      } else if (item === RPCSchema.eventBroadcast) {
        wrap[key] = svc.proxy[key] = bindEvent(proxy, svc, key, { });
      } else if (item === RPCSchema.eventUnicast) {
        wrap[key] = svc.proxy[key] = bindEvent(proxy, svc, key, { notify: true });
      }
    }
    
    return svc.proxy;
  }
  function unbindSchema(proxy, schemaId, schema) {
    unbindService(proxy, schemaId, schema);
  }

  function getService(proxy, id) {
    var service = proxy.services[id];
    if (!service) {
      reportError(proxy, { warning: 'getService', id: id });
    }
    return service;
  }
  function invokeOpen(proxy, sender, msg) {
    proxy.onConnect.dispatch(sender || msg.sender);
  }
  function invokeClose(proxy, sender, msg) {
    msg = msg;
    proxy.onDisconnect.dispatch(sender);
  }
  function replyMethod(proxy, sender, msg, args, error) {
    if (msg.rid) {
      msg.reply = true;
      msg.args = args;
      msg.error = error;
      proxy.send(msg, sender.id);
    }
  }
  function invokeMethod(proxy, sender, msg) {
    try {
      var service = getService(proxy, msg.id);
      var method = service ? service.service[msg.method] : null;
      if (!method) {
        throw new Error('Invalid method');
      }

      service.service.rpcSender = sender;
      var args = msg.args;
      if (!Array.isArray(args)) {
        args = [args];
      }
      var res = method.apply(service.service, args);
      if (res instanceof Promise) {
        res.then(replyMethod.bind(null, proxy, sender, msg), replyMethod.bind(null, proxy, sender, msg, undefined));
      } else {
        replyMethod(proxy, sender, msg, res);
      }
      service.service.rpcSender = null;
    } catch (e) {
      reportError(proxy, { error: 'invokeMethod', e: e, sender: sender, msg: msg });
      replyMethod(proxy, sender, msg, undefined, e);
    }
  }
  function invokeReply(proxy, sender, msg) {
    try {
      var service = getService(proxy, msg.id);
      if (!service) {
        return reportError(proxy, { warning: 'invokeReply', sender: sender, msg: msg });
      }
      var pending = service.pending[msg.rid];
      if (!pending) {
        return reportError(proxy, { warning: 'invokeReply', sender: sender, msg: msg });
      }
      delete service.pending[msg.rid];
      if (msg.error) {
        pending.reject(msg.error);
      } else {
        pending.resolve(msg.args);
      }
    } catch (e) {
      return reportError(proxy, { error: 'invokeReply', e: e, sender: sender, msg: msg });
    }
  }
  function invokeEvent(proxy, sender, msg) {
    try {
      var service = getService(proxy, msg.id);
      if (!service) {
        return reportError(proxy, { warning: 'invokeEvent', sender: sender, msg: msg });
      }
      var event = service.proxy[msg.event];
      if (!event) {
        return reportError(proxy, { warning: 'invokeEvent', sender: sender, msg: msg });
      }
      event.dispatch.apply(event, msg.args);
    } catch (e) {
      return reportError(proxy, { error: 'invokeEvent', e: e, sender: sender, msg: msg });
    }
  }
  function invoke(proxy, packet) {
    //console.info('[RPC]', 'invoke', packet);
    if (!packet) {
      invokeClose(proxy, { }, { });
    } else if (packet.msg.open) {
      invokeOpen(proxy, packet.sender, packet.msg);
    } else if (packet.msg.close) {
      invokeClose(proxy, packet.sender, packet.msg);
    } else if (packet.msg.reply) {
      invokeReply(proxy, packet.sender, packet.msg);
    } else if (packet.msg.event) {
      invokeEvent(proxy, packet.sender, packet.msg);
    } else if (packet.msg.method) {
      invokeMethod(proxy, packet.sender, packet.msg);
    } else {
      reportError(proxy, { warning: 'invoke', packet: packet });
    }
  }
  function logError(e) {
    if (e.error) {
      console.error('[RPC]', e);
    } else {
      console.warn('[RPC]', e);
    }
  }

  /** @constructor */  
  function RPCProxy(channel) {
    this.channel = channel;
    this.channel.onRecv.addListener(invoke.bind(null, this));
    this.services = {};

    this.onConnect = new Event();
    this.onDisconnect = new Event();
    this.onError = new Event();
    
    this.onError.addListener(logError);
  }

  // register service channel
  RPCProxy.prototype.register = function (serviceId, service) {
    return bindService(this, serviceId, service);
  };
  RPCProxy.prototype.unregister = function (serviceId, service) {
    return unbindService(this, serviceId, service);
  };
  RPCProxy.prototype.registerSchema = function (schemaId, schema, service) {
    return bindSchema(this, schemaId, schema, service);
  };
  RPCProxy.prototype.unregisterSchema = function (schemaId, schema) {
    return unbindSchema(this, schemaId, schema);
  };

  RPCProxy.prototype.connect = function () {
    this.channel.connect();
    this.subscribe();
  };
  RPCProxy.prototype.disconnect = function () {
    this.channel.disconnect();
  };
  RPCProxy.prototype.send = function (msg, destination) {
    this.channel.send(msg, destination);
  };
  
  RPCProxy.prototype.subscribe = function () {
    var services = Object.getOwnPropertyNames(this.services);
    this.channel.subscribe(services);
  };

  module.exports = RPCProxy;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var schema = __webpack_require__(15);

  var IdentitySchema = {
    onAccount: schema.eventBroadcast,
    onAccounts: schema.eventUnicast,

    login: schema.methodPromise,
    logout: schema.methodPromise,

    createAccount: schema.methodPromise,
    removeAccount: schema.methodPromise,
    updateAccount: schema.methodPromise,
  };

  module.exports = IdentitySchema;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var schema = __webpack_require__(15);

  var PartiesSchema = {
    onParties: schema.eventBroadcast,
    onPartiesType: schema.eventBroadcast,

    getParties: schema.methodPromise,
    createParty: schema.methodPromise,
    removeParty: schema.methodPromise,

    getPartiesType: schema.methodPromise,
    setPartiesType: schema.methodPromise,
  };

  module.exports = PartiesSchema;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(0);
  var fetchproxy = __webpack_require__(10);

  var methods = {
    fetchUser: {
      url: '/api/users/me',
      method: 'GET',
      authorize: true,
      headers: {
      }
    },
    fetchTopics: {
      url: '/api/users/me/topics?size=100',
      method: 'GET',
      authorize: true,
      headers: {
      }
    },
    createTopic: {
      url: '/api/topics/invite',
      method: 'POST',
      authorize: true,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    },
    createInvite: {
      url: '/api/topics/{0}/invite',
      method: 'POST',
      authorize: true,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    },
    updateInvite: {
      url: '/api/topics/invites/{0}',
      method: 'POST',
      authorize: true,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    },
    removeInvite: {
      url: '/api/topics/invites/{0}',
      method: 'DELETE',
      authorize: true,
      headers: {
        'content-type': 'application/json'
      }
    },
    getTopic: {
      url: '/api/topics/invites/{0}/join',
      method: 'GET',
      authorize: true,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    },
  };

  function applyHeaders(request) {
    var keys = Object.getOwnPropertyNames(request.method.headers);
    var headers = request.headers = {};
    for (var i = 0; i < keys.length; i++) {
      headers[keys[i]] = request.method.headers[keys[i]];
    }
  }
  function applyBody(request) {
    if (request.method.json) {
      return JSON.stringify(request.args.json);
    }
  }
  function authorize(request) {
    if (!request.method.authorize) {
      return Promise.resolve(request);
    }
    return request.token().then(function (r) {
      if (r.token && r.token.token) {
        r = r.token;
      }
      request.headers['authorization'] = [r.type, r.token].join(' ');
      return request;
    });
  }
  function convertInviteCreate(self, args) {
    var topic;
    var urlargs = [];
    if (!args.id) {
      topic = { 'title': args.title, 'description': args.description, 'type': 'group' };
    } else {
      urlargs.push(args.id);
    }

    var parties = args.parties || [];    
    var invitees = [];
    for (var i = 0; i < parties.length; i++) {
      var item = parties[i];
      if (item.email) {
        if (item.email.toLowerCase() !== self.email.toLowerCase()) {
          invitees.push({ 'invitee': item.email, 'inviteeType': 'email', 'role': item.member ? 'member' : 'guest' });
        }
      }
    }
    if (invitees.length === 0) {
      invitees.push({ 'invitee': self.email, 'inviteeType': 'email', 'role': 'admin' });
    }
    var topicrq = { 'invitees': invitees };
    if (topic) {
      topicrq['topic'] = topic;
    }
    if (args.start) {
      topicrq['startDateTime'] = new Date(args.start).toISOString();
    }
    if (args.end) {
      topicrq['endDateTime'] = new Date(args.end).toISOString();
    }
    topicrq['informChannel'] = args.client ? 'outlook' : 'server';
    topicrq['inviteMode'] = 'meet';

    return { urlargs: urlargs, json: topicrq };
  }
  
  function convertDate(v) {
    if (v) {
      try {
        return new Date(v).valueOf();
      } catch (e) {
      }
    }
    return 0;
  }
  function convertMembers(self, topic, members) {
    for (var i = 0; i < members.length; i++) {
      var m = members[i];
      var p = {};
      p.joined = convertDate(m['joinTime']);

      p.admin = (m['role'] === 'admin');
      p.member = (m['role'] === 'member');

      p.name = m['displayname'] || '';

      p.id = (m['memberType'] === 'userId') ? m['member'] || '' : m['memberType'] + ':' + m['member'];
      p.email = m['username'] || '';

      p.self = (p.id.toLowerCase() === self.id.toLowerCase()) || (p.email.toLowerCase() === self.email.toLowerCase());
      if (p.self && (p.admin || p.member)) {
        topic.selfMember = true;
      }
      topic.members.push(p);
    }
  }
  function convertInvitees(self, invitees) {
    var res = [];
    for (var i = 0; i < invitees.length; i++) {
      var m = invitees[i];
      var p = {};
      p.admin = (m['role'] === 'admin');
      p.email = (m['inviteeType'] === 'email') ? m['invitee'] || '' : m['inviteeType'] + ':' + m['invitee'];
      p.self = (p.email === self.email); 
      res.push(p);
    }
    return res;
  }
  
  function convertTopic(self, topic) {
    var res = { 
      id: topic['targetId'] || topic['_id'], own: self.id === topic['cid'], 
      title: topic['title'] || '', description: topic['description'] || '', 
      pinned: !!topic['isPinned'], selfGuest: topic['role'] === 'guest', type: topic['type'],
      status: topic['status'] || 0, lastAccess: convertDate(topic['lastAccess']), members: [] 
    };

    res.created = convertDate(topic['created']);

    res.selfMember = !res.selfGuest;
    convertMembers(self, res, topic['members'] || []);

    //if (res.selfMember !== !res.selfGuest) {
    //  debugger;
    //}

    return res;
  }
  
  function convert(request, response) {
    var res = null;
    switch (request.method) {
      case methods.fetchUser:
        res = request.response = { };
        res.id = response['_id'];
        res.name = response['displayname'];
        res.email = response['username'];
        break;
      case methods.fetchTopics:
        res = request.response = { next: response['nextPageUrl'], items: [], from: response['from'] - 1, to: response['to'] - 1 };
        var topics = response['data'] || [];
        for (var i = 0; i < topics.length; i++) {
          res.items.push(convertTopic(request.userInfo, topics[i]));
        }
        break;
      case methods.createTopic:
        var topic = (response['data'] || [])[0];
        res = request.response = { id: topic['topicId'], own: true, members: [], title: request.args.json['topic']['title'], description: request.args.json['topic']['description'] };
        if (topic['created']) {
          res.created = convertDate(topic['created']) || 0;
        }
        var content = response['inviteContent'] || {};
        res.invite = { id: topic['_id'], content: { text: content['text'], html: content['html'] } };
        res.members = convertInvitees(request.userInfo, topic['invitees'] || []);
        break;
      case methods.createInvite:
        var invite = (response['data'] || [])[0];
        var inviteContent = response['inviteContent'] || {};
        res = request.response = { id: invite['_id'], topicId: invite['topicId'], content: { text: inviteContent['text'], html: inviteContent['html'] }  };
        break;
      case methods.getTopic:
        res = request.response = { topic: response['topic'] };
        break;
      default:
        //debugger;
        break;
    }
    return res;
  }
  function execUser(request) {
    if (!request.user) {
      return Promise.resolve(request);
    }
    return request.user().then(function (r) {
      request.userInfo = r;
      return request;
    });
  }
  function execRequest(request) {
    applyHeaders(request);
    var url = request.endpoint + (request.url || request.method.url);

    if (request.args && request.args.urlargs) {
      var urlargs = request.args.urlargs;
      url = url.replace(/\{[0-9]+\}/ig, function (key) {
        key = key.substr(1, key.length - 2);
        return urlargs[0 | key];
      });
    }
    
    request.fetch = { url: url, opt: { 'method': request.method.method, 'headers': request.headers, 'body': applyBody(request) } };
    
    return execUser(request).then(function (request) {
      return authorize(request); 
    }).then(function (request) {
      return fetchproxy(request.fetch.url, request.fetch.opt); // fetchproxy causes r.status (see below) 500 if no connection 
    }).then(function (r) {
      return r.ok ? r.json() : Promise.reject(r.status + ': ' + r.statusText); // if no connection, error is '500: ' (no statusText provided)
    }).then(function (r) {
      return convert(request, r);
    });
  }

  function ZangSpaces() {
    this.fetchUser = this.fetchUser.bind(this);    
  }
  ZangSpaces.prototype.init = function (opt) {
    this.opt = opt;
    this.opt.url = this.opt.url || 'https://spacesapis.zang.io';
  };
  ZangSpaces.prototype.shut = function () {
    delete this.opt;
  };

  ZangSpaces.prototype.fetchUser = function () {
    if (this.userInfo) {
      return Promise.resolve(this.userInfo);
    }
    
    var self = this;
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, method: methods.fetchUser }).then(function (r) {
      if (self.opt) {
        self.userInfo = r;
      }
      return r;
    });
  };
  
  ZangSpaces.prototype.fetchTopics = function (args) {
    return execRequest({ endpoint: this.opt.url, url: args ? args.url : null, token: this.opt.token, user: this.fetchUser, method: methods.fetchTopics, args: args });
  };

  ZangSpaces.prototype.createTopic = function (args) {
    args = convertInviteCreate(this.userInfo, args);
    //return Promise.resolve({});
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, user: this.fetchUser, method: methods.createTopic, args: args });
  };
  ZangSpaces.prototype.updateTopic = function (args) {
  };
  ZangSpaces.prototype.removeTopic = function (args) {
  };
  
  ZangSpaces.prototype.createInvite = function (args) {
    args = convertInviteCreate(this.userInfo, args);
    //return Promise.resolve({});
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, user: this.fetchUser, method: methods.createInvite, args: args });
  };
  ZangSpaces.prototype.updateInvite = function (args) {
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, user: this.fetchUser, method: methods.updateInvite, args: args });
  };
  ZangSpaces.prototype.removeInvite = function (args) {
    args = { urlargs: [args.id] };
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, user: this.fetchUser, method: methods.removeInvite, args: args });
  };
  ZangSpaces.prototype.getTopic = function (args) {
    args = { urlargs: [args.id] };
    return execRequest({ endpoint: this.opt.url, token: this.opt.token, user: this.fetchUser, method: methods.getTopic, args: args });
  };

  ZangSpaces.prototype.getJoinUrl = function (id) {
    if (!this.opt) {
      return;
    }
    return this.opt.url + '/spaces/' + id;
  };
  ZangSpaces.prototype.getInviteJoinUrl = function (id) {
    if (!this.opt) {
      return;
    }
    return this.opt.url + '/spaces/invites/' + id + '/meet';
  };
  
  module.exports = ZangSpaces;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Base      = __webpack_require__(8);
  var Event     = __webpack_require__(2);
  var Promise   = __webpack_require__(0);

  /** @constructor */
  function Model() {
    this.onTopic = new Event();
    this.onProgress = new Event();
  }

  Model.prototype.init = function(opt) {
    return Promise.resolve();
  };

  Model.prototype.login = function(opt) {
    return Promise.resolve();
  };

  Model.prototype.logout = function() {
    return Promise.resolve();
  };

  Model.prototype.shut = function() {
    return Promise.resolve();
  };

  Model.prototype.pollTopics = function() {
    return Promise.resolve();
  };

  Model.prototype.checkInvite = function() {
    return Promise.resolve();
  };

  Model.prototype.getTopics = function() {
    return { items: [] };
  };
  
  Model.prototype.cancel = function() {
  };

  Model.prototype.setInfo = function(info) {
  };
  
  Model.prototype.compare = function(a, b) {
    return 0;
  };

  module.exports = Base.extend(Model);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise       = __webpack_require__(0);

  var invite        = __webpack_require__(18);

  var Rooms         = __webpack_require__(29);

  var office        = __webpack_require__(12);
  var SourceModel   = __webpack_require__(63);

  /** @constructor */
  function Model() {
    this.source = 'rooms';
    this.$super();
    this.rooms = Rooms;
  }

  Model.prototype.init = function(opt) {
    this.configuration = opt.configuration || invite.getConfiguration() || { };
    this.languageId = opt.languageId;
    this.lastError = null;
    return this.rooms.configure(JSON.stringify(this.configuration), this.languageId, opt.i18n);
  };
  
  Model.prototype.login = function(opt) {
    opt = opt || { };
    if (this.password) {
      this.rooms.config.password = this.password;
    }
    if (this.rooms.config.mode !== 'equinox') { // same as !settings.unifiedPortalEnabled
      return Promise.resolve(); // do not try login if !settings.unifiedPortalEnabled
    }
    if (!this.rooms.config.user) {
      return Promise.reject({ error: { credentials: true } }); // do not try login if user is not defined in configuration
    }
    var self = this;
    return this.rooms.login().then(function () {
      return Promise.resolve();
    }, function (e) {
      if (e.error && e.error.fetch) {
        if (opt.forceLogin) {
          return Promise.reject(e);
        }
        self.lastError = e.error;
        return Promise.resolve(); // ignore fetch errors on login (use cached rooms in this case, see below)
      }
      if (self.rooms.config.password && typeof(self.password) === 'undefined') {
        return Promise.reject({ error: { credentials: true } }); // do not ask password if bad password is provided in configuration (SV request)
      }
      if (e.error && (e.error.httpStatus === 400 || e.error.httpStatus === 401)) {
        return Promise.reject({ error: { password: !self.rooms.config.password ? 'empty' : 'bad' }, info: { user: self.rooms.config.user } });
      }
      throw e; // TODO: process some others unhandled errors???
    });
  };

  Model.prototype.logout = function() {
    delete this.password;
    return this.rooms.logout();
  };

  Model.prototype.pollTopics = function() {
    // allow use cached rooms if login failed with fetch error (see above)
    var args = (this.lastError && this.lastError.fetch) ? { forceFetch: false, cachedOnly: true } : { forceFetch: true };
    var self = this;
    return this.rooms.getRooms(args).then(function (rooms) {
      if (!rooms || rooms.length === 0) {
        return Promise.reject({ error: { notopics: true } });
      }
      rooms.forEach(function (room) {
        self.onTopic.dispatch({ item: { id: room.id, source: self.source, searchable: true, title: room.name, members: [], icon: 'rooms-item-icon', room: room } });
      });
      return Promise.resolve(rooms);
    });
  };

  Model.prototype.getTopics = function() {
    var res = { items: [] };
    var topics = this.rooms.getTopics().items || [];
    topics.forEach(function (topic) {
      topic.source = this.source;
      topic.searchable = true;
      topic.icon = 'rooms-item-icon';
      res.items.push(topic);
    }, this);
    return res;
  };
  
  Model.prototype.checkInvite = function() {
    var self = this;
    return invite.getMeetingInfo({ location: true, body: true, type: (office.webAPI ? 'html' : '') }).then(function (r) {
      return (self.rooms.checkInvite(JSON.stringify(self.configuration), self.languageId, r[0], r[1]));
    });
  };

  Model.prototype.createInvite = function(invite) {
    var self = this;
    return this.rooms.createInvite(invite).catch(function (e) {
      if (e.error && (e.error.httpStatus === 400 || e.error.httpStatus === 401)) {
        return Promise.reject({ error: { password: !self.rooms.config.password ? 'empty' : 'bad' }, info: { user: self.rooms.config.user } });
      }
      throw e; // pass some others unhandled errors to the app
    });
  };

  Model.prototype.getTopic = function(id) {
    return this.rooms.getTopic(id);
  };
  
  Model.prototype.setInfo = function(info) {
    if (info && info.password) {
      this.password = info.password;
      if (this.rooms.config) {
        this.rooms.config.password = this.password;
      }
    }
  };

  Model.prototype.compare = function(a, b) {
    var ta = this.rooms.getTopic(a.id);
    var tb = this.rooms.getTopic(b.id);
    if (!ta || !ta.room || !tb || !tb.room) {
      return 0;
    }
    var tamy = ta.room.own ? '1' : '0';
    var tbmy = ta.room.own ? '1' : '0';

    var tane = (ta.room.type === 'equinox') ? '0' : '1';
    var tbne = (tb.room.type === 'equinox') ? '0' : '1';

    var tak = tamy + tane;
    var tbk = tbmy + tbne;

    if (tak < tbk) {
      return -1;
    } else if (tak > tbk) {
      return 1;
    }
    return 0;
  };
  
  module.exports = SourceModel.extend(Model);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise       = __webpack_require__(0);
  var Storage       = __webpack_require__(11);
  var Utils         = __webpack_require__(1);

  var invite        = __webpack_require__(18);

  var Identity      = __webpack_require__(21);
  var AppStates     = __webpack_require__(22);
  var Spaces        = __webpack_require__(30);

  var States        = __webpack_require__(20);

  var SourceModel   = __webpack_require__(63);

  /** @constructor */
  function Model() {
    this.source = 'spaces';
    this.$super();
    this.identity = Identity;
    this.spaces = Spaces;
    this.firstLogin = true;
    this.spaces.onTopic.addListener(this.evSpaceItem, this);
  }

  Model.prototype.init = function(opt) {
    this.configuration = opt.configuration || invite.getConfiguration() || { };
    invite.setSpacesOpt(this.spaces, this.configuration);
  };

  Model.prototype.login = function(opt) {
    var logout = opt.logout || !this.firstLogin;
    var noui = opt.noui; // preserve opt.noui
    if (this.firstLogin) {
      noui = false; // SDC 3.4 6. spaces sign-in do not prompt first time
      this.firstLogin = false;
    }
    var optlogin = { noui: noui, asyncui: opt.asyncui, logout: logout };
    var accountsUri = this.configuration['AVAYA_CLOUD_ACCOUNTS_URI'];
    if (accountsUri) {
      optlogin.accountsUrls = { 'esna': accountsUri };
    }
    var self = this;
    return new Promise(function (resolve, reject) {
      var evIdentity = self.evIdentity.bind(self, resolve, reject);
      self.identity.onAccount.addListener(evIdentity);
      var acl0 = Storage.getItem('AVAYA_CLOUD_LOGIN_ID') || '';
      var acl = (self.configuration['AVAYA_CLOUD_LOGIN_ID'] || '').toLowerCase();
      var logout;
      if (acl0 === acl) {
        logout = Promise.resolve();
      } else {
        optlogin.noui = false;
        optlogin.logout = true;
        console.info('Force logout due to user changed in the client');
        Storage.removeItem('zangAgenda'); // force remove cached tokens if user login id changed (ACW-14229)
        Storage.setItem('AVAYA_CLOUD_LOGIN_ID', acl);
        // logout = self.identity.logout(); // identity is not initialized yet, so logout() just returns
        logout = Promise.resolve();
      }
      logout.then(function () {
        self.loggingin = true;
        return self.identity.login(optlogin).then(function(account) {
          self.loggingin = false;
          // nothing to do???
        }, function(err) {
          self.loggingin = false;
          return reject(err);
        });
      }, function (err) {
        // return reject(err);
      });
    });
  };

  Model.prototype.evIdentity = function(resolve, reject, account) {
    var state;
    switch (account.state) {
      case AppStates.Unauthorized:
        state = States.Src.Unauthorized;
        break;
      case AppStates.Authorizing:
        state = States.Src.Authorizing;
        break;
      case AppStates.Unauthorizing:
        state = States.Src.Unauthorizing;
        break;
      case AppStates.Authorized:
        state = States.Src.Authorized;
        break;
    }
    if (state === States.Src.Unauthorized) {
      this.loggingin = false;
      // reject({ error: { login: true } });
      return;
    }
    if (state === States.Src.Authorized) {
      resolve();
      return;
    }
  };

  Model.prototype.logout = function() {
    this.firstLogin = true;
    return this.identity.logout();
  };

  Model.prototype.pollTopics = function() {
    // return this.spaces.pollTopics();
    var self = this;
    this.spaces.pollTopics().then(function () {
      self.onProgress.dispatch(self.source, { fetched: true });
    }, function (err) {
      self.onProgress.dispatch(self.source, { err: err });
    });
    return Promise.resolve();
  };

  Model.prototype.evSpaceItem = function (space) {
    space.item.source = this.source;
    this.onTopic.dispatch(space);
  };

  Model.prototype.getTopics = function() {
    var res = { items: [] };
    var topics = this.spaces.getTopics().items || [];
    topics.forEach(function (topic) {
      topic.source = this.source;
      res.items.push(topic);
    }, this);
    return res;
  };
  
  Model.prototype.checkInvite = function(precheck) {
    var self = this;
    return invite.getMeetingInfo({ body: true }).then(function (r) {
      return self.spaces.checkInvite(r[0], precheck);
    });
  };

  Model.prototype.createInvite = function(invite) {
    return this.spaces.createInvite(invite);
  };

  Model.prototype.createTopic = function(topic) {
    var self = this;
    return this.spaces.createTopic(topic).then(function (r) {
      r.source = self.source;
      return Promise.resolve(r);
    });
  };

  Model.prototype.cancel = function() {
    if (this.loggingin) {
      this.logout();
    }
  };

  Model.prototype.getTopic = function(id) {
    return this.spaces.getTopic(id);
  };
  
  module.exports = SourceModel.extend(Model);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var dom           = __webpack_require__(5);
  var Action        = __webpack_require__(17);
  var ListView      = __webpack_require__(75);

  var cssItem = 'li spaces-item';
  var cssItemError = 'error-item';
  var cssItemAction = 'li-main spaces-item-action';
  var cssItemIcon = 'li-icon spaces-item-icon';
  var cssItemText = 'li-text';
  var cssItemTitle = 'li-title spaces-item-title';
  var cssItemDesc = 'li-desc spaces-item-desc';
  var cssGroupFirstItem = 'spaces-group'
  
  var _colors = ['#FFEC00', '#EC00FF', '#FFC627', '#27FFC6', '#FFA714', '#A7FF14', '#FB824F', '#4F82FB', '#F16930', '#F13069', '#81CFD5', '#CF81D5', '#CCCCCC', '#888888', '#008800', '#008888'];
  
  function convertToColor(item) {
    if (item.id === SpacesList.NEW) {
      return '#000000';
    }

    var info = [item.id, item.title || '?'].join('');

    var crc = 0;
    for (var i = 0; i < info.length; i++) {
      crc = crc ^ info.charCodeAt(i);
    }
    return _colors[crc & 0xf];
  }


  function SpacesList(opt) {
    this._setStyles(opt || {});
    this.$super({});
    this.searchValue = '';
  }

  SpacesList.NEW = 'NEW';

  SpacesList.prototype.updateItem = function (li, item) {
    var c = li.content;

    if (!c) {
      li.addClass(this._styles.item);
      if (item.error) {
        li.addClass(this._styles.itemError);
      }
      li.data = item;
      c = li.content = {};

      li.add(new Action().addClass(this._styles.itemAction).add(
        c.icon = dom.div().addClass(this._styles.itemIcon),
        dom.div().addClass(this._styles.itemText).add(
          c.title = dom.div().addClass(this._styles.itemTitle),
          c.desc = dom.div().addClass(this._styles.itemDesc)
        )
      ));
      if (item.icon) {
        c.icon.add(dom.div().addClass(item.icon));
      }
    }

    c.title.node.textContent = item.title;
    c.desc.node.textContent = item.desc;

    var _abbr = item.title.split(' ');
    var abbr = (_abbr[0] || '?').substr(0, 1) + (_abbr[1] || '').substr(0, 1);

    if (item.id === SpacesList.NEW) {
      abbr = '+';
    }

    if (!item.icon) {
      c.icon.node.setAttribute('first', abbr.toUpperCase());
      c.icon.node.style.backgroundColor = convertToColor(item);
    }

    li.data = item;

    li.toggleClass('hidden', !item.show);
 
    var search = this.searchValue.toLowerCase().trim();
    var title = (li.data.title || '').toLowerCase();

    li.node.style.display = !!search && title.indexOf(search) < 0 ? 'none' : '';
    //this.group();
    this.sort();
 };

  SpacesList.prototype.compare = function (a, b) {
    if (a.data.id === SpacesList.NEW) {
      return -1;
    }
    if (b.data.id === SpacesList.NEW) {
      return 1;
    }

    function compare_lexically(at, bt) {
      if (at < bt) {
        return -1;
      }
      if (at > bt) {
        return 1;
      }
      return 0;
    }

    function compare_lastAccess(a, b) {
      var ad = a.data.lastAccess || 0;
      var bd = b.data.lastAccess || 0;
      if (ad < bd) {
        return 1;
      }
      if (ad > bd) {
        return -1;
      }
      return 0;
    }

    function compare_index(at, bt, s) {
      var ai = at.indexOf(s);
      var bi = bt.indexOf(s);

      if (ai < 0 && bi < 0) {
        return 0;
      }

      if (bi < 0) {
        return -1;
      }

      if (ai < 0) {
        return 1;
      }

      return (ai - bi);
    }

    var at = (a.data.title || '').toLowerCase();
    var bt = (b.data.title || '').toLowerCase();
    var search = this.searchValue.toLowerCase().trim();

    var res = search ? compare_index(at, bt, search) : 0;
    if (res === 0) {
      //res = compare_lastAccess(a,b);
      //if( res === 0) {
      res = compare_lexically(at, bt);
      //}
    }
    return res;
  };

  SpacesList.prototype.group = function () {
    var search = this.searchValue.toLowerCase().trim();
    var first = false;

    var len = this.node.children.length;
    for (var i = 0; i < len; i++) {
      var c = this.node.children[i];
      var id = c.getAttribute(this.$itemId);
      var li = this.getItem(id);

      var hidden = !!search && !li.data.searchable;
      li.toggleClass('hidden', hidden);
      var title = (li.data.title || '').toLowerCase();
      if (!hidden && !first && title.indexOf(search) < 0) {
        li.addClass(this._styles.groupFirstItem);
        first = true;
      } else {
        li.delClass(this._styles.groupFirstItem);
      }
    }
  }

  SpacesList.prototype._setStyles = function(opt) {
    this._styles = {
      item: opt.cssItem || cssItem,
      itemError: opt.cssItemError || cssItemError,
      itemAction: opt.cssItemAction || cssItemAction,
      itemIcon: opt.cssItemIcon || cssItemIcon,
      itemText: opt.cssItemText || cssItemText,
      itemTitle: opt.cssItemTitle || cssItemTitle,
      itemDesc: opt.cssItemDesc || cssItemDesc,
      groupFirstItem: opt.cssGroupFirstItem || cssGroupFirstItem
    };
  }

  SpacesList.prototype.test = function () {
    var s = 'abcdefghjiklmnopqrstuvwxyz';
    for (var i = 0; i < 15; i++) {
      this.insert({ id: 'i' + i, title: s[i] + ' test#' + i, desc: 'desc#' + i, /*icon: 'zang',*/ show: true });
    }
  };

  module.exports = ListView.extend(SpacesList);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  __webpack_require__(68);
  var loader = __webpack_require__(13);
  var Promise = __webpack_require__(0);
  var Storage = __webpack_require__(11);
  var controller = __webpack_require__(69);
  var model = __webpack_require__(85);

  var ui = new controller(model);

  var called = false;
  
  function ready(opt) {
    // supress context menu in browser with exception of input fields and elements assigned a certain class
    document.addEventListener('contextmenu', function (ev) {
      var el = ev.target || {};
      if (((el.tagName || '').toUpperCase() === 'INPUT') || (el.className.indexOf('contextMenu') >= 0)) {
        return true;
      }
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    });

    opt = opt || { noui : true };
    model.init(opt);
  }

  window.appRestart = ready;
  
  //Office.initialize = ready;
  loader.wait(function () {
    if (called) {
      return;
    }
    called = true;

    if (Promise._setScheduler) {
      console.info('Set Promise custom scheduler'); // this info doesn't appear in the log, (why???)
      var customSchedulerFn = function (flush) {
        // console.info('Promise custom scheduler called'); // but this appears
        return setTimeout(flush, 1);
      };
      Promise._setScheduler(customSchedulerFn);
    }

    ready();
  });

  var cache = window.applicationCache;
  var loaded = 0;
  cache.addEventListener('checking', function () {
    console.info('app:appcache:checking');
  });
  cache.addEventListener('noupdate', function () {
    console.info('app:appcache:noupdate');
  });
  cache.addEventListener('downloading', function () {
    console.info('app:appcache:downloading');
  });
  cache.addEventListener('progress', function () {
    // console.info('app:appcache:progress');
    loaded += 1;
  });
  cache.addEventListener('cached', function () {
    console.info('app:appcache:cached:' + loaded);
  });
  cache.addEventListener('updateready', function () {
    console.info('app:appcache:updateready');
    cache.swapCache();
    Storage.enabled = false; // disable storage in order to prevent unexpected modifications on reload
    location.reload();
  });
  cache.addEventListener('obsolete', function () {
    console.info('app:appcache:obsolete');
  });
  cache.addEventListener('error', function (err) {
    err = err || { };
    console.error('app:appcache:error:' + JSON.stringify({ reason: err.reason, url: err.url, status: err.status, message: err.message }));
  });

  module.exports = { };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 68 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Log = __webpack_require__(3);

  var dom = __webpack_require__(5);
  var panel = __webpack_require__(9);
  
  var cfgwizard = __webpack_require__(70);
  var progress = __webpack_require__(73);
  var meeting  = __webpack_require__(74);
  // var topics   = require('./topics');
  var invited  = __webpack_require__(81);
  var popup    = __webpack_require__(82);
  var error    = __webpack_require__(83);
  var links    = __webpack_require__(84);

  var States   = __webpack_require__(20);

  var i18n     = __webpack_require__(6);

  var logger = Log.createLogger('CNTRLR');

  /** @constructor */
  var controller = function controller(model) {
    this.model = model;
    this.model.onState.addListener(this.evState, this);
  };

  controller.prototype.init = function (retry) {
    if (retry) {
      this.panels.$view.del(true);
    }
    this.panels = {
      $view: new panel(),
      $current: null,
      
      cfgwizard: new cfgwizard({ model: this.model }),
      progress: new progress({ model: this.model }),
      meeting: new meeting({ model: this.model }),
      // topics: new topics({ model: this.model }),
      invited: new invited({ model: this.model }),
      links: new links({ model: this.model }),
      popup: new popup(),
      error: new error(),
    };
    
    this.panels.cfgwizard.addClass('hidden');
    this.panels.progress.addClass('hidden');
    this.panels.meeting.addClass('hidden');
    // this.panels.topics.addClass('hidden');
    this.panels.invited.addClass('hidden');
    this.panels.popup.addClass('hidden');
    this.panels.error.addClass('hidden');
    
    this.panels.$view.add(this.panels.cfgwizard);
    this.panels.$view.add(this.panels.progress);
    this.panels.$view.add(this.panels.meeting);
    // this.panels.$view.add(this.panels.topics);
    this.panels.$view.add(this.panels.invited);
    this.panels.$view.add(this.panels.popup);
    this.panels.$view.add(this.panels.links);

    this.panels.links.render(); // render links on init as not switchable panel

    dom.body.add(this.panels.$view);

    if (!retry) {
      this.model.onError.addListener(this.evError, this);
      // this.evState(this.model.ctxstate);
      this.panels.popup.onHide.addListener(this.refresh, this);
    }
  };  
  
  controller.prototype.evState = function(ctxstate) {
    if (this._init && ctxstate.app === States.App.Unknown) {
      this._init = false;
      this._retry = true;
    }
    if (!this._init) {
      this._init = true;
      // dom.get('splash').del();
      this.init(this._retry);
      this.switch(this.panels, this.panels.progress);
    }
    this.panels.progress.update(ctxstate);
    if (ctxstate.app === States.App.Initializing) {
      this.panels.links.addClass('hidden');
      this.panels.links.update(ctxstate);
    }
    if (!this.model.joinMode && ctxstate.app === States.App.Configured) {
      this.panels.links.delClass('hidden');
      this.panels.links.update(ctxstate);
    }
    if (ctxstate.app === States.App.NotConfigured) {
      this.panels.links.update(ctxstate);
      this.switch(this.panels, this.panels.cfgwizard);
    }
    if (ctxstate.app === States.App.NotInitialized ||
        ctxstate.app === States.App.SrcInitializing) {
      this.switch(this.panels, this.panels.progress);
    }
    if (ctxstate.app !== States.App.Initialized) {
      return;
    }
    var checked = true; // app state is Initialized, so check is already done (except sources under reinitializing)
    // Object.getOwnPropertyNames(this.model.sources).forEach(function (name) {
    //   if (ctxstate.sources[name] !== States.Src.Checked) {
    //     checked = false;
    //   }
    // });
    if (checked) {
      // var invited = ctxstate.invites.length > 0;
      var invited = !!this.model._invite;
      logger.info('State event: app: ' + States.App.names[ctxstate.app] + ', invited: ' + invited);
      this.switch(this.panels, invited ? this.panels.invited : this.panels.meeting);
      if (!invited) {
        // var sources = Object.getOwnPropertyNames(this.model.getValidSources()); // switch to view using successfully initialized sources
        var sources = this.model.cfgSources; // switch to view using sources from configuration
        var meeting = sources.length === 1 && sources[0] === 'rooms';
        var title = meeting ? i18n.i18n.titleMeetingDetails : i18n.i18n.titleMeetingPlaces;
        var selector = meeting ? this.panels.meeting.details : this.panels.meeting.places;

        this.panels.meeting.toggleClass('panel-meeting-view-equinox', meeting);
        
        this.panels.meeting.update(title, selector);
      } else {
        var invite = this.model._invite;
        var source = invite.source;
        var title = invite.info.topicTitle || i18n.i18n.titleUnknownInvitation;
        var url;
        var details = { };
        switch (source) {
          case 'rooms':
            url = invite.info.joinUrl;
            details[i18n.i18n.titleConferenceAccessNumber] = invite.info.conferenceAccessNumber;
            details[i18n.i18n.titleMeetingId] = invite.info.meetingId;
            details[i18n.i18n.titleConferenceAccessUrl] = invite.info.conferenceAccessUrl;
            break;
          case 'spaces':
            url = invite.info.spaceUrl;
            details[i18n.i18n.titleSpaceUrl] = invite.info.spaceUrl;
            break;
          default:
            break;
        }
        logger.info('Invited: ' + source + ': ' + url + ', host: ' + invite.isHost);
        this.panels.invited.update(source, title, url, invite.isHost, details);
      }
    }
  };

  controller.prototype.switch = function (panels, p) {
    var c = panels.$current;
    if (c === p) {
      return;
    }
    if (c) {
      c.addClass('hidden');
    }
    p.delClass('hidden');
    panels.$current = p;
    p.render();
  };

  controller.prototype.refresh = function () {
    this.panels.$current.render();
  };

  controller.prototype.evError = function(err) {
    var panel = this.panels.error;
    panel.render(err);
    this.panels.popup.render(panel);
    this.panels.popup.delClass('hidden');
  };

  module.exports = controller;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom      = __webpack_require__(5);
  var panel    = __webpack_require__(9);
  var action   = __webpack_require__(17);
  var Log      = __webpack_require__(3);
  var Utils    = __webpack_require__(1);

  var AemoAPI = __webpack_require__(71);
  var ZangAPI = __webpack_require__(72);

  var Rooms    = __webpack_require__(64);
  var Spaces   = __webpack_require__(65);

  var roomsConfig  = __webpack_require__(27);
  var spacesConfig = __webpack_require__(28);

  var invite   = __webpack_require__(18);

  var i18n     = __webpack_require__(6);

  var AVAYA_CLOUD_ACCOUNTS_URI = 'https://accounts.zang.io';
  var EQUINOX_MEETING_ACCOUNT_DISCOVERY_URL = 'https://meetings.avaya.com';

  var logger = Log.createLogger('CFG');

  var CfgWizard = function (opt) {
    this.$super();
    this.delClass('panel').addClass('panel-cfgwizard-view');
    this.model = opt.model;
    this.sources = { 'spaces':  null, 'rooms': null }; // configured sources here
    this.source = 0;
    this.step = 10;
  };

  CfgWizard.prototype.render = function () {
    if (!this.node.innerHTML) {
      var layout = dom.div({ cssClass: 'panel-cfgwizard-content' });
      layout.add(dom.div().addClass('cfgwizard-logo-panel').add(
        this.addinAds = dom.div().addClass('cfgwizard-logo-ads').add(
          i18n.i18n.titleAddinAds
        ),
        this.image = dom.div().addClass('cfgwizard-image')
      ));
      //layout.add(
      //  this.addinAds = dom.div({ cssClass: 'panel-info-title cfgwizard-ads', text: i18n.i18n.titleAddinAds })
      //);
      layout.add(dom.div().addClass('panel cfgwizard-title-panel').add(
        this.icon = dom.div().addClass('info-icon cfgwizard-info-icon'),
        this.title = dom.div().addClass('panel-info-title cfgwizard-title')
      ));
      layout.add(dom.div().addClass('panel-details').add(
        dom.div().addClass('panel-detail').add(
          this.emailWrap = dom.div().addClass('input-config-wrap').add(
            this.email = dom.input({ hint: i18n.i18n.hintEmailAddress, cssClass: 'input-config cfgwizard-input' }),
            this.emailClear = new action().addClass('icon-base icon-clear').set({ tip: i18n.i18n.actionClear, click: this._evEmailClear.bind(this) })
          )
        ),
        dom.div().addClass('panel-detail').add(
          this.portal = dom.select({ cssClass: 'select-config cfgwizard-select hidden' })
        ),
        this.userPanel = dom.div().addClass('panel-detail hidden').add(
          this.userWrap = dom.div().addClass('input-config-wrap').add(
            this.user = dom.input({ hint: i18n.i18n.hintUsername, cssClass: 'input-config cfgwizard-input' }),
            this.userClear = new action().addClass('icon-base icon-clear').set({ tip: i18n.i18n.actionClear, click: this._evUserClear.bind(this) })
          ),
          this.passwordWrap = dom.div().addClass('input-config-wrap').add(
            this.password = dom.input({ hint: i18n.i18n.hintPassword, '@type': 'password', cssClass: 'input-config cfgwizard-input' }),
            this.passwordClear = new action().addClass('icon-base icon-clear').set({ tip: i18n.i18n.actionClear, click: this._evPasswordClear.bind(this) })
          ),
          this.loginBox = dom.div().add(
            dom.div().add(i18n.i18n.titleOpensInBrowser),
            new action({ text: i18n.i18n.linkClickToLogin, click: this.onOk.bind(this) })
          ).addClass('cfgwizard-login')
        )
      ));
      layout.add(dom.div().addClass('actions-list').add(
        this.ok = new action({ cssClass: 'action-item cfgwizard-action', click: this.onOk.bind(this) }),
        this.cancel = new action({ cssClass: 'action-item action-item-accent', text: i18n.i18n.actionCancel, click: this.onCancel.bind(this) }),
        this.skip = new action({ cssClass: 'action-item action-item-skip', text: i18n.i18n.actionSkip, click: this.onSkip.bind(this) })
      ));
      //layout.add(
      //  this.accountAds = dom.div().add(
      //    dom.div({ cssClass: 'panel-info-title cfgwizard-ads', text: i18n.i18n.titleAccountAds }),
      //    dom.a({ cssClass: 'action link-item', text: i18n.i18n.titleAccountAdsLink, href: 'https://zang.io', target: '_blank' })
      //));
      this.layout = layout;
      this.adjustUI();
      this.add(layout);
      logger.info('Start configuration wizard, email address: ' + this.model.configuration.emailAddress);

      this.timer = setTimeout(this._evTimer.bind(this), 100);
    }

    return this;
  };

  CfgWizard.prototype.showError = function (err) {
    if (!err.message) {
      err = { message: Utils.stringifyJSON(err) };
    }
    var self = this;
    return new Promise(function (resolve, reject) {
      err.resolve = resolve;
      self.model.showError(null, err); // next step after showError OK
    });
  };

  CfgWizard.prototype.adjustUI = function (opt) {
    opt = opt || { };
    logger.info('Adjust UI, step: ' + this.step + ', opt: ' + JSON.stringify(opt));
    if (this.step === -1) {
      var resolve = this.model.configuration.resolve;
      resolve(this.configuration);
      return;
    }
    var sources = Object.getOwnPropertyNames(this.sources);
    var source = sources[this.source];
    this.layout.delClass('hidden');
    this.icon.toggleClass('hidden', !(opt.error || opt.progress));
    this.icon.toggleClass('cfgwizard-error-icon', opt.error);
    this.icon.toggleClass('cfgwizard-progress-icon', opt.progress);
    this.title.toggleClass('error', opt.error);

    this.userPanel.addClass('hidden');
    this.userWrap.delClass('hidden');

    this.passwordWrap.delClass('hidden');

    this.loginBox.addClass('hidden');

    if (this.step === 10) {
      this.image.delClass('cfgwizard-setting-image').addClass('cfgwizard-logo-image');
      this.title.delClass('cfgwizard-title-setting');
      var title = opt.error ? i18n.i18n.errorConfigureAccount : i18n.i18n.titleSetupMeetingDetails;
      this.title.node.innerHTML = title;
      
      this.email.node.value = this.email.node.value || this.model.configuration.emailAddress;
      this.email.delClass('disabled');
      this.email.node.removeAttribute('disabled', 1);

      this.emailWrap.delClass('hidden');

      this.portal.addClass('hidden');
      this.userPanel.addClass('hidden');

      this.ok.setText(i18n.i18n.actionNext);
      this.ok.delClass('disabled hidden');
      this.skip.addClass('hidden');
      this.cancel.addClass('hidden');
    } else if (this.step === 52) {
      this.image.delClass('cfgwizard-logo-image').addClass('cfgwizard-setting-image');
      this.title.addClass('cfgwizard-title-setting');
      this.title.node.innerText = i18n.i18n.titleSettingAddin;
      this.portal.addClass('hidden');
      this.ok.addClass('hidden');
      this.addinAds.delClass('hidden');
      //this.accountAds.delClass('hidden');
    } else {
      this.addinAds.addClass('hidden');
      //this.accountAds.addClass('hidden');
      if (source === 'rooms') {
        if (this.step === 11) {
          this.email.addClass('disabled');
          this.email.node.setAttribute('disabled', 1);

          this.ok.addClass('hidden');
          this.skip.addClass('hidden');
          this.cancel.delClass('hidden');
          this.title.node.innerText = i18n.i18n.titleCheckingEquinoxAccount;
        } else if (this.step === 30) {
          this.title.node.innerText = i18n.i18n.titleChooseEquinoxEnvironment;
          this.emailWrap.addClass('hidden');
          for (var i = this.portal.node.options.length - 1 ; i >= 0 ; i--) {
            this.portal.node.remove(i);
          }
          var portalNames = Object.getOwnPropertyNames(opt.portalUrls);
          portalNames.forEach(function(portalName) {
            this.portal.add(dom.option().add(portalName).set({ '@value':  opt.portalUrls[portalName] }));
          }, this);
          this.portal.delClass('hidden');
          this.ok.setText(i18n.i18n.actionNext);
          this.ok.delClass('disabled hidden');
          this.skip.delClass('hidden');
          this.cancel.addClass('hidden');
        } else if (this.step === 40) {
          var title;
          if (opt.error) {
            title = opt.password ? i18n.i18n.errorBadCredentials : i18n.i18n.errorConfigureAccount;
          } else if (opt.progress) {
            title = opt.aemo ? i18n.i18n.titleLoggingToAEMO : i18n.i18n.titleLoggingToEquinox;
          } else {
            title = opt.aemo ? i18n.i18n.titleEnterAEMOCredentials : i18n.i18n.titleEnterEquinoxCredentials;
          }
          this.title.node.innerHTML = title;
          this.emailWrap.addClass('hidden');
          this.portal.addClass('hidden');
          this.userPanel.delClass('hidden');
          this.user.node.value = opt.user || this.user.node.value;
          this.ok.setText(i18n.i18n.actionNext);
          this.ok.delClass('hidden');
          this.ok.toggleClass('disabled', opt.disabled);
          this.skip.toggleClass('hidden', opt.disabled);
          this.cancel.addClass('hidden');
        }
      } else if (source === 'spaces') {
        if (this.step === 11) {
          this.email.addClass('disabled');
          this.email.node.setAttribute('disabled', 1);

          this.ok.addClass('hidden');
          this.skip.addClass('hidden');
          this.cancel.delClass('hidden');
          this.title.node.innerText = i18n.i18n.titleCheckingCloudAccount;
        } else if (this.step === 20) {
          this.title.node.innerHTML = i18n.i18n.titleEnterCloudCredentials;

          this.userPanel.delClass('hidden');
          this.userWrap.addClass('hidden');

          this.passwordWrap.addClass('hidden');

          this.loginBox.delClass('hidden');
          
          this.emailWrap.addClass('hidden');
          this.ok.addClass('hidden');
          this.skip.delClass('hidden');
          this.cancel.addClass('hidden');
        } else if (this.step === 21) {
          this.title.node.innerHTML = i18n.i18n.titleLoggingToCloud;
          this.emailWrap.addClass('hidden');
          this.skip.addClass('hidden');
          //!!
          this.cancel.addClass('hidden');
        }
      }
    }
  };

  CfgWizard.prototype._evTimer = function () {
    var changed;
    if (this.emailText !== this.email.node.value) {
      changed = true;
      this.emailText = this.email.node.value;
      this.emailWrap.toggleClass('input-empty', !this.emailText);
    }
    if (this.userText !== this.user.node.value) {
      changed = true;
      this.userText = this.user.node.value;
      this.userWrap.toggleClass('input-empty', !this.userText);
    }
    if (this.passwordText !== this.password.node.value) {
      changed = true;
      this.passwordText = this.password.node.value;
      this.passwordWrap.toggleClass('input-empty', !this.passwordText);
    }

    if (changed) {
      var okDisabled = (((this.step === 10) && !this.emailText) ||
                        ((this.step === 40) && !this.userText));
      this.ok.toggleClass('disabled', okDisabled);
      if (okDisabled) {
        this.ok.node.setAttribute('disabled', 1);
      } else {
        this.ok.node.removeAttribute('disabled');
      }
    }


    this.timer = setTimeout(this._evTimer.bind(this), 100);
  };

  CfgWizard.prototype._evEmailClear = function () {
    this.email.node.value = '';
  };
  CfgWizard.prototype._evUserClear = function () {
    this.user.node.value = '';
  };
  CfgWizard.prototype._evPasswordClear = function () {
    this.password.node.value = '';
  };
  
  CfgWizard.prototype.configureSpaces = function (opt) {
    opt = opt || { };
    logger.info('Configuring spaces, opt: ' + JSON.stringify(opt));
    this.step = 11;
    this.adjustUI({ progress: true });
    var spaces;
    var configuration;
    var self = this;
    var cancel = new Promise(function(resolve, reject) {
      self.canceled = { resolve: resolve, reject: reject };
    });
    var check = this.zangAPI.checkUserExist({ userId: this.emailAddress });
    check = Promise.race([check, cancel]);
    logger.info('Checking spaces user');
    return check.then(function (res) {
      logger.info('Spaces user exists, res: ' + JSON.stringify(res));
      // zang account exists
      self.step = 20;
      self.adjustUI();
      return new Promise(function(resolve, reject) {
        self.login = { resolve: resolve, reject: reject };
      });
    }, function (err) { // canceled & not found (initially) goes here
      logger.info('Spaces user check failed, err: ' +  Utils.stringifyJSON(err));
      if (err && err.error && err.error.httpStatus === 404) { // zang account doesn't exist
        logger.info('Spaces user does not exist, skip spaces');
        return Promise.reject({ skipped: true }); // continue with next source
      }
      return Promise.reject(err);
    }).then(function () {
      spaces = new Spaces(); // create spaces model
      spaces.init({ configuration: opt });
      var optlogin = { configuration: opt, logout: true, asyncui: self.model.asyncui };
      logger.info('Spaces login, opt: ' + JSON.stringify(optlogin));
      return spaces.login(optlogin).then(function () {
        logger.info('Spaces login succeeded');
        return Promise.resolve()
      }, function (err) {
        logger.info('Spaces login failed, skip spaces, err: ' +  Utils.stringifyJSON(err));
        return Promise.reject({ skipped: true });
      })
    }).then(function () {
        configuration = { 'ENABLE_AVAYA_CLOUD_ACCOUNTS': 1 };
        logger.info('Setting up spaces configuration: ' + JSON.stringify(configuration));
        for (var key in configuration) {
          self.configuration[key] = configuration[key];
        }
        self.sources['spaces'] = spaces; // store configured spaces model
        return Promise.resolve();
      }, function (err) { // skip & canceled & not found (finally) goes here
      if (err && !err.skipped) {
        logger.info('Spaces configuring failed, err: ' +  Utils.stringifyJSON(err));
        return Promise.reject(err);
      }
      configuration = { 'ENABLE_AVAYA_CLOUD_ACCOUNTS': 0 };
      logger.info('Setting up no spaces configuration: ' + JSON.stringify(configuration));
      for (var key in configuration) {
        self.configuration[key] = configuration[key];
      }
      return Promise.resolve(); // skipped
    });
  }

  CfgWizard.prototype.loginRooms = function (aemo, portalUrl) {
    var rooms = new Rooms();
    var configuration;
    var self = this;
    return new Promise(function(resolve, reject) {
      self.login = { resolve: resolve, reject: reject };
    }).then(function () {
      return rooms.logout();
    }).then(function () {
      self.step = 40;
      self.adjustUI({ aemo: aemo, progress: true, disabled: true });
      configuration = {
        'CONFERENCE_PORTAL_URI': portalUrl,
        'UNIFIED_PORTAL_USERNAME': self.user.node.value,
        'UNIFIEDPORTALENABLED': 1,
        manual: true
      }
      return rooms.init({ configuration: configuration });
    }).then(function () {
      logger.info('Rooms login, user: ' + self.user.node.value);
      rooms.setInfo({ password: self.password.node.value });
      return rooms.login({ forceLogin: true }).then(function () {
        logger.info('Rooms login succeeded');
        delete configuration['Password'];
        delete configuration['manual'];
        logger.info('Setting up rooms configuration: ' + JSON.stringify(configuration));
        for (var key in configuration) {
          self.configuration[key] = configuration[key];
        }
        self.sources['rooms'] = rooms; // store configured rooms model
        return Promise.resolve();
      }, function (err) {
        logger.info('Rooms login failed, retry login, err: ' + Utils.stringifyJSON(err));
        self.step = 40;
        self.adjustUI({ error: true, password: (err.error || { }).password });
        return self.loginRooms(aemo, portalUrl);
      });
    }, function (err) {
      logger.info('Rooms login failed, err: ' + Utils.stringifyJSON(err));
      return Promise.reject(err);
    });
  }

  CfgWizard.prototype.configureRooms = function () {
    logger.info('Configuring rooms');
    this.step = 11;
    this.adjustUI({ progress: true });
    var portalUrl;
    var self = this;
    var cancel = new Promise(function (resolve, reject) {
      self.canceled = { resolve: resolve, reject: reject };
    });
    var check = this.aemoAPI.checkUserExist({ userId: this.emailAddress });
    check = Promise.race([check, cancel]);
    logger.info('Checking rooms user');
    return check.then(function (res) {
      logger.info('Rooms user exists, res: ' + JSON.stringify(res));
      // aemo account exists
      return Promise.resolve({ 'aemo': true, url: res && res.conferencePortalUri ? res.conferencePortalUri : '' });
    }, function (err) { // canceled & not found (initially) goes here
      logger.info('Rooms user check failed, err: ' +  Utils.stringifyJSON(err));
      if (err && err.error && err.error.httpStatus === 404) { // aemo account doesn't exist
        logger.info('Rooms user does not exist, continue to portal info');
        return Promise.resolve();  // continue to portal info
      }
      return Promise.reject(err);
    }).then(function (res) {
      if (res) {
        return Promise.resolve(res);
      }
      var optinfo = { emailDomain: self.emailAddress.split('@')[1] };
      var info = self.zangAPI.getPortalInfo(optinfo);
      info = Promise.race([info, cancel]);
      logger.info('Checking portal info, opt: ' + JSON.stringify(optinfo));
      return info.then(function (res) {
        logger.info('Portal info found, res: ' + JSON.stringify(res));
        var portalInfo = ((Utils.safeParse(res.portalInfo) || { })['Meeting_Portal_Settings']) || [];
        var portalSettings = { };
        portalInfo.forEach(function (portalSetting) {
          portalSettings[portalSetting['Meeting_Portal_Name']] = portalSetting['Meeting_Portal_Url'];
        });
        return Promise.resolve(portalSettings);
      }, function (err) { // canceled & no info (initially) goes here
        logger.info('Checking portal info failed, err: ' + Utils.stringifyJSON(err));
        return Promise.reject({ skipped: true }); // skip rooms??? // Promise.reject(err); // restart configuration???
      });
    }).then(function (res) {
      if (res && !res.aemo) {
        logger.info('Selecting portal, portal settings: ' + JSON.stringify(res));
        var portalNames = Object.getOwnPropertyNames(res);
        if (portalNames.length === 0) {
          return Promise.resolve({ 'aemo': false, url: '' });
        }
        if (portalNames.length === 1) {
          return Promise.resolve({ 'aemo': false, url: res[portalNames[0]] });
        }
        self.step = 30;
        self.adjustUI({ portalUrls: res });
        return new Promise(function (resolve, reject) {
          self.selectPortal = { resolve: resolve, reject: reject };
        }).then(function (res) {
          return Promise.resolve({ 'aemo': false, url: res });
        });
      }
      return Promise.resolve(res);
    }).then(function (res) {
      if (!res || !res.url) {
        logger.info('Portal url is not defined, skip rooms');
        return Promise.reject({ skipped: true });
      }
      self.step = 40;
      self.adjustUI({ aemo: res.aemo, user: self.emailAddress.split('@')[0] });
      logger.info('Logging in rooms, portal url: ' + res.url);
      return self.loginRooms(res.aemo, res.url);
    }).then(function (res) {
    }, function (err) { // skip goes here
      if (err && !(err.skipped || err.canceled)) {
        logger.info('Rooms configuring failed, err: ' +  Utils.stringifyJSON(err));
        return Promise.reject(err);
      }
      logger.info('Rooms configuring failed, skip rooms, err: ' +  Utils.stringifyJSON(err));
      return Promise.resolve(); // skipped (or canceled (SV))
    });
  }

  function normalizeUrl(url) {
    url = url || '';
    if ((url.indexOf('http://') < 0) && (url.indexOf('https://') < 0)) {
      url = 'https://' + url;
    }
    if (url.lastIndexOf('/') === url.length - 1) {
      url = url.slice(0, -1);
    }
    return url;
  }

  CfgWizard.prototype.configureSources = function (source) {
    this.configuration = { };
    var emailAddress = this.email.node.value;
    logger.info('Configure sources, input: ' + emailAddress);
    var opt = emailAddress.split(';&');
    this.emailAddress = opt.shift();
    opt = opt.reduce(function (res, pair) {
      pair = pair.split('=');
      res[pair[0]] = normalizeUrl(pair[1]);
      return res;
    }, { });
    logger.info('Configure sources, email address: ' + this.emailAddress + ', opt: ' + JSON.stringify(opt));
    this.zangAPI = new ZangAPI(opt['AVAYA_CLOUD_ACCOUNTS_URI'] || AVAYA_CLOUD_ACCOUNTS_URI);
    this.aemoAPI = new AemoAPI(opt['EQUINOX_MEETING_ACCOUNT_DISCOVERY_URL'] || EQUINOX_MEETING_ACCOUNT_DISCOVERY_URL);
    delete opt['EQUINOX_MEETING_ACCOUNT_DISCOVERY_URL']; // ???
    var self = this;
    return this.configureSpaces(opt).then(function () {
      self.source += 1;
      return self.configureRooms();
    });
  }

  CfgWizard.prototype.checkSources = function () {
    this.step = 52;
    this.adjustUI();
    var self = this;
    logger.info('Checking configured sources');
    return new Promise(function (resolve, reject) {
        var isValid;
        [roomsConfig, spacesConfig].forEach(function (sourceConfig) {
          isValid = isValid || sourceConfig.isValid(self.configuration);
        });
        if (!isValid) {
          logger.info('No configured sources found');
          self.layout.addClass('hidden');
          self.showError({ message: i18n.i18n.errorNoConfiguredAccounts }).then(function () {
            self.source = 0;
            self.step = 10;
            self.adjustUI();
          });
          reject();
        }
        setTimeout(resolve, 300); // force delay???
    });
  }

  CfgWizard.prototype.onOk = function () {
    var self = this;
    if (this.step === 10) {
      this.configureSources().then(function () {
        self.checkSources().then(function () {
          var resolve = self.model.configuration.resolve;
          logger.info('Created configuration: ' + JSON.stringify(self.configuration));
          resolve(self.configuration);
        }, function () {
        });
      }, function (err) {
        self.model.clearCache();
        for (var source in self.sources) {
          if (self.sources[source]) {
            self.sources[source].logout();
            self.sources[source] = null;
          }
        }
        self.source = 0;
        self.step = 10;
        self.adjustUI(err.canceled ? { } : { error: true });
      });
      return;
    }
    if (this.login) {
      self.step = 21;
      self.adjustUI({ progress: true });
      self.login.resolve();
      delete self.login;
    }
    if (this.selectPortal) {
      this.selectPortal.resolve(this.portal.node.value);
      delete this.selectPortal;
    }
  }

  CfgWizard.prototype.onSkip = function () {
    if (this.login) {
      this.login.reject({ skipped: true });
      delete this.login;
    }
    if (this.selectPortal) {
      this.selectPortal.reject({ skipped: true });
      delete this.selectPortal;
    }
  }

  CfgWizard.prototype.onCancel = function () {
    if (this.canceled) {
      this.canceled.reject({ canceled: true });
      delete this.canceled;
    }
  }

  module.exports = panel.extend(CfgWizard);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var API = __webpack_require__(23);

  var methods = {
    checkUserExist: {
      uri: '/acs/resources/checkUserExist',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      args: {
        userId: { key: '$(userId)', flags: 's' },
      },
      body: {
        'emailaddress': '$(userId)',
      },
      response: {
        conferencePortalUri: { key: 'CONFERENCE_PORTAL_URI', flags: 's' },
        clientSettingsFileUrl: { key: 'clientSettingsFileUrl', flags: 's' }
      }
    }
  };

  function AemoAPI(serverBase) {
    this.$super(serverBase);
  }

  Object.getOwnPropertyNames(methods).forEach(function (name) {
    AemoAPI.prototype[name] = function(args) {
      return this._exec(methods[name], args);
    }
  }, this);
  
  module.exports = API.extend(AemoAPI);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var API = __webpack_require__(23);

  var methods = {
    checkUserExist: {
      uri: '/api/1.0/users/exist',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      args: {
        userId: { key: '$(userId)', flags: 's' },
      },
      body: {
        'username': '$(userId)',
      },
      response: {
      }
    },
    getPortalInfo: {
      uri: '/api/1.0/companies/$(emailDomain)/products/equinoxcloudclient/public_application_setting',
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      args: {
        emailDomain: { key: '$(emailDomain)', flags: 's' },
      },
      response: {
        portalInfo: { key: 'public_profile_setting', flags: 's' }
      }
    }
  };

  function ZangAPI(serverBase) {
    this.$super(serverBase);
  }

  Object.getOwnPropertyNames(methods).forEach(function (name) {
    ZangAPI.prototype[name] = function(args) {
      return this._exec(methods[name], args);
    }
  }, this);
  
  module.exports = API.extend(ZangAPI);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom = __webpack_require__(5);
  var Panel = __webpack_require__(9);
  var Action = __webpack_require__(17);
    
  var i18n = __webpack_require__(6);
  var States = __webpack_require__(20);

  function ProgressView(opt) {
    this.$super();
    this.delClass('panel').addClass('panel-progress-view');

    this.model = opt.model;
  }

  ProgressView.prototype.render = function () {
    if (this.node.innerHTML) {
       return;
    }
    this.add(
      dom.div().addClass('panel-progress-wrap').add(
        this.noteHead = dom.div({ cssClass: 'panel-progress-head' }),
        this.noteText = dom.div({ cssClass: 'panel-progress-text' })
      ), 
      dom.div().addClass('actions-list').add(
        this.actionCancel = new Action().delClass('action').addClass('hidden action-item').set({ click: this.onCancel.bind(this) }),
        this.actionRetry = new Action().delClass('action').addClass('hidden action-item').set({ click: this.onRetry.bind(this) })
      )
    );
    return this;
  };

  ProgressView.prototype.update = function (ctxstate) {
    if (!ctxstate.source) {
      if (ctxstate.app === States.App.Unknown) {
        this.noteHead.setText('');
        this.noteText.setText('');
        this.actionCancel.setText('');
        this.actionRetry.setText('');
        this.actionCancel.addClass('hidden');
        this.actionRetry.addClass('hidden');
      } else if (ctxstate.app === States.App.Initializing) {
        this.noteHead.setText(i18n.i18n.noteAppInitializing);
        this.noteText.setText(i18n.i18n.notePleaseWait);
        this.actionCancel.setText(i18n.i18n.actionCancel);
        this.actionRetry.setText(i18n.i18n.actionTryAgain);
      } else if (ctxstate.app === States.App.NotInitialized) {
        this.noteHead.setText(i18n.i18n.noteAppNotInitialized);
        this.noteText.setText('');
        this.actionCancel.setText(i18n.i18n.actionCancel);
        this.actionRetry.setText(i18n.i18n.actionTryAgain);
        this.actionCancel.addClass('hidden');
        this.actionRetry.delClass('hidden');
      } else {
        // this.noteText.setText(i18n.i18n[States.App.names[ctxstate.app]]);
      }
      return;
    }

    this.actionCancel.toggleClass('hidden', !this.model.cancel);
    this.noteHead.setText(i18n.i18n.noteLoading + ' ' + this.model.getSourceName(ctxstate.source));
    this.noteText.setText(i18n.i18n['note' + States.Src.names[ctxstate.sources[ctxstate.source]]]);
    return this;
  };

  ProgressView.prototype.onCancel = function () {
    if (this.model.cancel) {
      this.model.cancel();
    }
  };

  ProgressView.prototype.onRetry = function () {
    this.actionRetry.addClass('hidden');
    // location.reload();
    window.appRestart();
  };
  
  module.exports = Panel.extend(ProgressView);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom      = __webpack_require__(5);
  var panel    = __webpack_require__(9);
  var action   = __webpack_require__(17);

  var SpacesList = __webpack_require__(66);

  var i18n     = __webpack_require__(6);

  var details  = __webpack_require__(76);
  // var places   = require('./places');
  var places   = __webpack_require__(77);

  var meeting = function (opt) {
    this.$super();
    this.delClass('panel').addClass('panel-meeting-view');

    this.model = opt.model;

    this.details = new details(opt);
    this.places = new places(opt);
    this.addingDetails = false;
  };

  meeting.prototype.render = function () {
    if (!this.node.innerHTML) {
      this.add(dom.div().addClass('panel-meeting-wrap').add(
        this.title = dom.div().addClass('panel-meeting-title'),
        this.selector = dom.div().addClass('panel-meeting-selector'),
        dom.div().addClass('actions-list').add(
          this.btnAddDetails = new action().delClass('action').addClass('action-item').add(i18n.i18n.actionAddDetails).set({ click: this.onAction.bind(this) })
        )
      ));
    }
    this.updateSelection(this._selection);
    return this;
  };

  meeting.prototype.update = function (title, selector) {
    this.title.node.innerText = title;
    this._selector = selector;
    this._selector.render();
    this.selector.add(this._selector);
    this.updateSelection(this._selector.getSelectedItem());
    this._selector.onItem.addListener(this.evItem, this);
    if (this._selector.onItem2) {
      this._selector.onItem2.addListener(this.evItem2, this);
    }
    return this;
  };

  meeting.prototype.updateSelection = function (item) {
    this._selection = item;
    if (this.addingDetails) {
      this.btnAddDetails.node.innerText = i18n.i18n.actionAddingDetails;
      return;
    }
    if (item) {
      this.btnAddDetails.node.innerText = (item.id === SpacesList.NEW) ? i18n.i18n.actionCreateTopic : i18n.i18n.actionAddDetails;
      this.btnAddDetails.delClass('disabled');
    } else {
      this.btnAddDetails.node.innerText = i18n.i18n.actionAddDetails;
      this.btnAddDetails.addClass('disabled');
    }
  };

  meeting.prototype.evItem = function (item) {
    this.updateSelection(item);
  };
  meeting.prototype.evItem2 = function (item) {
    this.onAction();
  };

  meeting.prototype.onAction = function () {
    if (!this._selection || this.addingDetails) {
      return;
    }
    this.btnAddDetails.addClass('disabled');
    this.btnAddDetails.node.innerText = i18n.i18n.actionAddingDetails;
    this.addingDetails = true;
    var item = this._selection;
    var schedule = true;
    var createMeeting = item.id === SpacesList.NEW ?
      this.model.createTopic({ source: item.source, title: item.title, client: schedule, parties: null, join: !schedule }) :
      this.model.createInvite({ id: item.id, source: item.source, client: schedule, parties: null, join: !schedule });
    var self = this;
    createMeeting.then(function () {
      self.addingDetails = false;
      self.updateSelection(self._selection);
      // self._selector.clearSelectedItem();
    });
  };

  module.exports = panel.extend(meeting);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';
  
  var Panel   = __webpack_require__(9);
  var dom     = __webpack_require__(5);
  var Event   = __webpack_require__(2);

  function empty () {
  }
  function onclick (list, handler, ev) {
    var src;
    if (ev) {
      ev.preventDefault();
      // ev.stopPropagation(); // allow hide settings popup
      src = ev.srcElement || ev.target;
    }
    if (src) {
      var action;
      for (var el = src; el !== list.node; el = el.parentElement) {
        var id = el.getAttribute(list.$itemId);
        if (el.parentElement === list.node) {
          handler(id, src, action);
          break;
        } else {
          action = action || id || null;
        }
      }
    }
  }
  
  /** @constructor */
  function ListView (opt) {
    this.$super(opt);
    this.delClass('panel');

    this.$empty     = '';
    this.$itemId    = 'jslid';

    this.$items     = {};

    this.set({ click: onclick.bind(this, this, this.clickItem.bind(this)) });
    this.set({ dblclick: onclick.bind(this, this, this.dblclickItem.bind(this)) });
    
    this.onAction = (opt && opt.onAction) ? opt.onAction : new Event();
    this.onAction2 = (opt && opt.onAction2) ? opt.onAction2 : new Event();
  }

  ListView.prototype.create = function () {
    return this.node || dom.ul().addClass('listview').node;
  };
  ListView.prototype.clear = function () {
    this.$items = {};
    this.node.innerHTML = this.$empty;
  };
  
  ListView.prototype.getItemId = function (item) {
    return item.id;
  };
  ListView.prototype.insertItem = function (item) {
    return dom.li({ '@jslid': this.getItemId(item) });
  };
  ListView.prototype.insert = function (item) {
    var id = this.getItemId(item);
    var li = this.$items[id];
    if (!li) {
      li = this.$items[id] = this.insertItem(item);
      this.add(li);
    }
    this.update(item);
    return li;
  };
       
  ListView.prototype.updateItem = function (li, item) {
    li.data = item;
    this.sort();
  };
  ListView.prototype.update = function (item) {
    var id = this.getItemId(item);
    var li = this.$items[id];
    if (li) {
      this.updateItem(li, item);
    }
  };
  
  ListView.prototype.clickItem = function (id, src, action) {
    this.onAction.dispatch({ id: id, src: src, list: this, action: action });
  };
  ListView.prototype.dblclickItem = function (id, src, action) {
    this.onAction2.dispatch({ id: id, src: src, list: this, action: action });
  };
  ListView.prototype.getItem = function (id) {
    return this.$items[id];
  };
  ListView.prototype.removeItem = function (id) {
    var li = this.$items[id];
    if (li) {
      delete this.$items[id];
      li.del(true);
    }
  };
  ListView.prototype.sort = function () {
    this.reorder(this.$items, this.compare);
  };
  ListView.prototype.reorder = function (items, compare) {
    var x = [];
    for (var i in items) {
      x.push(items[i]);
    }
    x.sort(compare);
    for (i = 0; i < x.length; i++) {
      var li = x[i];
      if (li) {
        var p = li.node.parentNode;
        if (p.children[i] !== li) {
          p.removeChild(li.node);
          var b = i < x.length - 1 ? p.children[i + 1] : null;
          p.insertBefore(li.node, b || null);
        }
      }
    }
  };
  ListView.prototype.compare = function (a, b) {
    return 0;
  };
  
  module.exports = Panel.extend(ListView);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom = __webpack_require__(5);
  var Event = __webpack_require__(2);
  var Panel = __webpack_require__(9);
  var Action = __webpack_require__(17);

  var i18n = __webpack_require__(6);

  function DetailsView(opt) {
    this.$super();
    this.delClass('panel').addClass('panel-details-view');

    this.model = opt.model;

    this._items = { };
    this.content = dom.div({ cssClass: 'panel-details' }).add(
      dom.div({ cssClass: 'panel-details-shim' }).add(
        dom.div({ cssClass: 'room-select' }).add(
          this._select = dom.select({ cssClass: 'selectRoom' })//.set({ '^change': this._evItemChange.bind(this) })
        ),
        dom.div({ cssClass: 'panel-info-item' }).add(
          this._titleConferenceAccessNumber = dom.div({ cssClass: 'panel-info-name' }),
          this._conferenceAccessNumber = dom.div({ cssClass: 'panel-info-value' })
        ),
        dom.div({ cssClass: 'panel-info-item' }).add(
          this._titleMeetingId = dom.div({ cssClass: 'panel-info-name' }),
          this._meetingId = dom.div({ cssClass: 'panel-info-value' })
        ),
        dom.div({ cssClass: 'panel-info-item' }).add(
          this._titleConferenceAccessUrl = dom.div({ cssClass: 'panel-info-name' }),
          this._conferenceAccessUrl = dom.div({ cssClass: 'panel-info-value' })
        )
      )
    );

    this.onItem = new Event();
    this.onItem2 = new Event();

    this.model.onTopic.addListener(this._evTopics, this);
    //this.model.onState.addListener(this._evState, this);
  }

  DetailsView.prototype.render = function () {
    if (this.node.innerHTML) {
      return;
    }

    this._titleConferenceAccessNumber.node.innerText = i18n.i18n.titleConferenceAccessNumber;
    this._titleMeetingId.node.innerText = i18n.i18n.titleMeetingId;
    this._titleConferenceAccessUrl.node.innerText = i18n.i18n.titleConferenceAccessUrl;
    this.add(this.content);

    var self = this;
    this.model.getTopics().then(function (r) {
      var items = r.items || [];
      for (var i = 0; i < items.length; i++) {
        self._evTopics({ item: items[i] });
      }
      self._selector = RoomSelect(self._select.node, self._evItemChange.bind(self), self._evItemChange2.bind(self));

      if (!self.model.wasInvited && (items.length === 1)) {
        self._evItemChange2();
      }
    });
    return this;
  };

  //DetailsView.prototype._evState = function () {
  //  if ((this.model.ctxstate.app === 3) && (!this.node.innerHTML)) {
  //    this.skipAutoInsert = true;
  //  }
  //};

  DetailsView.prototype._evTopics = function (topic) {
    var item = topic.item;
    if (item.source !== 'rooms' || item.error) {
      return;
    }
    if (this._items[item.id]) {
      return;
    }
    this._items[item.id] = item;
    this._select.add(
      dom.option().add(item.title).set({ '@value': item.id })
    );
    
    if (Object.getOwnPropertyNames(this._items).length === 1) { // first item added
      this._evItemChange(); 
    }
  };

  DetailsView.prototype._evItemChange = function () {
    var item = this.getSelectedItem();
    var room = item.room;
    var isEquinoxRoom = room.type === 'equinox';

    this._conferenceAccessNumber.node.innerHTML = room.conferenceAccessNumber;
    this._conferenceAccessNumber.node.parentElement.style.display = isEquinoxRoom ? 'none' : '';
    this._meetingId.node.innerHTML = isEquinoxRoom ? room.meetingId : '';
    this._meetingId.node.parentElement.style.display = isEquinoxRoom ? '' : 'none';
    this._conferenceAccessUrl.node.innerHTML = room.conferenceAccessUrl;
    this._conferenceAccessUrl.node.parentElement.style.display = '';
    this.onItem.dispatch(item);
  };

  DetailsView.prototype._evItemChange2 = function () {
    var item = this.getSelectedItem();
    this.onItem2.dispatch(item);
  };

  DetailsView.prototype.getSelectedItem = function () {
    return this._items[this._select.node.value];
  };

  DetailsView.prototype.clearSelectedItem = function () {
    this._select.node.selectedIndex = 0;
    this._selector.refresh();
  };

  module.exports = Panel.extend(DetailsView);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event         = __webpack_require__(2);
  var Panel         = __webpack_require__(9);
 
  var SpacesView    = __webpack_require__(78); // spaces.view1 supports splitted lists for sources

  var i18n          = __webpack_require__(6);
  var States        = __webpack_require__(20);

  var _SpacesView = function (model) {
    this.$super({ css: 'meeting-selector-layer', model: model });
    this.delClass('panel layer layer-hidden');

    this.setPartyType(model.getPartiesType());
    this.model.onFilter.addListener(this.evFilter, this);
  };

  _SpacesView.prototype.getModel = function () {
    return this.model;
  };
  _SpacesView.prototype.getI18N = function () {
    return i18n;
  };

  _SpacesView.prototype.applyPartiesType = function () {
    this.setPartyType(this.model.getPartiesType());
  };
  _SpacesView.prototype.applySearchValue = function () {
    return this.find || '';
  };
  _SpacesView.prototype._evTypeChange = function () {
    this.model.setPartiesType(this.getPartyType());
  };

  _SpacesView.prototype.evPartiesType = function(partiesType) {
    this.setPartyType(partiesType);
  };
  _SpacesView.prototype.evFilter = function(filter) {
    this.find = filter;
  };

  var _View = SpacesView.extend(_SpacesView);



  var topics = function (opt) {
    this.$super();
    this.delClass('panel').addClass('panel-meeting-selector-wrap');

    this.content = new _View(opt.model);
    
    this.onItem = new Event();
    this.onItem2 = new Event();
    
    opt.model.onState.addListener(this.evState, this);
    this.content.onState.addListener(this.evItem, this);
    this.content.onState2.addListener(this.evItem2, this);
  };

  topics.prototype.render = function () {
    if (this.node.childElementCount === 0) {
      this.add(this.content);
    }
    this.content.render();
    return this;
  };

  topics.prototype.evState = function(ctxstate) {
    // if (ctxstate.source && ctxstate.sources[ctxstate.source] === States.Src.Checked) {
    //   this.content.showListView(ctxstate.source);
    // }
  };

  topics.prototype.evItem = function(item) {
    this.onItem.dispatch(item);
  };
   topics.prototype.evItem2 = function(item) {
    this.onItem2.dispatch(item);
  };

  topics.prototype.getSelectedItem = function () {
    return this.content.getSelectedItem();
  };

  topics.prototype.clearSelectedItem = function () {
    this.content.clearSelectedItem();
  };

  module.exports = Panel.extend(topics);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var dom = __webpack_require__(5);
  var Action = __webpack_require__(17);
  var MeetingPanel = __webpack_require__(79);
  var SpacesList = __webpack_require__(66);
  var partyType = __webpack_require__(19);
  var i18n;
  var context;

  var cssInviteDiv = 'meeting-selector-role';
  var cssInviteLabel = 'meeting-selector-role-label';
  var cssInviteSelect = 'meeting-selector-role-select';

  var cssSearchDiv = 'meeting-selector-search';
  var cssSearchWrap = 'meeting-selector-search-wrap';
  var cssSearchInput = 'meeting-selector-input';

  var cssListDiv = 'meeting-selector-listwrap';

  function SpacesView(opt) {
    this.model = opt.model;
    i18n = this.getI18N();
    context = this.getContext();

    this._setStyles(opt);
    this.$super(opt);

    this._evTimer = this._evTimer.bind(this);
    this.refresh = this.refresh.bind(this);

    this._topics = {};
    this.model.onTopic.addListener(this._evTopics, this);
  }
  
  SpacesView.prototype.init = function () {
    this._addSearchBox();
    this._addListView();
    this._addInviteBox();

    this._invite.node.style.display = context.schedule ? '' : 'none';
    this._selection = null;
    this._list.onAction.addListener(this._evList, this);
    this._list.onAction2.addListener(this._evList2, this);
    this._searchValue = '';

    var self = this;
    Object.defineProperty(this._list, 'searchValue', {
      get: function() {return self._search.node.value;}
    });
  };

  SpacesView.prototype._setStyles = function (opt) {
    this._styles = { 
      inviteDiv: opt.cssInviteDiv || cssInviteDiv, 
      inviteLabel: opt.cssInviteLabel || cssInviteLabel, 
      inviteSelect: opt.cssInviteSelect || cssInviteSelect, 
      searchDiv: opt.cssSearchDiv || cssSearchDiv, 
      searchWrap: opt.cssSearchWrap || cssSearchWrap, 
      searchInput: opt.cssSearchInput || cssSearchInput,
      listDiv: opt.cssListDiv || cssListDiv
    };
  };

  SpacesView.prototype._addInviteBox = function() {
    this._invite = dom.div().addClass(this._styles.inviteDiv);
    this._inviteLabel = dom.div().addClass(this._styles.inviteLabel);
    this._inviteType = dom.select().addClass(this._styles.inviteSelect);

    this.add(
      this._invite.add(
        this._inviteLabel.add(i18n.i18n.partyTypeSelectLabel),
        this._inviteType.add(
          dom.option().add(i18n.i18n.partyTypeMembers).set({ '@value': partyType.member }),
          dom.option().add(i18n.i18n.partyTypeGuests).set({ '@value': partyType.guest })
        ).set({ '^change': this._evTypeChange.bind(this) })
      )
    );
    this._updateRoles();
  };

  SpacesView.prototype._addSearchBox = function() {
    this.add(
      dom.div().addClass(this._styles.searchDiv).add(
        dom.div().addClass(this._styles.searchWrap).add(
          dom.div().addClass('icon-base icon-search'),
          this._search = dom.input({ hint: i18n.i18n.hintSpacesSearch }).addClass(this._styles.searchInput),
          this._searchClear = new Action().addClass('icon-base icon-clear').set({ click: this._evClear.bind(this) })
        )
      )
    );
  };

  SpacesView.prototype._addListView = function() {
    this._list = new SpacesList();
    this._listcompare = this._list.compare.bind(this._list);
    this._list.compare = this.compare.bind(this);

    this.add(dom.div().addClass(this._styles.listDiv).add(this._list) );  
  };

  SpacesView.prototype.applyI18n = function () {
    this._inviteLabel.setText(i18n.i18n.partyTypeSelectLabel);
    this._inviteType.node.options[0].text = i18n.i18n.partyTypeMembers;
    this._inviteType.node.options[1].text = i18n.i18n.partyTypeGuests;
    this._search.node.placeholder = i18n.i18n.hintSpacesSearch;
  };

  SpacesView.prototype._evTimer = function () {
    var search = this._search.node.value;
    var parties = this.getPartiesCount();

    var update = (search !== this._searchValue) || (parties !== this._parties);

    if (update) {
      this.clearSelectedItem();
      this._parties = parties;

      this._searchValue = search.trim();
      var newTitle = this._searchValue;

      this._searchClear.node.style.visibility = !!this._searchValue ? '' : 'hidden';

      var itemNEW = this._list.getItem(SpacesList.NEW);
      if (itemNEW) {
        this._list.removeItem(SpacesList.NEW);
      }
      var keys = Object.getOwnPropertyNames(this._topics);
      for (var i = 0; i < keys.length; i++) {
        var topic = this._topics[keys[i]];
        this._evTopics({ item: topic });
        if (newTitle === topic.title) {
          newTitle = '';
        }
      }

      var source;
      if (newTitle !== '') {
        var sources = this.model.getValidSources();
        for (var i = 0; i < sources.length; i++) {
          if (this.model.getCapabilities(sources[i]).createTopic) {
            source = sources[i];
            break;
          }
        }
      }
      if (newTitle !== '' && source) {
        // store Create new item in _list only, do not add it to $topics
        var desc = this.model.formatMessage(i18n.i18n.topicCreateNew, { source: this.model.getSourceName(source) });
        var li = this._list.insert({ id: SpacesList.NEW, source: source, searchable: true, title: newTitle, desc: desc, description: '', show: true });
      } else {
        this._list.group();
      }
    }

    setTimeout(this._evTimer, 250);
  };

  SpacesView.prototype._evTopics = function (topic) {
    if (!this._topics) {
      return;
    }

    var item = topic.item;
    if (item.remove) {
      delete this._topics[item.id];
      this._list.removeItem(item.id);
      return;
    }
    if (!item.error && !this.model.isValidSource(item.source)) {
      return;
    }
   this._topics[item.id] = item;
    var n = 0;
    var members = item.members;
    if (members) {
      for (var i = 0; i < members.length; i++) {
        n = n + (members[i].self ? 0 : 1);
      }
    }

    var desc;
    if (!n) {
      desc = i18n.i18n.partiesMeOnly;
    } else {
      desc = i18n.i18n.partiesMePlus + n + i18n.i18n.partiesOtherMembers;
    }

    this._list.insert({ id: item.id, source: item.source, error: item.error,
      title: item.title, desc: desc, description: item.description,
      lastAccess: item.lastAccess, icon: item.icon, searchable : ((typeof(item.searchable) !== 'undefined') ? item.searchable : true),
      show: ((typeof(item.show) !== 'undefined') ? item.show : true) 
    });
  };

  SpacesView.prototype._evClear = function () {
    this._search.node.value = '';
  };

  SpacesView.prototype._evTypeChange = function () {
    throw new Error('not implemented');
  };

  SpacesView.prototype._updateRoles = function (item) {
    //item = item || { };
    //this._invite.toggleClass('disabled', (item.source !== 'spaces') || item.error);
    this._invite.toggleClass('disabled', true);
  };

  SpacesView.prototype._evList = function (item) {
    // console.info('click', item);
    if (!item) {
      this._selection = null;
      return;
    }
    var li = this._list.getItem(item.id);
    this._updateRoles((li || {}).data);

    if (li.data.error) {
      this.model.initSources({ sources: [li.data.source], retry: true });
      return;
    }
    if (this._selection) {
      if (this._selection === item.id) {
        return;
      }
      this._list.getItem(this._selection).delClass('selected');
    }
    li.addClass('selected');
    this._selection = item.id;
    // console.info('item selected, id: ' + li.data.id + ', title: ' + li.data.title);
    this.onState.dispatch(li.data);
  };

  SpacesView.prototype._evList2 = function (item) {
    if (!item) {
      return;
    }
    var li = this._list.getItem(item.id);
    if (li.data.error) {
      return;
    }
    this.onState2.dispatch(li.data);
  };

  SpacesView.prototype.render = function () {
    this._searchValue = ''; // force evTimer restore Create new item if needed
    this._evTimer();

    var self = this;
    this.model.getTopics().then(function (r) {
      var items = r.items || [];
      for (var i = 0; i < items.length; i++) {
        r.item = items[i];
        self._evTopics(r);
      }
    });

    if (this._first) {
      return;
    }
    this.applyI18n();
    this._search.node.value = this.applySearchValue();
    this.applyPartiesType();
    this._first = true;
  };

  SpacesView.prototype.refresh = function () {
    this._list.clear();
    
    var self = this;
    this.model.refresh().then(function () { // wait refresh to complete
      self._searchValue = ''; // then force evTimer restore Create new item if needed
    });
  };

  SpacesView.prototype.getSelectedItem = function () {
    if (!this._selection) {
      return null;
    }
    return this._list.getItem(this._selection).data;
  };

  SpacesView.prototype.clearSelectedItem = function () {
    if (!this._selection) {
      return null;
    }
    this._list.getItem(this._selection).delClass('selected');
    this._selection = null;
    this.onState.dispatch(null);
  };

  SpacesView.prototype.applySearchValue = function () {
    return '';
  };

  SpacesView.prototype.applyPartiesType = function () {
  };

  SpacesView.prototype.getPartyType = function () {
    return this._inviteType.node.value;
  };

  SpacesView.prototype.setPartyType = function (value) {
     this._inviteType.node.value = value;
  };

  SpacesView.prototype.getPartiesCount = function () {
    return 0;
  };

  SpacesView.prototype.getContext = function () {
    return { schedule: true };
  };

  SpacesView.prototype.compare = function (a, b) {
    if (a.data.id === SpacesList.NEW) {
      return -1;
    }
    if (b.data.id === SpacesList.NEW) {
      return 1;
    }
    //if (!this._searchValue) {
      var res = this.model.compare(a.data, b.data);
      if (res !== 0) {
        return res;
      }
    //}
    return this._listcompare(a, b); // TODO: sort items with unknown sources by source names?
  };

  SpacesView.prototype.getModel = function () {
    throw new Error('not implemented');
  };

  SpacesView.prototype.getI18N = function () {
    throw new Error('not implemented');
  };

  module.exports = MeetingPanel.extend(SpacesView);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Panel         = __webpack_require__(9);
  var animate       = __webpack_require__(80);
  var Event         = __webpack_require__(2);

  var cssLayer = 'layer';
  var cssLayerHidden = 'layer-hidden';

  function MeetingPanel(opt) {
    opt = opt || {};
    this._setPanelStyles(opt);
    this.$super({});

    this.addClass(opt.css).addClass(this._panel_styles.layer).addClass(this._panel_styles.layerHidden);
    this.init();

    this.onState = new Event();
    this.onState2 = new Event();
  }

  MeetingPanel.prototype.init = function () {
    //this.addClass('icon info').add(i18n.warnNotImplemented);
  };

  MeetingPanel.prototype._setPanelStyles = function(opt) {
    this._panel_styles = {
      layer: opt.cssLayer || cssLayer,
      layerHidden: opt.cssLayerHidden || cssLayerHidden,
    };
  }

  MeetingPanel.prototype.render = function () {
  };

  MeetingPanel.prototype.show = function (css) {
    if (!this.node.classList.contains(this._panel_styles.layerHidden)) {
      return;
    }
    this.render();
    this.animate(css, null, this._panel_styles.layerHidden);
    this.onState.dispatch();
    //context.parties.show();
  };
  MeetingPanel.prototype.hide = function (css) {
    if (this.node.classList.contains(this._panel_styles.layerHidden)) {
      return;
    }
    this.animate(css, this._panel_styles.layerHidden, null);
    //context.parties.hide();
  };
  MeetingPanel.prototype.animate = function (stages, finalOn, finalOff) {
    animate(this.node, { stages: stages, finalOn: finalOn, finalOff: finalOff });
  };

  module.exports = Panel.extend(MeetingPanel);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var pending;
  function getContext(node) {
    var n = pending.indexOf(node);
    if (n < 0) {
      return null;
    }
    return pending[n + 1];
  }
  function addContext(opt) {
    pending.push(opt.node);
    pending.push(opt);
  }
  function delContext(opt) {
    var n = pending.indexOf(opt.node);
    if (n >= 0) {
      pending.splice(n, 2);
    }
  }
  function completeContext(context) {
    if (!context || !context.node) {
      return;
    } 
    
    delContext(context);

    var stages = context.stages || [];
    for (var i = 0; i < stages.length; i++) {
      context.node.classList.remove(stages[i]);
    }
    var finalOn = context.finalOn || [];
    for (i = 0; i < finalOn.length; i++) {
      context.node.classList.add(finalOn[i]);
    }
    var finalOff = context.finalOff || [];
    for (i = 0; i < finalOff.length; i++) {
      context.node.classList.remove(finalOff[i]);
    }

    if (!context.cancel && context.cb) {
      context.cb();
    }
  }
  function prepareContext(context) {
    var c = getContext(context.node);
    completeContext(c);

    if (context.timeout) {
      context.expire = Date.now() + context.timeout; 
    }

    addContext(context);

    context.index = 0;
    var css = context.stages[context.index];
    if (css) {
      context.node.classList.add(css);
    } else {
      completeContext(context);
    }
  }

  function checkPending() {
    return;
    var item;
    var dt = Date.now();
    for (var i = 1; i < pending.length; i += 2) {
      item = pending[i];
      if (item.expiry && (dt > item.expiry)) {
        completeContext(pending[i - 1]);
      }
    }
    //setTimeout(checkPending, 100);
  }  
  
  function animationStart(ev) {
    var context = getContext(ev.target);
    if (context && context.expiry) {
      context.expiry = 0;
    }
  }
  function animationEnd(ev) {
    var context = getContext(ev.target);
    if (context) {
      var css = context.stages[context.index];
      context.node.classList.remove(css);

      context.index = context.index + 1;
      css = context.stages[context.index];
      if (!css) {
        completeContext(context);
      }
    }
  }

  function init() {
    if (pending) {
      return;
    }
    pending = [];

    document.body.addEventListener('animationend', animationEnd);
    document.body.addEventListener('webkitAnimationEnd', animationEnd);

    document.body.addEventListener('animationstart', animationStart);
    document.body.addEventListener('webkitAnimationStart', animationStart);

    //checkPending();
  }

  function toArray(arg) {
    if (Array.isArray(arg)) {
      return arg;
    } else if (typeof (arg) === 'string') {
      return arg.split(' ');
    }
    return [];
  }
  
  function animate(node, opt) {
    init();
    prepareContext({ node: node, cb: opt.cb, stages: toArray(opt.stages), finalOn: toArray(opt.finalOn), finalOff: toArray(opt.finalOff) });
  }

  module.exports = animate;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom = __webpack_require__(5);
  var Panel = __webpack_require__(9);
  var Action = __webpack_require__(17);

  var office = __webpack_require__(12);
  var i18n = __webpack_require__(6);

  function InvitedView(opt) {
    this.$super();
    this.delClass('panel').addClass('panel-invited-view');
    this.model = opt.model;

    this.details = [];
  }
 
  InvitedView.prototype.addDetailItem = function () {
    var name, value;
    this.detailsBox.add(
      dom.div({ cssClass: 'panel-info-item' }).add(
        name = dom.div({ cssClass: 'panel-info-name' }),
        value = dom.div({ cssClass: 'panel-info-value' })
      )
    );
    var res = { name: name, value: value };
    this.details.push(res);
    return res;
  };

  InvitedView.prototype.render = function () {
    if (!this.node.innerHTML) {
      this.add(
        dom.div().addClass('panel-invited-title').add(this.model.joinMode ? i18n.i18n.titleMeetingDetails : i18n.i18n.titleMeetingDetails2),
        this.detailsBox = dom.div().addClass('panel-invited-info').add(
          dom.div().addClass('panel-info-icon').add(
            this.icon = dom.div()
          ),
          this.title = dom.div().addClass('panel-info-title')
        ),
        dom.div().addClass('actions-list').add(
          this.btnStart = new Action().delClass('action').addClass('action-item action-item-join').add(i18n.i18n.actionStart).set({ click: this.onStart.bind(this) }),
          this.btnRemove = new Action().delClass('action').addClass('action-item action-item-accent').add(i18n.i18n.actionRemoveDetails).set({ click: this.onRemove.bind(this) })
        )
      );
    }
    this.btnRemove.toggleClass('hidden', this.model.joinMode);
    this.btnRemove.toggleClass('disabled', !this.model.canRemoveInvite());
    this.btnRemove.node.innerText = i18n.i18n.actionRemoveDetails;
    this.removingDetails = false;
    return this;
  };

  InvitedView.prototype.update = function (source, title, url, isHost, details) {
    this.icon.set({cssClass: 'invited-icon-' + source});
    this.title.setText(title || '');
    this.btnStart.setText(isHost ? i18n.i18n.actionStart : i18n.i18n.actionJoin);
    this.btnStart.toggleClass('disabled', !url);
    this.btnRemove.toggleClass('disabled', !this.model.canRemoveInvite());
    
    this.details.forEach(function (item) {
      item.name.setText('');
      item.value.node.parentElement.style.display = 'none';
      item.value.setText('');
    });
    var self = this;
    Object.getOwnPropertyNames(details).forEach(function (item, index) {
      var controls = self.details[index] || self.addDetailItem();

      controls.name.setText(item);
      var v = details[item] || '';
      controls.value.node.parentElement.style.display = v ? '' : 'none';
      controls.value.setText(v);
    });

    if (this.btnStart.node.href) {
      this.btnStart.node.href = '#';
    }
    delete this.meetingUrl;
    if (!url) {
      return;
    }
    this.btnStart.delClass('disabled');
    if (url.indexOf('http') !== 0) {
      self.btnStart.node.href = url;
      
      // ACMACOS-10782
      if (navigator.vendor.indexOf('Apple') === 0) {
        self.btnStart.node.setAttribute('target', '_blank');
      }
    } else {
      self.meetingUrl = url;
    }
  };

  InvitedView.prototype.onStart = function () {
    if (this.removingDetails) {
      return;
    }
    if (this.meetingUrl) {
      window.open(this.meetingUrl, '_blank');
      // this.model.startMeeting();
    }
  };

  InvitedView.prototype.onRemove = function () {
    if (this.removingDetails) {
      return;
    }
    this.btnStart.addClass('disabled');
    this.btnRemove.addClass('disabled');
    this.btnRemove.node.innerText = i18n.i18n.actionRemovingDetails;
    this.removingDetails = true;
    this.model.removeInvite();
  };
  
  module.exports = Panel.extend(InvitedView);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom      = __webpack_require__(5);
  var panel    = __webpack_require__(9);
  var Event    = __webpack_require__(2);

  var popup = function create(opt) {
    this.$super({ cssClass: 'panel panel-popup' });
    this.onHide = new Event();
  };

  popup.prototype.render = function (panel) {
    this.node.innerHTML = '';
    this.add(dom.div().addClass('panel-popup-wrap').set({ click: this.onClick.bind(this) }).add(
      panel)
    );
    panel.delClass('hidden');
    return this;
  };

  popup.prototype.onClick = function (ev) {
    if (ev.hidePopup) {
      this.addClass('hidden');
      this.node.innerHTML = '';
      this.onHide.dispatch();
    }
  };

  module.exports = panel.extend(popup);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom      = __webpack_require__(5);
  var panel    = __webpack_require__(9);
  var action   = __webpack_require__(17);

  var i18n = __webpack_require__(6);

  var error = function create(opt) {
    this.$super({ cssClass: 'panel panel-error' });
  };
  
  error.prototype.render = function (err) {
    this.err = err;
    this.node.innerHTML = '';

    var img;
    var content;
    var layout = dom.div({ cssClass: 'panel-error-box' }).add(
      content = dom.div({ cssClass: 'panel-error-content' }).add(
        dom.div({ cssClass: 'panel-error-title' }).add(
          img = dom.div().addClass('panel-error-image hidden'),
          dom.div({'$h' : err.message }).addClass('panel-error-text')
    )));
    img.toggleClass('hidden', !err.source);
    if (err.source) {
      img.addClass(err.source);
    }
    if (err.error && err.error.password) {
      content.add(dom.div().addClass('panel-error-info').add(
          dom.div().addClass('panel-error-info-field').add(
            dom.div({ cssClass: '', text: i18n.i18n.titleUserId }),
            dom.div({ cssClass: '', text: err.info.user })
          ),
          dom.div().addClass('panel-error-info-field').add(
            dom.div({ cssClass: '', text: i18n.i18n.titlePassword }),
            this.password = dom.input({ cssClass: 'input-password', '@type': 'password', hint: i18n.i18n.hintPassword })
          )
        )
      );
    }

    // var re = /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;
    // var buttons = (err.buttons || '').split(re); // 'OkCancel' => ['Ok', 'Cancel']
    var buttons = (err.buttons || '').split('_'); // 'Ok_Cancel' => ['Ok', 'Cancel']
    var textOk = i18n.i18n['action' + (buttons[0] || '')] || i18n.i18n.actionOk;
    var textCancel = i18n.i18n['action' + (buttons[1] || '')] || i18n.i18n.actionCancel;
    var cancel;
    layout.add(dom.div().addClass('actions-list').add(
        new action({ cssClass: 'action-item action-item-accent', text: textOk, click: this.onAction.bind(this, true) }),
        cancel = new action({ cssClass: 'action-item action-item-accent', text: textCancel, click: this.onAction.bind(this, false) })
      )
    );
    if (!this.err.reject) {
      cancel.node.style.display = 'none';
    }
    // if (err.error && err.error.noconfiguration) {
    //   layout.add(dom.div().addClass('panel-links-view').add(
    //     dom.a({ cssClass: 'link-item', text: i18n.i18n.linkEquinoxSettings, href: 'avaya://settings/Accounts' }))
    //   );
    // }
    this.add(layout);
    return this;
  };

  error.prototype.onAction = function (retry, ev) {
    ev.hidePopup = true;
    if (this.err.reject) {
      var info = { };
      if (retry && this.password) {
        info.password = this.password.node.value;
        this.password.node.value = null;
        this.password.del(true);
        delete this.password;
      }
      setTimeout(function() {  // call reject without timeout doesn't allow popup to hide properly... TODO: check again...
        this.err.reject({ retry: retry, info: info });
      }.bind(this), 1);
    } else if (this.err.resolve) {
      setTimeout(function() {  // see comment about reject above
        this.err.resolve();
      }.bind(this), 1);
    }
    this.addClass('hidden');
    this.node.innerHTML = '';
  };

  module.exports = panel.extend(error);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var dom = __webpack_require__(5);
  var Control = __webpack_require__(32);

  var States = __webpack_require__(20);

  var i18n = __webpack_require__(6);

  var links = function (opt) {
    this.$super();
    this.addClass('panel-links-view contextMenu hidden');

    this.model = opt.model;
  };

  links.prototype.render = function () {
    if (this.node.innerHTML) {
      return this;
    }
    this.linkSettings = dom.a({ cssClass: 'link-item hidden', href: 'avaya://settings/Accounts' });
    this.linkReset = dom.a({ cssClass: 'link-item hidden', href: '#', '^click': this.model.resetConfiguration.bind(this.model) });
    // this.linkInvWizard = dom.a({ cssClass: 'link-item hidden', text:  i18n.i18n.linkInvitationWizard, href: '#' }),
    this.add(
      dom.div({ cssClass: 'panel-links-content' }).add(
        this.dropdown = dom.div({ cssClass: 'panel-links-items hidden' }).add(
          this.linkSettings,
          this.linkReset
        ),
        dom.div({ cssClass: 'panel-links-button', '^click': this.toggleDropDown.bind(this) })
      )
    );
    window.onclick = this.hideDropDown.bind(this);
    return this;
  };

  links.prototype.hideDropDown = function (event) {
    if (event) {
      var hide = false;
      if (event.target.matches) {
        hide = !event.target.matches('.panel-links-button');
      } else if (event.target.msMatchesSelector) {
        hide = !event.target.msMatchesSelector('.panel-links-button');
      }
      if (hide) {
        this.dropdown.addClass('hidden');
      }
    }
  }

  links.prototype.toggleDropDown = function () {
    if (this.linkSettings.hasClass('hidden')) {
      this.model.resetConfiguration(); // call reset if settings link is not available
    } else {
      this.dropdown.toggleClass('hidden', !this.dropdown.hasClass('hidden'));
    }
  }

  links.prototype.update = function (ctxstate) {
    if (ctxstate.app === States.App.Initializing) {
      this.linkSettings.node.innerText = i18n.i18n.linkEquinoxSettings;
      this.linkReset.node.innerText = i18n.i18n.linkResetConfiguration;
    }
    if (ctxstate.app === States.App.Configured) {
      // macOS is supressed
      var hideSetting = this.model.configuration.manual || this.model.cfgSources.indexOf('rooms') === -1 || (navigator.platform && navigator.platform.toLowerCase().indexOf('mac') >= 0);
      this.linkSettings.toggleClass('hidden', hideSetting);
      this.linkReset.delClass('hidden');
    }
  };

  module.exports = Control.extend(links);
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event        = __webpack_require__(2);
  var Promise      = __webpack_require__(0);
  var Storage      = __webpack_require__(11);
  var Log          = __webpack_require__(3);
  var Utils        = __webpack_require__(1);

  var Parties      = __webpack_require__(31);
  var PartiesTypes = __webpack_require__(19);
  var Spaces       = __webpack_require__(65);
  var Rooms        = __webpack_require__(64);
  var Test         = __webpack_require__(86);

  var Format       = __webpack_require__(87);
  var i18n         = __webpack_require__(6);
  var office       = __webpack_require__(12);
  var invite       = __webpack_require__(18);

  var States       = __webpack_require__(20);

  var logger = Log.createLogger('APP');
  var loggerUtils = Log.createLogger('UTILS');

  /** @constructor */
  function Model() {
    this.onState = new Event();
    this.onTopic = new Event();
    this.parties = Parties;
    this.onFilter = new Event();
    this.onError = new Event();
    this.i18n = i18n;
  }

  Model.prototype.init = function(opt) {
    Utils.showLogInfo = function (point, obj, fields, exclude) {
      var info = Utils.prepareLogInfo(point, obj, fields, exclude);
      if (typeof(info) === 'undefined') {
        return;
      }
      loggerUtils.info(info);
    }
    opt = opt || { };
    opt.precheck = true;
    this.filter = '';
    this._invite = undefined; // invite is not checked yet
    this.ctxstate = { };
    this._setAppState(States.App.Unknown);
    this.sources = { };
    delete this.wasInvited;
    var self = this;
    return office.checkOffice().then(function (res) { // catch office.initialized flag
      if (!res.checkOffice) {
        return Promise.reject({ error: { nooffice: true } });
      }
  
      var languageId = office.getLanguageSync() || 'en'; // default languageId
      logger.info('Office languageId: ' + languageId);
      return i18n.loadI18n(languageId);
    }).then(function(languageId) {
      opt.languageId = languageId;
      opt.i18n = i18n.i18n;
      office.setTranslations(i18n.i18n);

      // office dialog api is to be used in following cases:
      // 1. on the web (for Safari - ???)
      // 2. in Outlook client web api mode, while running on windows
      var case1 = office.webAPI && (office.hostName !== 'Outlook')/* && (navigator.vendor || '').indexOf('Apple') === 0*/;
      var case2 = office.webAPI && (office.hostName === 'Outlook') && (navigator.vendor || '').indexOf('Apple') !== 0;
      var asyncui = case1 || case2;
      if (asyncui) {
        self.asyncui = {
          hostName: office.hostName,
          open: function (url) {
            if (!office.webAPI) {
              var wnd = window.open(url);
              return Promise.resolve({ value: wnd });
            }
            return office.displayDialog(url, { width: 50, height: 75, requireHTTPS: true });
          }
        }
      }

      self.joinMode = office.joinMode;
      self._setAppState(States.App.Initializing);
      self.ctxstate.sources = { };
      self.ctxstate.validsources = { };
      self.ctxstate.invites = [ ];

      self._setAppState(States.App.Configuring);
      self.configuration = invite.getConfiguration();
      // return Promise.resolve(); // skip configuration wizard
      var configuration = self.configuration;
      if (!self.joinMode && (!configuration || // TODO: check no configuration case more correctly
        (Object.getOwnPropertyNames(configuration).length === 0) ||
        (Object.getOwnPropertyNames(configuration).length === 1 &&
         configuration['ENABLE_AVAYA_CLOUD_ACCOUNTS'] === 0))) { // skipped Spaces && Rooms
        logger.info('Configuration not defined or empty, create manual configuration');
        return self._createConfiguration();
      } else {
        return Promise.resolve();
      }
    }).then(function (r) {
      if (r) {
        logger.info('Setting up manual configuration, reset: ' + self.configurationReset);
        if (!self.configurationReset) {
          self.logout(self.getSources());
        }
        self.configuration = r;
        invite.setConfiguration(self.configuration, true);
        invite.updateMeetingInfo();
      }
      self.cfgSources = [];
      try {
        self.cfgSources = invite.getConfiguredSources();
      } catch(e) {
        return Promise.reject({ error: { nosources: true } });
      };
      opt.sources = self.cfgSources.slice(0);
      self._setAppState(States.App.Configured);
    }).then(function() {
      self._setAppState(States.App.SrcInitializing);
      return self.initSources(opt);
    }).then(function () {
      if (self.getValidSources().length !== 0) {
        self._setAppState(States.App.Initialized);
      } else {
        self._setAppState(States.App.NotInitialized); // no valid sources
        if (self.cfgSources.length !== 1) { // skip error message if only one source is configured (SV request)
          self.showError(null, { error: { nosources: true } });
        }
      }
    }).catch(function (err) {
      self._setAppState(States.App.NotInitialized);
      self.showError(null, err);
    });
  };

  Model.prototype._createConfiguration = function() {
    this.clearCache(); // clear cache before creating new configuration???
    var self = this;
    return new Promise(function (resolve, reject) {
      self.configuration = { emailAddress: office.getEmailAddress(), resolve: resolve, reject: reject };
      self._setAppState(States.App.NotConfigured);
    })
  };

  Model.prototype.resetConfiguration = function() {
    var self = this;
    new Promise(function (resolve, reject) {
      var err = { message: i18n.i18n.askResetConfiguration, buttons: 'Reset_Cancel', reject: reject };
      self.showError(null, err);
    }).then(null, function (res) {
      if (res.retry) {
        self.clearCache();
        self.logout(self.getSources());
        invite.resetConfiguration();
        invite.updateMeetingInfo();
        self.configurationReset = true;
        //location.reload();
        //!! review
        window.appRestart();
      }
    });
  };

  Model.prototype._addSource = function(name) {
    if (this.sources[name]) {
      return;
    }
    switch (name) {
      case 'spaces':
        this.sources[name] = new Spaces();
        break;
      case 'rooms':
        this.sources[name] = new Rooms();
        break;
      case 'test':
        this.sources[name] = new Test();
        break;
    }
    this.sources[name].onTopic.addListener(this._evSourceTopic, this);
    this.sources[name].onProgress.addListener(this._evSourceProgress, this);
    this.ctxstate.sources[name] = States.Src.Unknown;
  };

  Model.prototype._setAppState = function(state) {
    if (this.ctxstate.app !== state || this.ctxstate.app === States.App.Initialized) { // States.App.Initialized occurs on source reinitializing
      logger.info('State changed app: ' + States.App.names[this.ctxstate.app] + ' => ' + States.App.names[state]);
      this.ctxstate.app = state;
      this.onState.dispatch(this.ctxstate);
    }
  };

  Model.prototype._setSrcState = function(source, state) {
    if (this.ctxstate.sources[source] !== state) {
      logger.info('State changed src ' + source + ': ' + States.Src.names[this.ctxstate.sources[source]] + ' => ' + States.Src.names[state]);
      this.ctxstate.sources[source] = state;
      this.onState.dispatch(this.ctxstate);
    }
  };

  Model.prototype.initSources = function(opt) {
    logger.info('initSources: ' + opt.sources.toString());
    if (this.joinMode) {
      ['spaces', 'rooms'].forEach(function (name) {
        this.ctxstate.sources[name] = States.Src.Checked; // set Checked state for all sources if joinMode
        this.ctxstate.validsources[name] = true;
      }.bind(this));
      var self = this;
      return invite.getJoinMeetingUrl().then(function (r) {
        r = r || { };
        var info = { };
        if (r.url) {
          if (r.source === 'spaces') {
            info.topicTitle = i18n.i18n.sourceSpaces;
            info.spaceUrl = r.url;
          } else if (r.source === 'rooms') {
            info.topicTitle = i18n.i18n.sourceEquinox;
            info.joinUrl = r.url;
            info.conferenceAccessUrl = r.url;
          }
        } else {
          info.topicTitle = i18n.i18n.notificationNoMeetingLink;
        }
        self._invite = { source: r.source || '', info: info };
        return Promise.resolve();
      });
    }
    opt.sources = opt.sources || this.getInvalidSources();
    if (!opt.retry) {
      opt.sources.forEach(function (name) {
        this._addSource(name); // create sources on first init
      }.bind(this));
    } else {
      if (opt.retry) {
        if (opt.sources[0] === this.ctxstate.source) {
          logger.info('initSources: skip (already in progress)');
          return;
        }
        if (this.ctxstate.validsources[opt.sources[0]]) {
          logger.info('initSources: skip (already initialized)');
          return;
        }
      }
      opt.sources.forEach(function (name) {
        this.ctxstate.sources[name] = States.Src.Unknown; // set Unknown state for reinitialized sources
      }.bind(this));
    }
    return this._initSources(opt);
  };

  Model.prototype._initSources = function(opt) {
    var sources = opt.sources;
    this.onState.dispatch(this.ctxstate);
    var self = this;
    return sources.reduce(function (step, source) {
      return step.then(function () {
        if (self.ctxstate.validsources[source]) {
          return Promise.resolve(false); // do not intialize source again
        }
        return self._initSource(source, opt).catch(function (err) {
          logger.cred('initSources error:' + Log.getErrInfo(err), (err.info || { })['password']);
          self.onState.dispatch(self.ctxstate);
          var model = self._getModel(source);
          if (err.retry) {
            model.setInfo(err.info);
            return Promise.reject(err); // throw new Error(); // init unitialized sources once again (see catch below)
          } else {
            sources.splice(sources.indexOf(source), 1); // exclude source from the list
          }
        });
      });
    }, Promise.resolve()).then(function (r) {
      if (r) {
        self._setAppState(States.App.Initialized);
      }
      return Promise.resolve();
    }, function (err) { // catch
      logger.cred('initSources error1: ' + Log.getErrInfo(err), (err.info || { })['password']);
      opt.retry = typeof(opt.retry === 'undefined') ? err.retry : opt.retry;
      // init unitialized sources once again
      return self._initSources(opt);
    });
  };

  Model.prototype.getSources = function() {
    return Object.getOwnPropertyNames(this.sources);
  };
  Model.prototype.isValidSource = function(name) {
    return this.ctxstate.validsources[name];
  };
  Model.prototype.getValidSources = function() {
    return Object.getOwnPropertyNames(this.ctxstate.validsources).filter(function (name) {
      return this.isValidSource(name);
    }.bind(this));
  };
  Model.prototype.getInvalidSources = function() {
    return Object.getOwnPropertyNames(this.sources).filter(function (name) {
      return !this.isValidSource(name);
    }.bind(this));
  };

  function PromiseCancel() {
    var cancel;
    var promise = new Promise(function (resolve, reject) {
      cancel = reject.bind(null, { error: { canceled: true } });
    });
    promise.cancel = cancel;
    return promise;
  }

  function exec(cmd, cancel) {
    return Promise.race([cmd, cancel]);
  }

  Model.prototype.getSourceName = function (source) {
    switch (source) {
      case 'rooms':
        return i18n.i18n.sourceEquinox;
      case 'spaces':
        return i18n.i18n.sourceSpaces;
    }
    return i18n.i18n.sourceTitle + ' ' + source;
  };

  Model.prototype.clearCache = function() {
    logger.info('clear cache');
    localStorage.clear();
  }

  Model.prototype.logout = function(sources) {
    sources = sources || this.getValidSources();
    logger.info('logout sources: ' + sources.toString());
    sources.forEach(function (source) {
      var model = this._getModel(source);
      if (model && model.logout) {
        model.logout().then(function () {
          logger.info('logout ' + source + ': done');
        }, function (err) {
          logger.info('logout ' + source + ' error: ' + Log.getErrInfo(err));
        });
      } else {
        logger.info('logout ' + source + ': not implemented');
      }
    }.bind(this));
    invite.clear();
  };

  Model.prototype._initSource = function(source, opt) {
    var model;
    var cancel;
    var err_id;
    var isProgress;
    opt = opt || { };
    opt.noui = this.ctxstate.sources[source] === States.Src.Unknown ? true : false;
    opt.asyncui = this.asyncui;
  
    logger.info('_initSource: ' + source + ', ' + 'state: ' + this.ctxstate.sources[source] + ', opt: ' + JSON.stringify({ 'opt.retry': opt.retry, 'opt.noui': opt.noui, 'opt.languageId': opt.languageId }));
    var self = this;
    return Promise.resolve().then(function () {
      model = self.sources[source];
      self.ctxstate.source = source;
      self._setSrcState(source, States.Src.Initializing);
      cancel = PromiseCancel();
      self.cancel = cancel.cancel;
      var precheckInvite;
      if (opt.precheck && self.isValidSource('rooms') && source !== 'rooms') {
        precheckInvite = exec(model.checkInvite(true), cancel).then(function (r) {
          return Promise.resolve(r);
        });
      } else {
        precheckInvite = Promise.resolve(true);
      }
      return precheckInvite.then(function (r) {
        err_id = 'ERROR-' + source;
        if (!r) {
          logger.info('_initSource: use delayed source initialization');
          delete self.ctxstate.source;
          delete self.cancel;
          var message = i18n.i18n.noteInitializing + ' ' + self.getSourceName(source);
          self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceretry-icon', show: true } });
          self.initSources({ sources: [source] });
          return Promise.resolve(false);
        } else {
          if (opt.retry) {
            self.onTopic.dispatch({ item: { id: err_id, remove: true } });
            var message = self.formatMessage(i18n.i18n.retrySourceInitialization, { source: self.getSourceName(source) });
            self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceretry-icon', show: true } });
          }
          Storage.setStore(Storage.local);
          return exec(model.init(opt), cancel).then(function() {
            self._setSrcState(source, States.Src.Authorizing);
            return exec(model.login(opt), cancel);
          }).then(function () {
            self._setSrcState(source, States.Src.Authorized);
            self._setSrcState(source, States.Src.Fetching);
            return exec(model.pollTopics(), cancel);
          }).then(function (r) {
            if (!r && self.cfgSources.length > 1 || source === 'spaces') {
              isProgress = true;
              var message = i18n.i18n.noteFetching + ' ' + self.getSourceName(source);
              self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceretry-icon', show: true } });
            }
            self._setSrcState(source, States.Src.Fetched);
            self._setSrcState(source, States.Src.Checking);
            return exec(model.checkInvite(), cancel);
          }).then(function (r) {
            self.ctxstate.validsources[source] = true; // mark source as valid (initialized)
            self._setSrcState(source, States.Src.Checked);
            if (r) {
              var invite = r;
              invite.source = source;
              invite.isHost = typeof(r.isHost) === 'undefined' ? true : r.isHost;
              invite.webAPI = typeof(invite.webAPI) !== 'undefined' ? invite.webAPI : office.webAPI;
              if (!self._invite) {
                self._invite = invite;
              }
              self.ctxstate.invites.push(invite);
            }
            delete self.cancel;
            if (!isProgress) {
              self.onTopic.dispatch({ item: { id: err_id, remove: true } });
            }
            delete self.ctxstate.source;
            return Promise.resolve(true);
          });
        }
      });
    }).catch(function (err) {
      logger.info('_initSource error: ' + Log.getErrInfo(err));
      model.cancel();
      delete self.cancel;
      delete self.ctxstate.source;
      if (err.error && !err.error.noui) { // skip logout if noui error? (spaces logout causes error here...)
        // model.logout(); // TODO: check spaces logout error
      }
      self._setSrcState(source, self.ctxstate.sources[source] + 1); // TODO: set step failed state more correctly?
      if (!(err instanceof Object)) {
        err = new Error(err.toString());
      }
      return new Promise(function(resolve, reject) {
        err.resolve = resolve;
        var meeting = self.cfgSources.length === 1 && self.cfgSources[0] === 'rooms';
        if (meeting || !(err.error && err.error.notopics)) {
          err.reject = reject;
        } else {
          self.onTopic.dispatch({ item: { id: err_id, remove: true } });
          var message = self.formatMessage(i18n.i18n.errorSourceInitialization, { source: self.getSourceName(source) });
          self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceinit-icon', show: true } });
        }
        self.showError(source, err);
      }).then(function () {
        logger.info('_initSource Ok');
      }, function (err) {
        logger.cred('_initSource error1: ' + Log.getErrInfo(err), (err.info || { })['password']);
        self.onTopic.dispatch({ item: { id: err_id, remove: true } });
        var message = self.formatMessage(i18n.i18n.errorSourceInitialization, { source: self.getSourceName(source) });
        self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceinit-icon', show: true } });
        return Promise.reject(err);
      });
    });
  };

  Model.prototype.showError = function (source, err) {
    if (!(err.error && err.error.canceled)) { logger.info('Show error: ' + Log.getErrInfo(err)); }
    if (err.error) {
      if (err.error.canceled) {
        err.reject({ retry: false }); // exclude source from the list???
        return;
      }
      if (!err.message) {
        // err.message = i18n.i18n.errorUnknown; // use errorInternal instead (see below)
        if (Object.getOwnPropertyNames(err.error).length === 1) {
          var reason = Object.getOwnPropertyNames(err.error)[0];
          var sourceName = this.getSourceName(source);
          switch (reason) {
            case 'nooffice':
              err.message = i18n.i18n.errorNoOffice;
              break;
            case 'disabled':
              err.message = i18n.i18n.errorAccountDisabled;
              break;
            case 'blocked':
              err.message = i18n.i18n.errorLoginBlocked;
              err.buttons = 'Retry_Cancel';
              break;
            case 'closed':
              err.message = i18n.i18n.errorLoginClosed;
              err.buttons = 'Retry_Cancel';
              break;
            case 'timeout':
              err.message = i18n.i18n.errorLoginTimeout;
              err.buttons = 'Retry_Cancel';
              break;
            case 'fetch':
              err.message = this.formatMessage(i18n.i18n.errorNetwork, { source: sourceName });
              break;
            case 'noui':
              err.message = this.formatMessage(i18n.i18n.errorSignInRequired, { source: sourceName });
              break;
            case 'login':
              err.message = this.formatMessage(i18n.i18n.errorLoginRequired, { source: sourceName });
              break;
            case 'credentials':
              err.message = i18n.i18n.errorInvalidCredentials;
              break;
            case 'password':
              var message;
              switch (err.error['password']) {
                case 'empty':
                  message = i18n.i18n.titlePasswordDetails; // errorEmptyPassword;
                break;
                default:
                  message = i18n.i18n.titlePasswordDetails; // errorBadPassword;
                break;
              }
              err.info = err.info || { };
              err.info.source = this.getSourceName(source);
              err.message = this.formatMessage(message, err.info);
              err.buttons = 'Login_Cancel';
              break;
            case 'notopics':
              err.message = i18n.i18n.errorNoRooms;
              break;
            case 'fetchTemplate':
              err.message = i18n.i18n.errorTemplate;
              break;
            case 'noconfiguration':
              if (!source) {
                err.message = i18n.i18n.errorNoAppConfiguration;
              } else {
                err.message = this.formatMessage(i18n.i18n.errorNoSourceConfiguration, { source: sourceName });
              }
              break;
            case 'nosources':
              err.message = i18n.i18n.errorNoValidSources;
              break;
          }
        }
        if (!err.message && !reason) {
          reason = Object.getOwnPropertyNames(err.error).map(function (f) {
            return f + ': ' + err.error[f].toString();
          }).join(', ');
        }
      }
    } else {
      if (typeof(err) === 'string') {
        err = { message: err };
      }
      // TODO: ???
    }
    if (!err.message) {
      err.message = i18n.i18n.errorInternal;
      // if (reason) { // ???
      //   err.message += '(' + reason + ')';
      // }
    }
    err.source = err.source || source;
    this.onError.dispatch(err);
  };

  Model.prototype._evSourceTopic = function (topic) {
    this.onTopic.dispatch(topic);
  }

  Model.prototype._evSourceProgress = function (source, info) {
    var err_id = 'ERROR-' + source;
    if (info.fetched) {
      this.onTopic.dispatch({ item: { id: err_id, remove: true } });
    }
    if (info.err) {
      var self = this;
      new Promise(function (resolve, reject) {
        self.showError(source, { message: info.err, resolve: resolve });
      }).then(function() {
        self.onTopic.dispatch({ item: { id: err_id, remove: true } }); // ???
        var message = self.formatMessage(i18n.i18n.errorSourceInitialization, { source: self.getSourceName(source) });
        self.onTopic.dispatch({ item: { id: err_id, source: source, error: true, searchable: false, title: message, members: [], icon: 'info-icon error-sourceinit-icon', show: true } });
        delete self.ctxstate.validsources[source];
        var model = self._getModel(source);
        if (model.getTopics().items.length === 0) { // no valid items
          if (self.getValidSources().length === 0) {
            self._setAppState(States.App.NotInitialized); // no valid sources
            if (self.cfgSources.length !== 1) { // skip error message if only one source is configured (SV request)
              self.showError(null, { error: { nosources: true } });
            }
          }
        }
      });
    }
  }

  Model.prototype._getModel = function (source) {
    var model = this.sources[source];
    return model;
  };

  Model.prototype.getModel = function (source) {
    var model = this._getModel(source);
    return model ? Promise.resolve(model) : Promise.reject(i18n.i18n.errorUnknownSource);
  };

  Model.prototype.getTopics = function() {
    var res = { items: [] };
    var self = this;
   this.getValidSources().forEach(function (source) {
      var model = self._getModel(source);
      var topics = model.getTopics().items || [];
      topics.forEach(function (topic) {
        topic.source = topic.source || source;
        topic.members = topic.members || [];
        res.items.push(topic);
      });
    });
    return Promise.resolve(res);
  };

  Model.prototype.getPartiesType = function() {
    return this.parties.getPartiesType();
  };

  Model.prototype.setPartiesType = function(type) {
    this.parties.setPartiesType(type);
  };

  Model.prototype.getCapabilities = function (source) {
    var model = this.isValidSource(source) ? this._getModel(source) : null;
    return {
      createInvite: model ? !!model.createInvite : false,
      removeInvite: model ? !!model.removeInvite : false,
      createTopic: model ? !!model.createTopic : false, // TODO: enable createTopic?
      refresh: model ? !!model.refresh : false
    };
  };

  Model.prototype.createInvite = function(invite) {
    var model;
    var source = invite.source;
    var self = this;
    return this.getModel(source).then(function (r) {
      model = r;
      return office.getParties(self.getPartiesType() === PartiesTypes.member);
    }).then(function(parties) {
      invite.parties = parties;
      return model.createInvite(invite);
    }).then(function(r) {
      if (!r.content || (!r.content.html && !r.content.text)) {
        throw new Error(i18n.i18n.errorInviteContentEmpty);
      }
      r.source = source;
      r.isHost = typeof(r.isHost === 'undefined') ? true : r.isHost;
      r.type = r.type || source;
      return self._insertInvite(r);
    }).catch(function(err) {
      if (err.error && err.error.password) {
        return new Promise(function(resolve, reject) {
          err.resolve = resolve;
          err.reject = reject;
          err.buttons = "Login_Cancel";
          self.showError(source, err);
        }).catch(function (err) {
          if (err.info.password) {
            model.setInfo(err.info);
            return self.createInvite(invite);
          }
        });
      }
      self.showError(source, err);
    });
  };

  Model.prototype.removeInvite = function(fallBack) {
    if (!this._invite) {
      return Promise.reject(new Error(i18n.i18n.errorNoInvite));
    }
    this.wasInvited = true;
    
    var source = this._invite.source;
    var type = fallBack ? 'text' : 'html';//office.webAPI ? 'html' : (this.isOutlook16Plus() ? 'html' : 'rtf'); // 'html'; // office.webAPI ? 'html' : 'rtf'; // office.webAPI ? 'html' : (this.isOutlook16Plus() ? 'html' : 'rtf');
    var self = this;
    // TODO(?): model.removeInvite({ id: this._invite.inviteId }).then(function() { // inviteId may be undefined
    return office.getDescription(type).then(function(r) {
      var res = Format.clearInviteInfo(source, r, type);
      if (res) {
        return office.setDescription(res, type);
      }
    }).then(function () {
      return office.setLocation('');
    }).then(function () {
      var title = (self._invite.info || { }).topicTitle;
      if (!title) {
        return Promise.resolve(); // do nothing if title is not defined
      }
      return Promise.resolve().then(function () {
        return office.getSubject().then(function (subject) {
          if (subject !== title) {
            return Promise.resolve(); // do not clear custom subject
          }
          return office.setSubject('');
        });
      }).catch(function () {
        return Promise.resolve(); // ignore subject errors???
      });
    }).then(function () {
      self.ctxstate.invites.splice(0, 1); // TODO: check for other invites once again?
      self._invite = self.ctxstate.invites[0];
      self.onState.dispatch(self.ctxstate);
    }).catch(function(err) {
      logger.info('removeInvite failed, type = ' + type + ', error: ' + JSON.stringify(err));
      // retry to insert text invite on Outlook + Web
      if (office.webAPI && (office.hostName === 'Outlook') && !fallBack) {
        return self.removeInvite(true);
      }
      self.showError(source, err);
      // return Promise.reject(err); // ???
    });
  };

  Model.prototype._insertInvite = function(invite, fallBack) {
    var info;
    var type = fallBack ? 'text' : 'html';
    if (type === 'html') {
      var formatTextContent = false;
      formatTextContent = formatTextContent || !invite.content.html;
      // formatTextContent = formatTextContent || invite.source === 'spaces';
      // formatTextContent = formatTextContent  || (invite.source === 'rooms' && invite.type !== 'equinox');
      info = formatTextContent ? Format.formatTextContent(invite.id, invite.content.text) : invite.content.html;
      var markContent = false;
      markContent = markContent || (invite.source === 'rooms' && invite.type !== 'equinox');
      info = Format.formatInviteInfo(invite.source, info, markContent);
    } else {
      info = Format.formatInviteText(invite.content.text);
    }
    var location = invite.location;
    var self = this;
    return Promise.all([typeof(location) !== 'undefined' ? office.setLocation(location) : Promise.resolve(), office.insertDescription(info, type)]).then(function() {
      self._invite = { inviteId: invite.id, source: invite.source, isHost: invite.isHost, info: invite.info, webAPI: !!office.webAPI };
      self.ctxstate.invites.push(self._invite);
      self.onState.dispatch(self.ctxstate);
      if (invite.source === 'rooms') {
        return Promise.resolve(); // do not set room title in subject (even if empty)
      }
      return Promise.resolve().then(function () {
        return office.getSubject().then(function(subject) {
          var title = invite.info.topicTitle;
          if (subject || !title) {
            return Promise.resolve(); // do not change custom subject
          }
          return office.setSubject(title);
        });
      }).catch(function () {
        return Promise.resolve(); // ignore subject errors???
      });
    }, function (err) {
      logger.info('_insertInvite failed, type = ' + type + ', error: ' + JSON.stringify(err));
      // retry to insert text invite on Outlook + Web
      if (office.webAPI && (office.hostName === 'Outlook') && !fallBack) {
        return self._insertInvite(invite, true);
      }
      return Promise.reject(err);
    });
  };

  Model.prototype.canRemoveInvite = function() {
    return !this.joinMode && this._invite && this._invite.isHost && this._invite.webAPI === office.webAPI;
  };

  Model.prototype.createTopic = function(topic) {
    var model;
    var source = topic.source;
    var self = this;
    return this.getModel(source).then(function (r) {
      model = r;
      return office.getParties(self.getPartiesType() === PartiesTypes.member);
    }).then(function(parties) {
      topic.parties = parties;
      return model.createTopic(topic);
    }).then(function(r) {
      self.onTopic.dispatch({ item: r });
      if (!r.invite) {
        throw new Error(i18n.i18n.errorInviteEmpty);
      }
      r = r.invite;
      if (!r.content || (!r.content.html && !r.content.text)) {
        throw new Error(i18n.i18n.errorInviteContentEmpty);
      }
      r.source = source;
      r.type = r.type || source;
      r.isHost = typeof(r.isHost === 'undefined') ? true : r.isHost;
      return self._insertInvite(r);
    }).catch(function(err) {
      self.showError(source, err);
      // return Promise.reject(err); // ???
    });
  };

  Model.prototype.startMeeting = function() {
    var source = this._invite.source;
    var self = this;
    invite.getJoinMeetingUrl().then(function (info) {
      var wnd;
      var message;
      var url = (info || { }).url;
      if (url) {
        wnd = window.open(url, '_blank');
        if (!wnd) {
          var message = i18n.i18n.notificationMeetingNotJoined + ': ' + i18n.i18n.errorPopupBlocked;
        }
      } else {
        message = i18n.i18n.notificationMeetingNotJoined + ': ' + i18n.i18n.notificationNoMeetingLink;
      }
      if (message) {
        self.showError(source, message);
      }
    });
  };

  Model.prototype.compare = function(a, b) {
    if (!a.source || !b.source) {
      return 0;
    }
    if (a.source === b.source) {
      if (a.error && b.error) {
        return 0;
      } else if (a.error) {
        return -1;
      } else if (b.error) {
        return 1;
      } else { // no errors
        var model = this._getModel(a.source);
        if (model) {
          var res = model.compare(a, b);
          if (res !== 0) {
            return res;
          }
        }
      }
    } else {
      var aidx = this.cfgSources.indexOf(a.source);
      var bidx = this.cfgSources.indexOf(b.source);
      if (aidx !== bidx) {
        return aidx < bidx ? -1 : 1;
      }
    }
    return 0;
  };

  Model.prototype.formatMessage = function (message, info) {
    Object.getOwnPropertyNames(info).forEach(function (name) {
      message = message.replace('$' + name, info[name]);
    });
    return message;
  }

  module.exports = new Model();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise   = __webpack_require__(0);

  var invite    = __webpack_require__(18);

  var SourceModel = __webpack_require__(63);
  var States = __webpack_require__(20);

  /** @constructor */
  function Model() {
    this.source = 'test';
    this.$super();
    this.items = { 't0': { id: 't0', source: this.source, title: 'Test 0', members: [] } };
  }

  Model.prototype.init = function(opt) {
    return Promise.resolve();
  };
  
  Model.prototype.login = function(opt) {
    var self = this;
    if (opt.noui) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          // reject({ error: { canceled: true } });
          reject({ error: { login: true } });
        }, 1000);
      });
    }
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 3000);
    });
  };

  Model.prototype.pollTopics = function() {
    var self = this;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        setTimeout(function () {
          var n = Object.getOwnPropertyNames(self.items).length;
          var item = { id: 't' + n, source: self.source, title: 'Test ' + n, members: [] };
          self.items[item.id] = item;
          self.onTopic.dispatch({ item: item });
        }, 1000);
        resolve();
      }, 3000);
    });
  };

  Model.prototype.getTopics = function() {
    var res = { items: [] };
    Object.getOwnPropertyNames(this.items).forEach(function (id) {
      res.items.push(this.items[id]);
    }, this);
    return res;
  };
  
  Model.prototype.checkInvite = function() {
    var self = this;
    return invite.getMeetingInfo({ location: true, body: true }).then(function (r) {
      return new Promise(function (resolve, reject) {
        var ids = Object.getOwnPropertyNames(self.items);
        var body = r[1] || '';
        var invite;
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var idx = body.indexOf(self.items[id].title);
          if (idx !== -1) {
            invite = { inviteId: id };
            break;
          }
        }
        setTimeout(function () {
          resolve(invite);
        }, 3000);
      });
    });
  };

  Model.prototype.createInvite = function(invite) {
    // return Promise.reject(new Error('Not implemented'));
    invite.content = { html: '<html><body>' + this.items[invite.id].title + '</body></html>' };
    invite.location = 'Location: ' + invite.id;
    return Promise.resolve(invite);
  };

  Model.prototype.getTopic = function(id) {
    return this.items[id];
  };

  module.exports = SourceModel.extend(Model);  
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Log          = __webpack_require__(3);

  var office       = __webpack_require__(12);

  var logger = Log.createLogger('FORMAT');

  var SV_MARKER = '================================================================';
  var SV_WRAPPER = '~' + SV_MARKER;

  function Format() {
  }

  Format.prototype.formatTextContent = function (id, content) {
    var lines = content.split('\n');
    lines = lines.map(function (line) {
      if (line.indexOf('http') === 0) {
        line = '<a href="' + line + '">' + line + '</a>';
      }
      return line ? '<div>' + line + '</div>' : '<div>&nbsp;</div>';
    });
    return lines.join('');
  };

  Format.prototype._markInviteInfo = function (inviteInfo) {
    return '<p>' + SV_MARKER + '</p>' + inviteInfo  + '<p>' + SV_MARKER + '</p>';
  };

  Format.prototype._wrapInviteInfo = function (source, inviteInfo) {
    var labelBegin = SV_WRAPPER + '<a name="EquinoxMeetingBegin_' + source + '"></a></p></td></tr>';
    var labelEnd =   SV_WRAPPER + '<a name="EquinoxMeetingEnd_'   + source + '"></a></p></td></tr>';
    var wrapPrefix = '';
    wrapPrefix += '<p>&nbsp;</p><p>';
    wrapPrefix += '<table border=0 cellspacing=0 cellpadding=0 width="100%" style="width:100.0%;border-collapse:collapse;background: #f2f4f6;">';
    wrapPrefix += '<tr style="height:0.05in"><td><p style="font-size:0pt;color:#f2f4f6;">' + labelBegin;
    wrapPrefix += '<tr><td width="100%" valign=top style="width:100.0%;padding:0 1in 0 1in;">';

    var wrapSuffix = '';
    wrapSuffix += '</td></tr>';
    wrapSuffix += '<tr style="height:0.05in"><td><p style="font-size:0pt;color:#f2f4f6;">' + labelEnd;
    wrapSuffix += '</table></p>';
    
/*    
    var imgUri = location.protocol + '//' + location.hostname + location.pathname;
    var re = /[^\/]*\/[^\.\/]*\.html/ig;
    imgUri = imgUri.replace(re, '');
    imgUri = imgUri.replace('https://manage2.', 'https://manage1.');

    var bannerUri = imgUri + 'img/banner.jpg';
    var logoUri = imgUri + 'img/logo2.png';

    var banner = '<tr><td style=\'text-align:center;\'><img src=\'' + bannerUri + '\' style=\'width:100%;\'></td></tr>';
    var logotype = '<tr><td style=\'text-align:right;\'><img src=\'' + logoUri + '\'/></td></tr>';
    if (room.type !== 'equinox') {
      banner = '';
      logotype = '';
    }

    var wrapPrefix = '<p align=\'center\' style=\'text-align:center;\'>';
    wrapPrefix += '<table cellspacing=\'0\' cellpadding=\'0\' style=\'width:495pt; border-collapse:collapse; border: solid 1px #cc0000;\' summary=\'equinoxMarkup\'><tbody>';
    wrapPrefix += banner + '<tr><td style=\'padding:10pt\'>';

    var wrapSuffix = '</td></tr>' + logotype + '</tbody></table></p>';
*/
    return wrapPrefix + inviteInfo + wrapSuffix;
  };

  Format.prototype._isOutlook16Plus = function () {
    if (!office.webAPI && office.version) {
      var parts = office.version.split('.');
      var major = parseInt(parts[0]);
      return major >= 16;
    }
    return false;
  };

  Format.prototype.formatInviteInfo = function (source, inviteInfo, markInvite) {
    var wrapInvite = !markInvite;//this._isOutlook16Plus();
    if (wrapInvite) {
      inviteInfo = this._wrapInviteInfo(source, inviteInfo);
    } else {
      inviteInfo = this._markInviteInfo(inviteInfo);
    }

    var prefix = '<html><head><meta charset=\'UTF-8\'/></head><body>';
    var suffix = '</body></html>';
    return prefix + inviteInfo + suffix;
  };

  Format.prototype.formatInviteText = function (inviteInfo) {
    return '\n' + SV_MARKER + '\n' + inviteInfo  + '\n' + SV_MARKER + '\n';
  }

  Format.prototype._clearInviteInfoOpenXML = function (source, body) {
    var re = /<[^\:]*\:tbl>.*<[^\:]*\:tblDescription [^\:]*\:val\=\"equinoxMarkup\"\/>.*<\/[^\:]*\:tbl>/i;
    var r, m = re.exec(body);
    if (m) {
      r = body.replace(re, '');
      return r;
    }

    var labelBegin = '\\"' + 'EquinoxMeetingBegin_' + source + '\\"';
    var labelEnd =   '\\"' + 'EquinoxMeetingEnd_'   + source + '\\"';
    re = new RegExp('<[^\\/\\:]*?\\:tbl>[^_]*?<[^\\:]*?\\:bookmarkStart[^>]*?name=' + labelBegin + '.*?<[^\\:]*?\\:bookmarkStart[^>]*?name=' + labelEnd + '.*?<\\/[^\\:]*?\\:tbl>', 'ig');
    m = re.exec(body);
    if (m) {
      r = body.replace(re, '');
      logger.info('clearInviteInfoOpenXML OK1, body: ' + r.length);
      return r;
    }

    labelBegin = 'EquinoxMeetingBegin_' + source;
    labelEnd =   'EquinoxMeetingEnd_'   + source;
    // TODO: use more exact regexp
    re = /<\w\:p[^~]*?~.*?bookmarkStart.*?EquinoxMeetingBegin_.*?bookmarkStart.*?EquinoxMeetingEnd_.*?<\/[^\:]*?\:p>/ig;
    body = body.replace(/[\r\n]/g, '');
    for (; !!(m = re.exec(body)); ) {
      if (m[0].indexOf(labelBegin) !== -1 && m[0].indexOf(labelBegin) !== -1) {
        r = body.replace(m[0], '');
        logger.info('clearInviteInfoOpenXML OK2, body: ' + r.length);
        return r;
      }
    }

    if (!DOMParser || !XMLSerializer) {
      return;
    }
    var parser = new DOMParser();
    var xdoc = parser.parseFromString(body, 'text/xml');

/*
    var xstart, xend;

    var xitems = xdoc.getElementsByTagNameNS('*', 'bookmarkStart');
    for (var i = 0; i < xitems.length; i++) {
      var xitem = xitems[i];
      var prefix = xitem.prefix ? xitem.prefix + ':' : '';
      var xname = xitem.getAttribute(prefix + 'name');
      if ((xname === 'EquinoxMeetingBegin') && !xstart) {
        xstart = xitem;
      }
      if ((xname === 'EquinoxMeetingEnd') && !xend) {
        xend = xitem;
      }
    }

    if (xstart && xend) {
      for (var xsp = xstart; xsp && (xsp !== xdoc.documentElement); xsp = xsp.parentNode) {
        for (var xep = xend; xep && (xep !== xdoc.documentElement); xep = xep.parentNode) {
          if (xep === xsp) {
            xep.parentNode.removeChild(xep);
            var serializer = new XMLSerializer();
            var xres = serializer.serializeToString(xdoc);

            debugger;
            xres = '<?xml version="1.0" standalone="yes"?>\n<?mso-application progid="Word.Document"?>\n' + xres;

            return xres;
          }
        }
      }
    }
*/

    var xitems = xdoc.getElementsByTagNameNS('*', 'p');
    var from = -1, to = -1;
    for (var i = xitems.length - 1; i >= 0; i--) {
      var xitem = xitems[i];
      var text = xitem.textContent;
      if (to === -1) {
        if (text && text.indexOf(SV_MARKER.substring(0, 32)) !== -1) {
          to = i; // end marker paragraph
        }
      } else {
        if (text && text.indexOf(SV_MARKER.substring(0, 32)) !== -1) {
          from = i; // start marker paragraph
          break;
        }
      }
    }

    if ((to !== -1) && (from !== -1)) {
      body = body.replace(/[\r\n]/g, '');
      // re = /(.*?)(<[^\:]*?\:p\s.*?>.*?<\/[^\:]*?\:p>)/g;
      re = /(.*?)(<[^\:]*?\:p(\s[^<]*?\/>|\s.*?>.*?<\/[^\:]*?\:p>))/g;
      i = 0;
      var r = '';
      while ((m = re.exec(body))) {
        var prefix = m[1]; // add start of the body (before first paragraph)
        var para = (i < from || i > to) ? m[2] : ''; // exclude markers paragraphs and paragraphs (<w:p>...</w:p> between them
        r += prefix + para;
        if (i === to) {
          var suffix = body.substring(m.index + m[0].length);
          r += suffix;  // add all subsequent paragraphs and end of body
          break;
        }
        i += 1;
      }
      logger.info('clearInviteInfoOpenXML OK3, body: ' + r.length);
      return r;
    }
    return;
  };

  var extractMeetingInfoStatic; // TODO!!!

  Format.prototype._clearInviteInfoHTML = function (source, body) {
    // first try to remove invite from document
    if (extractMeetingInfoStatic) {
      var parser = new DOMParser();
      var xdoc = parser.parseFromString(body, 'text/html');
      var xitems = xdoc.getElementsByTagNameNS('*', 'table');
      for (var i = 0; i < xitems.length; i++) {

        var xitem = xitems[i];
        var xhtml = xitem.innerHTML;

        var reBegin = /<a[^>]*EquinoxMeetingBegin/ig;
        var reEnd = /<a[^>]*EquinoxMeetingEnd/ig;
        if (reBegin.exec(xhtml) && reEnd.exec(xhtml)) {
          xitem.parentNode.removeChild(xitem);
          return xdoc.documentElement.innerHTML;
        }

        var innerText = xitem.innerText;
        var info = extractMeetingInfoStatic({ body: innerText});
        if (info.url && info.isHost) {
          xitem.parentNode.removeChild(xitem);
          return xdoc.documentElement.innerHTML;
        }
      }
    }
    // then try to remove invite via regex
    // var re = /<table[^>]*?summary=\"equinoxMarkup\".*?<\/table>/i;
    var labelBegin = 'EquinoxMeetingBegin_' + source;
    var labelEnd =   'EquinoxMeetingEnd_'   + source;
    var re = /<table.*?EquinoxMeetingBegin_.*?EquinoxMeetingEnd_.*?<\/table>/ig;
    body = body.replace(/[\r\n]/g, '');
    for (var m; !!(m = re.exec(body)); ) {
      if (m[0].indexOf(labelBegin) !== -1 && m[0].indexOf(labelBegin) !== -1) {
        var r = body.replace(m[0], '');
        logger.info('clearInviteInfoHTML OK, body: ' + r.length);
        return r;
      }
    }
    return;
  };

  var re_sv_marker_rtf  = new RegExp('\\{[^\\{]*?={50,}[^\\}]*?\\}' + '.*?' + '\\{[^\\{]*?={50,}[^\\}]*?\\}');
  var re_sv_marker_html = new RegExp('<[^>]*?>[^<]*?={32,}.*?<[^>]*?>' + '.*?' + '<[^>]*?>.*?={32,}.*?<[^>]*?>');

  Format.prototype._clearInviteInfoDumb = function (body, type) {
    var re_sv_marker = type === 'html' ? re_sv_marker_html : re_sv_marker_rtf;
    body = body.replace(/[\r\n]/g, '');
    var m = re_sv_marker.exec(body);
    if (m) {
      var r = body.replace(m[0], '');
      logger.info('clearInviteInfoDumb OK, body: ' + r.length);
      return r;
    }
  };

  var re_sv_marker_text = /~?={50,}[\s\S]*?={50,}/im;

  Format.prototype._clearInviteInfoText = function (body) {
    var m = re_sv_marker_text.exec(body);
    if (m) {
      var r = body.replace(m[0], '');
      logger.info('clearInviteInfoText OK, body: ' + r.length);
      return r;
    }
  };

  Format.prototype.clearInviteInfo = function (source, body, type) {
    var isOpenXML = body.indexOf('<?xml') === 0;
    logger.info('clearInviteInfo ' + source + ', webAPI: ' + office.webAPI + ', body: ' + body.length + ', type: ' + type + ', Open XML: ' + isOpenXML);
    var res;
    if (type === 'text') {
      res = this._clearInviteInfoText(body);
    } else {
      if (!office.webAPI && isOpenXML) {
        res = this._clearInviteInfoOpenXML(source, body);
      } else {
        res = this._clearInviteInfoHTML(source, body);
      }
      if (!res) {
        res = this._clearInviteInfoDumb(body, type);
      }
    }
    if (!res) {
      logger.info('clearInviteInfo failed: invite not found');
    }
    return res;
  };
  
  module.exports = new Format();
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);
//# sourceMappingURL=../map/app.js.map