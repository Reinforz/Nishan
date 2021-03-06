import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCache, NotionCacheConfigs } from './';

/**
 * Fetches data from notions server and store within the cache
 * @param args The array of id and data_type tuple to fetch and store
 */
export async function updateCacheManually (args: UpdateCacheManuallyParam, configs: NotionCacheConfigs) {
	await NotionCache.constructAndSyncRecordsParams(args, configs);
}
