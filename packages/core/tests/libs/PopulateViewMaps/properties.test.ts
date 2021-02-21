import { PopulateViewMaps } from '../../../libs';
import { schema } from './schema';

it(`Should throw an error if unknown property is referenced`, () => {
	expect(() =>
		PopulateViewMaps.properties(
			{
				type: 'table',
				format: {
					table_properties: [
						{
							width: 150,
							visible: false,
							property: 'unknown'
						}
					]
				}
			} as any,
			schema
		)
	).toThrow(`Unknown property unknown referenced`);
});

it(`Should create correct schema map`, () => {
	const [ format_map ] = PopulateViewMaps.properties(
		{
			type: 'table',
			format: {
				table_properties: [
					{
						width: 150,
						visible: false,
						property: 'title'
					}
				]
			}
		} as any,
		schema
	);

	expect(Array.from(format_map.entries())).toStrictEqual([
		[
			'Title',
			{
				schema_id: 'title',
				name: 'Title',
				type: 'title',
				format: {
					width: 150,
					visible: false
				}
			}
		]
	]);
});
