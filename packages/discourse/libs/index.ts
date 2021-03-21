import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IOperation, IText, TTextFormat } from '@nishans/types';

export const NotionDiscourse = {
	Discussions: {
		async start (
			block_id: string,
			comments: { text: TTextFormat; id?: string }[],
			options: INotionCacheOptions & INotionOperationOptions
		) {
			const comment_creation_operations: IOperation[] = [],
				comment_ids: string[] = [],
				discussion_id = NotionIdz.Generate.id();
			comments.forEach((comment) => {
				const comment_id = NotionIdz.Generate.id(comment.id);
				comment_ids.push(comment_id);
				comment_creation_operations.push(
					NotionOperations.Chunk.comment.update(comment_id, [], {
						parent_id: discussion_id,
						parent_table: 'discussion',
						text: comment.text,
						alive: true,
						id: comment_id,
						version: 1
					})
				);
			});
			const block_data = (await NotionCache.fetchDataOrReturnCached('block', block_id, options)) as IText;
			await NotionOperations.executeOperations(
				[
					...comment_creation_operations,
					NotionOperations.Chunk.discussion.update(discussion_id, [], {
						id: discussion_id,
						parent_id: block_id,
						parent_table: 'block',
						resolved: false,
						context: block_data.properties.title,
						comments: comment_ids,
						version: 1
					}),
					NotionOperations.Chunk.discussion.listAfter(block_id, [ 'discussions' ], {
						id: discussion_id
					})
				],
				options
			);
		}
	}
};
