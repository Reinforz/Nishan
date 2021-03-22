import { NotionConstants } from '@nishans/constants';
import { NotionErrors } from '@nishans/errors';
import { ICache } from '@nishans/types';

/**
 * Validates the passed cache 
 * @param cache The cache to validate
 */
export function validateCache (cache: ICache) {
	const cache_keys = NotionConstants.dataTypes();

	// Throw error if the required items are not present in the cache
	const passed_cache_keys = Object.keys(cache);
	cache_keys.forEach((cache_key) => {
		if (!passed_cache_keys.includes(cache_key))
			NotionErrors.Log.error(`${cache_key} must be present in Cache argument`);
	});

	passed_cache_keys.forEach((cache_key) => {
		// Throw error if an unknown key is used in the cache
		const cache_item = cache_key as keyof ICache;
		if (!cache_keys.includes(cache_item)) NotionErrors.Log.error(`Unknown key ${cache_key} passed`);
		const is_map = cache[cache_item] instanceof Map;
		// Throw error if the stored value is not an instance of a Map
		if (!is_map) NotionErrors.Log.error(`${cache_item} is not an instance of Map`);
	});
	return cache;
}
