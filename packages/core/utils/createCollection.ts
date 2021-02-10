import { ICache, syncRecordValues } from "@nishans/endpoints";
import { formulateResultTypeFromSchemaType, generateFormulaAST, ISchemaMap } from "@nishans/notion-formula";
import { ICollection, IOperation, RelationSchemaUnit, RollupSchemaUnit, Schema, SyncRecordValues, SyncRecordValuesParams, TTextFormat } from "@nishans/types";
import { getSchemaMap, UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "../src";
import { ICollectionBlockInput, ITView, Logger, NishanArg, TRelationSchemaUnitInput, TRollupSchemaUnitInput } from "../types";
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

    if(!recordMap.collection[child_collection_id].value)
      throw new Error(`Collection:${child_collection_id} doesnot exist`);
    
    child_collection = {
      ...recordMap.collection[child_collection_id].value
    };

    cache.collection.set(child_collection_id, child_collection);
  }
  logger && logger("READ", "collection", child_collection_id);
  const relation_schema_unit: RelationSchemaUnit = {
    type: "relation",
    property: child_relation_schema_unit_id,
    name: input_schema.name,
    collection_id: child_collection.id
  };

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
    }));
    logger && logger("UPDATE", "collection", child_collection_id)
  }
  
  return relation_schema_unit;
}

export async function generateRollupSchema({aggregation, name, collection_id, relation_property, target_property}: TRollupSchemaUnitInput, schema_map: ISchemaMap, request_config: Omit<ParentCollectionData, "id" | "name" | "parent_relation_schema_unit_id" | "stack">){
  const relation_schema_unit = schema_map.get(relation_property);
  if(!relation_schema_unit)
    throw new UnknownPropertyReferenceError(relation_property, ["relation_property"]);
  if(relation_schema_unit.type !== "relation")
    throw new UnsupportedPropertyTypeError(relation_property, ["relation_property"], relation_schema_unit.type, ["relation"])
  const {cache, token, logger} = request_config;
  let target_collection = cache.collection.get(collection_id);
  const rollup_schema_unit: RollupSchemaUnit = {
    collection_id,
    name,
    relation_property: relation_schema_unit.schema_id,
    type: "rollup",
    aggregation,
    target_property,
    target_property_type: "title",
  };

  if(!target_collection){
    const sync_record_values_param: SyncRecordValuesParams = {
      requests: [{
        table: "collection",
        id: collection_id,
        version: 0
      }]
    };

    const {recordMap} = await syncRecordValues(sync_record_values_param, {
      token,
      interval: 0
    });

    if(!recordMap.collection[collection_id].value)
      throw new Error(`Collection:${collection_id} doesnot exist`);
    
    target_collection = recordMap.collection[collection_id].value
    cache.collection.set(collection_id, target_collection);
  }

  logger && logger("READ", "collection", target_collection.id);
  const target_collection_schema_map = getSchemaMap(target_collection.schema);
  const target_collection_schema_unit_map = target_collection_schema_map.get(target_property);
  if(!target_collection_schema_unit_map)
    throw new UnknownPropertyReferenceError(target_property, ["target_property"]);
    rollup_schema_unit.target_property = target_collection_schema_unit_map.schema_id;
    rollup_schema_unit.target_property_type = 
      target_collection_schema_unit_map.type === "title" 
        ? "title" 
        : target_collection_schema_unit_map.type === 'formula'
          ? target_collection_schema_unit_map.formula.result_type
          : target_collection_schema_unit_map.type === 'rollup' 
            ? target_collection_schema_unit_map.target_property_type === 'title'
              ? "title"
              : formulateResultTypeFromSchemaType(target_collection_schema_unit_map.target_property_type)
            : formulateResultTypeFromSchemaType(target_collection_schema_unit_map.type)

  return rollup_schema_unit;
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
      schema[schema_id] = await generateRelationSchema(input_schema, {...collection_data, parent_relation_schema_unit_id: schema_id});
    else if(input_schema.type === "rollup")
      schema[schema_id] = await generateRollupSchema(input_schema, schema_map, collection_data);
    else schema[schema_id] = input_schema;
    schema_map.set(name,  {...schema[schema_id], schema_id})
  }

  if(!schema["title"])
    throw new Error(`Schema must contain title type property`)
  return [schema, schema_map] as [Schema, ISchemaMap];
}

export async function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  const collection_id = generateId(param.collection_id);
  const [schema] = await generateSchema(param.schema, {id: collection_id, name: param.name, token: props.token, stack: props.stack, cache: props.cache, logger: props.logger})
  const collection_data: ICollection = {
    id: collection_id,
    schema,
    cover: param.cover,
    icon: param.icon,
    parent_id,
    parent_table: 'block',
    alive: true,
    name: param.name,
    migrated: false, 
    version: 0
  };

  const [view_ids, view_map] = createViews(collection_data, param.views, props);
  
  props.stack.push(Operation.collection.update(collection_id, [], JSON.parse(JSON.stringify(collection_data))))
  props.cache.collection.set(collection_id, JSON.parse(JSON.stringify(collection_data)));
  props.logger && props.logger("CREATE", "collection", collection_id);

  return [collection_id, view_ids, view_map] as [string, string[], ITView]
}