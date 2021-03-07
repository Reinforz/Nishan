import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage, TCollectionBlock } from '@nishans/types';
import { NotionGraphqlCommonBlockResolvers } from './utils';

let initialized_cache = false;

export const NotionGraphqlCollectionBlockResolver = {
	collection: async ({ collection_id }: TCollectionBlock, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('collection', collection_id, ctx),
	...NotionGraphqlCommonBlockResolvers,
	rows: async ({ collection_id }: TCollectionBlock, _: any, ctx: INotionCacheOptions) => {
		if (!initialized_cache) {
			await NotionCache.initializeCacheForSpecificData(collection_id, 'collection', ctx);
			initialized_cache = true;
		}
		const pages: IPage[] = [];
		for (const [ , page ] of ctx.cache.block)
			if (
				page.type === 'page' &&
				page.parent_table === 'collection' &&
				page.parent_id === collection_id &&
				!page.is_template
			)
				pages.push(page);
		return pages;
	}
};
