import { generateFormulaAST, ISchemaMap } from "@nishans/notion-formula";
import { Schema } from "@nishans/types";
import { ICollectionBlockInput, ITView, NishanArg } from "../types";
import { createViews, Operation, generateId } from "../utils";
import { slugify } from "./slugify";

export function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  const schema: Schema = {}, collection_id = generateId(param.collection_id), schema_map: ISchemaMap = new Map();

  // Generate the schema first since formula will need the whole schema_map
  param.schema.forEach(opt => {
    const schema_id = slugify(opt.type === "title" ? "Title" : opt.name);
    if(opt.type === "formula"){
      const parsed_formula = generateFormulaAST(opt.formula[0] as any, opt.formula[1] as any, schema_map)
      schema[schema_id] = {...opt, formula: parsed_formula};
    } else if(opt.type === "relation"){
      const collection = props.cache.collection.get(opt.collection_id);
      if(collection)
        collection.schema[opt.property] = {
          type: "relation",
          collection_id,
          name: `Related to ${param.properties.title} (${opt.name})`,
          property: schema_id
        }
      schema[schema_id] = opt;
    }
    else schema[schema_id] = opt;
    schema_map.set(opt.name,  {...schema[schema_id], schema_id})
  });

  const [view_ids, view_map] = createViews(schema, param.views, collection_id, parent_id, props);
  const collection_data = {
    id: collection_id,
    schema,
    format: {
      collection_page_properties: []
    },
    cover: param?.cover ?? "",
    icon: param?.icon ?? "",
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