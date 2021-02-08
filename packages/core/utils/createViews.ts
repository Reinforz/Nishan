import { Schema, TSchemaUnit,  ViewSorts, TViewFilters, ViewAggregations, ViewFormatProperties, ITableViewFormat, IBoardViewFormat, IGalleryViewFormat, ICalendarViewQuery2, ITimelineViewFormat } from "@nishans/types";
import { TViewCreateInput, ITView, NishanArg } from "../types";
import { generateId, error, Operation, createViewMap } from "../utils";
import { populateFilters } from "./populateFilters";

export function createViews(schema: Schema, views: TViewCreateInput[], collection_id: string, parent_id: string, props: Omit<NishanArg, "id">, current_id?: string) {
  const name_map: Map<string, { schema_id: string } & TSchemaUnit> = new Map(), view_ids: string[] = [], view_map = createViewMap();
  const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("../src/View/index");
  const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

  Object.entries(schema).forEach(([schema_id, schema]) => name_map.set(schema.name, { schema_id, ...schema }));

  for (let index = 0; index < views.length; index++) {
    const view = views[index];
    const { id, name, type, schema_units, filter_operator = "and" } = view,
      sorts = [] as ViewSorts[], filters = [] as TViewFilters[], aggregations = [] as ViewAggregations[], properties = [] as ViewFormatProperties[],
      view_id = current_id || generateId(id), included_units: string[] = [], query2 = {
        sort: sorts,
        filter: {
          operator: filter_operator,
          filters
        },
        aggregations
      } as any, format = {
        [`${type}_properties`]: properties
      } as any;

    view_ids.push(view_id);
    view_map[type].set(view_id, new view_classes[type]({ ...props, id: view_id }))

    switch (view.type) {
      case "table":
        const table_view = view, table_format = format as ITableViewFormat;
        table_format.table_wrap = table_view.table_wrap ?? true;
        break;
      case "board":
        const board_view = view, board_format = format as IBoardViewFormat;
        board_format.board_cover = board_view.board_cover ?? { type: "page_cover" };
        board_format.board_cover_aspect = board_view.board_cover_aspect;
        board_format.board_cover_size = board_view.board_cover_size;
        board_format.board_groups2 = board_view.board_groups2 as any;
        query2.group_by = name_map.get(board_view.group_by)?.schema_id ?? board_view.group_by;
        break;
      case "gallery":
        const gallery_view = view, gallery_format = format as IGalleryViewFormat;
        if (gallery_view.gallery_cover?.type === "property") gallery_format.gallery_cover = { ...gallery_view.gallery_cover, property: name_map.get(gallery_view.gallery_cover.property)?.schema_id as string }
        else gallery_format.gallery_cover = gallery_view.gallery_cover
        gallery_format.gallery_cover_aspect = gallery_view.gallery_cover_aspect
        gallery_format.gallery_cover_size = gallery_view.gallery_cover_size
        break;
      case "calendar":
        const calender_view = view, calendar_query2 = query2 as ICalendarViewQuery2;
        calendar_query2.calendar_by = name_map.get(calender_view.calendar_by)?.schema_id ?? calender_view.calendar_by;
        break;
      case "timeline":
        const timeline_view = view, timeline_format = format as ITimelineViewFormat;
        timeline_format.timeline_preference = timeline_view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" }
        timeline_format.timeline_show_table = timeline_view.timeline_show_table ?? true;
        break;
    }

    schema_units.forEach(schema_unit => {
      const { format, sort, aggregation, name } = schema_unit, property_info = name_map.get(name);
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
          property.width = format?.[1] ?? 250
          property.visible = format?.[0] ?? true;
        }
        if (sort) {
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

        if (aggregation) aggregations.push({
          property: property_info.schema_id,
          aggregator: aggregation as any
        })

        properties.push(property)
      } else
        throw new Error(error(`Collection:${collection_id} does not contain SchemeUnit.name:${name}`))
    })

    const non_included_units = Object.keys(schema).filter(key => !included_units.includes(key));
    const input_filters = views[index].filters;
    if(input_filters)
      populateFilters(input_filters, filters, name_map)
    non_included_units.forEach(property => {
      properties.push({
        property,
        visible: false
      })
    })
    const view_data = {
      id: view_id,
      version: 0,
      type,
      name,
      page_sort: [],
      parent_id,
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