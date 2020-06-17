import singleton from './singleton';
import { deepEq } from 'objer';
import clone from 'lodash.clone';

let React;
try {
  React = require('react');
} catch (err) {
  const errorFunc = () => { throw new Error('REACT IS NOT AVAILABLE, useMutastate IS NOT AVAILABLE WITHOUT REACT') };
  React = { useState: errorFunc, useEffect: errorFunc, useRef: errorFunc };
}

const { useState, useEffect, useRef } = React;
/**
 *
 * @param {string} key
 * @param {{ defaultValue: any, globalState: Mutastate }} listenerParams
 */
export function useMutastate(key, listenerParams = {}) {
  const { defaultValue, globalState = singleton() } = listenerParams;
  const startingValue = globalState.has(key) ? globalState.get(key) : defaultValue;
  const [data, setData] = useState(clone(startingValue));
  const refKey = useRef(key);

  useEffect(() => {
    const func = () => setData(clone(globalState.get(key)));
    globalState.listen(key, { callback: func, defaultValue });
    if (!deepEq(refKey.current, key)) {
      func();
      refKey.current = key;
    }
    return () => globalState.unlisten(key, func);
  }, [key]);

  const setGlobalData = (value) => {
    globalState.set(key, value);
  }

  return [data, setGlobalData];
}
