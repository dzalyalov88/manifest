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
/******/ 	return __webpack_require__(__webpack_require__.s = 592);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
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

  function getParam(key) {
    var value;
    if (window && window.location) {
      var search = location.search;
      if (search.length > 0) {
        search = search.substring(1);
        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
          var arg = args[i].split('=');
          if (arg.length === 2 && arg[0] === key) {
            value = arg[1];
            break;
          }
        }
      }
    }
    return value;
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
    mergeConfigs: mergeConfigs,
    getHash: getHash,
    getParam: getParam
  };

  module.exports = utils;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Utils = __webpack_require__(15);

    var errorkey = 'auth-error';

    function getStorage() {
      var storage = window.localStorage;

      if (window.opener && window.opener.localStorage) {
        storage = window.opener.localStorage;
      }

      return storage;
    }

    function getAppPath() {
      var storage = getStorage();
      var appPath = storage.getItem('myAppPath');
      storage.removeItem('myAppPath');
      return appPath;
    }

    function applyAuthInfo() {
      var storage = getStorage();

      try {
        var state = Utils.extractUrlInfo(location.hash, {})['state'];
        var hash = location.hash;

        if (state && hash) {
          storage.setItem(state, hash);
          storage.setItem('myAppHash', hash);
        } else if (!state) {
          storage.setItem(errorkey, 'state undefined');
        } else if (!hash) {
          storage.setItem(errorkey, 'auth info undefined');
        }
      } catch (e) {
        storage.setItem(errorkey, e.message);
      }
    }

    function completeAuth() {
      var appPath = getAppPath();

      if (!appPath) {
        window.close(); // so we close the window with a delay (if validator didn't close it)
      } else {
        var app1Path = appPath.replace(/(.*)\.html$/i, '$11.html'); // replace app.html with app1.html

        window.open(app1Path, '_self');
      }
    }

    function processAuth() {
      applyAuthInfo();
      setTimeout(completeAuth, 1000);
    }

    setTimeout(processAuth, 10);
    module.exports = {};
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

/******/ });
//# sourceMappingURL=../map/auth.js.map