import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	RelationSchemaUnit,
	RollupSchemaUnit,
	TBasicSchemaUnit
} from '@nishans/types';
import { TFormulaCreateInput } from './formula';

export type FormulaSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaCreateInput;
};

export type TSchemaUnitInput =
	| TBasicSchemaUnit
	| RelationSchemaUnit
	| RollupSchemaUnit
	| CreatedTimeSchemaUnit
	| CreatedBySchemaUnit
	| LastEditedTimeSchemaUnit
	| LastEditedBySchemaUnit
	| FormulaSchemaUnitInput;
