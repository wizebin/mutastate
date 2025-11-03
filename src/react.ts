/**
 * React-specific exports for Mutastate
 * Import from 'mutastate/react' to use React features
 */

// Re-export core for convenience
export { default as Mutastate, default } from './Mutastate';
export { default as singleton } from './singleton';
export { default as MutastateAgent } from './MutastateAgent';
export { default as ProxyAgent } from './ProxyAgent';
export * from './types';

// React-specific features with static imports
import singleton from './singleton';
import { deepEq } from './utility/objer';
import clone from 'lodash.clone';
import { KeyType } from './types';
import Mutastate from './Mutastate';
import { useState, useEffect, useRef, useCallback } from 'react';

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

// Export WithMutastate HOC
import React from 'react';
import { MultiListenerInput } from './types';

type WithMutastateOptions<P = any> = {
  listeners?: ((props: P) => MultiListenerInput) | MultiListenerInput;
  listenersFlat?: boolean;
  globalState?: Mutastate;
};

export function withMutastateCreator<P = any, S = any>(options: WithMutastateOptions<P> = {}) {
  return function withMutastate(WrappedComponent: any) {
    const {
      listeners = [],
      listenersFlat = false,
      globalState = singleton()
    } = options;

    class WithMutastate extends React.Component<P, S> {
      agent: any;
      state: any = {};

      constructor(props: P) {
        super(props);
        this.agent = globalState.getAgent(this.onMutastateChange.bind(this));
        this.updateListeners(props);
      }

      componentWillUnmount() {
        this.agent.cleanup();
      }

      componentDidUpdate(prevProps: P) {
        if (typeof listeners === 'function') {
          const nextListeners = listeners(this.props);
          const prevListeners = listeners(prevProps);
          if (JSON.stringify(nextListeners) !== JSON.stringify(prevListeners)) {
            this.updateListeners(this.props);
          }
        }
      }

      updateListeners(props: P) {
        const resolvedListeners = typeof listeners === 'function' ? listeners(props) : listeners;
        this.agent.multiListen(resolvedListeners, { flat: listenersFlat });
      }

      onMutastateChange(changes: Array<{ key: KeyType; value: any }>) {
        const newState: Record<string, any> = {};
        for (let change of changes) {
          if (typeof change.key === 'string') {
            newState[change.key] = change.value;
          }
        }
        this.setState(newState);
      }

      render() {
        return React.createElement(WrappedComponent, {
          ...this.props,
          ...this.state,
          mutastate: this.agent,
        });
      }
    }

    return WithMutastate;
  };
}

export const withMutastate = withMutastateCreator();
