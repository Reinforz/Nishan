import { ICache } from '@nishans/cache';
import { Queries } from '@nishans/endpoints';
import { TData, TDataType } from '@nishans/types';
import { warn } from './';

export async function fetchAndCacheData<D extends TData> (table: TDataType, id: string, cache: ICache, token: string) {
	let data = cache[table].get(id);
	if (!data) {
		warn(`${table}:${id} doesnot exist in the cache`);
		const { recordMap } = await Queries.syncRecordValues(
			{
				requests: [
					{
						id,
						table,
						version: 0
					}
				]
			},
			{
				token,
				interval: 0
			}
		);
		data = recordMap[table][id].value;
	}
	return data as D;
}
