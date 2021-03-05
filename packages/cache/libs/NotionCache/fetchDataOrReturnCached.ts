import { TData, TDataType } from '@nishans/types';
import { NotionCache } from '..';
import { NotionCacheConfigs } from '../types';

/**
   * Fetch data from notion's db if it doesn't exist in the cache
   * @param table The table of the data
   * @param id the id of the data
   * @param configs Notion cache configs
   */
export async function fetchDataOrReturnCached<D extends TData> (
	table: TDataType,
	id: string,
	configs: NotionCacheConfigs
) {
	return (await NotionCache.fetchMultipleDataOrReturnCached([ [ id, table ] ], configs))[table][0] as D;
}
