import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { generateViewData } from '../../../../../libs/CreateData/Views/utils';
import { o } from '../../../../utils';

describe('generateViewData', () => {
	const id = v4(),
		stack: IOperation[] = [],
		cache: ICache = {
			collection_view: new Map()
		} as any;
	it(`Should work correctly`, () => {
		const view_data = generateViewData(
			{
				id,
				name: 'Table',
				type: 'table',
				format: {} as any,
				query2: {} as any
			},
			{
				user_id: 'user_id',
				stack,
				cache,
				space_id: 'space_id',
				shard_id: 123
			},
			'parent_id'
		);
		const expected_view_data = {
			id,
			version: 0,
			type: 'table',
			name: 'Table',
			page_sort: [],
			parent_id: 'parent_id',
			parent_table: 'block',
			alive: true,
			format: {},
			query2: {},
			shard_id: 123,
			space_id: 'space_id'
		};

		expect(view_data).toStrictEqual(expected_view_data);

		expect(stack).toStrictEqual([ o.cv.u(id, [], expected_view_data) ]);

		expect(Array.from(cache.collection_view.entries())).toStrictEqual([ [ id, expected_view_data ] ]);
	});
});
