import { ICache } from '../src';

export function validatePassedCacheArgument (cache: ICache) {
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

	const passed_cache_keys = Object.keys(cache);
	cache_keys.forEach((cache_key) => {
		if (!passed_cache_keys.includes(cache_key)) throw new Error(`${cache_key} must be present in Cache argument`);
	});

	passed_cache_keys.forEach((cache_key) => {
		const cache_item = cache_key as keyof ICache;
		if (!cache_keys.includes(cache_item)) throw new Error(`Unknown key ${cache_key} passed`);
		const is_map = cache[cache_item] instanceof Map;
		if (!is_map) throw new Error(`${cache_item} is not an instance of Map`);
	});

	return cache;
}
