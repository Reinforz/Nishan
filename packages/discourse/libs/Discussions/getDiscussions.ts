import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { FilterTypes, NotionTraverser } from '@nishans/traverser';
import { IDiscussion, IPage } from '@nishans/types';

export const getDiscussions = async (
	block_id: string,
	args: FilterTypes<IDiscussion>,
	options: INotionOperationOptions & INotionCacheOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(block_id, 'block', options);
	return await NotionTraverser.get<IPage, IDiscussion, IDiscussion[]>(
		args,
		(child_id) => options.cache.discussion.get(child_id),
		{
			multiple: options.multiple,
			child_ids: 'discussions' as any,
			child_type: 'discussion',
			container: [],
			parent_id: block_id,
			parent_type: 'block',
			...options
		},
		async (_, data, discussions) => discussions.push(data)
	);
};
