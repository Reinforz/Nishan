import { NotionCache } from '@nishans/cache';
import { INotionCoreOptions } from '@nishans/core';
import { ICollection, IPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

export const NotionGraphqlCollectionResolver = {
	name: (parent: ICollection) => NotionUtils.extractInlineBlockContent(parent.name),
	parent: async ({ parent_id }: ICollection, _: any, ctx: INotionCoreOptions) =>
		await NotionCache.fetchDataOrReturnCached('block', parent_id, ctx),
	templates: async ({ id, template_pages }: ICollection, _: any, ctx: INotionCoreOptions) => {
		if (!ctx.cache_init_tracker.collection.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'collection', ctx);
			ctx.cache_init_tracker.collection.set(id, true);
		}
		return template_pages ? template_pages.map((template_page) => ctx.cache.block.get(template_page)) : [];
	},
	rows: async ({ id }: ICollection, _: any, ctx: INotionCoreOptions) => {
		if (!ctx.cache_init_tracker.collection.get(id)) {
			await NotionCache.initializeCacheForSpecificData(id, 'collection', ctx);
			ctx.cache_init_tracker.collection.set(id, true);
		}
		const pages: IPage[] = [];
		for (const [ , page ] of ctx.cache.block)
			if (page.type === 'page' && page.parent_table === 'collection' && page.parent_id === id && !page.is_template)
				pages.push(page);
		return pages;
	}
};
