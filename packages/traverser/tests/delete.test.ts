import { NotionLogger } from '@nishans/logger';
import { ICollection, INotionCache, IPage, TBlock } from '@nishans/types';
import { createExecuteOperationsMock } from '../../../utils/tests';
import { last_edited_props } from '../../core/tests/utils';
import { NotionTraverser } from '../libs';
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
	const child_ids = [ c1id, c2id, c3id ];
	const cache = constructCache(child_ids);
	const { e1 } = createExecuteOperationsMock();
	const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

	const cb_spy = jest.fn();

	const deleted_data = await NotionTraverser.delete<IPage, TBlock>(
		[ c1id, c2id ],
		(id) => cache.block.get(id),
		{
			...delete_props,
			container: [],
			cache,
			logger: true
		},
		(id, data, container) => {
			cb_spy(id, data);
			container.push(data);
		}
	);

	expect(methodLoggerMock.mock.calls).toEqual([ [ `DELETE block ${c1id}` ], [ `DELETE block ${c2id}` ] ]);
	expect(cb_spy.mock.calls).toEqual([ [ c1id, dc1d ], [ c2id, dc2d ] ]);
	expect(cache.block.get(p1id)).toStrictEqual({
		id: p1id,
		content: [ c3id ],
		type: 'page',
		...last_edited_props
	});
	expect(deleted_data).toStrictEqual([ dc1d, dc2d ]);
	e1([ c1do, c1ro, c2do, c2ro, p1uo ]);
});

it(`manual=true`, async () => {
	const cache = constructCache([ c1id, c2id, c3id ]);
	const { e1 } = createExecuteOperationsMock();

	await NotionTraverser.delete<IPage, TBlock>([ c1id, c2id ], (id) => cache.block.get(id), {
		...delete_props,
		container: [],
		cache,
		child_path: 'content',
		manual: true
	});

	expect(cache.block.get(p1id)).toStrictEqual(up1d);
	e1([ p1uo ]);
});

it(`child_type & parent_type != block, child_path=undefined`, async () => {
	const cache = {
		collection: new Map([
			[
				p1id,
				{
					id: p1id,
					content: [ c1id ],
					type: 'page'
				}
			],
			cd(c1id)
		])
	} as INotionCache;

	const { e1 } = createExecuteOperationsMock();

	await NotionTraverser.delete<IPage, ICollection>([ c1id ], (id) => cache.collection.get(id), {
		...delete_props,
		container: [],
		cache,
		parent_type: 'collection',
		child_type: 'collection',
		child_path: undefined
	});

	expect(cache.collection.get(p1id)).toStrictEqual({
		id: p1id,
		content: [ c1id ],
		type: 'page'
	});
	e1([]);
});
