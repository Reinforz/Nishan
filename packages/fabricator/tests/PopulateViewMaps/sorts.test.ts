import { PopulateViewMaps } from '../../libs';
import { schema, tsmu } from './utils';

it(`Should throw error when unknown property is referenced`, () => {
	expect(() =>
		PopulateViewMaps.sorts(
			{
				query2: {
					sort: [
						{
							property: 'unknown',
							direction: 'ascending'
						}
					]
				}
			} as any,
			schema
		)
	).toThrow();
});

it(`Should create correct schema map`, () => {
	const [ sorts_map ] = PopulateViewMaps.sorts(
		{
			query2: {
				sort: [
					{
						property: 'title',
						direction: 'ascending'
					}
				]
			}
		} as any,
		schema
	);

	expect(Array.from(sorts_map.entries())).toStrictEqual([
		[
			'Title',
			{
				...tsmu,
				sort: 'ascending'
			}
		]
	]);
});
