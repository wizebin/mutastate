import MutastateAgent from './MutastateAgent';
import Mutastate from './Mutastate';
import { AgentCallback, KeyType, ListenOptions, TransformFunc } from './types';
import { getObjectPath } from './utility/objer';

export default class ProxyAgent extends MutastateAgent {
  private handler: ProxyHandler<Record<string, any>>;
  private agentProxy: Record<string, any>;

  constructor(mutastate: Mutastate, onChange?: AgentCallback) {
    super(mutastate, onChange);

    // We need to create a proxy object that forwards:
    // 1. Property access to state from this.get
    // 2. All methods from this ProxyAgent instance
    // 3. Special properties like 'data'
    const methodNames = [
      'listen', 'listenFlat', 'batchListen', 'multiListen', 'cleanup', 'unlisten', 
      'unlistenFromAll', 'handleChange', 'get', 'set', 'delete', 'assign', 'push', 
      'pop', 'has', 'assure', 'getEverything', 'setEverything', 'getAgentData',
      'pause', 'resume', 'translate', 'resolveKey'
    ];

    this.handler = {
      get: (target: Record<string, any>, prop: string | symbol) => {
        if (typeof prop === 'string') {
          // Special case for data property
          if (prop === 'data') {
            // Return a proxy for the data object to intercept property access
            return new Proxy(this.data || {}, {
              get: (dataTarget, dataProp) => {
                if (typeof dataProp === 'string') {
                  return this.data[dataProp]; 
                }
                return undefined;
              },
              set: (dataTarget, dataProp, dataValue) => {
                if (typeof dataProp === 'string') {
                  // When setting data property, update the state
                  // First check if it's an alias and get the actual key
                  const resolvedKey = this.resolveKey(dataProp);
                  const actualKey = Array.isArray(resolvedKey) ? resolvedKey.join('.') : resolvedKey;
                  
                  // Set the value in the state manager
                  this.set(actualKey, dataValue);
                  
                  // Manually update our internal data to ensure it's reflected immediately
                  // for consistent behavior between test expectations
                  this.data[dataProp] = dataValue;
                  
                  // If we have an onChange callback, call it with the updated data
                  if (this.onChange) {
                    this.onChange(this.data);
                  }
                }
                return true;
              }
            });
          }
          
          // First check if it's a method on the agent
          if (methodNames.includes(prop) && typeof this[prop] === 'function') {
            return this[prop].bind(this);
          }

          // Check for special properties to skip
          if (['length', 'toJSON', 'constructor'].includes(prop)) {
            return undefined;
          }

          // If not a method, try to get the value from state
          return this.get(prop);
        }
        return undefined;
      },
      set: (target: Record<string, any>, prop: string | symbol, value: any) => {
        if (typeof prop === 'string') {
          if (prop === 'data' && typeof value === 'object') {
            // Handle setting the entire data object - advanced usage
            // We need to update each key in the state manager
            Object.keys(value).forEach(key => {
              this.set(key, value[key]);
            });
            return true;
          }
          
          // Normal property setting goes to the state
          this.set(prop, value);
        }
        return true;
      },
      deleteProperty: (target: Record<string, any>, prop: string | symbol) => {
        if (prop && typeof prop === 'string') {
          this.delete(prop);
        }
        return true;
      },
      has: (target: Record<string, any>, prop: string | symbol) => {
        if (prop && typeof prop === 'string') {
          return this.has(prop);
        }
        return false;
      },
    };

    // Create the proxy and add all methods from this instance
    const proxy: Record<string, any> = new Proxy({}, this.handler);
    this.agentProxy = proxy;

    // Return the proxy instance that will look like this class instance
    // but will actually use the custom proxy handler
    return proxy as unknown as ProxyAgent;
  }
  
  // Override resolveKey to properly handle aliases
  resolveKey(key: KeyType): string[] {
    // Direct pass-through if key is already an array
    if (Array.isArray(key)) {
      return key;
    }
    
    // Check for alias in our alias object
    if (typeof key === 'string' && this.aliasObject && this.aliasObject[key]) {
      return this.aliasObject[key] as string[];
    }
    
    // Call the parent class method
    return super.resolveKey(key);
  }
  
  // Override the listen method to ensure aliases are properly stored
  listen<T = any>(key: KeyType, options: Partial<ListenOptions<T>> = {}): Record<string, any> {
    const keyArray = this.resolveKey(key);
    
    // Make sure aliases are stored properly for resolution by ProxyAgent
    if (options && options.alias) {
      const alias = options.alias;
      const keyPath = typeof key === 'string' ? key.split('.') : key;
      
      // Store in aliasObject for resolution
      if (typeof alias === 'string') {
        this.aliasObject[alias] = keyPath;
      } else if (Array.isArray(alias)) {
        for (const a of alias) {
          this.aliasObject[a] = keyPath;
        }
      }
    }
    
    const result = super.listen(keyArray, options);
    return result;
  }
  
  // Override translate to ensure it works properly with the proxy
  translate<T = any, R = any>(
    inputKey: KeyType, 
    outputKey: KeyType, 
    translationFunction: TransformFunc<T, R>, 
    { killOnCleanup = true, throttleTime = null }: { killOnCleanup?: boolean, throttleTime?: number } = {}
  ): void {
    super.translate(inputKey, outputKey, translationFunction, { 
      killOnCleanup, 
      throttleTime 
    });
  }
}