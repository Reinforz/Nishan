import { NotionCache } from "@nishans/cache";
import { createShortId } from "@nishans/idz";
import { NotionOperationsObject, Operation } from "@nishans/operations";
import { ICollection, RelationSchemaUnit } from "@nishans/types";
import { FabricatorProps } from "packages/fabricator/types";
import { ParentCollectionData, TRelationSchemaUnitInput } from "..";

/**
 * Generates a new relation schema by validating the input relation schema unit passed   
 * @param input_schema_unit The input relation schema
 * @param collection_data An object containing info used to make request, push to op stack and save to cache
 * @return The newly generated relation schema unit
 */
export async function relation(input_schema_unit: Omit<TRelationSchemaUnitInput, "type">, collection_data: ParentCollectionData, props: FabricatorProps): Promise<RelationSchemaUnit>{
  const {parent_relation_schema_unit_id, parent_collection_id, name: parent_collection_name} = collection_data, child_relation_schema_unit_id = createShortId();
  const {relation_schema_unit_name, collection_id: child_collection_id} = input_schema_unit;
  // Get the child_collection from cache first
  const child_collection = await NotionCache.fetchDataOrReturnCached<ICollection>('collection', child_collection_id, props);
  // Log the event of reading the child collection
  props.logger && props.logger("READ", "collection", child_collection_id);

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
    await NotionOperationsObject.executeOperations([Operation.collection.update(child_collection_id, ["schema", child_relation_schema_unit_id], {
      ...child_collection_relation_schema_unit,
      // Using the new name provided
      name: [[relation_schema_unit_name]],
    })], props);
    // Log since a new operation is taking place
    props.logger && props.logger("UPDATE", "collection", child_collection_id)
  }
  // Return the constructed parent collection relation schema unit
  return relation_schema_unit;
}