import { NotionErrors } from "@nishans/errors";
import { NotionIdz } from "@nishans/idz";
import { NotionFormula } from "@nishans/notion-formula";
import { CollectionFormatPropertyVisibility, ICollection, ISchemaMapValue, Schema } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { ICollectionBlockInput, INotionFabricatorOptions, ParentCollectionData } from "../";
import { CreateSchemaUnit } from "./SchemaUnit";
/**
 * Generates a full schema from a passed input schema
 * @param input_schema_units The input schemas
 * @param collection_data The object containing data used to send request, cache response for specific schema unit types
 * @returns Tuple of the constructed schema and schema map
 */
export async function schema(input_schema_units: ICollectionBlockInput["schema"], data: Omit<ParentCollectionData, "parent_relation_schema_unit_id"> & {current_schema?: Schema}, options: Omit<INotionFabricatorOptions, "cache_init_tracker">, cb?: ((data: ISchemaMapValue)=>any)){
  // const schema_unit_list = CreateMaps.schema_unit();
  // Construct the schema map, which will be used to obtain property references used in formula and rollup types
  const collection_format: ICollection["format"] = { property_visibility: []}, schema: Schema = data.current_schema ?? {}, schema_map = NotionUtils.generateSchemaMap(schema);
  // Iterate through each input schema units
  for (let index = 0; index < input_schema_units.length; index++) {
    const input_schema_unit = input_schema_units[index], 
      {type, name, property_visibility} = input_schema_unit,
      // Generate the schema id for the specific schema unit
      // If its title keep it as title, else generate a random 5 character short id
      schema_id = type === "title" ? "title" : NotionIdz.Generate.shortId();
    // Get the schema_map_unit from the schema_map
    const schema_map_unit = schema_map.get(name);
    // If it exists throw an error since duplicate schema_unit name is not allowed 
    if(schema_map_unit)
      throw new NotionErrors.schema_duplicate_property_name(name);
    if(property_visibility) (collection_format.property_visibility as CollectionFormatPropertyVisibility[]).push({property: schema_id, visibility: property_visibility})
    // For specific schema unit type, the corresponding schema unit has to be generated using specific functions 
    switch(input_schema_unit.type){
      case "formula":
        schema[schema_id] = {...input_schema_unit, formula: NotionFormula.GenerateAST[input_schema_unit.formula[1]](input_schema_unit.formula[0] as any, schema_map)};
        break;
      case "rollup":
        schema[schema_id] = await CreateSchemaUnit.rollup(input_schema_unit, schema_map, options);
        break;
      case "relation":
        schema[schema_id] = (await CreateSchemaUnit.relation(input_schema_unit, {...data, parent_relation_schema_unit_id: schema_id}, options))[0];
        break;
      default:
        schema[schema_id] = input_schema_unit;
    }
    // Set the schema unit in the schema map
    schema_map.set(name,  {...schema[schema_id], schema_id});
    cb && await cb(schema_map.get(name) as ISchemaMapValue);
  }
  // If title doesn't exist in the schema throw an error
  if(!schema["title"])
    throw new NotionErrors.non_existent_schema_unit_type(["title"])
  return [schema, schema_map, collection_format] as const;
}