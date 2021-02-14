import { NotionRequestConfigs, Queries, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { TDataType, TBlock, ISpace, IUserRoot, ICollection, ISpaceView } from '@nishans/types';
import { saveToCache, ICache, returnNonCachedData, updateCacheManually } from '../src';

/**
 * Initialize the cache by sending a post request to the `getSpaces` endpoint 
 */
export async function initializeNotionCache (configs: NotionRequestConfigs, cache: ICache) {
	const data = await Queries.getSpaces(configs);
	// Contains a set of external notion user that has access to the space
	const external_notion_users: Set<string> = new Set();

	// Going through each recordMap and storing them in cache
	Object.values(data).forEach((recordMap) => {
		// Getting the user_root id
		const user_root_id = Object.keys(recordMap.user_root)[0];
		// In the space's permission check if external user has any access to the space,
		// if it does and its not the user_root it needs to be added to the set created earlier
		Object.values(recordMap.space).forEach((space) =>
			space.value.permissions.forEach(
				(permission) =>
					permission.user_id && permission.user_id !== user_root_id && external_notion_users.add(permission.user_id)
			)
		);
		saveToCache(recordMap, cache);
	});

	// If the number of external_notion_users in not zero continue
	if (external_notion_users.size !== 0) {
		// Send a api request to syncRecordValues endpoint to fetch the external notion users
		const { recordMap } = await Queries.syncRecordValues(
			{
				requests: Array.from(external_notion_users.values()).map((external_notion_user) => ({
					table: 'notion_user',
					id: external_notion_user,
					version: -1
				}))
			},
			configs
		);
		// Save the fetched external notion user to cache
		saveToCache(recordMap, cache);
	}
}

/**
 * Initialize cache of specific type of data
 * @param id The id of the data
 * @param type The type of data
 */
export async function initializeCacheForSpecificData (
	id: string,
	type: TDataType,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	const container: UpdateCacheManuallyParam = [];
	if (type === 'block') {
		const data = cache[type].get(id) as TBlock;
		// If the type is block and page, fetch its content
		if (data.type === 'page') data.content.forEach((id) => container.push([ id, 'block' ]));
		// If the type is block and cvp or cv, fetch its views and collection
		if (data.type === 'collection_view' || data.type === 'collection_view_page') {
			data.view_ids.map((view_id) => container.push([ view_id, 'collection_view' ]));
			container.push([ data.collection_id, 'collection' ]);
		}
	} else if (type === 'space') {
		// If the type is space, fetch its pages and notion_user
		const data = cache[type].get(id) as ISpace;
		data.pages.forEach((id) => container.push([ id, 'block' ]));
		data.permissions.forEach((permission) => container.push([ permission.user_id, 'notion_user' ]));
	} else if (type === 'user_root') {
		// If the type is user_root, fetch its space_view
		const data = cache[type].get(id) as IUserRoot;
		data.space_views.map((space_view) => container.push([ space_view, 'space_view' ]));
	} else if (type === 'collection') {
		// If the type is collection, fetch its template_pages and all of its row_pages
		const data = cache[type].get(id) as ICollection;
		if (data.template_pages) data.template_pages.forEach((id) => container.push([ id, 'block' ]));
		// Fetching the row_pages of collection
		const { recordMap } = await Queries.queryCollection(
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
		saveToCache(recordMap, cache);
	} else if (type === 'space_view') {
		// If the type is space_view, fetch its bookmarked_pages
		const data = cache[type].get(id) as ISpaceView;
		if (data.bookmarked_pages) data.bookmarked_pages.forEach((id) => container.push([ id, 'block' ]));
	} else throw new Error(`${type} data is not supported`);

	// Filters data that doesnt exist in the cache
	const non_cached = returnNonCachedData(container, cache);

	await updateCacheManually(non_cached, configs, cache);

	// If the block is a page, for all the collection block contents, fetch the collection attached with it as well
	if (type === 'block') {
		const data = cache[type].get(id) as TBlock;
		if (data.type === 'page') {
			const collection_blocks_ids: UpdateCacheManuallyParam = [];
			for (let index = 0; index < data.content.length; index++) {
				const content_id = data.content[index],
					content = cache.block.get(content_id);
				if (content && (content.type === 'collection_view_page' || content.type === 'collection_view'))
					collection_blocks_ids.push([ content.collection_id, 'collection' ]);
			}
			await updateCacheManually(returnNonCachedData(collection_blocks_ids, cache), configs, cache);
		}
	}
}
