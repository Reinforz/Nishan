import { Schema, TView, ViewFormatProperties } from "@nishans/types";
import { getSchemaUnit, ISchemaFormatMap } from "../";

/**
 * Populates and returns an format properties map
 * @param data view data
 * @param schema Schema used to check for property reference and get schema_unit
 */
export function properties(data: TView, schema: Schema){
  const format_properties_map: ISchemaFormatMap = new Map(), format_properties = (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[];
  // iterates through each of the format properties to populate the map
  format_properties.forEach((format_property, index) => {
    // get the referenced schema unit based on the property
    const schema_unit = getSchemaUnit(schema, format_property.property, ["query2", "format", `${data.type}_properties`, index.toString()]);
    // Set the aggregation map value using the schema unit name as key, and attaching the schema_id in the value 
    format_properties_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: format_property.property,
      format: format_property
    })
  })
  return [format_properties_map, format_properties] as const;
}