import React from 'react';
import ReactDOM from 'react-dom';
import NotionFilter from './NotionFilter';

ReactDOM.render(
  <React.StrictMode>
    <NotionFilter schema_info={[["checkbox", "checkbox", "Is Done"]]} />
  </React.StrictMode>,
  document.getElementById('root')
);