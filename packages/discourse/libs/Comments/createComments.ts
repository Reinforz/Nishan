import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IComment, IOperation, TTextFormat } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

export const createComments = async (
	args: { comment_id?: string; text: TTextFormat; discussion_id: string }[],
	options: INotionCacheOptions & INotionOperationOptions
) => {
	await NotionCache.fetchMultipleDataOrReturnCached(args.map((arg) => [ arg.discussion_id, 'discussion' ]), options);
	const operations: IOperation[] = [];
	args.forEach((arg) => {
		const discussion_data = options.cache.discussion.get(arg.discussion_id)!;

		const comment_id = NotionIdz.Generate.id(arg.comment_id);
		const comment_data: IComment = {
			parent_id: arg.discussion_id,
			parent_table: 'discussion',
			text: arg.text,
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
		operations.push(
			NotionOperations.Chunk.comment.update(comment_id, [], JSON.parse(JSON.stringify(comment_data, null, 2))),
			NotionOperations.Chunk.discussion.listAfter(arg.discussion_id, [ 'comments' ], {
				id: comment_id
			})
		);
		options.cache.comment.set(comment_id, comment_data);
		NotionUtils.populateChildPath({ data: discussion_data, child_path: 'comments', child_id: comment_id });
	});

	await NotionOperations.executeOperations(operations, options);
};
