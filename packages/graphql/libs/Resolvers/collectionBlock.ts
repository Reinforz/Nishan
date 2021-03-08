import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { ICollection, TCollectionBlock } from '@nishans/types';
import { NotionGraphqlCommonBlockResolvers } from './utils';

let initialized_cache = false;

export const NotionGraphqlCollectionBlockResolver = {
	collection: async ({ collection_id, id }: TCollectionBlock, _: any, ctx: INotionCacheOptions) => {
		if (!initialized_cache) {
			await NotionCache.initializeCacheForSpecificData(id, 'block', ctx);
			initialized_cache = true;
		}
		return ctx.cache.collection.get(collection_id) as ICollection;
	},
	...NotionGraphqlCommonBlockResolvers
};
