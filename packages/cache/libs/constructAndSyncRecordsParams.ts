import { NotionEndpoints, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Constructs and executes syncRecordValue params
 * @param args Array of [id, TDataType] tuples
 * @param options The notion request options
 * @param cache The cache to store result
 */
export async function constructAndSyncRecordsParams (args: UpdateCacheManuallyParam, options: INotionCacheOptions) {
	const sync_record_values = NotionCache.constructSyncRecordsParams(args);
	// fetch and save notion data to cache
	if (sync_record_values.length) {
		const { recordMap } = await NotionEndpoints.Queries.syncRecordValues({ requests: sync_record_values }, options);
		NotionCache.saveToCache(recordMap, options.cache);
	}
}
