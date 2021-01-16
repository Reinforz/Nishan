import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { Filters } from './features/filters/Filters';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Filters />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);