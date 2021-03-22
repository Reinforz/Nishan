import { NotionInit } from "@nishans/init";
import { ISchemaSortsMap, Schema, TView } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";

/**
 * Populates and returns an sort map
 * @param data view data
 * @param schema Schema used to check for property reference and get schema_unit
 */
export function sorts(data: TView, schema: Schema){
  const sorts_map: ISchemaSortsMap = new Map(), sorts = NotionInit.View.sort(data);
  // Go through each of the sorts and add it to the sort map
  sorts.forEach((sort, index) => {
    // get the referenced schema unit based on the property
    const schema_unit = NotionUtils.getSchemaUnit(schema, sort.property, ["query2", "sort", index.toString()]);
    // Set the sort map value using the schema unit name as key, and attaching the schema_id in the value
    sorts_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: sort.property,
      sort
    })
  });

  return [sorts_map, sorts] as const;
}