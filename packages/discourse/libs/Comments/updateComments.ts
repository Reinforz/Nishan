import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation, TTextFormat } from '@nishans/types';

export const updateComments = async (
	args: { comment_id: string; text: TTextFormat }[],
	options: INotionCacheOptions & INotionOperationOptions
) => {
	await NotionCache.fetchMultipleDataOrReturnCached(args.map((arg) => [ arg.comment_id, 'comment' ]), options);
	const operations: IOperation[] = [];
	args.forEach((arg) => {
		const comment_data = options.cache.comment.get(arg.comment_id)!;
		comment_data.text = arg.text;
		operations.push(NotionOperations.Chunk.comment.set(arg.comment_id, [ 'text' ], arg.text));
	});

	await NotionOperations.executeOperations(operations, options);
};
