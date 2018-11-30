import MutastateAgent from './MutastateAgent';
import { throttle, getKeyFilledObject, findIndex } from './MutastateHelpers';
import { assurePathExists, getObjectPath, has, get, getTypeString, keys, set, assassinate } from 'objer';
import { isBlankKey } from './utility/blankKey';
import getPromiseFunction from './utility/promise';
import ProxyAgent from './ProxyAgent';

/**
 * Core mutastate class, this class stores data and informes listeners of changes
 */
export default class Mutastate {
  constructor() {
    this.listenerObject = { subkeys: {} };
    this.globalListeners = [];
    this.data = {};
    this.promise = getPromiseFunction();
  }

  /**
   * An agent is a listener with alias and transform capabilities
   * @param {function} onChange
   */
  getAgent = (onChange) => {
    return new MutastateAgent(this, onChange);
  }

  getProxyAgent = (onChange) => {
    return new ProxyAgent(this, onChange);
  }

  /**
   * Retrieve a list of relevant listeners given a change at a key;
   */
  getListenersAtPath = (key) => {
    const keyArray = isBlankKey(key) ? ['default'] : getObjectPath(key);

    let currentListenObject = this.listenerObject;
    for (let keydex = 0; keydex < keyArray.length - 1; keydex += 1) { // Go through all keys except the last, which is where out final request will go
      const subKey = keyArray[keydex];
      currentListenObject = assurePathExists(currentListenObject, ['subkeys', subKey], {});
    }
    const finalKey = keyArray[keyArray.length - 1];
    return assurePathExists(currentListenObject, ['subkeys', finalKey, 'listeners'], []);
  }

  addChangeHook = (listener) => {
    this.removeChangeHook(listener);
    this.globalListeners.push(listener);
  }

  removeChangeHook = (listener) => {
    let removed = 0;
    for (let dex = this.globalListeners.length - 1; dex >= 0; dex -= 1) {
      if (this.globalListeners[dex] === listener) {
        this.globalListeners.splice(dex, 1);
        removed += 1;
      }
    }
    return removed;
  }

  /**
   * Add a path listener, dedupes by callback function, careful with anonymous functions!
   */
  listen = (key, listener = { callback: () => {}, alias: null, batch: null, transform: null, defaultValue: undefined }) => {
    const listeners = this.getListenersAtPath(key);
    const matchedListeners = listeners.reduce((results, existingListener, dex) => {
      if (existingListener.callback === listener.callback) results.push(dex);
      return results;
    }, []);

    for (let dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
      listeners.splice(matchedListeners[dex], 1);
    }

    listeners.push(listener);
    return true;
  }

  /**
   * Unlisten by callback, careful with anonymous functions!
   */
  unlisten = (key, callback) => {
    const listeners = this.getListenersAtPath(key);

    const matchedListeners = listeners.reduce((results, existingListener, dex) => {
      if (existingListener.callback === callback) results.push(dex);
      return results;
    }, []);

    for (let dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
      listeners.splice(matchedListeners[dex], 1);
    }
  }

  /**
   * Unlisten by the batch parameter passed into the options of the listen function
   */
  unlistenBatch = (batch, basePath) => {
    const patharray = (basePath || []);
    const subkeypath = (basePath || []).concat('subkeys');
    const subKeys = keys(get(this.listenerObject, subkeypath));
    for (let keydex = 0; keydex < subKeys.length; keydex += 1) {
      this.unlistenBatch(batch, subkeypath.concat([subKeys[keydex]]));
    }

    const listeners = get(this.listenerObject, patharray.concat('listeners'));

    const matchedListeners = (listeners || []).reduce((results, existingListener, dex) => {
      if (existingListener.batch === batch) results.push(dex);
      return results;
    }, []);

    for (let dex = matchedListeners.length - 1; dex >= 0; dex -= 1) {
      listeners.splice(matchedListeners[dex], 1);
    }
  }

  /**
   * Get data for a particular listener, apply transformation to the value
   */
  getForListener = (key, listener, keyChange) => {
    const { alias, callback, transform, defaultValue } = listener;
    const keyArray = getObjectPath(key);
    let value = null;

    if (has(this.data, keyArray)) {
      value = get(this.data, keyArray);
    } else {
      if (defaultValue !== undefined) {
        set(this.data, keyArray, defaultValue);
        this.notifyGlobals(keyArray, defaultValue, { defaultValue: true });
      }
      value = defaultValue;
    }

    return { keyChange, alias, callback, key: keyArray, value: transform ? transform(value) : value };
  }

  /**
   * Get a full list of listeners under a subkey
   */
  getAllChildListeners = (listenerObject, currentKey = [], type) => {
    let result = [];
    const currentListeners = get(listenerObject, 'listeners') || [];
    const subkeyObject = get(listenerObject, 'subkeys') || {};
    const subkeys = keys(subkeyObject);
    for (let listenerdex = 0; listenerdex < currentListeners.length; listenerdex += 1) {
      result.push({ listener: currentListeners[listenerdex], key: currentKey, type })
    }
    for (let keydex = 0; keydex < subkeys.length; keydex += 1) {
      const subkey = subkeys[keydex];
      result = result.concat(this.getAllChildListeners(subkeyObject[subkey], currentKey.concat(subkey), type));
    }
    return result;
  }

  /**
   * recurse original against incoming for changed keys, if original type is an object or array and incoming type is not the same
   * pass all child listeners. If incoming and original are both either objects or arrays, recurse the children using this function.
   */
  getDeleteListeners = (original, incoming, listenerObject, currentKey = []) => {
    let result = [];
    const originalType = getTypeString(original);
    if (originalType === 'object' || originalType === 'array') {
      const incomingType = getTypeString(incoming);
      if (incomingType !== originalType) {
        result = result.concat(this.getAllChildListeners(listenerObject, currentKey, 'delete'));
        // Send delete notification to every child of the original key
      } else {
        const originalKeys = keys(original);
        if (has(listenerObject, 'subkeys')) {
          for (let keydex = 0; keydex < originalKeys.length; keydex += 1) {
            const originalKey = originalKeys[keydex];
            if (has(listenerObject.subkeys, originalKey)) {
              if (!has(incoming, originalKey)) {
                result = result.concat(this.getAllChildListeners(listenerObject.subkeys[originalKey], currentKey.concat(originalKey), 'delete'));
              } else {
                result = result.concat(this.getDeleteListeners(get(original, originalKey), get(incoming, originalKey), listenerObject.subkeys[originalKey], currentKey.concat(originalKey)));
              }
            }
          }
        }
      }
    }
    return result;
  }

  /**
   * given a change, notify all parents of the relevant key, and for every subkey of the incoming data notify listeners
   * this function does not notify any listers of removed data, getDeleteListeners fulfills that role
   */
  getChangeListeners(change, sublistener, key = [], originalChangeDepth = 0, currentChangeDepth = 0) {
    const changeRelativity = originalChangeDepth - currentChangeDepth; // Parent change > 0, child change < 0, currentChange == 0
    let result = [];
    if (has(sublistener, 'listeners')) {
      for (let listenerdex = 0; listenerdex < sublistener.listeners.length; listenerdex += 1) {
        const listener = sublistener.listeners[listenerdex];
        if (listener.noChildUpdates === true && changeRelativity > 0) {} // Skip informing parents who don't care
        else if (listener.noParentUpdates === true && changeRelativity < 0) {} // Skip informing children who don't care
        else {
          result.push({ listener, key, type: 'change' });
        }
      }
    }

    const changetype = getTypeString(change);
    if (has(sublistener, 'subkeys') && (changetype === 'array' || changetype === 'object')) {
      const changeKeys = keys(change);
      for (let keydex = 0; keydex < changeKeys.length; keydex += 1) {
        const changeKey = changeKeys[keydex];
        if (has(sublistener.subkeys, changeKey)) {
          result = result.concat(this.getChangeListeners(change[changeKey], sublistener.subkeys[changeKey], key.concat(changeKey), originalChangeDepth, currentChangeDepth + 1));
        }
      }
    }

    return result;
  }

  /**
   * Listeners are nested by a pattern of subkeys.key.subkeys.otherkey, this function turns ['key', 'otherkey'] into the expected array
   */
  getListenerObjectAtKey(key) {
    let result = this.listenerObject;
    if (key.length === 0) return result;
    for (let keydex = 0; keydex < key.length; keydex += 1) {
      if (has(result, ['subkeys', key[keydex]])) {
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
  getRelevantListeners(key, value) {
    const keyArray = getObjectPath(key);
    const changeListeners = this.getChangeListeners(getKeyFilledObject(keyArray, value), this.listenerObject, [], keyArray.length);
    const original = get(this.data, keyArray);
    const deleteListeners = this.getDeleteListeners(original, value, this.getListenerObjectAtKey(keyArray), keyArray);

    return changeListeners.concat(deleteListeners);
  }

  /**
   * Execute notify callbacks for a batch in format [{ listener, key }]
   */
  notify(notifyBatch, keyArray, value) {
    const callbackBatches = [];
    for (let keydex = 0; keydex < notifyBatch.length; keydex += 1) {
      const keyChange = notifyBatch[keydex];
      const listenerIndex = findIndex(callbackBatches, callbackBatch => callbackBatch.callback === keyChange.listener.callback);

      if (listenerIndex !== -1) {
        callbackBatches[listenerIndex].changes.push(this.getForListener(keyChange.key, keyChange.listener));
      } else {
        callbackBatches.push({ callback: keyChange.listener.callback, changes: [this.getForListener(keyChange.key, keyChange.listener)] });
      }
    }

    for (let callbatch = 0; callbatch < callbackBatches.length; callbatch += 1) {
      const listenerBatch = callbackBatches[callbatch];
      const { callback, changes } = listenerBatch;

      callback(changes);
    }

    this.notifyGlobals(keyArray, value);
  }

  notifyGlobals = (keyArray, value, meta) => {
    for (let dex = 0; dex < this.globalListeners.length; dex += 1) {
      const passData = { key: keyArray, value };
      if (meta) passData.meta = meta;
      this.globalListeners[dex](passData);
    }
  }

  get = (key) => {
    return get(this.data, key);
  }

  set = (key, value, { notify = true, immediate = false, save = true } = {}) => {
    const keyArray = getObjectPath(key);
    const listeners = this.getRelevantListeners(keyArray, value);
    // Consider a pre-notify here
    set(this.data, key, value);
    if (notify) this.notify(listeners, keyArray, value);
  }

  delete = (key) => {
    this.set(key, undefined);
    assassinate(this.data, key);
  }

  assign = (key, value) => {
    const original = get(this.data, key);
    const originalType = getTypeString(original);
    const incomingType = getTypeString(value);

    if (originalType === 'object' && incomingType === 'object') {
      this.set(key, Object.assign({}, original, value));
    } else {
      this.set(key, value);
    }
  }

  push = (key, value, { notify = true, immediate = false, save = true } = {}) => {
    const keyArray = getObjectPath(key);
    const original = get(this.data, keyArray);
    const originalType = getTypeString(original);
    if (originalType === 'array') {
      const extendedKey = keyArray.concat(original.length);
      const listeners = this.getRelevantListeners(extendedKey, value);
      // Consider a pre-notify here
      original.push(value);
      if (notify) this.notify(listeners);
    }
  }

  pop = (key, { notify = true, immediate = false, save = true } = {}) => {
    const keyArray = getObjectPath(key);
    const original = get(this.data, keyArray);
    const originalType = getTypeString(original);
    if (originalType === 'array' && original.length > 0) {
      const extendedKey = keyArray.concat(original.length - 1);
      const listeners = this.getRelevantListeners(extendedKey, undefined);
      // Consider a pre-notify here
      original.pop();
      if (notify) this.notify(listeners);
    }
  }

  has = (key) => has(this.data, key);


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

  getEverything = () => this.data;
  setEverything = (data) => {
    const listeners = this.getRelevantListeners([], data);
    this.data = data;
    this.notify(listeners, [], data);
  };

  // TODO: deduplicate translations!!
  translate = (inputKey, outputKey, translationFunction, { batch, throttleTime = null } = {}) => {
    const callback = (input) => {
      if (input.length > 0) {
        const output = translationFunction(input[input.length - 1].value, get(this.data, inputKey));
        if (output instanceof Promise) {
          output.then(result => this.set(outputKey, result));
        } else {
          this.set(outputKey, output);
        }
      }
    };
    const shouldThrottle = getTypeString(throttleTime) === 'number' && throttleTime > 0;
    this.listen(inputKey, { initialLoad: true, batch, callback: shouldThrottle ? throttle(callback, throttleTime) : callback });
  }
}
