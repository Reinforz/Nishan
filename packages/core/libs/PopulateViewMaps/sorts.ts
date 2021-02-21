import { UnknownPropertyReferenceError } from "@nishans/errors";
import { Schema, TView } from "@nishans/types";
import { initializeViewSorts } from "..";
import { ISchemaSortsMap } from "../../src";

/**
 * Populates and returns an sort map
 * @param data view data
 * @param schema Schema used to check for property reference and get schema_unit
 */
export function sorts(data: TView, schema: Schema){
  const sorts_map: ISchemaSortsMap = new Map(), sorts = initializeViewSorts(data);
  // Go through each of the sorts and add it to the sort map
  sorts.forEach((sort, index) => {
    // get the referenced schema unit based on the property
    const schema_unit = schema[sort.property];
    // If the referenced property doesn't exist in the schema throw an error
    if(!schema_unit)
      throw new UnknownPropertyReferenceError(sort.property, ["query2", "sort", index.toString()])
    // Set the sort map value using the schema unit name as key, and attaching the schema_id in the value
    sorts_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: sort.property,
      sort: sort.direction
    })
  });

  return [sorts_map, sorts] as const;
}