import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	RelationSchemaUnit,
	RollupSchemaUnit,
	TBasicSchemaUnit,
	TSchemaUnit,
	ViewAggregations,
	ViewSorts
} from '@nishans/types';
import { TFormulaCreateInput } from './formula';

export type FormulaSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaCreateInput;
};

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export type ISchemaAggregationMapValue = { schema_id: string; aggregation: ViewAggregations } & TSchemaUnit;
export type ISchemaAggregationMap = Map<string, ISchemaAggregationMapValue>;

export type ISchemaSortsMapValue = { schema_id: string; sort: ViewSorts } & TSchemaUnit;
export type ISchemaSortsMap = Map<string, ISchemaSortsMapValue>;

export type TSchemaUnitInput =
	| TBasicSchemaUnit
	| RelationSchemaUnit
	| RollupSchemaUnit
	| CreatedTimeSchemaUnit
	| CreatedBySchemaUnit
	| LastEditedTimeSchemaUnit
	| LastEditedBySchemaUnit
	| FormulaSchemaUnitInput;
