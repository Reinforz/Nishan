/**
 * Filters.filter.operator 
 */
export type EmptyViewFiltersOperator = "is_empty" | "is_not_empty";

export type TextViewFiltersOperator = "string_is" | "string_is_not" | "string_contains" | "string_does_not_contain" | "string_starts_with" | "string_ends_with" | EmptyViewFiltersOperator;
export type TitleViewFiltersOperator = TextViewFiltersOperator;
export type NumericViewFiltersOperator = "number_equals" | "number_does_not_equal" | "number_greater_than" | "number_less_than" | "number_greater_than_or_equal_to" | "number_less_than_or_equal_to" | EmptyViewFiltersOperator;
export type EnumViewFiltersOperator = "enum_is" | "enum_is_not" | EmptyViewFiltersOperator;
export type EnumsViewFiltersOperator = "enum_contains" | "enum_does_not_contain" | EmptyViewFiltersOperator;
export type DateViewFiltersOperator = "date_is" | "date_is_before" | "date_is_after" | "date_is_on_or_before" | "date_is_on_or_after" | "date_is_within" | EmptyViewFiltersOperator;
export type PersonViewFiltersOperator = "person_contains" | "person_does_not_contain" | EmptyViewFiltersOperator;
export type FileViewFiltersOperator = EmptyViewFiltersOperator;
export type CheckboxViewFiltersOperator = "checkbox_is" | "checkbox_is_not";
export type UrlViewFiltersOperator = TextViewFiltersOperator;
export type EmailViewFiltersOperator = TextViewFiltersOperator;
export type PhoneViewFiltersOperator = TextViewFiltersOperator;

export type FormulaViewFiltersOperator = TextViewFiltersOperator;
export type RelationViewFiltersOperator = "relation_contains" | "relation_does_not_contain" | EmptyViewFiltersOperator;
export type RollupViewFiltersOperator = undefined;
export type CreatedTimeViewFiltersOperator = DateViewFiltersOperator;
export type CreatedByViewFiltersOperator = PersonViewFiltersOperator;
export type LastEditedTimeViewFiltersOperator = DateViewFiltersOperator;
export type LastEditedByViewFiltersOperator = PersonViewFiltersOperator;

export type TBasicViewFiltersOperator =
  TextViewFiltersOperator |
  TitleViewFiltersOperator |
  NumericViewFiltersOperator |
  EnumViewFiltersOperator |
  EnumsViewFiltersOperator |
  DateViewFiltersOperator |
  PersonViewFiltersOperator |
  FileViewFiltersOperator |
  CheckboxViewFiltersOperator |
  UrlViewFiltersOperator |
  EmailViewFiltersOperator |
  PhoneViewFiltersOperator;

export type TAdvancedViewFiltersOperator =
  FormulaViewFiltersOperator |
  RelationViewFiltersOperator |
  RollupViewFiltersOperator |
  CreatedTimeViewFiltersOperator |
  CreatedByViewFiltersOperator |
  LastEditedTimeViewFiltersOperator |
  LastEditedByViewFiltersOperator;

export type TViewFiltersOperator = TBasicViewFiltersOperator | TAdvancedViewFiltersOperator;

/**
 * Filters.filter.value.type 
 */
export type TitleViewFiltersType = "exact";
export type TextViewFiltersType = "exact";
export type NumericViewFiltersType = "exact";
export type EnumViewFiltersType = "exact";
export type EnumsViewFiltersType = "exact";
export type DateViewFiltersType = "relative" | "exact";
export type PersonViewFiltersType = "exact";
export type FileViewFiltersType = "exact";
export type CheckboxViewFiltersType = "exact";
export type UrlViewFiltersType = "exact";
export type EmailViewFiltersType = "exact";
export type PhoneViewFiltersType = "exact";

export type TBasicViewFiltersType =
  TitleViewFiltersType |
  TextViewFiltersType |
  NumericViewFiltersType |
  EnumViewFiltersType |
  EnumsViewFiltersType |
  DateViewFiltersType |
  PersonViewFiltersType |
  FileViewFiltersType |
  CheckboxViewFiltersType |
  UrlViewFiltersType |
  EmailViewFiltersType |
  PhoneViewFiltersType;

export type FormulaViewFiltersType = "exact";
export type RelationViewFiltersType = "exact";
export type RollupViewFiltersType = undefined;
export type CreatedTimeViewFiltersType = "exact" | "relative";
export type CreatedByViewFiltersType = "exact";
export type LastEditedTimeViewFiltersType = "exact" | "relative";
export type LastEditedByViewFiltersType = "exact";

export type TAdvancedViewFiltersType =
  FormulaViewFiltersType |
  RelationViewFiltersType |
  RollupViewFiltersType |
  CreatedTimeViewFiltersType |
  CreatedByViewFiltersType |
  LastEditedTimeViewFiltersType |
  LastEditedByViewFiltersType;

export type TViewFiltersType =
  TBasicViewFiltersType | TAdvancedViewFiltersType;

/**
 * Filters.filter.value.value 
 */
export type TitleViewFiltersValue = string;
export type TextViewFiltersValue = string;
export type NumericViewFiltersValue = number;
export type EnumViewFiltersValue = string
export type EnumsViewFiltersValue = string
export type DateViewFiltersValue = "today" | "tomorrow" | "yesterday" | "one_week_ago" | "one_week_from_now" | "one_month_ago" | "one_month_from_now" | {
  start_date: string,
  type: "date"
};
export interface PersonViewFiltersValue {
  id: string,
  table: "notion_user"
}
export interface FileViewFiltersValue { };
export type CheckboxViewFiltersValue = boolean;
export type UrlViewFiltersValue = string;
export type EmailViewFiltersValue = string;
export type PhoneViewFiltersValue = string;

export type FormulaViewFiltersValue = string;
export type RelationViewFiltersValue = string;
export type RollupViewFiltersValue = undefined;
export type CreatedTimeViewFiltersValue = DateViewFiltersValue;
export type CreatedByViewFiltersValue = PersonViewFiltersValue;
export type LastEditedTimeViewFiltersValue = DateViewFiltersValue;
export type LastEditedByViewFiltersValue = PersonViewFiltersValue;

export type TBasicViewFiltersValue =
  TitleViewFiltersValue |
  TextViewFiltersValue |
  NumericViewFiltersValue |
  EnumViewFiltersValue |
  EnumsViewFiltersValue |
  DateViewFiltersValue |
  PersonViewFiltersValue |
  FileViewFiltersValue |
  CheckboxViewFiltersValue |
  UrlViewFiltersValue |
  EmailViewFiltersValue |
  PhoneViewFiltersValue;

export type TAdvancedViewFiltersValue =
  FormulaViewFiltersValue |
  RelationViewFiltersValue |
  RollupViewFiltersValue |
  CreatedTimeViewFiltersValue |
  CreatedByViewFiltersValue |
  LastEditedTimeViewFiltersValue |
  LastEditedByViewFiltersValue;

export type TViewFiltersValue = TBasicViewFiltersValue | TAdvancedViewFiltersValue;

export interface IViewFilter {
  filters: (IViewFilters | IViewFilter)[],
  operator: "and" | "or"
}

export interface IViewFilters<O extends TViewFiltersOperator = Exclude<TViewFiltersOperator, "is_empty" | "is_not_empty">, V extends TViewFiltersValue = TViewFiltersValue, T extends TViewFiltersType = "exact"> {
  property: string,
  filter: { operator: EmptyViewFiltersOperator } | {
    operator: O,
    value: {
      type: T,
      value: V
    }
  }
}

export interface TextViewFilters extends IViewFilters<TextViewFiltersOperator, TextViewFiltersValue> { };
export interface NumericViewFilters extends IViewFilters<NumericViewFiltersOperator, NumericViewFiltersValue> { };
export interface EnumViewFilters extends IViewFilters<EnumViewFiltersOperator, EnumViewFiltersValue> { };
export interface EnumsViewFilters extends IViewFilters<EnumsViewFiltersOperator, EnumsViewFiltersValue> { };
export interface DateViewFilters {
  property: string,
  filter: { operator: EmptyViewFiltersOperator } | {
    operator: "relative",
    value: DateViewFiltersValue
  } | {
    operator: "exact",
    value: {
      start_date: string,
      type: "date"
    }
  }
};

export interface PersonViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };
export interface FileViewFilters extends IViewFilters<FileViewFiltersOperator, FileViewFiltersValue> { };
export interface FileViewFilters extends IViewFilters<FileViewFiltersOperator, FileViewFiltersValue> { };
export interface CheckboxViewFilters extends IViewFilters<CheckboxViewFiltersOperator, CheckboxViewFiltersValue> { };
export interface UrlViewFilters extends IViewFilters<UrlViewFiltersOperator, UrlViewFiltersValue> { };
export interface EmailViewFilters extends IViewFilters<EmailViewFiltersOperator, EmailViewFiltersValue> { };
export interface PhoneViewFilters extends IViewFilters<PhoneViewFiltersOperator, PhoneViewFiltersValue> { };

export interface CreatedTimeViewFilters extends DateViewFilters { };
export interface CreatedByViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };
export interface LastEditedTimeViewFilters extends DateViewFilters { }
export interface EditedByViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };

export type TBasicViewFilters =
  TextViewFilters |
  NumericViewFilters |
  EnumViewFilters |
  EnumsViewFilters |
  DateViewFilters |
  PersonViewFilters |
  FileViewFilters |
  CheckboxViewFilters |
  UrlViewFilters |
  EmailViewFilters |
  PhoneViewFilters;

export type TAdvancedViewFilters =
  FormulaViewFiltersValue |
  RelationViewFiltersValue |
  RollupViewFiltersValue |
  CreatedTimeViewFiltersValue |
  CreatedByViewFiltersValue |
  LastEditedTimeViewFiltersValue |
  LastEditedByViewFiltersValue;

export type TViewFilters = TBasicViewFilters | TAdvancedViewFilters;