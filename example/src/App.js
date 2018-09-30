import React from 'react';
import { withMutastate } from 'mutastate';

class Assignment extends React.Component {
  constructor(props) {
    super(props);
    // this.nexus.copy(['default', 'assignments', props.id], ['cache', 'assignments', props.id]); // for one time
    const defaultKey = ['default', 'assignments', props.id];
    const cacheKey = ['cache', 'assignments', props.id];

    this.nexus.proxy(defaultKey, cacheKey); // for future changes, only update changed values
    this.nexus.listen(cacheKey, { alias: 'assignment', defaultValue: { name: 'john' } });
  }
  render() {
    const { assignment } = this.props.data;

    return (
      <div>
        <div>{assignment.name}</div>
        <div>{assignment.count}</div>
        <div>{(assignment.list || []).length}</div>
        <button onClick={() => assignment.count + 1}>Add To Count</button>
        <button onClick={() => assignment.name = ['a', 'b', 'c'][Math.floor(Math.random() * 3)]}>Change Name</button>
        <button onClick={() => assignment.list.push('another')}>Add To List</button>
      </div>
    );
  }
}

export default withMutastate(Assignment);
