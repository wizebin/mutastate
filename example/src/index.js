import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeSingleton, getLocalStorageLoadFunc, getLocalStorageSaveFunc } from 'mutastate';

initializeSingleton({
  shards: [ // anything not in this list will not be persisted
    'permanent',
  ],
  save: getLocalStorageSaveFunc(),
  load: getLocalStorageLoadFunc(),
}).then(() => {
  ReactDOM.render(<App id={1} />, document.getElementById('root'));
});
