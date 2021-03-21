import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IComment, IDiscussion, IOperation, IText, TTextFormat } from '@nishans/types';

export const startDiscussions = async (
	ids: { block_id: string; discussion_id?: string },
	comments: { text: TTextFormat; id?: string }[],
	options: INotionCacheOptions & INotionOperationOptions
) => {
	const comment_creation_operations: IOperation[] = [],
		comment_ids: string[] = [],
		discussion_id = NotionIdz.Generate.id(ids.discussion_id);
	comments.forEach((comment) => {
		const comment_id = NotionIdz.Generate.id(comment.id);
		comment_ids.push(comment_id);
		const comment_data: IComment = {
			parent_id: discussion_id,
			parent_table: 'discussion',
			text: comment.text,
			alive: true,
			id: comment_id,
			version: 1,
			space_id: options.space_id,
			shard_id: options.shard_id,
			created_by_id: options.user_id,
			created_by_table: 'notion_user',
			created_time: Date.now(),
			last_edited_by_id: options.user_id,
			last_edited_by_table: 'notion_user',
			last_edited_time: Date.now()
		};
		comment_creation_operations.push(
			NotionOperations.Chunk.comment.update(comment_id, [], JSON.parse(JSON.stringify(comment_data, null, 2)))
		);
		options.cache.comment.set(comment_id, comment_data);
	});
	const block_data: IText = (await NotionCache.fetchDataOrReturnCached('block', ids.block_id, options)) as IText;

	const discussion_data: IDiscussion = {
		id: discussion_id,
		parent_id: ids.block_id,
		parent_table: 'block',
		resolved: false,
		context: block_data.properties.title,
		comments: comment_ids,
		version: 1,
		space_id: options.space_id,
		shard_id: options.shard_id
	};

	options.cache.discussion.set(discussion_id, discussion_data);
	if (!block_data.discussions) block_data.discussions = [ discussion_id ];
	else block_data.discussions.push(discussion_id);

	await NotionOperations.executeOperations(
		[
			NotionOperations.Chunk.discussion.update(discussion_id, [], JSON.parse(JSON.stringify(discussion_data, null, 2))),
			...comment_creation_operations,
			NotionOperations.Chunk.block.listAfter(ids.block_id, [ 'discussions' ], {
				id: discussion_id
			})
		],
		options
	);
};
