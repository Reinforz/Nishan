import { NonExistentSchemaUnitTypeError, UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "@nishans/errors";
import { IBoardViewFormat, ICalendarViewFormat, IGalleryViewFormat, IListViewFormat, ITableViewFormat, ITimelineViewFormat, MultiSelectSchemaUnit, SelectSchemaUnit } from "@nishans/types";
import { BoardViewFormatCreateInput, CalendarViewFormatCreateInput, GalleryViewFormatCreateInput, ISchemaMap, ListViewFormatCreateInput, TableViewFormatCreateInput, TimelineViewFormatCreateInput, TViewFormatCreateInput } from "../../../../types";

export type TViewFormat = ITableViewFormat | ICalendarViewFormat | ITimelineViewFormat | IListViewFormat | IGalleryViewFormat | IBoardViewFormat;

export function populateViewFormat(view: TableViewFormatCreateInput): ITableViewFormat;
export function populateViewFormat(view: ListViewFormatCreateInput): IListViewFormat;
export function populateViewFormat(view: CalendarViewFormatCreateInput): ICalendarViewFormat;
export function populateViewFormat(view: GalleryViewFormatCreateInput, schema_map: ISchemaMap): IGalleryViewFormat;
export function populateViewFormat(view: TimelineViewFormatCreateInput, schema_map: ISchemaMap): ITimelineViewFormat;
export function populateViewFormat(view: BoardViewFormatCreateInput, schema_map: ISchemaMap): IBoardViewFormat;
export function populateViewFormat(view: TViewFormatCreateInput, schema_map?: ISchemaMap){
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
      if (view.board_cover?.type === "property") {
        const schema_map_unit = schema_map && schema_map.get(view.board_cover.property);
        if(!schema_map_unit)
          throw new UnknownPropertyReferenceError(view.board_cover.property, ["board_cover.property"])
        if(schema_map_unit.type !== "file")
          throw new UnsupportedPropertyTypeError(view.board_cover.property, ["board_cover.property"], schema_map_unit.type, ["file"])
        board_format.board_cover = { property: schema_map_unit.schema_id, type: "property" }
      }
      else board_format.board_cover = view.board_cover ?? { type: "page_cover" };
      board_format.board_cover_aspect = view.board_cover_aspect ?? "contain";
      board_format.board_cover_size = view.board_cover_size ?? "large";
      const select_schema_map_unit = Array.from((schema_map as ISchemaMap).values()).find((value)=>value.type === "multi_select" || value.type === "select") as ({schema_id: string} & (MultiSelectSchemaUnit | SelectSchemaUnit));
      if(!select_schema_map_unit)
        throw new NonExistentSchemaUnitTypeError(["select", "multi_select"])
      if(!(select_schema_map_unit as MultiSelectSchemaUnit).options.length)
        throw new Error(`Property ${select_schema_map_unit.name} doesnot have any options`);
      
      if(view.board_groups2){
        for (let index = 0; index < view.board_groups2.length; index++) {
          const element = view.board_groups2[index];
          const schema_map_unit = schema_map && schema_map.get(element.property);
          if(!schema_map_unit)
            throw new UnknownPropertyReferenceError(element.property, [`board_groups2.[${index}].property`])
          if(schema_map_unit.type !== "select" && schema_map_unit.type !== "multi_select")
            throw new UnsupportedPropertyTypeError(element.property, [`board_groups2.[${index}].property`], schema_map_unit.type, ["select", "multi_select"]);

          element.property = schema_map_unit.schema_id;
        }
      }

      board_format.board_groups2 = view.board_groups2 ?? [{
        hidden: false,
        property: select_schema_map_unit.schema_id,
        value: {
          type: select_schema_map_unit.type as 'select' | 'multi_select',
        }
      }, ...select_schema_map_unit.options.map(({value})=>({
        hidden: false,
        property: select_schema_map_unit.schema_id,
        value: {
          type: select_schema_map_unit.type as 'select' | 'multi_select',
          value
        }
      }))];
      break;
    case "gallery":
      const gallery_format = format as IGalleryViewFormat;
      if (view.gallery_cover?.type === "property") {
        const schema_map_unit = schema_map && schema_map.get(view.gallery_cover.property);
        if(!schema_map_unit)
          throw new UnknownPropertyReferenceError(view.gallery_cover.property, ["gallery_cover.property"])
        if(schema_map_unit.type !== "file")
          throw new UnsupportedPropertyTypeError(view.gallery_cover.property, ["gallery_cover.property"], schema_map_unit.type, ["file"])
        gallery_format.gallery_cover = { property: schema_map_unit.schema_id, type: "property" };
        gallery_format.gallery_cover = { property: schema_map_unit.schema_id, type: "property" };
      }
      else gallery_format.gallery_cover = view.gallery_cover ?? { type: "page_cover" };
      gallery_format.gallery_cover_aspect = view.gallery_cover_aspect ?? "contain";
      gallery_format.gallery_cover_size = view.gallery_cover_size ?? "large";
      break;
    case "timeline":
      const timeline_format = format as ITimelineViewFormat;
      timeline_format.timeline_preference = view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" };
      timeline_format.timeline_show_table = view.timeline_show_table ?? true;
      timeline_format.timeline_table_properties = [];
      break;
  }

  return format;
}