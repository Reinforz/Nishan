import { Cache } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('Cache class', () => {
	it(`getConfigs method should work correctly`, () => {
		const cache = new Cache({
			token: 'token'
		});

		const configs = cache.getConfigs();
		expect(
			deepEqual(configs, {
				token: 'token',
				user_id: '',
				interval: 500
			})
		).toBe(true);
	});
});
