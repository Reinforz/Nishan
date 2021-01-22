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
	| 'string_ends_with';
export type TitleViewFiltersOperator = TextViewFiltersOperator;
export type NumberViewFiltersOperator =
	| 'number_equals'
	| 'number_does_not_equal'
	| 'number_greater_than'
	| 'number_less_than'
	| 'number_greater_than_or_equal_to'
	| 'number_less_than_or_equal_to';
export type SelectViewFiltersOperator = 'enum_is' | 'enum_is_not';
export type MultiSelectViewFiltersOperator = 'enum_contains' | 'enum_does_not_contain';
export type DateViewFiltersOperator =
	| 'date_is'
	| 'date_is_before'
	| 'date_is_after'
	| 'date_is_on_or_before'
	| 'date_is_on_or_after'
	| 'date_is_within';
export type PersonViewFiltersOperator = 'person_contains' | 'person_does_not_contain';
export type FileViewFiltersOperator = EmptyViewFiltersOperator;
export type CheckboxViewFiltersOperator = 'checkbox_is' | 'checkbox_is_not';
export type UrlViewFiltersOperator = TextViewFiltersOperator;
export type EmailViewFiltersOperator = TextViewFiltersOperator;
export type PhoneNumberViewFiltersOperator = TextViewFiltersOperator;

export type FormulaViewFiltersOperator = TextViewFiltersOperator;
export type RelationViewFiltersOperator = 'relation_contains' | 'relation_does_not_contain';
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
	| CreatedTimeViewFiltersOperator
	| CreatedByViewFiltersOperator
	| LastEditedTimeViewFiltersOperator
	| LastEditedByViewFiltersOperator;

export type TViewFiltersOperator = TBasicViewFiltersOperator | TAdvancedViewFiltersOperator;

export type TViewGroupFilterOperator = 'and' | 'or';

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
export type CreatedTimeViewFiltersType = 'exact' | 'relative';
export type CreatedByViewFiltersType = 'exact';
export type LastEditedTimeViewFiltersType = 'exact' | 'relative';
export type LastEditedByViewFiltersType = 'exact';

export type TAdvancedViewFiltersType =
	| FormulaViewFiltersType
	| RelationViewFiltersType
	| CreatedTimeViewFiltersType
	| CreatedByViewFiltersType
	| LastEditedTimeViewFiltersType
	| LastEditedByViewFiltersType;

export type TViewFiltersType = TBasicViewFiltersType | TAdvancedViewFiltersType;

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
	| 'one_month_from_now';
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
	| CreatedTimeViewFiltersValue
	| CreatedByViewFiltersValue
	| LastEditedTimeViewFiltersValue
	| LastEditedByViewFiltersValue;

export type TViewFiltersValue = TBasicViewFiltersValue | TAdvancedViewFiltersValue;

export interface IViewFilter {
	filters: (TViewFilters | IViewFilter)[];
	operator: 'and' | 'or';
}

export interface IViewFilters<O, T, V> {
	property: string;
	filter:
		| {
				operator: O;
				value: {
					type: T;
					value: V;
				};
			}
		| { operator: EmptyViewFiltersOperator };
}

export type TextViewFilters = IViewFilters<TextViewFiltersOperator, TextViewFiltersType, TextViewFiltersValue>;
export type TitleViewFilters = IViewFilters<TitleViewFiltersOperator, TitleViewFiltersType, TitleViewFiltersValue>;
export type NumberViewFilters = IViewFilters<NumberViewFiltersOperator, NumberViewFiltersType, NumberViewFiltersValue>;
export type SelectViewFilters = IViewFilters<SelectViewFiltersOperator, SelectViewFiltersType, SelectViewFiltersValue>;
export type MultiSelectViewFilters = IViewFilters<
	MultiSelectViewFiltersOperator,
	MultiSelectViewFiltersType,
	MultiSelectViewFiltersValue
>;
export type PersonViewFilters = IViewFilters<PersonViewFiltersOperator, PersonViewFiltersType, PersonViewFiltersValue>;
export type FileViewFilters = IViewFilters<FileViewFiltersOperator, FileViewFiltersType, FileViewFiltersValue>;
export type CheckboxViewFilters = IViewFilters<
	CheckboxViewFiltersOperator,
	CheckboxViewFiltersType,
	CheckboxViewFiltersValue
>;
export type UrlViewFilters = IViewFilters<UrlViewFiltersOperator, UrlViewFiltersType, UrlViewFiltersValue>;
export type EmailViewFilters = IViewFilters<EmailViewFiltersOperator, EmailViewFiltersType, EmailViewFiltersValue>;
export type PhoneNumberViewFilters = IViewFilters<
	PhoneNumberViewFiltersOperator,
	PhoneNumberViewFiltersType,
	PhoneNumberViewFiltersValue
>;
export interface DateViewFilters {
	property: string;
	filter:
		| { operator: EmptyViewFiltersOperator }
		| {
				operator: DateViewFiltersOperator;
				value:
					| {
							value: DateViewFiltersValue;
							type: 'relative';
						}
					| {
							start_date: string;
							type: 'exact';
						};
			};
}

export interface CreatedTimeViewFilters extends DateViewFilters {}
export type CreatedByViewFilters = IViewFilters<
	CreatedByViewFiltersOperator,
	CreatedByViewFiltersType,
	CreatedByViewFiltersValue
>;
export interface LastEditedTimeViewFilters extends DateViewFilters {}
export type LastEditedByViewFilters = IViewFilters<
	LastEditedByViewFiltersOperator,
	LastEditedByViewFiltersType,
	LastEditedByViewFiltersValue
>;
export type FormulaViewFilters = NumberViewFilters | CheckboxViewFilters | TextViewFilters | DateViewFilters;
export type RelationViewFilters = IViewFilters<
	RelationViewFiltersOperator,
	RelationViewFiltersType,
	RelationViewFiltersValue
>;
export type RollupViewFilters = TViewFilters;

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
	| CreatedTimeViewFilters
	| CreatedByViewFilters
	| LastEditedTimeViewFilters
	| LastEditedByViewFilters;

export type TViewFilters = TBasicViewFilters | TAdvancedViewFilters;

export interface IViewFilterData {
	title: TitleViewFilters;
	text: TextViewFilters;
	number: NumberViewFilters;
	select: SelectViewFilters;
	multi_select: MultiSelectViewFilters;
	date: DateViewFilters;
	person: PersonViewFilters;
	file: FileViewFilters;
	checkbox: CheckboxViewFilters;
	url: UrlViewFilters;
	email: EmailViewFilters;
	phone_number: PhoneNumberViewFilters;
	formula: FormulaViewFilters;
	relation: RelationViewFilters;
	rollup: RollupViewFilters;
	created_time: CreatedTimeViewFilters;
	created_by: CreatedByViewFilters;
	last_edited_time: LastEditedTimeViewFilters;
	last_edited_by: LastEditedByViewFilters;
}
