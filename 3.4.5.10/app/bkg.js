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
/******/ 	return __webpack_require__(__webpack_require__.s = 89);
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
/* 5 */,
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
/* 9 */,
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
/* 17 */,
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
/* 20 */,
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
/* 32 */,
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
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var loader = __webpack_require__(13);
  var Promise = __webpack_require__(0);
  var Log = __webpack_require__(3);

  var office = __webpack_require__(12);
  var invite = __webpack_require__(18); // define extractMeetingInfoNative

  var i18n = __webpack_require__(6);

  var logger = Log.createLogger('BKG');

  var joinKey = 'joinStatus';
  var joinIcon = 'join16';
  var maxLength = 128;
  var ellipsis = '...';

  function truncateMessage(message) {
    // outlook-web throws error if message length exceeds 150 symbols
    if (message && message.length > maxLength) {
      return message.substr(0, maxLength - ellipsis.length) + ellipsis;
    }
    return message;
  }

  function notifyInfo(message) {
    logger.info('notifyInfo: ' + message);
    if (!message) {
      return;
    }
    office.notifyInfo(joinKey, joinIcon, truncateMessage(message));
  }

  function notifyError(error) {
    var message = error ?  i18n.i18n.notificationMeetingNotJoined + ': ' + error : i18n.i18n.notificationMeetingNotJoined;
    logger.info('notifyError: ' + message);
    office.notifyError(joinKey, truncateMessage(message));
  }

  function completeEvent(event, res) {
    if (res && res.error) {
      notifyError(res.error);
    }
    if (event) {
      event.completed();
    }
  }

  function openWindow(url) {
    var popup =  url.indexOf('http') === 0; // Popup required: rooms: no, spaces: yes
    var target = popup ? '_blank' : '_self';

    // ACMACOS-10782
    if (navigator.vendor.indexOf('Apple') === 0) {
      // ACMACOS-10963
      if (office.hostName === 'Outlook') {
        target = '_blank';
      }
    }

    logger.info('openWindow ' + url + ', webAPI: ' + office.webAPI + ', popup: ' + popup + ', target: ' + target);

    var wnd = window.open(url, target);
    logger.info('opened ' + url + ', wnd: ' + !!wnd);
    if (wnd || !popup || !office.webAPI) {
      return Promise.resolve();
    } else {
      // ACMACOS-10964
      if ((navigator.vendor.indexOf('Apple') === 0) && (office.hostName === 'Outlook')) {
        return Promise.resolve();
      }
    }

    if (office.hostName !== 'Outlook') {
      notifyError(i18n.i18n.errorPopupBlocked);
      return Promise.resolve();
    }

    // supress in case of web mode for desktop client
    // we could re-enable this later to show popup
    // enable banner when popups are blocked
    notifyError(i18n.i18n.errorPopupBlocked);
    return Promise.resolve();

    var apppath = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
    url = apppath.replace(/(.*)\/.*\.html$/i, '$1/join.html') + '?' + url;
    url += '&languageId=' + i18n.languageId;
    localStorage.setItem('__track_join__', 1);

    // handle join window in case Outlook + Web app (if join window is allowed (see supress above))
    return office.displayDialog(url, { width: 30, height: 10, requireHTTPS: true }).then(function (r) {
      if (!r.value) {
        notifyError(i18n.i18n.errorPopupBlocked);
        return Promise.resolve();
      }

      wnd = r.value;
      return new Promise(function (resolve, reject) {
        (function poll() {
          if (!wnd) {
            return;
          }
          if (localStorage.getItem('__track_join__')) {
            return setTimeout(poll, 100);
          }
          
          wnd.close();
          wnd = null;

          resolve();
        })();

        wnd.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, function (event) {
          wnd = null;
          
          resolve();
        });
      });
    }, function (err) {
      logger.info('openWindow displayDialog err: ' + JSON.stringify(err));
      notifyError(i18n.i18n.errorPopupBlocked);
    });
  }

  function joinMeeting1(event) {
    var complete = completeEvent.bind(null, event);
    invite.getJoinMeetingUrl().then(function (info) {
      var url = (info || { }).url;
      if (!url) {
        complete({ error: i18n.i18n.notificationNoMeetingLink });
        return;
      }
      openWindow(url).then(complete, complete);
    });
  }

  var _loaded = false;
  loader.wait(function () {
    if (_loaded) {
      return;
    }
    _loaded = true;
    window.joinMeeting = joinMeeting1;
    if (window.joinMeetingEvent) {
      window.joinMeeting(window.joinMeetingEvent);
      delete window.joinMeetingEvent;
    }
  });

  var cache = window.applicationCache;
  var loaded = 0;
  cache.addEventListener('checking', function () {
    console.info('bkg:appcache:checking');
  });
  cache.addEventListener('noupdate', function () {
    console.info('bkg:appcache:noupdate');
  });
  cache.addEventListener('downloading', function () {
    console.info('bkg:appcache:downloading');
  });
  cache.addEventListener('progress', function () {
    // console.info('bkg:appcache:progress');
    loaded += 1;
  });
  cache.addEventListener('cached', function () {
    console.info('bkg:appcache:cached:' + loaded);
  });
  cache.addEventListener('updateready', function () {
    console.info('bkg:appcache:updateready');
    cache.swapCache();
    location.reload();
  });
  cache.addEventListener('obsolete', function () {
    console.info('bkg:appcache:obsolete');
  });
  cache.addEventListener('error', function (err) {
    err = err || { };
    console.error('bkg:appcache:error:' + JSON.stringify({ reason: err.reason, url: err.url, status: err.status, message: err.message }));
  });

  module.exports = { };
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);
//# sourceMappingURL=../map/bkg.js.map