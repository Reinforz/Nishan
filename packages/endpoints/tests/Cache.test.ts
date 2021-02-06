import { Cache } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';
import { GetSpacesData, LoadUserContentData } from './data';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('Cache class', () => {
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

		cache.saveToCache(LoadUserContentData.recordMap);

		expect(
			deepEqual(
				cache.cache.notion_user.get('d94caf87-a207-45c3-b3d5-03d157b5b39b'),
				LoadUserContentData.recordMap.notion_user['d94caf87-a207-45c3-b3d5-03d157b5b39b'].value
			)
		).toBe(true);
		expect(cache.cache.notion_user.get('d94caf87-a207-45c3-b3d5-03d157b5b39c')).toBeUndefined();
	});

	it(`returnNonCachedData method`, () => {
		const cache = new Cache({
			token: 'token'
		});

		cache.saveToCache(LoadUserContentData.recordMap);
		const non_cached_data = cache.returnNonCachedData([
			[ 'd94caf87-a207-45c3-b3d5-03d157b5b39b', 'notion_user' ],
			[ 'd94caf87-a207-45c3-b3d5-03d157b5b39c', 'notion_user' ]
		]);

		expect(deepEqual(non_cached_data, [ [ 'd94caf87-a207-45c3-b3d5-03d157b5b39c', 'notion_user' ] ])).toBe(true);
	});

	it(`initializeCache method`, async () => {
		mock.onPost(`/getSpaces`).replyOnce(200, GetSpacesData);

		const cache = new Cache({
			token: 'token'
		});

		await cache.initializeCache();
		expect(cache.cache.block.get('4b4bb21d-f68b-4113-b342-830687a5337a')).not.toBeUndefined();
		expect(cache.cache.collection.get('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b')).not.toBeUndefined();
	});
});
