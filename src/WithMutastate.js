import singleton from './singleton';

export function withMutastateCreator(React, { instance = singleton(), useProxy = false, agentName = 'agent' } = {}) {
  return function withMutastate(WrappedComponent, mutastateInstance = instance) {
    const ToForward = class extends React.Component {
      constructor(props) {
        super(props);
        this.agent = useProxy ? mutastateInstance.getProxyAgent(this.changeState) : mutastateInstance.getAgent(this.changeState);
        this.state = {};
      }

      changeState = () => this.setState(this.state);

      componentWillUnmount() {
        return this.agent.cleanup();
      }

      render() {
        const { forwardedRef, ...rest } = this.props;

        return React.createElement(WrappedComponent, { data: this.agent.data, [agentName]: this.agent, ref: forwardedRef, ...rest, }, this.props.children);
      }
    };

    return React.forwardRef((props, ref) => {
      return React.createElement(ToForward, { ...props, forwardedRef: ref });
    });
  };
}

let React;
try {
  React = require('react');
} catch (err) {
  const errorFunc = () => { throw new Error('REACT IS NOT AVAILABLE, withMutastate IS NOT AVAILABLE WITHOUT REACT') };
  React = { useState: errorFunc, useEffect: errorFunc, useRef: errorFunc };
}

const withMutastate = withMutastateCreator(React);

export { withMutastate };
