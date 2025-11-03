(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.clone'), require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.clone', 'react'], factory) :
    (global = global || self, factory(global.mutastateReact = {}, global.clone, global.React));
}(this, (function (exports, clone$1, React) { 'use strict';

    clone$1 = clone$1 && Object.prototype.hasOwnProperty.call(clone$1, 'default') ? clone$1['default'] : clone$1;
    var React__default = 'default' in React ? React['default'] : React;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }

    function getTypeString(input) {
      if (input === undefined) return 'undefined';
      if (input === null) return 'null';
      if (Array.isArray(input)) return 'array';
      return _typeof(input);
    }
    function clone(input) {
      return clone$1(input);
    }
    function getObjectPath(pathin) {
      if (pathin === undefined) return [];
      if (Array.isArray(pathin)) return pathin;
      if (pathin === null) return [];
      if (pathin === '') return [];
      return pathin.toString().split('.');
    }
    function getObjectAtPath(base, pathin) {
      var path = getObjectPath(pathin);
      var result = base;
      for (var itemdex = 0; itemdex < path.length; itemdex += 1) {
        if (result === undefined || result === null) return undefined;
        var pathKey = path[itemdex];
        result = result[pathKey];
      }
      return result;
    }
    function get(object, path, defaultValue) {
      var result = getObjectAtPath(object, path);
      if (result === undefined) return defaultValue;
      return result;
    }
    function has(object, path) {
      if (path === undefined || path === null || Array.isArray(path) && path.length === 0) return false;
      return getObjectAtPath(object, path) !== undefined;
    }
    function keys(object) {
      if (!object || _typeof(object) !== 'object') return [];
      return Object.keys(object);
    }
    function objectAssign(object, path, value) {
      var keyArray = getObjectPath(path);
      var result = clone(object || {});
      var currentOb = result;
      for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
        var pathItem = keyArray[keydex];
        if (currentOb[pathItem] === undefined || currentOb[pathItem] === null || _typeof(currentOb[pathItem]) !== 'object') {
          if (keyArray.length > keydex + 1 && !isNaN(parseInt(keyArray[keydex + 1], 10))) {
            currentOb[pathItem] = [];
          } else {
            currentOb[pathItem] = {};
          }
        }
        currentOb = currentOb[pathItem];
      }
      var lastKey = keyArray[keyArray.length - 1];
      if (keyArray.length === 0) {
        return __assign(__assign({}, result), value);
      }
      if (value === undefined) {
        delete currentOb[lastKey];
      } else {
        currentOb[lastKey] = value;
      }
      return result;
    }
    function set(object, path, value) {
      var keyArray = getObjectPath(path);
      var currentOb = object;
      if (!currentOb) return objectAssign({}, path, value);
      for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
        var pathItem = keyArray[keydex];
        if (currentOb[pathItem] === undefined || currentOb[pathItem] === null || _typeof(currentOb[pathItem]) !== 'object') {
          if (keyArray.length > keydex + 1 && !isNaN(parseInt(keyArray[keydex + 1], 10))) {
            currentOb[pathItem] = [];
          } else {
            currentOb[pathItem] = {};
          }
        }
        currentOb = currentOb[pathItem];
      }
      var lastKey = keyArray[keyArray.length - 1];
      if (keyArray.length === 0) {
        throw new Error('Cannot use set with empty path');
      }
      if (value === undefined) {
        delete currentOb[lastKey];
      } else {
        currentOb[lastKey] = value;
      }
      return object;
    }
    function assurePathExists(object, path, defaultValue) {
      if (!has(object, path)) {
        set(object, path, defaultValue);
      }
      return get(object, path);
    }
    function assassinate(object, path) {
      var thekeys = getObjectPath(path);
      if (thekeys.length < 1) return;
      var currentOb = object;
      for (var keydex = 0; keydex < thekeys.length - 1; keydex += 1) {
        var pathItem = thekeys[keydex];
        if (currentOb[pathItem] === undefined) return;
        if (currentOb[pathItem] === null) return;
        if (_typeof(currentOb[pathItem]) !== 'object') return;
        currentOb = currentOb[pathItem];
      }
      if (currentOb === undefined || currentOb === null) return;
      var finalkey = thekeys[thekeys.length - 1];
      if (finalkey) delete currentOb[finalkey];
    }
    function deepEq(a, b) {
      if (a === b) return true;
      if (a === null || b === null) return false;
      if (a === undefined || b === undefined) return false;
      if (_typeof(a) !== _typeof(b)) return false;
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (var dex = 0; dex < a.length; dex += 1) {
          if (!deepEq(a[dex], b[dex])) return false;
        }
        return true;
      }
      if (_typeof(a) === 'object' && _typeof(b) === 'object') {
        var akeys = Object.keys(a);
        var bkeys = Object.keys(b);
        if (akeys.length !== bkeys.length) return false;
        return akeys.every(function (key) {
          return deepEq(a[key], b[key]);
        });
      }
      return false;
    }

    var BaseAgent = /** @class */function () {
      function BaseAgent(mutastate, onChange) {
        this.mutastate = mutastate;
        this.data = {};
        this.onChange = onChange;
        this.aliasObject = {};
        this.reverseAliasObject = {};
        this.ignoreChange = false;
        this.inListenBatch = false;
        this.paused = false;
      }
      BaseAgent.prototype.getComposedState = function (initialData, key, value) {
        if (key instanceof Array && key.length === 0 || key === null) return value;
        set(initialData, key, value);
        return initialData;
      };
      BaseAgent.prototype.setComposedState = function (key, value) {
        this.data = this.getComposedState(this.data, key, value);
      };
      BaseAgent.prototype.translate = function (inputKey, outputKey, translationFunction, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.killOnCleanup,
          killOnCleanup = _c === void 0 ? true : _c,
          _d = _b.throttleTime,
          throttleTime = _d === void 0 ? null : _d;
        this.mutastate.translate(inputKey, outputKey, translationFunction, {
          batch: killOnCleanup ? this : undefined,
          throttleTime: throttleTime
        });
      };
      BaseAgent.prototype.setAlias = function (key, alias) {
        set(this.aliasObject, alias, key);
        set(this.reverseAliasObject, key, alias);
      };
      BaseAgent.prototype.clearAlias = function (key) {
        var alias = get(this.reverseAliasObject, key);
        if (alias) {
          assassinate(this.reverseAliasObject, key);
          assassinate(this.aliasObject, alias);
        }
      };
      BaseAgent.prototype.clearAllAliases = function () {
        this.aliasObject = {};
        this.reverseAliasObject = {};
      };
      BaseAgent.prototype.resolveKey = function (key) {
        var keyArray = getObjectPath(key);
        var firstKey = keyArray instanceof Array ? keyArray[0] : keyArray;
        return has(this.aliasObject, firstKey) ? [].concat(get(this.aliasObject, firstKey)).concat(keyArray.slice(1)) : keyArray;
      };
      BaseAgent.prototype.resolve = function (key) {
        return this.resolveKey(key);
      };
      BaseAgent.prototype.listen = function (key, _a) {
        var _b = _a === void 0 ? {} : _a,
          alias = _b.alias,
          transform = _b.transform,
          _c = _b.initialLoad,
          initialLoad = _c === void 0 ? true : _c,
          defaultValue = _b.defaultValue;
        var keyArray = getObjectPath(key);
        var modifiedListener = {
          alias: alias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue,
          callback: this.handleChange,
          batch: this
        };
        this.mutastate.listen(keyArray, modifiedListener);
        if (alias) {
          this.setAlias(keyArray, alias);
        }
        if (initialLoad) {
          this.ignoreChange = true;
          var listenData = this.mutastate.getForListener(keyArray, modifiedListener);
          this.setComposedState(alias || keyArray, listenData.value);
          if (!this.inListenBatch && this.onChange) {
            this.onChange(this.data);
          }
          this.ignoreChange = false;
        }
        return this.data;
      };
      BaseAgent.prototype.listenFlat = function (key, _a) {
        var _b = _a === void 0 ? {} : _a,
          alias = _b.alias,
          transform = _b.transform,
          _c = _b.initialLoad,
          initialLoad = _c === void 0 ? true : _c,
          defaultValue = _b.defaultValue;
        var fullKey = getObjectPath(key);
        var derivedAlias = alias ? alias : fullKey[fullKey.length - 1];
        return this.listen(fullKey, {
          alias: derivedAlias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue
        });
      };
      BaseAgent.prototype.batchListen = function (childFunction) {
        this.inListenBatch = true;
        try {
          childFunction();
        } finally {
          if (this.onChange) this.onChange(this.data);
          this.inListenBatch = false;
        }
        return this.data;
      };
      BaseAgent.prototype.multiListen = function (listeners, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.flat,
          flat = _c === void 0 ? true : _c;
        var listenFunc = flat ? this.listenFlat : this.listen;
        return this.batchListen(function () {
          listeners.forEach(function (listener) {
            var isString = getTypeString(listener) === 'string';
            if (isString) {
              listenFunc(listener);
            } else {
              var options = listener;
              listenFunc(options.key, {
                alias: options.alias,
                transform: options.transform,
                defaultValue: options.defaultValue
              });
            }
          });
        });
      };
      BaseAgent.prototype.cleanup = function () {
        return this.unlistenFromAll();
      };
      BaseAgent.prototype.unlisten = function (key) {
        var keyArray = getObjectPath(key);
        this.mutastate.unlisten(keyArray, this.handleChange);
        this.clearAlias(keyArray);
      };
      BaseAgent.prototype.unlistenFromAll = function () {
        this.mutastate.unlistenBatch(this.toString());
        this.clearAllAliases();
      };
      BaseAgent.prototype.toString = function () {
        return "BaseAgent-".concat(this.constructor.name);
      };
      BaseAgent.prototype.handleChange = function (changeEvents) {
        this.ignoreChange = true;
        for (var changedex = 0; changedex < changeEvents.length; changedex += 1) {
          var changeEvent = changeEvents[changedex];
          var alias = changeEvent.alias,
            key = changeEvent.key,
            value = changeEvent.value;
          this.setComposedState(alias || key, value);
        }
        if (this.onChange && !this.paused) {
          this.onChange(this.data);
        }
        this.ignoreChange = false;
      };
      BaseAgent.prototype.get = function (key) {
        return this.mutastate.get(key);
      };
      BaseAgent.prototype.set = function (key, value, options) {
        this.mutastate.set(key, value, options);
      };
      BaseAgent.prototype["delete"] = function (key) {
        this.mutastate["delete"](key);
      };
      BaseAgent.prototype.assign = function (key, value) {
        this.mutastate.assign(key, value);
      };
      BaseAgent.prototype.push = function (key, value, options) {
        return this.mutastate.push(key, value, options);
      };
      BaseAgent.prototype.pop = function (key, options) {
        return this.mutastate.pop(key, options);
      };
      BaseAgent.prototype.has = function (key) {
        return this.mutastate.has(key);
      };
      BaseAgent.prototype.assure = function (key, defaultValue) {
        return this.mutastate.assure(key, defaultValue);
      };
      BaseAgent.prototype.getEverything = function () {
        return this.mutastate.getEverything();
      };
      BaseAgent.prototype.setEverything = function (data) {
        this.mutastate.setEverything(data);
      };
      BaseAgent.prototype.getAgentData = function () {
        return this.data;
      };
      BaseAgent.prototype.pause = function () {
        this.paused = true;
      };
      BaseAgent.prototype.resume = function (executeCallback) {
        if (executeCallback === void 0) {
          executeCallback = true;
        }
        this.paused = false;
        if (executeCallback && this.onChange) this.onChange(this.data);
      };
      return BaseAgent;
    }();

    var MutastateAgent = /** @class */function (_super) {
      __extends(MutastateAgent, _super);
      function MutastateAgent(mutastate, onChange) {
        var _this = _super.call(this, mutastate, onChange) || this;
        _this.batch = null;
        _this.defaultValues = {};
        _this.listeners = {};
        _this.transforms = {};
        return _this;
      }
      // Override the resolveKey method for enhanced functionality
      MutastateAgent.prototype.resolveKey = function (key) {
        // First check if it's an alias in our alias mapping
        if (!Array.isArray(key) && this.aliasObject && this.aliasObject[key]) {
          return Array.isArray(this.aliasObject[key]) ? this.aliasObject[key] : typeof this.aliasObject[key] === 'string' ? this.aliasObject[key].split('.') : [this.aliasObject[key]];
        }
        // Otherwise parse it normally
        if (Array.isArray(key)) return key;
        return key.split('.');
      };
      // Make the key-value transforms and tracking public
      MutastateAgent.prototype.registerTransform = function (keyStr, transform) {
        this.transforms[keyStr] = transform;
      };
      MutastateAgent.prototype.registerDefaultValue = function (keyStr, defaultValue) {
        this.defaultValues[keyStr] = defaultValue;
      };
      MutastateAgent.prototype.registerListener = function (keyStr, options) {
        this.listeners[keyStr] = options;
      };
      // Store alias mapping for easier resolution
      MutastateAgent.prototype.mapAliasToKey = function (alias, key) {
        var keyArray = this.resolveKey(key);
        this.setAlias(keyArray, alias);
      };
      // Provides structure for proxying
      MutastateAgent.prototype.listen = function (key, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        var keyArray = this.resolveKey(key);
        var keyStr = keyArray.join('.');
        var transform = options.transform,
          defaultValue = options.defaultValue;
        if (transform) this.registerTransform(keyStr, transform);
        if (defaultValue !== undefined) this.registerDefaultValue(keyStr, defaultValue);
        this.registerListener(keyStr, options);
        // Call the parent method
        return this.batchListen(function () {
          var _a;
          var modifiedListener = __assign(__assign({}, options || {}), {
            callback: _this.handleChange.bind(_this),
            batch: _this
          });
          _this.mutastate.listen(keyArray, modifiedListener);
          if (options && options.alias) {
            _this.setAlias(keyArray, options.alias);
            // For compatibility with test expectations, directly set the alias mappings
            if (typeof options.alias === 'string') {
              _this.aliasObject[options.alias] = Array.isArray(key) ? key : key.split('.');
            } else if (Array.isArray(options.alias)) {
              for (var _i = 0, _b = options.alias; _i < _b.length; _i++) {
                var alias = _b[_i];
                _this.aliasObject[alias] = Array.isArray(key) ? key : key.split('.');
              }
            }
            // For ProxyAgent, also store alias in the reverse lookup
            if (_this instanceof MutastateAgent) {
              _this.mapAliasToKey(options.alias, keyArray);
            }
          }
          // Get the current value from the state or use the default
          var currentValue = (_a = _this.mutastate.get(keyArray)) !== null && _a !== void 0 ? _a : options.defaultValue;
          // Update the agent's data directly with the current value
          if (options.alias) {
            // If there's an alias, use that as the key in the data object
            var alias = options.alias;
            if (typeof alias === 'string') {
              _this.data[alias] = currentValue;
            } else if (Array.isArray(alias)) {
              for (var _c = 0, alias_1 = alias; _c < alias_1.length; _c++) {
                var a = alias_1[_c];
                _this.data[a] = currentValue;
              }
            }
          } else {
            // Otherwise use the last part of the key path
            var lastKey = Array.isArray(keyArray) && keyArray.length > 0 ? keyArray[keyArray.length - 1] : String(keyArray);
            if (typeof lastKey === 'string') {
              _this.data[lastKey] = currentValue;
            }
          }
          // If we have a default value, also make sure it's set in the state
          if (options && options.defaultValue !== undefined) {
            _this.setComposedState(options.alias || keyArray, options.defaultValue);
          }
        });
      };
      MutastateAgent.prototype.listenFlat = function (key, options) {
        if (options === void 0) {
          options = {};
        }
        return this.listen(key, __assign(__assign({}, options), {
          noChildUpdates: true
        }));
      };
      MutastateAgent.prototype.batchListen = function (childFunction) {
        var randomString = Math.random().toString(36).substring(2, 15);
        this.batch = randomString;
        // Call our own implementation to avoid calling super
        var wasInListenBatch = this.inListenBatch;
        this.inListenBatch = true;
        try {
          childFunction();
        } finally {
          if (this.onChange && !wasInListenBatch) this.onChange(this.data);
          this.inListenBatch = wasInListenBatch;
        }
        this.batch = null;
        return this.data;
      };
      MutastateAgent.prototype.multiListen = function (listeners, config) {
        var _this = this;
        if (config === void 0) {
          config = {};
        }
        return this.batchListen(function () {
          if (Array.isArray(listeners)) {
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
              var listener = listeners_1[_i];
              if (typeof listener === 'string') {
                if (config.flat) {
                  _this.listenFlat(listener);
                } else {
                  _this.listen(listener);
                }
              } else {
                var options = listener;
                if (config.flat) {
                  _this.listenFlat(options.key, {
                    alias: options.alias,
                    defaultValue: options.defaultValue,
                    transform: options.transform
                  });
                } else {
                  _this.listen(options.key, {
                    alias: options.alias,
                    defaultValue: options.defaultValue,
                    transform: options.transform
                  });
                }
              }
            }
          }
        });
      };
      MutastateAgent.prototype.cleanup = function () {
        // Call unlistenFromAll which will properly handle cleanup
        this.unlistenFromAll();
        // Ensure data is cleared
        this.data = {};
      };
      return MutastateAgent;
    }(BaseAgent);

    /**
     * A throttled function wrapper
     */
    function throttle(func, timeout) {
      var waiting = false;
      var lastArgs = null;
      return function throttleWrap() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (!waiting) {
          func.apply(void 0, args);
          waiting = true;
          setTimeout(function () {
            waiting = false;
            if (lastArgs) {
              var sendArgs = lastArgs;
              lastArgs = null;
              throttleWrap.apply(void 0, sendArgs);
            }
          }, timeout);
        } else {
          lastArgs = args;
        }
      };
    }
    /**
     * Given a key array and a value, create an object with the key array as the path and the value at that path
     */
    function getKeyFilledObject(keyArray, value) {
      var result = {};
      var keyFillObject = result;
      for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
        keyFillObject[keyArray[keydex]] = {};
        keyFillObject = keyFillObject[keyArray[keydex]];
      }
      if (keyArray.length > 0) {
        keyFillObject[keyArray[keyArray.length - 1]] = value;
      } else {
        result = value;
      }
      return result;
    }
    /**
     * findIndex (es6 polyfill)
     */
    function findIndex(array, callback) {
      for (var dex = 0; dex < array.length; dex += 1) {
        if (callback(array[dex], dex, array)) return dex;
      }
      return -1;
    }

    /**
     * Helper function to determine if a key is considered blank
     * @param {string|string[]} key Key to check
     * @returns {boolean} True if the key is blank
     */
    function isBlankKey(key) {
      if (key === null || key === undefined) return true;
      if (Array.isArray(key) && key.length === 0) return true;
      if (typeof key === 'string' && key.length === 0) return true;
      return false;
    }

    /**
     * Get a Promise implementation
     * @returns {Promise} Promise implementation
     */
    function getPromiseFunction() {
      try {
        return Promise;
      } catch (err) {
        try {
          var bluebird = require('bluebird');
          return bluebird;
        } catch (err2) {
          throw new Error('No promise implementation available');
        }
      }
    }

    var ProxyAgent = /** @class */function (_super) {
      __extends(ProxyAgent, _super);
      function ProxyAgent(mutastate, onChange) {
        var _this = _super.call(this, mutastate, onChange) || this;
        // We need to create a proxy object that forwards:
        // 1. Property access to state from this.get
        // 2. All methods from this ProxyAgent instance
        // 3. Special properties like 'data'
        var methodNames = ['listen', 'listenFlat', 'batchListen', 'multiListen', 'cleanup', 'unlisten', 'unlistenFromAll', 'handleChange', 'get', 'set', 'delete', 'assign', 'push', 'pop', 'has', 'assure', 'getEverything', 'setEverything', 'getAgentData', 'pause', 'resume', 'translate', 'resolveKey'];
        _this.handler = {
          get: function get(target, prop) {
            if (typeof prop === 'string') {
              // Special case for data property
              if (prop === 'data') {
                // Return a proxy for the data object to intercept property access
                return new Proxy(_this.data || {}, {
                  get: function get(dataTarget, dataProp) {
                    if (typeof dataProp === 'string') {
                      return _this.data[dataProp];
                    }
                    return undefined;
                  },
                  set: function set(dataTarget, dataProp, dataValue) {
                    if (typeof dataProp === 'string') {
                      // When setting data property, update the state
                      // First check if it's an alias and get the actual key
                      var resolvedKey = _this.resolveKey(dataProp);
                      var actualKey = Array.isArray(resolvedKey) ? resolvedKey.join('.') : resolvedKey;
                      // Set the value in the state manager
                      _this.set(actualKey, dataValue);
                      // Manually update our internal data to ensure it's reflected immediately
                      // for consistent behavior between test expectations
                      _this.data[dataProp] = dataValue;
                      // If we have an onChange callback, call it with the updated data
                      if (_this.onChange) {
                        _this.onChange(_this.data);
                      }
                    }
                    return true;
                  }
                });
              }
              // First check if it's a method on the agent
              if (methodNames.includes(prop) && typeof _this[prop] === 'function') {
                return _this[prop].bind(_this);
              }
              // Check for special properties to skip
              if (['length', 'toJSON', 'constructor'].includes(prop)) {
                return undefined;
              }
              // If not a method, try to get the value from state
              return _this.get(prop);
            }
            return undefined;
          },
          set: function set(target, prop, value) {
            if (typeof prop === 'string') {
              if (prop === 'data' && _typeof(value) === 'object') {
                // Handle setting the entire data object - advanced usage
                // We need to update each key in the state manager
                Object.keys(value).forEach(function (key) {
                  _this.set(key, value[key]);
                });
                return true;
              }
              // Normal property setting goes to the state
              _this.set(prop, value);
            }
            return true;
          },
          deleteProperty: function deleteProperty(target, prop) {
            if (prop && typeof prop === 'string') {
              _this["delete"](prop);
            }
            return true;
          },
          has: function has(target, prop) {
            if (prop && typeof prop === 'string') {
              return _this.has(prop);
            }
            return false;
          }
        };
        // Create the proxy and add all methods from this instance
        var proxy = new Proxy({}, _this.handler);
        _this.agentProxy = proxy;
        // Return the proxy instance that will look like this class instance
        // but will actually use the custom proxy handler
        return proxy;
      }
      // Override resolveKey to properly handle aliases
      ProxyAgent.prototype.resolveKey = function (key) {
        // Direct pass-through if key is already an array
        if (Array.isArray(key)) {
          return key;
        }
        // Check for alias in our alias object
        if (typeof key === 'string' && this.aliasObject && this.aliasObject[key]) {
          return this.aliasObject[key];
        }
        // Call the parent class method
        return _super.prototype.resolveKey.call(this, key);
      };
      // Override the listen method to ensure aliases are properly stored
      ProxyAgent.prototype.listen = function (key, options) {
        if (options === void 0) {
          options = {};
        }
        var keyArray = this.resolveKey(key);
        // Make sure aliases are stored properly for resolution by ProxyAgent
        if (options && options.alias) {
          var alias = options.alias;
          var keyPath = typeof key === 'string' ? key.split('.') : key;
          // Store in aliasObject for resolution
          if (typeof alias === 'string') {
            this.aliasObject[alias] = keyPath;
          } else if (Array.isArray(alias)) {
            for (var _i = 0, alias_1 = alias; _i < alias_1.length; _i++) {
              var a = alias_1[_i];
              this.aliasObject[a] = keyPath;
            }
          }
        }
        var result = _super.prototype.listen.call(this, keyArray, options);
        return result;
      };
      // Override translate to ensure it works properly with the proxy
      ProxyAgent.prototype.translate = function (inputKey, outputKey, translationFunction, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.killOnCleanup,
          killOnCleanup = _c === void 0 ? true : _c,
          _d = _b.throttleTime,
          throttleTime = _d === void 0 ? null : _d;
        _super.prototype.translate.call(this, inputKey, outputKey, translationFunction, {
          killOnCleanup: killOnCleanup,
          throttleTime: throttleTime
        });
      };
      return ProxyAgent;
    }(MutastateAgent);

    /**
     * Core mutastate class, this class stores data and informs listeners of changes
     */
    var Mutastate = /** @class */function () {
      function Mutastate(options) {
        var _this = this;
        /**
         * @method
         * @description
         * An agent is a listener with alias and transform capabilities
         * @param {function} onChange
         */
        this.getAgent = function (onChange) {
          return new MutastateAgent(_this, onChange);
        };
        this.getProxyAgent = function (onChange) {
          return new ProxyAgent(_this, onChange);
        };
        /**
         * @ignore
         * @method
         * @description
         * Retrieve a list of relevant listeners given a change at a key;
         */
        this.getListenersAtPath = function (key) {
          var keyArray = isBlankKey(key) ? ['default'] : getObjectPath(key);
          var currentListenObject = _this.listenerObject;
          for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
            // Go through all keys except the last, which is where out final request will go
            var subKey = keyArray[keydex];
            currentListenObject = assurePathExists(currentListenObject, ['subkeys', subKey], {});
          }
          var finalKey = keyArray[keyArray.length - 1];
          return assurePathExists(currentListenObject, ['subkeys', finalKey, 'listeners'], []);
        };
        /**
         * @method
         * @description Listen for any change
         * @param {function} listener
         */
        this.addChangeHook = function (listener) {
          _this.removeChangeHook(listener);
          _this.globalListeners.push(listener);
        };
        this.removeChangeHook = function (listener) {
          var removed = 0;
          for (var dex = _this.globalListeners.length - 1; dex >= 0; dex -= 1) {
            if (_this.globalListeners[dex] === listener) {
              _this.globalListeners.splice(dex, 1);
              removed += 1;
            }
          }
          return removed;
        };
        /**
         * @method
         * @description
         * Add a path listener, dedupes by callback function, careful with anonymous functions!
         */
        this.listen = function (key, listener) {
          var listeners = _this.getListenersAtPath(key);
          var matchedListeners = listeners.reduce(function (results, existingListener, dex) {
            if (existingListener.callback === listener.callback) results.push(dex);
            return results;
          }, []);
          for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
            listeners.splice(matchedListeners[dex], 1);
          }
          listeners.push(listener);
          return true;
        };
        /**
         * @method
         * @description
         * Unlisten by callback, careful with anonymous functions!
         */
        this.unlisten = function (key, callback) {
          var listeners = _this.getListenersAtPath(key);
          var matchedListeners = listeners.reduce(function (results, existingListener, dex) {
            if (existingListener.callback === callback) results.push(dex);
            return results;
          }, []);
          for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
            listeners.splice(matchedListeners[dex], 1);
          }
        };
        /**
         * @method
         * @description
         * Unlisten by the batch parameter passed into the options of the listen function
         */
        this.unlistenBatch = function (batch, basePath) {
          var patharray = Array.isArray(basePath) ? basePath : basePath ? [basePath] : [];
          var subkeypath = __spreadArray(__spreadArray([], patharray, true), ['subkeys'], false);
          var subKeys = keys(get(_this.listenerObject, subkeypath));
          for (var keydex = 0; keydex < subKeys.length; keydex += 1) {
            _this.unlistenBatch(batch, __spreadArray(__spreadArray([], subkeypath, true), [subKeys[keydex]], false));
          }
          var listeners = get(_this.listenerObject, __spreadArray(__spreadArray([], patharray, true), ['listeners'], false));
          var matchedListeners = (listeners || []).reduce(function (results, existingListener, dex) {
            if (existingListener.batch === batch) results.push(dex);
            return results;
          }, []);
          for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
            listeners.splice(matchedListeners[dex], 1);
          }
        };
        /**
         * @method
         * @description
         * Get a full list of listeners under a subkey
         */
        this.getAllChildListeners = function (listenerObject, currentKey, type) {
          if (currentKey === void 0) {
            currentKey = [];
          }
          var result = [];
          var currentListeners = get(listenerObject, 'listeners') || [];
          var subkeyObject = get(listenerObject, 'subkeys') || {};
          var subkeys = keys(subkeyObject);
          for (var listenerdex = 0; listenerdex < currentListeners.length; listenerdex += 1) {
            result.push({
              listener: currentListeners[listenerdex],
              key: currentKey,
              type: type
            });
          }
          for (var keydex = 0; keydex < subkeys.length; keydex += 1) {
            var subkey = subkeys[keydex];
            result = result.concat(_this.getAllChildListeners(subkeyObject[subkey], currentKey.concat(subkey), type));
          }
          return result;
        };
        /**
         * @method
         * @description
         * recurse original against incoming for changed keys, if original type is an object or array and incoming type is not the same
         * pass all child listeners. If incoming and original are both either objects or arrays, recurse the children using this function.
         */
        this.getDeleteListeners = function (original, incoming, listenerObject, currentKey) {
          if (currentKey === void 0) {
            currentKey = [];
          }
          var result = [];
          var originalType = getTypeString(original);
          if (originalType === 'object' || originalType === 'array') {
            var incomingType = getTypeString(incoming);
            if (incomingType !== originalType) {
              result = result.concat(_this.getAllChildListeners(listenerObject, currentKey, 'delete'));
              // Send delete notification to every child of the original key
            } else {
              var originalKeys = keys(original);
              if (has(listenerObject, 'subkeys')) {
                for (var keydex = 0; keydex < originalKeys.length; keydex += 1) {
                  var originalKey = originalKeys[keydex];
                  if (has(listenerObject.subkeys, originalKey)) {
                    if (!has(incoming, originalKey)) {
                      result = result.concat(_this.getAllChildListeners(listenerObject.subkeys[originalKey], currentKey.concat(originalKey), 'delete'));
                    } else {
                      result = result.concat(_this.getDeleteListeners(get(original, originalKey), get(incoming, originalKey), listenerObject.subkeys[originalKey], currentKey.concat(originalKey)));
                    }
                  }
                }
              }
            }
          }
          return result;
        };
        this.notifyGlobals = function (keyArray, value, meta) {
          for (var dex = 0; dex < _this.globalListeners.length; dex += 1) {
            var passData = {
              key: keyArray,
              value: value,
              meta: meta || {}
            };
            _this.globalListeners[dex](passData);
          }
        };
        this.listenerObject = {
          subkeys: {}
        };
        this.replicators = [];
        this.globalListeners = [];
        this.data = {};
        this.promise = getPromiseFunction();
        this.nextReplicatorId = 0;
      }
      /**
       * @method
       * @description
       * Get data for a particular listener, apply transformation to the value
       */
      Mutastate.prototype.getForListener = function (key, listener) {
        var alias = listener.alias,
          callback = listener.callback,
          transform = listener.transform,
          defaultValue = listener.defaultValue;
        var keyArray = getObjectPath(key);
        var value = null;
        if (has(this.data, keyArray)) {
          value = get(this.data, keyArray);
        } else {
          var clonedValue = clone(defaultValue);
          if (defaultValue !== undefined) {
            set(this.data, keyArray, clonedValue);
            this.notifyGlobals(keyArray, clonedValue, {
              defaultValue: true
            });
          }
          value = clonedValue;
        }
        return {
          alias: alias,
          callback: callback,
          key: keyArray,
          value: transform ? transform(value) : value
        };
      };
      /**
       * @method
       * @description
       * given a change, notify all parents of the relevant key, and for every subkey of the incoming data notify listeners
       * this function does not notify any listers of removed data, getDeleteListeners fulfills that role
       */
      Mutastate.prototype.getChangeListeners = function (change, sublistener, key, originalChangeDepth, currentChangeDepth) {
        if (key === void 0) {
          key = [];
        }
        if (originalChangeDepth === void 0) {
          originalChangeDepth = 0;
        }
        if (currentChangeDepth === void 0) {
          currentChangeDepth = 0;
        }
        var changeRelativity = originalChangeDepth - currentChangeDepth; // Parent change > 0, child change < 0, currentChange == 0
        var result = [];
        if (has(sublistener, 'listeners')) {
          for (var listenerdex = 0; listenerdex < sublistener.listeners.length; listenerdex += 1) {
            var listener = sublistener.listeners[listenerdex];
            if (listener.noChildUpdates === true && changeRelativity > 0) ; // Skip informing parents who don't care
            else if (listener.noParentUpdates === true && changeRelativity < 0) ; // Skip informing children who don't care
            else {
              result.push({
                listener: listener,
                key: key,
                type: 'change'
              });
            }
          }
        }
        var changetype = getTypeString(change);
        if (has(sublistener, 'subkeys') && (changetype === 'array' || changetype === 'object')) {
          var changeKeys = keys(change);
          for (var keydex = 0; keydex < changeKeys.length; keydex += 1) {
            var changeKey = changeKeys[keydex];
            if (has(sublistener.subkeys, changeKey)) {
              result = result.concat(this.getChangeListeners(change[changeKey], sublistener.subkeys[changeKey], key.concat(changeKey), originalChangeDepth, currentChangeDepth + 1));
            }
          }
        }
        return result;
      };
      /**
       * @method
       * @description
       * Listeners are nested by a pattern of subkeys.key.subkeys.otherkey, this function turns ['key', 'otherkey'] into the expected array
       */
      Mutastate.prototype.getListenerObjectAtKey = function (key) {
        var result = this.listenerObject;
        if (key.length === 0) return result;
        for (var keydex = 0; keydex < key.length; keydex += 1) {
          if (has(result, ['subkeys', key[keydex]])) {
            result = result.subkeys[key[keydex]];
          } else {
            return null;
          }
        }
        return result;
      };
      /**
       * @method
       * @description
       * Concatenate change and delete listeners for a given change
       */
      Mutastate.prototype.getRelevantListeners = function (key, value) {
        var keyArray = getObjectPath(key);
        var changeListeners = this.getChangeListeners(getKeyFilledObject(keyArray, value), this.listenerObject, [], keyArray.length);
        var original = get(this.data, keyArray);
        var deleteListeners = this.getDeleteListeners(original, value, this.getListenerObjectAtKey(keyArray), keyArray);
        return changeListeners.concat(deleteListeners);
      };
      /**
       * @method
       * @description
       * Execute notify callbacks for a batch in format [{ listener, key }]
       */
      Mutastate.prototype.notify = function (notifyBatch, keyArray, value) {
        var callbackBatches = [];
        var _loop_1 = function _loop_1(keydex) {
          var keyChange = notifyBatch[keydex];
          var listenerIndex = findIndex(callbackBatches, function (callbackBatch) {
            return callbackBatch.callback === keyChange.listener.callback;
          });
          if (listenerIndex !== -1) {
            callbackBatches[listenerIndex].changes.push(this_1.getForListener(keyChange.key, keyChange.listener));
          } else {
            callbackBatches.push({
              callback: keyChange.listener.callback,
              changes: [this_1.getForListener(keyChange.key, keyChange.listener)]
            });
          }
        };
        var this_1 = this;
        for (var keydex = 0; keydex < notifyBatch.length; keydex += 1) {
          _loop_1(keydex);
        }
        for (var callbatch = 0; callbatch < callbackBatches.length; callbatch += 1) {
          var listenerBatch = callbackBatches[callbatch];
          var callback = listenerBatch.callback,
            changes = listenerBatch.changes;
          callback(changes);
        }
        this.notifyGlobals(keyArray, value);
      };
      Mutastate.prototype.get = function (key) {
        return get(this.data, key);
      };
      Mutastate.prototype.set = function (key, value, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.notify,
          notify = _c === void 0 ? true : _c;
        var keyArray = getObjectPath(key);
        var listeners = this.getRelevantListeners(keyArray, value);
        // Consider a pre-notify here
        set(this.data, key, value);
        if (notify) this.notify(listeners, keyArray, value);
      };
      Mutastate.prototype["delete"] = function (key) {
        this.set(key, undefined);
        assassinate(this.data, key);
      };
      Mutastate.prototype.assign = function (key, value) {
        var original = get(this.data, key);
        var originalType = getTypeString(original);
        var incomingType = getTypeString(value);
        if (originalType === 'object' && incomingType === 'object') {
          this.set(key, Object.assign({}, original, value));
        } else {
          this.set(key, value);
        }
      };
      Mutastate.prototype.push = function (key, value, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.notify,
          notify = _c === void 0 ? true : _c;
        var keyArray = getObjectPath(key);
        var original = get(this.data, keyArray);
        var originalType = getTypeString(original);
        if (originalType === 'array') {
          var array = original;
          var extendedKey = __spreadArray(__spreadArray([], keyArray, true), [array.length.toString()], false);
          var listeners = this.getRelevantListeners(extendedKey, value);
          // Consider a pre-notify here
          array.push(value);
          if (notify) this.notify(listeners, extendedKey, value);
          return true;
        } else if (originalType === 'undefined' || originalType === 'null') {
          this.set(keyArray, [value]);
          return true;
        }
        return false;
      };
      Mutastate.prototype.pop = function (key, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.notify,
          notify = _c === void 0 ? true : _c;
        var keyArray = getObjectPath(key);
        var original = get(this.data, keyArray);
        var originalType = getTypeString(original);
        if (originalType === 'array' && original.length > 0) {
          var array = original;
          var extendedKey = __spreadArray(__spreadArray([], keyArray, true), [(array.length - 1).toString()], false);
          var listeners = this.getRelevantListeners(extendedKey, undefined);
          // Consider a pre-notify here
          array.pop();
          if (notify) this.notify(listeners, extendedKey, undefined);
          return true;
        }
        return false;
      };
      Mutastate.prototype.has = function (key) {
        return has(this.data, key);
      };
      Mutastate.prototype.assure = function (key, defaultValue) {
        if (!this.has(key)) this.set(key, defaultValue);
        return this.get(key);
      };
      Mutastate.prototype.getEverything = function () {
        return this.data;
      };
      Mutastate.prototype.setEverything = function (data, _a) {
        var _b = _a === void 0 ? {} : _a,
          _c = _b.noDefaults,
          noDefaults = _c === void 0 ? false : _c;
        var defaultedData = noDefaults ? data : Object.assign(this.getDefaults(), data || {});
        var listeners = this.getRelevantListeners([], defaultedData);
        this.data = defaultedData;
        this.notify(listeners, [], defaultedData);
      };
      Mutastate.prototype.getDefaults = function (subkey) {
        if (!this.listenerObject) return {};
        var result = {};
        var listeners = this.getAllChildListeners(this.listenerObject, [], 'change');
        listeners.forEach(function (listener) {
          if (listener.listener.defaultValue !== undefined) {
            set(result, listener.key.join('.'), listener.listener.defaultValue);
          }
        });
        return result;
      };
      Mutastate.prototype.translate = function (inputKey, outputKey, translationFunction, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a,
          batch = _b.batch,
          _c = _b.throttleTime,
          throttleTime = _c === void 0 ? null : _c;
        var callback = function callback(input) {
          if (input.length > 0) {
            var output = translationFunction(input[input.length - 1].value);
            if (output instanceof Promise) {
              output.then(function (result) {
                return _this.set(outputKey, result);
              });
            } else {
              _this.set(outputKey, output);
            }
          }
        };
        var shouldThrottle = getTypeString(throttleTime) === 'number' && throttleTime > 0;
        this.listen(inputKey, {
          initialLoad: true,
          batch: batch,
          callback: shouldThrottle ? throttle(callback, throttleTime) : callback
        });
      };
      Mutastate.prototype.replicate = function (config) {
        var _this = this;
        var send = config.send,
          primary = config.primary,
          ignore = config.ignore,
          sendInitial = config.sendInitial,
          _a = config.canSetEverything,
          canSetEverything = _a === void 0 ? true : _a;
        var ignoreObject = {};
        if (ignore) {
          for (var _i = 0, ignore_1 = ignore; _i < ignore_1.length; _i++) {
            var key = ignore_1[_i];
            set(ignoreObject, key, true);
          }
        }
        var replicator = {
          send: send,
          primary: primary,
          ignore: ignore,
          id: ++this.nextReplicatorId,
          ignores: {},
          ignoreEverything: false
        };
        this.replicators.push(replicator);
        var changeHook = function changeHook(data) {
          if (get(replicator.ignores, data.key) === true) return false;
          if (get(ignoreObject, data.key[0]) === true) return false;
          if (replicator.ignoreEverything) return false;
          replicator.send(data);
          return true;
        };
        replicator.changeHook = changeHook;
        this.addChangeHook(changeHook);
        var receiver = function receiver(data) {
          set(replicator.ignores, data.key, true);
          if (data.key.length === 0) {
            if (canSetEverything) {
              replicator.ignoreEverything = true;
              _this.setEverything(data.value);
              replicator.ignoreEverything = false;
            }
          } else {
            _this.set(data.key, data.value);
          }
          assassinate(replicator.ignores, data.key);
        };
        replicator.receiver = receiver;
        if (sendInitial) {
          changeHook({
            key: [],
            value: this.getEverything(),
            meta: {}
          });
        }
        return receiver;
      };
      Mutastate.prototype.stopReplicating = function (receiverFunction) {
        var replicator = this.replicators.find(function (replicator) {
          return replicator.receiver === receiverFunction;
        });
        if (replicator && replicator.changeHook) {
          this.removeChangeHook(replicator.changeHook);
          this.replicators = this.replicators.filter(function (current) {
            return current.id !== replicator.id;
          });
        }
      };
      Mutastate.prototype.stopAllReplication = function () {
        for (var _i = 0, _a = this.replicators; _i < _a.length; _i++) {
          var replicator = _a[_i];
          if (replicator.receiver) {
            this.stopReplicating(replicator.receiver);
          }
        }
      };
      return Mutastate;
    }();

    var mutastateInstance;
    function singleton() {
      if (!mutastateInstance) {
        mutastateInstance = new Mutastate();
      }
      return mutastateInstance;
    }

    /**
     * React-specific exports for Mutastate
     * Import from 'mutastate/react' to use React features
     */
    /**
     * React hook for mutastate
     * @param {KeyType} key - Key to listen to
     * @param {Object} listenerParams - Options for the listener
     * @param {any} listenerParams.defaultValue - Default value if key doesn't exist
     * @param {Mutastate} listenerParams.globalState - Mutastate instance to use (singleton by default)
     * @returns {[any, (value: any | ((prevValue: any) => any)) => void]} Value and setter tuple, similar to useState
     */
    function useMutastate(key, listenerParams) {
      if (listenerParams === void 0) {
        listenerParams = {};
      }
      var defaultValue = listenerParams.defaultValue,
        _a = listenerParams.globalState,
        globalState = _a === void 0 ? singleton() : _a;
      var startingValue = globalState.has(key) ? globalState.get(key) : defaultValue;
      // @ts-ignore - React types
      var _b = React.useState(clone$1(startingValue)),
        data = _b[0],
        setData = _b[1];
      var refKey = React.useRef(key);
      React.useEffect(function () {
        var func = function func() {
          return setData(clone$1(globalState.get(key)));
        };
        globalState.listen(key, {
          callback: func,
          defaultValue: defaultValue
        });
        if (!deepEq(refKey.current, key)) {
          func();
          refKey.current = key;
        }
        return function () {
          return globalState.unlisten(key, func);
        };
      }, [key, defaultValue, globalState]);
      var setGlobalData = React.useCallback(function (value) {
        if (typeof value === 'function') {
          var currentValue = globalState.has(key) ? globalState.get(key) : defaultValue;
          var newValue = value(currentValue);
          globalState.set(key, newValue);
        } else {
          globalState.set(key, value);
        }
      }, [key, defaultValue, globalState]);
      return [data, setGlobalData];
    }
    function withMutastateCreator(options) {
      if (options === void 0) {
        options = {};
      }
      return function withMutastate(WrappedComponent) {
        var _a = options.listeners,
          listeners = _a === void 0 ? [] : _a,
          _b = options.listenersFlat,
          listenersFlat = _b === void 0 ? false : _b,
          _c = options.globalState,
          globalState = _c === void 0 ? singleton() : _c;
        var WithMutastate = /** @class */function (_super) {
          __extends(WithMutastate, _super);
          function WithMutastate(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {};
            _this.agent = globalState.getAgent(_this.onMutastateChange.bind(_this));
            _this.updateListeners(props);
            return _this;
          }
          WithMutastate.prototype.componentWillUnmount = function () {
            this.agent.cleanup();
          };
          WithMutastate.prototype.componentDidUpdate = function (prevProps) {
            if (typeof listeners === 'function') {
              var nextListeners = listeners(this.props);
              var prevListeners = listeners(prevProps);
              if (JSON.stringify(nextListeners) !== JSON.stringify(prevListeners)) {
                this.updateListeners(this.props);
              }
            }
          };
          WithMutastate.prototype.updateListeners = function (props) {
            var resolvedListeners = typeof listeners === 'function' ? listeners(props) : listeners;
            this.agent.multiListen(resolvedListeners, {
              flat: listenersFlat
            });
          };
          WithMutastate.prototype.onMutastateChange = function (changes) {
            var newState = {};
            for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
              var change = changes_1[_i];
              if (typeof change.key === 'string') {
                newState[change.key] = change.value;
              }
            }
            this.setState(newState);
          };
          WithMutastate.prototype.render = function () {
            return React__default.createElement(WrappedComponent, __assign(__assign(__assign({}, this.props), this.state), {
              mutastate: this.agent
            }));
          };
          return WithMutastate;
        }(React__default.Component);
        return WithMutastate;
      };
    }
    var withMutastate = withMutastateCreator();

    exports.Mutastate = Mutastate;
    exports.MutastateAgent = MutastateAgent;
    exports.ProxyAgent = ProxyAgent;
    exports.default = Mutastate;
    exports.singleton = singleton;
    exports.useMutastate = useMutastate;
    exports.withMutastate = withMutastate;
    exports.withMutastateCreator = withMutastateCreator;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react.js.map
