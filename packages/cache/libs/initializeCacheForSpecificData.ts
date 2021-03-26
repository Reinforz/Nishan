import { NotionEndpoints, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionLogger } from '@nishans/logger';
import {
	ICollection,
	IDiscussion,
	ISpace,
	ISpaceView,
	IUserRoot,
	TBlock,
	TCollectionBlock,
	TDataType,
	TView
} from '@nishans/types';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Initialize cache of specific type of data
 * @param id The id of the data
 * @param type The type of data
 */
export async function initializeCacheForSpecificData (id: string, type: TDataType, options: INotionCacheOptions) {
	let should_initialize_cache = true;
	const { cache } = options;
	const container: UpdateCacheManuallyParam = [],
		extra_container: UpdateCacheManuallyParam = [];
	if (type === 'block') {
		const data = (await NotionCache.fetchDataOrReturnCached('block', id, options)) as TBlock;
		if (data.type.match(/^(page|collection_view_page|collection_view)$/)) {
			let has_more_chunk = true,
				next_index = 0;
			while (has_more_chunk) {
				const { recordMap, cursor } = await NotionEndpoints.Queries.loadPageChunk(
					{
						pageId: id,
						limit: 100,
						cursor: {
							stack: [
								[
									{
										table: 'block',
										id: id,
										index: next_index
									}
								]
							]
						},
						chunkNumber: 1,
						verticalColumns: false
					},
					options
				);
				NotionCache.saveToCache(recordMap, cache);
				has_more_chunk = cursor.stack.length !== 0;
				if (has_more_chunk) next_index = cursor.stack[0][0].index;
			}
		}

		NotionCache.extractNotionUserIds(data).forEach((notion_user_id) =>
			container.push([ notion_user_id, 'notion_user' ])
		);
		NotionCache.extractSpaceAndParentId(data).forEach((sync_record_value) => container.push(sync_record_value));
	} else if (type === 'space') {
		// If the type is space, fetch its pages and notion_user
		const data = (await NotionCache.fetchDataOrReturnCached('space', id, options)) as ISpace;
		data.pages.forEach((id) => container.push([ id, 'block' ]));
		NotionCache.extractNotionUserIds(data).forEach((notion_user_id) =>
			container.push([ notion_user_id, 'notion_user' ])
		);
	} else if (type === 'discussion') {
		const data = (await NotionCache.fetchDataOrReturnCached('discussion', id, options)) as IDiscussion;
		data.comments.forEach((id) => container.push([ id, 'comment' ]));
		container.push([ data.parent_id, 'block' ]);
	} else if (type === 'user_root') {
		// If the type is user_root, fetch its space_view
		const data = (await NotionCache.fetchDataOrReturnCached('user_root', id, options)) as IUserRoot;
		data.space_views.map((space_view) => container.push([ space_view, 'space_view' ]));
	} else if (type === 'collection') {
		// If the type is collection, fetch its template_pages and all of its row_pages
		const data = (await NotionCache.fetchDataOrReturnCached('collection', id, options)) as ICollection;
		if (data.template_pages) data.template_pages.forEach((id) => container.push([ id, 'block' ]));
		// Fetching the row_pages of collection
		const { recordMap } = await NotionEndpoints.Queries.queryCollection(
			{
				collectionId: id,
				collectionViewId: '',
				query: {},
				loader: {
					type: 'table'
				}
			},
			options
		);
		NotionCache.saveToCache(recordMap, cache);
		container.push([ data.parent_id, 'block' ]);
	} else if (type === 'collection_view') {
		const data = cache[type].get(id) as TView;
		container.push([ data.parent_id, 'block' ]);
	} else if (type === 'space_view') {
		const data = (await NotionCache.fetchDataOrReturnCached('space_view', id, options)) as ISpaceView;
		if (data.bookmarked_pages) data.bookmarked_pages.forEach((id) => container.push([ id, 'block' ]));
		container.push([ data.space_id, 'space' ]);
		container.push([ data.parent_id, 'user_root' ]);
	} else {
		should_initialize_cache = false;
		NotionLogger.method.warn(`Unknown datatype ${type} passed`);
	}

	if (should_initialize_cache) {
		// Filters data that doesn't exist in the cache
		await NotionCache.updateCacheIfNotPresent(container, options);

		if (type === 'collection_view') {
			const data = cache[type].get(id) as TView,
				parent = cache.block.get(data.parent_id) as TCollectionBlock;
			extra_container.push([ parent.collection_id, 'collection' ]);
		}
		await NotionCache.updateCacheIfNotPresent(extra_container, options);
		options.cache_init_tracker[type].set(id, true);
	}
}
