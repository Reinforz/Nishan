import { NonExistentSchemaUnitTypeError, UnsupportedPropertyTypeError } from "@nishans/errors";
import { IBoardViewFormat, ICalendarViewFormat, IGalleryViewFormat, IListViewFormat, ITableViewFormat, ITimelineViewFormat, MultiSelectSchemaUnit, SelectSchemaUnit } from "@nishans/types";
import { getSchemaMapUnit } from "../../../";
import { BoardViewFormatCreateInput, CalendarViewFormatCreateInput, GalleryViewFormatCreateInput, ISchemaMap, ListViewFormatCreateInput, TableViewFormatCreateInput, TimelineViewFormatCreateInput, TViewFormatCreateInput } from "../../../../types";
export type TViewFormat = ITableViewFormat | ICalendarViewFormat | ITimelineViewFormat | IListViewFormat | IGalleryViewFormat | IBoardViewFormat;

export function populateViewFormat(view: TableViewFormatCreateInput): ITableViewFormat;
export function populateViewFormat(view: ListViewFormatCreateInput): IListViewFormat;
export function populateViewFormat(view: CalendarViewFormatCreateInput): ICalendarViewFormat;
export function populateViewFormat(view: GalleryViewFormatCreateInput, schema_map: ISchemaMap): IGalleryViewFormat;
export function populateViewFormat(view: TimelineViewFormatCreateInput, schema_map: ISchemaMap): ITimelineViewFormat;
export function populateViewFormat(view: BoardViewFormatCreateInput, schema_map: ISchemaMap): IBoardViewFormat;
/**
 * Populate the format of a view data
 * @param view input view data
 * @param schema_map schema map used to resolve references to properties
 * @returns Populate view format object 
 */
export function populateViewFormat(view: TViewFormatCreateInput, schema_map?: ISchemaMap){
  // Create the format object, which must contain an array that contains all the information related to properties 
  const format: TViewFormat = {
    [`${view.type}_properties`]: []
  } as any;

  switch (view.type) {
    case "table":
      const table_format = format as ITableViewFormat;
      table_format.table_wrap = Boolean(view.table_wrap);
      break;
    case "board":
      const board_format = format as IBoardViewFormat;
      // if the board_cover is of type property, that property needs to be resolved
      if (view.board_cover?.type === "property") {
        const schema_map_unit = getSchemaMapUnit(schema_map as any, view.board_cover.property, ["board_cover", "property"]);
        if(schema_map_unit.type !== "file")
          throw new UnsupportedPropertyTypeError(view.board_cover.property, ["board_cover", "property"], schema_map_unit.type, ["file"])
        board_format.board_cover = { property: schema_map_unit.schema_id, type: "property" }
      }
      else board_format.board_cover = view.board_cover ?? { type: "page_cover" };
      // Set to default values for board format
      board_format.board_cover_aspect = view.board_cover_aspect ?? "contain";
      board_format.board_cover_size = view.board_cover_size ?? "large";
      // obtaining all the option based schema units from the schema
      const select_schema_map_unit = Array.from((schema_map as ISchemaMap).values()).find((value)=>value.type === "multi_select" || value.type === "select") as ({schema_id: string} & (MultiSelectSchemaUnit | SelectSchemaUnit));
      // if the schema doesn't contain any option based schema unit throw an error, as its required to form groups in board
      if(!select_schema_map_unit)
        throw new NonExistentSchemaUnitTypeError(["select", "multi_select"])
      // If the length of the options of the options schema unit is zero, throw an error, since its required 
      if(!(select_schema_map_unit as MultiSelectSchemaUnit).options.length)
        throw new Error(`Property ${select_schema_map_unit.name} doesnot have any options`);
      
      // If there is a custom board_groups2 in the input,
      if(view.board_groups2){
        // iterate through each of them
        for (let index = 0; index < view.board_groups2.length; index++) {
          const element = view.board_groups2[index];
          const schema_map_unit = getSchemaMapUnit(schema_map as any, element.property, [`board_groups2.${index}.property`]);
          // validate whether property referenced is of type select or multi_select 
          if(schema_map_unit.type !== "select" && schema_map_unit.type !== "multi_select")
            throw new UnsupportedPropertyTypeError(element.property, [`board_groups2.${index}.property`], schema_map_unit.type, ["select", "multi_select"]);

          element.property = schema_map_unit.schema_id;
        }
      }

      // If custom board_groups2 is there, keep it since its correct as its been validated,
      // else construct a default one with all the options of the first select or multi_select property 
      board_format.board_groups2 = view.board_groups2 ?? [
        // the group that signifies no groups in boards view
        {
          hidden: false,
          property: select_schema_map_unit.schema_id,
          value: {
            type: select_schema_map_unit.type,
          }
        }, ...select_schema_map_unit.options.map(({value})=>({
        hidden: false,
        property: select_schema_map_unit.schema_id,
        value: {
          type: select_schema_map_unit.type,
          value
        }
      }))];
      break;
    case "gallery":
      const gallery_format = format as IGalleryViewFormat;
      if (view.gallery_cover?.type === "property") {
        // Validates whether the custom gallery_cover referenced property
        // exists in the schema
        // is of type file 
        const schema_map_unit = getSchemaMapUnit(schema_map as any, view.gallery_cover.property, ["gallery_cover.property"]);
        if(schema_map_unit.type !== "file")
          throw new UnsupportedPropertyTypeError(view.gallery_cover.property, ["gallery_cover.property"], schema_map_unit.type, ["file"])
        gallery_format.gallery_cover = { property: schema_map_unit.schema_id, type: "property" };
      }
      // Set default values to the gallery format
      else gallery_format.gallery_cover = view.gallery_cover ?? { type: "page_cover" };
      gallery_format.gallery_cover_aspect = view.gallery_cover_aspect ?? "contain";
      gallery_format.gallery_cover_size = view.gallery_cover_size ?? "large";
      break;
    case "timeline":
      // Set custom or default values to timeline format
      const timeline_format = format as ITimelineViewFormat;
      timeline_format.timeline_preference = view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" };
      timeline_format.timeline_show_table = view.timeline_show_table ?? true;
      timeline_format.timeline_table_properties = [];
      break;
  }

  return format;
}