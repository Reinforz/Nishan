import { TSchemaUnitType, SelectOption } from '@nishans/types';
import { TFormulaCreateInput } from './formula';

export type ISchemaUnitInput<T extends TSchemaUnitType, O extends any = undefined> = [string, T, O];

/* Basic Schema Units */

export type TextSchemaUnitInput = ISchemaUnitInput<'text'>;
export type NumberSchemaUnitInput = ISchemaUnitInput<'number'>;
export type SelectSchemaUnitInput = ISchemaUnitInput<
	'select',
	{
		options: SelectOption[];
	}
>;
export type MultiSelectSchemaUnitInput = ISchemaUnitInput<
	'multi_select',
	{
		options: SelectOption[];
	}
>;
export type TitleSchemaUnitInput = ISchemaUnitInput<'title'>;
export type DateSchemaUnitInput = ISchemaUnitInput<'date'>;
export type PersonSchemaUnitInput = ISchemaUnitInput<'person'>;
export type FileSchemaUnitInput = ISchemaUnitInput<'file'>;
export type CheckboxSchemaUnitInput = ISchemaUnitInput<'checkbox'>;
export type UrlSchemaUnitInput = ISchemaUnitInput<'url'>;
export type EmailSchemaUnitInput = ISchemaUnitInput<'email'>;
export type PhoneNumberSchemaUnitInput = ISchemaUnitInput<'phone_number'>;
export type FormulaSchemaUnitInput = ISchemaUnitInput<'formula', { formula: TFormulaCreateInput }>;
export type RelationSchemaUnitInput = ISchemaUnitInput<
	'relation',
	{
		collection_id: string;
		property: string;
	}
>;
export type RollupSchemaUnitInput = ISchemaUnitInput<
	'rollup',
	{
		collection_id: string;
		property: string;
		relation_property: string;
		target_property: string;
		target_property_type: TSchemaUnitType;
	}
>;
export type CreatedTimeSchemaUnitInput = ISchemaUnitInput<'created_time'>;
export type CreatedBySchemaUnitInput = ISchemaUnitInput<'created_by'>;
export type LastEditedTimeSchemaUnitInput = ISchemaUnitInput<'last_edited_time'>;
export type LastEditedBySchemaUnitInput = ISchemaUnitInput<'last_edited_by'>;

export type TBasicSchemaUnitInput =
	| TextSchemaUnitInput
	| NumberSchemaUnitInput
	| SelectSchemaUnitInput
	| MultiSelectSchemaUnitInput
	| TitleSchemaUnitInput
	| DateSchemaUnitInput
	| PersonSchemaUnitInput
	| FileSchemaUnitInput
	| CheckboxSchemaUnitInput
	| UrlSchemaUnitInput
	| EmailSchemaUnitInput
	| PhoneNumberSchemaUnitInput;

export type TAdvancedSchemaUnitInput =
	| FormulaSchemaUnitInput
	| RelationSchemaUnitInput
	| RollupSchemaUnitInput
	| CreatedTimeSchemaUnitInput
	| CreatedBySchemaUnitInput
	| LastEditedTimeSchemaUnitInput
	| LastEditedBySchemaUnitInput;

export type TSchemaUnitInput = TBasicSchemaUnitInput | TAdvancedSchemaUnitInput;
