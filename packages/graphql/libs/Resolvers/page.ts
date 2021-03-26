import { NotionCache } from '@nishans/cache';
import { INotionCoreOptions } from '@nishans/core';
import { IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { NotionGraphqlCommonBlockResolvers } from './utils';

export const NotionGraphqlPageResolver = {
	contents: async (page: IPage, _: any, ctx: INotionCoreOptions) => {
		if (!ctx.cache_init_tracker.block.get(page.id)) {
			await NotionCache.initializeCacheForSpecificData(page.id, 'block', ctx);
			ctx.cache_init_tracker.block.set(page.id, true);
		}
		return page.content.map((content_id) => ctx.cache.block.get(content_id)).filter((block) => block);
	},
	properties: (page: IPage) => ({
		title: NotionUtils.extractInlineBlockContent(page.properties.title)
	}),
	...NotionGraphqlCommonBlockResolvers
};
