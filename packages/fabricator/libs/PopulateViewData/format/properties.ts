import { ITableViewFormat, TViewType, ViewFormatProperties } from "@nishans/types";
import { ISchemaMapValue, TViewSchemaUnitsCreateInput } from "../..";

/**
 * * Returns a view format property based on the passed view_type
 * @param view_type The type of view
 * @param schema_id schema_id of the property referenced
 * @param format Format input for the property
 */
export function populateViewFormatProperties(view_type: "table", schema_id: ISchemaMapValue["schema_id"], format?: TViewSchemaUnitsCreateInput["format"]): ITableViewFormat["table_properties"][0]
export function populateViewFormatProperties(view_type: Exclude<TViewType, "table">, schema_id: ISchemaMapValue["schema_id"], format?: boolean): ViewFormatProperties
export function populateViewFormatProperties(view_type: TViewType, schema_id: ISchemaMapValue["schema_id"], format?: TViewSchemaUnitsCreateInput["format"]){
  // Create the default property object
  if(view_type === "table"){
    const property: ITableViewFormat["table_properties"][0] = {
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
  }else{
    return {
      property: schema_id,
      visible: format,
    } as ViewFormatProperties;
  }
}