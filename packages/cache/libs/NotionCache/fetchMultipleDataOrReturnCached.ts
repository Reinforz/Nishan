import { NotionQueries, NotionRequestConfigs, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionUtils } from '@nishans/utils';
import { ICache, NotionCache } from '..';

/**
   * Fetch multiple from notion's db if it doesn't exist in the cache
   * @param table The table of the data
   * @param id the id of the data
   * @param configs Notion request configs
   * @param cache Internal notion cache
   */
export async function fetchMultipleDataOrReturnCached (
	params: UpdateCacheManuallyParam,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	const result = NotionUtils.createDefaultRecordMap();
	const sync_record_values: UpdateCacheManuallyParam = [];
	for (let index = 0; index < params.length; index++) {
		const [ id, table ] = params[index];
		const data = cache[table].get(id);
		if (data) result[table].push(data as any);
		else sync_record_values.push([ id, table ]);
	}

	if (sync_record_values.length) {
		// Fetch the data from notion's db
		const { recordMap } = await NotionQueries.syncRecordValues(
			{
				requests: NotionCache.constructSyncRecordsParams(sync_record_values)
			},
			configs
		);

		NotionCache.saveToCache(recordMap, cache, (data_type, _, data) => {
			result[data_type].push(data as any);
		});
	}

	return result;
}
