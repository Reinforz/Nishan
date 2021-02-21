import { UnknownPropertyReferenceError } from "@nishans/errors";
import { IBoardView, ITableView, ITimelineView, Schema, ViewAggregations } from "@nishans/types";
import { initializeViewAggregations } from "../../libs";
import { ISchemaAggregationMap } from "../../types";

export function aggregations(data: ITableView | IBoardView | ITimelineView, schema: Schema){
  const aggregations_map: ISchemaAggregationMap = new Map(), aggregations = initializeViewAggregations(data);
  ((data.query2 as any).aggregations as ViewAggregations[]).forEach((aggregation, index) => {
    const schema_unit = schema[aggregation.property];
    if(!schema_unit)
      throw new UnknownPropertyReferenceError(aggregation.property, ["query2", "aggregation", index.toString()])
    aggregations_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: aggregation.property,
      aggregation,
    } as any)
  });

  return [aggregations_map, aggregations] as const;
}