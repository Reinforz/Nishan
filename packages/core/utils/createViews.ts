import { Schema, TSchemaUnit, IOperation, ViewSorts, TViewFilters, ViewAggregations, ViewFormatProperties, ITableViewFormat, IBoardViewFormat, IGalleryViewFormat, ICalendarViewQuery2, ITimelineViewFormat } from "@nishans/types";
import { TViewCreateInput, UpdateCacheManuallyParam, TableViewCreateInput, BoardViewCreateInput, GalleryViewCreateInput, CalendarViewCreateInput, TimelineViewCreateInput, ITView, NishanArg } from "../types";
import { generateId, error, Operation, createViewMap } from "../utils";
import { populateFilters } from "./populateFilters";

export function createViews(schema: Schema, views: TViewCreateInput[], collection_id: string, parent_id: string, props: Omit<NishanArg, "id">, current_id?: string) {
  const name_map: Map<string, { property: string } & TSchemaUnit> = new Map(), created_view_ops: IOperation[] = [], view_ids: string[] = [], view_map = createViewMap(), view_records: UpdateCacheManuallyParam = [];
  const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("../api/View/index");
  const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

  Object.entries(schema).forEach(([schema_id, schema]) => name_map.set(schema.name, { property: schema_id, ...schema }));

  for (let index = 0; index < views.length; index++) {
    const { id, name, type, view, filter_operator = "and" } = views[index],
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
    view_records.push([view_id, "collection_view"])
    view_map[type].set(view_id, new view_classes[type]({ ...props, id: view_id }))

    switch (type) {
      case "table":
        const table_view = views[index] as TableViewCreateInput, table_format = format as ITableViewFormat;
        table_format.table_wrap = table_view.table_wrap ?? true;
        break;
      case "board":
        const board_view = views[index] as BoardViewCreateInput, board_format = format as IBoardViewFormat;
        board_format.board_cover = board_view.board_cover ?? { type: "page_cover" };
        board_format.board_cover_aspect = board_view.board_cover_aspect;
        board_format.board_cover_size = board_view.board_cover_size;
        board_format.board_groups2 = board_view.board_groups2 as any;
        break;
      case "gallery":
        const gallery_view = views[index] as GalleryViewCreateInput, gallery_format = format as IGalleryViewFormat;
        if (gallery_view.gallery_cover?.type === "property") gallery_format.gallery_cover = { ...gallery_view.gallery_cover, property: name_map.get(gallery_view.gallery_cover.property)?.property as string }
        else gallery_format.gallery_cover = gallery_view.gallery_cover
        gallery_format.gallery_cover_aspect = gallery_view.gallery_cover_aspect
        gallery_format.gallery_cover_size = gallery_view.gallery_cover_size
        break;
      case "calendar":
        const calender_view = views[index] as CalendarViewCreateInput, calendar_query2 = query2 as ICalendarViewQuery2;
        calendar_query2.calendar_by = calender_view.calendar_by;
        break;
      case "timeline":
        const timeline_view = views[index] as TimelineViewCreateInput, timeline_format = format as ITimelineViewFormat;
        timeline_format.timeline_preference = timeline_view.timeline_preference ?? { centerTimestamp: 1, zoomLevel: "month" }
        timeline_format.timeline_show_table = timeline_view.timeline_show_table ?? true;
        break;
    }

    view.forEach(info => {
      const { format, sort, aggregation, name } = info, property_info = name_map.get(name);
      if (property_info) {
        const property: ViewFormatProperties = {
            property: property_info.property,
            visible: true,
            width: 250
          };
        included_units.push(property_info.property);
        if (typeof format === "boolean") property.visible = format;
        else if (typeof format === "number") property.width = format;
        else if (Array.isArray(format)) {
          property.width = format?.[1] ?? 250
          property.visible = format?.[0] ?? true;
        }
        if (sort) {
          if (Array.isArray(sort))
            sorts.splice(sort[1], 0, {
              property: property_info.property,
              direction: sort[0]
            })
          else sorts.push({
            property: property_info.property,
            direction: sort
          })
        }

        if (aggregation) aggregations.push({
          property: property_info.property,
          aggregator: aggregation
        })

        properties.push(property)
      } else
        throw new Error(error(`Collection:${collection_id} does not contain SchemeUnit.name:${name}`))
    })

    const non_included_units = Object.keys(schema).filter(key => !included_units.includes(key));
    populateFilters(views[index].filters, filters, name_map)
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
    created_view_ops.push(Operation.collection_view.set(view_id, [], view_data))
    props.cache.collection_view.set(view_id, view_data)
    props.logger && props.logger("CREATE", "collection_view", view_id) 
  }

  return [created_view_ops, view_ids, view_map, view_records] as [IOperation[], string[], ITView, UpdateCacheManuallyParam];
}