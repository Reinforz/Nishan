import { v4 as uuidv4 } from 'uuid';

import { CreateRootCollectionViewPageParams } from "../types/function";
import { Schema, } from "../types/types";

export default function (option: Partial<CreateRootCollectionViewPageParams>) {
  const { properties, format } = option;

  if (!option.views) option.views = [{
    aggregations: [
      ['title', 'count']
    ],
    name: 'Default View',
    type: 'table'
  }];

  if (!option.schema) option.schema = [
    ['Name', 'title']
  ];
  const schema: Schema = {};

  if (option.schema)
    option.schema.forEach(opt => {
      const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
      schema[schema_key] = {
        name: opt[0],
        type: opt[1],
        ...(opt[2] ?? {})
      };
      if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({
        id: uuidv4(),
        value,
        color
      }))
    });

  const views = (option.views && option.views.map((view) => ({
    ...view,
    id: uuidv4()
  }))) || [];

  return { schema, views, properties, format }
}