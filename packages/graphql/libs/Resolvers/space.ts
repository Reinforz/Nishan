import { NotionCache } from '@nishans/cache';
import { INotionCoreOptions } from '@nishans/core';
import { ISpace } from '@nishans/types';
import { NotionGraphqlNotionUserResolvers } from './utils';

export const NotionGraphqlSpaceResolver = {
	pages: async (space: ISpace, _: any, ctx: INotionCoreOptions) => {
		if (!ctx.cache_init_tracker.space.get(space.id)) {
			await NotionCache.initializeCacheForSpecificData(space.id, 'space', ctx);
			ctx.cache_init_tracker.space.set(space.id, true);
		}
		return space.pages.map((id) => ctx.cache.block.get(id));
	},
	...NotionGraphqlNotionUserResolvers
};
