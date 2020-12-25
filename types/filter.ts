import { IViewAggregationsAggregators } from "./aggregator";
import { TSchemaUnitType } from "./schema";

/**
 * Filters.filter.operator 
 */
export type EmptyViewFiltersOperator = "is_empty" | "is_not_empty";

export type TextViewFiltersOperator = "string_is" | "string_is_not" | "string_contains" | "string_does_not_contain" | "string_starts_with" | "string_ends_with" | EmptyViewFiltersOperator;
export type TitleViewFiltersOperator = TextViewFiltersOperator;
export type NumberViewFiltersOperator = "number_equals" | "number_does_not_equal" | "number_greater_than" | "number_less_than" | "number_greater_than_or_equal_to" | "number_less_than_or_equal_to" | EmptyViewFiltersOperator;
export type SelectViewFiltersOperator = "enum_is" | "enum_is_not" | EmptyViewFiltersOperator;
export type MultiSelectViewFiltersOperator = "enum_contains" | "enum_does_not_contain" | EmptyViewFiltersOperator;
export type DateViewFiltersOperator = "date_is" | "date_is_before" | "date_is_after" | "date_is_on_or_before" | "date_is_on_or_after" | "date_is_within" | EmptyViewFiltersOperator;
export type PersonViewFiltersOperator = "person_contains" | "person_does_not_contain" | EmptyViewFiltersOperator;
export type FileViewFiltersOperator = EmptyViewFiltersOperator;
export type CheckboxViewFiltersOperator = "checkbox_is" | "checkbox_is_not";
export type UrlViewFiltersOperator = TextViewFiltersOperator;
export type EmailViewFiltersOperator = TextViewFiltersOperator;
export type PhoneNumberViewFiltersOperator = TextViewFiltersOperator;

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
  NumberViewFiltersOperator |
  SelectViewFiltersOperator |
  MultiSelectViewFiltersOperator |
  DateViewFiltersOperator |
  PersonViewFiltersOperator |
  FileViewFiltersOperator |
  CheckboxViewFiltersOperator |
  UrlViewFiltersOperator |
  EmailViewFiltersOperator |
  PhoneNumberViewFiltersOperator;

export type TAdvancedViewFiltersOperator =
  FormulaViewFiltersOperator |
  RelationViewFiltersOperator |
  RollupViewFiltersOperator |
  CreatedTimeViewFiltersOperator |
  CreatedByViewFiltersOperator |
  LastEditedTimeViewFiltersOperator |
  LastEditedByViewFiltersOperator;

export type TViewFiltersOperator = TBasicViewFiltersOperator | TAdvancedViewFiltersOperator;

export interface IViewFiltersOperator {
  title: TitleViewFiltersOperator,
  text: TextViewFiltersOperator,
  number: NumberViewFiltersOperator,
  select: SelectViewFiltersOperator,
  multi_select: MultiSelectViewFiltersOperator,
  date: DateViewFiltersOperator,
  person: PersonViewFiltersOperator,
  file: FileViewFiltersOperator,
  checkbox: CheckboxViewFiltersOperator,
  url: UrlViewFiltersOperator,
  email: EmailViewFiltersOperator,
  phone_number: PhoneNumberViewFiltersOperator,
  formula: FormulaViewFiltersOperator,
  relation: RelationViewFiltersOperator,
  rollup: RollupViewFiltersOperator,
  created_time: CreatedTimeViewFiltersOperator,
  created_by: CreatedByViewFiltersOperator,
  last_edited_time: LastEditedTimeViewFiltersOperator,
  last_edited_by: LastEditedByViewFiltersOperator,
}

/**
 * Filters.filter.value.type 
 */
export type TitleViewFiltersType = "exact";
export type TextViewFiltersType = "exact";
export type NumberViewFiltersType = "exact";
export type SelectViewFiltersType = "exact";
export type MultiSelectViewFiltersType = "exact";
export type DateViewFiltersType = "relative" | "exact";
export type PersonViewFiltersType = "exact";
export type FileViewFiltersType = "exact";
export type CheckboxViewFiltersType = "exact";
export type UrlViewFiltersType = "exact";
export type EmailViewFiltersType = "exact";
export type PhoneNumberViewFiltersType = "exact";

export type TBasicViewFiltersType =
  TitleViewFiltersType |
  TextViewFiltersType |
  NumberViewFiltersType |
  SelectViewFiltersType |
  MultiSelectViewFiltersType |
  DateViewFiltersType |
  PersonViewFiltersType |
  FileViewFiltersType |
  CheckboxViewFiltersType |
  UrlViewFiltersType |
  EmailViewFiltersType |
  PhoneNumberViewFiltersType;

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

export interface IViewFiltersType {
  title: TitleViewFiltersType,
  text: TextViewFiltersType,
  number: NumberViewFiltersType,
  select: SelectViewFiltersType,
  multi_select: MultiSelectViewFiltersType,
  date: DateViewFiltersType,
  person: PersonViewFiltersType,
  file: FileViewFiltersType,
  checkbox: CheckboxViewFiltersType,
  url: UrlViewFiltersType,
  email: EmailViewFiltersType,
  phone_number: PhoneNumberViewFiltersType,
  formula: FormulaViewFiltersType,
  relation: RelationViewFiltersType,
  rollup: RollupViewFiltersType,
  created_time: CreatedTimeViewFiltersType,
  created_by: CreatedByViewFiltersType,
  last_edited_time: LastEditedTimeViewFiltersType,
  last_edited_by: LastEditedByViewFiltersType,
}

/**
 * Filters.filter.value.value 
 */
export type TitleViewFiltersValue = string;
export type TextViewFiltersValue = string;
export type NumberViewFiltersValue = number;
export type SelectViewFiltersValue = string
export type MultiSelectViewFiltersValue = string
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
export type PhoneNumberViewFiltersValue = string;

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
  NumberViewFiltersValue |
  SelectViewFiltersValue |
  MultiSelectViewFiltersValue |
  DateViewFiltersValue |
  PersonViewFiltersValue |
  FileViewFiltersValue |
  CheckboxViewFiltersValue |
  UrlViewFiltersValue |
  EmailViewFiltersValue |
  PhoneNumberViewFiltersValue;

export type TAdvancedViewFiltersValue =
  FormulaViewFiltersValue |
  RelationViewFiltersValue |
  RollupViewFiltersValue |
  CreatedTimeViewFiltersValue |
  CreatedByViewFiltersValue |
  LastEditedTimeViewFiltersValue |
  LastEditedByViewFiltersValue;

export type TViewFiltersValue = TBasicViewFiltersValue | TAdvancedViewFiltersValue;

export interface IViewFiltersValue {
  title: TitleViewFiltersValue,
  text: TextViewFiltersValue,
  number: NumberViewFiltersValue,
  select: SelectViewFiltersValue,
  multi_select: MultiSelectViewFiltersValue,
  date: DateViewFiltersValue,
  person: PersonViewFiltersValue,
  file: FileViewFiltersValue,
  checkbox: CheckboxViewFiltersValue,
  url: UrlViewFiltersValue,
  email: EmailViewFiltersValue,
  phone_number: PhoneNumberViewFiltersValue,
  formula: FormulaViewFiltersValue,
  relation: RelationViewFiltersValue,
  rollup: RollupViewFiltersValue,
  created_time: CreatedTimeViewFiltersValue,
  created_by: CreatedByViewFiltersValue,
  last_edited_time: LastEditedTimeViewFiltersValue,
  last_edited_by: LastEditedByViewFiltersValue,
}

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
export interface NumberViewFilters extends IViewFilters<NumberViewFiltersOperator, NumberViewFiltersValue> { };
export interface SelectViewFilters extends IViewFilters<SelectViewFiltersOperator, SelectViewFiltersValue> { };
export interface MultiSelectViewFilters extends IViewFilters<MultiSelectViewFiltersOperator, MultiSelectViewFiltersValue> { };
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
export interface PhoneViewFilters extends IViewFilters<PhoneNumberViewFiltersOperator, PhoneNumberViewFiltersValue> { };

export interface CreatedTimeViewFilters extends DateViewFilters { };
export interface CreatedByViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };
export interface LastEditedTimeViewFilters extends DateViewFilters { }
export interface EditedByViewFilters extends IViewFilters<PersonViewFiltersOperator, PersonViewFiltersValue> { };

export type TBasicViewFilters =
  TextViewFilters |
  NumberViewFilters |
  SelectViewFilters |
  MultiSelectViewFilters |
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

export interface IViewFilterData<S extends TSchemaUnitType> {
  schemaunit: S,
  operator: IViewFiltersOperator[S],
  type: IViewFiltersType[S],
  value: IViewFiltersValue[S],
  aggregator: IViewAggregationsAggregators[S]
}

export type TViewFilterData =
  IViewFilterData<"title"> |
  IViewFilterData<"text"> |
  IViewFilterData<"number"> |
  IViewFilterData<"select"> |
  IViewFilterData<"multi_select"> |
  IViewFilterData<"date"> |
  IViewFilterData<"person"> |
  IViewFilterData<"file"> |
  IViewFilterData<"checkbox"> |
  IViewFilterData<"url"> |
  IViewFilterData<"email"> |
  IViewFilterData<"phone_number"> |
  IViewFilterData<"formula"> |
  IViewFilterData<"relation"> |
  IViewFilterData<"rollup"> |
  IViewFilterData<"created_time"> |
  IViewFilterData<"created_by"> |
  IViewFilterData<"last_edited_time"> |
  IViewFilterData<"last_edited_by">;