import { singleton } from './index';

export default function withMutastateCreator(React, { useProxy = false, agentName = 'agent' } = {}) {
  return function withMutastate(WrappedComponent, mutastateInstance = singleton()) {
    return class extends React.Component {
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
        return React.createElement(WrappedComponent, { data: this.agent.data, [agentName]: this.agent, ...this.props }, null);
      }
    };
  }
}

