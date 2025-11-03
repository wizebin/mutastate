import { KeyType, SetOptionType, AgentCallback, TransformFunc, BatchType } from './types';
import Mutastate from './Mutastate';
export default class BaseAgent implements BatchType {
    mutastate: Mutastate;
    data: Record<string, any>;
    onChange?: AgentCallback;
    aliasObject: Record<string, any>;
    reverseAliasObject: Record<string, any>;
    ignoreChange: boolean;
    inListenBatch: boolean;
    paused: boolean;
    constructor(mutastate: Mutastate, onChange?: AgentCallback);
    getComposedState(initialData: Record<string, any>, key: KeyType, value: any): any;
    setComposedState(key: KeyType, value: any): void;
    translate<T = any, R = any>(inputKey: KeyType, outputKey: KeyType, translationFunction: TransformFunc<T, R>, { killOnCleanup, throttleTime }?: {
        killOnCleanup?: boolean;
        throttleTime?: number;
    }): void;
    setAlias(key: KeyType, alias: string | string[]): void;
    clearAlias(key: KeyType): void;
    clearAllAliases(): void;
    resolveKey(key: KeyType): string[];
    resolve(key: KeyType): string[];
    listen<T = any>(key: KeyType, { alias, transform, initialLoad, defaultValue }?: {
        alias?: string | string[];
        transform?: TransformFunc<T>;
        initialLoad?: boolean;
        defaultValue?: T;
    }): Record<string, any>;
    listenFlat<T = any>(key: KeyType, { alias, transform, initialLoad, defaultValue }?: {
        alias?: string;
        transform?: TransformFunc<T>;
        initialLoad?: boolean;
        defaultValue?: T;
    }): Record<string, any>;
    batchListen(childFunction: () => void): Record<string, any>;
    multiListen<T = any>(listeners: Array<string | {
        key: KeyType;
        alias?: string;
        transform?: TransformFunc<T>;
        defaultValue?: T;
    }>, { flat }?: {
        flat?: boolean;
    }): Record<string, any>;
    cleanup(): void;
    unlisten(key: KeyType): void;
    unlistenFromAll(): void;
    toString(): string;
    handleChange(changeEvents: Array<{
        alias?: string | string[];
        key: string[];
        value: any;
    }>): void;
    get(key: KeyType): any;
    set(key: KeyType, value: any, options?: SetOptionType): void;
    delete(key: KeyType): void;
    assign(key: KeyType, value: Record<string, any>): void;
    push(key: KeyType, value: any, options?: SetOptionType): boolean;
    pop(key: KeyType, options?: SetOptionType): boolean;
    has(key: KeyType): boolean;
    assure(key: KeyType, defaultValue: any): any;
    getEverything(): Record<string, any>;
    setEverything(data: Record<string, any>): void;
    getAgentData(): Record<string, any>;
    pause(): void;
    resume(executeCallback?: boolean): void;
}
