import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import deepEqual from 'deep-equal';
import Nishan from '../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

describe('Nishan', () => {
	describe('get', () => {
		it('arg=cb', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				token: 'token',
				interval: 0,
				logger: (method, data_type, id) => {
					logger_spy(method, data_type, id);
				}
			});

			mock.onPost(`/getSpaces`).replyOnce(200, {
				'1': {
					space: {
						'1': {
							value: { permissions: [ { user_id: 'a' } ] }
						}
					},
					notion_user: {
						a: {
							value: { id: 'a', data: 'data' }
						},
						b: {
							value: { id: 'b', data: 'data' }
						}
					},
					user_root: {
						a: {
							value: { id: 'a', data: 'data' }
						}
					}
				}
			});

			const users = await nishan.getNotionUsers((user) => {
				return user.id === 'a';
			});

			expect(logger_spy).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('READ', 'notion_user', 'a');

			expect(deepEqual(users[0].getCachedData(), { id: 'a', data: 'data' }));
		});
	});
});
