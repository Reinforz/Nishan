import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { ISpace } from '@nishans/types';
import { NotionGraphqlNotionUserResolvers } from './utils';

export const NotionGraphqlSpaceResolver = {
	pages: async (parent: ISpace, _: any, ctx: INotionCacheOptions) =>
		(await NotionCache.fetchMultipleDataOrReturnCached(parent.pages.map((id) => [ id, 'block' ]), ctx)).block,
	...NotionGraphqlNotionUserResolvers
};
