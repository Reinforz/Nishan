import { NotionCacheObject } from '@nishans/cache';
import { TCollectionBlock } from '@nishans/types';
import { commonBlockResolvers } from './utils';

export const collectionBlockResolver = {
	collection: async ({ collection_id }: TCollectionBlock, _: any, ctx: any) =>
		await NotionCacheObject.fetchDataOrReturnCached('collection', collection_id, ctx, ctx.cache),
	...commonBlockResolvers
};
