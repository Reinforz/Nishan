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
    "type": "formula",
    "name": "Formula",
    "formula": {
      "type": "property",
      "result_type": "text",
      "name": "Column 9",
      "id": "gnUs"
    }
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
    options: [
      {
        color: "red",
        id: "2f25da32-7e8e-4c3c-bc79-a8582d0f869f",
        value: "123",
      }
    ]
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
  } as any,
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
    "name": "Tags",
    "type": "multi_select",
    options: [
      {
        color: "red",
        id: "2f25da32-7e8e-4c3c-bc79-a8582d0f869f",
        value: "red"
      },
      {
        color: "green",
        id: "2f25da32-7e8e-4c3c-bc79-a8582d0f869f",
        value: "green"
      }
    ]
  },
  "title": {
    "name": "Title",
    "type": "title"
  }
};

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