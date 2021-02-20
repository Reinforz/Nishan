import { TViewQuery2, ViewAggregations } from '@nishans/types';
import { ISchemaMapValue, TViewSchemaUnitsCreateInput } from '../../../../types';

export function populateQuery2SortAndAggregations (
	input_schema_unit: Pick<TViewSchemaUnitsCreateInput, 'sort' | 'aggregation'>,
	schema_map_unit: Pick<ISchemaMapValue, 'schema_id'>,
	query2: TViewQuery2
) {
	const { sort, aggregation } = input_schema_unit;
	const sorts = query2.sort,
		aggregations = (query2 as any).aggregations as ViewAggregations[];
	if (sort && sorts) {
		if (Array.isArray(sort))
			sorts.splice(sort[1], 0, {
				property: schema_map_unit.schema_id,
				direction: sort[0]
			});
		else
			sorts.push({
				property: schema_map_unit.schema_id,
				direction: sort
			});
	}

	if (aggregation && (query2 as any).aggregations)
		(query2 as any).aggregations.push({
			property: schema_map_unit.schema_id,
			aggregator: aggregation
		});

	return [ sorts, aggregations ];
}
