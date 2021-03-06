import { NotionFabricator } from '../../libs';
import { schema, tsmu } from './utils';

const format_property = {
	width: 150,
	visible: false,
	property: 'title'
};

it(`Should create correct schema map`, () => {
	const [ format_map ] = NotionFabricator.PopulateViewMaps.properties(
		{
			type: 'table',
			format: {
				table_properties: [ format_property ]
			}
		} as any,
		schema
	);

	expect(Array.from(format_map.entries())).toStrictEqual([
		[
			'Title',
			{
				...tsmu,
				format: format_property
			}
		]
	]);
});
