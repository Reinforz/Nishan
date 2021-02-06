import { ICache, validatePassedCacheArgument } from '../src';

const correct_cache: ICache = {
	block: new Map(),
	collection: new Map(),
	space: new Map(),
	collection_view: new Map(),
	notion_user: new Map(),
	space_view: new Map(),
	user_root: new Map(),
	user_settings: new Map()
};

describe('validatePassedCacheArgument', () => {
	it(`Should fail if cache_item is not a Map`, () => {
		expect(() =>
			validatePassedCacheArgument({
				...correct_cache,
				block: true
			} as any)
		).toThrow(`block is not an instance of Map`);
	});

	it(`Should fail if cache_item is not passed`, () => {
		expect(() =>
			validatePassedCacheArgument({
				block: new Map(),
				collection: new Map(),
				space: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space_view: new Map(),
				user_root: new Map()
			} as any)
		).toThrow(`user_settings must be present in Cache argument`);
	});

	it(`Should fail an unknown cache_item is passed`, () => {
		expect(() =>
			validatePassedCacheArgument({
				...correct_cache,
				unknown: new Map()
			} as any)
		).toThrow(`Unknown key unknown passed`);
	});
});
