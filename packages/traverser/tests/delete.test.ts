import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { ICache, ICollection, IPage, TBlock } from '@nishans/types';
import { last_edited_props, o } from '../../core/tests/utils';
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
	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementation(async () => undefined);
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
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([ c1ro ]);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([ c2ro ]);
	expect(executeOperationsMock.mock.calls[2][0]).toStrictEqual([ c1do, c2do, p1uo ]);
});

it(`manual=true`, async () => {
	const cache = constructCache([ c1id, c2id, c3id ]);
	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementationOnce(async () => undefined);

	await NotionTraverser.delete<IPage, TBlock>([ c1id, c2id ], (id) => cache.block.get(id), {
		...delete_props,
		container: [],
		cache,
		child_path: 'content',
		manual: true
	});

	expect(cache.block.get(p1id)).toStrictEqual(up1d);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([ p1uo ]);
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
	} as ICache;

	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementationOnce(async () => undefined);

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
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.c.u(c1id, [], {
			alive: false
		})
	]);
});
