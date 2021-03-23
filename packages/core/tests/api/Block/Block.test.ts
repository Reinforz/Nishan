import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { v4 } from 'uuid';
import { Block, PopulateMap } from '../../../libs';
import { default_nishan_arg, last_edited_props, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const construct = () => {
	const discussion_1: any = {
			id: 'discussion_1'
		},
		block_1: any = {
			type: 'header',
			id: 'block_1',
			properties: { title: [ [ 'Title' ] ] },
			format: { page_full_width: false },
			parent_id: 'block_3',
			parent_table: 'block',
			discussions: [ 'discussion_1' ]
		},
		block_2: any = { parent_id: 'block_3', id: 'block_2', type: 'collection_view_page' },
		block_3: any = { parent_id: 'space_1', id: 'block_3', type: 'page', content: [ 'block_1', 'block_2' ] },
		block_4: any = { parent_id: 'space_1', id: 'block_4', type: 'page', content: [] },
		cache = {
			...NotionCache.createDefaultCache(),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ]),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ], [ 'block_4', block_4 ] ])
		} as any,
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);
	const logger_spy = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	return {
		block_4,
		discussion_1,
		block_3,
		block_2,
		block,
		initializeCacheForSpecificDataMock,
		executeOperationsMock,
		block_1,
		cache,
		logger_spy
	};
};

it('getCachedParentData', async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2' } ]
		])
	} as any;

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	const cached_parent_data = await block.getCachedParentData();
	expect(cached_parent_data).toStrictEqual({
		id: 'block_2'
	});
});

it('reposition', async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2', type: 'page' } ]
		])
	} as any;

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementationOnce(async () => undefined);

	await block.reposition();
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.la('block_2', [ 'content' ], expect.objectContaining({ id: 'block_1' }))
	]);
});

it('update', async () => {
	const { block, executeOperationsMock, block_1, logger_spy } = construct();

	await block.update({
		properties: {
			title: [ [ 'New Title' ] ]
		}
	});

	expect(block_1).toStrictEqual(
		expect.objectContaining({
			properties: {
				title: [ [ 'New Title' ] ]
			}
		})
	);
	expect(logger_spy).toHaveBeenCalledWith('UPDATE block block_1');
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				properties: {
					title: [ [ 'New Title' ] ]
				}
			})
		)
	]);
});

describe('duplicate', () => {
	it(`type=header,arg=number`, async () => {
		const { block, executeOperationsMock, cache, logger_spy } = construct();

		const id = v4();
		const cached_data = {
			id,
			copied_from: 'block_1',
			type: 'header'
		};

		await block.duplicate([ id ]);
		expect(cache.block.get(id)).toStrictEqual(expect.objectContaining(cached_data));
		expect(logger_spy).toHaveBeenCalledWith(`CREATE block ${id}`);
		expect(executeOperationsMock.mock.calls[0][0]).toEqual([ o.b.u(id, [], expect.objectContaining(cached_data)) ]);
	});

	it(`type=collection_view_page,arg=number`, async () => {
		const { cache, executeOperationsMock } = construct();

		const block = new Block({
			...default_nishan_arg,
			id: 'block_2',
			cache
		});

		const PopulateMapBlockMock = jest.spyOn(PopulateMap, 'block').mockImplementation(async () => undefined);
		const NotionMutationsEnqueueTaskMock = jest
			.spyOn(NotionEndpoints.Mutations, 'enqueueTask')
			.mockImplementation(async () => undefined as any);

		const cached_data = {
			id: expect.any(String),
			type: 'copy_indicator',
			parent_id: 'block_3',
			parent_table: 'block',
			alive: true
		};

		await block.duplicate(1);

		expect(PopulateMapBlockMock).toHaveBeenCalledTimes(1);
		expect(executeOperationsMock.mock.calls[0][0]).toEqual([
			o.b.u(expect.any(String), [], expect.objectContaining(cached_data))
		]);
		expect(NotionMutationsEnqueueTaskMock).toHaveBeenCalledWith(
			{
				task: {
					eventName: 'duplicateBlock',
					request: {
						sourceBlockId: 'block_2',
						targetBlockId: expect.any(String),
						addCopyName: true
					}
				}
			},
			expect.objectContaining({
				token: 'token',
				user_id: 'user_root_1',
				interval: 0
			})
		);
	});
});

it('convertTo', async () => {
	const { block_1, block, logger_spy, executeOperationsMock } = construct();

	await block.convertTo('page');

	expect(block_1).toStrictEqual(
		expect.objectContaining({
			type: 'page'
		})
	);

	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u('block_1', [ 'type' ], 'page'),
		o.b.u('block_1', [], last_edited_props)
	]);

	expect(logger_spy).toHaveBeenCalledWith('UPDATE block block_1');
});

it(`delete`, async () => {
	const { block_1, block, logger_spy, executeOperationsMock } = construct();

	await block.delete();

	expect(logger_spy).toHaveBeenCalledTimes(2);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'DELETE block block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE block block_3');
	expect(block_1).toEqual(
		expect.objectContaining({
			alive: false
		})
	);
	expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				alive: false
			})
		),
		o.b.u('block_3', [], last_edited_props)
	]);
});

it(`transfer`, async () => {
	const { block_1, block_3, block_4, block, logger_spy, executeOperationsMock } = construct();

	await block.transfer('block_4');

	expect(logger_spy).toHaveBeenCalledTimes(3);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE block block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE block block_3');
	expect(logger_spy).toHaveBeenNthCalledWith(3, 'UPDATE block block_4');

	expect(block_1.parent_id).toBe('block_4');
	expect(block_3.content).toEqual([ 'block_2' ]);
	expect(block_4.content).toEqual([ 'block_1' ]);

	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				parent_table: 'block',
				parent_id: 'block_4'
			})
		),
		o.b.lr(
			'block_3',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.la(
			'block_4',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.u('block_3', [], last_edited_props),
		o.b.u('block_4', [], last_edited_props)
	]);
});

it(`createDiscussions`, async () => {
	const { executeOperationsMock, block, cache } = construct();
	const comment_id = v4(),
		discussion_id = v4();
	const discussions = await block.createDiscussions([
		{
			discussion_id,
			comments: [
				{
					id: comment_id,
					text: [ [ 'Comment One' ] ]
				}
			]
		}
	]);
	expect(cache.comment.get(comment_id)).toStrictEqual(
		expect.objectContaining({
			parent_id: discussion_id,
			parent_table: 'discussion',
			text: [ [ 'Comment One' ] ],
			id: comment_id
		})
	);
	expect(cache.discussion.get(discussion_id)).toStrictEqual(
		expect.objectContaining({
			id: discussion_id,
			parent_id: 'block_1',
			parent_table: 'block',
			resolved: false,
			context: [ [ 'Title' ] ],
			comments: [ comment_id ]
		})
	);
	expect(cache.block.get('block_1').discussions).toStrictEqual([ 'discussion_1', discussion_id ]);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.u(
			comment_id,
			[],
			expect.objectContaining({
				id: comment_id
			})
		),
		o.d.u(
			discussion_id,
			[],
			expect.objectContaining({
				id: discussion_id
			})
		),
		o.b.la(
			'block_1',
			[ 'discussions' ],
			expect.objectContaining({
				id: discussion_id
			})
		)
	]);
	expect(discussions.length).toStrictEqual(1);
	expect(discussions[0].getCachedData()).toStrictEqual(
		expect.objectContaining({
			id: discussion_id
		})
	);
});

it(`getDiscussion`, async () => {
	const { block, discussion_1, initializeCacheForSpecificDataMock } = construct();

	const discussion = await block.getDiscussion('discussion_1');

	expect(discussion.getCachedData()).toStrictEqual(discussion_1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
});

it(`updateDiscussion`, async () => {
	const { block, executeOperationsMock, initializeCacheForSpecificDataMock } = construct();

	const discussion = await block.updateDiscussion([ 'discussion_1', { resolved: false } ]);

	expect(discussion.getCachedData()).toStrictEqual(
		expect.objectContaining({
			id: 'discussion_1',
			resolved: false
		})
	);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.d.u(
			'discussion_1',
			[],
			expect.objectContaining({
				resolved: false
			})
		),
		o.b.u('block_1', [], last_edited_props)
	]);
});
