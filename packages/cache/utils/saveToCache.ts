import { RecordMap } from '@nishans/types';
import { ICache } from '../src';

/**
 * Save all the items of a recordMap in internal cache
 * @param recordMap The recordMap to save to cache
 */
export function saveToCache (recordMap: Partial<RecordMap>, cache: ICache) {
	// Loop through each of the cache keys
	// Store all the values of that particular key thats present in the recordMap in the cache
	([
		'block',
		'collection',
		'space',
		'collection_view',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings'
	] as (keyof ICache)[]).forEach((key) => {
		if (recordMap[key])
			Object.entries(recordMap[key] as Record<any, any>).forEach(([ record_id, record_value ]) => {
				cache[key].set(record_id, record_value.value);
			});
	});
}
