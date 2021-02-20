import { ViewFormatProperties } from "@nishans/types";
import { ISchemaMapValue, TViewSchemaUnitsCreateInput } from "../../../../types";

export function populateViewProperties(schema_map_unit: Pick<ISchemaMapValue, "schema_id">, format?: TViewSchemaUnitsCreateInput["format"]){
  const property: ViewFormatProperties = {
    property: schema_map_unit.schema_id,
    visible: true,
    width: 250
  };
  if (typeof format === "boolean") property.visible = format;
  else if (typeof format === "number") property.width = format;
  else if (Array.isArray(format)) {
    property.width = format[1] ?? 250
    property.visible = format[0] ?? true;
  }

  return property;
}