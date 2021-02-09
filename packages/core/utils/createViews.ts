import { ISchemaMap } from "@nishans/notion-formula";
import { ViewFormatProperties, ITableViewFormat, IBoardViewFormat, IGalleryViewFormat, ICalendarViewQuery2, ITimelineViewFormat, ICollection, IListViewFormat, ICalendarViewFormat, ITableViewQuery2, ITimelineViewQuery2, IListViewQuery2, IGalleryViewQuery2, IBoardViewQuery2 } from "@nishans/types";
import { getSchemaMap } from "../src";
import { TViewCreateInput, ITView, NishanArg, TViewQuery2CreateInput } from "../types";
import { generateId, error, Operation, createViewMap } from "../utils";
import { populateFilters } from "./populateFilters";

type TViewQuery2 = ITableViewQuery2 | ICalendarViewQuery2 | ITimelineViewQuery2 | IListViewQuery2 | IGalleryViewQuery2 | IBoardViewQuery2;

export function populateViewQuery2(view: TViewQuery2CreateInput): TViewQuery2 {
  const query2: TViewQuery2 = {} as any, operator = view.filter_operator ?? "and";
  switch (view.type) {
    case "table":
      const table_query2: ITableViewQuery2 = query2;
      table_query2.aggregations = [];
      table_query2.sort = [];
      table_query2.filter = {
        operator,
        filters: []
      };
      return table_query2;
    case "board":
      const board_query2: IBoardViewQuery2 = query2 as any;
      board_query2.aggregations = [];
      board_query2.sort = [];
      board_query2.group_by = view.group_by;
      board_query2.filter = {
        operator,
        filters: []
      };
      return board_query2;
    case "gallery":
      const gallery_query2: IGalleryViewQuery2 = query2;
      gallery_query2.sort = [];
      gallery_query2.filter = {
        operator,
        filters: []
      };
      return gallery_query2;
    case "calendar":
      const calendar_query2: ICalendarViewQuery2 = query2 as any;
      calendar_query2.sort = [];
      calendar_query2.calendar_by = view.calendar_by;
      calendar_query2.filter = {
        operator,
        filters: []
      };
      return calendar_query2;
    case "timeline":
      const timeline_query2: ITimelineViewQuery2 = query2 as any;
      timeline_query2.aggregations = [];
      timeline_query2.sort = [];
      timeline_query2.timeline_by = view.timeline_by;
      timeline_query2.filter = {
        operator,
        filters: []
      };
      return timeline_query2;
    case "list":
      const list_query2: IListViewQuery2 = query2;
      list_query2.sort = [];
      list_query2.filter = {
        operator,
        filters: []
      };
      return list_query2;
  }
}

export function populateViewFormat(view: TViewCreateInput, schema_map: ISchemaMap, query2: ITableViewQuery2 | ICalendarViewQuery2 | ITimelineViewQuery2 | IListViewQuery2 | IGalleryViewQuery2 | IBoardViewQuery2){
  const properties: ViewFormatProperties[] = [], format: ITableViewFormat | ITimelineViewFormat | IListViewFormat | IBoardViewFormat | IGalleryViewFormat | ICalendarViewFormat = {
    [`${view.type}_properties`]: properties
  } as any;

  switch (view.type) {
    case "table":
      const table_view = view, table_format = format as ITableViewFormat;
      table_format.table_wrap = table_view.table_wrap ?? true;
      break;
    case "board":
      const board_view = view, board_format = format as IBoardViewFormat, board_query2 = query2 as IBoardViewQuery2;
      board_format.board_cover = board_view.board_cover ?? { type: "page_cover" };
      board_format.board_cover_aspect = board_view.board_cover_aspect;
      board_format.board_cover_size = board_view.board_cover_size;
      board_format.board_groups2 = board_view.board_groups2 as any;
      board_query2.group_by = schema_map.get(board_view.group_by)?.schema_id ?? board_view.group_by;
      break;
    case "gallery":
      const gallery_view = view, gallery_format = format as IGalleryViewFormat;
      if (gallery_view.gallery_cover?.type === "property") gallery_format.gallery_cover = { ...gallery_view.gallery_cover, property: schema_map.get(gallery_view.gallery_cover.property)?.schema_id as string }
      else gallery_format.gallery_cover = gallery_view.gallery_cover
      gallery_format.gallery_cover_aspect = gallery_view.gallery_cover_aspect
      gallery_format.gallery_cover_size = gallery_view.gallery_cover_size
      break;
    case "calendar":
      const calender_view = view, calendar_query2 = query2 as ICalendarViewQuery2;
      calendar_query2.calendar_by = schema_map.get(calender_view.calendar_by)?.schema_id ?? calender_view.calendar_by;
      break;
    case "timeline":
      const timeline_view = view, timeline_format = format as ITimelineViewFormat;
      timeline_format.timeline_preference = timeline_view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" }
      timeline_format.timeline_show_table = timeline_view.timeline_show_table ?? true;
      break;
  }

  return {
    properties,
    format
  }
}

export function createViews(collection: ICollection, views: TViewCreateInput[],props: Omit<NishanArg, "id">, parent_id?:string) {
  const schema_map = getSchemaMap(collection.schema), view_ids: string[] = [], view_map = createViewMap();
  const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("../src/View/index");
  const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

  for (let index = 0; index < views.length; index++) {
    const view = views[index];
    const { id, name, type, schema_units} = view,
      view_id = generateId(id), included_units: string[] = [], query2 = populateViewQuery2(view), {sort: sorts, filter} = query2, {properties, format} = populateViewFormat(view, schema_map, query2);

    view_ids.push(view_id);
    view_map[type].set(view_id, new view_classes[type]({ ...props, id: view_id }))

    schema_units.forEach(schema_unit => {
      const { format, sort, aggregation, name } = schema_unit, property_info = schema_map.get(name);
      if (property_info) {
        const property: ViewFormatProperties = {
            property: property_info.schema_id,
            visible: true,
            width: 250
          };
        included_units.push(property_info.schema_id);
        if (typeof format === "boolean") property.visible = format;
        else if (typeof format === "number") property.width = format;
        else if (Array.isArray(format)) {
          property.width = format[1] ?? 250
          property.visible = format[0] ?? true;
        }
        if (sort && sorts) {
          if (Array.isArray(sort))
            sorts.splice(sort[1], 0, {
              property: property_info.schema_id,
              direction: sort[0]
            })
          else sorts.push({
            property: property_info.schema_id,
            direction: sort
          })
        }

        if (aggregation && (query2 as any).aggregations) (query2 as any).aggregations.push({
          property: property_info.schema_id,
          aggregator: aggregation as any
        })

        properties.push(property)
      } else
        throw new Error(error(`Collection:${collection.id} does not contain SchemeUnit.name:${name}`))
    })

    const non_included_units = Object.keys(collection.schema).filter(key => !included_units.includes(key));
    const input_filters = views[index].filters;
    if(input_filters && filter)
      populateFilters(input_filters, filter.filters, schema_map);

    non_included_units.forEach(property => {
      properties.push({
        property,
        visible: false,
        width: 250
      })
    });
    
    const view_data = {
      id: view_id,
      version: 0,
      type,
      name,
      page_sort: [],
      parent_id: parent_id ?? collection.parent_id,
      parent_table: 'block',
      alive: true,
      format,
      query2,
    } as any;
    props.stack.push(Operation.collection_view.set(view_id, [], JSON.parse(JSON.stringify(view_data))))
    props.cache.collection_view.set(view_id, JSON.parse(JSON.stringify(view_data)))
    props.logger && props.logger("CREATE", "collection_view", view_id) 
  }

  return [view_ids, view_map] as [string[], ITView];
}