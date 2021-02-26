import { PopulateViewMaps } from '../../libs';
import { schema, tsmu } from './utils';

it(`Should create correct schema map`, () => {
	const filter0_0 = {
			property: 'title',
			filter: {
				operator: 'string_is',
				value: {
					type: 'exact',
					value: '123'
				}
			}
		},
		filter0_1 = {
			property: 'text',
			filter: {
				operator: 'string_contains',
				value: {
					type: 'exact',
					value: '123'
				}
			}
		},
		filter1 = {
			property: 'title',
			filter: {
				operator: 'string_starts_with',
				value: {
					type: 'exact',
					value: '123'
				}
			}
		},
		filter0 = {
			operator: 'or',
			filters: [ filter0_0, filter0_1 ]
		};

	const [ filters_map ] = PopulateViewMaps.filters(
		{
			query2: {
				filter: {
					operator: 'and',
					filters: [ filter0, filter1 ]
				}
			}
		} as any,
		schema
	);

	expect(Array.from(filters_map.entries())).toStrictEqual([
		[
			'0.0',
			{
				...tsmu,
				parent_filter: filter0,
				child_filter: filter0_0
			}
		],
		[
			'0.1',
			{
				schema_id: 'text',
				name: 'Text',
				type: 'text',
				parent_filter: filter0,
				child_filter: filter0_1
			}
		],
		[
			'1',
			{
				...tsmu,
				parent_filter: {
					operator: 'and',
					filters: [ filter0, filter1 ]
				},
				child_filter: filter1
			}
		]
	]);
});
