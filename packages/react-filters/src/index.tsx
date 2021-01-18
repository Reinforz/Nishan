import { Schema } from '@nishans/types';
import React from 'react';
import ReactDOM from 'react-dom';
import NotionFilter from './NotionFilter';

const schema: Schema = {
  ">bYY": {
    "name": "Person",
    "type": "person"
  },
  "AEpJ": {
    "name": "Date",
    "type": "date"
  },
  "ElAW": {
    "name": "Created Time",
    "type": "created_time"
  },
  "FnXC": {
    "name": "Formula",
    "type": "formula",
  },
  "HlYN": {
    "name": "Created By",
    "type": "created_by"
  },
  "J<d\\": {
    "name": "Text",
    "type": "text"
  },
  "Lk:`": {
    "name": "Last Edited By",
    "type": "last_edited_by"
  },
  "PXaf": {
    "name": "Select",
    "type": "select",
  },
  "R_:}": {
    "name": "Url",
    "type": "url"
  },
  "SJ={": {
    "name": "Last Edited Time",
    "type": "last_edited_time"
  },
  "TAcF": {
    "name": "Number",
    "type": "number"
  },
  "]s]B": {
    "name": "Email",
    "type": "email"
  },
  "dVZL": {
    "name": "Rollup",
    "type": "rollup"
  },
  "gnUs": {
    "name": "Phone",
    "type": "phone_number"
  },
  "pxjC": {
    "name": "Checkbox",
    "type": "checkbox"
  },
  "xk;g": {
    "name": "File",
    "type": "file"
  },
  "{TZF": {
    "name": "Multi Select",
    "type": "multi_select"
  },
  "title": {
    "name": "Title",
    "type": "title"
  }
} as any;

ReactDOM.render(
  <NotionFilter schema={schema} />,
  document.getElementById('root')
);