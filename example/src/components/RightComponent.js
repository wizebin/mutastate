import React from 'react';
import { useMutastate } from 'mutastate';
import styleClass from './Component.module.css';

export default function RightComponent(props) {
  const [left, setLeft] = useMutastate('left');
  const [right, setRight] = useMutastate('right');

  return (
    <div className={styleClass.segment}>
      <h2>My Value</h2>
      <textarea value={right} onChange={event => setRight(event.target.value)}/>
      <p>Other Side</p>
      <textarea value={left} onChange={event => setLeft(event.target.value)}/>
    </div>
  );
}
