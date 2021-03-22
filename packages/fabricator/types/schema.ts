import { FormulaArraySchemaUnitInput, FormulaObjectSchemaUnitInput } from '@nishans/notion-formula';
import {
	CreatedBySchemaUnit,
	CreatedTimeSchemaUnit,
	LastEditedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	RollupSchemaUnit,
	TBasicSchemaUnit,
	TViewType
} from '@nishans/types';

export type SchemaFormatPropertiesUpdateInput =
	| ({ type: 'table' } & Partial<{ position: number; visible: boolean; width: number }>)
	| ({ type: Exclude<TViewType, 'table'> } & Partial<{ position: number; visible: boolean }>);

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
