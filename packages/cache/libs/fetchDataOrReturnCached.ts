import { TData, TDataType } from '@nishans/types';
import { INotionCacheOptions, NotionCache } from './';

/**
   * Fetch data from notion's db if it doesn't exist in the cache
   * @param table The table of the data
   * @param id the id of the data
   * @param options Notion cache options
   */
export async function fetchDataOrReturnCached (
	table: TDataType,
	id: string,
	options: INotionCacheOptions
): Promise<TData> {
	return (await NotionCache.fetchMultipleDataOrReturnCached([ [ id, table ] ], options))[table][0] as any;
}
