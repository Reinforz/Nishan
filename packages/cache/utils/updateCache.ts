import { NotionRequestConfigs, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { constructSyncRecordsParams, ICache } from '../src';

/**
 * Fetches data from notions server and store within the cache
 * @param args The array of id and data_type tuple to fetch and store
 */
export async function updateCacheManually (
	args: UpdateCacheManuallyParam,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	await constructSyncRecordsParams(args, configs, cache);
}

/**
 * Fetches notion data only if it doesnt exist in the cache
 * @param arg Array of id and data_type tuple to fetch from notion and store
 */
export async function updateCacheIfNotPresent (
	args: UpdateCacheManuallyParam,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	await constructSyncRecordsParams(args.filter((arg) => !cache[arg[1]].get(arg[0])), configs, cache);
}
