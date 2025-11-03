import singleton from './singleton';
import { deepEq } from './utility/objer';
import clone from 'lodash.clone';
import { KeyType } from './types';
import Mutastate from './Mutastate';

let React: {
  useState: any;
  useEffect: any;
  useRef: any;
};

try {
  React = require('react');
} catch (err) {
  const errorFunc = () => { throw new Error('REACT IS NOT AVAILABLE, useMutastate IS NOT AVAILABLE WITHOUT REACT') };
  React = { useState: errorFunc, useEffect: errorFunc, useRef: errorFunc };
}

const { useState, useEffect, useRef } = React;

/**
 * React hook for mutastate
 * @param {KeyType} key - Key to listen to
 * @param {Object} listenerParams - Options for the listener
 * @param {any} listenerParams.defaultValue - Default value if key doesn't exist
 * @param {Mutastate} listenerParams.globalState - Mutastate instance to use (singleton by default)
 * @returns {[any, (value: any) => void]} Value and setter tuple, similar to useState
 */
export function useMutastate<T = any>(
  key: KeyType, 
  listenerParams: { 
    defaultValue?: T; 
    globalState?: Mutastate 
  } = {}
): [T, (value: T) => void] {
  const { defaultValue, globalState = singleton() } = listenerParams;
  const startingValue = globalState.has(key) ? globalState.get(key) as T : defaultValue;
  // @ts-ignore - React types
  const [data, setData] = useState(clone(startingValue));
  const refKey = useRef(key);

  useEffect(() => {
    const func = () => setData(clone(globalState.get(key) as T));
    globalState.listen(key, { callback: func, defaultValue });
    if (!deepEq(refKey.current, key)) {
      func();
      refKey.current = key;
    }
    return () => globalState.unlisten(key, func);
  }, [key]);

  const setGlobalData = (value: T): void => {
    globalState.set(key, value);
  }

  return [data, setGlobalData];
}