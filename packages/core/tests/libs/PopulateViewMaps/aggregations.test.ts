import { PopulateViewMaps } from '../../../libs';
import { schema, tsmu } from './utils';

it(`Should throw an error if unknown property is referenced`, () => {
	expect(() =>
		PopulateViewMaps.aggregations(
			{
				query2: {
					aggregations: [
						{
							property: 'unknown',
							aggregator: 'count'
						}
					]
				}
			} as any,
			schema
		)
	).toThrow();
});

it(`Should create correct schema map`, () => {
	const [ aggregations_map ] = PopulateViewMaps.aggregations(
		{
			query2: {
				aggregations: [
					{
						property: 'title',
						aggregator: 'count'
					}
				]
			}
		} as any,
		schema
	);

	expect(Array.from(aggregations_map.entries())).toStrictEqual([
		[
			'Title',
			{
				...tsmu,
				aggregation: {
					aggregator: 'count',
					property: 'title'
				}
			}
		]
	]);
});
