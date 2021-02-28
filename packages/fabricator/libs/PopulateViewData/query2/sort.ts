import { TViewQuery2 } from '@nishans/types';
import { SortCreateInput } from '../../';

/**
 * Populates query2 sort and aggregations using the passed input schema
 * @param sort_input Input schema unit containing sort and aggregation
 * @param schema_map_unit The schema map unit referenced in the sorts and aggregations
 * @param query2 Query2 to insert the aggregations and sorts to
 */
export function populateViewQuery2Sort (sort_input: SortCreateInput, schema_id: string, sorts: TViewQuery2['sort']) {
	// get the sorts and aggregations container from the passed query object
	// if there is a sorts container and if sort is present in the input
	if (sort_input && sorts) {
		// if the passed sort input is an array, with the signature [direction, position]
		if (Array.isArray(sort_input))
			sorts.splice(sort_input[1], 0, {
				property: schema_id,
				direction: sort_input[0]
			});
		else
			// position is not provided so just push sort to the last
			sorts.push({
				property: schema_id,
				direction: sort_input
			});
	}
}
