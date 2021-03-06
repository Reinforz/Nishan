import { NotionFabricator } from '../../libs';
import { schema, tsmu } from './utils';

const aggregation = {
	property: 'title',
	aggregator: 'count'
};

it(`Should create correct schema map`, () => {
	const [ aggregations_map ] = NotionFabricator.PopulateViewMaps.aggregations(
		{
			query2: {
				aggregations: [ aggregation ]
			}
		} as any,
		schema
	);

	expect(Array.from(aggregations_map.entries())).toStrictEqual([
		[
			'Title',
			{
				...tsmu,
				aggregation
			}
		]
	]);
});
