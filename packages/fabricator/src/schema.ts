import { NonExistentSchemaUnitTypeError, SchemaDuplicatePropertyNameError } from "@nishans/errors";
import { createShortId } from "@nishans/idz";
import { GenerateNotionFormulaAST, generateSchemaMapFromCollectionSchema, ISchemaMap } from "@nishans/notion-formula";
import { Schema } from "@nishans/types";
import { ParentCollectionData, TSchemaUnitInput } from ".";
import { FabricatorProps } from "../types";
import { CreateSchemaUnit } from "./SchemaUnit";
/**
 * Generates a full schema from a passed input schema
 * @param input_schema_units The input schemas
 * @param collection_data The object containing data used to send request, cache response for specific schema unit types
 * @returns Tuple of the constructed schema and schema map
 */
export async function schema(input_schema_units: TSchemaUnitInput[], options: Omit<ParentCollectionData, "parent_relation_schema_unit_id"> & {current_schema?: Schema} & FabricatorProps){
  // const schema_unit_list = CreateMaps.schema_unit();
  // Construct the schema map, which will be used to obtain property references used in formula and rollup types
  const schema: Schema = options.current_schema ?? {}, schema_map = generateSchemaMapFromCollectionSchema(schema);
  console.log(schema);
  // Iterate through each input schema units
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
      throw new SchemaDuplicatePropertyNameError(name);

    // For specific schema unit type, the corresponding schema unit has to be generated using specific functions 
    switch(input_schema_unit.type){
      case "formula":
        schema[schema_id] = {...input_schema_unit, formula: GenerateNotionFormulaAST[input_schema_unit.formula[1]](input_schema_unit.formula[0] as any, schema_map)};
        break;
      case "rollup":
        schema[schema_id] = await CreateSchemaUnit.rollup(input_schema_unit, schema_map, options);
        break;
      case "relation":
        schema[schema_id] = await CreateSchemaUnit.relation(input_schema_unit, {...options, parent_relation_schema_unit_id: schema_id});
        break;
      default:
        schema[schema_id] = input_schema_unit;
    }
    // Set the schema unit in the schema map
    schema_map.set(name,  {...schema[schema_id], schema_id});

    /* schema_unit_map[input_schema_unit.type].set(schema_id, new SchemaUnit({ schema_id, ...options, id: options.parent_collection_id }) as any);
    schema_unit_map[input_schema_unit.type].set(input_schema_unit.name, new SchemaUnit({ schema_id, ...options, id: options.parent_collection_id }) as any); */
  }
  // If title doesn't exist in the schema throw an error
  if(!schema["title"])
    throw new NonExistentSchemaUnitTypeError(["title"])
  return [schema, schema_map] as [Schema, ISchemaMap];
}