import { PopulateViewMaps } from '../../../libs';
import { schema, tsmu } from './utils';

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
	).toThrow();
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
				...tsmu,
				format: {
					property: 'title',
					width: 150,
					visible: false
				}
			}
		]
	]);
});
