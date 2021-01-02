import { TViewGroupFilterOperator, IViewAggregationsAggregators, IBoardViewFormat, IGalleryViewFormat, ITimelineViewFormat, TSchemaUnitType, INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, TBlockInput, IDate, IDateRange, IDateTime, IDateTimeRange, TViewType, TDataType, TTimelineViewTimelineby, TSortValue, ITableViewFormat, IViewFilterData } from "./";

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export type RepositionParams = {
  id: string,
  position: "before" | "after"
} | number | undefined;

export const TSpaceUpdateKeys = ["name", "icon", "disable_public_access", "disable_guests", "disable_move_to_space", "disable_export", "domain", "invite_link_enabled", "beta_enabled"] as const;
export const TCollectionUpdateKeys = ["name", "icon", "description"] as const;
export const TNotionUserUpdateKeys = ['family_name', 'given_name', 'profile_photo'] as const;
export const TSpaceViewUpdateKeys = ['notify_desktop', 'notify_email', 'notify_mobile', 'joined', 'created_getting_started'] as const;
export const TUserSettingsUpdateKeys = ['start_day_of_week', 'time_zone', 'locale', 'preferred_locale', 'preferred_locale_origin'] as const;

export type ISpaceUpdateInput = Partial<Pick<ISpace, ElementType<typeof TSpaceUpdateKeys>>>;

export type ICollectionUpdateInput = Partial<Pick<ICollection, ElementType<typeof TCollectionUpdateKeys>>>;

export type INotionUserUpdateInput = Partial<Pick<INotionUser, ElementType<typeof TNotionUserUpdateKeys>>>;

export type ISpaceViewUpdateInput = Partial<Pick<ISpaceView, ElementType<typeof TSpaceViewUpdateKeys>>>;

export type IUserSettingsUpdateInput = Partial<Pick<IUserSettingsSettings, ElementType<typeof TUserSettingsUpdateKeys>>>;

export type UpdateCacheManuallyParam = (string | [string, TDataType])[]

export type PageCreateContentParam = TBlockInput & {
  position?: RepositionParams
}

export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean | void | null | undefined;
export type FilterTypes<T> = undefined | string[] | Predicate<T>
export type FilterType<T> = undefined | string | Predicate<T>
export type UpdateTypes<T1, T2> = [string, T2][] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
export type UpdateType<T1, T2> = [string, T2] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);

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

export interface ViewFilterCreateInput<T extends TSchemaUnitType> {
  operator: IViewFilterData<T>["operator"],
  type: IViewFilterData<T>["type"],
  value: IViewFilterData<T>["value"],
  position?: number,
  filters?: ViewFilterCreateInputFilters<TSchemaUnitType>[],
  filter_operator?: TViewGroupFilterOperator
}

interface ViewFilterCreateInputFilters<T extends TSchemaUnitType> extends ViewFilterCreateInput<T> {
  schema_unit: T,
  property: string
}

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

interface ViewFilterCreateGenericParam<T extends TSchemaUnitType> {
  schema_type: T,
  operator: IViewFilterData<T>["operator"],
  type: IViewFilterData<T>["type"],
  value: IViewFilterData<T>["value"],
  position?: number,
  name: string
}

interface ViewAggregationsCreateGenericParam<T extends TSchemaUnitType> {
  schema_type: T,
  name: string,
  aggregator: IViewAggregationsAggregators[T]
}

export type UserViewAggregationsCreateParams =
  ViewAggregationsCreateGenericParam<"text"> |
  ViewAggregationsCreateGenericParam<"title"> |
  ViewAggregationsCreateGenericParam<"number"> |
  ViewAggregationsCreateGenericParam<"select"> |
  ViewAggregationsCreateGenericParam<"multi_select"> |
  ViewAggregationsCreateGenericParam<"date"> |
  ViewAggregationsCreateGenericParam<"person"> |
  ViewAggregationsCreateGenericParam<"file"> |
  ViewAggregationsCreateGenericParam<"checkbox"> |
  ViewAggregationsCreateGenericParam<"url"> |
  ViewAggregationsCreateGenericParam<"email"> |
  ViewAggregationsCreateGenericParam<"phone_number"> |
  ViewAggregationsCreateGenericParam<"formula"> |
  ViewAggregationsCreateGenericParam<"relation"> |
  ViewAggregationsCreateGenericParam<"rollup"> |
  ViewAggregationsCreateGenericParam<"created_time"> |
  ViewAggregationsCreateGenericParam<"created_by"> |
  ViewAggregationsCreateGenericParam<"last_edited_time"> |
  ViewAggregationsCreateGenericParam<"last_edited_by">


export type UserViewFilterCreateParams =
  ViewFilterCreateGenericParam<"text"> |
  ViewFilterCreateGenericParam<"title"> |
  ViewFilterCreateGenericParam<"number"> |
  ViewFilterCreateGenericParam<"select"> |
  ViewFilterCreateGenericParam<"multi_select"> |
  ViewFilterCreateGenericParam<"date"> |
  ViewFilterCreateGenericParam<"person"> |
  ViewFilterCreateGenericParam<"file"> |
  ViewFilterCreateGenericParam<"checkbox"> |
  ViewFilterCreateGenericParam<"url"> |
  ViewFilterCreateGenericParam<"email"> |
  ViewFilterCreateGenericParam<"phone_number"> |
  ViewFilterCreateGenericParam<"formula"> |
  ViewFilterCreateGenericParam<"relation"> |
  ViewFilterCreateGenericParam<"rollup"> |
  ViewFilterCreateGenericParam<"created_time"> |
  ViewFilterCreateGenericParam<"created_by"> |
  ViewFilterCreateGenericParam<"last_edited_time"> |
  ViewFilterCreateGenericParam<"last_edited_by">
