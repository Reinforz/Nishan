import { NotionQueries, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { error } from '@nishans/errors';
import { ICollection, ISpace, ISpaceView, IUserRoot, TBlock, TCollectionBlock, TDataType, TView } from '@nishans/types';
import { NotionCache } from '..';
import { NotionCacheConfigs } from '../types';

/**
 * Initialize cache of specific type of data
 * @param id The id of the data
 * @param type The type of data
 */
export async function initializeCacheForSpecificData (id: string, type: TDataType, configs: NotionCacheConfigs) {
	const { cache } = configs;
	const container: UpdateCacheManuallyParam = [],
		extra_container: UpdateCacheManuallyParam = [];
	if (type === 'block') {
		const data = cache[type].get(id) as TBlock;
		// If the type is block and page, fetch its content
		if (data.type === 'page') data.content.forEach((id) => container.push([ id, 'block' ]));
		// If the type is block and cvp or cv, fetch its views and collection
		if (data.type === 'collection_view' || data.type === 'collection_view_page') {
			data.view_ids.map((view_id) => container.push([ view_id, 'collection_view' ]));
			container.push([ data.collection_id, 'collection' ]);
		}
		NotionCache.extractNotionUserIds(data).forEach((notion_user_id) =>
			container.push([ notion_user_id, 'notion_user' ])
		);
		NotionCache.extractSpaceAndParentId(data).forEach((sync_record_value) => container.push(sync_record_value));
	} else if (type === 'space') {
		// If the type is space, fetch its pages and notion_user
		const data = cache[type].get(id) as ISpace;
		data.pages.forEach((id) => container.push([ id, 'block' ]));
		NotionCache.extractNotionUserIds(data).forEach((notion_user_id) =>
			container.push([ notion_user_id, 'notion_user' ])
		);
	} else if (type === 'user_root') {
		// If the type is user_root, fetch its space_view
		const data = cache[type].get(id) as IUserRoot;
		data.space_views.map((space_view) => container.push([ space_view, 'space_view' ]));
	} else if (type === 'collection') {
		// If the type is collection, fetch its template_pages and all of its row_pages
		const data = cache[type].get(id) as ICollection;
		if (data.template_pages) data.template_pages.forEach((id) => container.push([ id, 'block' ]));
		// Fetching the row_pages of collection
		const { recordMap } = await NotionQueries.queryCollection(
			{
				collectionId: id,
				collectionViewId: '',
				query: {},
				loader: {
					type: 'table',
					loadContentCover: true
				}
			},
			configs
		);
		NotionCache.saveToCache(recordMap, cache);
		container.push([ data.parent_id, 'block' ]);
	} else if (type === 'collection_view') {
		const data = cache[type].get(id) as TView;
		container.push([ data.parent_id, 'block' ]);
	} else if (type === 'space_view') {
		// If the type is space_view, fetch its bookmarked_pages
		const data = cache[type].get(id) as ISpaceView;
		if (data.bookmarked_pages) data.bookmarked_pages.forEach((id) => container.push([ id, 'block' ]));
		container.push([ data.space_id, 'space' ]);
		container.push([ data.parent_id, 'user_root' ]);
	} else error(`${type} data is not supported`);

	// Filters data that doesn't exist in the cache
	await NotionCache.updateCacheIfNotPresent(container, configs);

	// If the block is a page, for all the collection block **contents**, fetch the collection attached with it as well
	if (type === 'block') {
		const data = cache[type].get(id) as TBlock;
		if (data.type === 'page') {
			for (let index = 0; index < data.content.length; index++) {
				const content_id = data.content[index],
					content = cache.block.get(content_id);
				// Only if the content is of type cvp or cv, fetch its collection and views
				if (content && (content.type === 'collection_view_page' || content.type === 'collection_view')) {
					extra_container.push([ content.collection_id, 'collection' ]);
					content.view_ids.map((view_id) => extra_container.push([ view_id, 'collection_view' ]));
				}
			}
		}
	} else if (type === 'collection_view') {
		const data = cache[type].get(id) as TView,
			parent = cache.block.get(data.parent_id) as TCollectionBlock;
		extra_container.push([ parent.collection_id, 'collection' ]);
	}

	await NotionCache.updateCacheIfNotPresent(extra_container, configs);
}
