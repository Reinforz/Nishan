import { IBlockType, ViewAggregationsAggregators, ViewType } from "./types";

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
  $block_id: string, type: IBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}