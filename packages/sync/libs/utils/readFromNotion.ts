import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { ICollection, ICollectionViewPage, IPage, TView } from '@nishans/types';
import { extractData } from './extractData';

export async function readFromNotion (database_id: string, options: INotionCacheOptions) {
	await NotionCache.initializeCacheForSpecificData(database_id, 'block', options);
	const collection_block = options.cache.block.get(database_id) as ICollectionViewPage;

	await NotionCache.initializeCacheForSpecificData(collection_block.collection_id, 'collection', options);
	const collection = options.cache.collection.get(collection_block.collection_id) as ICollection;

	const row_pages: IPage[] = [],
		template_pages: IPage[] = [],
		views: TView[] = [];
	for (const [ , block ] of options.cache.block) {
		if (
			block.type === 'page' &&
			block.parent_id === collection_block.collection_id &&
			block.parent_table === 'collection'
		) {
			if (block.is_template) template_pages.push(block);
			else row_pages.push(block);
		}
	}

	for (const [ , view ] of options.cache.collection_view) {
		views.push(view);
	}

	return extractData({
		collection,
		views,
		template_pages,
		row_pages
	});
}
