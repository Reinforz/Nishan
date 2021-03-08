import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { TBlock } from '@nishans/types';
import { NotionGraphqlNotionUserResolvers } from './notionUserResolvers';

export const NotionGraphqlCommonBlockResolvers = {
	parent: async ({ parent_id, parent_table }: TBlock, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached(parent_table, parent_id, ctx),
	space: async ({ space_id }: TBlock, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('space', space_id, ctx),
	...NotionGraphqlNotionUserResolvers
};
