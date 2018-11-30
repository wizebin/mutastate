(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bluebird'), require('objer')) :
  typeof define === 'function' && define.amd ? define(['exports', 'bluebird', 'objer'], factory) :
  (factory((global.mutastate = {}),global.bluebird,global.objer));
}(this, (function (exports,bluebird,objer) { 'use strict';

  bluebird = bluebird && bluebird.hasOwnProperty('default') ? bluebird['default'] : bluebird;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
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
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var BaseAgent = function BaseAgent(mutastate, onChange) {
    var _this = this;

    classCallCheck(this, BaseAgent);

    this.getComposedState = function (initialData, key, value) {
      if (key instanceof Array && key.length === 0 || key === null) return value;

      objer.set(initialData, key, value);
      return initialData;
    };

    this.setComposedState = function (key, value) {
      _this.data = _this.getComposedState(_this.data, key, value);
    };

    this.translate = function (inputKey, outputKey, translationFunction) {
      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          _ref$killOnCleanup = _ref.killOnCleanup,
          killOnCleanup = _ref$killOnCleanup === undefined ? true : _ref$killOnCleanup,
          _ref$throttleTime = _ref.throttleTime,
          throttleTime = _ref$throttleTime === undefined ? null : _ref$throttleTime;

      _this.mutastate.translate(inputKey, outputKey, translationFunction, { batch: killOnCleanup ? _this : undefined, throttleTime: throttleTime });
    };

    this.get = function (key) {
      return _this.mutastate.get(key);
    };

    this.set = function (key, value, options) {
      return _this.mutastate.set(key, value, options);
    };

    this.delete = function (key) {
      return _this.mutastate.delete(key);
    };

    this.assign = function (key, value) {
      return _this.mutastate.assign(key, value);
    };

    this.push = function (key, value, options) {
      return _this.mutastate.push(key, value, options);
    };

    this.pop = function (key, options) {
      return _this.mutastate.pop(key, options);
    };

    this.has = function (key) {
      return _this.mutastate.has(key);
    };

    this.getEverything = function () {
      return _this.mutastate.getEverything();
    };

    this.setEverything = function (data) {
      return _this.mutastate.setEverything(data);
    };

    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
  };

  var MutastateAgent = function (_BaseAgent) {
    inherits(MutastateAgent, _BaseAgent);

    function MutastateAgent(mutastate, onChange) {
      classCallCheck(this, MutastateAgent);

      var _this = possibleConstructorReturn(this, (MutastateAgent.__proto__ || Object.getPrototypeOf(MutastateAgent)).call(this, mutastate, onChange));

      _this.unlisten = function (key) {
        var result = _this.mutastate.unlisten(key, _this.handleChange);
        return result;
      };

      _this.unlistenFromAll = function () {
        _this.mutastate.unlistenBatch(_this);
      };

      _this.listen = function (key) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            alias = _ref.alias,
            transform = _ref.transform,
            _ref$initialLoad = _ref.initialLoad,
            initialLoad = _ref$initialLoad === undefined ? true : _ref$initialLoad,
            defaultValue = _ref.defaultValue,
            _ref$partOfMultiListe = _ref.partOfMultiListen,
            partOfMultiListen = _ref$partOfMultiListe === undefined ? false : _ref$partOfMultiListe;

        var modifiedListener = {
          alias: alias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue,
          callback: _this.handleChange,
          batch: _this
        };
        _this.mutastate.listen(key, modifiedListener);

        if (initialLoad) {
          var listenData = _this.mutastate.getForListener(key, modifiedListener);
          _this.setComposedState(alias || key, listenData.value);
          if (!partOfMultiListen && _this.onChange) {
            _this.onChange(_this.data);
          }
        }
      };

      _this.multiListen = function (listeners) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$initialLoad = _ref2.initialLoad,
            initialLoad = _ref2$initialLoad === undefined ? true : _ref2$initialLoad;

        var loaded = false;

        for (var listenerdex = 0; listenerdex < listeners.length; listenerdex += 1) {
          var listener = listeners[listenerdex];
          var hasKey = objer.get(listener, 'key');
          var key = hasKey ? listener.key : listener;
          var alias = hasKey ? listener.alias : null;
          var options = (hasKey ? listener.options : {}) || {};
          _this.listen(key, _extends({}, options, { partOfMultiListen: true }));
          if (initialLoad) {
            loaded = true;
            var listenData = _this.mutastate.getForListener(key, listener);
            _this.setComposedState(alias || key, listenData.value);
          }
        }

        if (loaded && _this.onChange) {
          _this.onChange(_this.data);
        }
      };

      _this.handleChange = function (changeEvents) {
        for (var changedex = 0; changedex < changeEvents.length; changedex += 1) {
          var changeEvent = changeEvents[changedex];
          var alias = changeEvent.alias,
              key = changeEvent.key,
              value = changeEvent.value;

          _this.setComposedState(alias || key, value);
        }

        if (_this.onChange) {
          _this.onChange(_this.data);
        }
      };

      _this.mutastate = mutastate;
      _this.data = {};
      _this.onChange = onChange;
      return _this;
    }

    createClass(MutastateAgent, [{
      key: 'cleanup',
      value: function cleanup() {
        return this.unlistenFromAll();
      }
    }]);
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
  }

  // ** COPIED FROM UNDERSCORE JS **
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
    objer.assurePathExists(result, key);
    objer.set(result, key, value);
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

  // const handleGetCreator = () => (target, property, receiver) => {
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
  	var key = objer.getObjectPath(keyInput);
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
  				onChange({ type: 'set', key: key.concat(property), value: value });
  			}

  			return Reflect.set(target, property, value);
  		},

  		// defineProperty(target, property, descriptor) {
  		// 	onChange({ type: 'define', key: key.concat(property) });
  		// 	return Reflect.defineProperty(target, property, descriptor);
  		// },
  		deleteProperty: function deleteProperty(target, property) {
  			onChange({ type: 'delete', key: key.concat(property) });
  			return Reflect.deleteProperty(target, property);
  		}
  	};
  	return handler;
  }

  var changeWrapper = (function (object, onChange) {
  	return new Proxy(object, getHandler(onChange, []));
  });

  /**
   * The proxy agent uses the proxy() javascript functionality when it internalizes data it adds a proxy layer above
   * setting which sends change requests (=, push, splice, etc) to mutastate directly and subsequent changes are brought in
   * this allows us to listen to a deeply nested key and change the resulting data easily
   */

  var ProxyAgent = function (_BaseAgent) {
    inherits(ProxyAgent, _BaseAgent);

    function ProxyAgent(mutastate, onChange) {
      classCallCheck(this, ProxyAgent);

      var _this = possibleConstructorReturn(this, (ProxyAgent.__proto__ || Object.getPrototypeOf(ProxyAgent)).call(this, mutastate, onChange));

      _this.proxyChange = function (data) {
        if (!_this.ignoreChange) {
          var type = data.type,
              key = data.key,
              value = data.value;

          var firstKey = key instanceof Array ? key[0] : key;
          var passKey = objer.has(_this.aliasObject, firstKey) ? [].concat(objer.get(_this.aliasObject, firstKey)).concat(key.slice(1)) : key;
          if (type === 'set') {
            _this.mutastate.set(passKey, value);
          } else if (type === 'delete') {
            _this.mutastate.delete(passKey);
          }
        }
      };

      _this.unlisten = function (key) {
        var result = _this.mutastate.unlisten(key, _this.handleChange);
        var alias = objer.get(_this.reverseAliasObject, key);
        if (alias) {
          objer.assassinate(_this.reverseAliasObject, key);
          objer.assassinate(_this.aliasObject, alias);
        }
        return result;
      };

      _this.unlistenFromAll = function () {
        _this.mutastate.unlistenBatch(_this);
        _this.aliasObject = {};
        _this.reverseAliasObject = {};
      };

      _this.getComposedState = function (initialData, key, value) {
        if (key instanceof Array && key.length === 0 || key === null) return value;

        objer.set(initialData, key, value);
        return initialData;
      };

      _this.setComposedState = function (key, value) {
        var resultData = _this.getComposedState(_this.data, key, value);
        if (resultData !== _this.data) _this.data = changeWrapper(resultData, _this.proxyChange);
      };

      _this.listen = function (key) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            alias = _ref.alias,
            transform = _ref.transform,
            _ref$initialLoad = _ref.initialLoad,
            initialLoad = _ref$initialLoad === undefined ? true : _ref$initialLoad,
            defaultValue = _ref.defaultValue,
            _ref$partOfMultiListe = _ref.partOfMultiListen,
            partOfMultiListen = _ref$partOfMultiListe === undefined ? false : _ref$partOfMultiListe;

        var modifiedListener = {
          alias: alias,
          transform: transform,
          initialLoad: initialLoad,
          defaultValue: defaultValue,
          callback: _this.handleChange,
          batch: _this
        };
        _this.mutastate.listen(key, modifiedListener);

        if (alias) {
          objer.set(_this.aliasObject, alias, key);
          objer.set(_this.reverseAliasObject, key, alias);
        }
        if (initialLoad) {
          _this.ignoreChange = true;
          var listenData = _this.mutastate.getForListener(key, modifiedListener);
          _this.setComposedState(alias || key, listenData.value);
          if (!partOfMultiListen && _this.onChange) {
            _this.onChange(_this.data);
          }
          _this.ignoreChange = false;
        }
      };

      _this.multiListen = function (listeners) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$initialLoad = _ref2.initialLoad,
            initialLoad = _ref2$initialLoad === undefined ? true : _ref2$initialLoad;

        var loaded = false;

        for (var listenerdex = 0; listenerdex < listeners.length; listenerdex += 1) {
          var listener = listeners[listenerdex];
          var hasKey = objer.get(listener, 'key');
          var key = hasKey ? listener.key : listener;
          var alias = hasKey ? listener.alias : null;
          var options = (hasKey ? listener.options : {}) || {};
          _this.listen(key, _extends({}, options, { partOfMultiListen: true }));
          if (initialLoad) {
            _this.ignoreChange = true;
            loaded = true;
            var listenData = _this.mutastate.getForListener(key, listener);
            _this.setComposedState(alias || key, listenData.value);
            _this.ignoreChange = false;
          }
        }

        if (loaded && _this.onChange) {
          _this.onChange(_this.data);
        }
      };

      _this.handleChange = function (changeEvents) {
        _this.ignoreChange = true;
        for (var changedex = 0; changedex < changeEvents.length; changedex += 1) {
          var changeEvent = changeEvents[changedex];
          var alias = changeEvent.alias,
              key = changeEvent.key,
              value = changeEvent.value;

          _this.setComposedState(alias || key, value);
        }

        if (_this.onChange) {
          _this.onChange(_this.data);
        }
        _this.ignoreChange = false;
      };

      _this.mutastate = mutastate;
      _this.data = changeWrapper({}, _this.proxyChange);
      _this.onChange = onChange;
      _this.aliasObject = {};
      _this.reverseAliasObject = {};
      return _this;
    }

    // TODO manage push, pop, shift, unshift, splice, etc


    createClass(ProxyAgent, [{
      key: 'cleanup',
      value: function cleanup() {
        return this.unlistenFromAll();
      }
    }]);
    return ProxyAgent;
  }(BaseAgent);

  /**
   * Core mutastate class, this class stores data and informes listeners of changes
   */

  var Mutastate = function () {
    function Mutastate() {
      var _this = this;

      classCallCheck(this, Mutastate);

      this.getAgent = function (onChange) {
        return new MutastateAgent(_this, onChange);
      };

      this.getProxyAgent = function (onChange) {
        return new ProxyAgent(_this, onChange);
      };

      this.getListenersAtPath = function (key) {
        var keyArray = isBlankKey(key) ? ['default'] : objer.getObjectPath(key);

        var currentListenObject = _this.listenerObject;
        for (var keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
          // Go through all keys except the last, which is where out final request will go
          var subKey = keyArray[keydex];
          currentListenObject = objer.assurePathExists(currentListenObject, ['subkeys', subKey], {});
        }
        var finalKey = keyArray[keyArray.length - 1];
        return objer.assurePathExists(currentListenObject, ['subkeys', finalKey, 'listeners'], []);
      };

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

      this.listen = function (key) {
        var listener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { callback: function callback() {}, alias: null, batch: null, transform: null, defaultValue: undefined };

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

      this.unlistenBatch = function (batch, basePath) {
        var patharray = basePath || [];
        var subkeypath = (basePath || []).concat('subkeys');
        var subKeys = objer.keys(objer.get(_this.listenerObject, subkeypath));
        for (var keydex = 0; keydex < subKeys.length; keydex += 1) {
          _this.unlistenBatch(batch, subkeypath.concat([subKeys[keydex]]));
        }

        var listeners = objer.get(_this.listenerObject, patharray.concat('listeners'));

        var matchedListeners = (listeners || []).reduce(function (results, existingListener, dex) {
          if (existingListener.batch === batch) results.push(dex);
          return results;
        }, []);

        for (var dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
          listeners.splice(matchedListeners[dex], 1);
        }
      };

      this.getForListener = function (key, listener, keyChange) {
        var alias = listener.alias,
            callback = listener.callback,
            transform = listener.transform,
            defaultValue = listener.defaultValue;

        var keyArray = objer.getObjectPath(key);
        var value = null;

        if (objer.has(_this.data, keyArray)) {
          value = objer.get(_this.data, keyArray);
        } else {
          if (defaultValue !== undefined) {
            var _clonedValue = objer.clone(defaultValue);
            objer.set(_this.data, keyArray, _clonedValue);
            _this.notifyGlobals(keyArray, _clonedValue, { defaultValue: true });
          }
          value = clonedValue;
        }

        return { keyChange: keyChange, alias: alias, callback: callback, key: keyArray, value: transform ? transform(value) : value };
      };

      this.getAllChildListeners = function (listenerObject) {
        var currentKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var type = arguments[2];

        var result = [];
        var currentListeners = objer.get(listenerObject, 'listeners') || [];
        var subkeyObject = objer.get(listenerObject, 'subkeys') || {};
        var subkeys = objer.keys(subkeyObject);
        for (var listenerdex = 0; listenerdex < currentListeners.length; listenerdex += 1) {
          result.push({ listener: currentListeners[listenerdex], key: currentKey, type: type });
        }
        for (var keydex = 0; keydex < subkeys.length; keydex += 1) {
          var subkey = subkeys[keydex];
          result = result.concat(_this.getAllChildListeners(subkeyObject[subkey], currentKey.concat(subkey), type));
        }
        return result;
      };

      this.getDeleteListeners = function (original, incoming, listenerObject) {
        var currentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var result = [];
        var originalType = objer.getTypeString(original);
        if (originalType === 'object' || originalType === 'array') {
          var incomingType = objer.getTypeString(incoming);
          if (incomingType !== originalType) {
            result = result.concat(_this.getAllChildListeners(listenerObject, currentKey, 'delete'));
            // Send delete notification to every child of the original key
          } else {
            var originalKeys = objer.keys(original);
            if (objer.has(listenerObject, 'subkeys')) {
              for (var keydex = 0; keydex < originalKeys.length; keydex += 1) {
                var originalKey = originalKeys[keydex];
                if (objer.has(listenerObject.subkeys, originalKey)) {
                  if (!objer.has(incoming, originalKey)) {
                    result = result.concat(_this.getAllChildListeners(listenerObject.subkeys[originalKey], currentKey.concat(originalKey), 'delete'));
                  } else {
                    result = result.concat(_this.getDeleteListeners(objer.get(original, originalKey), objer.get(incoming, originalKey), listenerObject.subkeys[originalKey], currentKey.concat(originalKey)));
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
          var passData = { key: keyArray, value: value };
          if (meta) passData.meta = meta;
          _this.globalListeners[dex](passData);
        }
      };

      this.get = function (key) {
        return objer.get(_this.data, key);
      };

      this.set = function (key, value) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$notify = _ref.notify,
            notify = _ref$notify === undefined ? true : _ref$notify,
            _ref$immediate = _ref.immediate,
            _ref$save = _ref.save;

        var keyArray = objer.getObjectPath(key);
        var listeners = _this.getRelevantListeners(keyArray, value);
        // Consider a pre-notify here
        objer.set(_this.data, key, value);
        if (notify) _this.notify(listeners, keyArray, value);
      };

      this.delete = function (key) {
        _this.set(key, undefined);
        objer.assassinate(_this.data, key);
      };

      this.assign = function (key, value) {
        var original = objer.get(_this.data, key);
        var originalType = objer.getTypeString(original);
        var incomingType = objer.getTypeString(value);

        if (originalType === 'object' && incomingType === 'object') {
          _this.set(key, Object.assign({}, original, value));
        } else {
          _this.set(key, value);
        }
      };

      this.push = function (key, value) {
        var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref2$notify = _ref2.notify,
            notify = _ref2$notify === undefined ? true : _ref2$notify,
            _ref2$immediate = _ref2.immediate,
            _ref2$save = _ref2.save;

        var keyArray = objer.getObjectPath(key);
        var original = objer.get(_this.data, keyArray);
        var originalType = objer.getTypeString(original);
        if (originalType === 'array') {
          var extendedKey = keyArray.concat(original.length);
          var listeners = _this.getRelevantListeners(extendedKey, value);
          // Consider a pre-notify here
          original.push(value);
          if (notify) _this.notify(listeners);
        }
      };

      this.pop = function (key) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$notify = _ref3.notify,
            notify = _ref3$notify === undefined ? true : _ref3$notify,
            _ref3$immediate = _ref3.immediate,
            _ref3$save = _ref3.save;

        var keyArray = objer.getObjectPath(key);
        var original = objer.get(_this.data, keyArray);
        var originalType = objer.getTypeString(original);
        if (originalType === 'array' && original.length > 0) {
          var extendedKey = keyArray.concat(original.length - 1);
          var listeners = _this.getRelevantListeners(extendedKey, undefined);
          // Consider a pre-notify here
          original.pop();
          if (notify) _this.notify(listeners);
        }
      };

      this.has = function (key) {
        return objer.has(_this.data, key);
      };

      this.getEverything = function () {
        return _this.data;
      };

      this.setEverything = function (data) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$noDefaults = _ref4.noDefaults,
            noDefaults = _ref4$noDefaults === undefined ? false : _ref4$noDefaults;

        var defaultedData = noDefaults ? data : Object.assign(_this.getDefaults(), data || {});
        var listeners = _this.getRelevantListeners([], defaultedData);
        _this.data = defaultedData;
        _this.notify(listeners, [], defaultedData);
      };

      this.getDefaults = function () {

        if (!_this.listenerObject) return {};
        var result = {};
        var listeners = _this.getAllChildListeners(_this.listenerObject, []);
        listeners.forEach(function (listener) {
          if (objer.has(listener, 'defaultValue') && listener.defaultValue !== undefined) {
            objer.set(result, listener.key, objer.clone(listener.defaultValue));
          }
        });
        return result;
      };

      this.translate = function (inputKey, outputKey, translationFunction) {
        var _ref5 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            batch = _ref5.batch,
            _ref5$throttleTime = _ref5.throttleTime,
            throttleTime = _ref5$throttleTime === undefined ? null : _ref5$throttleTime;

        var callback = function callback(input) {
          if (input.length > 0) {
            var output = translationFunction(input[input.length - 1].value, objer.get(_this.data, inputKey));
            if (output instanceof Promise) {
              output.then(function (result) {
                return _this.set(outputKey, result);
              });
            } else {
              _this.set(outputKey, output);
            }
          }
        };
        var shouldThrottle = objer.getTypeString(throttleTime) === 'number' && throttleTime > 0;
        _this.listen(inputKey, { initialLoad: true, batch: batch, callback: shouldThrottle ? throttle(callback, throttleTime) : callback });
      };

      this.listenerObject = { subkeys: {} };
      this.globalListeners = [];
      this.data = {};
      this.promise = getPromiseFunction();
    }

    /**
     * An agent is a listener with alias and transform capabilities
     * @param {function} onChange
     */


    /**
     * Retrieve a list of relevant listeners given a change at a key;
     */


    /**
     * Add a path listener, dedupes by callback function, careful with anonymous functions!
     */


    /**
     * Unlisten by callback, careful with anonymous functions!
     */


    /**
     * Unlisten by the batch parameter passed into the options of the listen function
     */


    /**
     * Get data for a particular listener, apply transformation to the value
     */


    /**
     * Get a full list of listeners under a subkey
     */


    /**
     * recurse original against incoming for changed keys, if original type is an object or array and incoming type is not the same
     * pass all child listeners. If incoming and original are both either objects or arrays, recurse the children using this function.
     */


    createClass(Mutastate, [{
      key: 'getChangeListeners',


      /**
       * given a change, notify all parents of the relevant key, and for every subkey of the incoming data notify listeners
       * this function does not notify any listers of removed data, getDeleteListeners fulfills that role
       */
      value: function getChangeListeners(change, sublistener) {
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var originalChangeDepth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var currentChangeDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        var changeRelativity = originalChangeDepth - currentChangeDepth; // Parent change > 0, child change < 0, currentChange == 0
        var result = [];
        if (objer.has(sublistener, 'listeners')) {
          for (var listenerdex = 0; listenerdex < sublistener.listeners.length; listenerdex += 1) {
            var listener = sublistener.listeners[listenerdex];
            if (listener.noChildUpdates === true && changeRelativity > 0) ; // Skip informing parents who don't care
            else if (listener.noParentUpdates === true && changeRelativity < 0) ; // Skip informing children who don't care
              else {
                  result.push({ listener: listener, key: key, type: 'change' });
                }
          }
        }

        var changetype = objer.getTypeString(change);
        if (objer.has(sublistener, 'subkeys') && (changetype === 'array' || changetype === 'object')) {
          var changeKeys = objer.keys(change);
          for (var keydex = 0; keydex < changeKeys.length; keydex += 1) {
            var changeKey = changeKeys[keydex];
            if (objer.has(sublistener.subkeys, changeKey)) {
              result = result.concat(this.getChangeListeners(change[changeKey], sublistener.subkeys[changeKey], key.concat(changeKey), originalChangeDepth, currentChangeDepth + 1));
            }
          }
        }

        return result;
      }

      /**
       * Listeners are nested by a pattern of subkeys.key.subkeys.otherkey, this function turns ['key', 'otherkey'] into the expected array
       */

    }, {
      key: 'getListenerObjectAtKey',
      value: function getListenerObjectAtKey(key) {
        var result = this.listenerObject;
        if (key.length === 0) return result;
        for (var keydex = 0; keydex < key.length; keydex += 1) {
          if (objer.has(result, ['subkeys', key[keydex]])) {
            result = result.subkeys[key[keydex]];
          } else {
            return null;
          }
        }
        return result;
      }

      /**
       * Concatenate change and delete listeners for a given change
       */

    }, {
      key: 'getRelevantListeners',
      value: function getRelevantListeners(key, value) {
        var keyArray = objer.getObjectPath(key);
        var changeListeners = this.getChangeListeners(getKeyFilledObject(keyArray, value), this.listenerObject, [], keyArray.length);
        var original = objer.get(this.data, keyArray);
        var deleteListeners = this.getDeleteListeners(original, value, this.getListenerObjectAtKey(keyArray), keyArray);

        return changeListeners.concat(deleteListeners);
      }

      /**
       * Execute notify callbacks for a batch in format [{ listener, key }]
       */

    }, {
      key: 'notify',
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
            callbackBatches.push({ callback: keyChange.listener.callback, changes: [_this2.getForListener(keyChange.key, keyChange.listener)] });
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

      // Complication: must notify all array keys of updates due to key changes
      // unshift = (key, value) => {
      //   const keyArray = getObjectPath(key);
      //   const original = get(this.data, keyArray);
      //   const originalType = getTypeString(original);
      //   if (originalType === 'array') {
      //     const extendedKey = keyArray.concat(0);
      //     const listeners = this.getRelevantListeners(extendedKey, value);
      //     // Consider a pre-notify here
      //     original.unshift(value);
      //     if (notify) this.notify(listeners);
      //   }
      // }

      // shift = (key) => {
      //   const keyArray = getObjectPath(key);
      //   const original = get(this.data, keyArray);
      //   const originalType = getTypeString(original);
      //   if (originalType === 'array' && original.length > 0) {
      //     const extendedKey = keyArray.concat(0);
      //     const listeners = this.getRelevantListeners(extendedKey, undefined);
      //     // Consider a pre-notify here
      //     original.shift();
      //     if (notify) this.notify(listeners);
      //   }
      // }

      // TODO: deduplicate translations!!

    }]);
    return Mutastate;
  }();

  function withMutastateCreator$$1(React) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$instance = _ref.instance,
        instance = _ref$instance === undefined ? singleton() : _ref$instance,
        _ref$useProxy = _ref.useProxy,
        useProxy = _ref$useProxy === undefined ? false : _ref$useProxy,
        _ref$agentName = _ref.agentName,
        agentName = _ref$agentName === undefined ? 'agent' : _ref$agentName;

    return function withMutastate(WrappedComponent) {
      var mutastateInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : instance;

      return function (_React$Component) {
        inherits(_class2, _React$Component);

        function _class2(props) {
          classCallCheck(this, _class2);

          var _this = possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

          _this.changeState = function () {
            return _this.setState(_this.state);
          };

          _this.agent = useProxy ? mutastateInstance.getProxyAgent(_this.changeState) : mutastateInstance.getAgent(_this.changeState);
          _this.state = {};
          return _this;
        }

        createClass(_class2, [{
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            return this.agent.cleanup();
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(WrappedComponent, _extends(defineProperty({ data: this.agent.data }, agentName, this.agent), this.props), null);
          }
        }]);
        return _class2;
      }(React.Component);
    };
  }

  function singleton() {
    if (singleton.singleton === undefined) {
      singleton.singleton = new Mutastate();
    }
    return singleton.singleton;
  }

  exports.Mutastate = Mutastate;
  exports.singleton = singleton;
  exports.withMutastateCreator = withMutastateCreator$$1;
  exports.default = Mutastate;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
