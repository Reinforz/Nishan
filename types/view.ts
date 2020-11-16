import { ParentProps, TViewFormatCover, TViewAggregationsAggregators, Node } from "./";

export type TView = ITableView | IListView | IBoardView | IGalleryView | ICalendarView | ITimelineView;

export interface ITableView extends Node, ParentProps {
  name: string,
  type: 'table',
  page_sort: string[],
  format: {
    table_wrap: boolean,
    table_properties: ViewFormatProperties[]
  },
  query2?: {
    aggregations: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface IListView extends Node, ParentProps {
  name: string,
  type: 'list',
  format: {
    list_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface IBoardView extends Node, ParentProps {
  type: 'board',
  name: string,
  format: {
    board_cover: TViewFormatCover,
    board_properties: ViewFormatProperties[],
    board_cover_aspect?: 'contain' | 'cover',
    board_cover_size?: 'small' | 'medium' | 'large',
    board_groups2: { hidden: boolean, property: string, value: { type: "select" | "multi_select", value: string } }[]
  },
  query2?: {
    aggregations: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
    group_by: string
  },
}

export interface IGalleryView extends Node, ParentProps {
  type: 'gallery',
  name: string,
  format: {
    gallery_cover?: TViewFormatCover,
    gallery_cover_aspect?: 'contain' | 'cover',
    gallery_cover_size?: 'small' | 'medium' | 'large',
    gallery_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface ICalendarView extends Node, ParentProps {
  type: 'calendar',
  name: string,
  format: {
    calendar_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
    calender_by: string
  },
}

export interface ITimelineView extends Node, ParentProps {
  type: 'timeline',
  name: string,
  format: {
    timeline_preference: {
      centerTimestamp: number,
      zoomLevel: "month"
    },
    timeline_properties: ViewFormatProperties[],
    timeline_show_table: boolean,
    timeline_table_properties: ViewFormatProperties[]
  },
  query2: {
    timeline_by: TTimelineViewTimelineby,
    aggregations: ViewAggregations[],
  }
}

export type TTimelineViewTimelineby = "hours" | "day" | "week" | "bi_week" | "month" | "quarter" | "year";

export interface ViewFormatProperties {
  width?: number,
  visible: boolean,
  property: string
}

export interface ViewAggregations {
  property: string,
  // ? TD:1:H Create interfaces for each data type and associate the appropriate aggregator values with them
  aggregator: TViewAggregationsAggregators
}

export interface ViewSorts {
  property: string,
  direction: "ascending" | "descending"
}

export interface ViewFilters {

}