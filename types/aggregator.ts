export type StringViewAggregationsAggregator = "none" | "count" | "count_values" | "unique" | "empty" | "not_empty" | "percent_empty" | "percent_not_empty";

export interface ViewAggregations {
  property: string,
  aggregator: TViewAggregationsAggregators
}

export type TitleViewAggregationsAggregator = StringViewAggregationsAggregator;
export type TextViewAggregationsAggregator = StringViewAggregationsAggregator;
export type NumberViewAggregationsAggregator = StringViewAggregationsAggregator | "sum" | "average" | "median" | "min" | "max" | "range";
export type SelectViewAggregationsAggregator = StringViewAggregationsAggregator;
export type MultiSelectViewAggregationsAggregator = StringViewAggregationsAggregator;
export type DateViewAggregationsAggregator = StringViewAggregationsAggregator | "earliest_date" | "latest_date" | "date_range";
export type PersonViewAggregationsAggregator = StringViewAggregationsAggregator;
export type FileViewAggregationsAggregator = StringViewAggregationsAggregator;
export type CheckboxViewAggregationsAggregator = "none" | "count_all" | "checked" | "unchecked" | "percent_checked" | "percent_unchecked";;
export type UrlViewAggregationsAggregator = StringViewAggregationsAggregator;
export type EmailViewAggregationsAggregator = StringViewAggregationsAggregator;
export type PhoneNumberViewAggregationsAggregator = StringViewAggregationsAggregator;

export type TViewBasicAggregationsAggregators =
  TitleViewAggregationsAggregator |
  TextViewAggregationsAggregator |
  NumberViewAggregationsAggregator |
  SelectViewAggregationsAggregator |
  MultiSelectViewAggregationsAggregator |
  DateViewAggregationsAggregator |
  PersonViewAggregationsAggregator |
  FileViewAggregationsAggregator |
  CheckboxViewAggregationsAggregator |
  UrlViewAggregationsAggregator |
  EmailViewAggregationsAggregator |
  PhoneNumberViewAggregationsAggregator;

export type FormulaViewAggregationsAggregator = NumberViewAggregationsAggregator | StringViewAggregationsAggregator | CheckboxViewAggregationsAggregator | DateViewAggregationsAggregator;
export type RelationViewAggregationsAggregator = StringViewAggregationsAggregator;
export type RollupViewAggregationsAggregator = NumberViewAggregationsAggregator;
export type CreatedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type CreatedByViewAggregationsAggregator = StringViewAggregationsAggregator;
export type LastEditedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type LastEditedByViewAggregationsAggregator = StringViewAggregationsAggregator;

export type TViewAdvancedAggregationsAggregators =
  FormulaViewAggregationsAggregator |
  RelationViewAggregationsAggregator |
  RollupViewAggregationsAggregator |
  CreatedTimeViewAggregationsAggregator |
  CreatedByViewAggregationsAggregator |
  LastEditedTimeViewAggregationsAggregator |
  LastEditedByViewAggregationsAggregator;

export type TViewAggregationsAggregators = TViewBasicAggregationsAggregators | TViewAdvancedAggregationsAggregators;

export interface IViewAggregationsAggregator {
  title: TitleViewAggregationsAggregator,
  text: TextViewAggregationsAggregator,
  number: NumberViewAggregationsAggregator,
  select: SelectViewAggregationsAggregator,
  multi_select: MultiSelectViewAggregationsAggregator,
  date: DateViewAggregationsAggregator,
  person: PersonViewAggregationsAggregator,
  file: FileViewAggregationsAggregator,
  checkbox: CheckboxViewAggregationsAggregator,
  url: UrlViewAggregationsAggregator,
  email: EmailViewAggregationsAggregator,
  phone_number: PhoneNumberViewAggregationsAggregator,
  formula: FormulaViewAggregationsAggregator,
  relation: RelationViewAggregationsAggregator,
  rollup: RollupViewAggregationsAggregator,
  created_time: CreatedTimeViewAggregationsAggregator,
  created_by: CreatedByViewAggregationsAggregator,
  last_edited_time: LastEditedTimeViewAggregationsAggregator,
  last_edited_by: LastEditedByViewAggregationsAggregator,
}