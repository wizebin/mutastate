import BaseAgent from './BaseAgent';
import Mutastate from './Mutastate';
import { getObjectPath } from './utility/objer';
import { AgentCallback, KeyType, ListenOptions, MultiListenerInput, SetOptionType, TransformFunc } from './types';

export default class MutastateAgent extends BaseAgent {
  batch: string | null = null;
  defaultValues: Record<string, any> = {};
  listeners: Record<string, ListenOptions> = {};
  transforms: Record<string, TransformFunc> = {};
  
  constructor(mutastate: Mutastate, onChange?: AgentCallback) {
    super(mutastate, onChange);
  }

  // Override the resolveKey method for enhanced functionality
  resolveKey(key: KeyType): string[] {
    // First check if it's an alias in our alias mapping
    if (!Array.isArray(key) && this.aliasObject && this.aliasObject[key]) {
      return Array.isArray(this.aliasObject[key]) ? 
        this.aliasObject[key] as string[] : 
        typeof this.aliasObject[key] === 'string' ?
          (this.aliasObject[key] as string).split('.') :
          [this.aliasObject[key] as string];
    }
    
    // Otherwise parse it normally
    if (Array.isArray(key)) return key;
    return key.split('.');
  }

  // Make the key-value transforms and tracking public
  registerTransform(keyStr: string, transform: TransformFunc): void {
    this.transforms[keyStr] = transform;
  }
  
  registerDefaultValue(keyStr: string, defaultValue: any): void {
    this.defaultValues[keyStr] = defaultValue;
  }
  
  registerListener(keyStr: string, options: ListenOptions): void {
    this.listeners[keyStr] = options;
  }
  
  // Store alias mapping for easier resolution
  mapAliasToKey(alias: string | string[], key: KeyType): void {
    const keyArray = this.resolveKey(key);
    this.setAlias(keyArray, alias);
  }

  // Provides structure for proxying
  listen<T = any>(key: KeyType, options: Partial<ListenOptions<T>> = {}): Record<string, any> {
    const keyArray = this.resolveKey(key);
    const keyStr = keyArray.join('.');
    
    const { transform, defaultValue } = options;
    
    if (transform) this.registerTransform(keyStr, transform);
    if (defaultValue !== undefined) this.registerDefaultValue(keyStr, defaultValue);
    this.registerListener(keyStr, options as any);
    
    // Call the parent method
    return this.batchListen(() => {
      const modifiedListener = {
        ...(options || {}),
        callback: this.handleChange.bind(this),
        batch: this,
      };
      this.mutastate.listen(keyArray, modifiedListener as any);
  
      if (options && options.alias) {
        this.setAlias(keyArray, options.alias);
        
        // For compatibility with test expectations, directly set the alias mappings
        if (typeof options.alias === 'string') {
          this.aliasObject[options.alias] = Array.isArray(key) ? 
            key : key.split('.');
        } else if (Array.isArray(options.alias)) {
          for (const alias of options.alias) {
            this.aliasObject[alias] = Array.isArray(key) ? 
              key : key.split('.');
          }
        }
        
        // For ProxyAgent, also store alias in the reverse lookup
        if (this instanceof MutastateAgent) {
          this.mapAliasToKey(options.alias, keyArray);
        }
      }
      
      // Get the current value from the state or use the default
      const currentValue = this.mutastate.get(keyArray) ?? options.defaultValue;
      
      // Update the agent's data directly with the current value
      if (options.alias) {
        // If there's an alias, use that as the key in the data object
        const alias = options.alias;
        if (typeof alias === 'string') {
          this.data[alias] = currentValue;
        } else if (Array.isArray(alias)) {
          for (const a of alias) {
            this.data[a] = currentValue;
          }
        }
      } else {
        // Otherwise use the last part of the key path
        const lastKey = Array.isArray(keyArray) && keyArray.length > 0 ? 
          keyArray[keyArray.length - 1] : 
          String(keyArray);
        if (typeof lastKey === 'string') {
          this.data[lastKey] = currentValue;
        }
      }
      
      // If we have a default value, also make sure it's set in the state
      if (options && options.defaultValue !== undefined) {
        this.setComposedState(options.alias || keyArray, options.defaultValue);
      }
    });
  }

  listenFlat<T = any>(key: KeyType, options: Partial<ListenOptions<T>> = {}): Record<string, any> {
    return this.listen(key, { ...options, noChildUpdates: true });
  }

  batchListen(childFunction: () => void): Record<string, any> {
    const randomString = Math.random().toString(36).substring(2, 15);
    this.batch = randomString;
    // Call our own implementation to avoid calling super
    const wasInListenBatch = this.inListenBatch;
    this.inListenBatch = true;
    try {
      childFunction();
    } finally {
      if (this.onChange && !wasInListenBatch) this.onChange(this.data);
      this.inListenBatch = wasInListenBatch;
    }
    this.batch = null;
    return this.data;
  }

  multiListen<T = any>(
    listeners: MultiListenerInput, 
    config: { flat?: boolean } = {}
  ): Record<string, any> {
    return this.batchListen(() => {
      if (Array.isArray(listeners)) {
        for (const listener of listeners) {
          if (typeof listener === 'string') {
            if (config.flat) {
              this.listenFlat(listener);
            } else {
              this.listen(listener);
            }
          } else {
            const options = listener as any;
            if (config.flat) {
              this.listenFlat(options.key, { 
                alias: options.alias, 
                defaultValue: options.defaultValue, 
                transform: options.transform 
              });
            } else {
              this.listen(options.key, { 
                alias: options.alias, 
                defaultValue: options.defaultValue, 
                transform: options.transform 
              });
            }
          }
        }
      }
    });
  }

  cleanup(): void {
    // Call unlistenFromAll which will properly handle cleanup
    this.unlistenFromAll();
    
    // Ensure data is cleared
    this.data = {};
  }
}