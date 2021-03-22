import { IBoardViewQuery2, ICalendarViewQuery2, IGalleryViewQuery2, IListViewQuery2, ISchemaMap, ITableViewQuery2, ITimelineViewQuery2, TViewQuery2 } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { NotionValidators } from "@nishans/validators";
import { BoardViewQuery2CreateInput, CalendarViewQuery2CreateInput, GalleryViewQuery2CreateInput, ListViewQuery2CreateInput, TableViewQuery2CreateInput, TimelineViewQuery2CreateInput, TViewQuery2CreateInput } from "../../";

/**
 * Populates and returns the query2 data of a view
 * @param view View create input data
 * @param schema_map Schema map used to resolve property reference
 * @returns Populated query2 data with sort, filter, aggregations and other view specific infos
 */
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
      const schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map as any, view.group_by, ["group_by"]);
      NotionValidators.checkSelectSchemaUnit(schema_map_unit, ["group_by"]);
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
      const schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map as any, view.calendar_by, ["calendar_by"]);
      NotionValidators.checkDateSchemaUnit(schema_map_unit, view.calendar_by, ["calendar_by"])

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
      const schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map as any, view.timeline_by, ["timeline_by"]);
      NotionValidators.checkDateSchemaUnit(schema_map_unit, view.timeline_by, ["timeline_by"])

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