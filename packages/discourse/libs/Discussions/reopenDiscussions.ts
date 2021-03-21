import { INotionCacheOptions } from '@nishans/cache';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation } from '@nishans/types';

export const reopenDiscussions = async (ids: string[], options: INotionOperationOptions & INotionCacheOptions) => {
	const operations: IOperation[] = [];
	ids.forEach((id) => {
		operations.push(NotionOperations.Chunk.discussion.set(id, [ 'resolved' ], false));
	});
	await NotionOperations.executeOperations(operations, options);
};
