import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IComment, IDiscussion, IOperation } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

export const deleteComments = async (ids: string[], options: INotionCacheOptions & INotionOperationOptions) => {
	const operations: IOperation[] = [];
	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		const comment_data = (await NotionCache.fetchDataOrReturnCached('comment', id, options)) as IComment;
		const discussion_data = (await NotionCache.fetchDataOrReturnCached(
			'discussion',
			comment_data.parent_id,
			options
		)) as IDiscussion;
		comment_data.alive = false;
		discussion_data.comments = discussion_data.comments.filter((comment) => comment !== comment_data.id);
		operations.push(
			NotionOperations.Chunk.comment.set(comment_data.id, [ 'alive' ], false),
			NotionOperations.Chunk.discussion.listRemove(discussion_data.id, [ 'comments' ], {
				id: comment_data.id
			}),
			NotionOperations.Chunk.comment.update(
				comment_data.id,
				[],
				NotionUtils.updateLastEditedProps(comment_data, options.user_id)
			)
		);
	}
	await NotionOperations.executeOperations(operations, options);
};
