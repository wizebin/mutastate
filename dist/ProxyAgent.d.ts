import MutastateAgent from './MutastateAgent';
import Mutastate from './Mutastate';
import { AgentCallback, KeyType, ListenOptions, TransformFunc } from './types';
export default class ProxyAgent extends MutastateAgent {
    private handler;
    private agentProxy;
    constructor(mutastate: Mutastate, onChange?: AgentCallback);
    resolveKey(key: KeyType): string[];
    listen<T = any>(key: KeyType, options?: Partial<ListenOptions<T>>): Record<string, any>;
    translate<T = any, R = any>(inputKey: KeyType, outputKey: KeyType, translationFunction: TransformFunc<T, R>, { killOnCleanup, throttleTime }?: {
        killOnCleanup?: boolean;
        throttleTime?: number;
    }): void;
}
