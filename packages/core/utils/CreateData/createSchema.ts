import { ICache } from "@nishans/cache";
import { Queries } from "@nishans/endpoints";
import { formulateResultTypeFromSchemaType, generateFormulaAST, ISchemaMap } from "@nishans/notion-formula";
import { Operation } from "@nishans/operations";
import { IOperation, RelationSchemaUnit, RollupSchemaUnit, Schema, SyncRecordValuesParams, TTextFormat } from "@nishans/types";
import { populateSchemaMap, SchemaUnit, UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "../../src";
import { ISchemaUnitMap, Logger, NishanArg, TRelationSchemaUnitInput, TRollupSchemaUnitInput, TSchemaUnitInput } from "../../types";
import { createSchemaUnitMap, createShortId } from "../../utils";

interface ParentCollectionData {
  parent_collection_id: string
  name: TTextFormat
  token: string
  logger?: Logger,
  stack: IOperation[],
  cache: ICache,
  parent_relation_schema_unit_id: string,
}

/**
 * Generates a new relation schema by validating the input relation schema unit passed   
 * @param input_schema_unit The input relation schema
 * @param collection_data An object containing info used to make request, push to op stack and save to cache
 * @return The newly generated relation schema unit
 */
export async function generateRelationSchema(input_schema_unit: TRelationSchemaUnitInput, collection_data: ParentCollectionData): Promise<RelationSchemaUnit>{
  const {parent_relation_schema_unit_id, parent_collection_id, name: parent_collection_name, token, logger, cache, stack} = collection_data, child_relation_schema_unit_id = createShortId();
  const {relation_schema_unit_name, collection_id: child_collection_id} = input_schema_unit;
  // Get the child_collection from cache first
  let child_collection = cache.collection.get(child_collection_id);
  // If child collection doesnt exist in the cache passed, sent a api request to notion's db to get the data
  if(!child_collection){
    // Fetching only the collection data from notion's db, using the token provided
    const {recordMap} = await Queries.syncRecordValues({
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
export async function generateRollupSchema({aggregation, name, collection_id, relation_property, target_property}: TRollupSchemaUnitInput, schema_map: ISchemaMap, request_config: Omit<ParentCollectionData, "parent_collection_id" | "name" | "parent_relation_schema_unit_id" | "stack">){
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
    const {recordMap} = await Queries.syncRecordValues(sync_record_values_param, {
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
  const target_collection_schema_map = populateSchemaMap(target_collection.schema);
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
export async function createSchema(input_schema_units: TSchemaUnitInput[], options: Omit<ParentCollectionData, "parent_relation_schema_unit_id"> & {current_schema?: Schema} & Omit<NishanArg, 'id'>){
  const schema_unit_map = createSchemaUnitMap();
  // Construct the schema map, which will be used to obtain property references used in formula and rollup types
  const schema: Schema = options.current_schema ?? {}, schema_map = populateSchemaMap(schema);
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
        schema[schema_id] = await generateRollupSchema(input_schema_unit, schema_map, options);
        break;
      case "relation":
        schema[schema_id] = await generateRelationSchema(input_schema_unit, {...options, parent_relation_schema_unit_id: schema_id});
        break;
      default:
        schema[schema_id] = input_schema_unit;
    }
    // Set the schema unit in the schema map
    schema_map.set(name,  {...schema[schema_id], schema_id});
    schema_unit_map[input_schema_unit.type].set(schema_id, new SchemaUnit({ schema_id, ...options, id: options.parent_collection_id }) as any);
    schema_unit_map[input_schema_unit.type].set(input_schema_unit.name, new SchemaUnit({ schema_id, ...options, id: options.parent_collection_id }) as any);
  }
  // If title doesnt exist in the schema throw an error
  if(!schema["title"])
    throw new Error(`Schema must contain title type property`)
  return [schema, schema_map, schema_unit_map] as [Schema, ISchemaMap, ISchemaUnitMap];
}