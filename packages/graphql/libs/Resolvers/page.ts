import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { NotionGraphqlCommonBlockResolvers } from './utils';

let initialized_cache = false;

export const NotionGraphqlPageResolver = {
	contents: async (page: IPage, _: any, ctx: INotionCacheOptions) => {
		if (!initialized_cache) {
			await NotionCache.initializeCacheForSpecificData(page.id, 'block', ctx);
			initialized_cache = true;
		}
		const data = page.content.map((content_id) => ctx.cache.block.get(content_id)).filter((block) => block);
		return data;
	},
	properties: (page: IPage) => ({
		title: NotionUtils.extractInlineBlockContent(page.properties.title)
	}),
	...NotionGraphqlCommonBlockResolvers
};
