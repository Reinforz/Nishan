import { NotionEndpoints, SyncRecordValuesTuple } from '@nishans/endpoints';
import { INotionCacheOptions, NotionCache } from './';

/**
 * Constructs and executes syncRecordValue params
 * @param args Array of [id, TDataType] tuples
 * @param options The notion request options
 * @param cache The cache to store result
 */
export async function constructAndSyncRecordsParams(
  args: SyncRecordValuesTuple,
  options: Omit<INotionCacheOptions, 'cache_init_tracker'>
) {
  const sync_record_values = NotionCache.constructSyncRecordsParams(args);
  // fetch and save notion data to cache
  if (sync_record_values.length) {
    const {
      recordMapWithRoles
    } = await NotionEndpoints.Queries.getRecordValues(
      { requests: sync_record_values },
      options
    );
    let space_id = '';
    if (recordMapWithRoles['space'])
      space_id = Object.keys(recordMapWithRoles['space'])[0];

    NotionCache.saveToCache(
      recordMapWithRoles,
      options.cache,
      undefined,
      space_id
    );
  }
}
