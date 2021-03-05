import { ICache, NotionCache } from '@nishans/cache';
import { NotionOperationOptions } from '@nishans/operations';
import { IPage } from '@nishans/types';

export const notionUserResolvers = {
	last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: NotionOperationOptions & { cache: ICache }) =>
		await NotionCache.fetchDataOrReturnCached('notion_user', last_edited_by_id, ctx, ctx.cache),
	created_by: async ({ created_by_id }: IPage, _: any, ctx: NotionOperationOptions & { cache: ICache }) =>
		await NotionCache.fetchDataOrReturnCached('notion_user', created_by_id, ctx, ctx.cache)
};
