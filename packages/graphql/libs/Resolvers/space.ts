import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { ISpace } from '@nishans/types';
import { NotionGraphqlNotionUserResolvers } from './utils';

let initialized_cache = false;

export const NotionGraphqlSpaceResolver = {
	pages: async (space: ISpace, _: any, ctx: INotionCacheOptions) => {
		if (!initialized_cache) {
			await NotionCache.initializeCacheForSpecificData(space.id, 'space', ctx);
			initialized_cache = true;
		}
		return space.pages.map((id) => ctx.cache.block.get(id));
	},
	...NotionGraphqlNotionUserResolvers
};
