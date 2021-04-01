import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, o } from '../../../core/tests/utils';
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
