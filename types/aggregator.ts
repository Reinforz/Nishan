export type StringViewAggregationsAggregator = "none" | "count" | "count_values" | "unique" | "empty" | "not_empty" | "percent_empty" | "percent_not_empty";

export interface ViewAggregations {
  property: string,
  aggregator: TViewAggregationsAggregators
}

export type TitleViewAggregationsAggregator = StringViewAggregationsAggregator;
export type TextViewAggregationsAggregator = StringViewAggregationsAggregator;
export type NumericViewAggregationsAggregator = StringViewAggregationsAggregator | "sum" | "average" | "median" | "min" | "max" | "range";
export type EnumViewAggregationsAggregator = StringViewAggregationsAggregator;
export type EnumsViewAggregationsAggregator = StringViewAggregationsAggregator;
export type DateViewAggregationsAggregator = StringViewAggregationsAggregator | "earliest_date" | "latest_date" | "date_range";
export type PersonViewAggregationsAggregator = StringViewAggregationsAggregator;
export type FileViewAggregationsAggregator = StringViewAggregationsAggregator;
export type CheckboxViewAggregationsAggregator = "none" | "count_all" | "checked" | "unchecked" | "percent_checked" | "percent_unchecked";;
export type UrlViewAggregationsAggregator = StringViewAggregationsAggregator;
export type EmailViewAggregationsAggregator = StringViewAggregationsAggregator;
export type PhoneViewAggregationsAggregator = StringViewAggregationsAggregator;

export type TViewBasicAggregationsAggregators =
  TitleViewAggregationsAggregator |
  TextViewAggregationsAggregator |
  NumericViewAggregationsAggregator |
  EnumViewAggregationsAggregator |
  EnumsViewAggregationsAggregator |
  DateViewAggregationsAggregator |
  PersonViewAggregationsAggregator |
  FileViewAggregationsAggregator |
  CheckboxViewAggregationsAggregator |
  UrlViewAggregationsAggregator |
  EmailViewAggregationsAggregator |
  PhoneViewAggregationsAggregator;

export type FormulaViewAggregationsAggregator = NumericViewAggregationsAggregator | StringViewAggregationsAggregator | CheckboxViewAggregationsAggregator | DateViewAggregationsAggregator;
export type RelationViewAggregationsAggregator = StringViewAggregationsAggregator;
export type RollupViewAggregationsAggregator = NumericViewAggregationsAggregator;
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