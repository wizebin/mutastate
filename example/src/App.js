import React from 'react';
import Assignment from './Assignment';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Assignment id={0} />
        <Assignment id={1} />
        <Assignment id={2} />
        <Assignment id={3} />
        <Assignment id={0} />
        <Assignment id={1} />
        <Assignment id={2} />
        <Assignment id={3} />
        <Assignment id={4} />
      </div>
    );
  }
}
