/**
 * A throttled function wrapper
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, timeout: number): (...args: Parameters<T>) => void;
/**
 * Given a key array and a value, create an object with the key array as the path and the value at that path
 */
export declare function getKeyFilledObject(keyArray: string[], value: any): Record<string, any>;
/**
 * findIndex (es6 polyfill)
 */
export declare function findIndex<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean): number;
