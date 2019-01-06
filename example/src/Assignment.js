import React from 'react';
import { withMutastateCreator } from 'mutastate';

const colors = ['#aaa', '#faa', '#afa', '#aaf', '#faf', '#aff', '#ffa'];
const names = ['billy', 'jerry', 'bobby', 'martha', 'beth', 'patricia'];

function randomNumber(ceiling = 10) {
  return Math.floor(Math.random() * ceiling);
}

function randomName() {
  return names[randomNumber(names.length)];
}

function randomColor() {
  return colors[randomNumber(colors.length)];
}

class Assignment extends React.Component {
  constructor(props) {
    super(props);
    props.agent.listen(['default', 'assignments', props.id], { alias: 'assignment', defaultValue: { name: randomName(), count: randomNumber(), list: [], color: randomColor() } });
  }
  render() {
    const { assignment } = this.props.data;

    return (
      <div className="assignment" style={{ backgroundColor: assignment.color }}>
        <div className="idrow">{this.props.id}</div>
        <div>{assignment.name}</div>
        <div>{assignment.count}</div>
        <div>{assignment.list.map(item => <div>{item}</div>)}</div>
        <div className="assignmentUi">
          <button onClick={() => assignment.count += randomNumber()}>Add To Count</button>
          <button onClick={() => assignment.name = randomName()}>Change Name</button>
          <button onClick={() => assignment.list.push(randomName())}>Add To List</button>
          <button onClick={() => assignment.color = randomColor()}>Change Color</button>
        </div>
      </div>
    );
  }
}

export default withMutastateCreator(React, { useProxy: true })(Assignment);
