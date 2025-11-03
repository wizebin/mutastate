import cloneLib from 'lodash.clone';

export function getTypeString(input: any): string {
  if (input === undefined) return 'undefined';
  if (input === null) return 'null';
  if (Array.isArray(input)) return 'array';
  return typeof input;
}

export function shallowClone(input: any): any {
  const type = getTypeString(input);
  if (type === 'array') return [...input];
  if (type === 'object') return { ...input };
  return input;
}

export function clone(input: any): any {
  return cloneLib(input);
}

export function getObjectPath(pathin: string | string[]): string[] {
  if (pathin === undefined) return [];
  if (Array.isArray(pathin)) return pathin;
  if (pathin === null) return [];
  if (pathin === '') return [];
  return pathin.toString().split('.');
}

export function getObjectAtPath(base: Record<string, any>, pathin: string | string[]): any {
  const path = getObjectPath(pathin);
  let result: any = base;
  for (let itemdex = 0; itemdex < path.length; itemdex += 1) {
    if (result === undefined || result === null) return undefined;
    const pathKey = path[itemdex];
    result = result[pathKey];
  }
  return result;
}

export function get<T = any>(object: Record<string, any>, path: string | string[], defaultValue?: T): T {
  const result = getObjectAtPath(object, path);
  if (result === undefined) return defaultValue as T;
  return result;
}

export function has(object: Record<string, any>, path: string | string[]): boolean {
  if (path === undefined || path === null || (Array.isArray(path) && path.length === 0)) return false;
  return getObjectAtPath(object, path) !== undefined;
}

export function keys(object: Record<string, any>): string[] {
  if (!object || typeof object !== 'object') return [];
  return Object.keys(object);
}

export function objectAssign(object: Record<string, any>, path: string | string[], value: any): Record<string, any> {
  const keyArray = getObjectPath(path);
  const result = clone(object || {});
  let currentOb = result;
  for (let keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
    const pathItem = keyArray[keydex];
    if (currentOb[pathItem] === undefined || currentOb[pathItem] === null || typeof currentOb[pathItem] !== 'object') {
      if (keyArray.length > keydex + 1 && !isNaN(parseInt(keyArray[keydex + 1], 10))) {
        currentOb[pathItem] = [];
      } else {
        currentOb[pathItem] = {};
      }
    }
    currentOb = currentOb[pathItem];
  }
  const lastKey = keyArray[keyArray.length - 1];
  if (keyArray.length === 0) {
    return { ...result, ...value };
  }
  
  if (value === undefined) {
    delete currentOb[lastKey];
  } else {
    currentOb[lastKey] = value;
  }
  
  return result;
}

export function set(object: Record<string, any>, path: string | string[], value: any): Record<string, any> {
  const keyArray = getObjectPath(path);
  let currentOb = object;
  if (!currentOb) return objectAssign({}, path, value);

  for (let keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
    const pathItem = keyArray[keydex];
    if (currentOb[pathItem] === undefined || currentOb[pathItem] === null || typeof currentOb[pathItem] !== 'object') {
      if (keyArray.length > keydex + 1 && !isNaN(parseInt(keyArray[keydex + 1], 10))) {
        currentOb[pathItem] = [];
      } else {
        currentOb[pathItem] = {};
      }
    }
    currentOb = currentOb[pathItem];
  }
  const lastKey = keyArray[keyArray.length - 1];
  if (keyArray.length === 0) {
    throw new Error('Cannot use set with empty path');
  }
  
  if (value === undefined) {
    delete currentOb[lastKey];
  } else {
    currentOb[lastKey] = value;
  }
  
  return object;
}

export function assurePathExists<T = any>(
  object: Record<string, any>, 
  path: string | string[], 
  defaultValue: T
): T {
  if (!has(object, path)) {
    set(object, path, defaultValue);
  }
  return get(object, path);
}

export function assassinate(object: Record<string, any>, path: string | string[]): void {
  const thekeys = getObjectPath(path);
  if (thekeys.length < 1) return;
  
  let currentOb = object;
  let currentPath: string[] = [];
  
  for (let keydex = 0; keydex < thekeys.length - 1; keydex += 1) {
    const pathItem = thekeys[keydex];
    if (currentOb[pathItem] === undefined) return;
    if (currentOb[pathItem] === null) return;
    if (typeof currentOb[pathItem] !== 'object') return;
    
    currentPath.push(pathItem);
    currentOb = currentOb[pathItem];
  }
  
  if (currentOb === undefined || currentOb === null) return;
  
  const finalkey = thekeys[thekeys.length - 1];
  if (finalkey) delete currentOb[finalkey];
}

export function deepEq(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let dex = 0; dex < a.length; dex += 1) {
      if (!deepEq(a[dex], b[dex])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const akeys = Object.keys(a);
    const bkeys = Object.keys(b);
    if (akeys.length !== bkeys.length) return false;
    return akeys.every(key => deepEq(a[key], b[key]));
  }
  return false;
}