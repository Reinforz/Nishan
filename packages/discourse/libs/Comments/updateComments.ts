import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { NotionTraverser, UpdateTypes } from '@nishans/traverser';
import { IComment, IDiscussion } from '@nishans/types';
import { ICommentUpdateInput } from '../';

export const updateComments = async (
	discussion_id: string,
	args: UpdateTypes<IComment, ICommentUpdateInput>,
	options: INotionCacheOptions & INotionOperationOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(discussion_id, 'discussion', options);

	return await NotionTraverser.update<IDiscussion, IComment, ICommentUpdateInput, IComment[]>(
		args,
		(child_id) => options.cache.comment.get(child_id),
		{
			multiple: options.multiple,
			child_ids: 'comments',
			child_type: 'comment',
			container: [],
			parent_id: discussion_id,
			parent_type: 'discussion',
			...options
		},
		async (_, data, __, discussions) => discussions.push(data)
	);
};
