import { Cache } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';
import { ExternalNotionUser, ExternalNotionUserData, GetSpacesData, LoadUserContentData } from '../utils/data';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('Cache class', () => {
	it(`constructor`, () => {
		// It should throw if cache passed is not correct
		expect(
			() =>
				new Cache({
					cache: {
						block: new Map()
					}
				} as any)
		).toThrow();
	});

	it(`getConfigs method`, () => {
		const cache = new Cache({
			token: 'token'
		});

		expect(
			deepEqual(cache.getConfigs(), {
				token: 'token',
				user_id: '',
				interval: 500
			})
		).toBe(true);
	});

	it('saveToCache method', () => {
		const cache = new Cache({
			token: 'token'
		});

		// Save data to internal cache
		cache.saveToCache(LoadUserContentData.recordMap);

		// After saving data to cache it should exist in the internal cache
		expect(
			deepEqual(
				cache.cache.notion_user.get('d94caf87-a207-45c3-b3d5-03d157b5b39b'),
				LoadUserContentData.recordMap.notion_user['d94caf87-a207-45c3-b3d5-03d157b5b39b'].value
			)
		).toBe(true);
		// Unknown data should not exist in the internal cache
		expect(cache.cache.notion_user.get('d94caf87-a207-45c3-b3d5-03d157b5b39c')).toBeUndefined();
	});

	it(`returnNonCachedData method`, () => {
		const cache = new Cache({
			token: 'token',
			interval: 0
		});

		cache.saveToCache(LoadUserContentData.recordMap);
		// Check to see if the data that doesnot exist in the cache returns or not
		const non_cached_data = cache.returnNonCachedData([
			[ 'd94caf87-a207-45c3-b3d5-03d157b5b39b', 'notion_user' ],
			[ 'd94caf87-a207-45c3-b3d5-03d157b5b39c', 'notion_user' ],
			'd94caf87-a207-45c3-b3d5-03d157b5b39d'
		]);

		// the 2nd argument to deepEqual represents the data that doesnot exist in the internal cache
		expect(
			deepEqual(non_cached_data, [
				[ 'd94caf87-a207-45c3-b3d5-03d157b5b39c', 'notion_user' ],
				'd94caf87-a207-45c3-b3d5-03d157b5b39d'
			])
		).toBe(true);
	});

	describe(`initializeCache method`, () => {
		it(`Fetches external notion_user data`, async () => {
			mock.onPost(`/getSpaces`).replyOnce(200, GetSpacesData);
			mock.onPost(`/syncRecordValues`).replyOnce(200, { recordMap: { notion_user: ExternalNotionUserData } });

			const cache = new Cache({
				token: 'token'
			});

			await cache.initializeCache();
			// Expect certain cache data to exist after cache initialization.
			expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
			expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b')).not.toBeUndefined();
			// External notion user is checked in the cache
			expect(cache.cache.notion_user.get(ExternalNotionUser.id)).not.toBeUndefined();
		});

		it(`Doesnt fetch external notion_user data`, async () => {
			// Getting a space that doesnot give access to external users
			mock.onPost(`/getSpaces`).replyOnce(200, {
				'd2498a62-99ed-4ffd-b56d-e986001729f3': GetSpacesData['d2498a62-99ed-4ffd-b56d-e986001729f3']
			});

			const cache = new Cache({
				token: 'token'
			});

			await cache.initializeCache();
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6402')).not.toBeUndefined();
			// This internal notion user is checked in the cache
			expect(cache.cache.notion_user.get('d94caf87-a207-45c3-b3d5-03d157b5b39b')).not.toBeUndefined();
			// expect external notion user to be undefined in the cache since it was not fetched
			expect(cache.cache.notion_user.get(ExternalNotionUser.id)).toBeUndefined();
		});
	});

	describe(`updateCacheManually method`, () => {
		it(`Should work correctly when passed array of string arguments`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			mock.onPost(`/syncRecordValues`).replyOnce(200, LoadUserContentData);

			// Array of string, or [id, data_type] tuple should work
			await cache.updateCacheManually([
				'4b4bb21d-f68b-4113-b342-830687a5337a',
				[ 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b', 'collection' ]
			]);
			expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
			expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b')).not.toBeUndefined();

			mock.onPost(`/syncRecordValues`).replyOnce(200, LoadUserContentData);

			// Single string argument should work as well
			await cache.updateCacheManually('6eae77bf-64cd-4ed0-adfb-e97d928a6402');
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6402')).not.toBeUndefined();
		});

		it(`Should throw an error if passed wrong arguments`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			expect(() => cache.updateCacheManually([ true ] as any)).rejects.toThrow(`Unsupported argument passed`);
			expect(() => cache.updateCacheManually(true as any)).rejects.toThrow(`Unsupported argument passed`);
			expect(await cache.updateCacheManually([])).toBeFalsy();
		});
	});

	it(`updateCacheIfNotPresent method`, async () => {
		const cache = new Cache({
			token: 'token'
		});

		cache.saveToCache({
			collection: LoadUserContentData.recordMap.collection
		});

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: { block: LoadUserContentData.recordMap.block, space: LoadUserContentData.recordMap.space }
		});

		await cache.updateCacheIfNotPresent([
			'4b4bb21d-f68b-4113-b342-830687a5337a',
			[ 'd2498a62-99ed-4ffd-b56d-e986001729f4', 'space' ],
			[ 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b', 'collection' ]
		]);

		expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
		expect(cache.cache.space.get('d2498a62-99ed-4ffd-b56d-e986001729f4')).not.toBeUndefined();
		expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b')).not.toBeUndefined();
		// Using empty arguments to check for else coverage
		await cache.updateCacheIfNotPresent([]);
	});

	describe('initializeCacheForSpecificData', () => {
		it(`Should work for block & page type`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			// Removing certain data so that they are not loaded in the cache initially
			const copied_block_data = JSON.parse(JSON.stringify(LoadUserContentData.recordMap.block));
			delete copied_block_data['6eae77bf-64cd-4ed0-adfb-e97d928a6401'];
			delete copied_block_data['4b4bb21d-f68b-4113-b342-830687a5337b'];
			cache.saveToCache({ block: copied_block_data });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: LoadUserContentData.recordMap.block,
					collection: LoadUserContentData.recordMap.collection
				}
			});
			await cache.initializeCacheForSpecificData('6eae77bf-64cd-4ed0-adfb-e97d928a6402', 'block');
			// The contents of the page block should be present in the cache
			// That means the cvp and its collection as well
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6401')).not.toBeUndefined();
			expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337b')).not.toBeUndefined();
			expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c')).not.toBeUndefined();
		});

		it(`Should work for block & collection_view_page type`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			cache.saveToCache({ block: LoadUserContentData.recordMap.block });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					collection_view: GetSpacesData['d2498a62-99ed-4ffd-b56d-e986001729f4'].collection_view,
					collection: LoadUserContentData.recordMap.collection
				}
			});
			await cache.initializeCacheForSpecificData('4b4bb21d-f68b-4113-b342-830687a5337a', 'block');
			// The collection and collection_view data should be present in the cache when cvp data is initialized
			expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b')).not.toBeUndefined();
			expect(cache.cache.collection_view.get('451a024a-f6f8-476d-9a5a-1c98ffdf5a38')).not.toBeUndefined();
		});

		it(`Should work for type space`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			cache.saveToCache({ space: LoadUserContentData.recordMap.space });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: LoadUserContentData.recordMap.block
				}
			});
			await cache.initializeCacheForSpecificData('d2498a62-99ed-4ffd-b56d-e986001729f4', 'space');
			// All the pages of the space should be loaded in the cache
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6402')).not.toBeUndefined();
			expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
		});

		it(`Should work for type user_root`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			cache.saveToCache({ user_root: LoadUserContentData.recordMap.user_root });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					space_view: LoadUserContentData.recordMap.space_view
				}
			});
			await cache.initializeCacheForSpecificData('d94caf87-a207-45c3-b3d5-03d157b5b39b', 'user_root');
			expect(cache.cache.space_view.get('ccfc7afe-c14f-4764-9a89-85659217eed7')).not.toBeUndefined();
		});

		it(`Should work for type space_view`, async () => {
			const cache = new Cache({
				token: 'token'
			});

			cache.saveToCache({
				space_view: {
					'ccfc7afe-c14f-4764-9a89-85659217eed7':
						LoadUserContentData.recordMap.space_view['ccfc7afe-c14f-4764-9a89-85659217eed7'],
					'd2498a62-99ed-4ffd-b56d-e986001729f1':
						GetSpacesData['d2498a62-99ed-4ffd-b56d-e986001729f3'].space_view['d2498a62-99ed-4ffd-b56d-e986001729f1']
				}
			});

			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: LoadUserContentData.recordMap.block
				}
			});
			await cache.initializeCacheForSpecificData('ccfc7afe-c14f-4764-9a89-85659217eed7', 'space_view');
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6402')).not.toBeUndefined();
			expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
			// This space view doesnot contain any bookmarked_page
			await cache.initializeCacheForSpecificData('d2498a62-99ed-4ffd-b56d-e986001729f1', 'space_view');
		});

		it(`Should work for type collection`, async () => {
			const cache = new Cache({
				token: 'token'
			});
			cache.saveToCache({ collection: LoadUserContentData.recordMap.collection });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: {
						'6eae77bf-64cd-4ed0-adfb-e97d928a6404':
							LoadUserContentData.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6404']
					}
				}
			});

			mock.onPost(`/queryCollection`).replyOnce(200, {
				recordMap: {
					block: {
						'6eae77bf-64cd-4ed0-adfb-e97d928a6403':
							LoadUserContentData.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6403']
					}
				}
			});

			// This collection contains template pages
			await cache.initializeCacheForSpecificData('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b', 'collection');
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6404')).not.toBeUndefined();
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6403')).not.toBeUndefined();

			mock.onPost(`/queryCollection`).replyOnce(200, {
				recordMap: {
					block: {
						'6eae77bf-64cd-4ed0-adfb-e97d928a6400':
							LoadUserContentData.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6400']
					}
				}
			});

			// This collection doesnot contains template pages
			await cache.initializeCacheForSpecificData('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c', 'collection');
			expect(cache.cache.block.get('6eae77bf-64cd-4ed0-adfb-e97d928a6400')).not.toBeUndefined();
		});
	});

	it(`Should throw error for unsupported data`, async () => {
		const cache = new Cache({
			token: 'token'
		});

		expect(() =>
			cache.initializeCacheForSpecificData('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c', 'unknown' as any)
		).rejects.toThrow(`unknown data is not supported`);
	});
});
