/**
 * The proxy agent uses the proxy() javascript functionality when it internalizes data it adds a proxy layer above
 * setting which sends change requests (=, push, splice, etc) to mutastate directly and subsequent changes are brought in
 * this allows us to listen to a deeply nested key and change the resulting data easily
 */

import { set } from './utility/objer';
import changeWrapper from './changeWrapper';
import BaseAgent from './BaseAgent';

export default class ProxyAgent extends BaseAgent{
  constructor(mutastate, onChange) {
    super(mutastate, onChange);
    this.mutastate = mutastate;
    this.data = changeWrapper({}, this.proxyChange);
    this.onChange = onChange;
  }

  // TODO manage push, pop, shift, unshift, splice, etc
  proxyChange = (data) => {
    if (!this.ignoreChange) {
      const { type, key, value } = data;

      if (type === 'set') {
        this.set(this.resolveKey(key), value);
      } else if (type === 'delete') {
        this.delete(this.resolveKey(key));
      }
    }
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
}
