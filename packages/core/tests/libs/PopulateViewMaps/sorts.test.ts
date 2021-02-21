import { PopulateViewMaps } from '../../../libs';
import { schema } from './schema';

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
	).toThrow(`Unknown property unknown referenced`);
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
				schema_id: 'title',
				name: 'Title',
				type: 'title',
				sort: 'ascending'
			}
		]
	]);
});
