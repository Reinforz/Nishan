import React from 'react';
import ReactDOM from 'react-dom';
import NotionFilter from './NotionFilter';

ReactDOM.render(
  <NotionFilter schema_info={[["checkbox", "checkbox", "Is Done"]]} />,
  document.getElementById('root')
);