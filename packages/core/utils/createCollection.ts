import { Schema, TSchemaUnit } from "@nishans/types";
import { ICollectionBlockInput, ITView, NishanArg } from "../types";
import { parseFormula, createViews, Operation, generateId } from "../utils";
import { slugify } from "./slugify";

export function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  const schema: Schema = {}, collection_id = generateId(param.collection_id), schema_map: Map<string, TSchemaUnit & {schema_id: string}> = new Map();

  param.schema.forEach(opt => {
    const schema_id = slugify(opt.type === "title" ? "Title" : opt.name);
    schema[schema_id] = opt as any;
    const schema_map_value = {...opt, schema_id} as any
    schema_map.set(opt.name,  schema_map_value)
    schema_map.set(schema_id, schema_map_value)
  });

  Object.entries(schema).forEach(([schema_id, schema_unit])=>{
    if(schema_unit.type === "formula") schema_unit.formula = parseFormula(schema_unit.formula as any, schema_map);
    else if(schema_unit.type === "relation"){
      const collection = props.cache.collection.get(schema_unit.collection_id);
      if(collection)
        collection.schema[schema_unit.property] = {
          type: "relation",
          collection_id,
          name: `Related to ${param.properties.title} (${schema_unit.name})`,
          property: schema_id
        }
    }
  })

  const [view_ids, view_map] = createViews(schema, param.views, collection_id, parent_id, props);
  const collection_data = {
    id: collection_id,
    schema,
    format: {
      collection_page_properties: []
    },
    cover: param?.format?.page_cover ?? "",
    icon: param?.format?.page_icon ?? "",
    parent_id,
    parent_table: 'block',
    alive: true,
    name: param.properties.title,
    migrated: false, version: 0
  } as const;
  props.stack.push(Operation.collection.update(collection_id, [], collection_data))
  props.cache.collection.set(collection_id, collection_data);
  props.logger && props.logger("CREATE", "collection", collection_id);

  return [collection_id, view_ids, view_map] as [string, string[], ITView]
}