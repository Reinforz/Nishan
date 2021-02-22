import { ViewFormatProperties } from "@nishans/types";
import { ISchemaMapValue, TViewSchemaUnitsCreateInput } from "../../../../types";

/**
 * Populates the format properties
 * @param schema_id schema_id of the property referenced
 * @param format Format input for the property
 */
export function populateViewProperties(schema_id: ISchemaMapValue["schema_id"], format?: TViewSchemaUnitsCreateInput["format"]){
  // Create the default property object
  const property: ViewFormatProperties = {
    property: schema_id,
    visible: true,
    width: 250
  };
  // IF format is a boolean, its targeted towards changing the visibility
  if (typeof format === "boolean") property.visible = format;
  // IF format is a number, its targeted towards changing the width
  else if (typeof format === "number") property.width = format;
  // Else if its an tuple, the first one is for visibility and second one for the width 
  else if (Array.isArray(format)) {
    property.width = format[1] ?? 250
    property.visible = format[0] ?? true;
  }

  return property;
}