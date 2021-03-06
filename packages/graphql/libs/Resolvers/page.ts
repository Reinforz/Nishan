import { IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { commonBlockResolvers } from './utils';

export const pageResolver = {
	// contents: (parent: IPage, _: any, ctx: INotionCacheOptions) =>
	// 	NotionCache.fetchMultipleDataOrReturnCached(parent.content.map((id) => [ id, 'block' ]), ctx),
	properties: (parent: IPage) => ({
		title: NotionUtils.extractInlineBlockContent(parent.properties.title)
	}),
	...commonBlockResolvers
};
