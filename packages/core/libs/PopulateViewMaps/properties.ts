import { UnknownPropertyReferenceError } from "@nishans/errors";
import { Schema, TView, ViewFormatProperties } from "@nishans/types";
import { ISchemaFormatMap } from "../../types";

export function properties(data: TView, schema: Schema){
  const format_properties_map: ISchemaFormatMap = new Map(), format_properties = (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[];
  format_properties.forEach((format_property, index) => {
    const schema_unit = schema[format_property.property];
    if(!schema_unit)
      throw new UnknownPropertyReferenceError(format_property.property, ["query2", "format", `${data.type}_properties`, index.toString()])
    format_properties_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: format_property.property,
      format: {
        width: format_property.width,
        visible: format_property.visible
      }
    })
  })
  return [format_properties_map, format_properties] as const;
}