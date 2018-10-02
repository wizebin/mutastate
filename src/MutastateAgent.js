import { set, get } from 'objer';

export default class MutastateAgent {
  constructor(mutastate, onChange) {
    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
  }

  cleanup() {
    return this.unlistenFromAll();
  }

  unlisten = (key) => {
    const result = this.mutastate.unlisten(key, this.handleChange);
    return result;
  }

  unlistenFromAll = () => {
    this.mutastate.unlistenBatch(this);
  }

  getComposedState = (initialData, key, value) => {
    if ((key instanceof Array && key.length === 0) || key === null) return value;

    set(initialData, key, value);
    return initialData;
  }

  setComposedState = (key, value) => {
    this.data = this.getComposedState(this.data, key, value);
  }

  listen = (key, { alias, transform, initialLoad = true, defaultValue, partOfMultiListen = false } = {}) => {
    const modifiedListener = {
      alias,
      transform,
      initialLoad,
      defaultValue,
      callback: this.handleChange,
      batch: this,
    };
    this.mutastate.listen(key, modifiedListener);

    if (initialLoad) {
      const listenData = this.mutastate.getForListener(key, modifiedListener);
      this.setComposedState(alias || key, listenData.value);
      if (!partOfMultiListen && this.onChange) {
        this.onChange(this.data);
      }
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
        loaded = true;
        const listenData = this.mutastate.getForListener(key, listener);
        this.setComposedState(alias || key, listenData.value)
      }
    }

    if (loaded && this.onChange) {
      this.onChange(this.data);
    }
  }

  handleChange = (changeEvents) => {
    for (let changedex = 0; changedex < changeEvents.length; changedex += 1) {
      const changeEvent = changeEvents[changedex];
      const { alias, key, value } = changeEvent;
      this.setComposedState(alias || key, value);
    }

    if (this.onChange) {
      this.onChange(this.data);
    }
  }

  get = (key) => this.mutastate.get(key);
  set = (key, value, options) => this.mutastate.set(key, value, options);
  delete = (key) => this.mutastate.delete(key);
  assign = (key, value) => this.mutastate.assign(key, value);
  push = (key, value, options) => this.mutastate.push(key, value, options);
  pop = (key, options) => this.mutastate.pop(key, options);
  has = (key) => this.mutastate.has(key);
  getEverything = () => this.mutastate.getEverything();
  setEverything = (data) => this.mutastate.setEverything(data);
}
