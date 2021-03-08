import { NotionCache } from '@nishans/cache';
import { ICollection, IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { INotionGraphqlOptions } from '..';

export const NotionGraphqlCollectionResolver = {
	name: (parent: ICollection) => NotionUtils.extractInlineBlockContent(parent.name),
	parent: async ({ parent_id }: ICollection, _: any, ctx: INotionGraphqlOptions) =>
		await NotionCache.fetchDataOrReturnCached('block', parent_id, ctx),
	templates: async ({ id, template_pages }: ICollection, _: any, ctx: INotionGraphqlOptions) => {
		if (!ctx.cache_initializer_tracker.block.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'collection', ctx);
			ctx.cache_initializer_tracker.block.set(id, true);
		}
		return template_pages ? template_pages.map((template_page) => ctx.cache.block.get(template_page)) : [];
	},
	rows: async ({ id }: ICollection, _: any, ctx: INotionGraphqlOptions) => {
		if (!ctx.cache_initializer_tracker.block.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'collection', ctx);
			ctx.cache_initializer_tracker.block.set(id, true);
		}
		const pages: IPage[] = [];
		for (const [ , page ] of ctx.cache.block)
			if (page.type === 'page' && page.parent_table === 'collection' && page.parent_id === id && !page.is_template)
				pages.push(page);
		return pages;
	}
};
