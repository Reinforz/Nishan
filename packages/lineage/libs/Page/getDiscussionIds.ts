import { ICache, IPage } from '@nishans/types';

export const getDiscussionIds = (page: IPage, cache: ICache) => {
	const discussion_ids: string[] = [...(page.discussions ?? [])];

	page.content.forEach((block_id) => {
		const block_data = cache.block.get(block_id);
		if ((block_data as any)?.discussions) discussion_ids.push(...(block_data as any).discussions);
	});

	return discussion_ids;
};
