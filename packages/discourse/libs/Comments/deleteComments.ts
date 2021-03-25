import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { FilterTypes, NotionTraverser } from '@nishans/traverser';
import { IComment, IDiscussion } from '@nishans/types';

export const deleteComments = async (
	discussion_id: string,
	args: FilterTypes<IComment>,
	options: INotionCacheOptions & INotionOperationOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(discussion_id, 'discussion', options);
	return await NotionTraverser.delete<IDiscussion, IComment, IComment[]>(
		args,
		(child_id) => options.cache.comment.get(child_id),
		{
			child_path: 'comments',
			multiple: options.multiple,
			child_ids: 'comments',
			child_type: 'comment',
			container: [],
			parent_id: discussion_id,
			parent_type: 'discussion',
			...options
		},
		async (_, data, discussions) => discussions.push(data)
	);
};
