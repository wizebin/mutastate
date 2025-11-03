/**
 * A throttled function wrapper
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  timeout: number
): (...args: Parameters<T>) => void {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;
  return function throttleWrap(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
        if (lastArgs) {
          const sendArgs = lastArgs;
          lastArgs = null;
          throttleWrap(...sendArgs);
        }
      }, timeout);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Given a key array and a value, create an object with the key array as the path and the value at that path
 */
export function getKeyFilledObject(keyArray: string[], value: any): Record<string, any> {
  let result: Record<string, any> = {};
  let keyFillObject = result;
  for (let keydex = 0; keydex < keyArray.length - 1; keydex += 1) {
    keyFillObject[keyArray[keydex]] = {};
    keyFillObject = keyFillObject[keyArray[keydex]];
  }
  if (keyArray.length > 0) {
    keyFillObject[keyArray[keyArray.length - 1]] = value;
  } else {
    result = value;
  }
  return result;
}

/**
 * findIndex (es6 polyfill)
 */
export function findIndex<T>(
  array: T[], 
  callback: (item: T, index: number, array: T[]) => boolean
): number {
  for (let dex = 0; dex < array.length; dex += 1) {
    if (callback(array[dex], dex, array)) return dex;
  }
  return -1;
}