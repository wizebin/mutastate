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
}

export function singleton(): Mutastate;
