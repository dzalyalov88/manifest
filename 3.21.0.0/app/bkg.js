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
/******/ 	return __webpack_require__(__webpack_require__.s = 593);
/******/ })
/************************************************************************/
/******/ ({

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(80), __webpack_require__(98), __webpack_require__(81)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_regenerator, _typeof2, _asyncToGenerator2) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(55);

  _regenerator = _interopRequireDefault(_regenerator);
  _typeof2 = _interopRequireDefault(_typeof2);
  _asyncToGenerator2 = _interopRequireDefault(_asyncToGenerator2);
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var axios = __webpack_require__(199);

    var OAuthService = __webpack_require__(216)["default"];

    var office = __webpack_require__(35);

    var Promise = __webpack_require__(6);

    var Storage = __webpack_require__(49);

    var Log = __webpack_require__(18);

    var Utils = __webpack_require__(15);

    var RoomsSettings = __webpack_require__(236);

    var RoomsAPI = __webpack_require__(237);

    var TOM = __webpack_require__(238);

    var Templates = __webpack_require__(239);

    var logger = Log.createLogger('ROOMS');

    function Rooms() {
      this.rooms = {};
    }

    Rooms.prototype.setConfig = function (config, checkOffice) {
      logger.info('setConfig, refresh: ' + config.forceRefresh);
      this.config = config;
      this.config.cacheKey = 'rooms.v2';

      var portalInfo = this._extractPortalInfo(this.config.portalUri);

      this.config.serverBase = portalInfo.serverBase;
      this.config.tenantId = portalInfo.tenantId;
      this.config.conferenceRoomName = 'Default';

      if (this.config.conferenceType === 'aac') {
        this.config.conferenceRoomName = this.i18n.aacRoomName || 'Default AAC';
        this.config.locationFormatConference = '$(bridgeNumber),,$(room), $(conferenceJoinUrl)';
      } else if (this.config.conferenceType === 'ipo') {
        this.config.conferenceRoomName = this.i18n.ipoRoomName || 'Default IP Office';
        this.config.locationFormatConference = '$(bridgeNumber),,$(room), $(conferenceJoinUrl)';
      }

      if (!this.config.user && checkOffice) {
        this.config.user = office.getEmailAddress();
      }

      this.config.locationFormatEquinox = '$(portalJoinUrl)$(room)$(pinE164)';

      if (this.config.forceRefresh) {
        logger.info('forceRefresh is true so ups token will be clear');

        this._updateTokenInfo(null);

        this._updateCachedRooms(null);

        this.rooms = {};
        this._infoUser = null;
        this._infoGuest = null;
      }

      this.roomsAPI = new RoomsAPI(config.serverBase);
    };

    Rooms.prototype.configure = function (configuration, languageId, i18n, update) {
      if (this.config && !update) {
        return Promise.resolve(this.config);
      }

      logger.info('configure, languageId: ' + languageId);
      this.i18n = i18n || this.i18n || {};
      var self = this;
      var config_params = [RoomsSettings.getAPIConfig(configuration, languageId, update), office.checkOffice()];
      return Promise.all(config_params).then(function (params) {
        var config = params[0];
        var checkOffice = params[1].checkOffice;

        if (!config.forceRefresh && !Storage.getItem('accessToken')) {
          // to do only if sso3
          logger.info('ask for credentials because accesToken is null');
          config.forceRefresh = true;
        }

        self.setConfig(config, checkOffice);
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
      port = port === '443' ? '' : ':' + port;
      var tenantId = m[5] || 'default';
      return {
        serverBase: proto + server + port,
        tenantId: tenantId
      };
    };

    Rooms.prototype._fetchTokenInfo = function () {
      var _JSON$parse;

      //var key = 'token:' + this.config.settings.unifiedPortalUsername;
      var key = 'token:' + 'UPTOKEN';
      var stokenInfo = Storage.getItem(key);
      logger.cred('token, use cached token ' + key + ':' + stokenInfo, stokenInfo && ((_JSON$parse = JSON.parse(stokenInfo)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.passwordHash));
      var tokenInfo = stokenInfo ? this._safeJSONParse(stokenInfo) : null;
      return tokenInfo; // comment this to skip token check & refresh 

      var dtn = Date.now();

      if (tokenInfo && (tokenInfo.expires || 0) - dtn < 60 * 1000) {
        var _JSON$parse2;

        logger.cred('token, expired cached token ' + key + ':' + stokenInfo, stokenInfo && ((_JSON$parse2 = JSON.parse(stokenInfo)) === null || _JSON$parse2 === void 0 ? void 0 : _JSON$parse2.passwordHash));
        tokenInfo = null;

        this._updateTokenInfo(null);
      }

      return tokenInfo;
    };

    Rooms.prototype._requestTokenInfoforSSO3 = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var accessToken, refreshToken, info1, info2, tokenInfo, res, params, data, response, res1;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              accessToken = Storage.getItem("accessToken");
              refreshToken = Storage.getItem("refreshToken");
              info1 = Storage.getItem("info1");
              info2 = Storage.getItem("info2");
              tokenInfo = {};
              tokenInfo.token = {};

              if (!(accessToken && info1 && info2)) {
                _context.next = 62;
                break;
              }

              _context.prev = 7;
              logger.info("no upsToken: @@@performing sso3 gettoken");
              accessToken = Storage.getItem("accessToken");
              refreshToken = Storage.getItem("refreshToken");
              info1 = Storage.getItem("info1");
              info2 = Storage.getItem("info2");
              logger.info("stored accessToken " + accessToken);
              logger.info("stored refreshToken " + refreshToken);
              logger.info("stored info1 " + info1);
              logger.info("stored info2 " + info2);
              _context.next = 19;
              return axios.post(info1, null, {
                headers: {
                  Authorization: "Bearer ".concat(accessToken),
                  "Content-type": info2
                }
              });

            case 19:
              res = _context.sent;
              tokenInfo = {
                token: res.data.token,
                expires: new Date(res.expirationTime).valueOf(),
                passwordHash: res.data.passwordHash
              };
              logger.info("sso3-flow tokeninfo response from axios on asking a new UPtoken for SSO3: ", Log.getInfo(tokenInfo.token));
              _context.next = 60;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](7);
              logger.error("so3-flow error response from axios on asking a new UPtoken for SSO3: ", Log.getErrInfo(_context.t0));

              if (!(_context.t0.response.status == 401 || _context.t0.response.status == 403)) {
                _context.next = 60;
                break;
              }

              // to improve
              logger.info("so3-flow accesstoken not valid anymore for SSO3 3: ask for new accesstoken using refreshtoken");
              params = {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: "UnifiedPortal"
              };
              data = Object.keys(params).map(function (key) {
                return "".concat(key, "=").concat(encodeURIComponent(params[key]));
              }).join("&");
              logger.info("data params to get new access token for SSO3 3 from refreshToken", Log.getInfo(data));
              _context.prev = 32;
              _context.next = 35;
              return axios.post("https://alphablue-aadscluster.avaya.com:8443/acs/resources/token", data, {
                headers: {
                  "content-type": "application/x-www-form-urlencoded"
                }
              });

            case 35:
              response = _context.sent;
              logger.info("so3-flow response for new access token for SSO3 3 from refreshToken", Log.getInfo(response));
              accessToken = response.data.access_token;
              refreshToken = response.data.refresh_token;
              Storage.setItem("accessToken", accessToken);
              Storage.setItem("refreshToken", refreshToken);
              logger.info("so3-flow a new acces token has been saved", Log.getInfo(Storage.getItem("accessToken")));
              logger.info("so3-flow a new refreshToken has been saved", Log.getInfo(Storage.getItem("refreshToken"))); // check if refreshtoken exists

              _context.next = 48;
              break;

            case 45:
              _context.prev = 45;
              _context.t1 = _context["catch"](32);
              logger.info("so3-flow error response for new access token for SSO3 3 from refreshToken", Log.getInfo(_context.t1));

            case 48:
              _context.prev = 48;
              _context.next = 51;
              return axios.post(info1, null, {
                headers: {
                  Authorization: "Bearer ".concat(accessToken),
                  "Content-type": info2
                }
              });

            case 51:
              res1 = _context.sent;
              logger.info("so3-flow response for SSO3 on asking UPtoken using a new access token: ", Log.getInfo(res1));
              tokenInfo = {
                token: res1.data.token,
                expires: new Date(res1.data.expirationTime).valueOf(),
                passwordHash: res1.data.passwordHash
              };
              logger.info("so3-flow tokeninfo response from axios on asking a new UPtoken using a new access token: ", Log.getInfo(tokenInfo.token));
              _context.next = 60;
              break;

            case 57:
              _context.prev = 57;
              _context.t2 = _context["catch"](48);
              logger.info("so3-flow response for SSO3 on asking UPtoken using a new access token:", Log.getInfo(_context.t2));

            case 60:
              _context.next = 63;
              break;

            case 62:
              logger.info("so3-flow no saved accessToken, force login");

            case 63:
              return _context.abrupt("return", tokenInfo);

            case 64:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 24], [32, 45], [48, 57]]);
    }));

    Rooms.prototype._updateTokenInfo = function (info) {
      //var key = 'token:' + this.config.settings.unifiedPortalUsername;
      var key = 'token:' + 'UPTOKEN';

      if (!info) {
        if (Storage.getItem(key)) {
          logger.info('token, remove cached token ' + key);
          Storage.setItem(key, '');
        }
      } else {
        var stokenInfo = JSON.stringify(info);

        if (Storage.getItem(key) !== stokenInfo) {
          var _JSON$parse3;

          Storage.setItem(key, stokenInfo);
          logger.cred('token, update cached token ' + key + ':' + stokenInfo, stokenInfo && ((_JSON$parse3 = JSON.parse(stokenInfo)) === null || _JSON$parse3 === void 0 ? void 0 : _JSON$parse3.passwordHash));
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
          return self._infoUser = r;
        }

        return self._infoGuest = r;
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

    Rooms.prototype.loginOauth = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(portalUrl, asyncui) {
        var info, oauthService, result, accessToken, refreshToken, res, configuration;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                info = this._infoGuest;
                oauthService = new OAuthService({
                  authorizationUri: info.oauth2AuthenticationUrl.split('?')[0],
                  accessTokenUri: info.oauthCodeToTokenExchangeUrl,
                  oauth2ClientId: info.oauth2ClientId,
                  asyncui: asyncui
                });
                _context2.next = 4;
                return oauthService.open();

              case 4:
                result = _context2.sent;
                accessToken = result[0];
                refreshToken = result[1];
                _context2.next = 9;
                return axios.post(info.loginInfo.href, null, {
                  headers: {
                    'Authorization': "Bearer ".concat(accessToken),
                    'Content-type': info.loginInfo.requestTypes[1]
                  }
                });

              case 9:
                res = _context2.sent;
                Storage.setItem('accessToken', accessToken);
                Storage.setItem('refreshToken', refreshToken);
                Storage.setItem('info1', info.loginInfo.href);
                Storage.setItem('info2', info.loginInfo.requestTypes[1]);
                this.logout();
                configuration = {
                  CONFERENCE_PORTAL_URI: portalUrl,
                  UNIFIED_PORTAL_USERNAME: res.data.loginId,
                  UNIFIEDPORTALENABLED: 1,
                  UNIFIED_PORTAL_SSO: 3,
                  // we must save information about OAuth login
                  manual: true
                };
                _context2.next = 18;
                return this.configure(JSON.stringify(configuration));

              case 18:
                logger.info('loginOauth: res.data.token: ', Log.getInfo(res.data.token));

                this._updateTokenInfo({
                  token: res.data.token
                });

                return _context2.abrupt("return", configuration);

              case 21:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    Rooms.prototype._login = function (args) {
      var info = this._infoGuest || {};
      var dfd;
      var self = this;

      if (info.iwaEnabled) {
        logger.info('login: API loginIWA');
        dfd = self.roomsAPI.loginIWA(args);
      } else {
        dfd = Promise.reject();
      }

      return dfd.then(function (r) {
        return r;
      }, function () {
        logger.info('login: API login');
        var needV2 = (info.loginInfo.requestTypes || []).reduce(function (r, item) {
          if (item === 'application/vnd.avaya.portal.authentication.login.v2+json') {
            return true;
          }

          return r;
        }, false);

        if (needV2) {
          // ACW-20227
          var auth = unescape(encodeURIComponent(args.userId + ':' + args.password));
          args.credentials = btoa(auth);
          return self.roomsAPI.loginV2(args);
        } else {
          return self.roomsAPI.login(args);
        }
      });
    };

    Rooms.prototype._getToken = function () {
      logger.info("calling _getToken");
      var tokenInfo;
      var self = this; // always start with resources call

      return this.resources({}).then(function () {
        tokenInfo = self._fetchTokenInfo(); // allows to skip token check & refresh (see above)

        if (tokenInfo) {
          var args = {
            tenantId: self.config.tenantId,
            token: tokenInfo.token,
            userId: self.config.settings.unifiedPortalUsername,
            passwordHash: tokenInfo.passwordHash,
            aliasId: self.config.tenantId
          }; // check vaild token or refresh expired one via password hash

          return self.roomsAPI.refreshToken(args).then(function (r) {
            logger.info('getToken: cached token is valid');

            if (tokenInfo.token !== r.token) {
              var _tokenInfo;

              // store refreshed token
              tokenInfo = {
                token: r.token,
                expires: new Date(r.expires).valueOf(),
                passwordHash: r.passwordHash
              };
              logger.cred('getToken: token refresh result: ', Log.getInfo(tokenInfo), (_tokenInfo = tokenInfo) === null || _tokenInfo === void 0 ? void 0 : _tokenInfo.passwordHash);

              self._updateTokenInfo(tokenInfo);
            }

            return Promise.resolve(true); // valid token, no login required
          }, function (e) {
            logger.info('getToken: refresh token error: ', Log.getErrInfo(e));
            return Promise.resolve(false); // invalid token, try login with user credentials
          });
        } else {
          return Promise.resolve(false); // no token info, try login with user credentials
        }
      }).then(function (r) {
        if (r) {
          return Promise.resolve();
        }

        var currentSsoSetting = Storage.getItem("AVAYA_UNIFIED_PORTAL_SSO");

        if (currentSsoSetting == '3') {
          // perform sss03 flow
          return self._requestTokenInfoforSSO3().then(function (r) {
            tokenInfo = {
              token: r.token,
              expires: new Date(r.expires).valueOf(),
              passwordHash: r.passwordHash
            };
            logger.info("so3-flow tokenInfo returned by _requestTokenInfoforSSO3" + Log.getInfo(tokenInfo.token));

            self._updateTokenInfo(tokenInfo);

            return Promise.resolve(tokenInfo);
          });
        } else {
          // perform sso1 flow
          logger.info("no upsToken: @@@performing sso1 gettoken");
          var args = {
            userId: self.config.settings.unifiedPortalUsername,
            password: self.config.password,
            tenantId: self.config.tenantId,
            aliasId: self.config.tenantId
          };
          logger.cred('getToken: login: ' + Log.getInfo(args), args['password']);
          return self._login(args).then(function (r) {
            var _tokenInfo2;

            // store new token
            tokenInfo = {
              token: r.token,
              expires: new Date(r.expires).valueOf(),
              passwordHash: r.passwordHash
            };
            logger.cred('getToken: login result: ', Log.getInfo(tokenInfo), (_tokenInfo2 = tokenInfo) === null || _tokenInfo2 === void 0 ? void 0 : _tokenInfo2.passwordHash);

            self._updateTokenInfo(tokenInfo);
          }, function (e) {
            logger.error('getToken: login error: ', Log.getErrInfo(e));

            self._updateTokenInfo(null);

            return Promise.reject(e, true);
          });
        }

        ;
      }).then(function (r) {
        return self.resources({
          token: tokenInfo.token
        });
      }, function (e, f) {
        if (!f) {
          // just skip already logged errors
          logger.error('getToken: error: ', Log.getErrInfo(e));
        }

        throw e;
      }).then(function () {
        // should never get here without without valid token
        logger.info('returning the tokenInfo in _getToken: ', Log.getInfo(tokenInfo.token));
        return tokenInfo.token;
      });
    };

    Rooms.prototype._fetchFreshToken = function () {
      logger.info('_fetchFreshToken: starting'); //var user = this.config.settings.unifiedPortalUsername;

      var user = 'UPTOKEN';
      var key = 'token:' + user;
      var stokenInfo = Storage.getItem(key);
      logger.info('_fetchFreshToken', Log.getInfo(stokenInfo));
      var tokenInfo = stokenInfo ? this._safeJSONParse(stokenInfo) : null;

      if (!tokenInfo) {
        var _JSON$parse4;

        logger.cred('token, no cached token ' + user + ':' + stokenInfo, stokenInfo && ((_JSON$parse4 = JSON.parse(stokenInfo)) === null || _JSON$parse4 === void 0 ? void 0 : _JSON$parse4.passwordHash));
        return Promise.resolve(null);
      }

      var dtn = Date.now();
      var expires = (tokenInfo.expires || 0) - dtn;

      if (expires >= 60 * 1000) {
        logger.info('token, use cached token ' + user + ' expires in ' + expires);
        return Promise.resolve(tokenInfo);
      }

      logger.info('token, refresh cached token ' + user + ' expires in ' + expires);
      var args = {
        tenantId: this.config.tenantId,
        token: tokenInfo.token,
        userId: this.config.settings.unifiedPortalUsername,
        passwordHash: tokenInfo.passwordHash,
        aliasId: this.config.tenantId
      }; // check vaild token or refresh expired one via password hash

      var self = this;
      return this.roomsAPI.refreshToken(args).then(function (r) {
        var _tokenInfo3;

        // store refreshed token
        tokenInfo = {
          token: r.token,
          expires: new Date(r.expires).valueOf(),
          passwordHash: r.passwordHash
        };
        logger.cred('_fetchFreshToken: refresh token result: ' + Log.getInfo(tokenInfo), (_tokenInfo3 = tokenInfo) === null || _tokenInfo3 === void 0 ? void 0 : _tokenInfo3.passwordHash);

        self._updateTokenInfo(tokenInfo);

        return Promise.resolve(tokenInfo); // valid token, no login required
      }, function (e) {
        logger.info('_fetchFreshToken: refresh token error: ', Log.getErrInfo(e));
        return Promise.reject(e);
      });
    };

    Rooms.prototype._getStableToken = function () {
      logger.info("_getStableToken starting");
      var tokenInfo;
      var self = this; // always start with resources call

      return this.resources({}).then(function () {
        return self._fetchFreshToken().then(function (r) {
          tokenInfo = r; // tokenInfo or null

          return Promise.resolve();
        }, function (e) {
          if (e.error.fetch) {
            return Promise.reject(e); // do not try login after fetch error?
          }

          self._updateTokenInfo(null); // clear token after refresh error?


          return Promise.resolve(); // no tokenInfo
        });
      }).then(function (r) {
        if (tokenInfo) {
          logger.info("UpToken available, no need to get a new one for _getStableToken");
          return Promise.resolve();
        }

        if (!self.config.password) {
          return Promise.reject({
            error: {
              nopassword: true
            }
          });
        }

        var currentSsoSetting = Storage.getItem("AVAYA_UNIFIED_PORTAL_SSO");

        if (currentSsoSetting == '3') {
          // perform ss03 flow
          return self._requestTokenInfoforSSO3().then(function (r) {
            tokenInfo = {
              token: r.token,
              expires: new Date(r.expires).valueOf(),
              passwordHash: r.passwordHash
            };
            logger.info("so3-flow tokenInfo returned by _requestTokenInfoforSSO3" + Log.getInfo(tokenInfo.token));

            self._updateTokenInfo(tokenInfo);

            return Promise.resolve(tokenInfo);
          });
        } else {
          // perform ss01 flow
          return Utils.getHash(self.config.password).then(function (r) {
            var passwordHash = r;
            var badpasswordKey = 'badpassword' + ':' + self.config.portalUri + ':' + self.config.settings.unifiedPortalUsername;

            if (Storage.getItem(badpasswordKey) === passwordHash) {
              return Promise.reject({
                error: {
                  badpassword: true
                }
              });
            }

            Storage.setItem(badpasswordKey, '');
            var args = {
              userId: self.config.settings.unifiedPortalUsername,
              password: self.config.password,
              tenantId: self.config.tenantId,
              aliasId: self.config.tenantId
            };
            logger.cred('getStableToken: login: ' + Log.getInfo(args), args['password']);
            return self._login(args).then(function (r) {
              var _tokenInfo4;

              // store new token
              tokenInfo = {
                token: r.token,
                expires: new Date(r.expires).valueOf(),
                passwordHash: r.passwordHash
              };
              logger.cred('getStableToken: login result: ', Log.getInfo(tokenInfo), (_tokenInfo4 = tokenInfo) === null || _tokenInfo4 === void 0 ? void 0 : _tokenInfo4.passwordHash);

              self._updateTokenInfo(tokenInfo);
            }, function (e) {
              logger.error('getStableToken: login error: ', Log.getErrInfo(e));

              if (e.error && e.error.httpStatus === 401) {
                // e.error.httpStatus === 400 => nopassword?
                e = {
                  error: {
                    badpassword: true
                  }
                };
                logger.info('badpassword', self.config.settings.unifiedPortalUsername + ': ' + 'type of passwordHash' + (0, _typeof2["default"])(passwordHash));
                Storage.setItem(badpasswordKey, passwordHash);
              }

              self._updateTokenInfo(null);

              return Promise.reject(e, true);
            });
          });
        }

        ;
      }).then(function (r) {
        return self.resources({
          token: tokenInfo.token
        });
      }, function (e, f) {
        if (!f) {
          // just skip already logged errors
          logger.error('getStableToken: error: ', Log.getErrInfo(e));
        }

        throw e;
      }).then(function () {
        // should never get here without without valid token
        logger.info('returning the tokenInfo in _getStableToken: ', Log.getInfo(tokenInfo.token));
        return tokenInfo.token;
      });
    };

    Rooms.prototype.login = function () {
      logger.info('login before getting token');
      return this._getToken().then(function () {
        return Promise.resolve(); // just to not return token as result
      }, function (err) {
        logger.info('login before getting token error', Log.getInfo(err));
        throw err;
      });
    };

    Rooms.prototype.setToken = function (token) {
      return this._updateTokenInfo({
        token: token
      });
    };

    Rooms.prototype.logout = function () {
      delete this.config;
      delete this._userProfile;
      RoomsSettings.clear();
      return Promise.resolve();
    };

    var _cacheVersion = 20170622;

    Rooms.prototype._fetchCachedRooms = function () {
      var srooms = Storage.getItem(this.config.cacheKey + ':' + this.config.settings.unifiedPortalUsername);
      var rooms = this._safeJSONParse(srooms) || {};
      var dtn = Date.now();

      if ((rooms.expires || 0) - dtn > 60 * 1000) {
        if (!rooms.version || rooms.version < _cacheVersion) {
          return null;
        }

        return rooms;
      }

      return null;
    };

    Rooms.prototype._updateCachedRooms = function (rooms) {
      if (rooms) {
        rooms.expires = Date.now() + 30 * 60 * 1000;
        rooms.version = _cacheVersion;
      }

      var srooms = JSON.stringify(rooms || {});
      Storage.setItem(this.config.cacheKey + ':' + this.config.settings.unifiedPortalUsername, srooms);
    };

    Rooms.prototype._addConferenceRoom = function (rooms) {
      var url = this.config.conferenceParticipantUrl || this.config.conferenceModeratorUrl || '';
      var pin = this.config.conferenceParticipantPIN || this.config.conferenceModeratorPIN || '';

      if (!url) {
        logger.info('getRooms: no conference room with empty conference url');
        return rooms;
      }

      var room = pin || (/(\/|participantCode=)([0-9]+)/i.exec(url) || [])[2] || '';
      this.config.conferenceParticipantPIN = room;
      rooms.push({
        id: room || 'default',
        name: this.config.conferenceRoomName,
        meetingId: room || '',
        number: room || '',
        conferenceAccessUrl: url,
        type: this.config.conferenceType,
        conferenceAccessNumber: this.config.bridgeNumber,
        own: true
      });
      return rooms;
    };

    var _delegateMapping = {// test ones
      // 'sergeyv': ['georgeu'],
    };

    Rooms.prototype.__getRooms = function (args) {
      if (!args._users) {
        var delegateName = this.config.delegateName;

        if (delegateName) {
          args._users = [delegateName, args.userId];
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
      logger.info('getRooms: ', Log.getInfo(JSON.stringify(args)));

      if (this.config.mode !== 'equinox') {
        logger.info('getRooms resolve: no virtual rroms in non-equinox mode');
        return Promise.resolve({
          rooms: []
        });
      }

      if (!args.forceFetch) {
        var rooms = this._fetchCachedRooms();

        if (rooms) {
          logger.info('getRooms resolve: cached rooms');
          return Promise.resolve(rooms);
        }

        if (args.cachedOnly) {
          return Promise.resolve({
            rooms: []
          });
        }
      }

      var self = this;
      return this._getToken().then(function (r) {
        args.token = r;
        args.tenantId = self.config.tenantId;
        args.aliasId = self.config.tenantId;
        args.userId = self.config.settings.unifiedPortalUsername;
        return self.__getRooms(args);
      }).then(function (r) {
        self._updateCachedRooms(r);

        logger.info('getRooms resolve: fetched rooms');
        return r;
      }, function (err) {
        logger.error('getRooms error: ' + Log.getErrInfo(err));

        self._updateCachedRooms(null);

        self._updateTokenInfo(null);

        if (!args.retry && err.error && !(err.error.httpStatus === 400 || err.error.httpStatus === 401)) {
          args.retry = true;
          return self.getRooms(args);
        }

        throw err;
      });
    };

    Rooms.prototype.getRooms = function (args) {
      var self = this;
      var profile = {};
      return Promise.resolve().then(function () {
        logger.info('getRooms: skipReservation: ' + !!args.skipReservation);
        return self.getProfile(true);
      }).then(function (r) {
        profile = r || profile;
        profile.canReserveMeetingsFromOutlookPlugin = !args.skipReservation && !!profile.canReserveMeetingsFromOutlookPlugin;
        return self._getRooms(args);
      }).then(function (r) {
        var rooms = r.rooms.map(function (room) {
          var ruserId = (room.userId || '').toLowerCase();
          var cuserId = (self.config.settings.unifiedPortalUsername || '').toLowerCase();
          return {
            id: room.id,
            name: room.name,
            conferenceAccessNumber: '',
            meetingId: room.number,
            conferenceAccessUrl: room.url || self.config.portalUri,
            accessPIN: room.accessPIN,
            type: 'equinox',
            own: ruserId === cuserId,
            userId: room.userId,
            canReserveMeetingsFromOutlookPlugin: !!profile.canReserveMeetingsFromOutlookPlugin,
            protectMeetingWithParticipantId: profile.virtualRoomSettings && profile.virtualRoomSettings[room.number] && profile.virtualRoomSettings[room.number].protectMeetingWithParticipantId
          };
        });
        rooms = self._addConferenceRoom(rooms);
        self.rooms = {};
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
      location = this._replaceAll(location, '$(bridgePrefix)', this.config.bridgePrefix || '');
      location = this._replaceAll(location, '$(bridgeNumber)', bridgeNumber || '');

      if (args.conference) {
        var room = args.dialableNumber || '';

        if (room && room[room.length - 1] !== '#') {
          room += '#';
        }

        location = this._replaceAll(location, '$(room)', room);
        location = this._replaceAll(location, '$(conferenceJoinUrl)', this.config.conferenceParticipantUrl || '');
      } else {
        location = this._replaceAll(location, '$(room)', args.dialableNumber || '');
        location = this._replaceAll(location, '$(pinE164)', args.accessPIN ? '***' + atob(args.accessPIN) : '');
        location = this._replaceAll(location, '$(pin)', args.accessPIN ? atob(args.accessPIN) : '');
        var portal = this.config.serverBase + '/portal/tenants/' + this.config.tenantId + '/?ID=';
        location = this._replaceAll(location, '$(portalJoinUrl)', portal || '');
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

      dialingInfo.dialingInfoText = typeof dialingInfo.dialingInfoText === 'undefined' ? '' : dialingInfo.dialingInfoText + '\n';
      dialingInfo.dialingInfoHTML = '<div>' + dialingInfo.dialingInfoHTML;
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
      var type = args.conference ? 'aac' : 'scopia';
      var langId = self.config.languageId;
      this.i18n[type.toUpperCase() + '_DIR'] = langId !== 'he-il' ? 'ltr' : 'rtl';
      var opt = {
        html: true,
        logger: logger,
        i18n: self.i18n,
        langId: langId
      };
      return new Templates(opt).getTemplate(type).then(function (r) {
        var content = r;
        var bridgeNumber = self.config.bridgeNumber || '';
        content = self._replaceAll(content, '$(bridgePrefix)', self.config.bridgePrefix || '');
        content = self._replaceAll(content, '$(bridgeNumber)', bridgeNumber || '');

        if (args.conference) {
          var room = args.dialableNumber || '';

          if (room && room[room.length - 1] !== '#') {
            room += '#';
          }

          content = self._replaceAll(content, '$(room)', room);
          var typeLabel = '';

          if (self.config.conferenceType === 'aac') {
            typeLabel = self.i18n.aacLabel;
          } else if (self.config.conferenceType === 'ipo') {
            typeLabel = self.i18n.ipoLabel;
          }

          content = self._replaceAll(content, '$(conferenceType)', typeLabel || '');
        } else {
          content = self._replaceAll(content, '$(room)', args.dialableNumber || '');
          content = self._replaceAll(content, '$(pinE164)', args.accessPIN ? '***' + atob(args.accessPIN) : '');
          content = self._replaceAll(content, '$(pin)', args.accessPIN ? atob(args.accessPIN) : '');
          content = self._replaceAll(content, '$(roomName)', args.name || '');
        }

        var portal = self.config.serverBase + '/portal/tenants/' + self.config.tenantId + '/?ID=';
        content = self._replaceAll(content, '$(portalJoinUrl)', portal || '');
        var scopiaUrl = (self._infoUser || self._infoGuest || {}).scopiaUrl;
        scopiaUrl = null;

        if (!scopiaUrl) {
          scopiaUrl = self.config.serverBase + '/portal/tenants/' + self.config.tenantId + '/';
        }

        var scopiaBaseUrl = (/https?\:\/\/[^\/]*/i.exec(scopiaUrl) || [])[0] || '';
        var scopiaJoinUrl = scopiaUrl + '?ID=';
        content = self._replaceAll(content, '$(conferenceJoinUrl)', self.config.conferenceParticipantUrl || '');
        content = self._replaceAll(content, '$(scopiaBaseUrl)', scopiaBaseUrl);
        content = self._replaceAll(content, '$(scopiaJoinUrl)', scopiaJoinUrl);
        content = self._replaceAll(content, '$(autojoin)', args.autojoin ? '&amp;autojoin' : '');
        var dialingInfo = {};
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

      return self.resources({}).then(function (r) {
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
        r.result.push({
          id: room.id,
          title: room.name,
          room: room
        });
        return r;
      }, {
        result: [],
        rooms: this.rooms
      }).result;
      return {
        items: res
      };
    };

    Rooms.prototype.getTopic = function (id) {
      var room = this.rooms[id];

      if (room) {
        return {
          id: room.id,
          title: room.name,
          room: room
        };
      }
    };

    Rooms.prototype.extractMeetingInfo = function (settings, rooms, meeting) {
      var meetingInfo = TOM.extractMeetingInfo(settings, rooms, meeting);
      meetingInfo.url = TOM.getJoinMeetingUri(meetingInfo);
      var altUrl = meetingInfo.url;

      if (meetingInfo.type === 'equinox' && altUrl.indexOf('http') === 0) {
        if (altUrl.indexOf('/portal') !== -1 && altUrl.indexOf('/portal/tenants') === -1 && this.config.tenantId) {
          altUrl = altUrl.replace('/portal', '/portal/tenants/' + this.config.tenantId);
        }
      }

      meetingInfo.altUrl = altUrl;
      return meetingInfo;
    };

    Rooms.prototype._getProfile = function (token) {
      if (this._deferredProfile) {
        return this._deferredProfile;
      }

      var args = {
        uri: this._infoUser.getUserDetailsInfo.href,
        token: token,
        contentType: this._infoUser.getUserDetailsInfo.responseTypes.join(',')
      };
      var self = this;
      this._deferredProfile = this.roomsAPI.getUserDetails(args, false).then(function (r) {
        // do not use fetchproxy here (SV)
        var profile = {};
        profile.canReserveMeetingsFromOutlookPlugin = r.canReserveMeetingsFromOutlookPlugin;
        profile.virtualRoomSettings = {};
        (r.virtualRoomSettings || []).forEach(function (roomSettings) {
          profile.virtualRoomSettings[roomSettings.number] = roomSettings;
        });
        delete self._deferredProfile;
        return profile;
      }, function (e) {
        delete self._deferredProfile; // allow retry on fail???

        throw e;
      });
      return this._deferredProfile;
    };

    Rooms.prototype.getProfile = function (cached) {
      if (cached && this._userProfile) {
        if ((this._userProfile.expires || 0) >= Date.now()) {
          return Promise.resolve(this._userProfile);
        }

        delete this._userProfile;
      }

      var self = this;
      return this._getToken().then(function (r) {
        return self._getProfile(r);
      }).then(function (r) {
        self._userProfile = r;
        self._userProfile.expires = Date.now() + 5 * 60 * 1000;
        return self._userProfile;
      }, function (e) {
        logger.error('getProfile error: ', Log.getErrInfo(e));
      });
    };

    Rooms.prototype.createInvite = function (invite) {
      var room = this.rooms[invite.id];
      var args = {
        name: room.name,
        accessPIN: room.accessPIN,
        dialableNumber: room.meetingId,
        conference: room.type !== 'equinox',
        additionalNumbersTitle: this.i18n.additionalNumbersTitle
      };
      var self = this;
      return Promise.resolve().then(function () {
        logger.info('createInvite skipReservation: ' + !!invite.skipReservation);
        logger.info('createInvite ignoreReservation: ' + !!invite.ignoreReservation);

        if (invite.skipReservation || invite.ignoreReservation) {
          return {};
        }

        return self.getProfile(true);
      }).then(function (r) {
        args.forReservation = (r ? r.canReserveMeetingsFromOutlookPlugin : false) || undefined;
        var canReserve = invite.ignoreReservation || args.forReservation;
        return self.getDialInfo(args).then(function (r) {
          var meeting = {
            'location': r.location,
            'body': r.dialingInfoText || r.dialingInfoHTML
          };
          var meetingInfo = self.extractMeetingInfo(self.config.settings, self.rooms, meeting);
          var info = {
            topicId: invite.id,
            topicTitle: room.name,
            conferenceAccessNumber: room.conferenceAccessNumber,
            meetingId: room.type === 'equinox' ? room.meetingId : '',
            conferenceAccessUrl: room.conferenceAccessUrl,
            joinUrl: meetingInfo.url,
            altJoinUrl: meetingInfo.altUrl,
            canReserve: canReserve,
            isReserved: !!r.childMeetingNumber,
            protectMeetingWithParticipantId: room.protectMeetingWithParticipantId
          };
          var res = {
            id: room.id,
            type: room.type,
            location: r.location,
            content: {
              'text': r.dialingInfoText,
              'html': r.dialingInfoHTML
            },
            info: info
          }; // enable reservations for meetings without a PIN

          if (r.childMeetingNumber
          /* && r.meetingPin*/
          ) {
            info.childMeetingNumber = r.childMeetingNumber;
            res.reservation = {
              conferencePortalUri: self.config.settings.conferencePortalUri,
              unifiedPortalUsername: room.userId,
              meetingId: room.meetingId,
              childMeetingNumber: r.childMeetingNumber,
              meetingPin: r.meetingPin || ''
            };
          }

          logger.info('createInvite res: ' + JSON.stringify(res));
          return Promise.resolve(res);
        });
      });
    };

    Rooms.prototype.getInviteInfo = function (configuration, languageId, location, body) {
      var config;
      var self = this;
      var rooms;
      return this.configure(configuration, languageId).then(function (r) {
        config = r;
        return self._getRooms({});
      }).then(function (r) {
        rooms = (r.rooms || []).map(function (room) {
          var pin = room.accessPIN;
          return {
            id: room.id,
            name: room.name,
            meetingId: room.number,
            conferenceAccessUrl: room.url,
            accessPIN: pin || '',
            moderatorPIN: room.moderatorPIN,
            canReserveMeetingsFromOutlookPlugin: room.canReserveMeetingsFromOutlookPlugin
          };
        });
      }, function (err) {
        logger.error('getInviteInfo error: ' + Log.getErrInfo(err));
        rooms = [];
      }).then(function () {
        var meeting = {
          'location': location,
          'body': body
        };
        var res = self.extractMeetingInfo(config.settings, rooms, meeting);
        logger.info('getInviteInfo res: ' + JSON.stringify(res));
        return Promise.resolve(res);
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

          if (r.room.indexOf(self.rooms[id].meetingId) === 0 || r.url && self.rooms[id].conferenceAccessUrl === r.url) {
            inviteId = id;
            break;
          }
        }

        if (!inviteId) {
          return Promise.resolve(null);
        }

        var room = self.rooms[inviteId];
        var info = {
          topicId: inviteId,
          topicTitle: room.name,
          conferenceAccessNumber: room.conferenceAccessNumber,
          meetingId: room.type === 'equinox' ? room.meetingId : '',
          childMeetingNumber: room.type === 'equinox' && r.room != room.meetingId ? r.room : '',
          conferenceAccessUrl: room.conferenceAccessUrl,
          joinUrl: r.url,
          altJoinUrl: r.altUrl,
          protectMeetingWithParticipantId: room.protectMeetingWithParticipantId
        };
        info.canReserve = room.canReserveMeetingsFromOutlookPlugin;
        info.isReserved = !!info.childMeetingNumber;
        var res = {
          id: inviteId,
          isHost: r.isHost,
          info: info
        };
        logger.info('checkInvite res: ' + JSON.stringify(res));
        return Promise.resolve(res);
      });
    };

    function formatDuration(min) {
      //return 'PT' + (sec / 3600 | 0) + 'H' + ((sec % 3600) / 60 | 0) + 'M' + (sec % 60) + 'S';
      min = min || 0;
      return 'PT' + (min / 60 | 0) + 'H' + min % 60 + 'M' + 0 + 'S';
    }

    Rooms.prototype.retryUnauthorized = function (roomsfunc, args) {
      roomsfunc = roomsfunc.bind(this);
      var self = this;
      return roomsfunc(args).then(function (r) {
        return Promise.resolve(r);
      }, function (e) {
        if (!args.retry && e.error && e.error.httpStatus === 401) {
          self._updateTokenInfo(null); // clear failed token to force login


          args.retry = true;
          return roomsfunc(args);
        }

        return Promise.reject(e);
      });
    };

    var recurrenceKeys = ['daily', 'weekly', 'monthly', 'recurrenceEnd'];

    Rooms.prototype._scheduleMeeting = function (info) {
      logger.info('_scheduleMeeting starting');
      var args = {};
      var self = this;
      return this._getStableToken().then(function (r) {
        args.tenantId = self.config.tenantId;
        args.token = r;

        if (!info.conferenceId) {
          args.number = info.number;
          args.parentMeetingNumber = info.parentMeetingNumber || '';
          args.subject = info.subject;
          args.startTime = info.start;
          args.duration = formatDuration(info.duration);
          args.timeZoneId = info.timeZoneId;
          args.accessPIN = info.accessPIN;
          args.moderatorPIN = info.moderatorPIN || null;
          args.terminationCondition = 'AFTER_ALL_PARTIES_LEFT';

          if (info.recurrence) {
            for (var key in info.recurrence) {
              args[key] = info.recurrence[key];
            }
          }

          args.client = info.client;
          args.globalUniqueId = info.globalUniqueId; // args.servicePrefix = info.servicePrefix;
          // args.serviceTemplateId = info.serviceTemplateId;

          return self.roomsAPI.schedule(args);
        } else {
          var searchConference;
          args.conferenceId = info.conferenceId;

          if (info.originalStartTime) {
            args.originalStartTime = info.originalStartTime;
            searchConference = self.roomsAPI.searchOccurence(args);
          } else if (info.originalStart) {
            args.startTime = info.originalStart;
            searchConference = self.roomsAPI.searchByStartTime(args);
          } else {
            searchConference = self.roomsAPI.search(args);
          }

          return searchConference.then(function (r) {
            var conference = r.conferences[0];

            if (!conference) {
              logger.error('scheduleMeeting: conference not found (id: ' + args.conferenceId + ', start: ' + args.startTime + ')');
              return Promise.reject('conference not found');
            }

            conference.number = info.number; // update conference for new invite (childMeetingNumber)

            conference.parentMeetingNumber = info.parentMeetingNumber || '';
            conference.subject = info.subject;
            conference.startTime = info.start;
            conference.duration = formatDuration(info.duration);
            conference.timeZoneId = info.timeZoneId;
            conference.accessPIN = btoa(info.accessPIN); //conference.moderatorPIN = btoa(info.moderatorPIN || '');

            conference.client = info.client;

            if (info.recurrence) {
              for (var key in info.recurrence) {
                conference[key] = info.recurrence[key];
              }
            } else {
              for (var i in recurrenceKeys) {
                // delete conference[recurrenceKeys[i]]; // causes {"error":[{"errorCode":"ERC_UNKNOWN_ERROR","displayMsg":"Unknown error","errorMsg":"CONF_NOT_FOUND"}]}
                conference[recurrenceKeys[i]] = {}; // succeeds, but recurrence remains intact
              } // conference.servicePrefix = info.servicePrefix;
              // conference.serviceTemplateId = info.serviceTemplateId;

            }

            delete conference.broadcastSetting; // QQQ this field causes fail on conference update

            args.conferenceId = conference.conferenceId;
            args.conference = [conference];
            return self.roomsAPI.reschedule(args);
          });
        }
      });
    };

    Rooms.prototype.scheduleMeeting = function (info) {
      return this.retryUnauthorized(this._scheduleMeeting, info);
    };

    Rooms.prototype._deleteMeeting = function (conferenceId) {
      var args = {};
      var self = this;
      return this._getStableToken().then(function (r) {
        args.tenantId = self.config.tenantId;
        args.token = r;
        args.conferenceId = conferenceId;
        return self.roomsAPI["delete"](args);
      });
    };

    Rooms.prototype.deleteMeeting = function (conferenceId) {
      return this.retryUnauthorized(this._deleteMeeting, conferenceId);
    };

    Rooms.prototype._deleteOccurence = function (info) {
      var args = {};
      var self = this;
      return this._getStableToken().then(function (r) {
        args.tenantId = self.config.tenantId;
        args.token = r;
        args.conferenceId = info.conferenceId;

        if (info.originalStartTime) {
          args.originalStartTime = info.originalStartTime;
          return self.roomsAPI.deleteOccurrence(args);
        } else {
          args.startTime = info.originalStart;
          return self.roomsAPI.deleteOccurrenceByStartTime(args);
        }
      });
    };

    Rooms.prototype.deleteOccurence = function (info) {
      return this.retryUnauthorized(this._deleteOccurence, info);
    };

    Rooms.prototype._searchByGlobalUniqueId = function (globalUniqueId) {
      var args = {};
      var self = this;
      return this._getStableToken().then(function (r) {
        args.tenantId = self.config.tenantId;
        args.token = r;
        args.globalUniqueId = globalUniqueId;
        return self.roomsAPI.searchByGlobalUniqueId(args);
      });
    };

    Rooms.prototype.searchByGlobalUniqueId = function (globalUniqueId) {
      return this.retryUnauthorized(this._searchByGlobalUniqueId, globalUniqueId);
    };

    module.exports = new Rooms();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(16);
var normalizeHeaderName = __webpack_require__(205);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(123);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(123);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(74)))

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);
var settle = __webpack_require__(206);
var cookies = __webpack_require__(208);
var buildURL = __webpack_require__(120);
var buildFullPath = __webpack_require__(209);
var parseHeaders = __webpack_require__(212);
var isURLSameOrigin = __webpack_require__(213);
var createError = __webpack_require__(124);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    if (
      (utils.isBlob(requestData) || utils.isFile(requestData)) &&
      requestData.type
    ) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = unescape(encodeURIComponent(config.auth.password)) || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(207);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var formats = __webpack_require__(85);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var ChromeTabs = __webpack_require__(235);

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

/***/ 129:
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

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var globals = __webpack_require__(28);
  
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

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';
    /** @constructor */

    function SrcConfig() {}

    SrcConfig.prototype.isValid = function (configuration) {
      return !!configuration['UNIFIEDPORTALENABLED'] || !!configuration['CONFERENCE_MODERATOR_URL'] || !!configuration['CONFERENCE_PARTICIPANT_URL'];
    };

    module.exports = new SrcConfig();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var office = __webpack_require__(35);
    /** @constructor */


    function SrcConfig(configuration) {}

    function checkMinVersion(version, major, minor) {
      console.info('checkMinVersion:', version, major, minor);

      if (!version || typeof version !== 'string') {
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

    SrcConfig.prototype.isValid = function (configuration) {
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

        if (typeof eaca === 'undefined') {
          eaca = true;
        }

        if (eaca) {
          // SRAD change Feb 01 2018
          var acl = configuration['AVAYA_CLOUD_LOGIN_ID'];

          if (typeof acl === 'undefined' || !!acl) {
            return true;
          }
        }
      }

      return false;
    };

    module.exports = new SrcConfig();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(119);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Promise = __webpack_require__(6);

    var Log = __webpack_require__(18);

    var Event = __webpack_require__(20);

    var Timer = __webpack_require__(66);

    var Utils = __webpack_require__(15);

    var schema = __webpack_require__(240);

    var identity = __webpack_require__(99);

    var identityStates = __webpack_require__(100);

    var modelParties = __webpack_require__(161);

    var modelPartiesTypes = __webpack_require__(86);

    var ZangSpaces = __webpack_require__(259);

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
      this.lastUpdate = 0; // this.refresh(); // do not start pollTopics on init
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
      } // so far supporting only primary account


      if (!account.info.primary) {
        return;
      }

      if (account.state === identityStates.Authorized) {
        var opt = this.opt || {};
        opt.user = account.info.user;
        opt.token = identity.getToken.bind(identity, {
          id: account.id,
          primary: account.id === 'primary'
        });
        this.init(opt);
      } else {
        this.shut();
      }
    };

    Spaces.prototype.pollTopics = function (r) {
      Utils.showLogInfo('spaces: model.pollTopics', r ? {
        next: r.next,
        items: (r.items || []).length
      } : r);

      if (!this.service.opt) {
        Utils.showLogInfo('spaces: model.pollTopics skip', 'service not configured or shutted down');
        this.onReady.dispatch({
          skip: true
        });
        return Promise.resolve({
          skip: true
        });
      }

      if (!r) {
        var dtn = Date.now();

        if (dtn - this.lastUpdate < 5 * 60000) {
          Utils.showLogInfo('spaces: model.pollTopics skip', 'topics are up to date');
          this.onReady.dispatch({
            skip: true
          });
          return Promise.resolve({
            skip: true
          });
        }

        var self = this;
        return Promise.resolve().then(function () {
          return self.service.fetchUser();
        }).then(function (userInfo) {
          // fetch own personal room first
          return self.service.getPersonalTopic({
            id: userInfo.email
          }).then(function (r) {
            return r;
          }, function (e) {
            e = e; // failure to get personal room is not critical, log it and proceed

            return null;
          });
        }).then(function (topic) {
          if (topic) {
            self.reportTopic(topic);
          }
        }).then(function () {
          // then rest of topics
          return self.service.fetchTopics().then(self.pollTopics);
        }).then(function () {// fully completed
        }, function (e) {
          e = e; // something failed
        });
      }

      this.lastUpdate = Date.now();

      for (var i = 0; i < r.items.length; i++) {
        this.reportTopic(r.items[i]);
      }

      if (r.next) {
        return this.service.fetchTopics({
          url: r.next
        }).then(this.pollTopics);
      }

      this.onReady.dispatch({
        done: true
      });
      return Promise.resolve({
        done: true
      });
    };

    Spaces.prototype.reportTopic = function (topic) {
      if (!topic.selfMember) {
        Utils.showLogInfo('spaces: model.reportTopic skip', 'role: guest, id: ' + topic.id);
        return;
      }

      this.topics[topic.id] = topic;
      this.onTopic.dispatch({
        item: topic
      });
    };

    Spaces.prototype.reschedule = function () {// periodic polling switched off
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
      }, {
        result: [],
        topics: this.topics
      }).result;
      return {
        items: res
      };
    };

    Spaces.prototype.getTopic = function (id) {
      return this.topics[id];
    };

    Spaces.prototype.searchTopics = function () {};

    Spaces.prototype.createTopic = function (topic) {
      if (!topic.parties) {
        var parties = modelParties.getParties();
        var partiesType = modelParties.getPartiesType();
        modelParties.clear();
        var keys = Object.getOwnPropertyNames(parties);
        var p = [];

        for (var i = 0; i < keys.length; i++) {
          p.push({
            email: keys[i],
            member: partiesType === modelPartiesTypes.member
          });
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
        var inviteUrl = (self._getInviteInfo(r.invite.content.text) || {}).url;
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

    Spaces.prototype.removeTopic = function () {};

    Spaces.prototype.createInvite = function (invite) {
      if (!invite.parties) {
        var parties = modelParties.getParties();
        var partiesType = modelParties.getPartiesType();
        modelParties.clear();
        var keys = Object.getOwnPropertyNames(parties);
        var p = [];

        for (var i = 0; i < keys.length; i++) {
          p.push({
            email: keys[i],
            member: partiesType === modelPartiesTypes.member
          });
        }

        invite.parties = p;
      }

      var self = this;
      return this.service.createInvite(invite).then(function (r) {
        if (invite.join) {
          self.joinInvite(r.id);
        }

        var topic = self.topics[invite.id] || {};
        var inviteUrl = r.url;

        if (!inviteUrl) {
          if (topic.type === 'personal') {
            if (topic.email && self.opt.portalUrl) {
              inviteUrl = self.opt.portalUrl + '/u/' + topic.email;
            }
          }
        }

        if (!inviteUrl) {
          inviteUrl = (self._getInviteInfo(r.content.text) || {}).url;
        }

        r.location = inviteUrl;
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
      } // var endpoint = (this.opt || {}).url || 'https://spaces.avayacloud.com';
      // var reText = escapeRegExp(endpoint) + '\/spaces\/invites\/(.*?)\/(join|meet)';


      var reText = 'https:\/\/[^\/]*\/spaces\/invites\/(.*?)\/(join|meet)';
      logger.info('getInviteInfo search: ' + reText);
      var re = new RegExp(reText, 'i');
      var result = re.exec(body) || [];
      var id = result[1];
      var url = result[0];
      var res = id ? {
        id: id,
        url: url
      } : null;
      logger.info('getInviteInfo res: ' + JSON.stringify(res));
      return res;
    };

    Spaces.prototype.getInviteInfo = function (body) {
      return Promise.resolve(this._getInviteInfo(body));
    };

    Spaces.prototype.checkInvite0 = function (body) {
      return this.getInviteInfo(body).then(function (r) {
        return Promise.resolve(r ? {
          inviteId: r.id
        } : null);
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
        return self.service.getTopic({
          id: inviteInfo.id
        }).then(function (r) {
          var info = {
            topicId: r.topic._id,
            topicTitle: r.topic.title,
            spaceUrl: inviteInfo.url
          };
          return Promise.resolve(r ? {
            inviteId: inviteInfo.id,
            info: info
          } : null);
        }, function (err) {
          return Promise.resolve({
            inviteId: inviteInfo.id,
            info: {
              spaceUrl: inviteInfo.url
            }
          });
        });
      });
    };

    Spaces.prototype.joinTopic = function (id) {
      var url = this.service.getJoinUrl(id); // Window.open(url, '_blank');
    };

    Spaces.prototype.joinInvite = function (id) {
      var url = this.service.getInviteJoinUrl(id);
      Window.open(url, '_blank');
    };

    module.exports = new Spaces();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Event = __webpack_require__(20);

    var schema = __webpack_require__(258);

    var modelIdentity = __webpack_require__(99);

    var partyType = __webpack_require__(86);

    var _storageKey = 'spaces:partiesType';

    function Parties() {
      this.parties = {};
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

        if (party.image && p.image !== party.image) {
          update = true;
          p.image = party.image;
        }

        if (party.name && p.name !== party.name) {
          update = true;
          p.name = party.name;
        }

        if (party.member) {
          update = true;
          p.member = true;
        }

        if (update) {
          this.onParties.dispatch({
            item: p
          });
        }

        return;
      }

      this.parties[party.id] = party;
      this.onParties.dispatch({
        item: party
      });
    };

    Parties.prototype.removeParty = function (id) {
      var p = this.parties[id];

      if (!p) {
        return;
      }

      delete this.parties[id];
      this.onParties.dispatch({
        deleted: true,
        item: p
      });
    };

    Parties.prototype.getPartiesType = function () {
      return this.partiesType;
    };

    Parties.prototype.setPartiesType = function (type) {
      this.partiesType = type;
      localStorage.setItem(_storageKey, this.partiesType);
      this.onPartiesType.dispatch({
        type: this.partiesType
      });
    };

    Parties.prototype.clear = function () {
      this.parties = {};
      this.onParties.dispatch({
        cleared: true
      });
    };

    module.exports = new Parties();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Utils = __webpack_require__(15);

  function noop() {
  }

  function wrapLogger(c, f, tag, lev) {
    if (!f) {
      return noop;
    }
      return function () {
        if ((typeof Office === 'undefined') || (Office.context && Office.context.platform === Office.PlatformType.Mac)) {
          return f.call(c, [tag, lev].concat([].slice.call(arguments)).join(' '));
        }
        return f.apply(c, [tag, lev].concat([].slice.call(arguments)));
      }
  }

  function Log() {
  }

  Log.prototype.createLogger = function (tag) {
    if (window && window.location) {
      var log = Utils.getParam('log');
      if (!log) {
        var path = (window.location.pathname || '').split('/');
        log = path[path.length - 1].split('.')[0];
      }
      if (log) {
        tag = log.toUpperCase() + ':' + tag;
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
        var cred = (args.pop() || '');

        // ACW-20227, masking password
        if (cred) {
          var cred2 = JSON.stringify(cred).replace(/^\"|\"$/ig, '');

          args = args.map(function (item) {
            var s = item;
            s = s.split(cred).join('********');
            s = s.split(cred2).join('********');
            return s;
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

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module){
  'use strict';
  
  var globals = __webpack_require__(28);
  //var fetch = require('./fetch.poly');
  var fetchDefs = __webpack_require__(195);

  var loader = __webpack_require__(65);

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

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var globals = __webpack_require__(28);

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

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = loadOffice;
function loadOffice(onload) {
    if (window.Office) {
      onload();
    } else {
      var fallbackScript    = document.createElement('script');
      fallbackScript.src    = './office.js';
      fallbackScript.onload = loadOffice.bind(this, onload);
      fallbackScript.onerror = loadOffice.bind(this, onload);
      document.head.appendChild(fallbackScript);
    }
}

/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var officeNative = {
      missing: true
    };

    if (window.external) {
      if ('context' in window.external) {
        officeNative = window.external;
      }
    }

    module.exports = officeNative;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var globals = __webpack_require__(28);

    var Office = globals.safeProp('Office');

    var _settings;

    var store;

    function save() {
      var cb = function cb() {};

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
      store = _settings ? {
        get: get,
        set: set,
        del: del
      } : null;
    }

    function getStore() {
      if (typeof store !== 'undefined') {
        return store;
      }

      if (typeof Office === 'undefined' || !Office.context || !Office.context.roamingSettings) {
        _settings = null;
      } else {
        _settings = Office.context.roamingSettings;
      }

      init();
      return store;
    }

    var storage = {
      init: init,
      getStore: getStore
    };
    module.exports = storage;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(200);

/***/ }),

/***/ 20:
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

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);
var bind = __webpack_require__(119);
var Axios = __webpack_require__(201);
var mergeConfig = __webpack_require__(125);
var defaults = __webpack_require__(122);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(126);
axios.CancelToken = __webpack_require__(214);
axios.isCancel = __webpack_require__(121);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(215);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);
var buildURL = __webpack_require__(120);
var InterceptorManager = __webpack_require__(202);
var dispatchRequest = __webpack_require__(203);
var mergeConfig = __webpack_require__(125);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);
var transformData = __webpack_require__(204);
var isCancel = __webpack_require__(121);
var defaults = __webpack_require__(122);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(124);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(210);
var combineURLs = __webpack_require__(211);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(126);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_client_oauth2__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_client_oauth2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_client_oauth2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_qs__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_qs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_qs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_jsl_chrome_chrome__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_jsl_chrome_chrome___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__lib_jsl_chrome_chrome__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_jsl_chrome_window__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_jsl_chrome_window___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__lib_jsl_chrome_window__);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var AuthService = /** @class */ (function () {
    function AuthService(opts) {
        var _this = this;
        this.dialog = null;
        this.auth = null;
        this.checkInterval = null;
        this.asyncui = null;
        this.open = function () { return __awaiter(_this, void 0, void 0, function () {
            var apppath, uri, result, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apppath = location.protocol + '//' + location.hostname + location.pathname;
                        uri = this.auth.code.getUri();
                        if ((!this.asyncui && !(__WEBPACK_IMPORTED_MODULE_2__lib_jsl_chrome_chrome___default.a && __WEBPACK_IMPORTED_MODULE_2__lib_jsl_chrome_chrome___default.a.runtime)) ||
                            this.asyncui && /^(Outlook|OutlookWebApp)$/.test(this.asyncui.hostName)) {
                            uri = apppath.replace(/(.*)\/.*\.html$/i, '$1/redirect.html') + '?' + uri;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!this.asyncui) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.asyncui.open(uri)];
                    case 2:
                        result = _a.sent();
                        this.dialog = result.value;
                        return [2 /*return*/, this.dialogCallback(result)];
                    case 3:
                        this.dialog = __WEBPACK_IMPORTED_MODULE_3__lib_jsl_chrome_window___default.a.open(uri, 'oauth');
                        if (!this.dialog) {
                            throw new Error('Window blocked');
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.startCheck(function () { return resolve(_this.onClose()); });
                            })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        if (err_1.error) {
                            return [2 /*return*/, this.processEvent(err_1)];
                        }
                        throw err_1;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        this.asyncui = opts.asyncui;
        var redirectUri = /esna\.com$/.test(location.hostname)
            ? 'https://manage1.esna.com/equinox.mso/token.redirect'
            : /avaya\.com$/.test(location.hostname)
                ? 'https://sso.apps.avaya.com/clients/scheduler/token.redirect'
                : null;
        this.auth = new __WEBPACK_IMPORTED_MODULE_0_client_oauth2___default.a({
            clientId: opts.oauth2ClientId,
            accessTokenUri: opts.accessTokenUri,
            authorizationUri: opts.authorizationUri,
            redirectUri: redirectUri,
            scopes: opts.scopes,
            state: this.generateState()
        });
    }
    AuthService.prototype.dialogCallback = function (asyncResult) {
        var _this = this;
        if (asyncResult.error) {
            throw new Error(asyncResult.error.message);
        }
        return new Promise(function (resolve, reject) {
            _this.startCheck(function () { return resolve(_this.onClose()); });
            _this.dialog.addEventHandler(Office.EventType.DialogEventReceived, function (evt) {
                try {
                    resolve(_this.processEvent(evt));
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    };
    AuthService.prototype.startCheck = function (callback) {
        var _this = this;
        this.checkInterval = setInterval(function () {
            var state = localStorage.getItem(_this.auth.options.state);
            if (state) {
                _this.dialog && _this.dialog.close();
            }
            if (state || _this.dialog && _this.dialog.closed) {
                callback && callback();
            }
        }, 500);
    };
    AuthService.prototype.onClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hash, params, tokenResp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearInterval(this.checkInterval);
                        hash = localStorage.getItem(this.auth.options.state);
                        if (!hash) return [3 /*break*/, 2];
                        params = __WEBPACK_IMPORTED_MODULE_1_qs___default.a.parse(hash.slice(1));
                        return [4 /*yield*/, this.auth.code.getToken("".concat(this.auth.options.redirectUri, "?").concat(__WEBPACK_IMPORTED_MODULE_1_qs___default.a.stringify({ state: this.auth.options.state, code: params.code })))];
                    case 1:
                        tokenResp = _a.sent();
                        result = [];
                        result[0] = tokenResp.accessToken;
                        result[1] = tokenResp.refreshToken;
                        return [2 /*return*/, result];
                    case 2: throw new Error('no hash');
                }
            });
        });
    };
    AuthService.prototype.processEvent = function (evt) {
        var error;
        switch (evt.error) {
            case 12002:
                error = 'The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.';
                break;
            case 12003:
                error = 'The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.';
                break;
            case 12006:
                return this.onClose();
            default:
                error = evt.error;
                break;
        }
        throw error;
    };
    AuthService.prototype.generateState = function () {
        var page = location.protocol + '//' + location.hostname + location.pathname;
        var id = page.replace(/\/[^\/]*\.html/i, '/auth.html');
        return "".concat(uuidv4(), "---").concat(id, "---");
    };
    return AuthService;
}());
// See https://stackoverflow.com/a/2117523
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
    });
}
/* harmony default export */ __webpack_exports__["default"] = (AuthService);


/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(218).Buffer
var Querystring = __webpack_require__(219)
var defaultRequest = __webpack_require__(222)

const DEFAULT_URL_BASE = 'https://example.org/'

var btoa
if (typeof Buffer === 'function') {
  btoa = btoaBuffer
} else {
  btoa = window.btoa.bind(window)
}

/**
 * Export `ClientOAuth2` class.
 */
module.exports = ClientOAuth2

/**
 * Default headers for executing OAuth 2.0 flows.
 */
var DEFAULT_HEADERS = {
  Accept: 'application/json, application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded'
}

/**
 * Format error response types to regular strings for displaying to clients.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
var ERROR_RESPONSES = {
  invalid_request: [
    'The request is missing a required parameter, includes an',
    'invalid parameter value, includes a parameter more than',
    'once, or is otherwise malformed.'
  ].join(' '),
  invalid_client: [
    'Client authentication failed (e.g., unknown client, no',
    'client authentication included, or unsupported',
    'authentication method).'
  ].join(' '),
  invalid_grant: [
    'The provided authorization grant (e.g., authorization',
    'code, resource owner credentials) or refresh token is',
    'invalid, expired, revoked, does not match the redirection',
    'URI used in the authorization request, or was issued to',
    'another client.'
  ].join(' '),
  unauthorized_client: [
    'The client is not authorized to request an authorization',
    'code using this method.'
  ].join(' '),
  unsupported_grant_type: [
    'The authorization grant type is not supported by the',
    'authorization server.'
  ].join(' '),
  access_denied: [
    'The resource owner or authorization server denied the request.'
  ].join(' '),
  unsupported_response_type: [
    'The authorization server does not support obtaining',
    'an authorization code using this method.'
  ].join(' '),
  invalid_scope: [
    'The requested scope is invalid, unknown, or malformed.'
  ].join(' '),
  server_error: [
    'The authorization server encountered an unexpected',
    'condition that prevented it from fulfilling the request.',
    '(This error code is needed because a 500 Internal Server',
    'Error HTTP status code cannot be returned to the client',
    'via an HTTP redirect.)'
  ].join(' '),
  temporarily_unavailable: [
    'The authorization server is currently unable to handle',
    'the request due to a temporary overloading or maintenance',
    'of the server.'
  ].join(' ')
}

/**
 * Support base64 in node like how it works in the browser.
 *
 * @param  {string} string
 * @return {string}
 */
function btoaBuffer (string) {
  return Buffer.from(string).toString('base64')
}

/**
 * Check if properties exist on an object and throw when they aren't.
 *
 * @throws {TypeError} If an expected property is missing.
 *
 * @param {Object}    obj
 * @param {...string} props
 */
function expects (obj) {
  for (var i = 1; i < arguments.length; i++) {
    var prop = arguments[i]

    if (obj[prop] == null) {
      throw new TypeError('Expected "' + prop + '" to exist')
    }
  }
}

/**
 * Pull an authentication error from the response data.
 *
 * @param  {Object} data
 * @return {string}
 */
function getAuthError (body) {
  var message = ERROR_RESPONSES[body.error] ||
    body.error_description ||
    body.error

  if (message) {
    var err = new Error(message)
    err.body = body
    err.code = 'EAUTH'
    return err
  }
}

/**
 * Attempt to parse response body as JSON, fall back to parsing as a query string.
 *
 * @param {string} body
 * @return {Object}
 */
function parseResponseBody (body) {
  try {
    return JSON.parse(body)
  } catch (e) {
    return Querystring.parse(body)
  }
}

/**
 * Sanitize the scopes option to be a string.
 *
 * @param  {Array}  scopes
 * @return {string}
 */
function sanitizeScope (scopes) {
  return Array.isArray(scopes) ? scopes.join(' ') : toString(scopes)
}

/**
 * Create a request uri based on an options object and token type.
 *
 * @param  {Object} options
 * @param  {string} tokenType
 * @return {string}
 */
function createUri (options, tokenType) {
  // Check the required parameters are set.
  expects(options, 'clientId', 'authorizationUri')

  const qs = {
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: tokenType,
    state: options.state
  }
  if (options.scopes !== undefined) {
    qs.scope = sanitizeScope(options.scopes)
  }

  const sep = options.authorizationUri.includes('?') ? '&' : '?'
  return options.authorizationUri + sep + Querystring.stringify(
    Object.assign(qs, options.query))
}

/**
 * Create basic auth header.
 *
 * @param  {string} username
 * @param  {string} password
 * @return {string}
 */
function auth (username, password) {
  return 'Basic ' + btoa(toString(username) + ':' + toString(password))
}

/**
 * Ensure a value is a string.
 *
 * @param  {string} str
 * @return {string}
 */
function toString (str) {
  return str == null ? '' : String(str)
}

/**
 * Merge request options from an options object.
 */
function requestOptions (requestOptions, options) {
  return {
    url: requestOptions.url,
    method: requestOptions.method,
    body: Object.assign({}, requestOptions.body, options.body),
    query: Object.assign({}, requestOptions.query, options.query),
    headers: Object.assign({}, requestOptions.headers, options.headers)
  }
}

/**
 * Construct an object that can handle the multiple OAuth 2.0 flows.
 *
 * @param {Object} options
 */
function ClientOAuth2 (options, request) {
  this.options = options
  this.request = request || defaultRequest

  this.code = new CodeFlow(this)
  this.token = new TokenFlow(this)
  this.owner = new OwnerFlow(this)
  this.credentials = new CredentialsFlow(this)
  this.jwt = new JwtBearerFlow(this)
}

/**
 * Alias the token constructor.
 *
 * @type {Function}
 */
ClientOAuth2.Token = ClientOAuth2Token

/**
 * Create a new token from existing data.
 *
 * @param  {string} access
 * @param  {string} [refresh]
 * @param  {string} [type]
 * @param  {Object} [data]
 * @return {Object}
 */
ClientOAuth2.prototype.createToken = function (access, refresh, type, data) {
  var options = Object.assign(
    {},
    data,
    typeof access === 'string' ? { access_token: access } : access,
    typeof refresh === 'string' ? { refresh_token: refresh } : refresh,
    typeof type === 'string' ? { token_type: type } : type
  )

  return new ClientOAuth2.Token(this, options)
}

/**
 * Using the built-in request method, we'll automatically attempt to parse
 * the response.
 *
 * @param  {Object}  options
 * @return {Promise}
 */
ClientOAuth2.prototype._request = function (options) {
  var url = options.url
  var body = Querystring.stringify(options.body)
  var query = Querystring.stringify(options.query)

  if (query) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + query
  }

  return this.request(options.method, url, body, options.headers)
    .then(function (res) {
      var body = parseResponseBody(res.body)
      var authErr = getAuthError(body)

      if (authErr) {
        return Promise.reject(authErr)
      }

      if (res.status < 200 || res.status >= 399) {
        var statusErr = new Error('HTTP status ' + res.status)
        statusErr.status = res.status
        statusErr.body = res.body
        statusErr.code = 'ESTATUS'
        return Promise.reject(statusErr)
      }

      return body
    })
}

/**
 * General purpose client token generator.
 *
 * @param {Object} client
 * @param {Object} data
 */
function ClientOAuth2Token (client, data) {
  this.client = client
  this.data = data
  this.tokenType = data.token_type && data.token_type.toLowerCase()
  this.accessToken = data.access_token
  this.refreshToken = data.refresh_token

  this.expiresIn(Number(data.expires_in))
}

/**
 * Expire the token after some time.
 *
 * @param  {number|Date} duration Seconds from now to expire, or a date to expire on.
 * @return {Date}
 */
ClientOAuth2Token.prototype.expiresIn = function (duration) {
  if (typeof duration === 'number') {
    this.expires = new Date()
    this.expires.setSeconds(this.expires.getSeconds() + duration)
  } else if (duration instanceof Date) {
    this.expires = new Date(duration.getTime())
  } else {
    throw new TypeError('Unknown duration: ' + duration)
  }

  return this.expires
}

/**
 * Sign a standardised request object with user authentication information.
 *
 * @param  {Object} requestObject
 * @return {Object}
 */
ClientOAuth2Token.prototype.sign = function (requestObject) {
  if (!this.accessToken) {
    throw new Error('Unable to sign without access token')
  }

  requestObject.headers = requestObject.headers || {}

  if (this.tokenType === 'bearer') {
    requestObject.headers.Authorization = 'Bearer ' + this.accessToken
  } else {
    var parts = requestObject.url.split('#')
    var token = 'access_token=' + this.accessToken
    var url = parts[0].replace(/[?&]access_token=[^&#]/, '')
    var fragment = parts[1] ? '#' + parts[1] : ''

    // Prepend the correct query string parameter to the url.
    requestObject.url = url + (url.indexOf('?') > -1 ? '&' : '?') + token + fragment

    // Attempt to avoid storing the url in proxies, since the access token
    // is exposed in the query parameters.
    requestObject.headers.Pragma = 'no-store'
    requestObject.headers['Cache-Control'] = 'no-store'
  }

  return requestObject
}

/**
 * Refresh a user access token with the supplied token.
 *
 * @param  {Object}  opts
 * @return {Promise}
 */
ClientOAuth2Token.prototype.refresh = function (opts) {
  var self = this
  var options = Object.assign({}, this.client.options, opts)

  if (!this.refreshToken) {
    return Promise.reject(new Error('No refresh token'))
  }

  return this.client._request(requestOptions({
    url: options.accessTokenUri,
    method: 'POST',
    headers: Object.assign({}, DEFAULT_HEADERS, {
      Authorization: auth(options.clientId, options.clientSecret)
    }),
    body: {
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token'
    }
  }, options))
    .then(function (data) {
      return self.client.createToken(Object.assign({}, self.data, data))
    })
}

/**
 * Check whether the token has expired.
 *
 * @return {boolean}
 */
ClientOAuth2Token.prototype.expired = function () {
  return Date.now() > this.expires.getTime()
}

/**
 * Support resource owner password credentials OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.3
 *
 * @param {ClientOAuth2} client
 */
function OwnerFlow (client) {
  this.client = client
}

/**
 * Make a request on behalf of the user credentials to get an access token.
 *
 * @param  {string}  username
 * @param  {string}  password
 * @param  {Object}  [opts]
 * @return {Promise}
 */
OwnerFlow.prototype.getToken = function (username, password, opts) {
  var self = this
  var options = Object.assign({}, this.client.options, opts)

  const body = {
    username: username,
    password: password,
    grant_type: 'password'
  }
  if (options.scopes !== undefined) {
    body.scope = sanitizeScope(options.scopes)
  }

  return this.client._request(requestOptions({
    url: options.accessTokenUri,
    method: 'POST',
    headers: Object.assign({}, DEFAULT_HEADERS, {
      Authorization: auth(options.clientId, options.clientSecret)
    }),
    body: body
  }, options))
    .then(function (data) {
      return self.client.createToken(data)
    })
}

/**
 * Support implicit OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.2
 *
 * @param {ClientOAuth2} client
 */
function TokenFlow (client) {
  this.client = client
}

/**
 * Get the uri to redirect the user to for implicit authentication.
 *
 * @param  {Object} [opts]
 * @return {string}
 */
TokenFlow.prototype.getUri = function (opts) {
  var options = Object.assign({}, this.client.options, opts)

  return createUri(options, 'token')
}

/**
 * Get the user access token from the uri.
 *
 * @param  {string|Object} uri
 * @param  {Object}        [opts]
 * @return {Promise}
 */
TokenFlow.prototype.getToken = function (uri, opts) {
  var options = Object.assign({}, this.client.options, opts)
  var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE)
  var expectedUrl = new URL(options.redirectUri, DEFAULT_URL_BASE)

  if (typeof url.pathname === 'string' && url.pathname !== expectedUrl.pathname) {
    return Promise.reject(
      new TypeError('Redirected path should match configured path, but got: ' + url.pathname)
    )
  }

  // If no query string or fragment exists, we won't be able to parse
  // any useful information from the uri.
  if (!url.hash && !url.search) {
    return Promise.reject(new TypeError('Unable to process uri: ' + uri))
  }

  // Extract data from both the fragment and query string. The fragment is most
  // important, but the query string is also used because some OAuth 2.0
  // implementations (Instagram) have a bug where state is passed via query.
  var data = Object.assign(
    {},
    typeof url.search === 'string' ? Querystring.parse(url.search.substr(1)) : (url.search || {}),
    typeof url.hash === 'string' ? Querystring.parse(url.hash.substr(1)) : (url.hash || {})
  )

  var err = getAuthError(data)

  // Check if the query string was populated with a known error.
  if (err) {
    return Promise.reject(err)
  }

  // Check whether the state matches.
  if (options.state != null && data.state !== options.state) {
    return Promise.reject(new TypeError('Invalid state: ' + data.state))
  }

  // Initalize a new token and return.
  return Promise.resolve(this.client.createToken(data))
}

/**
 * Support client credentials OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.4
 *
 * @param {ClientOAuth2} client
 */
function CredentialsFlow (client) {
  this.client = client
}

/**
 * Request an access token using the client credentials.
 *
 * @param  {Object}  [opts]
 * @return {Promise}
 */
CredentialsFlow.prototype.getToken = function (opts) {
  var self = this
  var options = Object.assign({}, this.client.options, opts)

  expects(options, 'clientId', 'clientSecret', 'accessTokenUri')

  const body = {
    grant_type: 'client_credentials'
  }

  if (options.scopes !== undefined) {
    body.scope = sanitizeScope(options.scopes)
  }

  return this.client._request(requestOptions({
    url: options.accessTokenUri,
    method: 'POST',
    headers: Object.assign({}, DEFAULT_HEADERS, {
      Authorization: auth(options.clientId, options.clientSecret)
    }),
    body: body
  }, options))
    .then(function (data) {
      return self.client.createToken(data)
    })
}

/**
 * Support authorization code OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1
 *
 * @param {ClientOAuth2} client
 */
function CodeFlow (client) {
  this.client = client
}

/**
 * Generate the uri for doing the first redirect.
 *
 * @param  {Object} [opts]
 * @return {string}
 */
CodeFlow.prototype.getUri = function (opts) {
  var options = Object.assign({}, this.client.options, opts)

  return createUri(options, 'code')
}

/**
 * Get the code token from the redirected uri and make another request for
 * the user access token.
 *
 * @param  {string|Object} uri
 * @param  {Object}        [opts]
 * @return {Promise}
 */
CodeFlow.prototype.getToken = function (uri, opts) {
  var self = this
  var options = Object.assign({}, this.client.options, opts)

  expects(options, 'clientId', 'accessTokenUri')

  var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE)

  if (
    typeof options.redirectUri === 'string' &&
    typeof url.pathname === 'string' &&
    url.pathname !== (new URL(options.redirectUri, DEFAULT_URL_BASE)).pathname
  ) {
    return Promise.reject(
      new TypeError('Redirected path should match configured path, but got: ' + url.pathname)
    )
  }

  if (!url.search || !url.search.substr(1)) {
    return Promise.reject(new TypeError('Unable to process uri: ' + uri))
  }

  var data = typeof url.search === 'string'
    ? Querystring.parse(url.search.substr(1))
    : (url.search || {})
  var err = getAuthError(data)

  if (err) {
    return Promise.reject(err)
  }

  if (options.state != null && data.state !== options.state) {
    return Promise.reject(new TypeError('Invalid state: ' + data.state))
  }

  // Check whether the response code is set.
  if (!data.code) {
    return Promise.reject(new TypeError('Missing code, unable to request token'))
  }

  var headers = Object.assign({}, DEFAULT_HEADERS)
  var body = { code: data.code, grant_type: 'authorization_code', redirect_uri: options.redirectUri }

  // `client_id`: REQUIRED, if the client is not authenticating with the
  // authorization server as described in Section 3.2.1.
  // Reference: https://tools.ietf.org/html/rfc6749#section-3.2.1
  if (options.clientSecret) {
    headers.Authorization = auth(options.clientId, options.clientSecret)
  } else {
    body.client_id = options.clientId
  }

  return this.client._request(requestOptions({
    url: options.accessTokenUri,
    method: 'POST',
    headers: headers,
    body: body
  }, options))
    .then(function (data) {
      return self.client.createToken(data)
    })
}

/**
 * Support JSON Web Token (JWT) Bearer Token OAuth 2.0 grant.
 *
 * Reference: https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12#section-2.1
 *
 * @param {ClientOAuth2} client
 */
function JwtBearerFlow (client) {
  this.client = client
}

/**
 * Request an access token using a JWT token.
 *
 * @param  {string} token     A JWT token.
 * @param  {Object} [opts]
 * @return {Promise}
 */
JwtBearerFlow.prototype.getToken = function (token, opts) {
  var self = this
  var options = Object.assign({}, this.client.options, opts)
  var headers = Object.assign({}, DEFAULT_HEADERS)

  expects(options, 'accessTokenUri')

  // Authentication of the client is optional, as described in
  // Section 3.2.1 of OAuth 2.0 [RFC6749]
  if (options.clientId) {
    headers.Authorization = auth(options.clientId, options.clientSecret)
  }

  const body = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
  }

  if (options.scopes !== undefined) {
    body.scope = sanitizeScope(options.scopes)
  }

  return this.client._request(requestOptions({
    url: options.accessTokenUri,
    method: 'POST',
    headers: headers,
    body: body
  }, options))
    .then(function (data) {
      return self.client.createToken(data)
    })
}


/***/ }),

/***/ 218:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(220);
exports.encode = exports.stringify = __webpack_require__(221);


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ 222:
/***/ (function(module, exports) {

/**
 * Make a request using `XMLHttpRequest`.
 *
 * @param   {string}  method
 * @param   {string}  url
 * @param   {string}  body
 * @param   {Object}  headers
 * @returns {Promise}
 */
module.exports = function request (method, url, body, headers) {
  return new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest()

    xhr.open(method, url)

    xhr.onload = function () {
      return resolve({
        status: xhr.status,
        body: xhr.responseText
      })
    }

    xhr.onerror = xhr.onabort = function () {
      return reject(new Error(xhr.statusText || 'XHR aborted: ' + url))
    }

    Object.keys(headers).forEach(function (header) {
      xhr.setRequestHeader(header, headers[header])
    })

    xhr.send(body)
  })
}


/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(224);
var parse = __webpack_require__(234);
var formats = __webpack_require__(85);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getSideChannel = __webpack_require__(225);
var utils = __webpack_require__(127);
var formats = __webpack_require__(85);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
                var valuesArray = split.call(String(obj), ',');
                var valuesJoined = '';
                for (var i = 0; i < valuesArray.length; ++i) {
                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults.encoder, charset, 'value', format));
                }
                return [formatter(keyValue) + '=' + valuesJoined];
            }
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 225:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(83);
var callBound = __webpack_require__(230);
var inspect = __webpack_require__(232);

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};


/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(227);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(84);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(83);

var callBind = __webpack_require__(231);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(84);
var GetIntrinsic = __webpack_require__(83);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var inspectCustom = __webpack_require__(233).custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if ('cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 233:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 234:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(127);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 235:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  // chrome.tabs is only available in background scripts
  if (window.location.protocol !== 'moz-extension:') { // see ChromeTabs usage in ./window
    module.exports = { };
    return;
  }

  var chrome = __webpack_require__(33);
  var Utils = __webpack_require__(15);

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

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var loader = __webpack_require__(65);

    var Promise = __webpack_require__(6);

    var Storage = __webpack_require__(49);

    var Log = __webpack_require__(18);

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
      } // Join all the hex strings into one


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
      } //var buffer = String.fromCharCode.apply(null, new Uint16Array(buf));new TextEncoder('utf-8').encode(v);


      return window.crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
        return toHexString(hash);
      });
    }

    function loadSettings(configuration, languageId, update) {
      if (settings !== null && !update) {
        return Promise.resolve(settings);
      }

      if (!configuration) {
        return Promise.reject({
          error: {
            noconfiguration: true
          }
        });
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
        unifiedPortalUri: configuration['UNIFIED_PORTAL_URI'] || '',
        // to be removed
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
        clientUrl: configuration['clientUrl']
      };
      var validateArray = [settings.conferenceAccessNumber, settings.conferenceAdditionalNumbers, settings.unifiedPortalEnabled, settings.unifiedPortalUri, settings.unifiedPortalUsername, settings.unifiedPortalSSO, settings.unifiedPortalPassword, settings.unifiedPortalDelegateName, settings.conferenceFQDNSIPDialList, settings.conferencePortalUri, settings.conferenceModeratorCode, settings.conferenceModeratorUrl, settings.conferenceParticipantCode, settings.conferenceParticipantUrl, settings.conferenceType];
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
      var config = {};
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

    function getAPIConfig(configuration, languageId, update) {
      return loadSettings(configuration, languageId, update).then(function (settings) {
        var config = buildAPIConfig(settings);
        config.settings = settings;
        return Promise.resolve(config);
      });
    }

    function clear() {
      settings = null;
    }

    loader.load('/lib/contrib/webcrypto-shim.js', 'crypto');
    module.exports = {
      getAPIConfig: getAPIConfig,
      clear: clear
    };
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var API = __webpack_require__(97);

    var methods = {
      info: {
        uri: '/ups/resources/$(tenantId)',
        method: 'GET',
        headers: {
          'authorization': '$(token)'
        },
        body: null,
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 's',
            format: 'UPToken $0'
          }
        },
        response: {
          portalVersion: {
            key: 'portalVersion',
            flags: 'Sr'
          },
          multitenant: {
            key: 'multitenant',
            flags: 'br'
          },
          iwaEnabled: {
            key: 'iwaEnabled',
            flags: 'br'
          },
          scopiaUrl: {
            key: 'scopiaDesktopServerURL',
            flags: 's'
          },
          oauth2AuthenticationUrl: {
            key: 'oauth2AuthenticationUrl',
            flags: 's'
          },
          supportedAuthType: {
            key: 'supportedAuthType',
            flags: 's'
          },
          oauthCodeToTokenExchangeUrl: {
            key: 'oauthCodeToTokenExchangeUrl',
            flags: 's'
          },
          oauth2ClientId: {
            key: 'oauth2ClientId',
            flags: 's'
          },
          self: {
            $v: {
              email: {
                key: 'self.email',
                flags: 'sr'
              },
              firstName: {
                key: 'self.firstName',
                flags: 's'
              },
              lastName: {
                key: 'self.lastName',
                flags: 's'
              },
              userId: {
                key: 'self.userId',
                flags: 's'
              },
              scopiaUserId: {
                key: 'self.scopiaUserId',
                flags: 's'
              },
              scopiaTenantId: {
                key: 'self.scopiaMemberId',
                flags: 's'
              }
            }
          },
          loginInfo: {
            $v: {
              href: {
                key: 'resources.authentication.POST.login.href',
                flags: 'Sr'
              },
              requestTypes: {
                key: 'resources.authentication.POST.login.requestTypes',
                flags: 'O'
              },
              responseTypes: {
                key: 'resources.authentication.POST.login.responseTypes',
                flags: 'O'
              }
            }
          },
          getUserDetailsInfo: {
            $v: {
              href: {
                key: 'resources.userdetails.GET.getUserDetails.href',
                flags: 'Sr'
              },
              requestTypes: {
                key: 'resources.userdetails.GET.getUserDetails.requestTypes',
                flags: 'O'
              },
              responseTypes: {
                key: 'resources.userdetails.GET.getUserDetails.responseTypes',
                flags: 'O'
              }
            }
          }
        }
      },
      refreshToken: {
        uri: '/ups/resources/$(tenantId)authentication/login',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'Sr',
            format: 'UPToken $0'
          },
          userId: {
            key: '$(userId)',
            flags: 's'
          },
          passwordHash: {
            key: '$(passwordHash)',
            flags: 's'
          },
          aliasId: {
            key: '$(aliasId)',
            flags: 's',
            "default": 'default'
          }
        },
        body: {
          'login': '$(userId)',
          'encryptedPassword': '$(passwordHash)',
          'organizationAlias': '$(aliasId)'
        },
        response: {
          token: {
            key: 'token',
            flags: 'Sr'
          },
          expires: {
            key: 'expirationTime',
            flags: 'D'
          },
          passwordHash: {
            key: 'encryptedPassword',
            flags: 's'
          }
        }
      },
      login: {
        uri: '/ups/resources/$(tenantId)authentication/login',
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          aliasId: {
            key: '$(aliasId)',
            flags: 's',
            "default": 'default'
          },
          userId: {
            key: '$(userId)',
            flags: 's'
          },
          password: {
            key: '$(password)',
            flags: 's'
          }
        },
        body: {
          'login': '$(userId)',
          'organizationAlias': '$(aliasId)',
          'password': '$(password)'
        },
        response: {
          token: {
            key: 'token',
            flags: 'Sr'
          },
          expires: {
            key: 'expirationTime',
            flags: 'D'
          },
          passwordHash: {
            key: 'encryptedPassword',
            flags: 's'
          }
        }
      },
      loginV2: {
        uri: '/ups/resources/$(tenantId)authentication/login',
        method: 'POST',
        headers: {
          'content-type': 'application/vnd.avaya.portal.authentication.login.v2+json',
          'authorization': '$(credentials)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          aliasId: {
            key: '$(aliasId)',
            flags: 's',
            "default": 'default'
          },
          credentials: {
            key: '$(credentials)',
            flags: 'Sr',
            format: 'UnifiedPortal $0'
          }
        },
        body: {
          'organizationAlias': '$(aliasId)'
        },
        response: {
          token: {
            key: 'token',
            flags: 'Sr'
          },
          expires: {
            key: 'expirationTime',
            flags: 'D'
          },
          passwordHash: {
            key: 'encryptedPassword',
            flags: 's'
          }
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
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          aliasId: {
            key: '$(aliasId)',
            flags: 's',
            "default": 'default'
          }
        },
        body: {
          'organizationAlias': '$(aliasId)'
        },
        response: {
          token: {
            key: 'token',
            flags: 'Sr'
          },
          expires: {
            key: 'expirationTime',
            flags: 'D'
          },
          passwordHash: {
            key: 'encryptedPassword',
            flags: 's'
          }
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
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          aliasId: {
            key: '$(aliasId)',
            flags: 's',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'Sr',
            format: 'UPToken $0'
          },
          offset: {
            key: '$(offset)',
            flags: 'i',
            "default": 1
          },
          pageSize: {
            key: '$(pageSize)',
            flags: 'i',
            "default": 20
          },
          userId: {
            key: '$(userId)',
            flags: 'Sr'
          }
        },
        body: {
          memberId: '$(aliasId)',
          offset: '$(offset)',
          pageSize: '$(pageSize)',
          loginId: '$(userId)'
        },
        response: {
          totalCount: {
            key: 'totalCount ',
            flags: 'i'
          },
          rooms: [{
            id: {
              key: 'virtualRoom.#.virtualRoomId',
              flags: 'Sr'
            },
            name: {
              key: 'virtualRoom.#.name',
              flags: 'Sr'
            },
            number: {
              key: 'virtualRoom.#.number',
              flags: 'Sr'
            },
            userId: {
              key: 'virtualRoom.#.userId',
              flags: 'Sr'
            },
            accessPIN: {
              key: 'virtualRoom.#.accessPIN',
              flags: 'B',
              "default": ''
            },
            autoExtend: {
              key: 'virtualRoom.#.autoExtend',
              flags: 'br'
            },
            blockDialIn: {
              key: 'virtualRoom.#.blockDialIn',
              flags: 'br'
            },
            isDefault: {
              key: 'virtualRoom.#.default',
              flags: 'br'
            },
            maxParticipants: {
              key: 'virtualRoom.#.maxParticipants',
              flags: 'ir'
            },
            moderatorPIN: {
              key: 'virtualRoom.#.moderatorPIN',
              flags: 'B'
            },
            oneTimePINRequired: {
              key: 'virtualRoom.#.oneTimePINRequired',
              flags: 'b'
            },
            priority: {
              key: 'virtualRoom.#.priority',
              flags: 'er'
            },
            isPublic: {
              key: 'virtualRoom.#.public',
              flags: 'br'
            },
            servicePrefix: {
              key: 'virtualRoom.#.servicePrefix',
              flags: 'sr'
            },
            serviceTemplateId: {
              key: 'virtualRoom.#.serviceTemplateId',
              flags: 'sr'
            },
            streamingStatus: {
              key: 'virtualRoom.#.streamingStatus',
              flags: 'er'
            },
            waitingRoom: {
              key: 'virtualRoom.#.waitingRoom',
              flags: 'br'
            },
            allowKnocking: {
              key: 'virtualRoom.#.allowKnocking',
              flags: 'br'
            },
            allowRecording: {
              key: 'virtualRoom.#.allowRecording',
              flags: 'er'
            },
            allowStreaming: {
              key: 'virtualRoom.#.allowStreaming',
              flags: 'er'
            },
            durationAfterLeft: {
              key: 'virtualRoom.#.advancedProperties.durationAfterLeft',
              flags: 'T'
            },
            minutesBeforeTermination: {
              key: 'virtualRoom.#.advancedProperties.minutesBeforeTermination',
              flags: 'T'
            },
            terminationCondition: {
              key: 'virtualRoom.#.advancedProperties.terminationCondition',
              flags: 'e'
            },
            portsFullHD: {
              key: 'virtualRoom.#.reservedPorts.fullHD',
              flags: 'i',
              "default": 0
            },
            portsHD: {
              key: 'virtualRoom.#.reservedPorts.hd',
              flags: 'i',
              "default": 0
            },
            portsRegular: {
              key: 'virtualRoom.#.reservedPorts.regular',
              flags: 'i',
              "default": 0
            },
            portsSD: {
              key: 'virtualRoom.#.reservedPorts.sd',
              flags: 'i',
              "default": 0
            }
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
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          accessPIN: {
            key: '$(accessPIN)',
            flags: 's'
          },
          confGID: {
            key: '$(confGID)',
            flags: 's'
          },
          dialableNumber: {
            key: '$(dialableNumber)',
            flags: 'Sr'
          },
          forReservation: {
            key: '$(forReservation)',
            flags: 'b'
          },
          loginId: {
            key: '$(loginId)',
            flags: 's'
          },
          memberId: {
            key: '$(memberId)',
            flags: 's'
          },
          servicePrefix: {
            key: '$(servicePrefix)',
            flags: 's'
          },
          serviceTemplateId: {
            key: '$(serviceTemplateId)',
            flags: 's'
          },
          userId: {
            key: '$(userId)',
            flags: 's'
          }
        },
        body: {
          'AccessPIN': '$(accessPIN)',
          'ConfGID': '$(confGID)',
          'DialableNumber': '$(dialableNumber)',
          'ForReservation': '$(forReservation)',
          'LoginId': '$(loginId)',
          'MemberId': '$(memberId)',
          'ServicePrefix': '$(servicePrefix)',
          'ServiceTemplateId': '$(serviceTemplateId)',
          'UserId': '$(userId)'
        },
        response: {
          dialingInfoText: {
            key: 'DialingInfo.Description',
            flags: 's'
          },
          dialingInfoHTML: {
            key: 'DialingInfo.DescriptionOfHTML',
            flags: 's'
          },
          location: {
            key: 'DialingInfo.LocationInfo',
            flags: 's'
          },
          childMeetingNumber: {
            key: 'DialingInfo.ChildMeetingNumber',
            flags: 's'
          },
          meetingPin: {
            key: 'DialingInfo.MeetingPin',
            flags: 's'
          },
          requestId: {
            key: 'RequestID',
            flags: 's'
          },
          result: {
            key: 'ReturnValue',
            flags: 'er'
          }
        }
      },
      getUserDetails: {
        uri: '$(uri)',
        method: 'GET',
        headers: {
          'authorization': '$(token)',
          'content-type': '$(contentType)'
        },
        args: {
          uri: {
            key: '$(uri)',
            flags: 'S'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          contentType: {
            key: '$(contentType)',
            flags: 'S'
          }
        },
        body: null,
        response: {
          canReserveMeetingsFromOutlookPlugin: {
            key: 'conferencing.canReserveMeetingsFromOutlookPlugin',
            flags: 'b'
          },
          virtualRoomSettings: [{
            number: {
              key: 'conferencing.virtualRoomSettings.#.number',
              flags: 's'
            },
            servicePrefix: {
              key: 'conferencing.virtualRoomSettings.#.servicePrefix',
              flags: 's'
            },
            serviceTemplateId: {
              key: 'conferencing.virtualRoomSettings.#.serviceTemplateId',
              flags: 's'
            },
            protectMeetingWithParticipantId: {
              key: 'conferencing.virtualRoomSettings.#.protectMeetingWithParticipantId',
              flags: 'b'
            }
          }]
        }
      },
      search: {
        uri: '/ups/resources/$(tenantId)conference/?conferenceId=$(conferenceId)',
        method: 'GET',
        headers: {
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          }
        },
        response: {
          conferences: {
            key: 'conferences',
            flags: ''
          }
        }
      },
      searchByStartTime: {
        uri: '/ups/resources/$(tenantId)conference/?startTime=$(startTime)',
        method: 'GET',
        headers: {
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          startTime: {
            key: '$(startTime)',
            flags: 's'
          }
        },
        response: {
          conferences: {
            key: 'conferences',
            flags: ''
          }
        }
      },
      searchByGlobalUniqueId: {
        uri: '/ups/resources/$(tenantId)conference/?globalUniqueID=$(globalUniqueId)',
        method: 'GET',
        headers: {
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          globalUniqueId: {
            key: '$(globalUniqueId)',
            flags: 's'
          }
        },
        response: {
          conferences: {
            key: 'conferences',
            flags: ''
          }
        }
      },
      searchOccurence: {
        uri: '/ups/resources/$(tenantId)conference/?conferenceId=$(conferenceId)&originalStartTime=$(originalStartTime)',
        method: 'GET',
        headers: {
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          },
          originalStartTime: {
            key: '$(originalStartTime)',
            flags: 's'
          }
        },
        response: {
          conferences: {
            key: 'conferences',
            flags: ''
          }
        }
      },
      schedule: {
        uri: '/ups/resources/$(tenantId)conference/',
        method: 'POST',
        headers: {
          'content-type': 'application/vnd.avaya.portal.meeting.schedule.v2+json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          number: {
            key: '$(number)',
            flags: 's'
          },
          parentMeetingNumber: {
            key: '$(parentMeetingNumber)',
            flags: 's'
          },
          subject: {
            key: '$(subject)',
            flags: 's'
          },
          startTime: {
            key: '$(startTime)',
            flags: 's'
          },
          duration: {
            key: '$(duration)',
            flags: 's'
          },
          timeZoneId: {
            key: '$(timeZoneId)',
            flags: 's'
          },
          accessPIN: {
            key: '$(accessPIN)',
            flags: 'A'
          },
          terminationCondition: {
            key: '$(terminationCondition)',
            flags: 's'
          },
          moderatorPIN: {
            key: '$(moderatorPIN)',
            flags: 'A'
          },
          daily: {
            key: '$(daily)',
            flags: ''
          },
          weekly: {
            key: '$(weekly)',
            flags: ''
          },
          monthly: {
            key: '$(monthly)',
            flags: ''
          },
          yearly: {
            key: '$(yearly)',
            flags: ''
          },
          recurrenceEnd: {
            key: '$(recurrenceEnd)',
            flags: ''
          },
          client: {
            key: '$(client)',
            flags: 's'
          },
          globalUniqueId: {
            key: '$(globalUniqueId)',
            flags: 's'
          } //userId: { key: '$(userId)', flags: 's' },
          //loginId: { key: '$(loginId)', flags: 's' }

        },
        body: {
          conference: [{
            number: '$(number)',
            parentMeetingNumber: '$(parentMeetingNumber)',
            subject: '$(subject)',
            startTime: '$(startTime)',
            duration: '$(duration)',
            timeZoneId: '$(timeZoneId)',
            accessPIN: '$(accessPIN)',
            moderatorPIN: '$(moderatorPIN)',
            advancedProperties: {
              terminationCondition: '$(terminationCondition)'
            },
            daily: '$(daily)',
            weekly: '$(weekly)',
            monthly: '$(monthly)',
            yearly: '$(yearly)',
            recurrenceEnd: '$(recurrenceEnd)',
            client: '$(client)',
            globalUniqueID: '$(globalUniqueId)' //userId: '$(userId)',
            //loginId: '$(loginId)'

          }]
        },
        response: {
          meetingId: {
            key: 'number',
            flags: 's'
          },
          conferenceId: {
            key: 'conferenceId',
            flags: 's'
          }
        }
      },
      reschedule: {
        uri: '/ups/resources/$(tenantId)conference/$(conferenceId)',
        method: 'PUT',
        headers: {
          'content-type': 'application/vnd.avaya.portal.meeting.update.v2+json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          },
          conference: {
            key: '$(conference)',
            flags: ''
          }
        },
        body: {
          conference: '$(conference)'
        },
        response: {
          success: {
            key: 'success',
            flags: 'b'
          }
        }
      },
      "delete": {
        uri: '/ups/resources/$(tenantId)conference/$(conferenceId)',
        method: 'DELETE',
        headers: {
          'content-type': 'application/vnd.avaya.portal.meeting.cancel.v1+json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          }
        },
        body: {},
        response: {}
      },
      deleteOccurrenceByStartTime: {
        uri: '/ups/resources/$(tenantId)conference/$(conferenceId)?startTime=$(startTime)',
        method: 'DELETE',
        headers: {
          'content-type': 'application/vnd.avaya.portal.meeting.cancel.v1+json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          },
          startTime: {
            key: '$(startTime)',
            flags: 's'
          }
        },
        body: {},
        response: {}
      },
      deleteOccurrence: {
        uri: '/ups/resources/$(tenantId)conference/$(conferenceId)?&originalStartTime=$(originalStartTime)',
        method: 'DELETE',
        headers: {
          'content-type': 'application/vnd.avaya.portal.meeting.cancel.v1+json',
          'authorization': '$(token)'
        },
        args: {
          tenantId: {
            key: '$(tenantId)',
            flags: 's',
            format: 'tenants/$0/',
            "default": 'default'
          },
          token: {
            key: '$(token)',
            flags: 'S',
            format: 'UPToken $0'
          },
          conferenceId: {
            key: '$(conferenceId)',
            flags: 's'
          },
          originalStartTime: {
            key: '$(originalStartTime)',
            flags: 's'
          }
        },
        body: {},
        response: {}
      }
    };

    function RoomsAPI(serverBase) {
      this.$super(serverBase);
    }

    Object.getOwnPropertyNames(methods).forEach(function (name) {
      RoomsAPI.prototype[name] = function (args) {
        return this._exec(methods[name], args);
      };
    }, this);
    module.exports = API.extend(RoomsAPI);
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Log = __webpack_require__(18);

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

      for (var m; (m = reUri.exec(s)) && m[3];) {
        var uri = {
          proto: m[1] || 'http://',
          serverName: m[3].toLowerCase(),
          port: m[5] || '',
          path: m[6] || '',
          query: m[7] || ''
        };
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

      for (var m; m = reTel.exec(s);) {
        if (m[1] && (m[1].indexOf('=') === 0 || m[1].indexOf('&') === 0)) {
          continue;
        }

        var tel = {
          phone: m[1],
          pin: m[4] || ''
        };
        tel.tel = tel.phone.replace(/[^0-9\+\*\#]/ig, '');
        r.push(tel);
      }

      return r;
    }

    function parseUrl(url) {
      url = url || '';

      if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
        url += 'https://';
      }

      return extractUrls(url)[0];
    } // Equinox validation


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

      return {
        url: url,
        room: room,
        pin: pin
      };
    }

    function validateEquinoxMeetingCode(info) {
      var reRoom = /VirtualRoom([: -,.]*)([0-9]*)/ig;
      var rePIN = /VirtualRoomPin([: -,.]*)([0-9\#\*]*)/ig;
      var location = info.location.value;
      var res = {
        room: '',
        pin: ''
      };
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
      var confInfo = {
        type: 'equinox',
        url: '',
        tel: '',
        room: '',
        dial: '',
        isHost: false,
        clientUrl: config.clientUrl
      };
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

      var telInfo = info.tels.reduce(function (r, item) {
        var pin = item.pin.replace(/[^0-9*#]/ig, '');
        var tel = item.tel.replace(/[^0-9*#]/ig, '');

        if (tel === r.room) {
          return r;
        }

        if (pin && pin.indexOf(r.room) === 0) {
          r.telRoom = r.telRoom || item.tel;
        } else {
          r.telFirst = r.telFirst || item.tel;
        }

        return r;
      }, {
        room: confInfo.room.replace(/[^0-9*#]/ig, '')
      });
      confInfo.tel = telInfo.telRoom || telInfo.telFirst || telInfo.room || '';

      if (!confInfo.room) {
        logger.info('validateEquinoxMeetingInfo (no room): ' + JSON.stringify(confInfo));
        return null;
      }

      var sipFQDNS = (config.conferenceFQDNSIPDialList || '').split(',');
      var sipUrls = sipFQDNS.map(function (item) {
        if (item.indexOf('http://') !== 0 && item.indexOf('https://') !== 0) {
          item = 'https://' + item;
        }

        return (parseUrl(item || '') || {}).serverName || '';
      });
      var confUrl = (parseUrl(confInfo.url || '') || {}).serverName;
      var sipDial = confUrl && sipUrls.indexOf(confUrl) >= 0;
      var pin = confInfo.pin;

      for (var i = 0; i < rooms.length; i++) {
        if (confInfo.room.indexOf(rooms[i].meetingId) === 0) {
          confInfo.id = rooms[i].id;
          confInfo.isHost = true; // ACMACOS-10934, ACW-11836
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
        } // ACMACOS-10934, ACW-11836 - should we add moderator code for non-sipDial case?


        confInfo.dial = confInfo.tel ? confInfo.tel + ',,' + (confInfo.room || '') + (pin ? '***' + pin : '') : '';
        confInfo.bridge = confInfo.tel || '';
      }

      return confInfo;
    } // Equinox validation
    // Cponference Validation


    function getConferenceInfoFromCodeAdjusted(code) {
      code = (code || '').replace(/^\,+/ig, '').replace(/\,+$/, '');
      var av = code.split(',');
      var room = av.shift().replace(/\#+$/, '');
      var pin = av.join(',');

      if (pin) {
        pin = ',' + pin;
      }

      return {
        room: room,
        pin: pin.replace(/^\,+/ig, ''),
        pinOrig: pin
      };
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
        return {
          url: url,
          room: info.room || '',
          pin: info.pin || ''
        };
      }
    }

    function validateConferenceMeetingCode(info) {
      var reCode = /(PC|PIN|Passcode)([\#\:])?[ ]*([0-9\#\*\,]+)/ig;

      var _info;

      var mlCode = reCode.exec(info.location.value);

      if (mlCode && mlCode[3]) {
        _info = getConferenceInfoFromCodeAdjusted(mlCode[3]);
        return {
          room: _info.room,
          _info: info.pin
        };
      }

      var mbCode = reCode.exec(info.body.value);

      if (mbCode && mbCode[3]) {
        _info = getConferenceInfoFromCodeAdjusted(mbCode[3]);
        return {
          room: _info.room,
          _info: info.pin
        };
      }
    }

    function validateConferenceMeetingInfo(config, info) {
      var confInfo = {
        type: config.conferenceType,
        url: '',
        tel: '',
        room: '',
        dial: '',
        isHost: false,
        clientUrl: config.clientUrl
      };
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
      } // in above block should we care if pin retrieved from url somehow, or forcing it from PC code or tels is ok


      var telInfo = info.tels.reduce(function (r, item) {
        var info = getConferenceInfoFromCodeAdjusted(item.pin);

        if (info.pin && (info.room === r.room || !r.room)) {
          r.telRoom = r.telRoom || item.tel;
          r.telPIN = r.telPIN || info.pin;

          if (!r.room) {
            r._room = r._room || info.room;
          }
        } else {
          r.telFirst = r.telFirst || item.tel;
        }

        return r;
      }, {
        room: confInfo.room.replace(/[^0-9*#]/ig, '')
      });
      confInfo.tel = telInfo.telRoom || telInfo.telFirst || '';

      if (!confInfo.room && telInfo._room) {
        confInfo.room = telInfo._room || '';
      }

      if (!confInfo.pin && telInfo.telPIN) {
        confInfo.pin = telInfo.telPIN || '';
      }

      if (!confInfo.room || !confInfo.url && !confInfo.tel) {
        logger.info('validateConferenceMeetingInfo (no room/url+tel): ' + JSON.stringify(confInfo));
        return null;
      }

      var confPC = (config.conferenceParticipantCode || '').replace(/[^0-9\*\#\,]/ig, '');
      var confPCInfo = getConferenceInfoFromCodeAdjusted(confPC);
      var confMC = (config.conferenceModeratorCode || '').replace(/[^0-9\*\#\,]/ig, '');
      var confMCInfo = getConferenceInfoFromCodeAdjusted(confMC);
      var roomNP = confInfo.room || '';
      var hostServer = (parseUrl(config.conferenceModeratorUrl) || {}).serverName || '-';
      var confServer = (parseUrl(confInfo.url) || {}).serverName || '';
      confInfo.isHost =
      /*(!confServer || (hostServer === confServer)) &&*/
      roomNP === confPCInfo.room;

      if (config.conferenceParticipantUrl && config.conferenceParticipantUrl === confInfo.url) {
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

      confInfo.dial = confInfo.tel ? confInfo.tel + (dtmf ? ',,' + dtmf : '') : '';
      return confInfo;
    } // Conference Validation


    function extractMeetingInfo(config, rooms, meeting) {
      rooms = rooms || [];
      logger.info('extractMeetingInfo rooms: ' + JSON.stringify(rooms));
      var extracted = {};
      extracted.location = {
        urls: extractUrls(meeting.location || ''),
        tels: extractTels(meeting.location || ''),
        value: meeting.location || ''
      };
      logger.info('extracted location: urls: ' + JSON.stringify(extracted.location.urls) + ', tels: ' + JSON.stringify(extracted.location.tels));
      extracted.body = {
        urls: extractUrls(meeting.body || ''),
        tels: extractTels(meeting.body || ''),
        value: meeting.body || ''
      };
      logger.info('extracted body: urls: ' + JSON.stringify(extracted.body.urls) + ', tels: ' + JSON.stringify(extracted.body.tels));
      extracted.urls = [].concat(extracted.location.urls, extracted.body.urls);
      extracted.tels = [].concat(extracted.location.tels, extracted.body.tels);
      var confInfo = validateEquinoxMeetingInfo(config, rooms, extracted);

      if (!confInfo) {
        confInfo = validateConferenceMeetingInfo(config, extracted);
      }

      if (!confInfo) {
        confInfo = {
          url: '',
          dial: '',
          room: '',
          pin: '',
          isHost: false,
          type: 'empty'
        };
      }

      logger.info('extractMeetingInfo: ' + JSON.stringify(confInfo));
      return confInfo;
    }

    function getJoinConferenceMeetingUri(info) {
      logger.info('getJoinConferenceMeetingUri');

      if (!info.clientUrl) {
        return info.url;
      } else {
        if (info.dial) {
          var uri = 'avaya://video?' + info.dial;
          logger.info('getJoinConferenceMeetingUri:' + uri);
          return uri;
        }

        return '';
      }
    }

    function getJoinEquinoxMeetingUri(info) {
      logger.info('getJoinEquinoxMeetingUri:' + JSON.stringify(info));

      if (info.bridge) {
        var uri;

        if (!info.clientUrl) {
          uri = info.url;
        } else {
          var args = {};

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
      joinMeeting: joinMeeting
    };
    module.exports = TopOfMind;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
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

    Templates.prototype._splitCompoundValue = function (strings, key) {
      var value = strings[key];

      if (value.indexOf('%%') !== -1) {
        delete strings[key];
        var pp = value.split('%%');
        strings[key + '_PREFIX'] = pp[0];
        strings[key + '_POSTFIX'] = pp[2];

        this._splitCompoundValue(strings, key + '_PREFIX');

        this._splitCompoundValue(strings, key + '_POSTFIX');
      } else {
        var re = /(.*)?<a xsubst>(.*)?<\/a>(.*)?/;
        var m = re.exec(value);

        if (m && m.length === 4) {
          delete strings[key];
          strings[key + '_PREFIX'] = m[1] || '';
          strings[key + '_LINK'] = m[2] || '';
          strings[key + '_POSTFIX'] = m[3] || '';
        }

        var re2 = /(.*)?<em xsubst>(.*)?<\/em>(.*)?/;
        var m2 = re2.exec(value);

        if (m2 && m2.length === 4) {
          delete strings[key];
          strings[key + '_PREFIX'] = m2[1] || '';
          strings[key + '_CONTENT'] = m2[2] || '';
          strings[key + '_POSTFIX'] = m2[3] || '';
        }
      }
    };

    Templates.prototype._splitCompoundValues = function (strings) {
      var self = this;
      Object.getOwnPropertyNames(strings).forEach(function (key) {
        self._splitCompoundValue(strings, key);
      });
    };

    Templates.prototype.applyTranslations = function (content, type, langId, html) {
      var self = this;
      langId = langId || self._langId || 'en';
      var ln_strings = self.i18n[langId] || self.i18n;

      this._splitCompoundValues(ln_strings);

      var langIdEn = 'en';
      var en_strings = self.i18n[langIdEn] || {};

      this._splitCompoundValues(en_strings);

      var lineTag = html ? '--' + Date.now() + '--' : '';
      var re = /\$\(([^\)]+)\)/gm;
      content = content.replace(re, function (m, key) {
        var sp2nbsp = false;

        if (key.indexOf('&') === 0) {
          sp2nbsp = true;
          key = key.substring(1);
        }

        var s = typeof ln_strings[type + '_' + key] !== 'undefined' ? ln_strings[type + '_' + key] : en_strings[type + '_' + key];

        if (typeof s !== 'undefined') {
          if (sp2nbsp) {
            s = s.replace(/\s/g, "\xA0");
          }

          return lineTag + s;
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
        throw {
          error: {
            fetchTemplate: true
          }
        };
      });
    };

    module.exports = Templates;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var schema = __webpack_require__(67);

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
      joinTopic: schema.methodOneWay
    };
    module.exports = SpacesSchema;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(6);

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

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(50);  
  var Promise = __webpack_require__(6);
  var Utils = __webpack_require__(15);
  var OAuthStorage = __webpack_require__(243);

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

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(50);
  var Storage = __webpack_require__(49);
  var Utils = __webpack_require__(15);

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

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(68);
  var fetchproxy = __webpack_require__(45);

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
      return r.clone().json();
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

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var LiteralMap = __webpack_require__(129);

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

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Timer = __webpack_require__(66);  
  var Promise = __webpack_require__(6);
  var Utils = __webpack_require__(15);
  var chrome = __webpack_require__(33);
  var Window = __webpack_require__(128);

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
      if ((this.opt.asyncui.hostName === 'Outlook') || (this.opt.asyncui.hostName === 'OutlookWebApp')) {
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

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(68);

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

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(68);
  var Utils = __webpack_require__(15);
  var fetchproxy = __webpack_require__(45);

  var clientType = 'esna';

  /** @constructor */  
  function OAuthProviderEsna() {
    this.clientType = clientType;
  }
  OAuthProviderEsna.clientType = clientType;
  
  OAuthProviderEsna.prototype.init = function (opt) {
    opt = opt || {};
    if (!opt.urls) {
      var root = opt.accountsUrl || 'https://accounts.avayacloud.com';
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
        return r.clone().json();
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

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var OAuthProvider = __webpack_require__(68);

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

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Promise = __webpack_require__(6);

    var PromiseQueue = __webpack_require__(251);

    var fetchproxy = __webpack_require__(45);

    var Utils = __webpack_require__(15);

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
      var headers = {};
      var h = opt.cmd.headers || {};

      for (var key in h) {
        headers[key] = h[key];
      }

      opt = {
        url: url,
        args: {
          'method': opt.cmd.method,
          'body': data,
          'headers': headers
        }
      };
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

        return res.clone().json();
      }, function (err) {
        queue.done();
        return Promise.reject(err);
      });
    }
    /** @constructor */


    function OnEsna() {
      this.local = true;
      this.queue = new PromiseQueue({
        max: 1
      });
    }

    OnEsna.prototype.init = function (opt) {
      this.sku = opt.sku || 'kale';
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
      return execQueued(this, this.queue, {
        endpoint: this.endpoint,
        sku: this.sku,
        cmd: commands.check
      }).then(function (res) {
        res = res;
        return Promise.resolve(true);
      }, function (res) {
        res = res;
        return Promise.resolve(false);
      });
    };

    OnEsna.prototype.loadProfile = function () {
      if (typeof this.profile !== 'undefined') {
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
      return execQueued(this, this.queue, {
        endpoint: this.endpoint,
        sku: this.sku,
        cmd: commands.load
      }).then(function (res) {
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
      return execQueued(this, this.queue, {
        endpoint: this.endpoint,
        sku: this.sku,
        cmd: commands.save,
        data: profile
      }).then(function (res) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(6);
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

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var channel = __webpack_require__(253);

    function Channel() {
      this.onConnect = channel.onConnect;
      this.onDisconnect = channel.onDisconnect;
    }

    module.exports = new Channel();
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(28);
  var chrome = __webpack_require__(33);

  var Event = __webpack_require__(20);

  var RPCPort = __webpack_require__(254);
  var RPCRouter = __webpack_require__(255);
  var RPCProxy = __webpack_require__(256);

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

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(28);
  var Event = __webpack_require__(20);
  var Guid = __webpack_require__(130);
  var chrome = __webpack_require__(33);

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

/***/ 255:
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

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Promise = __webpack_require__(6);
  var Event = __webpack_require__(20);
  
  var RPCSchema = __webpack_require__(67);

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

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var schema = __webpack_require__(67);

    var IdentitySchema = {
      onAccount: schema.eventBroadcast,
      onAccounts: schema.eventUnicast,
      login: schema.methodPromise,
      logout: schema.methodPromise,
      createAccount: schema.methodPromise,
      removeAccount: schema.methodPromise,
      updateAccount: schema.methodPromise
    };
    module.exports = IdentitySchema;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var schema = __webpack_require__(67);

    var PartiesSchema = {
      onParties: schema.eventBroadcast,
      onPartiesType: schema.eventBroadcast,
      getParties: schema.methodPromise,
      createParty: schema.methodPromise,
      removeParty: schema.methodPromise,
      getPartiesType: schema.methodPromise,
      setPartiesType: schema.methodPromise
    };
    module.exports = PartiesSchema;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(80), __webpack_require__(81)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_regenerator, _asyncToGenerator2) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(55);

  _regenerator = _interopRequireDefault(_regenerator);
  _asyncToGenerator2 = _interopRequireDefault(_asyncToGenerator2);
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Promise = __webpack_require__(6);

    var fetchproxy = __webpack_require__(45);

    var office = __webpack_require__(35);

    var Log = __webpack_require__(18);

    var logger = Log.createLogger('SPACES');
    var methods = {
      fetchUser: {
        url: '/api/users/me',
        method: 'GET',
        authorize: true,
        headers: {}
      },
      fetchTopics: {
        url: '/api/users/me/topics?size=100',
        method: 'GET',
        authorize: true,
        headers: {}
      },
      createTopic: {
        url: '/api/spaces/invite',
        method: 'POST',
        authorize: true,
        json: true,
        headers: {
          'content-type': 'application/json'
        }
      },
      createInvite: {
        url: '/api/spaces/{0}/invite',
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
      getPersonalTopic: {
        url: '/api/users/meetingroom/{0}',
        method: 'GET',
        authorize: true,
        json: true,
        headers: {
          'content-type': 'application/json'
        }
      }
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
      logger.info('convertInviteCreate');
      return new Promise(function (resolve, reject) {
        var userEmailAddress = office.getEmailAddress();
        logger.info('convertInviteCreate. userEmailAddress=' + userEmailAddress);
        var topic;
        var urlargs = [];

        if (!args.id) {
          topic = {
            'title': args.title,
            'description': args.description,
            'type': 'group'
          };
        } else {
          urlargs.push(args.id);
        } // ACW-21138


        var invitees = [];
        var organizerEmailAddress;
        logger.info('before getting organizer=' + organizer);
        office.getOrganizer().then(function (organizer) {
          logger.info('organizer received=' + organizer);

          if (organizer.emailAddress) {
            organizerEmailAddress = organizer.emailAddress;
          }

          if (typeof organizerEmailAddress === "string" && organizerEmailAddress !== userEmailAddress) {
            invitees.push({
              inviteeType: "email",
              invitee: organizerEmailAddress,
              role: "admin"
            });
          }

          var topicrq = {
            'invitees': invitees
          };

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
          resolve({
            urlargs: urlargs,
            json: topicrq
          });
        });
      });
    }

    function convertDate(v) {
      if (v) {
        try {
          return new Date(v).valueOf();
        } catch (e) {}
      }

      return 0;
    }

    function convertMembers(self, topic, members) {
      for (var i = 0; i < members.length; i++) {
        var m = members[i];
        var p = {};
        p.joined = convertDate(m['joinTime']);
        p.admin = m['role'] === 'admin';
        p.member = m['role'] === 'member';
        p.name = m['displayname'] || '';
        p.id = m['memberType'] === 'userId' ? m['member'] || '' : m['memberType'] + ':' + m['member'];
        p.email = m['username'] || '';
        p.self = p.id.toLowerCase() === self.id.toLowerCase() || p.email.toLowerCase() === self.email.toLowerCase();

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
        p.admin = m['role'] === 'admin';
        p.email = m['inviteeType'] === 'email' ? m['invitee'] || '' : m['inviteeType'] + ':' + m['invitee'];
        p.self = p.email === self.email;
        res.push(p);
      }

      return res;
    }

    function convertTopic(self, topic) {
      var res = {
        id: topic['targetId'] || topic['_id'],
        own: self.id === topic['cid'],
        email: self.email,
        title: topic['title'] || '',
        description: topic['description'] || '',
        pinned: !!topic['isPinned'],
        selfGuest: topic['role'] === 'guest',
        type: topic['type'],
        status: topic['status'] || 0,
        lastAccess: convertDate(topic['lastAccess']) || Date.now(),
        members: []
      };
      res.created = convertDate(topic['created']);
      res.selfMember = !res.selfGuest;
      convertMembers(self, res, topic['members'] || []); //if (res.selfMember !== !res.selfGuest) {
      //  debugger;
      //}

      return res;
    }

    function convert(request, response) {
      var res = null;

      switch (request.method) {
        case methods.fetchUser:
          res = request.response = {};
          res.id = response['_id'];
          res.name = response['displayname'];
          res.email = response['username'];
          break;

        case methods.fetchTopics:
          res = request.response = {
            next: response['nextPageUrl'],
            items: [],
            from: response['from'] - 1,
            to: response['to'] - 1
          };
          var topics = response['data'] || [];

          for (var i = 0; i < topics.length; i++) {
            res.items.push(convertTopic(request.userInfo, topics[i]));
          }

          break;

        case methods.createTopic:
          var topic = (response['data'] || [])[0];
          res = request.response = {
            id: topic['topicId'],
            own: true,
            members: [],
            title: request.args.json['topic']['title'],
            description: request.args.json['topic']['description']
          };

          if (topic['created']) {
            res.created = convertDate(topic['created']) || 0;
          }

          var content = response['inviteContent'] || {};
          res.invite = {
            id: topic['_id'],
            content: {
              text: content['text'],
              html: content['html']
            }
          };
          res.members = convertInvitees(request.userInfo, topic['invitees'] || []);
          break;

        case methods.createInvite:
          var invite = (response['data'] || [])[0];
          var inviteContent = response['inviteContent'] || {};
          res = request.response = {
            id: invite['_id'],
            topicId: invite['topicId'],
            content: {
              text: inviteContent['text'],
              html: inviteContent['html']
            },
            url: invite['inviteLocation']
          };
          break;

        case methods.getTopic:
          res = request.response = {
            topic: response['topic']
          };
          break;

        case methods.getPersonalTopic:
          res = request.response = convertTopic(request.userInfo, response['data']);
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

      request.fetch = {
        url: url,
        opt: {
          'method': request.method.method,
          'headers': request.headers,
          'body': applyBody(request)
        }
      };
      return execUser(request).then(function (request) {
        return authorize(request);
      }).then(function (request) {
        return fetchproxy(request.fetch.url, request.fetch.opt); // fetchproxy causes r.status (see below) 500 if no connection 
      }).then(function (r) {
        return r.ok ? r.clone().json() : Promise.reject(r.status + ': ' + r.statusText); // if no connection, error is '500: ' (no statusText provided)
      }).then(function (r) {
        return convert(request, r);
      });
    }

    function ZangSpaces() {
      this.fetchUser = this.fetchUser.bind(this);
    }

    ZangSpaces.prototype.init = function (opt) {
      this.opt = opt;
      this.opt.url = this.opt.url || 'https://spacesapis.avayacloud.com';
    };

    ZangSpaces.prototype.shut = function () {
      delete this.opt;
    };

    ZangSpaces.prototype.fetchUser = function () {
      if (this.userInfo) {
        return Promise.resolve(this.userInfo);
      }

      var self = this;
      return execRequest({
        endpoint: this.opt.url,
        token: this.opt.token,
        method: methods.fetchUser
      }).then(function (r) {
        if (self.opt) {
          self.userInfo = r;
        }

        return r;
      });
    };

    ZangSpaces.prototype.fetchTopics = function (args) {
      return execRequest({
        endpoint: this.opt.url,
        url: args ? args.url : null,
        token: this.opt.token,
        user: this.fetchUser,
        method: methods.fetchTopics,
        args: args
      });
    };

    ZangSpaces.prototype.createTopic = function (args) {
      var self = this;
      return new Promise(function (resolve) {
        convertInviteCreate(self.userInfo, args).then(function (newArgs) {
          resolve(execRequest({
            endpoint: self.opt.url,
            token: self.opt.token,
            user: self.fetchUser,
            method: methods.createTopic,
            args: newArgs
          }));
        });
      });
    };

    ZangSpaces.prototype.updateTopic = function (args) {};

    ZangSpaces.prototype.removeTopic = function (args) {};

    ZangSpaces.prototype.createInvite = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(args) {
        var self;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                self = this;
                return _context.abrupt("return", new Promise(function (resolve) {
                  convertInviteCreate(self.userInfo, args).then(function (newArgs) {
                    resolve(execRequest({
                      endpoint: self.opt.url,
                      token: self.opt.token,
                      user: self.fetchUser,
                      method: methods.createInvite,
                      args: newArgs
                    }));
                  });
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    ZangSpaces.prototype.updateInvite = function (args) {
      return execRequest({
        endpoint: this.opt.url,
        token: this.opt.token,
        user: this.fetchUser,
        method: methods.updateInvite,
        args: args
      });
    };

    ZangSpaces.prototype.removeInvite = function (args) {
      args = {
        urlargs: [args.id]
      };
      return execRequest({
        endpoint: this.opt.url,
        token: this.opt.token,
        user: this.fetchUser,
        method: methods.removeInvite,
        args: args
      });
    };

    ZangSpaces.prototype.getTopic = function (args) {
      args = {
        urlargs: [args.id]
      };
      return execRequest({
        endpoint: this.opt.url,
        token: this.opt.token,
        user: this.fetchUser,
        method: methods.getTopic,
        args: args
      });
    };

    ZangSpaces.prototype.getPersonalTopic = function (args) {
      args = {
        urlargs: [args.id]
      };
      return execRequest({
        endpoint: this.opt.url,
        token: this.opt.token,
        user: this.fetchUser,
        method: methods.getPersonalTopic,
        args: args
      });
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 28:
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(56)))

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var globals = __webpack_require__(28);
  
  var _chrome = globals.safeProp('chrome');
  if (!_chrome || !('runtime' in _chrome)) {
    try {
      // this might trigger exception when executing in Edge-based web browser control
      _chrome = globals.safeProp('browser');
    } catch (e) {
      // exception could be safely swallowed
    }
  }
  if (!_chrome || !('runtime' in _chrome)) {
    _chrome = { };
  }
  
  module.exports = _chrome;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    "use strict";

    var strings = {
      "sourceTitle": "Source",
      "sourceEquinox": "Meeting Rooms",
      "sourceSpaces": "Spaces",
      "actionOk": "Ok",
      "actionCancel": "Cancel",
      "hintPassword": "Password",
      "titleUnknownInvitation": "Unknown invitation",
      "titleSpaceUrl": "Meeting URL",
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
      "personalSpace": "My Meeting Room",
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
      "errorPopupBlocked": "Popup blocked",
      "askResetConfiguration": "Reset the configuration?",
      "actionReset": "Reset",
      "titleAddinAds": "Let’s schedule your<br/>Avaya Meeting!",
      "titleSetupMeetingDetails": "To setup your meeting details<br/>enter your email address.",
      "hintEmailAddress": "Email address",
      "titleAccountAds": "Don't have an Avaya Meetings or Avaya Spaces account?",
      "titleAccountAdsLink": "Get a demo, purchase or learn more about our services here",
      "actionNext": "Next",
      "actionSkip": "Skip",
      "actionClear": "Clear",
      "titleCheckingCloudAccount": "Checking your Avaya Spaces account...",
      "titleEnterCloudCredentials": "Enter your credentials<br/>for Avaya Spaces",
      "titleOpensInBrowser": "(Opens in separate browser window)",
      "linkClickToLogin": "Click here to login",
      "titleLoggingToCloud": "Logging in to Avaya Spaces",
      "hintUsername": "Username",
      "titleCheckingEquinoxAccount": "Checking your Meeting Room account...",
      "titleChooseEquinoxEnvironment": "Choose your environment",
      "titleEnterAEMOCredentials": "Sign in to your meeting room",
      "titleEnterEquinoxCredentials": "Sign in to your meeting room",
      "labelUseSSO": "Use Enterprise SSO",
      "titleLoggingToAEMO": "Logging in to your Meeting Room",
      "titleAEMO": "Avaya Meetings Online",
      "titleLoggingToEquinox": "Logging in to your Meeting Room",
      "errorBadCredentials": "Incorrect Username or Password",
      "errorConfigureAccount": "Unable to configure account at this time.",
      "errorNoConfiguredAccounts": "Sorry, your account could not be found.<br/>You may want to:<ul><li>check your email address and try again</li><li>check with your organization to see if you have Avaya Meetings account</li><li><a href=\"https://spaces.avayacloud.com\" target=\"_blank\">sign up</a> for Avaya Spaces account.</li></ul>",
      "titleSettingAddin": "Setting up your add-in...",
      "titleRequestInfo": "Retrieving your Meeting Room info...",
      "titleMeetingDetails": "Your Meeting Details",
      "titleConferenceAccessNumber": "Conference Access Number",
      "titleMeetingId": "Meeting ID",
      "titleConferenceAccessUrl": "Meeting URL",
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
      "actionReserve": "Reserve the meeting",
      "actionRequireParticipantID": "Require Participant ID",
      "linkEquinoxSettings": "Go to App Settings",
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
      "errorInvalidCredentials": "Your user credentials were invalid. Check your App Settings or contact support for details.",
      "errorNoRooms": "Error while fetching conference rooms.",
      "errorInternal": "Internal application error.",
      "errorIntermittent": "Intermittent errors occurred with Outlook. Try again later or use the browser to schedule the meeting in Outlook on the web.",
      "promptDisplayNewWindow": "$1 wants to display a new window",
      "version": "version $version"
    };
    var i18n = {
      ready: false,
      languageId: "en-US",
      // default
      i18n: strings
    };

    i18n.loadI18n = function (id) {
      if (i18n.ready) {
        return Promise.resolve(i18n.languageId);
      }

      if (i18n.loading) {
        return i18n.loading;
      }

      i18n.loading = new Promise(function (resolve, reject) {
        var setReady = function setReady(failed) {
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
              Object.getOwnPropertyNames(en_strings).forEach(function (key) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Promise = __webpack_require__(6);

    var Log = __webpack_require__(18);

    var Timer = __webpack_require__(66);

    var loadOffice = __webpack_require__(196)["default"];

    var globals = __webpack_require__(28);

    var Office = globals.safeProp('Office');

    var officeNative = __webpack_require__(197);

    var officeStorage = __webpack_require__(198);

    var logger = Log.createLogger('OFFICE');
    var listSeparator = ';';
    var office = {
      getStore: officeStorage.getStore
    };
    var strings_defaults = {
      appName: '',
      actionAllow: 'Allow',
      actionIgnore: 'Ignore',
      promptDisplayNewWindow: '$1 wants to display a new window.'
    };
    var strings = {};

    if (officeNative.missing) {
      loadOffice(function () {
        Office = window.Office;

        Office.initialize = function (reason) {
          logger.info('Office.initialize: ' + reason);
          office.webAPI = true;
          office.initialized = true;
          office.hostName = Office.context.mailbox.diagnostics.hostName;
          office.joinMode = typeof Office.context.mailbox.item.itemId !== 'undefined';
        };
      });
    } else {
      office.webAPI = false;
      office.initialized = true;
      Office = officeNative;
      office.hostName = Office.context.mailbox.diagnostics.hostName;

      if ('context' in Office) {
        if ('apiVersion' in Office.context.mailbox.diagnostics) {
          office.apiVersion = Office.context.mailbox.diagnostics.apiVersion;
        }
      }
    }

    function callback(action, resolve, reject) {
      return function (result) {
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
      return new Promise(function (resolve, reject) {
        var timer;
        var delay = 0;
        var interval = 100;
        var wait = 15000;

        var checkInitialized = function checkInitialized() {
          if (office.initialized) {
            timer.reset();
            office.version = Office.context.mailbox.diagnostics.hostVersion.toString() || '';
            logger.info('Office initialized, webAPI: ' + office.webAPI + ', version: ' + office.version + ', apiVersion: ' + office.apiVersion + ', delay: ' + delay);
            logger.info('Office userProfile displayName: ' + office.getDisplayName() + ', emailAddress: ' + office.getEmailAddress());
            officeStorage.init(Office.context.roamingSettings);
            resolve({
              checkOffice: true,
              delay: delay
            });
          } else {
            if (delay >= wait) {
              timer.reset();
              logger.info('Office not initialized, delay: ' + delay);
              resolve({
                checkOffice: false,
                delay: delay
              });
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

    function getVersionMajor() {
      if (!office.version) {
        return 0;
      }

      var parts = office.version.split('.');
      var major = parseInt(parts[0]);
      return major;
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

      return typeof displayName === 'string' ? displayName : null;
    }

    function getOrganizer() {
      return new Promise(function (resolve, reject) {
        var action = function action(organizer) {
          return organizer || {};
        };

        if ('organizer' in Office.context.mailbox.item) {
          if ('emailAddress' in Office.context.mailbox.item.organizer) {
            resolve(action(Office.context.mailbox.item.organizer));
          } else {
            Office.context.mailbox.item.organizer.getAsync(callback(action, resolve, reject));
          }
        } else {
          resolve(action(null));
        }
      });
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

      return typeof emailAddress === 'string' ? emailAddress : null;
    }

    function getAccountType() {
      var accountType;
      var mailbox = Office.context.mailbox;

      if ('userProfile' in mailbox) {
        var userProfile = mailbox.userProfile;

        if ('accountType' in userProfile) {
          accountType = userProfile.accountType;
        }
      }

      return typeof accountType === 'string' ? accountType : null;
    }

    function getSubject() {
      return new Promise(function (resolve, reject) {
        var action = function action(subject) {
          return subject || '';
        };

        Office.context.mailbox.item.subject.getAsync(callback(action, resolve, reject));
      });
    }

    function setSubject(subject) {
      return new Promise(function (resolve, reject) {
        Office.context.mailbox.item.subject.setAsync(subject, {}, callback(null, resolve, reject));
      });
    }

    function getParties(member) {
      return new Promise(function (resolve, reject) {
        var action = function action(recipients) {
          var _recipients = typeof recipients === 'string' ? recipients.split(';') : recipients;

          var parties = [];

          for (var i = 0; i < _recipients.length; i++) {
            parties.push({
              email: _recipients[i].emailAddress || _recipients[i],
              member: member
            });
          }

          return parties;
        };

        Office.context.mailbox.item.requiredAttendees.getAsync(callback(action, resolve, reject));
      }).then(function (r) {
        return r;
      }, function () {
        return [];
      });
    }

    function getDescription(type) {
      return new Promise(function (resolve, reject) {
        var action = function action(desc) {
          return desc;
        };

        var coercion = type || 'text';
        Office.context.mailbox.item.body.getAsync(coercion, callback(action, resolve, reject));
      });
    }

    function setDescription(desc, type) {
      return new Promise(function (resolve, reject) {
        var coercion = {
          coercionType: type || 'text'
        };
        Office.context.mailbox.item.body.setAsync(desc, coercion, callback(null, resolve, reject));
      });
    }

    function prependDescription(desc, type) {
      return new Promise(function (resolve, reject) {
        var coercion = {
          coercionType: type || 'text'
        };
        Office.context.mailbox.item.body.prependAsync(desc, coercion, callback(null, resolve, reject));
      });
    }

    function insertDescription(desc, type) {
      return new Promise(function (resolve, reject) {
        var coercion = {
          coercionType: type || 'text'
        };

        if ('setSelectedDataAsync' in Office.context.mailbox.item.body) {
          Office.context.mailbox.item.body.setSelectedDataAsync(desc, coercion, callback(null, resolve, reject));
        } else {
          Office.context.mailbox.item.body.prependAsync(desc, coercion, callback(null, resolve, reject));
        }
      });
    }

    function setLocation(value) {
      return new Promise(function (resolve, reject) {
        Office.context.mailbox.item.location.setAsync(value, {}, callback(null, resolve, reject));
      });
    }

    function getLocation() {
      return new Promise(function (resolve, reject) {
        var action = function action(value) {
          return value;
        };

        if (typeof Office.context.mailbox.item.location === 'string') {
          resolve(action(Office.context.mailbox.item.location));
        } else {
          Office.context.mailbox.item.location.getAsync(callback(action, resolve, reject));
        }
      });
    }

    function addLocation(value) {
      return getLocation().then(function (current) {
        return new Promise(function (resolve, reject) {
          Office.context.mailbox.item.location.setAsync(current ? current + listSeparator + ' ' + value : value, {}, callback(null, resolve, reject));
        });
      });
    }

    function removeLocation(values) {
      return getLocation().then(function (current) {
        if (!current) {
          return Promise.resolve();
        }

        return new Promise(function (resolve, reject) {
          var locations = current.split(listSeparator).filter(function (place) {
            var trimmedPlace = place.trim();

            for (var i = 0; i < values.length; i++) {
              if (trimmedPlace.indexOf(values[i]) !== -1) {
                return false;
              }
            }

            return true;
          }).join(listSeparator);
          Office.context.mailbox.item.location.setAsync(locations, {}, callback(null, resolve, reject));
        });
      });
    }

    function getLanguageSync() {
      var language = Office.context.displayLanguage;
      return typeof language === 'string' ? language : null;
    }

    function notifyInfo(key, icon, message) {
      Office.context.mailbox.item.notificationMessages.replaceAsync(key, {
        type: 'informationalMessage',
        icon: icon,
        message: message,
        persistent: false
      });
    }

    function notifyError(key, message) {
      Office.context.mailbox.item.notificationMessages.replaceAsync(key, {
        type: 'errorMessage',
        message: message
      });
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

        opt = opt || {
          width: 100,
          height: 100,
          requireHTTPS: true
        };
        var result = {
          value: null,
          status: Office.AsyncResultStatus.Failed,
          error: null
        };
        createPrompt(function (res) {
          if (res) {
            var t, l, w, h;
            w = 0 | opt.width * window.screen.availWidth / 100;
            h = 0 | opt.height * window.screen.availHeight / 100;
            l = 0 | (window.screen.availWidth - w) / 2;
            t = 0 | (window.screen.availHeight - h) / 2;
            var wnd = window.open(url, 'DialogAPI', 'width=' + w + ',height=' + h + ',top=' + t + ',left=' + l + ',resizable,scrollbars=yes');

            if (!wnd) {
              // result update;
              reject(result);
            } else {
              var context = {
                wnd: wnd,
                stop: false
              },
                  handler;
              result.value = {
                close: function close() {
                  context.stop = true;

                  if (context.wnd) {
                    context.wnd.close();
                    context.wnd = null;
                  }

                  handler = null;
                },
                addEventHandler: function addEventHandler(name, h) {
                  if (name === Microsoft.Office.WebExtension.EventType.DialogEventReceived) {
                    handler = h;
                  }
                }
              };

              context.cb = function () {
                if (handler) {
                  handler({
                    error: 12006
                  });
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
        opt = opt || {
          width: 100,
          height: 100,
          requireHTTPS: true
        };
        Office.context.ui.displayDialogAsync(url, opt, function (result) {
          result = result || {};
          result = {
            value: result.value,
            status: result.status,
            error: result.error
          };
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
      return new Promise(function (resolve, reject) {
        var action = function action(customProps) {
          var value = customProps.get(name);
          return value;
        };

        Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
      });
    }

    function setCustomProps(props) {
      return new Promise(function (resolve, reject) {
        var action = function action(customProps) {
          Object.getOwnPropertyNames(props).forEach(function (name) {
            var value = props[name];

            if (typeof value === 'undefined') {
              customProps.remove(name);
            } else {
              customProps.set(name, value);
            }
          });
          return customProps;
        };

        Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
      }).then(function (customProps) {
        return new Promise(function (resolve, reject) {
          customProps.saveAsync(callback(null, resolve, reject));
        });
      });
    }

    function setCustomProp(name, value) {
      var props = {};
      props[name] = value;
      return setCustomProps(props);
    }

    function delCustomProps(names) {
      return new Promise(function (resolve, reject) {
        var action = function action(customProps) {
          names.forEach(function (name) {
            customProps.remove(name);
          });
          return customProps;
        };

        Office.context.mailbox.item.loadCustomPropertiesAsync(callback(action, resolve, reject));
      }).then(function (customProps) {
        return new Promise(function (resolve, reject) {
          customProps.saveAsync(callback(null, resolve, reject));
        });
      });
    }

    function delCustomProp(name) {
      return delCustomProps([name]);
    }

    function save() {
      return new Promise(function (resolve, reject) {
        Office.context.mailbox.item.saveAsync(callback(null, resolve, reject));
      });
    }

    function invokeCallback(type, data) {
      Office.context.mailbox.item.location.callback(type, data);
    }

    function execCmd0(cmd) {
      return function () {
        if (!office.initialized) {
          return Promise.reject({
            error: {
              nooffice: true
            }
          });
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
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              if (!office.initialized) {
                reject({
                  error: {
                    nooffice: true
                  }
                });
              } else {
                resolve(cmd.apply(this, args)); // pass provided arguments to cmd itself
              }
            }, 500);
          });
        } else if (!office.initialized) {
          return Promise.reject({
            error: {
              nooffice: true
            }
          });
        } else {
          return cmd.apply(this, arguments); // pass provided arguments to cmd itself
        }
      };
    }

    office.checkOffice = checkOffice;
    office.getDialogApi = getDialogApi;
    office.getVersionMajor = getVersionMajor;
    office.getDisplayName = execCmd(getDisplayName);
    office.getOrganizer = execCmd(getOrganizer);
    office.getEmailAddress = execCmd(getEmailAddress);
    office.getAccountType = execCmd(getAccountType);
    office.getSubject = execCmd(getSubject);
    office.setSubject = execCmd(setSubject);
    office.getParties = execCmd(getParties);
    office.getDescription = execCmd(getDescription);
    office.setDescription = execCmd(setDescription);
    office.prependDescription = execCmd(prependDescription);
    office.insertDescription = execCmd(insertDescription);
    office.getLocation = execCmd(getLocation);
    office.setLocation = execCmd(setLocation);
    office.addLocation = execCmd(addLocation);
    office.removeLocation = execCmd(removeLocation);
    office.getLanguageSync = execCmd(getLanguageSync);
    office.notifyInfo = execCmd(notifyInfo);
    office.notifyError = execCmd(notifyError);
    office.displayDialog = execCmd(displayDialog);
    office.getCustomProp = execCmd(getCustomProp);
    office.setCustomProps = execCmd(setCustomProps);
    office.setCustomProp = execCmd(setCustomProp);
    office.delCustomProps = execCmd(delCustomProps);
    office.delCustomProp = execCmd(delCustomProp);
    office.save = execCmd(save);
    office.invokeCallback = execCmd(invokeCallback);
    office.setTranslations = setTranslations;
    module.exports = office;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var chrome = __webpack_require__(33);
  var fetch = __webpack_require__(194);

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

/***/ 49:
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

/***/ 50:
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

/***/ 55:
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 56:
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

/***/ 593:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var loader = __webpack_require__(65);

    var Promise = __webpack_require__(6);

    var Log = __webpack_require__(18);

    var office = __webpack_require__(35);

    var invite = __webpack_require__(82); // define extractMeetingInfoNative


    var syncMeeting = __webpack_require__(594);

    var i18n = __webpack_require__(34);

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
      var message = error ? i18n.i18n.notificationMeetingNotJoined + ': ' + error : i18n.i18n.notificationMeetingNotJoined;
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
      var popup = url.indexOf('http') === 0; // Popup required: rooms: no, spaces: yes

      var target = popup ? '_blank' : '_self'; // ACMACOS-10782

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
        if (navigator.vendor.indexOf('Apple') === 0 && office.hostName === 'Outlook') {
          return Promise.resolve();
        }
      }

      if (office.hostName !== 'Outlook') {
        notifyError(i18n.i18n.errorPopupBlocked);
        return Promise.resolve();
      } // supress in case of web mode for desktop client
      // we could re-enable this later to show popup
      // enable banner when popups are blocked


      notifyError(i18n.i18n.errorPopupBlocked);
      return Promise.resolve();
      var apppath = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
      url = apppath.replace(/(.*)\/.*\.html$/i, '$1/join.html') + '?' + url;
      url += '&languageId=' + i18n.languageId;
      localStorage.setItem('__track_join__', 1); // handle join window in case Outlook + Web app (if join window is allowed (see supress above))

      return office.displayDialog(url, {
        width: 30,
        height: 10,
        requireHTTPS: true
      }).then(function (r) {
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
        var url = (info || {}).url;

        if (!url) {
          complete({
            error: i18n.i18n.notificationNoMeetingLink
          });
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

      window.syncMeeting = syncMeeting;
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
      err = err || {};
      console.error('bkg:appcache:error:' + JSON.stringify({
        reason: err.reason,
        url: err.url,
        status: err.status,
        message: err.message
      }));
    });
    module.exports = {};
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 594:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict'; // use this to avoid es6-promise delays while working in hidden WBC

    (function t() {
      setTimeout(t, 1000);
    })(); // var Promise = require('/lib/jsl/promise');


    var Log = __webpack_require__(18);

    var Utils = __webpack_require__(15);

    var Storage = __webpack_require__(49);

    var rooms = __webpack_require__(118);

    var logger = Log.createLogger('SYNC');

    var syncNative = __webpack_require__(595);

    var syncErrApi = __webpack_require__(596);

    syncErrApi = new syncErrApi('http://httpstat.us/');

    function syncMeeting(configuration, jso) {
      var _JSON$parse;

      logger.info('[sync meeting] starting');
      logger.info('[sync meeting] jso:', jso);
      logger.cred('[sync meeting] configuration: ' + configuration, configuration && ((_JSON$parse = JSON.parse(configuration)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.Password));
      var syncInfo = JSON.parse(jso);
      var info = {};
      info.conferenceId = syncInfo.conferenceId || '';
      info.number = syncInfo.childMeetingNumber;
      info.parentMeetingNumber = syncInfo.meetingId; // originalStart provides backward compatibility. TODO(?): remove

      info.originalStart = syncInfo.originalStart ? new Date(syncInfo.originalStart).toISOString() : null;
      info.originalStartTime = syncInfo.originalStartTime ? new Date(syncInfo.originalStartTime).toISOString() : null;
      info.subject = syncInfo.subject;
      var startTime = new Date(syncInfo.startTime);
      var endTime = new Date(syncInfo.endTime);
      info.start = startTime.toISOString();
      info.duration = (endTime - startTime) / (60 * 1000);
      info.timeZoneId = syncInfo.timeZoneId || '';
      info.accessPIN = syncInfo.meetingPIN;
      info.recurrence = syncInfo.recurrence; // check if recurring meetings has no end and make correction for the UPS

      if (info.recurrence && !info.recurrence.recurrenceEnd.by) {
        info.recurrence.recurrenceEnd = null;
        logger.info('[sync meeting] recurring meeting without end date: ' + JSON.stringify(info.recurrence));
      }

      info.client = 'OUTLOOK';
      info.globalUniqueId = hexToBase64(syncInfo.entryId); // info.servicePrefix = currentProfile ? ((currentProfile.virtualRoomSettings || { })[info.number] || { }).servicePrefix : '';
      // info.serviceTemplateId = currentProfile ? ((currentProfile.virtualRoomSettings || { })[info.number] || { }).serviceTemplateId : '';

      logger.info('[sync meeting] info:', JSON.stringify(info));
      var response = {
        info: jso,
        result: 'OK',
        error: ''
      };
      rooms.configure(configuration, 'en-US', {}, true).then(function () {
        var throwSyncErr = (Utils.getParam('throwSyncErr') || '').toLowerCase() === 'true' || Utils.getParam('throwSyncErr') === '1';

        if (throwSyncErr && info.subject && info.subject.indexOf('error|') === 0) {
          var errinfo = info.subject.split('|');
          var code = errinfo[1];
          logger.info('[sync meeting] error code', code);
          var action = errinfo[2];

          if (!action || syncInfo.action === action) {
            if (code === 'fetch') {
              return Promise.reject({
                error: {
                  fetch: true
                }
              });
            }

            if (code === 'notoken') {
              return Promise.reject({
                error: {
                  notoken: true
                }
              });
            }

            code = parseInt(code);

            if (!isNaN(code) && code) {
              return syncErrApi.getError({
                code: code
              })["catch"](function (err) {
                err.jso = errinfo[3];
                return Promise.reject(err);
              });
            }
          }
        }

        return rooms.getProfile(true).then(function (r) {
          r = r || {};

          if (!r.canReserveMeetingsFromOutlookPlugin) {
            logger.warn('[sync meeting] skip sync meeting, reservation flag:', r.canReserveMeetingsFromOutlookPlugin);
            return Promise.reject({
              error: {
                fetch: true
              }
            });
          }
        }, function (err) {
          logger.warn('[sync meeting] failed to check reservation flag, error:', Log.getErrInfo(err));
        }).then(function () {
          if (syncInfo.action === 'delete') {
            return rooms.deleteMeeting(info.conferenceId);
          } else if (syncInfo.action === 'delete occurrence' || syncInfo.action === 'clear occurrence') {
            return rooms.deleteOccurence(info);
          } else {
            return rooms.scheduleMeeting(info);
          }
        });
      }).then(function (res) {
        logger.info('[sync meeting]', syncInfo.action, 'result:', JSON.stringify(res));

        switch (syncInfo.action) {
          case 'create':
          case 'update':
            if (res.conferenceId) {
              // reshedule doesn't return conferenceId
              syncInfo.conferenceId = res.conferenceId;
            }

            ;
            break;
        }

        response.info = JSON.stringify(syncInfo);
      }, function (err) {
        logger.error('[sync meeting]', syncInfo.action, 'error:', Log.getErrInfo(err));

        if (err.error) {
          response.error = err.error.fetch ? 'fetch' : response.error;
          response.error = err.error.notoken ? 'notoken' : response.error;
          response.error = err.error.nopassword ? 'notoken' : response.error; // 'nopassword'?

          response.error = err.error.badpassword ? 'notoken' : response.error; // 'badpassword'?
        }

        if (response.error) {
          response.result = 'failed';
          return;
        }

        if (syncInfo.action === 'delete' || syncInfo.action === 'delete occurrence' || syncInfo.action === 'clear occurrence') {
          logger.error('[sync meeting]', syncInfo.action, 'skip error report');
          return;
        }

        var promise = checkForConflict(err) ? rooms.searchByGlobalUniqueId(info.globalUniqueId) : Promise.reject();
        return promise.then(function (res) {
          if (Array.isArray(res.conferences)) {
            for (var i = 0; i < res.conferences.length; i++) {
              if (res.conferences[i].status !== 'SCHEDULE_FAILED') {
                return;
              }
            }
          }

          return Promise.reject();
        }, function () {
          return Promise.reject();
        }).then(null, function () {
          response.result = 'failed';
          response.error = JSON.stringify(err); // api error

          response.errorSubject = 'Failed: ' + info.subject;
          response.errorMessage = getErrorMessage(err, response.error, info);
        });
      }).then(function () {
        // finally
        logger.info('[sync meeting] response:', JSON.stringify(response));
        syncNative.callback(response);
      });
    }

    function getErrorMessage(err, errJson, info) {
      var errmsg = '';

      if (checkForConflict(err)) {
        errmsg = 'This following meeting was not reserved in the conferencing system due to a virtual room number conflict. Please try rescheduling this meeting.';
        errmsg = errmsg + '\n\n';
        errmsg = errmsg + 'Virtual room: ' + info.number + '\n';
        errmsg = errmsg + 'Title: ' + info.subject + '\n';
        errmsg = errmsg + 'Start time: ' + info.start + '\n';
        errmsg = errmsg + 'Duration: ' + formatDuration(info.duration) + '\n';
        return errmsg;
      }

      errmsg = 'Failed to synchronize \'' + info.subject + '\' meeting item.';
      errmsg = errmsg + '\n\n';
      errmsg = errmsg + 'Meeting Management Service error:\n' + errJson;
      errmsg = errmsg + '\n';
      return errmsg;

      function formatDuration(min) {
        min = min || 0;
        return (min / 60 | 0) + 'H' + min % 60 + 'M';
      }
    }

    function checkForConflict(err) {
      if (err.jso && Array.isArray(err.jso.error)) {
        var error = err.jso.error[0] || {};

        if (error.errorCode === "ERC_VIRTUAL_CONFERENCE_ID_CONFLICTED") {
          return true;
        }
      }

      return false;
    }

    function hexToBase64(hex) {
      var result = '';

      for (var i = 0; i < hex.length; i += 2) {
        var str = hex[i] + hex[i + 1] || '';

        var _byte = parseInt(str, 16);

        result += String.fromCharCode(_byte);
      }

      return btoa(result).replace(/=/g, '');
    }

    window.syncMeeting = syncMeeting;
    module.exports = syncMeeting;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 595:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var syncNative = {
      missing: true
    };

    if (window.external) {
      if (!('context' in window.external)) {
        syncNative = window.external;
      }
    }

    module.exports = syncNative;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 596:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var API = __webpack_require__(97);

    var methods = {
      getError: {
        uri: '/$(code)',
        method: 'GET',
        headers: {},
        body: null,
        args: {
          code: {
            key: '$(code)',
            flags: 'i'
          },
          message: {
            key: '$(message)',
            flags: 's'
          }
        },
        response: {}
      }
    };

    function SyncErrAPI(serverBase) {
      this.$super(serverBase);
    }

    Object.getOwnPropertyNames(methods).forEach(function (name) {
      SyncErrAPI.prototype[name] = function (args) {
        return this._exec(methods[name], args, true);
      };
    }, this);
    module.exports = API.extend(SyncErrAPI);
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var loader = __webpack_require__(65);

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

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Timer = __webpack_require__(66);

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

/***/ 66:
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

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require, exports, module) {
  'use strict';

  var Event = __webpack_require__(20);

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

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
  'use strict';

  var Base = __webpack_require__(50);
  var LiteralMap = __webpack_require__(129);
  var Guid = __webpack_require__(130);
  var Promise = __webpack_require__(6);
  var Utils = __webpack_require__(15);
  var fetchproxy = __webpack_require__(45);

  var chrome = __webpack_require__(33);

  var JWT = __webpack_require__(245);
  var OAuthInteractive = __webpack_require__(246);

  var authMap = new LiteralMap({
    state: 'state', clientUrl: 'redirect_uri', responseType: 'response_type', clientId: 'client_id', resource: 'resource',
    scope: 'scope', prompt: 'prompt', accessType: 'access_type', approvalPrompt: 'approval_prompt', loginHint: 'login_hint',
    nonce: 'nonce', incremental: 'include_granted_scopes', clientSecret: 'client_secret', grantType: 'grant_type',
    code: 'code', refreshToken: 'refresh_token', username: 'username',
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
        return r.clone().json();
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
    if (opt.username) {
      args.username = opt.username;
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

/***/ 74:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(193);


/***/ }),

/***/ 81:
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Promise = __webpack_require__(6);

    var Log = __webpack_require__(18);

    var i18n = __webpack_require__(34);

    var office = __webpack_require__(35);

    var roomsConfig = __webpack_require__(158);

    var spacesConfig = __webpack_require__(159);

    var rooms = __webpack_require__(118);

    var spaces = __webpack_require__(160);

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
          throw {
            error: {
              nooffice: true
            }
          };
        }
      }

      return store;
    }

    function getStoreItem(key) {
      var item = getStore().get(key); // store: office, Storage.getItem(key);

      logger.info('Get store item \'' + key + '\': ' + (typeof item === 'undefined' || item === null ? 'not defined' : item && item.length ? 'length = ' + item.length : '\'' + item.toString() + '\''));
      return item;
    }

    function delStoreItem(key) {
      logger.info('Remove store item \'' + key + '\''); // getStore().del(key);

      getStore().set(key, ''); // set empty string instead of deleting key to avoid settings.remove() call
    }

    function setStoreItem(key, item) {
      logger.info('Set store item \'' + key + '\': ' + 'length = ' + item.length);
      getStore().set(key, item);
    }

    function isIE() {
      return (navigator.userAgent.indexOf('MSIE') >= 0 || navigator.appVersion.indexOf('Trident/') >= 0) && office.hostName !== 'Outlook';
    }

    function getConfiguration(force) {
      var manual = false;

      if (force) {
        configuration = null;
      }

      if (!configuration) {
        var configurationItem = getStoreItem('configuration');
        var configurationItemManual = getStoreItem('configuration-manual');

        if (!configurationItem) {
          configurationItem = configurationItemManual;
          manual = true;
        }

        if (configurationItem) {
          try {
            configuration = JSON.parse(configurationItem);
            configuration['manual'] = manual;
            configuration['clientUrl'] = !configuration.manual && !isIE();
          } catch (e) {
            logger.error('Configuration parse error: ' + e.message);
          }
        }

        if (configurationItemManual) {
          try {
            var configurationManual = JSON.parse(configurationItemManual);
            configuration['UNIFIED_PORTAL_USERNAME'] = configuration['UNIFIED_PORTAL_USERNAME'] || configurationManual['UNIFIED_PORTAL_USERNAME'] || '';
          } catch (e) {
            logger.error('Configuration-manual parse error: ' + e.message);
          }
        }

        if (!configuration) {
          configuration = {};
        } else {
          configuration['AVAYA_CLOUD_ACCOUNTS_URI'] = configuration['AVAYA_CLOUD_ACCOUNTS_URI'] || 'https://accounts.avayacloud.com';
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
      });
    }

    function resetConfiguration() {
      configuration = {};
      configuredSources = null;
      delStoreItem('configuration');
      delStoreItem('configuration-manual');
      setStoreItem('delegateSyncEnabled', 'false');
    }

    function getConfiguredSources(force) {
      if (force || !configuredSources) {
        getConfiguration(force);
        configuredSources = [];
        var srcConfigs = {};
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
    }

    ;

    function setSpacesOpt(spaces, cfg) {
      if (!cfg) {
        getConfiguration();
        cfg = configuration;
      }

      var spacesApiUri = cfg['AVAYA_CLOUD_SPACES_API_URI'] || 'https://spacesapis.avayacloud.com';
      spacesApiUri = spacesApiUri.replace('spaces.avayacloud.com', 'spacesapis.avayacloud.com');
      var spacesPortalUri = cfg['AVAYA_CLOUD_SPACES_URI'] || 'https://spaces.avayacloud.com';
      spaces.setOpt({
        url: spacesApiUri,
        portalUrl: spacesPortalUri
      });
    }

    ;

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
    }

    ;

    function extractMeetingInfo(extractor) {
      logger.info('extractMeetingInfo extractor: ' + extractor);
      var sources;
      var languageId = 'en'; // default languageId

      return office.checkOffice().then(function () {
        // catch office.initialized flag
        ////sources = getConfiguredSources(true);
        ////if (sources.indexOf(SOURCE_SPACES) > 0) {
        ////  sources = sources.slice(0);
        ////  sources = sources.splice(sources.indexOf(SOURCE_SPACES), 1).concat(sources); // set spaces extractor first
        ////}
        sources = KNOWN_SOURCES;
        logger.info('extractMeetingInfo sources: [ ' + sources.join(', ') + ' ]');
        languageId = office.getLanguageSync() || languageId;
        return i18n.loadI18n(languageId);
      }).then(function (r) {
        // languageId
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
        var extractors = []; ////sources.forEach(function (name) {
        ////  switch (name) {
        ////    case SOURCE_SPACES:

        setSpacesOpt(spaces);
        extractors.push(spaces[extractor](bodyText)); ////      break;
        ////    case SOURCE_ROOMS:

        extractors.push(rooms[extractor](JSON.stringify(getConfiguration()), languageId, location, office.webAPI ? bodyHtml : bodyText)); ////      break;
        ////  }
        ////});

        return Promise.all(extractors);
      }).then(function (r) {
        var result = [];

        for (var i = 0; i < sources.length; i++) {
          result.push({
            source: sources[i],
            info: r[i]
          });
        }

        return Promise.resolve(result);
      });
    }

    function extractMeetingInfoNative() {
      logger.info('extractMeetingInfoNative');
      return extractMeetingInfo('getInviteInfo').then(function (r) {
        logger.info('extractMeetingInfoNative meetings: [ ' + r.map(function (info) {
          return JSON.stringify(info);
        }).join(', ') + ' ]');

        for (var i = 0; i < r.length; i++) {
          var info = r[i].info;

          if (info && info.type !== 'empty') {
            info.type = info.type || r[i].source;

            if (!office.webAPI && info.altUrl) {
              info.url = info.altUrl;
            }

            info.isHost = typeof info.isHost === 'undefined' ? true : info.isHost;
            return info;
          }
        }
      })["catch"](function (err) {
        logger.error('extractMeetingInfoNative error: ', Log.getErrInfo(err));
      }).then(function (info) {
        // finally
        info = info || {};
        info = {
          url: info.url || '',
          dial: info.dial || '',
          room: info.room || '',
          pin: info.pin || '',
          isHost: info.isHost || false,
          type: info.type || 'empty'
        };
        logger.info('extractMeetingInfoNative, info: ' + JSON.stringify(info));
        office.invokeCallback('meetingInfo', info);
      });
    }

    function getJoinMeetingUrl() {
      return extractMeetingInfo('getInviteInfo').then(function (r) {
        logger.info('getJoinMeetingUrl infos: [ ' + r.map(function (info) {
          return JSON.stringify(info);
        }).join(', ') + ' ]');

        for (var i = 0; i < r.length; i++) {
          var info = r[i].info;

          if (info) {
            var url = info.url;

            if (!office.webAPI && info.altUrl) {
              url = info.altUrl;
            }

            var source = r[i].source;
            logger.info('getJoinMeetingUrl url: ' + url + ', source: ' + source);
            return Promise.resolve({
              source: source,
              url: url
            });
          }
        }

        throw new Error('nomeetingurl');
      })["catch"](function (err) {
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
      isIE: isIE,
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(226)();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(84);
var hasOwn = __webpack_require__(229);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(228);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var partyType = {
      member: 'member',
      guest: 'guest'
    };
    module.exports = partyType;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(98)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_typeof2) {
  "use strict";

  var _interopRequireDefault = __webpack_require__(55);

  _typeof2 = _interopRequireDefault(_typeof2);
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Base = __webpack_require__(50);

    var fetchproxy = __webpack_require__(45);

    var Log = __webpack_require__(18);

    var logger = Log.createLogger('API');

    function API(serverBase) {
      this.serverBase = serverBase;
    }

    API.prototype._prepareValue = function (def, value) {
      var flags = def.flags;

      if (typeof value === 'undefined') {
        value = def["default"];
      }

      for (var i = 0; i < flags.length; i++) {
        var flag = flags[i];

        switch (flag) {
          case 's':
            // if (typeof(value) !== 'string') {
            //   logger.warn(def.key + ': should be valid string');
            // }
            if (typeof value !== 'undefined') {
              value = value || '';
              value = '' + value;
            }

            break;

          case 'S':
            // if (typeof(value) !== 'string') {
            //   logger.warn(def.key + ': should be valid string');
            // }
            if (typeof value !== 'undefined') {
              value = value || '';
              value = '' + value; // if (value.length === 0) {
              //   logger.warn(def.key + ': should be non-empty string');
              // }
            }

            break;

          case 'b':
            // if (typeof(value) !== 'boolean') {
            //   logger.warn(def.key + ': should be valid boolean');
            // }
            break;

          case 'A':
            // if (typeof(value) !== 'string') {
            //   logger.warn(def.key + ': should be valid string');
            // }
            if (value) {
              value = btoa(value);
            }

            if (typeof value !== 'undefined' && value !== null) {
              value = value || '';
            }

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
            if (typeof value !== 'number') {
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

          case 'O':
            break;
        }
      }

      if (def.format && typeof value !== 'undefined') {
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
      }, {});
    };

    API.prototype._extractVars = function (template) {
      var re = /\$\([^\)]*\)/ig;

      for (var items = {}, m; !!(m = re.exec(template));) {
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
        var r;

        if (Array.isArray(t)) {
          r = [];
          t.forEach(function (ti) {
            var ri = self._substitute(ti, args);

            r.push(ri);
          });
        } else if ((0, _typeof2["default"])(t) === 'object') {
          r = self._substitute(t, args);
        } else {
          r = self._extractVars(t).reduce(function (r, key) {
            var v = args[key];

            if (r === key) {
              return v;
            }

            return self._replaceAll(r, key, v);
          }, t);
        }

        res[key] = r;

        if (typeof res[key] === 'undefined') {
          delete res[key];
        }

        return res;
      }, {});
    };

    API.prototype._extractData = function (schema, data, index) {
      var self = this;
      var keys = Object.getOwnPropertyNames(schema);
      return keys.reduce(function (res, key) {
        if (typeof res === 'undefined') {
          return;
        }

        var def = schema[key];

        if (Array.isArray(def)) {
          res[key] = [];
          var item,
              ndx = 0;

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

            if (typeof c === 'undefined') {
              if ('' + index === path[j]) {
                return;
              }

              break;
            }
          }

          c = self._prepareValue(def, c);

          if (typeof c !== 'undefined') {
            res[key] = c;
          }
        }

        return res;
      }, {});
    };

    API.prototype._exec = function (command, args, proxy) {
      var _args = this._prepareArgs(command, args);

      var _body = this._substitute(command.body, _args);

      var _hdrs = this._substitute(command.headers, _args);

      var _uri = this._substitute({
        uri: command.uri
      }, _args);

      var uri = _uri.uri.indexOf('http') === 0 ? _uri.uri : this.serverBase + _uri.uri;
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

      var opt = {
        method: command.method,
        mode: args.cors ? args.cors : 'cors',
        headers: hdrs || {},
        body: body
      };

      if (!body) {
        delete opt.body;
      }

      var self = this;
      logger.info('fetch: ' + uri + '(opt: ' + JSON.stringify(opt) + ')');
      return (proxy ? fetchproxy(uri, opt) : fetch(uri, opt)).then(function (r) {
        logger.info('fetch:result: ' + r.ok);

        if (!r.ok) {
          return r.json().then(function (jso) {
            var err = {
              error: {
                httpStatus: r.status,
                httpStatusText: r.statusText
              },
              jso: jso
            };
            logger.error('fetch:error: ' + JSON.stringify(err));
            throw err;
          }, function (err) {
            throw {
              error: {
                httpStatus: r.status,
                httpStatusText: r.statusText
              }
            };
          });
        }

        return r.clone().json();
      }, function (e) {
        logger.error('fetch:error: ' + e.message);
        throw {
          error: {
            fetch: true
          }
        };
      }).then(function (r) {
        logger.cred('fetch:payload: ' + JSON.stringify(r), r === null || r === void 0 ? void 0 : r.encryptedPassword);

        var res = self._extractData(command.response, r);

        return res;
      });
    };

    module.exports = Base.extend(API);
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 98:
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}

module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  "use strict";

  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {
    'use strict';

    var Event = __webpack_require__(20);

    var Promise = __webpack_require__(6);

    var PromiseCancel = __webpack_require__(241);

    var Utils = __webpack_require__(15);

    var OAuth = __webpack_require__(242); //var OAuthGeneric = require('/lib/jsl/id/oauth.provider');


    var OAuthGoogle = __webpack_require__(244);

    var OAuthSalesforce = __webpack_require__(247);

    var OAuthEsna = __webpack_require__(248);

    var OAuthMicrosoft = __webpack_require__(249);

    var OnEsna = __webpack_require__(250);

    var channel = __webpack_require__(252);

    var schema = __webpack_require__(257);

    var states = __webpack_require__(100);

    function updateState(identity, account, state) {
      if (account.state !== state) {
        Utils.showLogInfo('Identity: model.updateState', {
          account: account,
          state: state
        });
        account.state = state;
        identity.onAccount.dispatch(account);
      }
    }

    function cancelCommand(pending, id) {
      var p = pending[id];

      if (!p) {
        return Promise.resolve();
      }

      delete pending[id]; // return p.cancel();

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
    Identity.prototype.providers = {
      google: OAuthGoogle,
      esna: OAuthEsna,
      salesforce: OAuthSalesforce,
      microsoft: OAuthMicrosoft
    };

    Identity.prototype.init = function (opt) {
      this.oauth = new OAuth({
        key: opt.app,
        allowSave: opt.allowSave
      });
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

    Identity.prototype.patchCachedToken = function (app, url) {
      try {
        var json = localStorage.getItem(app);

        if (!json) {
          return;
        }

        var jso = JSON.parse(json);

        if (jso['esna'] && jso['esna']['accountsUrl'] === 'https://accounts.zang.io') {
          jso['esna']['accountsUrl'] = url;
          localStorage.setItem(app, JSON.stringify(jso));
          this.oauth.storage.load();
        }
      } catch (e) {}
    }; // login  


    Identity.prototype.login = function (opt) {
      var app = 'zangAgenda';

      if (!this.oauth) {
        // not initialized yet... (init moved from loading to get ready storage in Office case)
        var providers = service.providers;
        var accountsUrls = opt.accountsUrls || {};
        service.init({
          app: app,
          allowSave: true,
          providers: [// onesna
          {
            primary: true,
            provider: providers.esna,
            client: {
              clientUrl: 'https://manage1.esna.com/oauth/token.redirect',
              clientId: '7edbde34c699f670da574d047a6d409bb74d7cfad40980d3a3d1826495548428',
              clientSecret: '7375341cc70b0bb02463ca2ad78782a2'
            },
            accountsUrl: accountsUrls.esna
          }, // google
          {
            primary: false,
            provider: providers.google,
            client: {
              clientUrl: 'https://manage1.esna.com/oauth/token.redirect',
              clientId: '132802444345-nni4g5350ou4afgddedcc4shofjbja70.apps.googleusercontent.com'
              /*clientSecret: 'HZHq0ZAzmzijXsXmSo7IQBE3'*/

            }
          } // office 365
          //{ primary: false, provider: providers.microsoft, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '472976097227.apps.googleusercontent.com' /*clientSecret: 'eXC0s4A36ONswicIvN8HNws_'*/ } },
          // salesforce
          //{ primary: false, provider: providers.salesforce, client: { clientUrl: 'https://manage1.esna.com/oauth/token.redirect', clientId: '472976097227.apps.googleusercontent.com' /*clientSecret: 'eXC0s4A36ONswicIvN8HNws_'*/ } },
          ],
          accountsUrls: opt.accountsUrls || {}
        });
      }

      opt = opt || {};
      this.patchCachedToken(app, (opt.accountsUrls || {}).esna);
      return this.createAccount({
        type: this.providers.esna.clientType,
        primary: true,
        scopes: ['https://www.onesna.com/auth/logan'],
        accountsUrl: (opt.accountsUrls || {}).esna,
        noui: opt.noui,
        asyncui: opt.asyncui,
        logout: opt.logout,
        token: opt.token,
        username: opt.username
      });
    }; // Logout


    Identity.prototype.logout = function () {
      Utils.showLogInfo('Identity: model.logout');
      this.onesna.shut();

      if (this.oauth) {
        this.oauth.storage.clear();
        return this.removeAccount({
          primary: true
        });
      } else {
        return Promise.resolve();
      }
    }; // get token


    Identity.prototype.getToken = function (opt) {
      Utils.showLogInfo('Identity: model.getToken', opt);
      var id = opt.primary ? 'primary' : opt.id || '' + Date.now();
      var account = this.accounts[id];

      if (account) {
        if (account.state !== states.Authorized) {
          // exclude state switch if Authorized (due to periodic poll requests)
          updateState(this, account, states.Authorizing);
        }

        if (this.pending[id]) {
          return this.pending[id];
        }
      } else {
        var err = {
          error: {
            noitem: true
          }
        };
        Utils.showLogInfo('Identity: model.getToken reject', err);
        return Promise.reject(err);
      }

      var token = this.tokens[account.id];

      if (token) {
        var dtn = Date.now();
        token = token.token;

        if (token && dtn < token.expiry - 60000) {
          Utils.showLogInfo('Identity: model.getToken resolve', token);
          return Promise.resolve(token);
        }
      }

      var pc = new PromiseCancel();
      var args = {
        type: account.info.type,
        primary: opt.primary,
        login: true,
        noui: true,
        userId: account.info.user,
        scopes: account.info.scopes,
        cancelToken: pc.token
      };
      var self = this;
      var cmd = this.oauth.getToken(args); // var pending = this.pending[id] = pc.exec(cmd);

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
    }; // providers


    Identity.prototype.getProviders = function () {}; // accounts


    Identity.prototype.getPrimaryAccount = function () {
      return this.accounts['primary'];
    };

    Identity.prototype.getAccounts = function () {
      return this.accounts;
    }; // account operations


    Identity.prototype.createAccount = function (opt) {
      Utils.showLogInfo('Identity: model.createAccount', opt);
      var id = opt.primary ? 'primary' : opt.id || '' + Date.now();
      var account = this.accounts[id];

      if (account) {
        if (this.pending[id]) {
          return this.pending[id];
        }
      } else {
        var enabled = typeof opt.enabled === 'undefined' ? true : opt.enabled;
        account = {
          id: id,
          info: {
            type: opt.type,
            primary: !!opt.primary,
            user: opt.user || '',
            enabled: enabled,
            scopes: opt.scopes || []
          },
          state: states.Unknown
        };
        this.accounts[id] = account;
      }

      if (!account.info.enabled) {
        updateState(this, account, states.Unauthorized);
        return Promise.reject({
          error: {
            disabled: true
          }
        });
      }

      var pc = new PromiseCancel();
      var args = {
        type: account.info.type,
        primary: account.info.primary,
        login: true,
        noui: opt.noui,
        asyncui: opt.asyncui,
        logout: opt.logout,
        token: opt.token,
        userId: account.info.user,
        scopes: account.info.scopes,
        cancelToken: pc.token,
        offline: true,
        username: opt.username || ''
      };
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
          account.userInfo = account.userInfo || {};
          account.userInfo.name = res.userInfo.name;
          account.userInfo.user = res.userInfo.user;
          account.userInfo.image = res.userInfo.image;
          account.info.user = account.info.user || res.userInfo.user;
        }

        if (!account.info.primary) {
          var ids = Object.getOwnPropertyNames(self.accounts);

          for (var i = 0; i < ids.length; i++) {
            var user = self.accounts[ids[i]];

            if (user.info.type === account.info.type && user.info.user === account.info.user && user.id !== account.id) {
              self.removeAccount({
                id: account.id
              });
              account = user;
            }
          }
        }

        self.tokens[account.id] = res;

        if (account.info.primary) {
          self.onesna.init({
            sku: '',
            getToken: self.getToken.bind(self, {
              primary: true
            }),
            accountsUrl: opt.accountsUrl
          });
          return self.onesna.loadProfileSection('accounts').then(function (r) {
            //self.onesna.saveProfileSection('accounts', []).then(function (r) { }, function (r) { });
            self.restoreAccounts(r).then(function (r) {}, function (e) {});
            self.onPrimary.dispatch({
              connected: true
            });
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
        return Promise.reject({
          error: {
            noitem: true
          }
        });
      }

      if (opt.enabled && !account.info.enabled) {
        account.info.enabled = true;
        account.state = states.Unknown;
        updateState(this, account, states.Unauthorized);
        return this.createAccount({
          id: opt.id,
          noui: false
        });
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
      Utils.showLogInfo('Identity: model.removeAccount', {
        opt: opt,
        logout: logout
      });
      var id, account;

      if (opt.primary) {
        return this.removePrimaryAccount();
      }

      id = opt.id;
      account = this.accounts[id];

      if (!account) {
        return Promise.reject({
          error: {
            noitem: true
          }
        });
      }

      Utils.showLogInfo('Identity: model.removeAccount delete', account);
      delete this.accounts[id];
      account.deleted = true;
      account.state = states.Unknown;
      updateState(this, account, states.Unauthorized);

      if (!logout) {
        this.saveAccounts();
      }

      var args = {
        type: account.info.type,
        primary: account.info.primary,
        userId: account.info.user
      };
      this.oauth.logout(args);
      return cancelCommand(this.pending, id);
    };

    Identity.prototype.removePrimaryAccount = function () {
      Utils.showLogInfo('Identity: model.removePrimaryAccount');
      this.onPrimary.dispatch({
        connected: false
      });
      var id, account, primary;
      var keys = Object.getOwnPropertyNames(this.accounts);

      for (var i = 0; i < keys.length; i++) {
        id = keys[i];
        account = this.accounts[id];

        if (!account.info.primary) {
          this.removeAccount(account, true).then(function () {});
        } else {
          primary = account;
          return this.removeAccount({
            id: primary.id
          }, true);
        }
      }

      return Promise.reject({
        error: {
          noitem: true
        }
      }); // ???
    };

    Identity.prototype.restoreAccounts = function (accounts) {
      if (!accounts) {
        return Promise.resolve({
          done: true
        });
      }

      var item = accounts.shift();

      if (!item) {
        return this.saveAccounts();
      }

      var self = this;
      return this.createAccount({
        user: item.user,
        type: item.type,
        enabled: item.enabled,
        scopes: item.scopes || []
      }).then(function (r) {
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
          var info = {
            type: item.info.type,
            enabled: item.info.enabled,
            user: item.info.user,
            scopes: item.info.scopes
          };

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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

/******/ });
//# sourceMappingURL=../map/bkg.js.map