import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage } from '@nishans/types';

export const notionUserResolvers = {
	last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('notion_user', last_edited_by_id, ctx),
	created_by: async ({ created_by_id }: IPage, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('notion_user', created_by_id, ctx)
};
