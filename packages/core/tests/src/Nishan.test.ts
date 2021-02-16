import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import deepEqual from 'deep-equal';
import Nishan from '../../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

describe('Nishan', () => {
	describe('get', () => {
		it('arg=cb,multiple=true', async () => {
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

		it('arg=cb,multiple=false', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				token: 'token',
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

			const user = await nishan.getNotionUser((user) => {
				return user.id === 'b';
			});

			expect(logger_spy).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('READ', 'notion_user', 'b');

			expect(deepEqual(user.getCachedData(), { id: 'b', data: 'data' }));
		});

		it('arg=string,multiple=false', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				token: 'token',
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

			const user_a = await nishan.getNotionUser('a');
			const user_b = await nishan.getNotionUser('b');

			expect(logger_spy).toHaveBeenCalledTimes(2);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'READ', 'notion_user', 'a');
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'READ', 'notion_user', 'b');

			expect(deepEqual(user_a.getCachedData(), { id: 'a', data: 'data' }));
			expect(deepEqual(user_b.getCachedData(), { id: 'b', data: 'data' }));
		});
	});
});
