import singleton from './singleton';
import { deepEq } from './utility/objer';
import clone from 'lodash.clone';
import { KeyType } from './types';
import Mutastate from './Mutastate';

let reactModule: any = null;
let reactLoadAttempted = false;

function getReact() {
  if (reactLoadAttempted) {
    return reactModule;
  }

  reactLoadAttempted = true;

  try {
    // Try CommonJS require for Node/UMD environments
    if (typeof require !== 'undefined') {
      reactModule = require('react');
      return reactModule;
    }
  } catch (err) {
    // Require failed or not available
  }

  // For ES module environments, check if React is available globally
  if (typeof window !== 'undefined' && (window as any).React) {
    reactModule = (window as any).React;
    return reactModule;
  }

  // For environments like Vite, React might be available but not yet loaded
  // In this case, the module will fail when used, which is expected
  return null;
}

function ensureReactHooks() {
  const React = getReact();
  if (!React) {
    throw new Error('REACT IS NOT AVAILABLE, useMutastate IS NOT AVAILABLE WITHOUT REACT');
  }
  return {
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    useCallback: React.useCallback
  };
}

/**
 * React hook for mutastate
 * @param {KeyType} key - Key to listen to
 * @param {Object} listenerParams - Options for the listener
 * @param {any} listenerParams.defaultValue - Default value if key doesn't exist
 * @param {Mutastate} listenerParams.globalState - Mutastate instance to use (singleton by default)
 * @returns {[any, (value: any | ((prevValue: any) => any)) => void]} Value and setter tuple, similar to useState
 */
export function useMutastate<T = any>(
  key: KeyType,
  listenerParams: {
    defaultValue?: T;
    globalState?: Mutastate
  } = {}
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const { useState, useEffect, useRef, useCallback } = ensureReactHooks();

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
  }, [key, defaultValue, globalState]);

  const setGlobalData = useCallback((value: T | ((prevValue: T) => T)): void => {
    if (typeof value === 'function') {
      const currentValue = globalState.has(key) ? globalState.get(key) as T : defaultValue;
      const newValue = (value as (prevValue: T) => T)(currentValue);
      globalState.set(key, newValue);
    } else {
      globalState.set(key, value);
    }
  }, [key, defaultValue, globalState]);

  return [data, setGlobalData];
}