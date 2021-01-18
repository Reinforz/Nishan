import {
	DateViewFiltersOperator,
	EmptyViewFiltersOperator,
	NumberViewFiltersOperator,
	PersonViewFiltersOperator,
	TextViewFiltersOperator,
	TSchemaUnitType
} from '@nishans/types';

type FilterInfo<V> = { value: V; label: string }[];

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
	{
		value: 'is_empty',
		label: 'Is empty'
	},
	{
		value: 'is_not_empty',
		label: 'Is not empty'
	}
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
	{
		value: 'is_empty',
		label: 'Is empty'
	},
	{
		value: 'is_not_empty',
		label: 'Is not empty'
	}
];

const date_filter_operators: DateViewFiltersOperator[] = [
	'date_is',
	'date_is_before',
	'date_is_after',
	'date_is_on_or_before',
	'date_is_on_or_after',
	'date_is_within'
];

const person_filter_operators: PersonViewFiltersOperator[] = [ 'person_contains', 'person_does_not_contain' ];
const empty_filter_operators: EmptyViewFiltersOperator[] = [ 'is_empty', 'is_not_empty' ];

export function getFilterInfo (schema_type: TSchemaUnitType) {
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
			return [ 'enum_is', 'enum_is_not' ];
		case 'multi_select':
			return [ 'enum_contains', 'enum_does_not_contain' ];
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
			return [ 'checkbox_is', 'checkbox_is_not' ];
		case 'relation':
			return [ 'relation_contains', 'relation_does_not_contain' ];
	}
}
