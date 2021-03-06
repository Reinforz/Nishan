import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { TCollectionBlock } from '@nishans/types';
import { commonBlockResolvers } from './utils';

export const collectionBlockResolver = {
	collection: async ({ collection_id }: TCollectionBlock, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('collection', collection_id, ctx),
	...commonBlockResolvers
};
