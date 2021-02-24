import { ICache } from '@nishans/cache';
import { IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { last_edited_props } from '../../utils/lastEditedProps';
import {
	c1do,
	c1id,
	c1ro,
	c2do,
	c2id,
	c2ro,
	c3id,
	cd,
	constructCache,
	dc1d,
	dc2d,
	delete_props_1,
	delete_props_2,
	p1id,
	p1uo,
	up1d
} from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const expectOnDelete = (parent_data: IPage, deleted_data: any, stack: IOperation[]) => {
	expect(parent_data).toStrictEqual({
		id: p1id,
		content: [ c3id ],
		...last_edited_props
	});
	expect(deleted_data).toStrictEqual([ dc1d, dc2d ]);
	expect(stack).toStrictEqual([ c1do, c1ro, c2do, c2ro, p1uo ]);
};

it(`manual=false,child_ids=[ids]`, async () => {
	const child_ids = [ c1id, c2id, c3id ],
		stack: IOperation[] = [];
	const cache = constructCache(child_ids);

	const logger_spy = jest.fn(),
		cb_spy = jest.fn();

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ c1id, c2id ],
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

	expect(logger_spy.mock.calls).toEqual([ [ 'DELETE', 'block', c1id ], [ 'DELETE', 'block', c2id ] ]);
	expect(cb_spy.mock.calls).toEqual([ [ c1id, dc1d ], [ c2id, dc2d ] ]);
	expectOnDelete(cache.block.get(p1id) as any, deleted_data, stack);
});

it(`manual=false,child_ids=string`, async () => {
	const cache = constructCache([ c1id, c2id, c3id ]),
		stack: IOperation[] = [];

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ c1id, c2id ],
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

	expectOnDelete(cache.block.get(p1id) as any, deleted_data, stack);
});

it(`manual=true,child_ids=string`, async () => {
	const stack: IOperation[] = [];
	const cache = constructCache([ c1id, c2id, c3id ]);

	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ c1id, c2id ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_path: 'content',
			stack,
			manual: true,
			...delete_props_2
		},
		(_, data, container) => {
			data.alive = false;
			container.push(data);
		}
	);

	expect(cache.block.get(p1id)).toStrictEqual(up1d);
	expect(deleted_data).toStrictEqual([
		{
			id: c1id,
			alive: false
		},
		{
			id: c2id,
			alive: false
		}
	]);
	expect(stack).toStrictEqual([ p1uo ]);
});

it(`manual=false,child_path=undefined`, async () => {
	const stack: IOperation[] = [];
	const cache = constructCache([ c1id, c2id ]);
	const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
		[ c1id ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			...delete_props_2,
			stack
		} as any,
		(_, data, container) => container.push(data)
	);

	expect(cache.block.get(p1id)).toStrictEqual({
		id: p1id,
		content: [ c1id, c2id ],
		...last_edited_props
	});
	expect(deleted_data as any).toStrictEqual([ dc1d ]);
	expect(stack).toStrictEqual([ c1do, p1uo ]);
});

it(`manual=true,child_ids=string,content=undefined`, async () => {
	const stack: IOperation[] = [];
	const cache: ICache = {
		block: new Map([ cd(p1id), cd(c1id), cd(c2id) ])
	} as any;

	await ChildTraverser.delete<IPage, TBlock>([ c1id ], (id) => cache.block.get(id), {
		container: [],
		cache,
		...delete_props_2,
		stack
	} as any);

	expect(cache.block.get(p1id)).toStrictEqual({
		id: p1id,
		...last_edited_props
	});
	expect(stack).toStrictEqual([ p1uo ]);
});
