import { NotionCache } from '@nishans/cache';
import { INotionCoreOptions } from '@nishans/core';
import { ICollection, TCollectionBlock } from '@nishans/types';
import { NotionGraphqlCommonBlockResolvers } from './utils';

export const NotionGraphqlCollectionBlockResolver = {
	collection: async ({ collection_id, id }: TCollectionBlock, _: any, ctx: INotionCoreOptions) => {
		if (!ctx.cache_init_tracker.block.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'block', ctx);
			ctx.cache_init_tracker.block.set(id, true);
		}
		return ctx.cache.collection.get(collection_id) as ICollection;
	},
	...NotionGraphqlCommonBlockResolvers
};
