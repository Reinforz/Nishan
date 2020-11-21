export type StringViewAggregationsAggregators = "none" | "count" | "count_values" | "unique" | "empty" | "not_empty" | "percent_empty" | "percent_not_empty";

export interface ViewAggregations {
  property: string,
  aggregator: TViewAggregationsAggregators
}

export type TextViewAggregationsAggregator = StringViewAggregationsAggregators;
export type NumericViewAggregationsAggregator = StringViewAggregationsAggregators | "sum" | "average" | "median" | "min" | "max" | "range";
export type EnumViewAggregationsAggregator = StringViewAggregationsAggregators;
export type EnumsViewAggregationsAggregator = StringViewAggregationsAggregators;
export type DateViewAggregationsAggregator = StringViewAggregationsAggregators | "earliest_date" | "latest_date" | "date_range";
export type PersonViewAggregationsAggregator = StringViewAggregationsAggregators;
export type FilesViewAggregationsAggregator = StringViewAggregationsAggregators;
export type CheckboxViewAggregationsAggregator = "none" | "count_all" | "checked" | "unchecked" | "percent_checked" | "percent_unchecked";;
export type UrlViewAggregationsAggregator = StringViewAggregationsAggregators;
export type EmailViewAggregationsAggregator = StringViewAggregationsAggregators;
export type PhoneViewAggregationsAggregator = StringViewAggregationsAggregators;

export type TViewBasicAggregationsAggregators =
  TextViewAggregationsAggregator |
  NumericViewAggregationsAggregator |
  EnumViewAggregationsAggregator |
  EnumsViewAggregationsAggregator |
  DateViewAggregationsAggregator |
  PersonViewAggregationsAggregator |
  FilesViewAggregationsAggregator |
  CheckboxViewAggregationsAggregator |
  UrlViewAggregationsAggregator |
  EmailViewAggregationsAggregator |
  PhoneViewAggregationsAggregator;

export type ForumlaViewAggregationsAggregator = StringViewAggregationsAggregators;
export type RelationViewAggregationsAggregator = StringViewAggregationsAggregators;
export type RollupViewAggregationsAggregator = StringViewAggregationsAggregators;
export type CreatedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type CreatedByViewAggregationsAggregator = StringViewAggregationsAggregators;
export type LastCreatedTimeViewAggregationsAggregator = DateViewAggregationsAggregator;
export type LastCreatedByViewAggregationsAggregator = StringViewAggregationsAggregators;

export type TViewAdvancedAggregationsAggregators =
  ForumlaViewAggregationsAggregator |
  RelationViewAggregationsAggregator |
  RollupViewAggregationsAggregator |
  CreatedTimeViewAggregationsAggregator |
  CreatedByViewAggregationsAggregator |
  LastCreatedTimeViewAggregationsAggregator |
  LastCreatedByViewAggregationsAggregator;

export type TViewAggregationsAggregators = TViewBasicAggregationsAggregators | TViewAdvancedAggregationsAggregators;