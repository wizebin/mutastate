type SaveCallbackFunc = (string, any) => boolean;
type LoadCallbackFunc = (string) => any;
type AgentCallback = (any) => void;

type MutastateInitializer = {
    shards: string[],
    save: SaveCallbackFunc,
    load: LoadCallbackFunc,
}

class MutastateAgent {
    constructor(AgentCallback)
    listen(string, { alias: string })
}

export class Mutastate {
    constructor(MutastateInitializer)
    getAgent(): MutastateAgent;
}

export function singleton(): Mutastate;
