import { TViewQuery2, ViewAggregations } from '@nishans/types';
import { ISchemaMapValue, TViewSchemaUnitsCreateInput } from '../../../../types';

/**
 * Populates query2 sort and aggregations using the passed input schema
 * @param input_schema_unit Input schema unit containing sort and aggregation
 * @param schema_map_unit The schema map unit referenced in the sorts and aggregations
 * @param query2 Query2 to insert the aggregations and sorts to
 * @returns a tuple of the populated sort and aggregations
 */
export function populateQuery2SortAndAggregations (
	input_schema_unit: Pick<TViewSchemaUnitsCreateInput, 'sort' | 'aggregation'>,
	schema_map_unit: Pick<ISchemaMapValue, 'schema_id'>,
	query2: TViewQuery2
) {
	const { sort, aggregation } = input_schema_unit;
	// get the sorts and aggregations container from the passed query object

	const sorts = query2.sort,
		aggregations = (query2 as any).aggregations as ViewAggregations[];
	// if there is a sorts container and if sort is present in the input
	if (sort && sorts) {
		// if the passed sort input is an array, with the signature [direction, position]
		if (Array.isArray(sort))
			sorts.splice(sort[1], 0, {
				property: schema_map_unit.schema_id,
				direction: sort[0]
			});
		else
			// position is not provided so just push sort to the last
			sorts.push({
				property: schema_map_unit.schema_id,
				direction: sort
			});
	}

	// If aggregation input and aggregations container exist, only then add the aggregation
	if (aggregation && aggregations)
		aggregations.push({
			property: schema_map_unit.schema_id,
			aggregator: aggregation
		});

	return [ sorts, aggregations ];
}
