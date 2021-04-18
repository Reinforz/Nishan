import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionLogger } from '@nishans/logger';
import { v4 } from 'uuid';
import { createExecuteOperationsMock } from '../../../../../utils/tests';
import { NotionCore } from '../../../libs';
import { default_nishan_arg, last_edited_props, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const construct = () => {
	const discussion_1: any = {
			id: 'discussion_1',
			parent_id: 'block_1',
			parent_table: 'block',
			comments: [ 'comment_1' ]
		},
		comment_1: any = {
			context: [ [ 'Context' ] ],
			resolved: false,
			id: 'comment_1'
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
		block_2: any = { parent_table: 'block', parent_id: 'block_3', id: 'block_2', type: 'collection_view_page' },
		block_3: any = {
			parent_table: 'space',
			parent_id: 'space_1',
			id: 'block_3',
			type: 'page',
			content: [ 'block_1', 'block_2' ]
		},
		block_4: any = { parent_table: 'space', parent_id: 'space_1', id: 'block_4', type: 'page', content: [] },
		cache = {
			...NotionCache.createDefaultCache(),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: [ 'block_3' ] } ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ]),
			block: new Map([
				[ 'block_1', block_1 ],
				[ 'block_2', block_2 ],
				[ 'block_3', block_3 ],
				[ 'block_4', block_4 ]
			]),
			comment: new Map([ [ 'comment_1', comment_1 ] ])
		} as any,
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined),
		{ e1, executeOperationsMock } = createExecuteOperationsMock();
	const logger_spy = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

	const block_1_obj = new NotionCore.Api.Block({
			...default_nishan_arg,
			cache
		}),
		block_2_obj = new NotionCore.Api.Block({
			...default_nishan_arg,
			id: 'block_2',
			cache
		}),
		block_3_obj = new NotionCore.Api.Block({
			...default_nishan_arg,
			id: 'block_3',
			cache
		});

	return {
		block_4,
		discussion_1,
		block_3,
		block_2,
		block_1_obj,
		block_2_obj,
		block_3_obj,
		initializeCacheForSpecificDataMock,
		executeOperationsMock,
		block_1,
		cache,
		logger_spy,
		e1
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

	const block = new NotionCore.Api.Block({
		...default_nishan_arg,
		cache
	});

	const cached_parent_data = await block.getCachedParentData();
	expect(cached_parent_data).toStrictEqual({
		id: 'block_2'
	});
});

describe('reposition', () => {
	it('parent_table=block', async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
				[ 'block_2', { id: 'block_2', type: 'page' } ]
			])
		} as any;

		const block = new NotionCore.Api.Block({
			...default_nishan_arg,
			cache
		});

		const { e1 } = createExecuteOperationsMock();

		await block.reposition();
		e1([ o.b.la('block_2', [ 'content' ], expect.objectContaining({ id: 'block_1' })) ]);
	});

	it('parent_table=space', async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', parent_table: 'space', parent_id: 'space_1' } ] ]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: [] } ] ])
		} as any;

		const block = new NotionCore.Api.Block({
			...default_nishan_arg,
			cache
		});

		const { e1 } = createExecuteOperationsMock();

		await block.reposition();
		e1([ o.s.la('space_1', [ 'pages' ], expect.objectContaining({ id: 'block_1' })) ]);
	});
});

it('update', async () => {
	const { block_1_obj, e1, block_1, logger_spy } = construct();

	await block_1_obj.update({
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
	e1([
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
		const { block_1_obj, e1, cache, logger_spy } = construct();

		const id = v4();
		const cached_data = {
			id,
			copied_from: 'block_1',
			type: 'header'
		};

		await block_1_obj.duplicate([ id ]);
		expect(cache.block.get(id)).toStrictEqual(expect.objectContaining(cached_data));
		expect(logger_spy).toHaveBeenCalledWith(`CREATE block ${id}`);
		e1([ o.b.u(id, [], expect.objectContaining(cached_data)) ]);
	});

	it(`type=collection_view_page,arg=number`, async () => {
		const { cache, e1 } = construct();

		const block = new NotionCore.Api.Block({
			...default_nishan_arg,
			id: 'block_2',
			cache
		});

		const PopulateMapBlockMock = jest.spyOn(NotionCore.PopulateMap, 'block').mockImplementation(async () => undefined);
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
		e1([ o.b.u(expect.any(String), [], expect.objectContaining(cached_data)) ]);
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
	const { block_1, block_1_obj, logger_spy, e1 } = construct();

	await block_1_obj.convertTo('page');

	expect(block_1).toStrictEqual(
		expect.objectContaining({
			type: 'page'
		})
	);

	e1([ o.b.u('block_1', [ 'type' ], 'page'), o.b.u('block_1', [], last_edited_props) ]);

	expect(logger_spy).toHaveBeenCalledWith('UPDATE block block_1');
});

describe('delete', () => {
	it(`parent_table=block`, async () => {
		const { block_1, block_1_obj, logger_spy, executeOperationsMock, e1 } = construct();

		await block_1_obj.delete();

		expect(logger_spy).toHaveBeenCalledTimes(2);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'DELETE block block_1');
		expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE block block_3');
		expect(block_1).toEqual(
			expect.objectContaining({
				alive: false
			})
		);
		expect(executeOperationsMock).toHaveBeenCalledTimes(1);
		e1([
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

	it(`parent_table=space`, async () => {
		const { block_3, block_3_obj, logger_spy, executeOperationsMock, e1 } = construct();

		await block_3_obj.delete();

		expect(logger_spy).toHaveBeenCalledTimes(2);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'DELETE block block_3');
		expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE space space_1');
		expect(block_3).toEqual(
			expect.objectContaining({
				alive: false
			})
		);
		expect(executeOperationsMock).toHaveBeenCalledTimes(1);
		e1([
			o.b.u(
				'block_3',
				[],
				expect.objectContaining({
					alive: false
				})
			),
			o.s.u('space_1', [], last_edited_props)
		]);
	});
});

it(`transfer`, async () => {
	const { block_1, block_3, block_4, block_1_obj, logger_spy, e1 } = construct();

	await block_1_obj.transfer('block_4');

	expect(logger_spy).toHaveBeenCalledTimes(3);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE block block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE block block_3');
	expect(logger_spy).toHaveBeenNthCalledWith(3, 'UPDATE block block_4');

	expect(block_1.parent_id).toBe('block_4');
	expect(block_3.content).toEqual([ 'block_2' ]);
	expect(block_4.content).toEqual([ 'block_1' ]);

	e1([
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
	const { e1, block_1_obj, cache } = construct();
	const comment_id = v4(),
		discussion_id = v4();
	const discussions = await block_1_obj.createDiscussions([
		{
			id: discussion_id,
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
	e1([
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
	const { block_1_obj, discussion_1, initializeCacheForSpecificDataMock } = construct();

	const discussion = await block_1_obj.getDiscussion('discussion_1');

	expect(discussion.getCachedData()).toStrictEqual(discussion_1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
});

it(`deleteDiscussion`, async () => {
	const { block_1_obj, e1, initializeCacheForSpecificDataMock } = construct();

	const discussion = await block_1_obj.deleteDiscussion('discussion_1');

	expect(discussion.getCachedData()).toStrictEqual(
		expect.objectContaining({
			id: 'discussion_1'
		})
	);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	e1([
		o.b.lr('block_1', [ 'discussions' ], {
			id: 'discussion_1'
		}),
		o.b.u('block_1', [], last_edited_props)
	]);
});

it(`updateDiscussion`, async () => {
	const { block_1_obj, e1, initializeCacheForSpecificDataMock } = construct();

	const discussion = await block_1_obj.updateDiscussion([ 'discussion_1', { resolved: false } ]);

	expect(discussion.getCachedData()).toStrictEqual(
		expect.objectContaining({
			id: 'discussion_1',
			resolved: false
		})
	);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	e1([
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

it('getComments', async () => {
	const { block_1_obj, cache, initializeCacheForSpecificDataMock } = construct();

	const comment = await block_1_obj.getComment('comment_1');
	expect(comment.getCachedData()).toStrictEqual(cache.comment.get('comment_1'));
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
});
