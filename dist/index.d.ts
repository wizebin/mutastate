type SaveCallbackFunc = (string, any) => boolean;
type LoadCallbackFunc = (string) => any;
type AgentCallback = (any) => void;
type TransformFunc = (any) => any;
type BatchFunc = () => void;
type KeyType = (string | string[]);
type SetOptionType = { notify: boolean };

type ListenOptions = { alias: string, defaultValue: any, transform: TransformFunc };
type MultiListenerInput = (string[] | { key: KeyType, alias: string, defaultValue: any, transform: TransformFunc }[]);

type MutastateInitializer = {
    shards: string[],
    save: SaveCallbackFunc,
    load: LoadCallbackFunc,
}

class MutastateAgent {
    constructor(AgentCallback)
    listen(string, ListenOptions): Object;
    resolveKey(key: KeyType): string;
    listenFlat(key: KeyType, ListenOptions): Object;
    batchListen(childFunction: BatchFunc): Object;
    multiListen(listeners: MultiListenerInput, { flat: boolean });
    cleanup(): void;
    get(key: KeyType): any;
    set(key: KeyType, value: any, options: SetOptionType): void;
    delete(key: KeyType): void;
    assign(key: KeyType, value: any): any;
    push(key: KeyType, value: any, options: SetOptionType): void;
    pop(key: KeyType, options: SetOptionType): any;
    has(key: KeyType): boolean;
    assure(key: KeyType, defaultValue: any): any;
    getEverything(): Object;
    setEverything(data: any): void;
}

class MutastateProxyAgent extends MutastateAgent {
    constructor(AgentCallback)
}

export class Mutastate {
    constructor(MutastateInitializer)
    getAgent(): MutastateAgent;
    getProxyAgent(): MutastateProxyAgent;
    getListenersAtPath(): AgentCallback[];
    addChangeHook(AgentCallback): void;
    removeChangeHook(AgentCallback): number;
    listen(key: string, listener: { callback: AgentCallback, alias: string|string[], batch: string, transform: TransformFunc, defaultValue: any });
    unlisten(key: string, callback: AgentCallback);
    unlistenBatch(batch: string, basePath: string|string[]);
    getForListener(key: string|string[], listener: AgentCallback);
    // getAllChildListeners() // internal
    // getDeleteListeners() // internal
    // getChangeListeners() // internal
    // getListenerObjectAtKey() // internal
    // getRelevantListeners() // internal
    // notify() // internal
    // notifyGlobals() // internal
    get(key: string|string[]): any;
    set(key: string|string[], value: any, meta: { notify: boolean }): void;
    delete(key: string|string[]): void;
    assign(key: string|string[], value: any): void;
    push(key: string|string[], value: any, meta: { notify: boolean }): boolean;
    pop(key: string|string[], meta: { notify: boolean }): boolean;
    has(key: string|string[]): boolean;
    assure(key: string|string[], defaultValue: any): any;
    getEverything(): any;
    setEverything(data: any, meta: { noDefaults: boolean }): void;
    getDefaults(key: string|string[]): any;
    translate(inputKey: string|string[], outputKey: string|string[], translationFunction: TransformFunc, meta: { batch: boolean, throttleTime: number }): void;
}

export function singleton(): Mutastate;
export function useMutastate(key: string|string[], options: { defaultValue: any, globalState: Mutastate }): [any, (value: any) => void];
