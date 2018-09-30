import { singleton } from './index';

export default function withMutastateCreator(React) {
  return function withMutastate(WrappedComponent, mutastateInstance = singleton) {
    return class extends Component {
      constructor(props) {
        super(props);
        this.agent = mutastateInstance.getAgent(this.changeState);
        this.state = {};
      }

      changeState = () => this.setState(this.state);

      componentWillUnmount() {
        return this.agent.cleanup();
      }

      render() {
        return React.createElement(WrappedComponent, { data: this.agent.data, nexus: this.agent, ...this.props }, null);
      }
    };
  }
}

