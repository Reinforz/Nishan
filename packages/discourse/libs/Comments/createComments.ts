import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation, TTextFormat } from '@nishans/types';
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
		const comment_data = NotionInit.comment({
			created_by_id: options.user_id,
			last_edited_by_id: options.user_id,
			id: comment_id,
			parent_id: arg.discussion_id,
			shard_id: options.shard_id,
			space_id: options.space_id,
			text: arg.text
		});
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
