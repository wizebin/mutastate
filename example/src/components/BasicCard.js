import React from 'react';
import styleClass from './BasicCard.module.css';

export default function BasicCard(props) {
  return (
    <div {...props} className={styleClass.basicCard}>{props.children}</div>
  );
}
