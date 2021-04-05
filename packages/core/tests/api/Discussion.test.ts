import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, last_edited_props, o } from '../../../core/tests/utils';
import { Discussion } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`createComments`, async () => {
	const discussion_data: any = { id: 'discussion_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			discussion: new Map([ [ 'discussion_1', discussion_data ] ])
		},
		options = {
			...default_nishan_arg,
			cache,
			id: 'discussion_1',
			cache_init_tracker: new Map([ [ 'discussion_1', true ] ]) as any
		},
		comment_id = NotionIdz.Generate.id(),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined),
		comment_1_data = {
			parent_id: expect.any(String),
			parent_table: 'discussion',
			text: [ [ 'First Comment' ] ],
			alive: true,
			id: comment_id,
			version: 1,
			space_id: options.space_id,
			shard_id: options.shard_id,
			created_by_id: options.user_id,
			created_by_table: 'notion_user',
			last_edited_by_id: options.user_id,
			last_edited_by_table: 'notion_user'
		};

	const discussion = new Discussion(options);

	const comments = await discussion.createComments([
		{
			text: [ [ 'First Comment' ] ],
			comment_id
		}
	]);

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.u(comment_id, [], expect.objectContaining(comment_1_data)),
		o.d.la('discussion_1', [ 'comments' ], {
			id: comment_id
		})
	]);
	expect(cache.comment.get(comment_id)).toStrictEqual(expect.objectContaining(comment_1_data));
	expect(discussion_data.comments).toStrictEqual([ comment_id ]);
	expect(comments[0].getCachedData()).toStrictEqual(expect.objectContaining(comment_1_data));
});

it('getComments', async () => {
	const comment_1: any = {
			context: [ [ 'Context' ] ],
			resolved: false,
			id: 'comment_1'
		},
		cache: any = {
			...NotionCache.createDefaultCache(),
			discussion: new Map([ [ 'discussion_1', { id: 'discussion_1', comments: [ 'comment_1' ] } ] ]),
			comment: new Map([ [ 'comment_1', comment_1 ] ])
		},
		options = {
			...default_nishan_arg,
			cache,
			id: 'discussion_1',
			cache_init_tracker: new Map([ [ 'discussion_1', true ] ]) as any
		},
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => ({} as any));

	const discussion = new Discussion(options);

	const comment = await discussion.getComment('comment_1');
	expect(comment.getCachedData()).toStrictEqual(comment_1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'discussion_1', 'discussion' ]);
});

it(`updateComments`, async () => {
	const comment_1: any = { id: 'comment_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			discussion: new Map([ [ 'discussion_1', { comments: [ 'comment_1' ] } as any ] ]),
			comment: new Map([ [ 'comment_1', comment_1 ] ])
		},
		options = {
			...default_nishan_arg,
			id: 'discussion_1',
			cache_init_tracker: new Map([ [ 'discussion_1', true ] ]),
			cache
		} as any,
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const discussion = new Discussion(options);

	const comment = await discussion.updateComment([
		'comment_1',
		{
			text: [ [ 'New Comment' ] ]
		}
	]);

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.u('comment_1', [], { ...last_edited_props, text: [ [ 'New Comment' ] ] })
	]);
	expect(comment_1.text).toStrictEqual([ [ 'New Comment' ] ]);
	expect(comment.getCachedData()).toStrictEqual(comment_1);
});

it(`deleteComments`, async () => {
	const comment_data: any = { id: 'comment_1', parent_id: 'discussion_1' },
		discussion_data: any = { comments: [ 'comment_1' ], id: 'discussion_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			comment: new Map([ [ 'comment_1', comment_data ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_data ] ])
		},
		options = {
			...default_nishan_arg,
			id: 'discussion_1',
			cache_init_tracker: new Map([ [ 'discussion_1', true ] ]),
			cache
		} as any,
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const discussion = new Discussion(options);
	await discussion.deleteComment('comment_1');
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.u('comment_1', [], {
			alive: false,
			...last_edited_props
		}),
		o.d.lr('discussion_1', [ 'comments' ], {
			id: 'comment_1'
		})
	]);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'discussion_1', 'discussion' ]);
	expect(comment_data.alive).toBe(false);
	expect(discussion_data.comments).toStrictEqual([]);
});

// Page
