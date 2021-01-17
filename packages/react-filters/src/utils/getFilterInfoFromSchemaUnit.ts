import {
	DateViewFiltersOperator,
	EmptyViewFiltersOperator,
	NumberViewFiltersOperator,
	PersonViewFiltersOperator,
	TextViewFiltersOperator,
	TSchemaUnitType
} from '@nishans/types';

const string_filter_operators: TextViewFiltersOperator[] = [
	'string_is',
	'string_is_not',
	'string_contains',
	'string_does_not_contain',
	'string_starts_with',
	'string_ends_with'
];

const number_filter_operators: NumberViewFiltersOperator[] = [
	'number_equals',
	'number_does_not_equal',
	'number_greater_than',
	'number_less_than',
	'number_greater_than_or_equal_to',
	'number_less_than_or_equal_to'
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
