import { ParentProps, TViewFormatCover, Node, IViewFilters, TViewFilters, ViewAggregations } from "./";

export type TView = ITableView | IListView | IBoardView | IGalleryView | ICalendarView | ITimelineView;

export interface ITableViewFormat {
  table_wrap: boolean,
  table_properties: ViewFormatProperties[]
}

export interface ITableView extends Node, ParentProps {
  name: string,
  type: 'table',
  page_sort: string[],
  format: ITableViewFormat,
  query2?: {
    aggregations: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      operator: "and",
      filters: TViewFilters[]
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
    aggregations?: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      operator: "and",
      filters: IViewFilters[]
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
      operator: "and",
      filters: IViewFilters[]
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
    aggregations?: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      operator: "and",
      filters: IViewFilters[]
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
    aggregations?: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      operator: "and",
      filters: IViewFilters[]
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
    sort: ViewSorts[],
    filter: {
      operator: "and",
      filters: IViewFilters[]
    },
    aggregations: ViewAggregations[],
  }
}

export type TTimelineViewTimelineby = "hours" | "day" | "week" | "bi_week" | "month" | "quarter" | "year";

export interface ViewFormatProperties {
  width?: number,
  visible: boolean,
  property: string
}

export interface ViewSorts {
  property: string,
  direction: "ascending" | "descending"
}

