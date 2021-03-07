import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { NotionGraphqlCommonBlockResolvers } from './utils';

export const NotionGraphqlPageResolver = {
	contents: async (parent: IPage, _: any, ctx: INotionCacheOptions) =>
		(await NotionCache.fetchMultipleDataOrReturnCached(parent.content.map((id) => [ id, 'block' ]), ctx)).block,
	properties: (parent: IPage) => ({
		title: NotionUtils.extractInlineBlockContent(parent.properties.title)
	}),
	...NotionGraphqlCommonBlockResolvers
};
