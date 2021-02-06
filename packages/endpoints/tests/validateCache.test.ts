import { ICache, validateCache } from '../src';
import { LoadUserContentData } from '../utils/data';

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

	it(`Should return cache if no error is thrown`, () => {
		expect(
			validateCache({
				...correct_cache,
				block: new Map([
					[
						'4b4bb21d-f68b-4113-b342-830687a5337b',
						{ ...LoadUserContentData.recordMap.block['4b4bb21d-f68b-4113-b342-830687a5337b'].value }
					]
				])
			})
		).toBeTruthy();
	});
});
