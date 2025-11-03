import singleton from './singleton';
import Mutastate from './Mutastate';
import { KeyType, MultiListenerInput } from './types';

let React: any;
try {
  React = require('react');
} catch (err) {
  const errorFunc = () => { throw new Error('REACT IS NOT AVAILABLE, WithMutastate IS NOT AVAILABLE WITHOUT REACT') };
  React = { Component: class Component {}, createElement: errorFunc };
}

type WithMutastateOptions<P = any> = {
  listeners?: ((props: P) => MultiListenerInput) | MultiListenerInput;
  listenersFlat?: boolean;
  globalState?: Mutastate;
};

export function withMutastateCreator<P = any, S = any>(options: WithMutastateOptions<P> = {}) {
  return function withMutastate(WrappedComponent: React.ComponentType<P>) {
    const { 
      listeners = [], 
      listenersFlat = false, 
      globalState = singleton() 
    } = options;
    
    class WithMutastate extends React.Component<P, S> {
      agent: any;
      state: any = {};

      constructor(props: P) {
        super(props);
        this.agent = globalState.getAgent(this.onMutastateChange.bind(this));
        this.updateListeners(props);
      }

      componentWillUnmount() {
        this.agent.cleanup();
      }

      componentDidUpdate(prevProps: P) {
        if (typeof listeners === 'function') {
          const nextListeners = listeners(this.props);
          const prevListeners = listeners(prevProps);
          if (JSON.stringify(nextListeners) !== JSON.stringify(prevListeners)) {
            this.updateListeners(this.props);
          }
        }
      }

      updateListeners(props: P) {
        const resolvedListeners = typeof listeners === 'function' ? listeners(props) : listeners;
        this.agent.multiListen(resolvedListeners, { flat: listenersFlat });
      }

      onMutastateChange(changes: Array<{ key: KeyType; value: any }>) {
        const newState: Record<string, any> = {};
        for (let change of changes) {
          if (typeof change.key === 'string') {
            newState[change.key] = change.value;
          }
        }
        this.setState(newState);
      }

      render() {
        return React.createElement(WrappedComponent, {
          ...this.props,
          ...this.state,
          mutastate: this.agent,
        });
      }
    }

    return WithMutastate;
  };
}

export const withMutastate = withMutastateCreator();