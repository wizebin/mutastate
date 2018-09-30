/**
 * The proxy agent uses the proxy() javascript functionality when it internalizes data it adds a proxy layer above
 * setting which sends change requests (=, push, splice, etc) to mutastate directly and subsequent changes are brought in
 * this allows us to listen to a deeply nested key and change the resulting data easily
 */

import { set, get, assassinate } from 'objer';
import changeWrapper from './changeWrapper';

export default class ProxyAgent {
  constructor(mutastate, onChange) {
    this.mutastate = mutastate;
    this.data = changeWrapper({}, this.proxyChange);
    this.onChange = onChange;
    // this.aliasObject = {};
  }

  proxyChange = (data) => {
    if (!this.ignoreChange) {
      const { type, key, value } = data;
      if (type === 'set') {
        console.log('proxy agent set', JSON.stringify(data, null, 2), this.data)
        this.mutastate.set(key, value);
      } else if (type === 'delete') {
        this.mutastate.delete(key);
      }
    }
  }

  cleanup() {
    return this.unlistenFromAll();
  }

  unlisten = (key) => {
    const result = this.mutastate.unlisten(key, this.handleChange);
    // assassinate(this.aliasObject, key);
    return result;
  }

  unlistenFromAll = () => {
    this.mutastate.unlistenComponent(this);
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

  listen = (key, { alias, transform, initialLoad = true, defaultValue, partOfMultiListen = false } = {}) => {
    const modifiedListener = {
      alias,
      transform,
      initialLoad,
      defaultValue,
      callback: this.handleChange,
      component: this,
    };
    this.mutastate.listen(key, modifiedListener);

    if (initialLoad) {
      this.ignoreChange = true;
      const listenData = this.mutastate.getForListener(key, modifiedListener);
      this.setComposedState(alias || key, listenData.value);
      if (!partOfMultiListen && this.onChange) {
        this.onChange(this.data);
      }
      this.ignoreChange = false;
    }
  }

  multiListen = (listeners, { initialLoad = true } = {}) => {
    let loaded = false;

    for (let listenerdex = 0; listenerdex < listeners.length; listenerdex += 1) {
      const listener = listeners[listenerdex];
      const hasKey = get(listener, 'key');
      const key = hasKey ? listener.key : listener;
      const alias = hasKey ? listener.alias : null;
      const options = (hasKey ? listener.options : {}) || {};
      this.listen(key, { ...options, partOfMultiListen: true });
      if (initialLoad) {
        this.ignoreChange = true;
        loaded = true;
        const listenData = this.mutastate.getForListener(key, listener);
        this.setComposedState(alias || key, listenData.value)
        this.ignoreChange = false;
      }
    }

    if (loaded && this.onChange) {
      this.onChange(this.data);
    }
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
