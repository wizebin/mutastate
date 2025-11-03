import Mutastate from './Mutastate';
import { KeyType, MultiListenerInput } from './types';
type WithMutastateOptions<P = any> = {
    listeners?: ((props: P) => MultiListenerInput) | MultiListenerInput;
    listenersFlat?: boolean;
    globalState?: Mutastate;
};
export declare function withMutastateCreator<P = any, S = any>(options?: WithMutastateOptions<P>): (WrappedComponent: any) => {
    new (props: P): {
        [x: string]: any;
        agent: any;
        state: any;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: P): void;
        updateListeners(props: P): void;
        onMutastateChange(changes: Array<{
            key: KeyType;
            value: any;
        }>): void;
        render(): any;
    };
    [x: string]: any;
};
export declare const withMutastate: (WrappedComponent: any) => {
    new (props: any): {
        [x: string]: any;
        agent: any;
        state: any;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: any): void;
        updateListeners(props: any): void;
        onMutastateChange(changes: {
            key: KeyType;
            value: any;
        }[]): void;
        render(): any;
    };
    [x: string]: any;
};
export {};
