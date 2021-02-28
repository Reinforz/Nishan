import { TViewAggregationsAggregators, ViewAggregations } from '@nishans/types';

/**
 * Populates query2 sort and aggregations using the passed input schema
 * @param input_schema_unit Input schema unit containing sort and aggregation
 * @param schema_map_unit The schema map unit referenced in the sorts and aggregations
 * @param query2 Query2 to insert the aggregations and sorts to
 */
export function populateViewQuery2Aggregation (
	aggregation_input: undefined | TViewAggregationsAggregators,
	schema_id: string,
	aggregations?: ViewAggregations[]
) {
	// If aggregation input and aggregations container exist, only then add the aggregation
	if (aggregation_input && aggregations)
		aggregations.push({
			property: schema_id,
			aggregator: aggregation_input as any
		});
}
