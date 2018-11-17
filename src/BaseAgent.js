import { set } from 'objer';

export default class BaseAgent {
  constructor(mutastate, onChange) {
    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
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
