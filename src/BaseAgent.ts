import { set, has, get, assassinate, getObjectPath, getTypeString } from './utility/objer';
import { KeyType, SetOptionType, AgentCallback, TransformFunc, BatchType } from './types';
import Mutastate from './Mutastate';

export default class BaseAgent implements BatchType {
  mutastate: Mutastate;
  data: Record<string, any>;
  onChange?: AgentCallback;
  aliasObject: Record<string, any>;
  reverseAliasObject: Record<string, any>;
  ignoreChange: boolean;
  inListenBatch: boolean;
  paused: boolean;

  constructor(mutastate: Mutastate, onChange?: AgentCallback) {
    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
    this.aliasObject = {};
    this.reverseAliasObject = {};
    this.ignoreChange = false;
    this.inListenBatch = false;
    this.paused = false;
  }

  getComposedState(initialData: Record<string, any>, key: KeyType, value: any): any {
    if ((key instanceof Array && key.length === 0) || key === null) return value;

    set(initialData, key, value);
    return initialData;
  }

  setComposedState(key: KeyType, value: any): void {
    this.data = this.getComposedState(this.data, key, value);
  }

  translate<T = any, R = any>(
    inputKey: KeyType, 
    outputKey: KeyType, 
    translationFunction: TransformFunc<T, R>, 
    { killOnCleanup = true, throttleTime = null }: { killOnCleanup?: boolean, throttleTime?: number } = {}
  ): void {
    this.mutastate.translate(
      inputKey, 
      outputKey, 
      translationFunction, 
      { batch: killOnCleanup ? this : undefined, throttleTime }
    );
  }

  setAlias(key: KeyType, alias: string | string[]): void {
    set(this.aliasObject, alias, key);
    set(this.reverseAliasObject, key, alias);
  }

  clearAlias(key: KeyType): void {
    const alias = get(this.reverseAliasObject, key);
    if (alias) {
      assassinate(this.reverseAliasObject, key);
      assassinate(this.aliasObject, alias);
    }
  }

  clearAllAliases(): void {
    this.aliasObject = {};
    this.reverseAliasObject = {};
  }

  resolveKey(key: KeyType): string[] {
    const keyArray = getObjectPath(key);
    const firstKey = keyArray instanceof Array ? keyArray[0] : keyArray;
    return has(this.aliasObject, firstKey) 
      ? [].concat(get(this.aliasObject, firstKey)).concat(keyArray.slice(1)) 
      : keyArray;
  }

  resolve(key: KeyType): string[] {
    return this.resolveKey(key);
  }

  listen<T = any>(
    key: KeyType, 
    { 
      alias, 
      transform, 
      initialLoad = true, 
      defaultValue 
    }: { 
      alias?: string | string[]; 
      transform?: TransformFunc<T>; 
      initialLoad?: boolean; 
      defaultValue?: T 
    } = {}
  ): Record<string, any> {
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

  listenFlat<T = any>(
    key: KeyType, 
    { 
      alias, 
      transform, 
      initialLoad = true, 
      defaultValue 
    }: { 
      alias?: string; 
      transform?: TransformFunc<T>; 
      initialLoad?: boolean; 
      defaultValue?: T 
    } = {}
  ): Record<string, any> {
    const fullKey = getObjectPath(key);
    const derivedAlias = alias ? alias : fullKey[fullKey.length - 1];
    return this.listen(fullKey, { alias: derivedAlias, transform, initialLoad, defaultValue });
  }

  batchListen(childFunction: () => void): Record<string, any> {
    this.inListenBatch = true;
    try {
      childFunction();
    } finally {
      if (this.onChange) this.onChange(this.data);
      this.inListenBatch = false;
    }
    return this.data;
  }

  multiListen<T = any>(
    listeners: Array<string | { key: KeyType; alias?: string; transform?: TransformFunc<T>; defaultValue?: T }>, 
    { flat = true }: { flat?: boolean } = {}
  ): Record<string, any> {
    const listenFunc = (flat ? this.listenFlat : this.listen);

    return this.batchListen(() => {
      listeners.forEach((listener) => {
        const isString = (getTypeString(listener) === 'string');
        if (isString) {
          listenFunc(listener as string);
        } else {
          const options = listener as { key: KeyType; alias?: string; transform?: TransformFunc<T>; defaultValue?: T };
          listenFunc(options.key, {
            alias: options.alias,
            transform: options.transform,
            defaultValue: options.defaultValue
          });
        }
      });
    });
  }

  cleanup(): void {
    return this.unlistenFromAll();
  }

  unlisten(key: KeyType): void {
    const keyArray = getObjectPath(key);
    this.mutastate.unlisten(keyArray, this.handleChange);
    this.clearAlias(keyArray);
  }

  unlistenFromAll(): void {
    this.mutastate.unlistenBatch(this.toString());
    this.clearAllAliases();
  }
  
  toString(): string {
    return `BaseAgent-${this.constructor.name}`;
  }

  handleChange(changeEvents: Array<{ alias?: string | string[]; key: string[]; value: any }>): void {
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

  get(key: KeyType): any {
    return this.mutastate.get(key);
  }
  
  set(key: KeyType, value: any, options?: SetOptionType): void {
    this.mutastate.set(key, value, options);
  }
  
  delete(key: KeyType): void {
    this.mutastate.delete(key);
  }
  
  assign(key: KeyType, value: Record<string, any>): void {
    this.mutastate.assign(key, value);
  }
  
  push(key: KeyType, value: any, options?: SetOptionType): boolean {
    return this.mutastate.push(key, value, options);
  }
  
  pop(key: KeyType, options?: SetOptionType): boolean {
    return this.mutastate.pop(key, options);
  }
  
  has(key: KeyType): boolean {
    return this.mutastate.has(key);
  }
  
  assure(key: KeyType, defaultValue: any): any {
    return this.mutastate.assure(key, defaultValue);
  }
  
  getEverything(): Record<string, any> {
    return this.mutastate.getEverything();
  }
  
  setEverything(data: Record<string, any>): void {
    this.mutastate.setEverything(data);
  }
  
  getAgentData(): Record<string, any> {
    return this.data;
  }
  
  pause(): void {
    this.paused = true;
  }
  
  resume(executeCallback = true): void {
    this.paused = false;
    if (executeCallback && this.onChange) this.onChange(this.data);
  }
}