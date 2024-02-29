import { set, has, get, assassinate, getObjectPath, getTypeString } from './utility/objer';

export default class BaseAgent {
  constructor(mutastate, onChange) {
    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
    this.aliasObject = {};
    this.reverseAliasObject = {};
  }

  getComposedState = (initialData, key, value) => {
    if ((key instanceof Array && key.length === 0) || key === null) return value;

    set(initialData, key, value);
    return initialData;
  }

  setComposedState = (key, value) => {
    this.data = this.getComposedState(this.data, key, value);
  }

  translate = (inputKey, outputKey, translationFunction, { killOnCleanup = true, throttleTime = null } = {}) => {
    this.mutastate.translate(inputKey, outputKey, translationFunction, { batch: killOnCleanup ? this : undefined, throttleTime });
  }

  setAlias = (key, alias) => {
    set(this.aliasObject, alias, key);
    set(this.reverseAliasObject, key, alias);
  }

  clearAlias = (key) => {
    const alias = get(this.reverseAliasObject, key);
    if (alias) {
      assassinate(this.reverseAliasObject, key);
      assassinate(this.aliasObject, alias);
    }
  }

  clearAllAliases = () => {
    this.aliasObject = {};
    this.reverseAliasObject = {};
  }

  resolveKey = (key) => {
    const keyArray = getObjectPath(key);
    const firstKey = keyArray instanceof Array ? keyArray[0] : keyArray;
    return has(this.aliasObject, firstKey) ? [].concat(get(this.aliasObject, firstKey)).concat(keyArray.slice(1)) : keyArray;
  }

  resolve = this.resolveKey;

  listen = (key, { alias, transform, initialLoad = true, defaultValue } = {}) => {
    const keyArray = getObjectPath(key);
    const modifiedListener = {
      alias,
      transform,
      initialLoad,
      defaultValue,
      callback: this.handleChange,
      batch: this,
    };
    this.mutastate.listen(keyArray, modifiedListener);

    if (alias) {
      this.setAlias(keyArray, alias);
    }
    if (initialLoad) {
      this.ignoreChange = true;
      const listenData = this.mutastate.getForListener(keyArray, modifiedListener);
      this.setComposedState(alias || keyArray, listenData.value);
      if (!this.inListenBatch && this.onChange) {
        this.onChange(this.data);
      }
      this.ignoreChange = false;
    }

    return this.data;
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
    return this.data;
  }

  multiListen = (listeners, { flat = true } = {}) => {
    const listenFunc = (flat ? this.listenFlat : this.listen);

    return this.batchListen(() => {
      listeners.forEach((listener) => {
        const isString = (getTypeString(listener) === 'string');
        const key = isString ? listener : get(listener, 'key');
        listenFunc(key, isString ? undefined : listener);
      })
    });
  }

  cleanup() {
    return this.unlistenFromAll();
  }

  unlisten = (key) => {
    const keyArray = getObjectPath(key);
    const result = this.mutastate.unlisten(keyArray, this.handleChange);
    this.clearAlias(keyArray);
    return result;
  }

  unlistenFromAll = () => {
    this.mutastate.unlistenBatch(this);
    this.clearAllAliases();
  }

  handleChange = (changeEvents) => {
    this.ignoreChange = true;
    for (let changedex = 0; changedex < changeEvents.length; changedex += 1) {
      const changeEvent = changeEvents[changedex];
      const { alias, key, value } = changeEvent;
      this.setComposedState(alias || key, value);
    }

    if (this.onChange && !this.paused) {
      this.onChange(this.data);
    }
    this.ignoreChange = false;
  }

  get = (key) => this.mutastate.get(key);
  set = (key, value, options) => this.mutastate.set(key, value, options);
  delete = (key) => this.mutastate.delete(key);
  assign = (key, value) => this.mutastate.assign(key, value);
  push = (key, value, options) => this.mutastate.push(key, value, options);
  pop = (key, options) => this.mutastate.pop(key, options);
  has = (key) => this.mutastate.has(key);
  assure = (key, defaultValue) => this.mutastate.assure(key, defaultValue);
  getEverything = () => this.mutastate.getEverything();
  setEverything = (data) => this.mutastate.setEverything(data);
  getAgentData = () => this.data;
  pause = () => this.paused = true;
  resume = (executeCallback = true) => {
    this.paused = false;
    if (executeCallback) this.onChange(this.data);
  };
}
