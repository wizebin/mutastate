import ShardedNexustate from './ShardedNexustate';

type NexustateTransform = (any) => any;

type NexustateSetOptions = {
    immediatePersist: boolean,
    noNotify: boolean,
};

type NexustateKeyChange = {
    keyChange: string | string[],
    alias: string | string[],
    key: string | string[],
    value: any,
};

type NexustateChangeCallback = (NexustateKeyChange) => void;

type NexustateListener = {
    key: string | string[],
    alias: string,
    callback: NexustateChangeCallback,
    transform: NexustateTransform,
};

type NexuscriptListener = {
    key: string | string[],
    callback: NexustateChangeCallback,
    alias: string | string[],
    component: any,
    transform: NexustateTransform,
    noChildUpdates: boolean,
};

type KeyType = string | string[];

export class Nexustate {
    constructor(...args: any[]);

    setPersistenceFunctions(save: (string, any) => boolean, load: (string) => any): void;

    setPersist(shouldPersist: boolean): void;

    set(object: object, options: NexustateSetOptions): object[];

    setKey(key: KeyType, value: any, options: NexustateSetOptions): object;

    get(key: KeyType): any;

    delete(key: KeyType, options: NexustateSetOptions): void;

    push(key: KeyType, value: any, options: NexustateSetOptions): any;

    getForListener(listener: NexustateListener, keyChange): NexustateKeyChange;

    persist(immediate: boolean): void;

    listen(listener: NexuscriptListener): void;

    unlisten(key: KeyType, callback: NexustateChangeCallback): void;

    unlistenComponent(component: any, basePath?: KeyType): void;

    has(key: KeyType): boolean;

    assureExists(key: KeyType, defaultValue: any): boolean;
}

type ChangeCallbackFunc = (any) => void;
type ListenOptions = {
    shard: string,
    key: KeyType,
    alias: string,
    transform: NexustateTransform,
    initialLoad: boolean,
    noChildUpdates: boolean,
    noParentUpdates: boolean,
};

export class NexustateAgent {
    constructor(shardedNexustate: ShardedNexustate, cloneBeforeSet: boolean, onChange: ChangeCallbackFunc);

    createShard(shard: string, options: any): Nexustate;
    unlisten(path: KeyType, { shard: string, resetState: boolean } = {}): boolean;
    unlistenFromAll({ resetState: boolean } = {}): void;
    setComposedState(path: KeyType, value: any): void;
    listen(options: ListenOptions): void;
    multiListen(listeners: ListenOptions[], { initialLoad: boolean } = {}): void;
    handleChange(changeEvents: any[]): void;
    get(path: KeyType, { shard: string } = {}): any;
    delete(path: KeyType, { shard: string } = {}): boolean;
    set(path: KeyType, data: any, { shard: string } = {}): any;
    push(path: KeyType, data: any, { shard: string } = {}): any;
    getShard(shard: string): Nexustate;
    cleanup(): void;
    assureExists(path: KeyType, defaultValue: any, { shard: string } = {}): boolean;
    has(path: KeyType, { shard: string } = {}): boolean;
}

type SaveCallbackFunc = (string, any) => boolean;
type LoadCallbackFunc = (string) => any;

type NexustateOptions = {
    persist: boolean,
    saveCallback: SaveCallbackFunc,
    loadCallback: LoadCallbackFunc,
    storageKey: string,
};

export function getNexustate(name: string, options: NexustateOptions): Nexustate;

export function getShardedNexustate(): ShardedNexustate;
