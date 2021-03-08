import { NotionCache } from '@nishans/cache';
import { ICollection, TCollectionBlock } from '@nishans/types';
import { INotionGraphqlOptions } from '..';
import { NotionGraphqlCommonBlockResolvers } from './utils';

export const NotionGraphqlCollectionBlockResolver = {
	collection: async ({ collection_id, id }: TCollectionBlock, _: any, ctx: INotionGraphqlOptions) => {
		if (!ctx.cache_initializer_tracker.block.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'block', ctx);
			ctx.cache_initializer_tracker.block.set(id, true);
		}
		return ctx.cache.collection.get(collection_id) as ICollection;
	},
	...NotionGraphqlCommonBlockResolvers
};
