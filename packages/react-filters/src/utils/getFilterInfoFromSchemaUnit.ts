import {
	CheckboxViewFiltersOperator,
	DateViewFiltersOperator,
	EmptyViewFiltersOperator,
	MultiSelectViewFiltersOperator,
	NumberViewFiltersOperator,
	PersonViewFiltersOperator,
	RelationViewFiltersOperator,
	SelectViewFiltersOperator,
	TextViewFiltersOperator,
	TSchemaUnitType,
	TViewFiltersOperator
} from '@nishans/types';

type FilterInfo<V extends TViewFiltersOperator> = { value: V; label: string }[];

type TFilterInfo =
	| FilterInfo<EmptyViewFiltersOperator>
	| FilterInfo<TextViewFiltersOperator | EmptyViewFiltersOperator>
	| FilterInfo<NumberViewFiltersOperator | EmptyViewFiltersOperator>
	| FilterInfo<PersonViewFiltersOperator | EmptyViewFiltersOperator>
	| FilterInfo<DateViewFiltersOperator | EmptyViewFiltersOperator>
	| FilterInfo<CheckboxViewFiltersOperator>
	| FilterInfo<RelationViewFiltersOperator>
	| FilterInfo<MultiSelectViewFiltersOperator | EmptyViewFiltersOperator>
	| FilterInfo<SelectViewFiltersOperator | EmptyViewFiltersOperator>;

const empty_filter_operators: FilterInfo<EmptyViewFiltersOperator> = [
	{
		value: 'is_empty',
		label: 'Is empty'
	},
	{
		value: 'is_not_empty',
		label: 'Is not empty'
	}
];

const string_filter_operators: FilterInfo<TextViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		value: 'string_is',
		label: 'Is'
	},
	{
		value: 'string_is_not',
		label: 'Is not'
	},
	{
		value: 'string_contains',
		label: 'Contains'
	},
	{
		value: 'string_does_not_contain',
		label: 'Does not contain'
	},
	{
		value: 'string_starts_with',
		label: 'Starts with'
	},
	{
		value: 'string_ends_with',
		label: 'Ends with'
	},
	...empty_filter_operators
];

const number_filter_operators: FilterInfo<NumberViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		label: '=',
		value: 'number_equals'
	},
	{
		label: '≠',
		value: 'number_does_not_equal'
	},
	{
		label: '>',
		value: 'number_greater_than'
	},
	{
		label: '<',
		value: 'number_less_than'
	},
	{
		label: '≥',
		value: 'number_greater_than_or_equal_to'
	},
	{
		label: '≤',
		value: 'number_less_than_or_equal_to'
	},
	...empty_filter_operators
];

const date_filter_operators: FilterInfo<DateViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		value: 'date_is',
		label: 'Is'
	},
	{
		value: 'date_is_before',
		label: 'Is before'
	},
	{
		value: 'date_is_after',
		label: 'Is After'
	},
	{
		value: 'date_is_on_or_before',
		label: 'Is on or before'
	},
	{
		value: 'date_is_on_or_after',
		label: 'Is on or after'
	},
	{
		value: 'date_is_within',
		label: 'Is within'
	},
	...empty_filter_operators
];

const person_filter_operators: FilterInfo<PersonViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		value: 'person_contains',
		label: 'Contains'
	},
	{
		value: 'person_does_not_contain',
		label: 'Does not contain'
	},
	...empty_filter_operators
];

const checkbox_filter_operators: FilterInfo<CheckboxViewFiltersOperator> = [
	{
		value: 'checkbox_is',
		label: 'Is'
	},
	{
		value: 'checkbox_is_not',
		label: 'Is not'
	}
];

const relation_filter_operators: FilterInfo<RelationViewFiltersOperator> = [
	{
		value: 'relation_contains',
		label: 'Contains'
	},
	{
		value: 'relation_does_not_contain',
		label: 'Does not contain'
	}
];

const multi_select_filter_operators: FilterInfo<MultiSelectViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		value: 'enum_contains',
		label: 'Contains'
	},
	{
		value: 'enum_does_not_contain',
		label: 'Does not contain'
	},
	...empty_filter_operators
];

const select_filter_operators: FilterInfo<SelectViewFiltersOperator | EmptyViewFiltersOperator> = [
	{
		value: 'enum_is',
		label: 'Is'
	},
	{
		value: 'enum_is_not',
		label: 'Is not'
	},
	...empty_filter_operators
];

export function getFilterInfo (schema_type: TSchemaUnitType): TFilterInfo {
	switch (schema_type) {
		case 'text':
		case 'title':
		case 'url':
		case 'email':
		case 'phone_number':
			return string_filter_operators;
		case 'number':
			return number_filter_operators;
		case 'select':
			return select_filter_operators;
		case 'multi_select':
			return multi_select_filter_operators;
		case 'date':
		case 'created_time':
		case 'last_edited_time':
			return date_filter_operators;
		case 'person':
		case 'last_edited_by':
		case 'created_by':
			return person_filter_operators;
		case 'file':
			return empty_filter_operators;
		case 'checkbox':
			return checkbox_filter_operators;
		case 'relation':
			return relation_filter_operators;
		default:
			return empty_filter_operators;
	}
}
