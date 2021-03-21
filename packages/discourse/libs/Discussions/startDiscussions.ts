import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation, IText, TTextFormat } from '@nishans/types';

export const startDiscussions = async (
	block_id: string,
	comments: { text: TTextFormat; id?: string }[],
	options: INotionCacheOptions & INotionOperationOptions
) => {
	const comment_creation_operations: IOperation[] = [],
		comment_ids: string[] = [],
		discussion_id = NotionIdz.Generate.id();
	comments.forEach((comment) => {
		const comment_id = NotionIdz.Generate.id(comment.id);
		comment_ids.push(comment_id);
		comment_creation_operations.push(
			NotionOperations.Chunk.comment.set(comment_id, [], {
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
			})
		);
	});
	const block_data = (await NotionCache.fetchDataOrReturnCached('block', block_id, options)) as IText;

	await NotionOperations.executeOperations(
		[
			NotionOperations.Chunk.discussion.set(discussion_id, [], {
				id: discussion_id,
				parent_id: block_id,
				parent_table: 'block',
				resolved: false,
				context: block_data.properties.title,
				comments: comment_ids,
				version: 1,
				space_id: options.space_id,
				shard_id: options.shard_id
			}),
			...comment_creation_operations,
			NotionOperations.Chunk.block.listAfter(block_id, [ 'discussions' ], {
				id: discussion_id
			})
		],
		options
	);
};
