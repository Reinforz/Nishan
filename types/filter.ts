export type EmptyViewFiltersOperator = "is_empty" | "is_not_empty";
export type TextViewFiltersOperator = "string_is" | "string_is_not" | "string_contains" | "string_does_not_contain" | "string_starts_with" | "string_ends_with" | EmptyViewFiltersOperator;
export type NumericViewFiltersOperator = "number_equals" | "number_does_not_equal" | "number_greater_than" | "number_less_than" | "number_greater_than_or_equal_to" | "number_less_than_or_equal_to" | EmptyViewFiltersOperator;
export type EnumViewFiltersOperator = "enum_is" | "enum_is_not" | EmptyViewFiltersOperator;
export type EnumsViewFiltersOperator = "enum_contains" | "enum_does_not_contain" | EmptyViewFiltersOperator;
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
  PersonViewFiltersOperator |
  FilesViewFiltersOperator |
  CheckboxViewFiltersOperator |
  UrlViewFiltersOperator |
  EmailViewFiltersOperator |
  PhoneViewFiltersOperator;

export type TViewFiltersOperator = TBasicViewFiltersOperator | "and" | "or";
export interface IViewFilters<T extends TViewFiltersOperator = TViewFiltersOperator> {
  property: string,
  filter: {
    operator: T,
    value: {
      type: "exact",
      value: string
    }
  }
}

export interface TextViewFilters extends IViewFilters<TextViewFiltersOperator> { };
export interface NumericViewFilters extends IViewFilters<NumericViewFiltersOperator> { };
export interface EnumViewFilters extends IViewFilters<EnumViewFiltersOperator> { };
export interface EnumsViewFilters extends IViewFilters<EnumsViewFiltersOperator> { };
export interface PersonViewFilters extends IViewFilters<PersonViewFiltersOperator> { };
export interface FilesViewFilters extends IViewFilters<FilesViewFiltersOperator> { };
export interface FilesViewFilters extends IViewFilters<FilesViewFiltersOperator> { };
export interface CheckboxViewFilters extends IViewFilters<CheckboxViewFiltersOperator> { };
export interface UrlViewFilters extends IViewFilters<UrlViewFiltersOperator> { };
export interface EmailViewFilters extends IViewFilters<EmailViewFiltersOperator> { };
export interface PhoneViewFilters extends IViewFilters<PhoneViewFiltersOperator> { };

export type TBasicViewFilters =
  TextViewFilters |
  NumericViewFilters |
  EnumViewFilters |
  EnumsViewFilters |
  PersonViewFilters |
  FilesViewFilters |
  CheckboxViewFilters |
  UrlViewFilters |
  EmailViewFilters |
  PhoneViewFilters;

export type TAdvancedViewFilters = ""

export type TViewFilters = TBasicViewFilters | TAdvancedViewFilters;