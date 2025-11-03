export type SaveCallbackFunc = (key: string, value: any) => boolean;
export type LoadCallbackFunc = (key: string) => any;
export type AgentCallback = (data: any) => void;
export type TransformFunc<T = any, R = any> = (value: T) => R;
export type BatchFunc = () => void;
export type KeyType = string | string[];
export type SetOptionType = { notify?: boolean };

// Used to allow the 'this' type to be accepted where a string is expected
export interface BatchType {
  // This interface exists to allow passing 'this' as batch value
  toString(): string;
}

export type ListenOptions<T = any> = {
  callback: AgentCallback;
  alias?: string | string[];
  batch?: string | any; // Allow batch to be either a string or an object (BaseAgent instance)
  transform?: TransformFunc<T>;
  defaultValue?: T;
  noChildUpdates?: boolean;
  noParentUpdates?: boolean;
  initialLoad?: boolean;
};

export type MultiListenerInput = 
  | string[] 
  | Array<{ 
      key: KeyType; 
      alias?: string; 
      defaultValue?: any; 
      transform?: TransformFunc;
    }>;

export type MutastateInitializer = {
  shards?: string[];
  save?: SaveCallbackFunc;
  load?: LoadCallbackFunc;
};

export type ListenerData = {
  listener: ListenOptions;
  key: string[];
  type: 'change' | 'delete';
  defaultValue?: any;
};

export type NotifyData = {
  alias?: string | string[];
  callback: AgentCallback;
  key: string[];
  value: any;
};

export type ChangeData = {
  key: string[];
  value: any;
  meta?: {
    defaultValue?: boolean;
    [key: string]: any;
  };
};

export type ReplicatorConfig = {
  send: (data: ChangeData) => void;
  primary?: boolean;
  ignore?: string[];
  sendInitial?: boolean;
  canSetEverything?: boolean;
};

export type Replicator = {
  send: (data: ChangeData) => void;
  primary?: boolean;
  ignore?: string[];
  id: number;
  ignores: Record<string, any>;
  ignoreEverything: boolean;
  changeHook?: (data: ChangeData) => boolean;
  receiver?: (data: ChangeData) => void;
};

export type ListenerObject = {
  subkeys?: Record<string, ListenerObject>;
  listeners?: ListenOptions[];
};