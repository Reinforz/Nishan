import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { default_nishan_arg, o } from '../../../../../core/tests/utils';
import { generateViewData } from '../../../../libs/CreateData/Views/utils';

const id = v4(),
	stack: IOperation[] = [],
	cache: ICache = {
		collection_view: new Map()
	} as any;

it(`Should work correctly`, () => {
	const logger = jest.fn();
	const view_data = generateViewData(
		{
			id,
			name: 'Table',
			type: 'table',
			format: {} as any,
			query2: {} as any
		},
		{ ...default_nishan_arg, stack, cache, logger },
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
		space_id: 'space_1'
	};

	expect(logger).toHaveBeenCalledWith('CREATE', 'collection_view', id);
	expect(view_data).toStrictEqual(expected_view_data);
	expect(stack).toStrictEqual([ o.cv.u(id, [], expected_view_data) ]);
	expect(cache.collection_view.get(id)).toStrictEqual(expected_view_data);
});
