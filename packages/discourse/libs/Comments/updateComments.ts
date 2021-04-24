import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { UpdateTypes } from '@nishans/traverser';
import { IComment } from '@nishans/types';
import { ICommentUpdateInput } from '../';

export const updateComments = async (
	discussion_id: string,
	args: UpdateTypes<IComment, ICommentUpdateInput>,
	options: INotionCacheOptions & INotionOperationOptions & { multiple?: boolean }
) => {
	await NotionCache.initializeCacheForSpecificData(discussion_id, 'discussion', options);

	return []
};
