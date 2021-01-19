import {
	CheckboxViewFiltersOperator,
	DateViewFiltersOperator,
	EmptyViewFiltersOperator,
	MultiSelectSchemaUnit,
	MultiSelectViewFiltersOperator,
	NumberViewFiltersOperator,
	PersonViewFiltersOperator,
	RelationViewFiltersOperator,
	SelectOption,
	SelectSchemaUnit,
	SelectViewFiltersOperator,
	TextViewFiltersOperator,
	TSchemaUnit,
	TSchemaUnitType,
	TViewFiltersOperator
} from '@nishans/types';

import { TFilterItemValue } from '../types';

type IFilterInfo<V extends TViewFiltersOperator> = { operator: V; label: string; value: TFilterItemValue }[];

type TFilterInfo =
	| IFilterInfo<EmptyViewFiltersOperator>
	| IFilterInfo<TextViewFiltersOperator | EmptyViewFiltersOperator>
	| IFilterInfo<NumberViewFiltersOperator | EmptyViewFiltersOperator>
	| IFilterInfo<PersonViewFiltersOperator | EmptyViewFiltersOperator>
	| IFilterInfo<DateViewFiltersOperator | EmptyViewFiltersOperator>
	| IFilterInfo<CheckboxViewFiltersOperator>
	| IFilterInfo<RelationViewFiltersOperator>
	| IFilterInfo<MultiSelectViewFiltersOperator | EmptyViewFiltersOperator>
	| IFilterInfo<SelectViewFiltersOperator | EmptyViewFiltersOperator>;

const empty_filter_info: IFilterInfo<EmptyViewFiltersOperator> = [
	{
		operator: 'is_empty',
		label: 'Is empty',
		value: null
	},
	{
		operator: 'is_not_empty',
		label: 'Is not empty',
		value: null
	}
];

const string_filter_info: IFilterInfo<TextViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		operator: 'string_is',
		label: 'Is',
		value: 'string'
	},
	{
		operator: 'string_is_not',
		label: 'Is not',
		value: 'string'
	},
	{
		operator: 'string_contains',
		label: 'Contains',
		value: 'string'
	},
	{
		operator: 'string_does_not_contain',
		label: 'Does not contain',
		value: 'string'
	},
	{
		operator: 'string_starts_with',
		label: 'Starts with',
		value: 'string'
	},
	{
		operator: 'string_ends_with',
		label: 'Ends with',
		value: 'string'
	},
	...empty_filter_info
];

const number_filter_info: IFilterInfo<NumberViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		label: '=',
		operator: 'number_equals',
		value: 'number'
	},
	{
		label: '≠',
		operator: 'number_does_not_equal',
		value: 'number'
	},
	{
		label: '>',
		operator: 'number_greater_than',
		value: 'number'
	},
	{
		label: '<',
		operator: 'number_less_than',
		value: 'number'
	},
	{
		label: '≥',
		operator: 'number_greater_than_or_equal_to',
		value: 'number'
	},
	{
		label: '≤',
		operator: 'number_less_than_or_equal_to',
		value: 'number'
	},
	...empty_filter_info
];

const date_filter_info: IFilterInfo<DateViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		operator: 'date_is',
		label: 'Is',
		value: 'date'
	},
	{
		operator: 'date_is_before',
		label: 'Is before',
		value: 'date'
	},
	{
		operator: 'date_is_after',
		label: 'Is After',
		value: 'date'
	},
	{
		operator: 'date_is_on_or_before',
		label: 'Is on or before',
		value: 'date'
	},
	{
		operator: 'date_is_on_or_after',
		label: 'Is on or after',
		value: 'date'
	},
	{
		operator: 'date_is_within',
		label: 'Is within',
		value: 'date'
	},
	...empty_filter_info
];

const person_filter_operators: IFilterInfo<PersonViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		operator: 'person_contains',
		label: 'Contains',
		value: 'options'
	},
	{
		operator: 'person_does_not_contain',
		label: 'Does not contain',
		value: 'options'
	},
	...empty_filter_info
];

const checkbox_filter_operators: IFilterInfo<CheckboxViewFiltersOperator> = [
	{
		operator: 'checkbox_is',
		value: 'checkbox',
		label: 'Is'
	},
	{
		operator: 'checkbox_is_not',
		value: 'checkbox',
		label: 'Is not'
	}
];

const relation_filter_operators: IFilterInfo<RelationViewFiltersOperator> = [
	{
		operator: 'relation_contains',
		value: 'options',
		label: 'Contains'
	},
	{
		operator: 'relation_does_not_contain',
		value: 'options',
		label: 'Does not contain'
	}
];

const createMultiSelectFilterInfos = (
	options: SelectOption[]
): IFilterInfo<MultiSelectViewFiltersOperator | EmptyViewFiltersOperator> => {
	return [
		{
			operator: 'enum_contains',
			value: options,
			label: 'Contains'
		},
		{
			operator: 'enum_does_not_contain',
			value: options,
			label: 'Does not contain'
		},
		...empty_filter_info
	];
};

const createSelectFilterInfos = (
	options: SelectOption[]
): IFilterInfo<SelectViewFiltersOperator | EmptyViewFiltersOperator> => {
	return [
		{
			operator: 'enum_is',
			value: options,
			label: 'Is'
		},
		{
			operator: 'enum_is_not',
			value: options,
			label: 'Is not'
		},
		...empty_filter_info
	];
};

export function getFilterInfo (schema_unit: TSchemaUnit): TFilterInfo {
	function inner (schema_type: TSchemaUnitType) {
		switch (schema_type) {
			case 'text':
			case 'title':
			case 'url':
			case 'email':
			case 'phone_number':
				return string_filter_info;
			case 'number':
				return number_filter_info;
			case 'select':
				return createSelectFilterInfos((schema_unit as SelectSchemaUnit).options);
			case 'multi_select':
				return createMultiSelectFilterInfos((schema_unit as MultiSelectSchemaUnit).options);
			case 'date':
			case 'created_time':
			case 'last_edited_time':
				return date_filter_info;
			case 'person':
			case 'last_edited_by':
			case 'created_by':
				return person_filter_operators;
			case 'file':
				return empty_filter_info;
			case 'checkbox':
				return checkbox_filter_operators;
			case 'relation':
				return relation_filter_operators;
			default:
				return empty_filter_info;
		}
	}
	return schema_unit.type !== 'formula' ? inner(schema_unit.type) : inner(schema_unit.formula.result_type);
}
