import { NotionCache } from '@nishans/cache';
import { ISpace } from '@nishans/types';
import { INotionGraphqlOptions } from '..';
import { NotionGraphqlNotionUserResolvers } from './utils';

export const NotionGraphqlSpaceResolver = {
	pages: async (space: ISpace, _: any, ctx: INotionGraphqlOptions) => {
		if (!ctx.cache_initializer_tracker.space.get(space.id)) {
			await NotionCache.initializeCacheForSpecificData(space.id, 'space', ctx);
			ctx.cache_initializer_tracker.space.set(space.id, true);
		}
		return space.pages.map((id) => ctx.cache.block.get(id));
	},
	...NotionGraphqlNotionUserResolvers
};
