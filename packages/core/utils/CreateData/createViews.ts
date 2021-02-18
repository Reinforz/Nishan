import { ISchemaMap, ISchemaMapValue } from "@nishans/notion-formula";
import { Operation } from "@nishans/operations";
import { IBoardViewFormat, IBoardViewQuery2, ICalendarViewFormat, ICalendarViewQuery2, ICollection, IGalleryViewFormat, IGalleryViewQuery2, IListViewFormat, IListViewQuery2, ITableViewFormat, ITableViewQuery2, ITimelineViewFormat, ITimelineViewQuery2, MultiSelectSchemaUnit, Schema, SelectSchemaUnit, TView, ViewAggregations, ViewFormatProperties } from "@nishans/types";
import { getSchemaMap } from "../../src";
import { BoardViewFormatCreateInput, BoardViewQuery2CreateInput, CalendarViewFormatCreateInput, CalendarViewQuery2CreateInput, GalleryViewFormatCreateInput, GalleryViewQuery2CreateInput, IViewMap, ListViewFormatCreateInput, ListViewQuery2CreateInput, NishanArg, TableViewFormatCreateInput, TableViewQuery2CreateInput, TimelineViewFormatCreateInput, TimelineViewQuery2CreateInput, TViewCreateInput, TViewFormatCreateInput, TViewQuery2CreateInput, TViewSchemaUnitsCreateInput } from "../../types";
import { createViewMap, generateId, NonExistentSchemaUnitTypeError, UnknownPropertyReferenceError, UnsupportedPropertyTypeError } from "../../utils";
import { populateFilters } from "../populateFilters";

// * Separate start and end date for timeline view

export type TViewQuery2 = ITableViewQuery2 | ICalendarViewQuery2 | ITimelineViewQuery2 | IListViewQuery2 | IGalleryViewQuery2 | IBoardViewQuery2;

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

export function populateViewProperties(schema_map_unit: Pick<ISchemaMapValue, "schema_id">, format?: TViewSchemaUnitsCreateInput["format"]){
  const property: ViewFormatProperties = {
    property: schema_map_unit.schema_id,
    visible: true,
    width: 250
  };
  if (typeof format === "boolean") property.visible = format;
  else if (typeof format === "number") property.width = format;
  else if (Array.isArray(format)) {
    property.width = format[1] ?? 250
    property.visible = format[0] ?? true;
  }

  return property;
}

export function populateQuery2SortAndAggregations(input_schema_unit: Pick<TViewSchemaUnitsCreateInput, "sort" | "aggregation">, schema_map_unit: Pick<ISchemaMapValue, "schema_id">, query2: TViewQuery2){
  const {sort, aggregation} = input_schema_unit;
  const sorts = query2.sort, aggregations = (query2 as any).aggregations as ViewAggregations[];
  if (sort && sorts) {
    if (Array.isArray(sort))
      sorts.splice(sort[1], 0, {
        property: schema_map_unit.schema_id,
        direction: sort[0]
      })
    else sorts.push({
      property: schema_map_unit.schema_id,
      direction: sort
    })
  };

  if (aggregation && (query2 as any).aggregations) (query2 as any).aggregations.push({
    property: schema_map_unit.schema_id,
    aggregator: aggregation
  });

  return [sorts, aggregations]
}

export function populateNonIncludedProperties(schema: Schema, included_units: string[]){
  const properties: ViewFormatProperties[] = [];
  const non_included_unit_entries = Object.keys(schema).filter((schema_id) => !included_units.includes(schema_id));
  non_included_unit_entries.forEach((property) => {
    properties.push({
      property,
      visible: false,
      width: 250
    })
  });

  return properties;
}

export function generateViewData({id, name, type}: Pick<TViewCreateInput, "id" | "name" | "type">, {stack, cache, space_id, shard_id, user_id}: Pick<NishanArg, "stack" | "cache" | "space_id" | "shard_id" | "user_id">, format: TViewFormat, query2: TViewQuery2, parent_id?: string){
  const view_id = generateId(id);
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
    shard_id,
    space_id,
  } as TView;
  stack.push(Operation.collection_view.set(view_id, [], JSON.parse(JSON.stringify(view_data))));
  cache.collection_view.set(view_id, JSON.parse(JSON.stringify(view_data)));
  return view_data;
}

export function createViews(collection: Pick<ICollection, "id" | "schema" | "parent_id">, views: TViewCreateInput[], props: Omit<NishanArg, "id" | "interval">, parent_id?:string) {
  const schema_map = getSchemaMap(collection.schema), view_ids: string[] = [], view_map = createViewMap();
  const { TableView, ListView, GalleryView, BoardView, CalendarView, TimelineView } = require("../../src/View/index");
  const view_classes = { table: TableView, list: ListView, gallery: GalleryView, board: BoardView, calendar: CalendarView, timeline: TimelineView };

  for (let index = 0; index < views.length; index++) {
    const view = views[index], 
      { name, type, schema_units} = view, included_units: string[] = [], query2 = populateViewQuery2(view as any, schema_map) , {filter} = query2, format = populateViewFormat(view as any, schema_map), properties: ViewFormatProperties[] = (format as any)[`${view.type}_properties`];

    schema_units.forEach(schema_unit => {
      const { format, name } = schema_unit, schema_map_unit = schema_map.get(name);
      if (schema_map_unit) {
        included_units.push(schema_map_unit.schema_id);
        populateQuery2SortAndAggregations(schema_unit, schema_map_unit, query2)
        properties.push(populateViewProperties(schema_map_unit, format))
      } else
        throw new UnknownPropertyReferenceError(name, ['name']);
    })

    properties.push(...populateNonIncludedProperties(collection.schema, included_units));

    const input_filters = views[index].filters;
    if(input_filters && filter)
      populateFilters(input_filters, filter.filters, schema_map);

    const view_data = generateViewData(view, props, format, query2, parent_id ?? collection.parent_id);
    view_ids.push(view_data.id);
    const view_object = new view_classes[type]({ ...props, id: view_data.id })
    view_map[type].set(view_data.id, view_object);
    view_map[type].set(name, view_object);

    props.logger && props.logger("CREATE", "collection_view", view_data.id);
  }

  return [view_ids, view_map] as [string[], IViewMap];
}