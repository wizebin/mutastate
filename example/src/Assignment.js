import React from 'react';
import { withMutastateCreator } from 'mutastate';

class Assignment extends React.Component {
  constructor(props) {
    super(props);
    props.agent.listen(['default', 'assignments', props.id], { alias: 'assignment', defaultValue: { name: 'john', count: 0, list: [] } });
  }
  render() {
    const { assignment } = this.props.data;

    return (
      <div>
        <div>{assignment.name}</div>
        <div>{assignment.count}</div>
        <div>{assignment.list.map(item => <div>{item}</div>)}</div>
        <button onClick={() => assignment.count += 1}>Add To Count</button>
        <button onClick={() => assignment.name = ['a', 'b', 'c'][Math.floor(Math.random() * 3)]}>Change Name</button>
        <button onClick={() => assignment.list.push('another')}>Add To List</button>
      </div>
    );
  }
}

export default withMutastateCreator(React, { useProxy: true })(Assignment);
