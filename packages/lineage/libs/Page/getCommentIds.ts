import { INotionCache, IPage } from '@nishans/types';
import { NotionLineage } from '../';

export const getCommentIds = (page: IPage, cache: INotionCache) => {
	const comment_ids: string[] = [];

	page.content.forEach((block_id) => {
		const block_data = cache.block.get(block_id);
		if (block_data) comment_ids.push(...NotionLineage.Block.getCommentIds(block_data, cache));
	});

	return comment_ids;
};
