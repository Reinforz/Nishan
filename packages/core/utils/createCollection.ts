import { ICache, syncRecordValues } from "@nishans/endpoints";
import { generateFormulaAST, ISchemaMap } from "@nishans/notion-formula";
import { ICollection, IOperation, RelationSchemaUnit, Schema, SyncRecordValues, SyncRecordValuesParams, TTextFormat } from "@nishans/types";
import { getSchemaMap } from "../src";
import { ICollectionBlockInput, ITView, Logger, NishanArg, TRelationSchemaUnitInput } from "../types";
import { createShortId, createViews, Operation, generateId } from "../utils";

interface ParentCollectionData {
  id: string
  name: TTextFormat
  token: string
  logger?: Logger,
  stack: IOperation[],
  cache: Pick<ICache, "collection">,
  parent_relation_schema_unit_id: string
}

export async function generateRelationSchema(input_schema: TRelationSchemaUnitInput, collection_data: ParentCollectionData): Promise<RelationSchemaUnit>{
  const {parent_relation_schema_unit_id, id: parent_collection_id, name: parent_collection_name, token, logger, cache, stack} = collection_data, child_relation_schema_unit_id = createShortId();
  const {relation_schema_unit_name, collection_id: child_collection_id} = input_schema; 
  let child_collection = cache.collection.get(child_collection_id);
  if(!child_collection){
    const sync_record_values_param: SyncRecordValuesParams = {
      requests: [{
        table: "collection",
        id: child_collection_id,
        version: 0
      }]
    };

    const {recordMap} = await syncRecordValues(sync_record_values_param, {
      token,
      interval: 0
    });
    
    child_collection = {
      ...recordMap.collection[child_collection_id].value
    };

    cache.collection.set(child_collection_id, child_collection);
    logger && logger("READ", "collection", child_collection_id);
  }

  const relation_schema_unit: RelationSchemaUnit = {
    type: "relation",
    property: child_relation_schema_unit_id,
    name: input_schema.name,
    collection_id: child_collection.id
  };

  if(child_collection){
    const child_collection_relation_schema_unit_name = relation_schema_unit_name ?? `Related to ${parent_collection_name[0][0]} (${input_schema.name})`;
    const child_collection_relation_schema_unit: RelationSchemaUnit = {
      type: "relation",
      collection_id: parent_collection_id,
      name: child_collection_relation_schema_unit_name,
      property: parent_relation_schema_unit_id
    };
    child_collection.schema[child_relation_schema_unit_id] = child_collection_relation_schema_unit;
    if(relation_schema_unit_name){
      stack.push(Operation.collection.update(child_collection_id, ["schema", child_relation_schema_unit_id], {
        ...child_collection_relation_schema_unit,
        name: [[child_collection_relation_schema_unit_name]],
      }))
    }
  };
  
  return relation_schema_unit;
}

export async function generateSchema(input_schemas: ICollectionBlockInput["schema"], collection_data: Omit<ParentCollectionData, "parent_relation_schema_unit_id">){
  const schema_map: ISchemaMap = new Map(), schema: Schema = {}
  // Generate the schema first since formula will need the whole schema_map
  for (let index = 0; index < input_schemas.length; index++) {
    const input_schema = input_schemas[index], 
      {type, name} = input_schema,
      schema_id = type === "title" ? "title" : createShortId();
    const schema_map_unit = schema_map.get(name);
    if(schema_map_unit)
      throw new Error(`Duplicate property ${name}`);

    if(input_schema.type === "formula")
      schema[schema_id] = {...input_schema, formula: generateFormulaAST(input_schema.formula[0] as any, input_schema.formula[1] as any, schema_map)};
    else if(input_schema.type === "relation")
      schema[schema_id] = await generateRelationSchema(input_schema, {...collection_data, parent_relation_schema_unit_id: schema_id})
    else schema[schema_id] = input_schema;
    schema_map.set(name,  {...schema[schema_id], schema_id})
  }

  if(!schema["title"])
    throw new Error(`Schema must contain title type property`)
  return [schema, schema_map] as [Schema, ISchemaMap];
}

export async function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  const collection_id = generateId(param.collection_id);
  const [schema] = await generateSchema(param.schema, {id: collection_id, name: param.name, token: props.token, stack: props.stack, cache: props.cache})
  const collection_data: ICollection = {
    id: collection_id,
    schema,
    cover: param.cover ?? "",
    icon: param.icon ?? "",
    parent_id,
    parent_table: 'block',
    alive: true,
    name: param.name,
    migrated: false, version: 0
  };

  const [view_ids, view_map] = createViews(collection_data, param.views, props);
  
  props.stack.push(Operation.collection.update(collection_id, [], JSON.parse(JSON.stringify(collection_data))))
  props.cache.collection.set(collection_id, JSON.parse(JSON.stringify(collection_data)));
  props.logger && props.logger("CREATE", "collection", collection_id);

  return [collection_id, view_ids, view_map] as [string, string[], ITView]
}