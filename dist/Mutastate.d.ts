import MutastateAgent from './MutastateAgent';
import ProxyAgent from './ProxyAgent';
import { AgentCallback, KeyType, ListenOptions, ListenerData, ListenerObject, MutastateInitializer, NotifyData, ChangeData, ReplicatorConfig, TransformFunc } from './types';
/**
 * Core mutastate class, this class stores data and informs listeners of changes
 */
export default class Mutastate {
    private listenerObject;
    private replicators;
    private globalListeners;
    private data;
    private promise;
    private nextReplicatorId;
    constructor(options?: MutastateInitializer);
    /**
     * @method
     * @description
     * An agent is a listener with alias and transform capabilities
     * @param {function} onChange
     */
    getAgent: (onChange?: AgentCallback) => MutastateAgent;
    getProxyAgent: (onChange?: AgentCallback) => ProxyAgent;
    /**
     * @ignore
     * @method
     * @description
     * Retrieve a list of relevant listeners given a change at a key;
     */
    getListenersAtPath: (key: KeyType) => ListenOptions[];
    /**
     * @method
     * @description Listen for any change
     * @param {function} listener
     */
    addChangeHook: (listener: (data: ChangeData) => void) => void;
    removeChangeHook: (listener: (data: ChangeData) => void) => number;
    /**
     * @method
     * @description
     * Add a path listener, dedupes by callback function, careful with anonymous functions!
     */
    listen: <T = any>(key: KeyType, listener: ListenOptions<T>) => boolean;
    /**
     * @method
     * @description
     * Unlisten by callback, careful with anonymous functions!
     */
    unlisten: (key: KeyType, callback: AgentCallback) => void;
    /**
     * @method
     * @description
     * Unlisten by the batch parameter passed into the options of the listen function
     */
    unlistenBatch: (batch: string | any, basePath?: string | string[]) => void;
    /**
     * @method
     * @description
     * Get data for a particular listener, apply transformation to the value
     */
    getForListener(key: KeyType, listener: ListenOptions): NotifyData;
    /**
     * @method
     * @description
     * Get a full list of listeners under a subkey
     */
    getAllChildListeners: (listenerObject: ListenerObject, currentKey: string[], type: "change" | "delete") => ListenerData[];
    /**
     * @method
     * @description
     * recurse original against incoming for changed keys, if original type is an object or array and incoming type is not the same
     * pass all child listeners. If incoming and original are both either objects or arrays, recurse the children using this function.
     */
    getDeleteListeners: (original: any, incoming: any, listenerObject: ListenerObject, currentKey?: string[]) => ListenerData[];
    /**
     * @method
     * @description
     * given a change, notify all parents of the relevant key, and for every subkey of the incoming data notify listeners
     * this function does not notify any listers of removed data, getDeleteListeners fulfills that role
     */
    getChangeListeners(change: any, sublistener: ListenerObject, key?: string[], originalChangeDepth?: number, currentChangeDepth?: number): ListenerData[];
    /**
     * @method
     * @description
     * Listeners are nested by a pattern of subkeys.key.subkeys.otherkey, this function turns ['key', 'otherkey'] into the expected array
     */
    getListenerObjectAtKey(key: string[]): ListenerObject | null;
    /**
     * @method
     * @description
     * Concatenate change and delete listeners for a given change
     */
    getRelevantListeners(key: KeyType, value: any): ListenerData[];
    /**
     * @method
     * @description
     * Execute notify callbacks for a batch in format [{ listener, key }]
     */
    notify(notifyBatch: ListenerData[], keyArray: string[], value: any): void;
    notifyGlobals: (keyArray: string[], value: any, meta?: Record<string, any>) => void;
    get(key: KeyType): any;
    set(key: KeyType, value: any, { notify }?: {
        notify?: boolean;
    }): void;
    delete(key: KeyType): void;
    assign(key: KeyType, value: Record<string, any>): void;
    push(key: KeyType, value: any, { notify }?: {
        notify?: boolean;
    }): boolean;
    pop(key: KeyType, { notify }?: {
        notify?: boolean;
    }): boolean;
    has(key: KeyType): boolean;
    assure(key: KeyType, defaultValue: any): any;
    getEverything(): Record<string, any>;
    setEverything(data: Record<string, any>, { noDefaults }?: {
        noDefaults?: boolean;
    }): void;
    getDefaults(subkey?: string[]): Record<string, any>;
    translate(inputKey: KeyType, outputKey: KeyType, translationFunction: TransformFunc, { batch, throttleTime }?: {
        batch?: string | any;
        throttleTime?: number;
    }): void;
    replicate(config: ReplicatorConfig): (data: ChangeData) => void;
    stopReplicating(receiverFunction: (data: ChangeData) => void): void;
    stopAllReplication(): void;
}
