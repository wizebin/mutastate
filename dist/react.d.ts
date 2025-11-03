/**
 * React-specific exports for Mutastate
 * Import from 'mutastate/react' to use React features
 */
export { default as Mutastate, default } from './Mutastate';
export { default as singleton } from './singleton';
export { default as MutastateAgent } from './MutastateAgent';
export { default as ProxyAgent } from './ProxyAgent';
export * from './types';
import { KeyType } from './types';
import Mutastate from './Mutastate';
/**
 * React hook for mutastate
 * @param {KeyType} key - Key to listen to
 * @param {Object} listenerParams - Options for the listener
 * @param {any} listenerParams.defaultValue - Default value if key doesn't exist
 * @param {Mutastate} listenerParams.globalState - Mutastate instance to use (singleton by default)
 * @returns {[any, (value: any | ((prevValue: any) => any)) => void]} Value and setter tuple, similar to useState
 */
export declare function useMutastate<T = any>(key: KeyType, listenerParams?: {
    defaultValue?: T;
    globalState?: Mutastate;
}): [T, (value: T | ((prevValue: T) => T)) => void];
import React from 'react';
import { MultiListenerInput } from './types';
type WithMutastateOptions<P = any> = {
    listeners?: ((props: P) => MultiListenerInput) | MultiListenerInput;
    listenersFlat?: boolean;
    globalState?: Mutastate;
};
export declare function withMutastateCreator<P = any, S = any>(options?: WithMutastateOptions<P>): (WrappedComponent: any) => {
    new (props: P): {
        agent: any;
        state: any;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: P): void;
        updateListeners(props: P): void;
        onMutastateChange(changes: Array<{
            key: KeyType;
            value: any;
        }>): void;
        render(): React.CElement<any, React.Component<any, any, any>>;
        context: unknown;
        setState<K extends keyof S>(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S | Pick<S, K>) | Pick<S, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<P>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export declare const withMutastate: (WrappedComponent: any) => {
    new (props: any): {
        agent: any;
        state: any;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: any): void;
        updateListeners(props: any): void;
        onMutastateChange(changes: {
            key: KeyType;
            value: any;
        }[]): void;
        render(): React.CElement<any, React.Component<any, any, any>>;
        context: unknown;
        setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<any>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
