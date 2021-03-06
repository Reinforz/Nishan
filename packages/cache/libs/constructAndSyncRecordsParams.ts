import { NotionEndpoints, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCache, NotionCacheConfigs } from './';

/**
 * Constructs and executes syncRecordValue params
 * @param args Array of [id, TDataType] tuples
 * @param configs The notion request configs
 * @param cache The cache to store result
 */
export async function constructAndSyncRecordsParams (args: UpdateCacheManuallyParam, configs: NotionCacheConfigs) {
	const sync_record_values = NotionCache.constructSyncRecordsParams(args);
	// fetch and save notion data to cache
	if (sync_record_values.length) {
		const { recordMap } = await NotionEndpoints.Queries.syncRecordValues({ requests: sync_record_values }, configs);
		NotionCache.saveToCache(recordMap, configs.cache);
	}
}
