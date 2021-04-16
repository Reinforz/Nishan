import { INotionCacheOptions } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IComment, IOperation } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { ICommentCreateInput } from '../';

export const createComments = async (
	discussion_id: string,
	args: ICommentCreateInput[],
	options: Omit<INotionCacheOptions, 'cache_init_tracker'> & INotionOperationOptions
) => {
	const operations: IOperation[] = [],
		comments: IComment[] = [];
	args.forEach((arg) => {
		const discussion_data = options.cache.discussion.get(discussion_id)!;

		const comment_id = NotionIdz.Generate.id(arg.id);
		const comment_data = NotionInit.comment({
			created_by_id: options.user_id,
			last_edited_by_id: options.user_id,
			id: comment_id,
			parent_id: discussion_id,
			shard_id: options.shard_id,
			space_id: options.space_id,
			text: arg.text
		});
		comments.push(comment_data);
		operations.push(
			NotionOperations.Chunk.comment.update(comment_id, [], JSON.parse(JSON.stringify(comment_data, null, 2))),
			NotionOperations.Chunk.discussion.listAfter(discussion_id, [ 'comments' ], {
				id: comment_id
			})
		);
		options.cache.comment.set(comment_id, comment_data);
		NotionUtils.populateChildPath({ data: discussion_data, child_path: 'comments', child_id: comment_id });
	});

	return { comments, operations };
};
