import {
  ICollection,
  IComment,
  IDiscussion,
  IFollow,
  INotionUser,
  IPageVisits,
  ISlackIntegration,
  ISpace,
  ISpaceView,
  IUserRoot,
  IUserSettings, IViewFilter, TActivity,
  TBlock,
  TDataType,
  TNotification, TSchemaUnit, TView, TViewFilters, ViewAggregations, ViewFormatProperties, ViewSorts
} from './';
export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export type ISchemaAggregationMapValue = {
	schema_id: string;
	aggregation: ViewAggregations;
} & TSchemaUnit;
export type ISchemaAggregationMap = Map<string, ISchemaAggregationMapValue>;

export type ISchemaSortsMapValue = { schema_id: string; sort: ViewSorts } & TSchemaUnit;
export type ISchemaSortsMap = Map<string, ISchemaSortsMapValue>;

export type ISchemaFiltersMapValue = {
	schema_id: string;
	parent_filter: IViewFilter;
	child_filter: TViewFilters;
} & TSchemaUnit;
export type ISchemaFiltersMap = Map<string, ISchemaFiltersMapValue>;

export type ISchemaFormatMapValue = { schema_id: string; format: Omit<ViewFormatProperties, 'property'> } & TSchemaUnit;
export type ISchemaFormatMap = Map<string, ISchemaFormatMapValue>;
export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never
export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean | void | null | undefined;

export interface ICache {
	block: Map<string, TBlock>;
	collection: Map<string, ICollection>;
	collection_view: Map<string, TView>;
	space: Map<string, ISpace>;
	notion_user: Map<string, INotionUser>;
	space_view: Map<string, ISpaceView>;
	user_root: Map<string, IUserRoot>;
	user_settings: Map<string, IUserSettings>;
	discussion: Map<string, IDiscussion>;
	comment: Map<string, IComment>;
	follow: Map<string, IFollow>;
	slack_integration: Map<string, ISlackIntegration>;
	page_visits: Map<string, IPageVisits>;
	activity: Map<string, TActivity>;
	notification: Map<string, TNotification>;
}

export type NotionCacheInitializerTracker = Record<TDataType, Map<string, boolean>>;
