import { ICache } from '@nishans/cache';
import { IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { last_edited_props } from '../../utils/lastEditedProps';
import { o } from '../../utils/operations';

afterEach(() => {
	jest.restoreAllMocks();
});

// child delete operation generator
const cdo = (id: string) =>
	o.b.u(id, [], {
		alive: false,
		...last_edited_props
	});
// child remove operation generator
const cro = (id: string) =>
	o.b.lr('parent_one_id', [ 'content' ], {
		id
	});
// Child delete operations
const c1do = cdo('child_one_id');
const c2do = cdo('child_two_id');
// Child remove operations
const c1ro = cro('child_one_id');
const c2ro = cro('child_two_id');
// parent update operation
const puo = o.b.u('parent_one_id', [], last_edited_props);

const delete_props_common = {
	child_type: 'block',
	parent_id: 'parent_one_id',
	parent_type: 'block',
	user_id: 'user_root_1'
};

const delete_props_1 = {
	...delete_props_common,
	child_path: 'content'
} as any;

const delete_props_2 = {
	...delete_props_common,
	child_ids: 'content'
} as any;

// child data generator
const c = (id: string) => ({
	id,
	alive: false,
	...last_edited_props
});
const c1 = c('child_one_id');
const c2 = c('child_two_id');

// construct child cache data
const cc = (id: string) =>
	[
		id,
		{
			id
		}
	] as any;

// constructs the cache for all delete call
const constructCache = (child_ids: string[]) => {
	return {
		block: new Map([
			[
				'parent_one_id',
				{
					id: 'parent_one_id',
					content: child_ids
				}
			],
			cc('child_one_id'),
			cc('child_two_id'),
			cc('child_three_id')
		])
	} as ICache;
};

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
		(id, data, container) => {
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
