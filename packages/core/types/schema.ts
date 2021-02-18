import { FormulaArraySchemaUnitInput, FormulaObjectSchemaUnitInput } from '@nishans/notion-formula';
import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	IViewFilter,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	RollupSchemaUnit,
	TBasicSchemaUnit,
	TSchemaUnit,
	TViewFilters,
	ViewAggregations,
	ViewFormatProperties,
	ViewSorts
} from '@nishans/types';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export type ISchemaAggregationMapValue = {
	schema_id: string;
	aggregation: ViewAggregations;
} & TSchemaUnit;
export type ISchemaAggregationMap = Map<string, ISchemaAggregationMapValue>;

export type ISchemaSortsMapValue = { schema_id: string; sort: ViewSorts['direction'] } & TSchemaUnit;
export type ISchemaSortsMap = Map<string, ISchemaSortsMapValue>;

export type ISchemaFiltersMapValue = {
	schema_id: string;
	parent_filter: IViewFilter;
	child_filter: TViewFilters;
} & TSchemaUnit;
export type ISchemaFiltersMap = Map<string, ISchemaFiltersMapValue>;

export type ISchemaFormatMapValue = { schema_id: string; format: Omit<ViewFormatProperties, 'property'> } & TSchemaUnit;
export type ISchemaFormatMap = Map<string, ISchemaFormatMapValue>;

export type SchemaFormatPropertiesUpdateInput = Partial<{ position: number; visible: boolean; width: number }>;

export type TFormulaSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: [

			| FormulaArraySchemaUnitInput['formula']
			| FormulaObjectSchemaUnitInput['formula']
			| boolean
			| 'e'
			| 'pi'
			| string
			| number
			| { property: string },
		'object' | 'array' | 'string'
	];
};

export type TRelationSchemaUnitInput = {
	// Type of the schema unit
	type: 'relation';
	// The collection id of the child collection
	collection_id: string;
	// The name of the parent collection column
	name: string;
	// The new name that will be set for the created column in the child
	relation_schema_unit_name?: string;
};

export type TRollupSchemaUnitInput = Omit<RollupSchemaUnit, 'target_property_type'>;

export type TSchemaUnitInput =
	| TRelationSchemaUnitInput
	| TBasicSchemaUnit
	| TRollupSchemaUnitInput
	| TFormulaSchemaUnitInput
	| CreatedTimeSchemaUnit
	| CreatedBySchemaUnit
	| LastEditedTimeSchemaUnit
	| LastEditedBySchemaUnit;
