import { IBoardView, ITableView, ITimelineView, Schema, ViewAggregations } from "@nishans/types";
import { initializeViewAggregations } from "../../libs";
import { ISchemaAggregationMap } from "../../types";

export function aggregations(data: ITableView | IBoardView | ITimelineView, schema: Schema){
  const aggregations_map: ISchemaAggregationMap = new Map(), aggregations = initializeViewAggregations(data);
  ((data.query2 as any).aggregations as ViewAggregations[]).forEach((aggregation) => {
    const schema_unit = schema[aggregation.property];
    if(!schema_unit)
      throw new Error(`Unknown property ${aggregation.property} referenced`)
    aggregations_map.set(schema_unit.name, {
      schema_id: aggregation.property,
      ...schema_unit,
      aggregation,
    } as any)
  });

  return [aggregations_map, aggregations] as const;
}