export type EmptyViewFiltersOperator = "is_empty" | "is_not_empty";
export type TextViewFiltersOperator = "string_is" | "string_is_not" | "string_contains" | "string_does_not_contain" | "string_starts_with" | "string_ends_with" | EmptyViewFiltersOperator;
export type NumericViewFiltersOperator = "number_equals" | "number_does_not_equal" | "number_greater_than" | "number_less_than" | "number_greater_than_or_equal_to" | "number_less_than_or_equal_to" | EmptyViewFiltersOperator;
export type EnumViewFiltersOperator = "enum_is" | "enum_is_not" | EmptyViewFiltersOperator;
export type EnumsViewFiltersOperator = "enum_contains" | "enum_does_not_contain" | EmptyViewFiltersOperator;
export type DateViewFiltersOperator = "date_is" | "date_is_before" | "date_is_after" | "date_is_on_or_before" | "date_is_on_or_after" | "date_is_within" | EmptyViewFiltersOperator;
export type PersonViewFiltersOperator = "person_contains" | "person_does_not_contain" | EmptyViewFiltersOperator;
export type FilesViewFiltersOperator = EmptyViewFiltersOperator;
export type CheckboxViewFiltersOperator = "checkbox_is" | "checkbox_is_not";
export type UrlViewFiltersOperator = TextViewFiltersOperator;
export type EmailViewFiltersOperator = TextViewFiltersOperator;
export type PhoneViewFiltersOperator = TextViewFiltersOperator;

export type TBasicViewFiltersOperator =
  TextViewFiltersOperator |
  NumericViewFiltersOperator |
  EnumViewFiltersOperator |
  EnumsViewFiltersOperator |
  DateViewFiltersOperator |
  PersonViewFiltersOperator |
  FilesViewFiltersOperator |
  CheckboxViewFiltersOperator |
  UrlViewFiltersOperator |
  EmailViewFiltersOperator |
  PhoneViewFiltersOperator;

export type TAdvancedViewFiltersOperator = "";

export type TViewFiltersOperator = TBasicViewFiltersOperator | TAdvancedViewFiltersOperator;

/**
 * Filters.filter.value.type 
 */
export type TextViewFiltersType = "exact";
export type NumericViewFiltersType = "exact";
export type EnumViewFiltersType = "exact";
export type EnumsViewFiltersType = "exact";
export type DateViewFiltersType = "relative" | "exact";
export type PersonViewFiltersType = "exact";
export type FilesViewFiltersType = "exact";
export type CheckboxViewFiltersType = "exact";
export type UrlViewFiltersType = "exact";
export type EmailViewFiltersType = "exact";
export type PhoneViewFiltersType = "exact";

export type TBasicViewFiltersType =
  TextViewFiltersType |
  NumericViewFiltersType |
  EnumViewFiltersType |
  EnumsViewFiltersType |
  DateViewFiltersType |
  PersonViewFiltersType |
  FilesViewFiltersType |
  CheckboxViewFiltersType |
  UrlViewFiltersType |
  EmailViewFiltersType |
  PhoneViewFiltersType;

export type TAdvancedViewFiltersType = "exact";

export type TViewFiltersType =
  TBasicViewFiltersType | TAdvancedViewFiltersType;

/**
 * Filters.filter.value.value 
 */
export type TextViewFiltersValue = string;
export type NumericViewFiltersValue = number;
export type EnumViewFiltersValue = string
export type EnumsViewFiltersValue = string
export type DateViewFiltersValue = "today" | "tomorrow" | "yesterday" | "one_week_ago" | "one_week_from_now" | "one_month_ago" | "one_month_from_now" | {
  start_date: string,
  type: "date"
}

export interface PersonViewFiltersValue {
  id: string,
  table: "notion_user"
}
export interface FilesViewFiltersValue { };

export type CheckboxViewFiltersValue = boolean;
export type UrlViewFiltersValue = string;
export type EmailViewFiltersValue = string;
export type PhoneViewFiltersValue = string;

export type TBasicViewFiltersValue =
  TextViewFiltersValue |
  NumericViewFiltersValue |
  EnumViewFiltersValue |
  EnumsViewFiltersValue |
  DateViewFiltersValue |
  PersonViewFiltersValue |
  FilesViewFiltersValue |
  CheckboxViewFiltersValue |
  UrlViewFiltersValue |
  EmailViewFiltersValue |
  PhoneViewFiltersValue;

export type TAdvancedViewFiltersValue = "";

export type TViewFiltersValue = TBasicViewFiltersValue | TAdvancedViewFiltersValue;

export interface IViewFilter {
  filters: IViewFilters[],
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
export interface DateViewFilters extends IViewFilters<DateViewFiltersOperator, DateViewFiltersValue, DateViewFiltersType> { };
export interface PersonViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };
export interface FilesViewFilters extends IViewFilters<FilesViewFiltersOperator, FilesViewFiltersValue> { };
export interface FilesViewFilters extends IViewFilters<FilesViewFiltersOperator, FilesViewFiltersValue> { };
export interface CheckboxViewFilters extends IViewFilters<CheckboxViewFiltersOperator, CheckboxViewFiltersValue> { };
export interface UrlViewFilters extends IViewFilters<UrlViewFiltersOperator, UrlViewFiltersValue> { };
export interface EmailViewFilters extends IViewFilters<EmailViewFiltersOperator, EmailViewFiltersValue> { };
export interface PhoneViewFilters extends IViewFilters<PhoneViewFiltersOperator, PhoneViewFiltersValue> { };

export type TBasicViewFilters =
  TextViewFilters |
  NumericViewFilters |
  EnumViewFilters |
  EnumsViewFilters |
  DateViewFilters |
  PersonViewFilters |
  FilesViewFilters |
  CheckboxViewFilters |
  UrlViewFilters |
  EmailViewFilters |
  PhoneViewFilters;

export type TAdvancedViewFilters = ""

export type TViewFilters = TBasicViewFilters | TAdvancedViewFilters;