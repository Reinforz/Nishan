import { IBoardView, ITableView, ITimelineView, Schema } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { InitializeView, ISchemaAggregationMap } from "../";

/**
 * Populates and returns an aggregation map
 * @param data view data
 * @param schema Schema used to check for property reference and get schema_unit
 */
export function aggregations(data: ITableView | IBoardView | ITimelineView, schema: Schema){
  const aggregations_map: ISchemaAggregationMap = new Map(), aggregations = InitializeView.aggregation(data);
  // Go through each of the aggregations and add it to the aggregation map
  aggregations.forEach((aggregation, index) => {
    const schema_unit = NotionUtils.getSchemaUnit(schema, aggregation.property, ["query2", "aggregation", index.toString()] );
    // Set the aggregation map value using the schema unit name as key, and attaching the schema_id in the value 
    aggregations_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: aggregation.property,
      aggregation,
    } as any)
  });

  return [aggregations_map, aggregations] as const;
}