import { Cache } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

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

		const block_value = {
				data: 'block'
			},
			block_data = {
				'123': {
					value: block_value
				} as any
			};

		cache.saveToCache({
			block: block_data as any
		});

		expect(deepEqual(cache.cache.block.get('123'), block_value)).toBe(true);
	});
});
