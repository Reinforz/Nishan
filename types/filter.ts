export type TViewFiltersOperator = "and" | "or";

export interface ViewFilters {
  property: string,
  filter: {
    operator: TViewFiltersOperator,
    value: {
      type: string,
      value: string
    }
  }
}

export type EmptyViewFiltersType = "is_empty" | "is_not_empty";

export type TextViewFiltersType = "string_is" | "string_is_not" | "string_contains" | "string_does_not_contain" | "string_starts_with" | "string_ends_with" | EmptyViewFiltersType;
export type NumericViewFiltersType = "number_equals" | "number_does_not_equal" | "number_greater_than" | "number_less_than" | "number_greater_than_or_equal_to" | "number_less_than_or_equal_to" | EmptyViewFiltersType;
export type EnumViewFiltersType = "enum_is" | "enum_is_not" | EmptyViewFiltersType;
export type EnumsViewFiltersType = "enum_contains" | "enum_does_not_contain" | EmptyViewFiltersType;
export type PersonViewFiltersType = "person_contains" | "person_does_not_contain" | EmptyViewFiltersType;
export type FilesViewFiltersType = EmptyViewFiltersType;
export type CheckboxViewFiltersType = "checkbox_is" | "checkbox_is_not";
export type UrlViewFiltersType = TextViewFiltersType;
export type EmailViewFiltersType = TextViewFiltersType;
export type PhoneViewFiltersType = TextViewFiltersType;

export type TBasicViewFiltersType =
  TextViewFiltersType |
  NumericViewFiltersType |
  EnumViewFiltersType |
  EnumsViewFiltersType |
  PersonViewFiltersType |
  FilesViewFiltersType |
  CheckboxViewFiltersType |
  UrlViewFiltersType |
  EmailViewFiltersType |
  PhoneViewFiltersType;

