import { Queries } from '@nishans/endpoints';
import Nishan from '../../';
import { default_nishan_arg } from '../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Nishan', () => {
	describe('get', () => {
		it('arg=cb,multiple=true', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				...default_nishan_arg,
				notion_operation_plugins: [],
				logger: logger_spy
			});

			jest.spyOn(Queries, 'getSpaces').mockImplementationOnce(async () => {
				return {
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
				} as any;
			});

			const users = await nishan.getNotionUsers((user) => {
				return user.id === 'a';
			});

			expect(logger_spy).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('READ', 'notion_user', 'a');

			expect(users[0].getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
		});

		it('arg=cb,multiple=false', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				...default_nishan_arg,
				logger: logger_spy
			});

			jest.spyOn(Queries, 'getSpaces').mockImplementationOnce(async () => {
				return {
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
				} as any;
			});

			const user = await nishan.getNotionUser((user) => {
				return user.id === 'b';
			});

			expect(logger_spy).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenCalledWith('READ', 'notion_user', 'b');

			expect(user.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
		});

		it('arg=string,multiple=false', async () => {
			const logger_spy = jest.fn();

			const nishan = new Nishan({
				token: 'token',
				logger: logger_spy
			});

			jest.spyOn(Queries, 'getSpaces').mockImplementationOnce(async () => {
				return {
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
				} as any;
			});

			const user_a = await nishan.getNotionUser('a');
			const user_b = await nishan.getNotionUser('b');

			expect(logger_spy).toHaveBeenCalledTimes(2);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'READ', 'notion_user', 'a');
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'READ', 'notion_user', 'b');

			expect(user_a.getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
			expect(user_b.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
		});
	});
});
