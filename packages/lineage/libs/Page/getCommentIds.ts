import { ICache } from '@nishans/cache';
import { IPage, IText } from '@nishans/types';

export const getCommentIds = (page: IPage, cache: ICache) => {
	const comment_ids: string[] = [];

	page.content.forEach((block_id) => {
		const block_data = cache.block.get(block_id);
		(block_data as IText)?.discussions?.forEach(discussion_id=>{
      const discussion_data = cache.discussion.get(discussion_id);
      if(discussion_data)
        comment_ids.push(...discussion_data.comments);
    }) 
	});

	return comment_ids;
};
