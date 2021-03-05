import { NotionCacheObject } from '@nishans/cache';
import { TCollectionBlock } from '@nishans/types';
import { notionUserResolvers } from './notionUserResolvers';

export const commonBlockResolvers = {
	parent: async ({ parent_id, parent_table }: TCollectionBlock, _: any, ctx: any) =>
		await NotionCacheObject.fetchDataOrReturnCached(parent_table, parent_id, ctx, ctx.cache),
	space: async ({ space_id }: TCollectionBlock, _: any, ctx: any) =>
		await NotionCacheObject.fetchDataOrReturnCached('space', space_id, ctx, ctx.cache),
	...notionUserResolvers
};
