import { ICache } from '@nishans/cache';
import { IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { last_edited_props } from '../../utils/lastEditedProps';
import { c1, c1do, c1ro, c2, c2do, c2ro, cc, constructCache, delete_props_1, delete_props_2, puo } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const expectOnDelete = (parent_data: IPage, deleted_data: any, stack: IOperation[]) => {
	expect(parent_data).toStrictEqual({
		id: 'parent_one_id',
		content: [ 'child_three_id' ],
		...last_edited_props
	});
	expect(deleted_data).toStrictEqual([ c1, c2 ]);
	expect(stack).toStrictEqual([ c1do, c1ro, c2do, c2ro, puo ]);
};

it(`manual=false,child_ids=[ids]`, async () => {
	const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
		stack: IOperation[] = [];
	const cache = constructCache(child_ids);

	const logger_spy = jest.fn(),
		cb_spy = jest.fn();

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ 'child_one_id', 'child_two_id' ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_ids,
			stack,
			logger: logger_spy,
			...delete_props_1
		},
		(id, data, container) => {
			cb_spy(id, data);
			container.push(data);
		}
	);
	const parent_data = cache.block.get('parent_one_id') as IPage;

	expect(logger_spy.mock.calls).toEqual([
		[ 'DELETE', 'block', 'child_one_id' ],
		[ 'DELETE', 'block', 'child_two_id' ]
	]);

	expect(cb_spy.mock.calls).toEqual([ [ 'child_one_id', c1 ], [ 'child_two_id', c2 ] ]);
	expectOnDelete(parent_data, deleted_data, stack);
});

it(`manual=false,child_ids=string`, async () => {
	const cache = constructCache([ 'child_one_id', 'child_two_id', 'child_three_id' ]),
		stack: IOperation[] = [];

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ 'child_one_id', 'child_two_id' ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_ids: 'content',
			...delete_props_1,
			stack
		},
		(_, data, container) => {
			container.push(data);
		}
	);
	const parent_data = cache.block.get('parent_one_id') as IPage;
	expectOnDelete(parent_data, deleted_data, stack);
});

it(`manual=true,child_ids=string`, async () => {
	const stack: IOperation[] = [];
	const cache = constructCache([ 'child_one_id', 'child_two_id', 'child_three_id' ]);

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ 'child_one_id', 'child_two_id' ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_path: 'content',
			stack,
			manual: true,
			...delete_props_2
		},
		(id, data, container) => {
			data.alive = false;
			container.push(data);
		}
	);
	const parent_data = cache.block.get('parent_one_id') as IPage;

	expect(parent_data).toStrictEqual({
		id: 'parent_one_id',
		content: [ 'child_one_id', 'child_two_id', 'child_three_id' ],
		...last_edited_props
	});

	expect(deleted_data).toStrictEqual([
		{
			id: 'child_one_id',
			alive: false
		},
		{
			id: 'child_two_id',
			alive: false
		}
	]);

	expect(stack).toStrictEqual([ puo ]);
});

it(`manual=false,child_path=undefined`, async () => {
	const stack: IOperation[] = [];
	const cache = constructCache([ 'child_one_id', 'child_two_id' ]);
	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ 'child_one_id' ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			...delete_props_2,
			stack
		} as any,
		(_, data, container) => container.push(data)
	);
	const parent_data = cache.block.get('parent_one_id') as IPage;

	expect(parent_data as any).toStrictEqual({
		id: 'parent_one_id',
		content: [ 'child_one_id', 'child_two_id' ],
		...last_edited_props
	});

	expect(deleted_data as any).toStrictEqual([ c1 ]);

	expect(stack).toStrictEqual([ c1do, puo ]);
});

it(`manual=true,child_ids=string,content=undefined`, async () => {
	const stack: IOperation[] = [];
	const cache: ICache = {
		block: new Map([ cc('parent_one_id'), cc('child_one_id'), cc('child_two_id') ])
	} as any;

	await ChildTraverser.delete<IPage, TBlock>([ 'child_one_id' ], (id) => cache.block.get(id), {
		container: [],
		cache,
		...delete_props_2,
		stack
	} as any);
	const parent_data = cache.block.get('parent_one_id') as IPage;

	expect(parent_data as any).toStrictEqual({
		id: 'parent_one_id',
		...last_edited_props
	});

	expect(stack).toStrictEqual([ puo ]);
});
