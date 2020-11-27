export type StringViewAggregationsAggregators = "none" | "count" | "count_values" | "unique" | "empty" | "not_empty" | "percent_empty" | "percent_not_empty";

export interface ViewAggregations {
  property: string,
  aggregator: TViewAggregationsAggregators
}

export type TitleViewAggregationsAggregator = StringViewAggregationsAggregators;
export type TextViewAggregationsAggregator = StringViewAggregationsAggregators;
export type NumericViewAggregationsAggregator = StringViewAggregationsAggregators | "sum" | "average" | "median" | "min" | "max" | "range";
export type EnumViewAggregationsAggregator = StringViewAggregationsAggregators;
export type EnumsViewAggregationsAggregator = StringViewAggregationsAggregators;
export type DateViewAggregationsAggregator = StringViewAggregationsAggregators | "earliest_date" | "latest_date" | "date_range";
export type PersonViewAggregationsAggregator = StringViewAggregationsAggregators;
export type FileViewAggregationsAggregator = StringViewAggregationsAggregators;
export type CheckboxViewAggregationsAggregator = "none" | "count_all" | "checked" | "unchecked" | "percent_checked" | "percent_unchecked";;
export type UrlViewAggregationsAggregator = StringViewAggregationsAggregators;
export type EmailViewAggregationsAggregator = StringViewAggregationsAggregators;
export type PhoneViewAggregationsAggregator = StringViewAggregationsAggregators;

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

export type ForumlaViewAggregationsAggregator = StringViewAggregationsAggregators;
export type RelationViewAggregationsAggregator = StringViewAggregationsAggregators;
export type RollupViewAggregationsAggregator = StringViewAggregationsAggregators;
export type CreatedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type CreatedByViewAggregationsAggregator = StringViewAggregationsAggregators;
export type LastEditedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type LastEditedByViewAggregationsAggregator = StringViewAggregationsAggregators;

export type TViewAdvancedAggregationsAggregators =
  ForumlaViewAggregationsAggregator |
  RelationViewAggregationsAggregator |
  RollupViewAggregationsAggregator |
  CreatedTimeViewAggregationsAggregator |
  CreatedByViewAggregationsAggregator |
  LastEditedTimeViewAggregationsAggregator |
  LastEditedByViewAggregationsAggregator;

export type TViewAggregationsAggregators = TViewBasicAggregationsAggregators | TViewAdvancedAggregationsAggregators;