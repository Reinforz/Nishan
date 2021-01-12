import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	RelationSchemaUnit,
	RollupSchemaUnit,
	TBasicSchemaUnit,
	TSchemaUnit
} from '@nishans/types';
import { TFormulaCreateInput } from './formula';

export type FormulaSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaCreateInput;
};

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export type TSchemaUnitInput =
	| TBasicSchemaUnit
	| RelationSchemaUnit
	| RollupSchemaUnit
	| CreatedTimeSchemaUnit
	| CreatedBySchemaUnit
	| LastEditedTimeSchemaUnit
	| LastEditedBySchemaUnit
	| FormulaSchemaUnitInput;
