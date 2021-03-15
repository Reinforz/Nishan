import { NotionEndpoints } from '@nishans/endpoints';
import { NotionLogger } from '@nishans/logger';
import { Nishan } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('get', () => {
	it('arg=cb,multiple=true', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementationOnce(() => undefined as any);

		const nishan = new Nishan({
			...default_nishan_arg,
			notion_operation_plugins: []
		});

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
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

		expect(methodLoggerMock).toHaveBeenCalledTimes(1);
		expect(methodLoggerMock).toHaveBeenCalledWith('READ notion_user a');

		expect(users[0].getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
	});

	it('arg=cb,multiple=false', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementationOnce(() => undefined as any);
		const nishan = new Nishan(default_nishan_arg);

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
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

		expect(methodLoggerMock).toHaveBeenCalledTimes(1);
		expect(methodLoggerMock).toHaveBeenCalledWith('READ notion_user b');

		expect(user.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
	});

	it('arg=string,multiple=false', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

		const nishan = new Nishan({
			token: 'token'
		});

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
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

		expect(methodLoggerMock).toHaveBeenCalledTimes(2);
		expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'READ notion_user a');
		expect(methodLoggerMock).toHaveBeenNthCalledWith(2, 'READ notion_user b');

		expect(user_a.getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
		expect(user_b.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
	});
});
