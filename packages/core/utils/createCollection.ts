import { ICache, syncRecordValues } from "@nishans/endpoints";
import { formulateResultTypeFromSchemaType, generateFormulaAST, ISchemaMap } from "@nishans/notion-formula";
import { ICollection, IOperation, RelationSchemaUnit, RollupSchemaUnit, Schema, SyncRecordValues, SyncRecordValuesParams, TTextFormat } from "@nishans/types";
import { getSchemaMap, UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "../src";
import { ICollectionBlockInput, IViewMap, Logger, NishanArg, TRelationSchemaUnitInput, TRollupSchemaUnitInput } from "../types";
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

/**
 * Generates a new relation schema by validating the input relation schema unit passed   
 * @param input_schema_unit The input relation schema
 * @param collection_data An object containing info used to make request, push to op stack and save to cache
 * @return The newly generated relation schema unit
 */
export async function generateRelationSchema(input_schema_unit: TRelationSchemaUnitInput, collection_data: ParentCollectionData): Promise<RelationSchemaUnit>{
  const {parent_relation_schema_unit_id, id: parent_collection_id, name: parent_collection_name, token, logger, cache, stack} = collection_data, child_relation_schema_unit_id = createShortId();
  const {relation_schema_unit_name, collection_id: child_collection_id} = input_schema_unit;
  // Get the child_collection from cache first
  let child_collection = cache.collection.get(child_collection_id);
  // If child collection doesnt exist in the cache passed, sent a api request to notion's db to get the data
  if(!child_collection){
    // Fetching only the collection data from notion's db, using the token provided
    const {recordMap} = await syncRecordValues({
      requests: [{
        table: "collection",
        id: child_collection_id,
        version: 0
      }]
    }, {
      token,
      interval: 0
    });

    // If the collection doesnot exist even in notion's db then its an invalid request, so throw an error 
    if(!recordMap.collection[child_collection_id].value)
      throw new Error(`Collection:${child_collection_id} doesnot exist`);
    
    // Replace the child_collection to the one obtained from the api request
    child_collection = recordMap.collection[child_collection_id].value

    // Set the new child_collection in the cache
    cache.collection.set(child_collection_id, child_collection);
  }
  // Log the event of reading the child collection
  logger && logger("READ", "collection", child_collection_id);

  // Construct the relation_schema_unit, its errorneous now, as it uses incorrect data passed from the input
  const relation_schema_unit: RelationSchemaUnit = {
    type: "relation",
    // The child collection relation schema unit that is related to this schema unit 
    property: child_relation_schema_unit_id,
    // The name of the parent collection schema unit
    name: input_schema_unit.name,
    // The child collection id
    collection_id: child_collection.id
  };

  // Constructing the name of the related column in the child collection
  const child_collection_relation_schema_unit_name = relation_schema_unit_name ?? `Related to ${parent_collection_name[0][0]} (${input_schema_unit.name})`;
  // construct the child collection relation schema unit that is stored in the cache
  const child_collection_relation_schema_unit: RelationSchemaUnit = {
    type: "relation",
    // The parent collection id
    collection_id: parent_collection_id,
    // The name of the child collection relation schema unit
    name: child_collection_relation_schema_unit_name,
    // The property of the parent collection this child collection is related to
    property: parent_relation_schema_unit_id
  };

  // Save the child collection relation schema unit to the cached child collection
  child_collection.schema[child_relation_schema_unit_id] = child_collection_relation_schema_unit;
  // If custom schema unit name is provided, an push an operation to the stack, that will change the name of the schema unit
  if(relation_schema_unit_name){
    stack.push(Operation.collection.update(child_collection_id, ["schema", child_relation_schema_unit_id], {
      ...child_collection_relation_schema_unit,
      // Using the new name provided
      name: [[relation_schema_unit_name]],
    }));
    // Log since a new operation is taking place
    logger && logger("UPDATE", "collection", child_collection_id)
  }
  // Return the constructed parent collection relation schema unit
  return relation_schema_unit;
}

/**
 * 
 * @param input_schema_unit The rollup schema unit input
 * @param schema_map The schema map used for resolving property reference
 * @param request_config The config object used to make reqest, validate and cache response
 * @return The newly constructed rollup schema unit
 */
export async function generateRollupSchema({aggregation, name, collection_id, relation_property, target_property}: TRollupSchemaUnitInput, schema_map: ISchemaMap, request_config: Omit<ParentCollectionData, "id" | "name" | "parent_relation_schema_unit_id" | "stack">){
  // Get the related schema unit from the passed schema map
  const relation_schema_unit = schema_map.get(relation_property);
  // If the passed schema map unit doesnot exist then throw a unknown property error
  if(!relation_schema_unit)
    throw new UnknownPropertyReferenceError(relation_property, ["relation_property"]);
  // If the schema unit is not of type relation, throw an error as well since only relation schema units can be used in rollup schema unit
  if(relation_schema_unit.type !== "relation")
    throw new UnsupportedPropertyTypeError(relation_property, ["relation_property"], relation_schema_unit.type, ["relation"]);
  // Get the info required for making the request and store in cache
  const {cache, token, logger} = request_config;
  // Get the target collection from the passed cache
  let target_collection = cache.collection.get(collection_id);
  // Construct the rollup schema unit 
  const rollup_schema_unit: RollupSchemaUnit = {
    // The related collection id
    collection_id,
    // The name of the related schema unit
    name,
    // The name of the related schema_unit 
    relation_property: relation_schema_unit.schema_id,
    type: "rollup",
    // The type of aggregation used in the schema_unit
    aggregation,
    // The name of the target schema_unit 
    target_property,
    // The return type of the target schema unit
    target_property_type: "title",
  };

  // If the target collection doesnot exist obtain it from notion's db
  if(!target_collection){
    // Construct the reqest params used to obtain the target collection
    const sync_record_values_param: SyncRecordValuesParams = {
      requests: [{
        table: "collection",
        id: collection_id,
        version: 0
      }]
    };

    // Get the record map from the response
    const {recordMap} = await syncRecordValues(sync_record_values_param, {
      token,
      interval: 0
    });

    // If the request responded with an empty value, throw an error warning the user that the collection doesnot exist 
    if(!recordMap.collection[collection_id].value)
      throw new Error(`Collection:${collection_id} doesnot exist`);
    // Set the returned value from the response
    target_collection = recordMap.collection[collection_id].value
    // Store the target collection value to the cache
    cache.collection.set(collection_id, target_collection);
  }

  // Log the collection read operation
  logger && logger("READ", "collection", target_collection.id);
  const target_collection_schema_map = getSchemaMap(target_collection.schema);
  // Get the target collection schema unit map from the target collection schema map using the passed target property
  const target_collection_schema_unit_map = target_collection_schema_map.get(target_property);
  // The target collection schema unit map doesnot exist throw an error
  if(!target_collection_schema_unit_map)
    throw new UnknownPropertyReferenceError(target_property, ["target_property"]);

  // Set the correct data to the previously constructed rollup schema unit
  rollup_schema_unit.target_property = target_collection_schema_unit_map.schema_id;
  rollup_schema_unit.target_property_type = 
    // If the target property is of type title keep title
    target_collection_schema_unit_map.type === "title" 
      ? "title" 
      // Else if its of type formula, use the formula's result_type
      : target_collection_schema_unit_map.type === 'formula'
        ? target_collection_schema_unit_map.formula.result_type
        // Else if its of type rollup
        : target_collection_schema_unit_map.type === 'rollup'
          // f the target property is of type title keep title
          ? target_collection_schema_unit_map.target_property_type === 'title'
            ? "title"
            // Else get it from the function
            : formulateResultTypeFromSchemaType(target_collection_schema_unit_map.target_property_type)
          : formulateResultTypeFromSchemaType(target_collection_schema_unit_map.type)

  // Return the constructed rollup schema unit
  return rollup_schema_unit;
}

/**
 * Generates a full schema from a passed input schema
 * @param input_schema_units The input schemas
 * @param collection_data The object containing data used to send request, cache response for specific schema unit types
 * @returns Tuple of the constructed schema and schema map
 */
export async function generateSchema(input_schema_units: ICollectionBlockInput["schema"], collection_data: Omit<ParentCollectionData, "parent_relation_schema_unit_id">){
  // Construct the schema map, which will be used to obtain property references used in formula and rollup types
  const schema_map: ISchemaMap = new Map(), schema: Schema = {};
  // Iterate through each input schmea units
  for (let index = 0; index < input_schema_units.length; index++) {
    const input_schema_unit = input_schema_units[index], 
      {type, name} = input_schema_unit,
      // Generate the schema id for the specific schema unit
      // If its title keep it as title, else generate a random 5 character short id
      schema_id = type === "title" ? "title" : createShortId();
    // Get the schema_map_unit from the schema_map
    const schema_map_unit = schema_map.get(name);
    // If it exists throw an error since duplicate schema_unit name is not allowed 
    if(schema_map_unit)
      throw new Error(`Duplicate property ${name}`);

    // For specific schema unit type, the corresponding schema unit has to be generated using specific functions 
    switch(input_schema_unit.type){
      case "formula":
        schema[schema_id] = {...input_schema_unit, formula: generateFormulaAST(input_schema_unit.formula[0] as any, input_schema_unit.formula[1] as any, schema_map)};
        break;
      case "rollup":
        schema[schema_id] = await generateRollupSchema(input_schema_unit, schema_map, collection_data);
        break;
      case "relation":
        schema[schema_id] = await generateRelationSchema(input_schema_unit, {...collection_data, parent_relation_schema_unit_id: schema_id});
        break;
      default:
        schema[schema_id] = input_schema_unit;
    }
    // Set the schema unit in the schema map
    schema_map.set(name,  {...schema[schema_id], schema_id})
  }
  // If title doesnt exist in the schema throw an error
  if(!schema["title"])
    throw new Error(`Schema must contain title type property`)
  return [schema, schema_map] as [Schema, ISchemaMap];
}

/**
 * Creates a collection from the input
 * @param param collection input
 * @param parent_id parent id of the collection 
 * @param props Data used to store to cache, ops stack, send request to get data
 * @returns a tuple of the collection_id, the generated view ids and the generated view map
 */
export async function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  // Generate the collection id
  const collection_id = generateId(param.collection_id);
  // Generate the schema to store in the collection
  const [schema] = await generateSchema(param.schema, {id: collection_id, name: param.name, token: props.token, stack: props.stack, cache: props.cache, logger: props.logger})
  // construct the collection to store it in cache and in op stack
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

  // Create the views of the collection
  const [view_ids, view_map] = createViews(collection_data, param.views, props);
  // Push the collection create operation to stack
  props.stack.push(Operation.collection.update(collection_id, [], JSON.parse(JSON.stringify(collection_data))))
  // Store the collection in cache
  props.cache.collection.set(collection_id, JSON.parse(JSON.stringify(collection_data)));
  // Log the collection creation
  props.logger && props.logger("CREATE", "collection", collection_id);

  return [collection_id, view_ids, view_map] as [string, string[], IViewMap]
}