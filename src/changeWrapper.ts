import { get } from './utility/objer';

export type ChangeData = {
  key: string[];
  type: 'set' | 'delete';
  value?: any;
};

type ChangeCallback = (data: ChangeData) => void;

/**
 * Helper to wrap changes with a callback
 */
export default function changeWrapper(
  target: any, 
  onChange: ChangeCallback
): any {
  const handler = {
    revoke: () => {},
    cache: {} as Record<string, any>,
    get: (target: any, prop: string | symbol): any => {
      if (prop === 'isProxy') return true;
      
      // Special handling for array methods
      if (prop === 'push' && Array.isArray(target)) {
        return (value: any) => {
          const result = target.push(value);
          onChange({
            key: [String(target.length - 1)],
            type: 'set',
            value
          });
          return result;
        };
      }
      
      if (prop === 'pop' && Array.isArray(target)) {
        return () => {
          const index = target.length - 1;
          const result = target.pop();
          onChange({
            key: [String(index)],
            type: 'delete'
          });
          return result;
        };
      }
      
      const result = target[prop];
      
      if (typeof result === 'object' && result !== null) {
        if (get(handler.cache, prop.toString())) return get(handler.cache, prop.toString());
        const subHandler = changeWrapper(result, (data: ChangeData) => {
          onChange({
            ...data,
            key: [prop.toString()].concat(data.key),
          });
        });
        handler.cache[prop.toString()] = subHandler;
        return subHandler;
      }
      
      return result;
    },
    set: (target: any, prop: string | symbol, value: any): boolean => {
      target[prop] = value;
      onChange({
        key: [prop.toString()],
        type: 'set',
        value,
      });
      return true;
    },
    deleteProperty: (target: any, prop: string | symbol): boolean => {
      delete target[prop];
      onChange({
        key: [prop.toString()],
        type: 'delete',
      });
      return true;
    },
  };
  
  return new Proxy(target, handler);
}