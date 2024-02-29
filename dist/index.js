(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bluebird'), require('lodash.clone')) :
  typeof define === 'function' && define.amd ? define(['exports', 'bluebird', 'lodash.clone'], factory) :
  (global = global || self, factory(global.mutastate = {}, global.bluebird, global.clone$1));
}(this, (function (exports, bluebird, clone$1) { 'use strict';

  bluebird = bluebird && Object.prototype.hasOwnProperty.call(bluebird, 'default') ? bluebird['default'] : bluebird;
  clone$1 = clone$1 && Object.prototype.hasOwnProperty.call(clone$1, 'default') ? clone$1['default'] : clone$1;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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

  /**
   * Objer module, interact with objects
   * @module objer
   */

  /**
   * Set value at an object subpath
   * @param {Object} object
   * @param {string|array} path
   * @param {*} value
   */
  function set(object, path, value) {
    var subObject = object;
    var keys = getObjectPath(path);
    if (keys.length === 0) return value; // We cannot modify the original value to be the new value no matter how hard we try

    for (var keydex = 0; keydex < keys.length; keydex += 1) {
      var key = keys[keydex];

      if (key !== '') {
        if (keydex !== keys.length - 1) {
          if (subObject[key] === null || _typeof(subObject[key]) !== 'object') {
            subObject[key] = {};
          }

          subObject = subObject[key];
        } else {
          subObject[key] = value;
        }
      }
    }

    return object;
  }
  /**
   * Get array of keys in an object
   * @param {Object} object
   */

  function keys(object) {
    var stringType = getTypeString(object);

    if (stringType === 'object' || stringType === 'array') {
      if (typeof Object.keys !== 'undefined') return Object.keys(object);
      var _keys = [];

      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          _keys.push(key);
        }
      }

      return _keys;
    }

    return [];
  }
  function assassinate(source, path) {
    var pathArray = getObjectPath(path);

    if (pathArray.length > 0) {
      var parentPath = pathArray.slice(0, pathArray.length - 1);

      if (has(source, parentPath) || parentPath.length === 0) {
        var original = get(source, parentPath);
        var originalType = getTypeString(original);
        var pathKey = pathArray[pathArray.length - 1];

        if (originalType === 'object') {
          delete original[pathKey];
        } else if (originalType === 'array' && typeof pathKey === 'number') {
          original.splice(pathKey, 1);
        }
      }
    }

    return source;
  }
  function clone(source) {
    var stringType = getTypeString(source);

    if (stringType === 'object') {
      var sourceKeys = keys(source);
      var result = {};

      for (var keydex = 0; keydex < sourceKeys.length; keydex += 1) {
        result[sourceKeys[keydex]] = clone(source[sourceKeys[keydex]]);
      }

      return result;
    } else if (stringType === 'array') {
      var length = source.length;
      var _result = [];

      for (var dex = 0; dex < length; dex += 1) {
        _result.push(clone(source[dex]));
      }

      return _result;
    }

    return source;
  }
  /**
   * Check if an object has a value at a path
   * @param {Object} object
   * @param {string|array} path
   */

  function has(object, path) {
    var subObject = object;
    var keys = getObjectPath(path);
    if (keys.length === 0) return false;

    for (var keydex = 0; keydex < keys.length; keydex += 1) {
      var key = keys[keydex];
      if (!hasRoot(subObject, key)) return false;
      subObject = subObject[key];
    }

    return true;
  }
  /**
   * Check if an object has a top level key, hasRoot({ a: 1 }, 'a'); is true, hasRoot({ a: { b: 1 } }, 'a.b'); is false
   * @param {Object} object
   * @param {string} key
   */

  function hasRoot(object, key) {
    if (object !== null && _typeof(object) === 'object') {
      return key in object;
    }

    return false;
  }
  /**
   * Retrieve value from within an object or array
   * @param {Object} object
   * @param {string|array} path
   * @param {*} [defaultValue]
   */

  function get(object, path) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var subObject = object;
    var keys = getObjectPath(path);

    for (var keydex = 0; keydex < keys.length; keydex += 1) {
      var key = keys[keydex];

      if (key !== '') {
        if (!hasRoot(subObject, key)) return defaultValue;
        subObject = subObject[key];
      }
    }

    return subObject;
  }
  /**
   * Resolve a path to a path array 'a.b.c' returns ['a', 'b', 'c']
   * @param {string|array} path
   */

  function getObjectPath(path) {
    var inputType = getTypeString(path);
    if (inputType === 'array') return path;

    if (inputType !== 'string') {
      if (inputType === 'number') return [path];
      return [];
    }

    var inBrackets = false;
    var partBegin = 0;
    var split = false;
    var exitBrackets = false;
    var pathlen = path.length;
    var parts = [];

    for (var dex = 0; dex < pathlen + 1; dex += 1) {
      var _char = path[dex];

      if (inBrackets && !exitBrackets) {
        if (_char === ']') {
          exitBrackets = true;
        }
      } else if (_char === '.') {
        split = true;
      } else if (_char === '[') {
        split = true;
        inBrackets = true;
      }

      if (split || dex === pathlen) {
        var nextPart = path.substr(partBegin, dex - partBegin - (exitBrackets ? 1 : 0));

        if (inBrackets) {
          var parsed = parseInt(nextPart, 10);

          if (!isNaN(parsed)) {
            nextPart = parsed;
          }
        }

        parts.push(nextPart);
        partBegin = dex + 1;
        split = false;
        if (exitBrackets) inBrackets = false;
        exitBrackets = false;
      }
    }

    return parts;
  }
  /**
   * If this subkey doesn't exist, initialize it to defaultValue
   * @param {Object} object
   * @param {string|array} path
   * @param {*} defaultValue
   */

  function assurePathExists(object, path) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var arrayPath = getObjectPath(path);
    var currentObject = object;

    for (var arraydex = 0; arraydex < arrayPath.length; arraydex += 1) {
      var key = arrayPath[arraydex];

      if (!hasRoot(currentObject, key)) {
        // TODO: Address problems where key exists already and is not an array or object
        var nextKey = arraydex === arrayPath.length - 1 ? null : arrayPath[arraydex + 1];

        if (nextKey === null) {
          currentObject[key] = defaultValue;
        } else if (getTypeString(nextKey) === 'number') {
          currentObject[key] = [];
        } else {
          currentObject[key] = {};
        }
      }

      currentObject = currentObject[key];
    }

    return currentObject;
  }
  /**
   * Return simplified type as a string. [] returns 'array' new Date() returns 'date'
   * @param {*} data
   */

  function getTypeString(data) {
    var stringType = _typeof(data);

    if (stringType === 'object') {
      if (data === null) return 'null';
      var stringified = toString.apply(data);

      if (stringified.length > 2 && stringified[0] === '[' && stringified[stringified.length - 1] === ']') {
        var splits = stringified.substr(1, stringified.length - 2).split(' ');

        if (splits.length > 1) {
          return splits.slice(1).join(' ').toLowerCase();
        }
      }

      return 'unknown';
    }

    if (stringType === 'number') {
      if (isNaN(data)) return 'nan';
    }

    return stringType;
  }
  /**
   * Check if both parameters are equal, check all nested keys of objects and arrays
   * @param {*} obja
   * @param {*} objb
   */

  function deepEq(left, right) {
    var leftType = getTypeString(left);
    var rightType = getTypeString(right);
    if (leftType !== rightType) return false;
    if (leftType === 'nan') return true;

    if (leftType === 'object') {
      if (left === right) return true; // if they are the same thing, don't check children

      var leftKeys = keys(left).sort(); // unsorted could be unequal

      var rightKeys = keys(right).sort();
      if (!deepEq(leftKeys, rightKeys)) return false;

      for (var keydex = 0; keydex < leftKeys.length; keydex += 1) {
        if (!deepEq(left[leftKeys[keydex]], right[leftKeys[keydex]])) return false;
      }

      return true;
    }

    if (leftType === 'array') {
      if (left === right) return true; // if they are the same thing, don't check children

      if (left.length !== right.length) return false;

      for (var dex = 0; dex < left.length; dex += 1) {
        if (!deepEq(left[dex], right[dex])) return false;
      }

      return true;
    }

    return left === right;
  }

  var BaseAgent = /*#__PURE__*/function () {
    function BaseAgent(mutastate, onChange) {
      var _this = this;

      _classCallCheck(this, BaseAgent);

      _defineProperty(this, "getComposedState", function (initialData, key, value) {
        if (key instanceof Array && key.length === 0 || key === null) return value;
        set(initialData, key, value);
        return initialData;
      });

      _defineProperty(this, "setComposedState", function (key, value) {
        _this.data = _this.getComposedState(_this.data, key, value);
      });

      _defineProperty(this, "translate", function (inputKey, outputKey, translationFunction) {
        var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            _ref$killOnCleanup = _ref.killOnCleanup,
            killOnCleanup = _ref$killOnCleanup === void 0 ? true : _ref$killOnCleanup,
            _ref$throttleTime = _ref.throttleTime,
            throttleTime = _ref$throttleTime === void 0 ? null : _ref$throttleTime;

        _this.mutastate.translate(inputKey, outputKey, translationFunction, {
          batch: killOnCleanup ? _this : undefined,
          throttleTime: throttleTime
        });
      });

      _defineProperty(this, "setAlias", function (key, alias) {
        set(_this.aliasObject, alias, key);
        set(_this.reverseAliasObject, key, alias);
      });

      _defineProperty(this, "clearAlias", function (key) {
        var alias = get(_this.reverseAliasObject, key);

        if (alias) {
          assassinate(_this.reverseAliasObject, key);
          assassinate(_this.aliasObject, alias);
        }
      });

      _defineProperty(this, "clearAllAliases", function () {
        _this.aliasObject = {};
        _this.reverseAliasObject = {};
      });

      _defineProperty(this, "resolveKey", function (key) {
        var keyArray = getObjectPath(key);
        var firstKey = keyArray instanceof Array ? keyArray[0] : keyArray;
        return has(_this.aliasObject, firstKey) ? [].concat(get(_this.aliasObject, firstKey)).concat(keyArray.slice(1)) : keyArray;
      });

      _defineProperty(this, "resolve", this.resolveKey);

      _defineProperty(this, "listen", function (key) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            alias = _ref2.alias,
            transform = _ref2.transform,
            _ref2$initialLoad = _ref2.initialLoad,
            initialLoad = _ref2$initialLoad === void 0 ? true : _ref2$initialLoad,
            defaultValue = _ref2.defaultValue;

        var keyArray = getObjectPath(key);
        var modifiedListener = {
          alias: alias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue,
          callback: _this.handleChange,
          batch: _this
        };

        _this.mutastate.listen(keyArray, modifiedListener);

        if (alias) {
          _this.setAlias(keyArray, alias);
        }

        if (initialLoad) {
          _this.ignoreChange = true;

          var listenData = _this.mutastate.getForListener(keyArray, modifiedListener);

          _this.setComposedState(alias || keyArray, listenData.value);

          if (!_this.inListenBatch && _this.onChange) {
            _this.onChange(_this.data);
          }

          _this.ignoreChange = false;
        }

        return _this.data;
      });

      _defineProperty(this, "listenFlat", function (key) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            alias = _ref3.alias,
            transform = _ref3.transform,
            _ref3$initialLoad = _ref3.initialLoad,
            initialLoad = _ref3$initialLoad === void 0 ? true : _ref3$initialLoad,
            defaultValue = _ref3.defaultValue;

        var fullKey = getObjectPath(key);
        var derivedAlias = alias ? alias : fullKey[fullKey.length - 1];
        return _this.listen(fullKey, {
          alias: derivedAlias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue
        });
      });

      _defineProperty(this, "batchListen", function (childFunction) {
        _this.inListenBatch = true;

        try {
          childFunction();
        } finally {
          if (_this.onChange) _this.onChange(_this.data);
          _this.inListenBatch = false;
        }

        return _this.data;
      });

      _defineProperty(this, "multiListen", function (listeners) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$flat = _ref4.flat,
            flat = _ref4$flat === void 0 ? true : _ref4$flat;

        var listenFunc = flat ? _this.listenFlat : _this.listen;
        return _this.batchListen(function () {
          listeners.forEach(function (listener) {
            var isString = getTypeString(listener) === 'string';
            var key = isString ? listener : get(listener, 'key');
            listenFunc(key, isString ? undefined : listener);
          });
        });
      });

      _defineProperty(this, "unlisten", function (key) {
        var keyArray = getObjectPath(key);

        var result = _this.mutastate.unlisten(keyArray, _this.handleChange);

        _this.clearAlias(keyArray);

        return result;
      });

      _defineProperty(this, "unlistenFromAll", function () {
        _this.mutastate.unlistenBatch(_this);

        _this.clearAllAliases();
      });

      _defineProperty(this, "handleChange", function (changeEvents) {
        _this.ignoreChange = true;

        for (var changedex = 0; changedex < changeEvents.length; changedex += 1) {
          var changeEvent = changeEvents[changedex];
          var alias = changeEvent.alias,
              key = changeEvent.key,
              value = changeEvent.value;

          _this.setComposedState(alias || key, value);
        }

        if (_this.onChange && !_this.paused) {
          _this.onChange(_this.data);
        }

        _this.ignoreChange = false;
      });

      _defineProperty(this, "get", function (key) {
        return _this.mutastate.get(key);
      });

      _defineProperty(this, "set", function (key, value, options) {
        return _this.mutastate.set(key, value, options);
      });

      _defineProperty(this, "delete", function (key) {
        return _this.mutastate["delete"](key);
      });

      _defineProperty(this, "assign", function (key, value) {
        return _this.mutastate.assign(key, value);
      });

      _defineProperty(this, "push", function (key, value, options) {
        return _this.mutastate.push(key, value, options);
      });

      _defineProperty(this, "pop", function (key, options) {
        return _this.mutastate.pop(key, options);
      });

      _defineProperty(this, "has", function (key) {
        return _this.mutastate.has(key);
      });

      _defineProperty(this, "assure", function (key, defaultValue) {
        return _this.mutastate.assure(key, defaultValue);
      });

      _defineProperty(this, "getEverything", function () {
        return _this.mutastate.getEverything();
      });

      _defineProperty(this, "setEverything", function (data) {
        return _this.mutastate.setEverything(data);
      });

      _defineProperty(this, "getAgentData", function () {
        return _this.data;
      });

      _defineProperty(this, "pause", function () {
        return _this.paused = true;
      });

      _defineProperty(this, "resume", function () {
        var executeCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        _this.paused = false;
        if (executeCallback) _this.onChange(_this.data);
      });

      this.mutastate = mutastate;
      this.data = {};
      this.onChange = onChange;
      this.aliasObject = {};
      this.reverseAliasObject = {};
    }

    _createClass(BaseAgent, [{
      key: "cleanup",
      value: function cleanup() {
        return this.unlistenFromAll();
      }
    }]);

    return BaseAgent;
  }();

  var MutastateAgent = /*#__PURE__*/function (_BaseAgent) {
    _inherits(MutastateAgent, _BaseAgent);

    var _super = _createSuper(MutastateAgent);

    function MutastateAgent(mutastate, onChange) {
      var _this;

      _classCallCheck(this, MutastateAgent);

      _this = _super.call(this, mutastate, onChange);
      _this.mutastate = mutastate;
      _this.data = {};
      _this.onChange = onChange;
      return _this;
    }

    return MutastateAgent;
  }(BaseAgent);

  function isBlankKey(key) {
    return key === null || key instanceof Array && key.length === 0;
  }

  function findIndex(array, callback, context) {
    for (var keydex = 0; keydex < array.length; keydex += 1) {
      if (callback(array[keydex])) return keydex;
    }

    return -1;
  } // ** COPIED FROM UNDERSCORE JS **
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.

  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function later() {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function throttled() {
      var now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }
  function getKeyFilledObject(key, value) {
    if (isBlankKey(key)) return value;
    var result = {};
    assurePathExists(result, key);
    set(result, key, value);
    return result;
  }

  function getPromiseFunction() {
    if (typeof global !== 'undefined' && typeof global.Promise !== 'undefined') {
      return global.Promise;
    } else if (typeof window !== 'undefined' && typeof window.Promise !== 'undefined') {
      return window.Promise;
    }

    return bluebird;
  }

  //   console.log('getting', property)
  //   try {
  //     return new Proxy(target[property], handler);
  //   } catch (err) {
  //     return Reflect.get(target, property, receiver);
  //   }
  // }
  // const handleDefineCreator = ({ meta, onChange }) => (target, property, descriptor) => {
  //   onChange({ type: 'define', property, meta });
  //   return Reflect.defineProperty(target, property, descriptor);
  // }
  // const handleDeleteCreator = ({ meta, onChange }) => (target, property) => {
  //   onChange({ type: 'delete', property, meta });
  //   return Reflect.deleteProperty(target, property);
  // }
  // const handleSetCreator = ({ meta, handleDefine, onChange }) => (target, property, value, receiver) => {
  //   const incomingTypeString = getTypeString(value);
  //   if (incomingTypeString === 'object') {
  //     const passMeta = { ...(meta || {}), key: ((meta && meta.key) || []).concat(property) };
  //     console.log('creating proxy thing at', property)
  //     target[property] = wrapChanges(value, onChange, passMeta);
  //   } else {
  //     console.log('not proxying', property)
  //     target[property] = value;
  //   }
  //   handleDefine(target, property, { value });
  //   return true;
  // }
  // function wrapChanges(object, onChange, meta) {
  //   if (!meta) meta = { key: [] };
  //   // const handleGet = handleGetCreator({ meta });
  //   const handleDefine = handleDefineCreator({ meta, onChange });
  //   const handleDelete = handleDeleteCreator({ meta, onChange });
  //   const handleSet = handleSetCreator({ meta, onChange, handleDefine });
  //   const handler = {
  //     // get: handleGet,
  //     defineProperty: handleDefine,
  //     deleteProperty: handleDelete,
  //     set: handleSet,
  //   };
  //   return new Proxy(object, handler);
  // };

  function getHandler(onChange, keyInput) {
    var key = getObjectPath(keyInput);
    var handler = {
      get: function get(target, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(target, property);
        var value = Reflect.get(target, property, receiver);
        if (desc && !desc.writable && !desc.configurable) return value;

        try {
          return new Proxy(target[property], getHandler(onChange, key.concat(property)));
        } catch (err) {
          return value;
        }
      },
      set: function set(target, property, value) {
        if (!(target instanceof Array && property === 'length')) {
          // ignore length changes
          onChange({
            type: 'set',
            key: key.concat(property),
            value: value
          });
        }

        return Reflect.set(target, property, value);
      },
      // defineProperty(target, property, descriptor) {
      // 	onChange({ type: 'define', key: key.concat(property) });
      // 	return Reflect.defineProperty(target, property, descriptor);
      // },
      deleteProperty: function deleteProperty(target, property) {
        onChange({
          type: 'delete',
          key: key.concat(property)
        });
        return Reflect.deleteProperty(target, property);
      }
    };
    return handler;
  }

  var changeWrapper = (function (object, onChange) {
    return new Proxy(object, getHandler(onChange, []));
  });

  var ProxyAgent = /*#__PURE__*/function (_BaseAgent) {
    _inherits(ProxyAgent, _BaseAgent);

    var _super = _createSuper(ProxyAgent);

    function ProxyAgent(mutastate, onChange) {
      var _this;

      _classCallCheck(this, ProxyAgent);

      _this = _super.call(this, mutastate, onChange);

      _defineProperty(_assertThisInitialized(_this), "proxyChange", function (data) {
        if (!_this.ignoreChange) {
          var type = data.type,
              key = data.key,
              value = data.value;

          if (type === 'set') {
            _this.set(_this.resolveKey(key), value);
          } else if (type === 'delete') {
            _this["delete"](_this.resolveKey(key));
          }
        }
      });

      _defineProperty(_assertThisInitialized(_this), "getComposedState", function (initialData, key, value) {
        if (key instanceof Array && key.length === 0 || key === null) return value;
        set(initialData, key, value);
        return initialData;
      });

      _defineProperty(_assertThisInitialized(_this), "setComposedState", function (key, value) {
        var resultData = _this.getComposedState(_this.data, key, value);

        if (resultData !== _this.data) _this.data = changeWrapper(resultData, _this.proxyChange);
      });

      _this.mutastate = mutastate;
      _this.data = changeWrapper({}, _this.proxyChange);
      _this.onChange = onChange;
      return _this;
    } // TODO manage push, pop, shift, unshift, splice, etc


    return ProxyAgent;
  }(BaseAgent);

  /**
   * Core mutastate class, this class stores data and informs listeners of changes
   */

  var Mutastate = /*#__PURE__*/function () {
    function Mutastate() {
      var _this = this;

      _classCallCheck(this, Mutastate);

      _defineProperty(this, "getAgent", function (onChange) {
        return new MutastateAgent(_this, onChange);
      });

      _defineProperty(this, "getProxyAgent", function (onChange) {
        return new ProxyAgent(_this, onChange);
      });

      _defineProperty(this, "getListenersAtPath", function (key) {
        var keyArray = isBlankKey(key) ? ['default'] : getObjectPath(key);
        var currentListenObject = _this.listenerObject;

        for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
          // Go through all keys except the last, which is where out final request will go
          var subKey = keyArray[keydex];
          currentListenObject = assurePathExists(currentListenObject, ['subkeys', subKey], {});
        }

        var finalKey = keyArray[keyArray.length - 1];
        return assurePathExists(currentListenObject, ['subkeys', finalKey, 'listeners'], []);
      });

      _defineProperty(this, "addChangeHook", function (listener) {
        _this.removeChangeHook(listener);

        _this.globalListeners.push(listener);
      });

      _defineProperty(this, "removeChangeHook", function (listener) {
        var removed = 0;

        for (var dex = _this.globalListeners.length - 1; dex >= 0; dex -= 1) {
          if (_this.globalListeners[dex] === listener) {
            _this.globalListeners.splice(dex, 1);

            removed += 1;
          }
        }

        return removed;
      });

      _defineProperty(this, "listen", function (key) {
        var listener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          callback: function callback() {},
          alias: null,
          batch: null,
          transform: null,
          defaultValue: undefined
        };

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
      });

      _defineProperty(this, "unlisten", function (key, callback) {
        var listeners = _this.getListenersAtPath(key);

        var matchedListeners = listeners.reduce(function (results, existingListener, dex) {
          if (existingListener.callback === callback) results.push(dex);
          return results;
        }, []);

        for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
          listeners.splice(matchedListeners[dex], 1);
        }
      });

      _defineProperty(this, "unlistenBatch", function (batch, basePath) {
        var patharray = basePath || [];
        var subkeypath = (basePath || []).concat('subkeys');
        var subKeys = keys(get(_this.listenerObject, subkeypath));

        for (var keydex = 0; keydex < subKeys.length; keydex += 1) {
          _this.unlistenBatch(batch, subkeypath.concat([subKeys[keydex]]));
        }

        var listeners = get(_this.listenerObject, patharray.concat('listeners'));
        var matchedListeners = (listeners || []).reduce(function (results, existingListener, dex) {
          if (existingListener.batch === batch) results.push(dex);
          return results;
        }, []);

        for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
          listeners.splice(matchedListeners[dex], 1);
        }
      });

      _defineProperty(this, "getForListener", function (key, listener) {
        var alias = listener.alias,
            callback = listener.callback,
            transform = listener.transform,
            defaultValue = listener.defaultValue;
        var keyArray = getObjectPath(key);
        var value = null;

        if (has(_this.data, keyArray)) {
          value = get(_this.data, keyArray);
        } else {
          var clonedValue = clone(defaultValue);

          if (defaultValue !== undefined) {
            set(_this.data, keyArray, clonedValue);

            _this.notifyGlobals(keyArray, clonedValue, {
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
      });

      _defineProperty(this, "getAllChildListeners", function (listenerObject) {
        var currentKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var type = arguments.length > 2 ? arguments[2] : undefined;
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
      });

      _defineProperty(this, "getDeleteListeners", function (original, incoming, listenerObject) {
        var currentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var result = [];
        var originalType = getTypeString(original);

        if (originalType === 'object' || originalType === 'array') {
          var incomingType = getTypeString(incoming);

          if (incomingType !== originalType) {
            result = result.concat(_this.getAllChildListeners(listenerObject, currentKey, 'delete')); // Send delete notification to every child of the original key
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
      });

      _defineProperty(this, "notifyGlobals", function (keyArray, value, meta) {
        for (var dex = 0; dex < _this.globalListeners.length; dex += 1) {
          var passData = {
            key: keyArray,
            value: value
          };
          if (meta) passData.meta = meta;

          _this.globalListeners[dex](passData);
        }
      });

      _defineProperty(this, "get", function (key) {
        return get(_this.data, key);
      });

      _defineProperty(this, "set", function (key, value) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$notify = _ref.notify,
            notify = _ref$notify === void 0 ? true : _ref$notify;

        var keyArray = getObjectPath(key);

        var listeners = _this.getRelevantListeners(keyArray, value); // Consider a pre-notify here


        set(_this.data, key, value);
        if (notify) _this.notify(listeners, keyArray, value);
      });

      _defineProperty(this, "delete", function (key) {
        _this.set(key, undefined);

        assassinate(_this.data, key);
      });

      _defineProperty(this, "assign", function (key, value) {
        var original = get(_this.data, key);
        var originalType = getTypeString(original);
        var incomingType = getTypeString(value);

        if (originalType === 'object' && incomingType === 'object') {
          _this.set(key, Object.assign({}, original, value));
        } else {
          _this.set(key, value);
        }
      });

      _defineProperty(this, "push", function (key, value) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref2$notify = _ref2.notify,
            notify = _ref2$notify === void 0 ? true : _ref2$notify;

        var keyArray = getObjectPath(key);
        var original = get(_this.data, keyArray);
        var originalType = getTypeString(original);

        if (originalType === 'array') {
          var extendedKey = keyArray.concat(original.length);

          var listeners = _this.getRelevantListeners(extendedKey, value); // Consider a pre-notify here


          original.push(value);
          if (notify) _this.notify(listeners, extendedKey, value);
          return true;
        } else if (originalType === 'undefined' || originalType === 'null') {
          _this.set(keyArray, [value]);

          return true;
        }

        return false;
      });

      _defineProperty(this, "pop", function (key) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$notify = _ref3.notify,
            notify = _ref3$notify === void 0 ? true : _ref3$notify;

        var keyArray = getObjectPath(key);
        var original = get(_this.data, keyArray);
        var originalType = getTypeString(original);

        if (originalType === 'array' && original.length > 0) {
          var extendedKey = keyArray.concat(original.length - 1);

          var listeners = _this.getRelevantListeners(extendedKey, undefined); // Consider a pre-notify here


          original.pop();
          if (notify) _this.notify(listeners, extendedKey);
          return true;
        }

        return false;
      });

      _defineProperty(this, "has", function (key) {
        return has(_this.data, key);
      });

      _defineProperty(this, "assure", function (key, defaultValue) {
        if (!_this.has(key)) _this.set(key, defaultValue);
        return _this.get(key);
      });

      _defineProperty(this, "getEverything", function () {
        return _this.data;
      });

      _defineProperty(this, "setEverything", function (data) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$noDefaults = _ref4.noDefaults,
            noDefaults = _ref4$noDefaults === void 0 ? false : _ref4$noDefaults;

        var defaultedData = noDefaults ? data : Object.assign(_this.getDefaults(), data || {});

        var listeners = _this.getRelevantListeners([], defaultedData);

        _this.data = defaultedData;

        _this.notify(listeners, [], defaultedData);
      });

      _defineProperty(this, "getDefaults", function () {
        if (!_this.listenerObject) return {};
        var result = {};

        var listeners = _this.getAllChildListeners(_this.listenerObject, []);

        listeners.forEach(function (listener) {
          if (has(listener, 'defaultValue') && listener.defaultValue !== undefined) {
            set(result, listener.key, listener.defaultValue);
          }
        });
        return result;
      });

      _defineProperty(this, "translate", function (inputKey, outputKey, translationFunction) {
        var _ref5 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            batch = _ref5.batch,
            _ref5$throttleTime = _ref5.throttleTime,
            throttleTime = _ref5$throttleTime === void 0 ? null : _ref5$throttleTime;

        var callback = function callback(input) {
          if (input.length > 0) {
            var output = translationFunction(input[input.length - 1].value, get(_this.data, inputKey));

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

        _this.listen(inputKey, {
          initialLoad: true,
          batch: batch,
          callback: shouldThrottle ? throttle(callback, throttleTime) : callback
        });
      });

      _defineProperty(this, "replicate", function (_ref6) {
        var send = _ref6.send,
            primary = _ref6.primary,
            ignore = _ref6.ignore,
            sendInitial = _ref6.sendInitial,
            _ref6$canSetEverythin = _ref6.canSetEverything,
            canSetEverything = _ref6$canSetEverythin === void 0 ? true : _ref6$canSetEverythin;
        var ignoreObject = {};

        if (ignore) {
          var _iterator = _createForOfIteratorHelper(ignore),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var key = _step.value;
              set(ignoreObject, key, true);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        var replicator = {
          send: send,
          primary: primary,
          ignore: ignore,
          id: ++_this.nextReplicatorId,
          ignores: {},
          ignoreEverything: false
        };

        _this.replicators.push(replicator);

        var changeHook = function changeHook(data) {
          if (get(replicator.ignores, data.key) === true) return false;
          if (get(ignoreObject, data.key[0]) === true) return false;
          if (replicator.ignoreEverything) return false;
          replicator.send(data);
          return true;
        };

        replicator.changeHook = changeHook;

        _this.addChangeHook(changeHook);

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

        if (sendInitial) {
          changeHook({
            key: [],
            value: _this.getEverything()
          });
        }

        return receiver;
      });

      _defineProperty(this, "stopReplicating", function (receiverFunction) {
        var replicator = _this.replicators.find(function (replicator) {
          return replicator.receiver === receiverFunction;
        });

        if (replicator) {
          _this.removeChangeHook(replicator.changeHook);

          _this.replicators = _this.replicators.filter(function (replicator) {
            return replicator.id !== replicator.id;
          });
        }
      });

      _defineProperty(this, "stopAllReplication", function () {
        var _iterator2 = _createForOfIteratorHelper(_this.replicators),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var replicator = _step2.value;

            _this.stopReplicating(replicator.receiver);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      });

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
     * An agent is a listener with alias and transform capabilities
     * @param {function} onChange
     */


    _createClass(Mutastate, [{
      key: "getChangeListeners",

      /**
       * @method
       * @description
       * given a change, notify all parents of the relevant key, and for every subkey of the incoming data notify listeners
       * this function does not notify any listers of removed data, getDeleteListeners fulfills that role
       */
      value: function getChangeListeners(change, sublistener) {
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var originalChangeDepth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var currentChangeDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
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
      }
      /**
       * @method
       * @description
       * Listeners are nested by a pattern of subkeys.key.subkeys.otherkey, this function turns ['key', 'otherkey'] into the expected array
       */

    }, {
      key: "getListenerObjectAtKey",
      value: function getListenerObjectAtKey(key) {
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
      }
      /**
       * @method
       * @description
       * Concatenate change and delete listeners for a given change
       */

    }, {
      key: "getRelevantListeners",
      value: function getRelevantListeners(key, value) {
        var keyArray = getObjectPath(key);
        var changeListeners = this.getChangeListeners(getKeyFilledObject(keyArray, value), this.listenerObject, [], keyArray.length);
        var original = get(this.data, keyArray);
        var deleteListeners = this.getDeleteListeners(original, value, this.getListenerObjectAtKey(keyArray), keyArray);
        return changeListeners.concat(deleteListeners);
      }
      /**
       * @method
       * @description
       * Execute notify callbacks for a batch in format [{ listener, key }]
       */

    }, {
      key: "notify",
      value: function notify(notifyBatch, keyArray, value) {
        var _this2 = this;

        var callbackBatches = [];

        var _loop = function _loop(keydex) {
          var keyChange = notifyBatch[keydex];
          var listenerIndex = findIndex(callbackBatches, function (callbackBatch) {
            return callbackBatch.callback === keyChange.listener.callback;
          });

          if (listenerIndex !== -1) {
            callbackBatches[listenerIndex].changes.push(_this2.getForListener(keyChange.key, keyChange.listener));
          } else {
            callbackBatches.push({
              callback: keyChange.listener.callback,
              changes: [_this2.getForListener(keyChange.key, keyChange.listener)]
            });
          }
        };

        for (var keydex = 0; keydex < notifyBatch.length; keydex += 1) {
          _loop(keydex);
        }

        for (var callbatch = 0; callbatch < callbackBatches.length; callbatch += 1) {
          var listenerBatch = callbackBatches[callbatch];
          var callback = listenerBatch.callback,
              changes = listenerBatch.changes;
          callback(changes);
        }

        this.notifyGlobals(keyArray, value);
      }
    }]);

    return Mutastate;
  }();

  function singleton() {
    if (singleton.singleton === undefined) {
      singleton.singleton = new Mutastate();
    }

    return singleton.singleton;
  }

  function withMutastateCreator(React) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$instance = _ref.instance,
        instance = _ref$instance === void 0 ? singleton() : _ref$instance,
        _ref$useProxy = _ref.useProxy,
        useProxy = _ref$useProxy === void 0 ? false : _ref$useProxy,
        _ref$agentName = _ref.agentName,
        agentName = _ref$agentName === void 0 ? 'agent' : _ref$agentName;

    return function withMutastate(WrappedComponent) {
      var _temp;

      var mutastateInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : instance;
      var ToForward = (_temp = /*#__PURE__*/function (_React$Component) {
        _inherits(ToForward, _React$Component);

        var _super = _createSuper(ToForward);

        function ToForward(props) {
          var _this;

          _classCallCheck(this, ToForward);

          _this = _super.call(this, props);

          _defineProperty(_assertThisInitialized(_this), "changeState", function () {
            return _this.setState(_this.state);
          });

          _this.agent = useProxy ? mutastateInstance.getProxyAgent(_this.changeState) : mutastateInstance.getAgent(_this.changeState);
          _this.state = {};
          return _this;
        }

        _createClass(ToForward, [{
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            return this.agent.cleanup();
          }
        }, {
          key: "render",
          value: function render() {
            var _objectSpread2$1;

            var _this$props = this.props,
                forwardedRef = _this$props.forwardedRef,
                rest = _objectWithoutProperties(_this$props, ["forwardedRef"]);

            return React.createElement(WrappedComponent, _objectSpread2((_objectSpread2$1 = {
              data: this.agent.data
            }, _defineProperty(_objectSpread2$1, agentName, this.agent), _defineProperty(_objectSpread2$1, "ref", forwardedRef), _objectSpread2$1), rest), this.props.children);
          }
        }]);

        return ToForward;
      }(React.Component), _temp);
      return React.forwardRef(function (props, ref) {
        return React.createElement(ToForward, _objectSpread2(_objectSpread2({}, props), {}, {
          forwardedRef: ref
        }));
      });
    };
  }
  var React;

  try {
    React = require('react');
  } catch (err) {
    var errorFunc = function errorFunc() {
      throw new Error('REACT IS NOT AVAILABLE, withMutastate IS NOT AVAILABLE WITHOUT REACT');
    };

    React = {
      useState: errorFunc,
      useEffect: errorFunc,
      useRef: errorFunc
    };
  }

  var withMutastate = withMutastateCreator(React);

  var React$1;

  try {
    React$1 = require('react');
  } catch (err) {
    var errorFunc$1 = function errorFunc() {
      throw new Error('REACT IS NOT AVAILABLE, useMutastate IS NOT AVAILABLE WITHOUT REACT');
    };

    React$1 = {
      useState: errorFunc$1,
      useEffect: errorFunc$1,
      useRef: errorFunc$1
    };
  }

  var _React = React$1,
      useState = _React.useState,
      useEffect = _React.useEffect,
      useRef = _React.useRef;
  /**
   *
   * @param {string} key
   * @param {{ defaultValue: any, globalState: Mutastate }} listenerParams
   */

  function useMutastate(key) {
    var listenerParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaultValue = listenerParams.defaultValue,
        _listenerParams$globa = listenerParams.globalState,
        globalState = _listenerParams$globa === void 0 ? singleton() : _listenerParams$globa;
    var startingValue = globalState.has(key) ? globalState.get(key) : defaultValue;

    var _useState = useState(clone$1(startingValue)),
        _useState2 = _slicedToArray(_useState, 2),
        data = _useState2[0],
        setData = _useState2[1];

    var refKey = useRef(key);
    useEffect(function () {
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
    }, [key]);

    var setGlobalData = function setGlobalData(value) {
      globalState.set(key, value);
    };

    return [data, setGlobalData];
  }

  exports.Mutastate = Mutastate;
  exports.default = Mutastate;
  exports.singleton = singleton;
  exports.useMutastate = useMutastate;
  exports.withMutastate = withMutastate;
  exports.withMutastateCreator = withMutastateCreator;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
