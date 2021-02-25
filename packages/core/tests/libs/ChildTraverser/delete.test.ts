import { ICache } from '@nishans/cache';
import { ICollection, IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { last_edited_props } from '../../utils/lastEditedProps';
import { o } from '../../utils/operations';
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
	delete_props,
	p1id,
	p1uo,
	up1d
} from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`manual=false`, async () => {
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
			stack,
			logger: logger_spy,
			...delete_props
		},
		(id, data, container) => {
			cb_spy(id, data);
			container.push(data);
		}
	);

	expect(logger_spy.mock.calls).toEqual([ [ 'DELETE', 'block', c1id ], [ 'DELETE', 'block', c2id ] ]);
	expect(cb_spy.mock.calls).toEqual([ [ c1id, dc1d ], [ c2id, dc2d ] ]);
	expect(cache.block.get(p1id)).toStrictEqual({
		id: p1id,
		content: [ c3id ],
		...last_edited_props
	});
	expect(deleted_data).toStrictEqual([ dc1d, dc2d ]);
	expect(stack).toStrictEqual([ c1do, c1ro, c2do, c2ro, p1uo ]);
});

it(`manual=true`, async () => {
	const stack: IOperation[] = [];
	const cache = constructCache([ c1id, c2id, c3id ]);

	await ChildTraverser.delete<IPage, TBlock>([ c1id, c2id ], (id) => cache.block.get(id), {
		container: [],
		cache,
		child_path: 'content',
		stack,
		manual: true,
		...delete_props
	});

	expect(cache.block.get(p1id)).toStrictEqual(up1d);
	expect(stack).toStrictEqual([ p1uo ]);
});

it(`child_path & parent_path != block, child_path=undefined`, async () => {
	const stack: IOperation[] = [];
	const cache = {
		collection: new Map([
			[
				p1id,
				{
					id: p1id,
					content: [ c1id ]
				}
			],
			cd(c1id)
		])
	} as ICache;

	await ChildTraverser.delete<IPage, ICollection>([ c1id ], (id) => cache.collection.get(id), {
		container: [],
		cache,
		...delete_props,
		parent_type: 'collection',
		child_type: 'collection',
		child_path: undefined,
		stack
	});

	expect(cache.collection.get(p1id)).toStrictEqual({
		id: p1id,
		content: [ c1id ]
	});
	expect(stack).toStrictEqual([
		o.c.u(c1id, [], {
			alive: false
		})
	]);
});
