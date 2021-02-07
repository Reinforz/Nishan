import { TBlock, TPermissionRole } from '@nishans/types';
import { ICache } from '../src';

export function validateCache (cache: ICache) {
	const cache_keys: (keyof ICache)[] = [
		'block',
		'collection',
		'space',
		'collection_view',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings'
	];

	// Throw error if the required items are not present in the cache
	const passed_cache_keys = Object.keys(cache);
	cache_keys.forEach((cache_key) => {
		if (!passed_cache_keys.includes(cache_key)) throw new Error(`${cache_key} must be present in Cache argument`);
	});

	passed_cache_keys.forEach((cache_key) => {
		// Throw error if an unknown key is used in the cache
		const cache_item = cache_key as keyof ICache;
		if (!cache_keys.includes(cache_item)) throw new Error(`Unknown key ${cache_key} passed`);
		const is_map = cache[cache_item] instanceof Map;
		// Throw error if the stored value is not an instance of a Map
		if (!is_map) throw new Error(`${cache_item} is not an instance of Map`);
	});
	return cache;
}
