import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Fetches notion data only if it doesn't exist in the cache
 * @param arg Array of id and data_type tuple to fetch from notion and store
 */
export async function updateCacheIfNotPresent (
	args: UpdateCacheManuallyParam,
	options: Omit<INotionCacheOptions, 'cache_init_tracker'>
) {
	await NotionCache.constructAndSyncRecordsParams(args.filter((arg) => !options.cache[arg[1]].get(arg[0])), options);
}
