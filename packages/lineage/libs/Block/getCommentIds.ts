import { INotionCache, IText, TBlock } from '@nishans/types';

export const getCommentIds = (block: TBlock, cache: INotionCache) => {
	const comment_ids: string[] = [];
  (block as IText).discussions?.forEach(discussion_id=>{
    const discussion_data = cache.discussion.get(discussion_id);
    if(discussion_data)
      comment_ids.push(...discussion_data.comments);
  }) 

	return comment_ids;
};
