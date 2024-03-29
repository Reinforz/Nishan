import { INotionCacheOptions } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IDiscussion, IOperation, IText } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IDiscussionCreateInput } from '../types';

export const createDiscussions = (
  block_id: string,
  args: IDiscussionCreateInput[],
  options: Omit<INotionCacheOptions, 'cache_init_tracker'> &
    INotionOperationOptions
) => {
  const operations: IOperation[] = [],
    discussions: IDiscussion[] = [];

  const block_data = options.cache.block.get(block_id) as IText;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index],
      { comments } = arg;
    const comment_ids: string[] = [],
      discussion_id = NotionIdz.Generate.id(arg.id);
    comments.forEach((comment) => {
      const comment_id = NotionIdz.Generate.id(comment.id);
      comment_ids.push(comment_id);
      const comment_data = NotionInit.comment({
        created_by_id: options.user_id,
        id: comment_id,
        parent_id: discussion_id,
        space_id: options.space_id,
        text: comment.text
      });
      operations.push(
        NotionOperations.Chunk.comment.update(
          comment_id,
          options.space_id,
          [],
          JSON.parse(JSON.stringify(comment_data, null, 2))
        )
      );
      options.cache.comment.set(comment_id, comment_data);
    });

    const discussion_data = NotionInit.discussion({
      id: discussion_id,
      parent_id: block_id,
      resolved: false,
      context: [[(arg.context ?? block_data.properties.title)[0][0]]],
      comments: comment_ids,
      space_id: options.space_id
    });
    discussions.push(discussion_data);
    options.cache.discussion.set(discussion_id, discussion_data);
    NotionUtils.populateChildPath({
      data: block_data,
      child_path: 'discussions',
      child_id: discussion_id
    });
    operations.push(
      NotionOperations.Chunk.discussion.update(
        discussion_id,
        options.space_id,
        [],
        JSON.parse(JSON.stringify(discussion_data, null, 2))
      ),
      NotionOperations.Chunk.block.listAfter(
        block_id,
        options.space_id,
        ['discussions'],
        {
          id: discussion_id
        }
      )
    );
  }

  return { discussions, operations };
};
