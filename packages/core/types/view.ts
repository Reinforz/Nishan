import { TViewType, ITableViewFormat, IBoardViewFormat, IGalleryViewFormat, ITimelineViewFormat, TTimelineViewTimelineby, TSchemaUnitType, TSortValue, TViewGroupFilterOperator, IViewFilterData } from "@nishans/types"
import { RepositionParams } from "./block"
import { ViewFilterCreateInput } from "./filter"

export interface SearchManipViewParam {
  id?: string,
  type: TViewType,
  name: string,
  view: [ViewUpdateParam, ...ViewUpdateParam[]],
  position?: RepositionParams,
  filter_operator?: "or" | "and"
}

export interface TableSearchManipViewParam extends SearchManipViewParam, Partial<Omit<ITableViewFormat, "table_properties">> {
  type: "table",
}

export interface ListSearchManipViewParam extends SearchManipViewParam {
  type: "list"
}

export interface BoardSearchManipViewParam extends SearchManipViewParam, Partial<Omit<IBoardViewFormat, "board_properties">> {
  type: "board",
  group_by: string
}

export interface GallerySearchManipViewParam extends SearchManipViewParam, Partial<Omit<IGalleryViewFormat, "gallery_properties">> {
  type: "gallery",
}

export interface CalendarSearchManipViewParam extends SearchManipViewParam {
  type: "calendar",
  calendar_by: string
}

export interface TimelineSearchManipViewParam extends SearchManipViewParam, Partial<Omit<ITimelineViewFormat, "timeline_properties" | "timeline_table_properties">> {
  type: "timeline",
  timeline_by: TTimelineViewTimelineby
}

export type TSearchManipViewParam = TableSearchManipViewParam | ListSearchManipViewParam | BoardSearchManipViewParam | GallerySearchManipViewParam | CalendarSearchManipViewParam | TimelineSearchManipViewParam

interface ViewUpdateGenericParam<T extends TSchemaUnitType> {
  name: string,
  type: T,
  sort?: TSortValue | [TSortValue, number],
  format?: boolean | number | [boolean, number],
  filters?: ViewFilterCreateInput<T>[],
  filter_operator?: TViewGroupFilterOperator,
  aggregation?: IViewFilterData<T>["aggregator"]
}

export type ViewUpdateParam =
  ViewUpdateGenericParam<"text"> |
  ViewUpdateGenericParam<"title"> |
  ViewUpdateGenericParam<"number"> |
  ViewUpdateGenericParam<"select"> |
  ViewUpdateGenericParam<"multi_select"> |
  ViewUpdateGenericParam<"date"> |
  ViewUpdateGenericParam<"person"> |
  ViewUpdateGenericParam<"file"> |
  ViewUpdateGenericParam<"checkbox"> |
  ViewUpdateGenericParam<"url"> |
  ViewUpdateGenericParam<"email"> |
  ViewUpdateGenericParam<"phone_number"> |
  ViewUpdateGenericParam<"formula"> |
  ViewUpdateGenericParam<"relation"> |
  ViewUpdateGenericParam<"rollup"> |
  ViewUpdateGenericParam<"created_time"> |
  ViewUpdateGenericParam<"created_by"> |
  ViewUpdateGenericParam<"last_edited_time"> |
  ViewUpdateGenericParam<"last_edited_by">