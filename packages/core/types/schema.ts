import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	IViewFilter,
	TSchemaUnit,
	ViewAggregations,
	ViewFormatProperties,
	ViewSorts
} from '@nishans/types';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export type ISchemaAggregationMapValue = { schema_id: string; aggregation: ViewAggregations } & TSchemaUnit;
export type ISchemaAggregationMap = Map<string, ISchemaAggregationMapValue>;

export type ISchemaSortsMapValue = { schema_id: string; sort: ViewSorts } & TSchemaUnit;
export type ISchemaSortsMap = Map<string, ISchemaSortsMapValue>;

export type ISchemaFiltersMapValue = { schema_id: string; filters: IViewFilter['filters'] } & TSchemaUnit;
export type ISchemaFiltersMap = Map<string, ISchemaFiltersMapValue>;

export type ISchemaFormatMapValue = { schema_id: string; format: ViewFormatProperties } & TSchemaUnit;
export type ISchemaFormatMap = Map<string, ISchemaFormatMapValue>;

export type SchemaFormalPropertiesUpdateInput = Partial<{ position: number; visible: boolean; width: number }>;

export type TSchemaUnitInput = TSchemaUnit;
