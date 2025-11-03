import BaseAgent from './BaseAgent';
import Mutastate from './Mutastate';
import { AgentCallback, KeyType, ListenOptions, MultiListenerInput, TransformFunc } from './types';
export default class MutastateAgent extends BaseAgent {
    batch: string | null;
    defaultValues: Record<string, any>;
    listeners: Record<string, ListenOptions>;
    transforms: Record<string, TransformFunc>;
    constructor(mutastate: Mutastate, onChange?: AgentCallback);
    resolveKey(key: KeyType): string[];
    registerTransform(keyStr: string, transform: TransformFunc): void;
    registerDefaultValue(keyStr: string, defaultValue: any): void;
    registerListener(keyStr: string, options: ListenOptions): void;
    mapAliasToKey(alias: string | string[], key: KeyType): void;
    listen<T = any>(key: KeyType, options?: Partial<ListenOptions<T>>): Record<string, any>;
    listenFlat<T = any>(key: KeyType, options?: Partial<ListenOptions<T>>): Record<string, any>;
    batchListen(childFunction: () => void): Record<string, any>;
    multiListen<T = any>(listeners: MultiListenerInput, config?: {
        flat?: boolean;
    }): Record<string, any>;
    cleanup(): void;
}
