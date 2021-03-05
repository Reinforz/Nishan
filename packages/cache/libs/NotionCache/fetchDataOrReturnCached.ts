import { NotionRequestConfigs } from '@nishans/endpoints';
import { TData, TDataType } from '@nishans/types';
import { ICache, NotionCache } from '..';

/**
   * Fetch data from notion's db if it doesn't exist in the cache
   * @param table The table of the data
   * @param id the id of the data
   * @param configs Notion request configs
   * @param cache Internal notion cache
   */
export async function fetchDataOrReturnCached<D extends TData> (
	table: TDataType,
	id: string,
	configs: NotionRequestConfigs,
	cache: ICache
) {
	return (await NotionCache.fetchMultipleDataOrReturnCached([ [ id, table ] ], configs, cache))[table][0] as D;
}
