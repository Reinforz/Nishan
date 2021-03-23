import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation, TTextFormat } from '@nishans/types';

export const updateDiscussions = async (
	args: { id: string; context?: TTextFormat; resolved?: boolean }[],
	options: INotionOperationOptions & INotionCacheOptions
) => {
	const operations: IOperation[] = [];
  await NotionCache.fetchMultipleDataOrReturnCached(args.map(arg=>[arg.id, 'discussion']), options);
	args.forEach((arg) => {
    const discussion_data = options.cache.discussion.get(arg.id)!;
    discussion_data.context = arg.context ?? discussion_data.context;
    discussion_data.resolved = arg.resolved ?? discussion_data.resolved;

		operations.push(NotionOperations.Chunk.discussion.update(arg.id, [ ], {
      context: discussion_data.context,
      resolved: discussion_data.resolved,
    }));
	});
	await NotionOperations.executeOperations(operations, options);
};
