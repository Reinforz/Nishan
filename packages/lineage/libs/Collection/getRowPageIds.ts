import { INotionCacheOptions, NotionCache } from '@nishans/cache';

export async function getRowPageIds (id: string, props: INotionCacheOptions) {
	await NotionCache.initializeCacheForSpecificData(id, 'collection', props);
	const page_ids: string[] = [];
	for (const [ , page ] of props.cache.block)
		if (
			page &&
			page.type === 'page' &&
			page.parent_table === 'collection' &&
			page.parent_id === id &&
			!page.is_template
		)
			page_ids.push(page.id);
	return page_ids;
}
