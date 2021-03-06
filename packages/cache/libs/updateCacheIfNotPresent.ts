import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCache, NotionCacheConfigs } from './';

/**
 * Fetches notion data only if it doesn't exist in the cache
 * @param arg Array of id and data_type tuple to fetch from notion and store
 */
export async function updateCacheIfNotPresent (args: UpdateCacheManuallyParam, configs: NotionCacheConfigs) {
	await NotionCache.constructAndSyncRecordsParams(args.filter((arg) => !configs.cache[arg[1]].get(arg[0])), configs);
}
