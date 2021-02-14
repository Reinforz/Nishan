import { NotionRequestConfigs, Queries, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { SyncRecordValues } from '@nishans/types';
import { ICache, saveToCache } from '../src';

export async function constructSyncRecordsParams (
	args: UpdateCacheManuallyParam,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	const sync_record_values: SyncRecordValues[] = [];
	// Iterate through the passed array argument and construct sync_record argument
	args.forEach((arg) => {
		sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
	});

	// fetch and save notion data to cache
	if (sync_record_values.length) {
		const { recordMap } = await Queries.syncRecordValues({ requests: sync_record_values }, configs);
		saveToCache(recordMap, cache);
	}
}
