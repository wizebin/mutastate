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
