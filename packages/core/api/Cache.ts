import { RecordMap } from '@nishans/types';
import { ICache, UpdateCacheManuallyParam } from '../types';

export default class Cache {
	cache: ICache;

	constructor (cache?: ICache) {
		this.cache = cache || {
			block: new Map(),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		};
	}

	/**
   * Save the passed recordMap to cache
   * @param recordMap RecordMap map to save to cache
   */
	saveToCache (recordMap: Partial<RecordMap>) {
		(Object.keys(this.cache) as (keyof ICache)[]).forEach((key) => {
			if (recordMap[key])
				Object.entries(recordMap[key] || {}).forEach(([ record_id, record_value ]) => {
					this.cache[key].set(record_id, record_value.value);
				});
		});
	}

	returnNonCachedData (ids: UpdateCacheManuallyParam): UpdateCacheManuallyParam {
		return ids.filter(
			(info) => !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
		);
	}
}
