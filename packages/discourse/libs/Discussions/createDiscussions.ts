import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IDiscussion, IOperation, IText, TTextFormat } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

export const createDiscussions = async (
	args: { context?: TTextFormat, block_id: string; discussion_id?: string; comments: { text: TTextFormat; id?: string }[] }[],
	options: INotionCacheOptions & INotionOperationOptions
) => {
	const operations: IOperation[] = [],
		discussions: IDiscussion[] = [],
		{ block: blocks_data } = await NotionCache.fetchMultipleDataOrReturnCached(
			args.map((arg) => [ arg.block_id, 'block' ]),
			options
		);

	for (let index = 0; index < args.length; index++) {
		const arg = args[index],
			{ comments, block_id } = arg;
		const comment_ids: string[] = [],
			discussion_id = NotionIdz.Generate.id(arg.discussion_id);
		comments.forEach((comment) => {
			const comment_id = NotionIdz.Generate.id(comment.id);
			comment_ids.push(comment_id);
			const comment_data = NotionInit.comment({
        created_by_id: options.user_id,
        last_edited_by_id: options.user_id,
        id: comment_id,
        parent_id: discussion_id,
        shard_id: options.shard_id,
        space_id: options.space_id,
        text: comment.text
      });
			operations.push(
				NotionOperations.Chunk.comment.update(comment_id, [], JSON.parse(JSON.stringify(comment_data, null, 2)))
			);
			options.cache.comment.set(comment_id, comment_data);
		});
		const block_data = blocks_data[index] as IText;

		const discussion_data = NotionInit.discussion({
      id: discussion_id,
			parent_id: block_id,
			resolved: false,
			context: arg.context ?? block_data.properties.title,
			comments: comment_ids,
			space_id: options.space_id,
			shard_id: options.shard_id
    });
		discussions.push(discussion_data);
		options.cache.discussion.set(discussion_id, discussion_data);
		NotionUtils.populateChildPath({ data: block_data, child_path: 'discussions', child_id: discussion_id });
		operations.push(
			NotionOperations.Chunk.discussion.update(discussion_id, [], JSON.parse(JSON.stringify(discussion_data, null, 2))),
			NotionOperations.Chunk.block.listAfter(block_id, [ 'discussions' ], {
				id: discussion_id
			})
		);
	}

	await NotionOperations.executeOperations(operations, options);
	return discussions;
};
