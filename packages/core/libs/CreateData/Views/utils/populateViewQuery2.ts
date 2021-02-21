import { UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "@nishans/errors";
import { ISchemaMap } from "@nishans/notion-formula";
import { IBoardViewQuery2, ICalendarViewQuery2, IGalleryViewQuery2, IListViewQuery2, ITableViewQuery2, ITimelineViewQuery2, TViewQuery2 } from "@nishans/types";
import { BoardViewQuery2CreateInput, CalendarViewQuery2CreateInput, GalleryViewQuery2CreateInput, ListViewQuery2CreateInput, TableViewQuery2CreateInput, TimelineViewQuery2CreateInput, TViewQuery2CreateInput } from "../../../../src";

export function populateViewQuery2(view: TableViewQuery2CreateInput): ITableViewQuery2;
export function populateViewQuery2(view: ListViewQuery2CreateInput): IListViewQuery2;
export function populateViewQuery2(view: GalleryViewQuery2CreateInput): IGalleryViewQuery2;
export function populateViewQuery2(view: TimelineViewQuery2CreateInput, schema_map: ISchemaMap): ITimelineViewQuery2;
export function populateViewQuery2(view: CalendarViewQuery2CreateInput, schema_map: ISchemaMap): ICalendarViewQuery2;
export function populateViewQuery2(view: BoardViewQuery2CreateInput, schema_map: ISchemaMap): IBoardViewQuery2;
export function populateViewQuery2(view: TViewQuery2CreateInput, schema_map?: ISchemaMap): TViewQuery2 {
  const query2: TViewQuery2 = {} as any, operator = view.filter_operator ?? "and";
  switch (view.type) {
    case "table":{
      const table_query2: ITableViewQuery2 = query2;
      table_query2.aggregations = [];
      table_query2.sort = [];
      table_query2.filter = {
        operator,
        filters: []
      };
      return table_query2;
    }
    case "board":{
      const schema_map_unit = schema_map && schema_map.get(view.group_by);
      if(!schema_map_unit)
        throw new UnknownPropertyReferenceError(view.group_by, ["group_by"])
      if(schema_map_unit.type !== "select" && schema_map_unit.type !== "multi_select")
        throw new UnsupportedPropertyTypeError(schema_map_unit.name, ["group_by"], schema_map_unit.type, ["select", "multi_select"])

      const board_query2: IBoardViewQuery2 = query2 as any;
      board_query2.aggregations = [];
      board_query2.sort = [];
      board_query2.group_by = schema_map_unit.schema_id;
      board_query2.filter = {
        operator,
        filters: []
      };
      return board_query2;
    }
    case "gallery":{
      const gallery_query2: IGalleryViewQuery2 = query2;
      gallery_query2.sort = [];
      gallery_query2.filter = {
        operator,
        filters: []
      };
      return gallery_query2;
    }
    case "calendar":{
      const schema_map_unit = schema_map && schema_map.get(view.calendar_by);
      if(!schema_map_unit)
        throw new UnknownPropertyReferenceError(view.calendar_by, ["calendar_by"])

      if(!schema_map_unit.type.match(/^(last_edited_time|created_time|date|formula)$/) || (schema_map_unit.type === "formula" && schema_map_unit.formula.result_type !== "date"))
        throw new UnsupportedPropertyTypeError(view.calendar_by, ["calendar_by"], schema_map_unit.type, ["last_edited_time", "created_time", "date", "formula"]);
        
      const calendar_query2: ICalendarViewQuery2 = query2 as any;
      calendar_query2.sort = [];
      calendar_query2.calendar_by = schema_map_unit.schema_id;
      calendar_query2.filter = {
        operator,
        filters: []
      };
      return calendar_query2;
    }
    case "timeline":{
      const schema_map_unit = schema_map && schema_map.get(view.timeline_by);
      if(!schema_map_unit)
        throw new UnknownPropertyReferenceError(view.timeline_by, ["timeline_by"])

      if(!schema_map_unit.type.match(/^(last_edited_time|created_time|date|formula)$/) || (schema_map_unit.type === "formula" && schema_map_unit.formula.result_type !== "date"))
        throw new UnsupportedPropertyTypeError(view.timeline_by, ["timeline_by"], schema_map_unit.type, ["last_edited_time", "created_time", "date", "formula"]);

      const timeline_query2: ITimelineViewQuery2 = query2 as any;
      timeline_query2.aggregations = [];
      timeline_query2.sort = [];
      timeline_query2.timeline_by = schema_map_unit.schema_id;
      timeline_query2.filter = {
        operator,
        filters: []
      };
      return timeline_query2;
    }
    case "list":{
      const list_query2: IListViewQuery2 = query2;
      list_query2.sort = [];
      list_query2.filter = {
        operator,
        filters: []
      };
      return list_query2;
    }
  }
}