import { NotionEndpoints } from '@nishans/endpoints';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Initialize the cache by sending a post request to the `getSpaces` endpoint 
 */
export async function initializeNotionCache (options: Omit<INotionCacheOptions, 'cache_init_tracker'>) {
	const data = await NotionEndpoints.Queries.getSpaces(options);
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
		NotionCache.saveToCache(recordMap, options.cache);
	});

	// If the number of external_notion_users in not zero continue
	if (external_notion_users.size !== 0) {
		// Send a api request to syncRecordValues endpoint to fetch the external notion users
		await NotionCache.constructAndSyncRecordsParams(
			Array.from(external_notion_users.values()).map((id) => [ id, 'notion_user' ]),
			options
		);
	}
}
