/**
 * The proxy agent uses the proxy() javascript functionality when it internalizes data it adds a proxy layer above
 * setting which sends change requests (=, push, splice, etc) to mutastate directly and subsequent changes are brought in
 * this allows us to listen to a deeply nested key and change the resulting data easily
 */

import { set, get, assassinate, has, getTypeString, getObjectPath } from 'objer';
import changeWrapper from './changeWrapper';
import BaseAgent from './BaseAgent';

export default class ProxyAgent extends BaseAgent{
  constructor(mutastate, onChange) {
    super(mutastate, onChange);
    this.mutastate = mutastate;
    this.data = changeWrapper({}, this.proxyChange);
    this.onChange = onChange;
    this.aliasObject = {};
    this.reverseAliasObject = {};
  }

  // TODO manage push, pop, shift, unshift, splice, etc
  proxyChange = (data) => {
    if (!this.ignoreChange) {
      const { type, key, value } = data;
      const firstKey = key instanceof Array ? key[0] : key;
      const passKey = has(this.aliasObject, firstKey) ? [].concat(get(this.aliasObject, firstKey)).concat(key.slice(1)) : key;
      if (type === 'set') {
        this.mutastate.set(passKey, value);
      } else if (type === 'delete') {
        this.mutastate.delete(passKey);
      }
    }
  }

  cleanup() {
    return this.unlistenFromAll();
  }

  unlisten = (key) => {
    const result = this.mutastate.unlisten(key, this.handleChange);
    const alias = get(this.reverseAliasObject, key);
    if (alias) {
      assassinate(this.reverseAliasObject, key);
      assassinate(this.aliasObject, alias);
    }
    return result;
  }

  unlistenFromAll = () => {
    this.mutastate.unlistenBatch(this);
    this.aliasObject = {};
    this.reverseAliasObject = {};
  }

  getComposedState = (initialData, key, value) => {
    if ((key instanceof Array && key.length === 0) || key === null) return value;

    set(initialData, key, value);
    return initialData;
  }

  setComposedState = (key, value) => {
    const resultData = this.getComposedState(this.data, key, value);
    if (resultData !== this.data) this.data = changeWrapper(resultData, this.proxyChange);
  }

  listen = (key, { alias, transform, initialLoad = true, defaultValue } = {}) => {
    const modifiedListener = {
      alias,
      transform,
      initialLoad,
      defaultValue,
      callback: this.handleChange,
      batch: this,
    };
    this.mutastate.listen(key, modifiedListener);

    if (alias) {
      set(this.aliasObject, alias, key);
      set(this.reverseAliasObject, key, alias);
    }
    if (initialLoad) {
      this.ignoreChange = true;
      const listenData = this.mutastate.getForListener(key, modifiedListener);
      this.setComposedState(alias || key, listenData.value);
      if (!this.inListenBatch && this.onChange) {
        this.onChange(this.data);
      }
      this.ignoreChange = false;
    }
  }

  listenFlat = (key, { alias, transform, initialLoad = true, defaultValue } = {}) => {
    const fullKey = getObjectPath(key);
    const derivedAlias = alias ? alias : fullKey[fullKey.length - 1];
    return this.listen(fullKey, { alias: derivedAlias, transform, initialLoad, defaultValue });
  }

  batchListen = (childFunction) => {
    this.inListenBatch = true;
    try {
      childFunction();
    } finally {
      if (this.onChange) this.onChange(this.data);
      this.inListenBatch = false;
    }
  }

  multiListen = (listeners, { flat = true } = {}) => {
    const listenFunc = (flat ? this.listenFlat : this.listen);

    this.batchListen(() => {
      listeners.forEach((listener) => {
        const isString = (getTypeString(listener) === 'string');
        const key = isString ? listener : get(listener, 'key');
        listenFunc(key, isString ? undefined : listener);
      })
    });
  }

  handleChange = (changeEvents) => {
    this.ignoreChange = true;
    for (let changedex = 0; changedex < changeEvents.length; changedex += 1) {
      const changeEvent = changeEvents[changedex];
      const { alias, key, value } = changeEvent;
      this.setComposedState(alias || key, value);
    }

    if (this.onChange) {
      this.onChange(this.data);
    }
    this.ignoreChange = false;
  }
}
