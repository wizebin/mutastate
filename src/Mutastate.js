import MutastateAgent from './MutastateAgent';
import { throttle, getKeyFilledObject, findIndex } from './MutastateHelpers';
import { assurePathExists, getObjectPath, has, get, getTypeString, keys, set, assassinate } from 'objer';
import { isBlankKey } from './utility/blankKey';
import getPromiseFunction from './utility/promise';
import ProxyAgent from './ProxyAgent';

function missingCallback() {
  console.error('Mutastate missing save or load callback', new Error().stack);
  return {};
}

/**
 * Use localstorage if the user hasn't specified a save function
 */
export function getLocalStorageSaveFunc() {
  if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
    return (key, data) => global.localStorage.setItem(key, JSON.stringify(data));
  } else if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return (key, data) => window.localStorage.setItem(key, JSON.stringify(data));
  }
}

export function getLocalStorageLoadFunc() {
  if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
    return (key) => global.localStorage.getItem(key) ? JSON.parse(global.localStorage.getItem(key)) : {};
  } else if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return (key) => window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : {};
  }
}

const SAVE_THROTTLE_TIME = 100;

/**
 * Core mutastate class, this class stores data and informes listeners of changes
 */
export default class Mutastate {
  constructor() {
    this.listenerObject = { subkeys: {} };
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
   * Set save and load functionality, as well as indicate shards we need to load and save
   */
  // TODO: consider adding persistData option here
  initialize = ({ shards, save, load }) => {
    this.saveData = save !== undefined ? save : missingCallback;
    this.loadData = load !== undefined ? load : missingCallback;
    this.persistShards = shards;
    return this.load();
  }

  /**
   * Save data from each persisted shard, persisted shards are indicated by initialize
   */
  save = () => {
    const result = {};
    const promises = [];
    const persistLength = (this.persistShards || []).length;
    for(let dex = 0; dex < persistLength; dex += 1) {
      const key = this.persistShards[dex];
      const saveResults = this.saveData(key, get(this.data, key));
      if (saveResults instanceof this.promise) {
        promises.push(saveResults.then(result => ({ [key]: result })));
      } else {
        result[key] = saveResults;
      }
    }

    if (promises.length > 0) {
      return this.promise.all(promises).then(ray => {
        (ray || []).forEach(obj => {
          if (obj) {
            Object.assign(result, obj);
          }
        });
        return this.data;
      });
    }

    return this.data;
  };

  /**
   * Load data from persisted shards, typically only called on app init
   */
  load = () => {
    const result = {};
    const promises = [];
    const persistLength = (this.persistShards || []).length;
    for(let dex = 0; dex < persistLength; dex += 1) {
      const key = this.persistShards[dex];
      const loadResults = this.loadData(key);
      if (loadResults instanceof this.promise) {
        promises.push(loadResults.then(result => ({ [key]: result })));
      } else {
        result[key] = loadResults;
      }
    }

    if (promises.length > 0) {
      return this.promise.all(promises).then(ray => {
        (ray || []).forEach(obj => {
          Object.assign(result, obj);
        });
        this.data = result;
        return this.data;
      });
    }

    this.data = result;
    return Promise.resolve(this.data);
  };

  throttledSave = throttle(this.save, SAVE_THROTTLE_TIME);

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

  // getChildListenersAtPath = (key) => {

  // }

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
    let value = null;

    if (has(this.data, key)) {
      value = get(this.data, key);
    } else {
      if (defaultValue !== undefined) {
        set(this.data, key, defaultValue);
      }
      value = defaultValue;
    }

    return { keyChange, alias, callback, key, value: transform ? transform(value) : value };
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
  notify(notifyBatch) {
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
  }

  get = (key) => {
    return get(this.data, key);
  }

  set = (key, value, { notify = true, immediate = false, save = true } = {}) => {
    const keyArray = getObjectPath(key);
    const listeners = this.getRelevantListeners(keyArray, value);
    // Consider a pre-notify here
    set(this.data, key, value);
    if (notify) this.notify(listeners);
    if (save) {
      if (immediate) this.save();
      else this.throttledSave();
    }
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
      if (save) {
      if (immediate) this.save();
        else this.throttledSave();
      }
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
      if (save) {
      if (immediate) this.save();
        else this.throttledSave();
      }
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
  //     if (immediate) this.save();
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
  //     if (immediate) this.save();
  //   }
  // }

  getEverything = () => this.data;
  setEverything = (data) => (this.data = data);
}
