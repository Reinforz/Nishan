import { ITableViewFormat } from "@nishans/types";
import { TableSchemaUnitFormatCreateInput } from "../../../";

export function populateTableViewFormatProperties(view_format_input: TableSchemaUnitFormatCreateInput, schema_id: string){
  const property: ITableViewFormat["table_properties"][0] = {
    property: schema_id,
    visible: true,
    width: 250
  };
  if (typeof view_format_input === "boolean") property.visible = view_format_input;
  else if (typeof view_format_input === "number") property.width = view_format_input;
  else if (Array.isArray(view_format_input)) {
    property.width = view_format_input[1] ?? 250
    property.visible = view_format_input[0] ?? true;
  }
  return property;
}