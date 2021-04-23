import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { NotionTraverser, UpdateTypes } from '@nishans/traverser';
import { IDiscussion, IPage, TTextFormat } from '@nishans/types';

export const updateDiscussions = async (
	block_id: string,
	args: UpdateTypes<IDiscussion, { context?: TTextFormat; resolved?: boolean }>,
	options: INotionOperationOptions & INotionCacheOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(block_id, 'block', options);
	try{
    await NotionTraverser.update<
      IPage,
      IDiscussion,
      { context?: TTextFormat; resolved?: boolean },
      IDiscussion[]
    >(
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
      async (_, data, __, discussions) => discussions.push(data)
    );
  }catch(err){
    console.log("updateDiscussions error", err.message)
  }
};
