import { Queries } from "@nishans/endpoints";
import { NonExistentDataError } from "@nishans/errors";
import { createShortId } from "@nishans/idz";
import { Operation } from "@nishans/operations";
import { RelationSchemaUnit } from "@nishans/types";
import { TRelationSchemaUnitInput } from "../../../types";
import { ParentCollectionData } from "../types";

/**
 * Generates a new relation schema by validating the input relation schema unit passed   
 * @param input_schema_unit The input relation schema
 * @param collection_data An object containing info used to make request, push to op stack and save to cache
 * @return The newly generated relation schema unit
 */
export async function relation(input_schema_unit: TRelationSchemaUnitInput, collection_data: ParentCollectionData): Promise<RelationSchemaUnit>{
  const {parent_relation_schema_unit_id, parent_collection_id, name: parent_collection_name, token, logger, cache, stack} = collection_data, child_relation_schema_unit_id = createShortId();
  const {relation_schema_unit_name, collection_id: child_collection_id} = input_schema_unit;
  // Get the child_collection from cache first
  let child_collection = cache.collection.get(child_collection_id);
  // If child collection doesn't exist in the cache passed, sent a api request to notion's db to get the data
  if(!child_collection){
    // * Use fetch and cache data from NotionCacheObject
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

    // If the collection doesn't exist even in notion's db then its an invalid request, so throw an error 
    if(!recordMap.collection[child_collection_id].value)
      throw new NonExistentDataError('collection', child_collection_id)
    
    // Replace the child_collection to the one obtained from the api request
    child_collection = recordMap.collection[child_collection_id].value

    // Set the new child_collection in the cache
    cache.collection.set(child_collection_id, child_collection);
  }
  // Log the event of reading the child collection
  logger && logger("READ", "collection", child_collection_id);

  // Construct the relation_schema_unit, its erroneous now, as it uses incorrect data passed from the input
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