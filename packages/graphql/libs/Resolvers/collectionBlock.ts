import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { TCollectionBlock } from '@nishans/types';
import { NotionGraphqlCommonBlockResolvers } from './utils';

export const NotionGraphqlCollectionBlockResolver = {
	collection: async ({ collection_id }: TCollectionBlock, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('collection', collection_id, ctx),
	...NotionGraphqlCommonBlockResolvers
};
