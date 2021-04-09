import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createDiscussions', () => {
	const init = () => {
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
		return {
			block_1,
			block_1_id,
			discussion_data,
			comment_1_data,
			discussion_id,
			options,
			comment_1_id,
			cache
		};
	};

	it(`default input`, async () => {
		const { comment_1_data, block_1_id, discussion_id, options, comment_1_id, cache, discussion_data } = init();
		const { discussions, operations } = await NotionDiscourse.Discussions.create(
			block_1_id,
			[
				{
					comments: [
						{
							id: comment_1_id,
							text: [ [ 'First Comment' ] ]
						}
					],
					id: discussion_id
				}
			],
			options
		);

		expect(cache.comment.get(comment_1_id)).toStrictEqual(expect.objectContaining(comment_1_data));
		expect(cache.discussion.get(discussion_id)).toStrictEqual(expect.objectContaining(discussion_data));
		expect(cache.block.get(block_1_id)).toStrictEqual(expect.objectContaining({ discussions: [ discussion_id ] }));
		expect(operations).toStrictEqual([
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
		expect(discussions).toStrictEqual([ discussion_data ]);
	});

	it(`custom input`, async () => {
		const { comment_1_data, block_1_id, discussion_id, options, comment_1_id, cache, discussion_data } = init();
		const { discussions, operations } = await NotionDiscourse.Discussions.create(
			block_1_id,
			[
				{
					context: [ [ 'Different context' ] ],
					comments: [
						{
							id: comment_1_id,
							text: [ [ 'First Comment' ] ]
						}
					],
					id: discussion_id
				}
			],
			options
		);

		expect(cache.comment.get(comment_1_id)).toStrictEqual(expect.objectContaining(comment_1_data));
		expect(cache.discussion.get(discussion_id)).toStrictEqual(
			expect.objectContaining({ ...discussion_data, context: [ [ 'Different context' ] ] })
		);
		expect(cache.block.get(block_1_id)).toStrictEqual(expect.objectContaining({ discussions: [ discussion_id ] }));
		expect(operations).toStrictEqual([
			o.cm.u(comment_1_id, [], expect.objectContaining(comment_1_data)),
			o.d.u(discussion_id, [], expect.objectContaining({ ...discussion_data, context: [ [ 'Different context' ] ] })),
			o.b.la(
				block_1_id,
				[ 'discussions' ],
				expect.objectContaining({
					id: discussion_id
				})
			)
		]);
		expect(discussions).toStrictEqual([ { ...discussion_data, context: [ [ 'Different context' ] ] } ]);
	});
});
