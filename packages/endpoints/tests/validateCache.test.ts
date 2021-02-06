import { ICache, validateCache } from '../src';

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

describe('validateCache', () => {
	it(`Should fail if cache_item is not a Map`, () => {
		expect(() =>
			validateCache({
				...correct_cache,
				block: true
			} as any)
		).toThrow(`block is not an instance of Map`);
	});

	it(`Should fail if cache_item is not passed`, () => {
		expect(() =>
			validateCache({
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

	it(`Should fail if an unknown cache_item is passed`, () => {
		expect(() =>
			validateCache({
				...correct_cache,
				unknown: new Map()
			} as any)
		).toThrow(`Unknown key unknown passed`);
	});

	it(`Should fail if the passed value is not of correct structure`, () => {
		expect(() =>
			validateCache({
				...correct_cache,
				block: new Map([
					[
						'123',
						{
							value: {}
						}
					]
				])
			} as any)
		).toThrow(`No role key present`);

		expect(() =>
			validateCache({
				...correct_cache,
				block: new Map([
					[
						'123',
						{
							role: 123
						}
					]
				])
			} as any)
		).toThrow(`No value key present`);
	});

	it(`Should return cache if no error is thrown`, () => {
		expect(() => validateCache(correct_cache)).toBeTruthy();
	});
});
