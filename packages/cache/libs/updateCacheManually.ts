import { SyncRecordValuesTuple } from '@nishans/endpoints';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Fetches data from notions server and store within the cache
 * @param args The array of id and data_type tuple to fetch and store
 */
export async function updateCacheManually(
  args: SyncRecordValuesTuple,
  options: Omit<INotionCacheOptions, 'cache_init_tracker'>
) {
  await NotionCache.constructAndSyncRecordsParams(args, options);
}
