import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import mutastate from 'mutastate';

mutastate.initialize({
  shards: [ // anything not in this list will not be persisted
    'default',
  ],
  save: () => {},
  load: () => ({}),
}).then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
