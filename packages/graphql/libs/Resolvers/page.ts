import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { commonBlockResolvers } from './utils';

export const pageResolver = {
	contents: async (parent: IPage, _: any, ctx: INotionCacheOptions) =>
		(await NotionCache.fetchMultipleDataOrReturnCached(parent.content.map((id) => [ id, 'block' ]), ctx)).block,
	properties: (parent: IPage) => ({
		title: NotionUtils.extractInlineBlockContent(parent.properties.title)
	}),
	...commonBlockResolvers
};
