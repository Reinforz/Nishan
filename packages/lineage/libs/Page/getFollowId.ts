import { INotionCache } from '@nishans/types';

export const getFollowId = (id: string, cache: INotionCache) => {
	for (const [ , follow ] of cache.follow) {
		if (follow.navigable_block_id === id) return follow.id;
	}
};
