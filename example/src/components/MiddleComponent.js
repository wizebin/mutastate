import React from 'react';
import { useMutastate } from 'mutastate';
import styleClass from './Component.module.css';
import { swapLeftAndRight, mixLeftAndRight } from '../data/swaps';

export default function MiddleComponent(props) {
  const [left, setLeft] = useMutastate('left');
  const [right, setRight] = useMutastate('right');

  return (
    <div className={styleClass.segment}>
     <button onClick={swapLeftAndRight}>Swappies</button>
      <div style={{ height: 20 }}></div>
      <button onClick={mixLeftAndRight}>Mixies</button>
    </div>
  );
}
