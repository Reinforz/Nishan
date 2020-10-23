import { TBlockType, IDate, IDateRange, IDateTime, IDateTimeRange, ViewAggregationsAggregators, ViewType } from "./types";

export interface UserViewArg {
  id?: string,
  sorts?: [string, number][],
  aggregations?: [string, ViewAggregationsAggregators][],
  filters?: any,
  properties?: [string, number, number][],
  name: string,
  type: ViewType,
  wrap?: boolean
}

export interface CreateBlockArg {
  $block_id: string, type: TBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export interface BlockRepostionArg {
  id: string,
  position: "before" | "after"
}