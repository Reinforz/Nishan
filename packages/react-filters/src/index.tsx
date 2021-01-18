import { Schema } from '@nishans/types';
import React from 'react';
import ReactDOM from 'react-dom';
import NotionFilter from './NotionFilter';

const schema: Schema = {
  ">bYY": {
    "name": "Column 4",
    "type": "person"
  },
  "AEpJ": {
    "name": "Column 3",
    "type": "date"
  },
  "ElAW": {
    "name": "Column 12",
    "type": "created_time"
  },
  "FnXC": {
    "type": "formula",
    "name": "Column 10",
    "formula": {
      "type": "property",
      "result_type": "text",
      "name": "Column 9",
      "id": "gnUs"
    }
  },
  "HlYN": {
    "name": "Column 13",
    "type": "created_by"
  },
  "J<d\\": {
    "name": "Column",
    "type": "text"
  },
  "Lk:`": {
    "name": "Column 15",
    "type": "last_edited_by"
  },
  "PXaf": {
    "name": "Column 2",
    "type": "select"
  },
  "R_:}": {
    "name": "Column 7",
    "type": "url"
  },
  "SJ={": {
    "name": "Column 14",
    "type": "last_edited_time"
  },
  "TAcF": {
    "name": "Column 1",
    "type": "number"
  },
  "]s]B": {
    "name": "Column 8",
    "type": "email"
  },
  "dVZL": {
    "name": "Column 11",
    "type": "rollup"
  },
  "gnUs": {
    "name": "Column 9",
    "type": "phone_number"
  },
  "pxjC": {
    "name": "Column 6",
    "type": "checkbox"
  },
  "xk;g": {
    "name": "Column 5",
    "type": "file"
  },
  "{TZF": {
    "name": "Tags",
    "type": "multi_select"
  },
  "title": {
    "name": "Name",
    "type": "title"
  }
} as any;

ReactDOM.render(
  <NotionFilter schema={schema} nestingLevel={3} default_group_operator={"or"} filters={{
    filters: [{
      property: "title",
      filter: {
        operator: "string_is",
        value: {
          value: "",
          type: "exact"
        }
      }
    }],
    operator: "and"
  }} />,
  document.getElementById('root')
);