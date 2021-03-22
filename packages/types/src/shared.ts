import { IViewFilter, TSchemaUnit, TViewFilters, ViewAggregations, ViewFormatProperties, ViewSorts } from './';

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
