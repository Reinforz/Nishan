import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { NotionTraverser, UpdateTypes } from '@nishans/traverser';
import { IComment, IDiscussion, TTextFormat } from '@nishans/types';

export const updateComments = async (
	discussion_id: string,
	args: UpdateTypes<IComment, { text?: TTextFormat }>,
	options: INotionCacheOptions & INotionOperationOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(discussion_id, 'discussion', options);

	return await NotionTraverser.update<IDiscussion, IComment, { text?: TTextFormat }, IComment[]>(
		args,
		(child_id) => options.cache.comment.get(child_id),
		{
			multiple: options.multiple,
			child_ids: 'discussions' as any,
			child_type: 'discussion',
			container: [],
			parent_id: discussion_id,
			parent_type: 'block',
			...options
		},
		async (_, data, __, discussions) => discussions.push(data)
	);
};
