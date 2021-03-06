import { NotionFabricator } from '../../libs';
import { schema, tsmu } from './utils';

const sort = {
	property: 'title',
	direction: 'ascending'
};

it(`Should create correct schema map`, () => {
	const [ sorts_map ] = NotionFabricator.PopulateViewMaps.sorts(
		{
			query2: {
				sort: [ sort ]
			}
		} as any,
		schema
	);

	expect(Array.from(sorts_map.entries())).toStrictEqual([
		[
			'Title',
			{
				...tsmu,
				sort
			}
		]
	]);
});
