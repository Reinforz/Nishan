import { INotionCacheOptions, NotionCache } from '@nishans/cache';

export const NotionGraphqlQueryResolvers = {
	space: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('space', args.id, ctx),
	page: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('block', args.id, ctx),
	block: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('block', args.id, ctx)
};
