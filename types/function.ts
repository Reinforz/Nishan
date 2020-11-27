import { TSchemaUnit, INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, PageFormat, PageProps, TBlockInput, TBlockType, IDate, IDateRange, IDateTime, IDateTimeRange, TViewAggregationsAggregators, TViewType, TDataType, TViewFiltersOperator, TViewFiltersType, TViewFiltersValue, TViewFormatCover, TTimelineViewTimelineby, ViewFormatProperties, ITimelineViewFormatPreference, TSortValue, TextViewAggregationsAggregator, NumericViewAggregationsAggregator, EmailViewAggregationsAggregator, CheckboxViewAggregationsAggregator, DateViewAggregationsAggregator, EnumsViewAggregationsAggregator, EnumViewAggregationsAggregator, PersonViewAggregationsAggregator, PhoneViewAggregationsAggregator, UrlViewAggregationsAggregator, FileViewAggregationsAggregator, CreatedByViewAggregationsAggregator, CreatedTimeViewAggregationsAggregator, ForumlaViewAggregationsAggregator, LastEditedByViewAggregationsAggregator, LastEditedTimeViewAggregationsAggregator, RelationViewAggregationsAggregator, RollupViewAggregationsAggregator, TitleViewAggregationsAggregator } from "./";
import { TSchemaUnitType } from "./schema";

export type UserViewFilterParams = [TViewFiltersOperator, TViewFiltersType, TViewFiltersValue] | [TViewFiltersOperator, TViewFiltersType, TViewFiltersValue, number]
export interface UserViewArg {
  id?: string,
  sorts?: [string, number][],
  aggregations?: [string, TViewAggregationsAggregators][],
  filters?: UserViewFilterParams[],
  properties?: [string, boolean, number][],
  name: string,
  type: TViewType,
  wrap?: boolean
}

export interface ViewCreateCbReturn {
  sorts: [("ascending" | "descending"), number],
  aggregations: [TViewAggregationsAggregators, number],
  filters: UserViewFilterParams[],
  properties: [boolean, number, number]
}

export type ViewCreateCbParams<I extends Partial<ViewCreateCbReturn> = Partial<ViewCreateCbReturn>> = (T: TSchemaUnit & { key: string }) => I;

export interface TableViewCreateParams {
  cb: ViewCreateCbParams,
  wrap: boolean,
  name: string,
  position: RepositionParams
}

export interface ListViewCreateParams extends Omit<TableViewCreateParams, "wrap"> {
  cb: ViewCreateCbParams<Omit<ViewCreateCbReturn, "aggregations">>
}

export interface BoardViewCreateParams extends Omit<TableViewCreateParams, "wrap"> {
  group_by: string,
  board_cover: TViewFormatCover,
  board_cover_aspect: 'contain' | 'cover',
  board_cover_size: 'small' | 'medium' | 'large',
}

export interface GalleryViewCreateParams extends Omit<TableViewCreateParams, "wrap"> {
  cb: ViewCreateCbParams<Omit<ViewCreateCbReturn, "aggregations">>,
  gallery_cover: TViewFormatCover,
  gallery_cover_aspect: 'contain' | 'cover',
  gallery_cover_size: 'small' | 'medium' | 'large',
}

export interface CalendarViewCreateParams extends Omit<TableViewCreateParams, "wrap"> {
  group_by: string,
  cb: ViewCreateCbParams<Omit<ViewCreateCbReturn, "aggregations">>,
}

export interface TimelineViewCreateParams extends Omit<TableViewCreateParams, "wrap"> {
  timeline_by: TTimelineViewTimelineby,
  timeline_show_table: boolean,
  timeline_table_properties: ViewFormatProperties[],
  timeline_preference: ITimelineViewFormatPreference,
}

// ? TD:1:M All the schema type rather than Record Any

export interface CreateRootCollectionViewPageParams extends CreateRootPageArgs, SchemaManipParam {
  schema: TSchemaUnit[]
}

export interface CreateBlockArg {
  parent_table?: "block" | "collection" | "space", $block_id: string, type: TBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export type RepositionParams = {
  id: string,
  position: "before" | "after"
} | number | undefined;

export interface CreateRootPageArgs {
  properties: Partial<PageProps>,
  format: Partial<PageFormat>,
  isPrivate?: boolean,
  position?: RepositionParams
}

export type UpdatableSpaceKeys = 'name' | 'beta_enabled' | 'icon';
export type SpaceUpdateParam = Partial<Pick<ISpace, UpdatableSpaceKeys>>;

export type UpdatableCollectionKeys = "name" | "icon" | "description";
export type UpdatableCollectionUpdateParam = Partial<Pick<ICollection, UpdatableCollectionKeys>>;

export type UpdatableNotionUserKeys = 'family_name' | 'given_name' | 'profile_photo';
export type UpdatableNotionUserParam = Partial<Pick<INotionUser, UpdatableNotionUserKeys>>;

export type UpdatableSpaceViewKeys = 'notify_desktop' | 'notify_email' | 'notify_mobile';
export type UpdatableSpaceViewParam = Partial<Pick<ISpaceView, UpdatableSpaceViewKeys>>;

export type UpdatableUserSettingsKeys = 'start_day_of_week' | 'time_zone' | 'locale' | 'preferred_locale' | 'preferred_locale_origin';
export type UpdatableUserSettingsParam = Partial<Pick<IUserSettingsSettings, UpdatableUserSettingsKeys>>;
export type UpdateCacheManuallyParam = (string | [string, TDataType])[]

export type PageCreateContentParam = TBlockInput & {
  position?: RepositionParams
}

export type CreateTRootPagesParams = ({
  type: "page",
} & CreateRootPageArgs | {
  type: "collection_view_page"
} & CreateRootCollectionViewPageParams)

export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean;
export type FilterTypes<T> = undefined | string[] | Predicate<T>
export type FilterType<T> = undefined | string | Predicate<T>

export interface SearchManipViewParam {
  type: TViewType,
  name: string,
  view: ViewUpdateParam[],
  position?: RepositionParams,
  filter_operator?: "or" | "and"
}

export type SchemaManipParam = {
  views: SearchManipViewParam[],
  position?: RepositionParams
}

type ViewUpdateGenericParam<T extends TSchemaUnitType, A extends TViewAggregationsAggregators> = {
  name: string,
  type: T,
  sort?: TSortValue,
  filter?: UserViewFilterParams[],
  format?: undefined | boolean | number | [boolean, number],
  aggregation?: A
}

export type ViewUpdateParam =
  ViewUpdateGenericParam<"text", TextViewAggregationsAggregator> |
  ViewUpdateGenericParam<"title", TitleViewAggregationsAggregator> |
  ViewUpdateGenericParam<"number", NumericViewAggregationsAggregator> |
  ViewUpdateGenericParam<"select", EnumViewAggregationsAggregator> |
  ViewUpdateGenericParam<"multi_select", EnumsViewAggregationsAggregator> |
  ViewUpdateGenericParam<"date", DateViewAggregationsAggregator> |
  ViewUpdateGenericParam<"person", PersonViewAggregationsAggregator> |
  ViewUpdateGenericParam<"file", FileViewAggregationsAggregator> |
  ViewUpdateGenericParam<"checkbox", CheckboxViewAggregationsAggregator> |
  ViewUpdateGenericParam<"url", UrlViewAggregationsAggregator> |
  ViewUpdateGenericParam<"email", EmailViewAggregationsAggregator> |
  ViewUpdateGenericParam<"phone_number", PhoneViewAggregationsAggregator> |
  ViewUpdateGenericParam<"formula", ForumlaViewAggregationsAggregator> |
  ViewUpdateGenericParam<"relation", RelationViewAggregationsAggregator> |
  ViewUpdateGenericParam<"rollup", RollupViewAggregationsAggregator> |
  ViewUpdateGenericParam<"created_time", CreatedTimeViewAggregationsAggregator> |
  ViewUpdateGenericParam<"created_by", CreatedByViewAggregationsAggregator> |
  ViewUpdateGenericParam<"last_edited_time", LastEditedTimeViewAggregationsAggregator> |
  ViewUpdateGenericParam<"last_edited_by", LastEditedByViewAggregationsAggregator>;