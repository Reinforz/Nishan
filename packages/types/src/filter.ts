import { TSchemaUnitType, IViewAggregationsAggregators } from './';

/**
 * Filters operator 
 */
export type EmptyViewFiltersOperator = 'is_empty' | 'is_not_empty';

export type TextViewFiltersOperator =
	| 'string_is'
	| 'string_is_not'
	| 'string_contains'
	| 'string_does_not_contain'
	| 'string_starts_with'
	| 'string_ends_with'
	| EmptyViewFiltersOperator;
export type TitleViewFiltersOperator = TextViewFiltersOperator;
export type NumberViewFiltersOperator =
	| 'number_equals'
	| 'number_does_not_equal'
	| 'number_greater_than'
	| 'number_less_than'
	| 'number_greater_than_or_equal_to'
	| 'number_less_than_or_equal_to'
	| EmptyViewFiltersOperator;
export type SelectViewFiltersOperator = 'enum_is' | 'enum_is_not' | EmptyViewFiltersOperator;
export type MultiSelectViewFiltersOperator = 'enum_contains' | 'enum_does_not_contain' | EmptyViewFiltersOperator;
export type DateViewFiltersOperator =
	| 'date_is'
	| 'date_is_before'
	| 'date_is_after'
	| 'date_is_on_or_before'
	| 'date_is_on_or_after'
	| 'date_is_within'
	| EmptyViewFiltersOperator;
export type PersonViewFiltersOperator = 'person_contains' | 'person_does_not_contain' | EmptyViewFiltersOperator;
export type FileViewFiltersOperator = EmptyViewFiltersOperator;
export type CheckboxViewFiltersOperator = 'checkbox_is' | 'checkbox_is_not';
export type UrlViewFiltersOperator = TextViewFiltersOperator;
export type EmailViewFiltersOperator = TextViewFiltersOperator;
export type PhoneNumberViewFiltersOperator = TextViewFiltersOperator;

export type FormulaViewFiltersOperator = TextViewFiltersOperator;
export type RelationViewFiltersOperator = 'relation_contains' | 'relation_does_not_contain' | EmptyViewFiltersOperator;
export type RollupViewFiltersOperator = undefined;
export type CreatedTimeViewFiltersOperator = DateViewFiltersOperator;
export type CreatedByViewFiltersOperator = PersonViewFiltersOperator;
export type LastEditedTimeViewFiltersOperator = DateViewFiltersOperator;
export type LastEditedByViewFiltersOperator = PersonViewFiltersOperator;

export type TBasicViewFiltersOperator =
	| TextViewFiltersOperator
	| TitleViewFiltersOperator
	| NumberViewFiltersOperator
	| SelectViewFiltersOperator
	| MultiSelectViewFiltersOperator
	| DateViewFiltersOperator
	| PersonViewFiltersOperator
	| FileViewFiltersOperator
	| CheckboxViewFiltersOperator
	| UrlViewFiltersOperator
	| EmailViewFiltersOperator
	| PhoneNumberViewFiltersOperator;

export type TAdvancedViewFiltersOperator =
	| FormulaViewFiltersOperator
	| RelationViewFiltersOperator
	| RollupViewFiltersOperator
	| CreatedTimeViewFiltersOperator
	| CreatedByViewFiltersOperator
	| LastEditedTimeViewFiltersOperator
	| LastEditedByViewFiltersOperator;

export type TViewFiltersOperator = TBasicViewFiltersOperator | TAdvancedViewFiltersOperator;

export type TViewGroupFilterOperator = 'and' | 'or';

export interface IViewFiltersOperator {
	title: TitleViewFiltersOperator;
	text: TextViewFiltersOperator;
	number: NumberViewFiltersOperator;
	select: SelectViewFiltersOperator;
	multi_select: MultiSelectViewFiltersOperator;
	date: DateViewFiltersOperator;
	person: PersonViewFiltersOperator;
	file: FileViewFiltersOperator;
	checkbox: CheckboxViewFiltersOperator;
	url: UrlViewFiltersOperator;
	email: EmailViewFiltersOperator;
	phone_number: PhoneNumberViewFiltersOperator;
	formula: FormulaViewFiltersOperator;
	relation: RelationViewFiltersOperator;
	rollup: RollupViewFiltersOperator;
	created_time: CreatedTimeViewFiltersOperator;
	created_by: CreatedByViewFiltersOperator;
	last_edited_time: LastEditedTimeViewFiltersOperator;
	last_edited_by: LastEditedByViewFiltersOperator;
}

/**
 * Filters type 
 */
export type TitleViewFiltersType = 'exact';
export type TextViewFiltersType = 'exact';
export type NumberViewFiltersType = 'exact';
export type SelectViewFiltersType = 'exact';
export type MultiSelectViewFiltersType = 'exact';
export type DateViewFiltersType = 'relative' | 'exact';
export type PersonViewFiltersType = 'exact';
export type FileViewFiltersType = 'exact';
export type CheckboxViewFiltersType = 'exact';
export type UrlViewFiltersType = 'exact';
export type EmailViewFiltersType = 'exact';
export type PhoneNumberViewFiltersType = 'exact';

export type TBasicViewFiltersType =
	| TitleViewFiltersType
	| TextViewFiltersType
	| NumberViewFiltersType
	| SelectViewFiltersType
	| MultiSelectViewFiltersType
	| DateViewFiltersType
	| PersonViewFiltersType
	| FileViewFiltersType
	| CheckboxViewFiltersType
	| UrlViewFiltersType
	| EmailViewFiltersType
	| PhoneNumberViewFiltersType;

export type FormulaViewFiltersType = 'exact';
export type RelationViewFiltersType = 'exact';
export type RollupViewFiltersType = undefined;
export type CreatedTimeViewFiltersType = 'exact' | 'relative';
export type CreatedByViewFiltersType = 'exact';
export type LastEditedTimeViewFiltersType = 'exact' | 'relative';
export type LastEditedByViewFiltersType = 'exact';

export type TAdvancedViewFiltersType =
	| FormulaViewFiltersType
	| RelationViewFiltersType
	| RollupViewFiltersType
	| CreatedTimeViewFiltersType
	| CreatedByViewFiltersType
	| LastEditedTimeViewFiltersType
	| LastEditedByViewFiltersType;

export type TViewFiltersType = TBasicViewFiltersType | TAdvancedViewFiltersType;

export interface IViewFiltersType {
	title: TitleViewFiltersType;
	text: TextViewFiltersType;
	number: NumberViewFiltersType;
	select: SelectViewFiltersType;
	multi_select: MultiSelectViewFiltersType;
	date: DateViewFiltersType;
	person: PersonViewFiltersType;
	file: FileViewFiltersType;
	checkbox: CheckboxViewFiltersType;
	url: UrlViewFiltersType;
	email: EmailViewFiltersType;
	phone_number: PhoneNumberViewFiltersType;
	formula: FormulaViewFiltersType;
	relation: RelationViewFiltersType;
	rollup: RollupViewFiltersType;
	created_time: CreatedTimeViewFiltersType;
	created_by: CreatedByViewFiltersType;
	last_edited_time: LastEditedTimeViewFiltersType;
	last_edited_by: LastEditedByViewFiltersType;
}

/**
 * Filters value 
 */
export type TitleViewFiltersValue = string;
export type TextViewFiltersValue = string;
export type NumberViewFiltersValue = number;
export type SelectViewFiltersValue = string;
export type MultiSelectViewFiltersValue = string;
export type DateViewFiltersValue =
	| 'today'
	| 'tomorrow'
	| 'yesterday'
	| 'one_week_ago'
	| 'one_week_from_now'
	| 'one_month_ago'
	| 'one_month_from_now'
	| {
			start_date: string;
			type: 'date';
		};
export interface PersonViewFiltersValue {
	id: string;
	table: 'notion_user';
}
export type FileViewFiltersValue = string;
export type CheckboxViewFiltersValue = boolean;
export type UrlViewFiltersValue = string;
export type EmailViewFiltersValue = string;
export type PhoneNumberViewFiltersValue = string;

export type FormulaViewFiltersValue = string;
export type RelationViewFiltersValue = string;
export type RollupViewFiltersValue = undefined;
export type CreatedTimeViewFiltersValue = DateViewFiltersValue;
export type CreatedByViewFiltersValue = PersonViewFiltersValue;
export type LastEditedTimeViewFiltersValue = DateViewFiltersValue;
export type LastEditedByViewFiltersValue = PersonViewFiltersValue;

export type TBasicViewFiltersValue =
	| TitleViewFiltersValue
	| TextViewFiltersValue
	| NumberViewFiltersValue
	| SelectViewFiltersValue
	| MultiSelectViewFiltersValue
	| DateViewFiltersValue
	| PersonViewFiltersValue
	| FileViewFiltersValue
	| CheckboxViewFiltersValue
	| UrlViewFiltersValue
	| EmailViewFiltersValue
	| PhoneNumberViewFiltersValue;

export type TAdvancedViewFiltersValue =
	| FormulaViewFiltersValue
	| RelationViewFiltersValue
	| RollupViewFiltersValue
	| CreatedTimeViewFiltersValue
	| CreatedByViewFiltersValue
	| LastEditedTimeViewFiltersValue
	| LastEditedByViewFiltersValue;

export type TViewFiltersValue = TBasicViewFiltersValue | TAdvancedViewFiltersValue;

export interface IViewFiltersValue {
	title: TitleViewFiltersValue;
	text: TextViewFiltersValue;
	number: NumberViewFiltersValue;
	select: SelectViewFiltersValue;
	multi_select: MultiSelectViewFiltersValue;
	date: DateViewFiltersValue;
	person: PersonViewFiltersValue;
	file: FileViewFiltersValue;
	checkbox: CheckboxViewFiltersValue;
	url: UrlViewFiltersValue;
	email: EmailViewFiltersValue;
	phone_number: PhoneNumberViewFiltersValue;
	formula: FormulaViewFiltersValue;
	relation: RelationViewFiltersValue;
	rollup: RollupViewFiltersValue;
	created_time: CreatedTimeViewFiltersValue;
	created_by: CreatedByViewFiltersValue;
	last_edited_time: LastEditedTimeViewFiltersValue;
	last_edited_by: LastEditedByViewFiltersValue;
}

export interface IViewFilter {
	filters: (TViewFilters | IViewFilter)[];
	operator: 'and' | 'or';
}

export interface IViewFilters<T extends TSchemaUnitType> {
	property: string;
	filter:
		| { operator: EmptyViewFiltersOperator }
		| {
				operator: IViewFilterData<T>['operator'];
				value: {
					type: IViewFilterData<T>['type'];
					value: IViewFilterData<T>['value'];
				};
			};
}

export type TextViewFilters = IViewFilters<'text'>;
export type TitleViewFilters = IViewFilters<'title'>;
export type NumberViewFilters = IViewFilters<'number'>;
export type SelectViewFilters = IViewFilters<'select'>;
export type MultiSelectViewFilters = IViewFilters<'multi_select'>;
export type PersonViewFilters = IViewFilters<'person'>;
export type FileViewFilters = IViewFilters<'file'>;
export type CheckboxViewFilters = IViewFilters<'checkbox'>;
export type UrlViewFilters = IViewFilters<'url'>;
export type EmailViewFilters = IViewFilters<'email'>;
export type PhoneNumberViewFilters = IViewFilters<'phone_number'>;
export interface DateViewFilters {
	property: string;
	filter:
		| { operator: EmptyViewFiltersOperator }
		| {
				operator: 'relative';
				value: DateViewFiltersValue;
			}
		| {
				operator: 'exact';
				value: {
					start_date: string;
					type: 'date';
				};
			};
}

export interface CreatedTimeViewFilters extends DateViewFilters {}
export type CreatedByViewFilters = IViewFilters<'person'>;
export interface LastEditedTimeViewFilters extends DateViewFilters {}
export type EditedByViewFilters = IViewFilters<'person'>;
export type LastEditedByViewFilters = IViewFilters<'person'>;
export type FormulaViewFilters = IViewFilters<'formula'>;
export type RelationViewFilters = IViewFilters<'relation'>;
export type RollupViewFilters = IViewFilters<'rollup'>;

export type TBasicViewFilters =
	| TextViewFilters
	| TitleViewFilters
	| NumberViewFilters
	| SelectViewFilters
	| MultiSelectViewFilters
	| DateViewFilters
	| PersonViewFilters
	| FileViewFilters
	| CheckboxViewFilters
	| UrlViewFilters
	| EmailViewFilters
	| PhoneNumberViewFilters;

export type TAdvancedViewFilters =
	| FormulaViewFilters
	| RelationViewFilters
	| RollupViewFilters
	| CreatedTimeViewFilters
	| CreatedByViewFilters
	| LastEditedTimeViewFilters
	| LastEditedByViewFilters;

export type TViewFilters = TBasicViewFilters | TAdvancedViewFilters;

export interface IViewFilterData<S extends TSchemaUnitType> {
	schema_unit: S;
	operator: IViewFiltersOperator[S];
	type: IViewFiltersType[S];
	value: IViewFiltersValue[S];
	aggregator: IViewAggregationsAggregators[S];
}
