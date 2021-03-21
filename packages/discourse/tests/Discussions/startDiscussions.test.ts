import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

it(`NishanDiscourse.startDiscussions`, async () => {
	const block_1_id = NotionIdz.Generate.id(),
		block_1: any = {
			id: block_1_id,
			discussions: [],
			properties: { title: [ [ 'New Comment' ] ] }
		},
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ block_1_id, block_1 ] ])
		},
		comment_1_id = NotionIdz.Generate.id(),
		discussion_id = NotionIdz.Generate.id();
	const options = {
			...default_nishan_arg,
			cache
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined),
		comment_1_data = {
			parent_id: expect.any(String),
			parent_table: 'discussion',
			text: [ [ 'First Comment' ] ],
			alive: true,
			id: comment_1_id,
			version: 1,
			space_id: options.space_id,
			shard_id: options.shard_id,
			created_by_id: options.user_id,
			created_by_table: 'notion_user',
			last_edited_by_id: options.user_id,
			last_edited_by_table: 'notion_user'
		},
		discussion_data = {
			id: expect.any(String),
			parent_id: block_1_id,
			parent_table: 'block',
			resolved: false,
			context: [ [ 'New Comment' ] ],
			comments: [ comment_1_id ],
			version: 1,
			space_id: options.space_id,
			shard_id: options.shard_id
		};

	await NotionDiscourse.Discussions.start(
		[
			{
				comments: [
					{
						id: comment_1_id,
						text: [ [ 'First Comment' ] ]
					}
				],
				block_id: block_1_id,
				discussion_id: discussion_id
			}
		],
		options
	);

	expect(cache.comment.get(comment_1_id)).toStrictEqual(expect.objectContaining(comment_1_data));
	expect(cache.discussion.get(discussion_id)).toStrictEqual(expect.objectContaining(discussion_data));
	expect(cache.block.get(block_1_id)).toStrictEqual(expect.objectContaining({ discussions: [ discussion_id ] }));
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.u(comment_1_id, [], expect.objectContaining(comment_1_data)),
		o.d.u(discussion_id, [], expect.objectContaining(discussion_data)),
		o.b.la(
			block_1_id,
			[ 'discussions' ],
			expect.objectContaining({
				id: discussion_id
			})
		)
	]);
});
