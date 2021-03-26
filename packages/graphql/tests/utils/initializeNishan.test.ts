import { Nishan, NotionUser } from '@nishans/core';
import { initializeNishan } from '../../libs/utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('server', async () => {
	const getNotionUserMock = jest
		.spyOn(Nishan.prototype, 'getNotionUser')
		.mockImplementationOnce(async () => new NotionUser({ user_id: 'user_root_1', token: 'token' } as any));

	const context = (await initializeNishan({ logger: false, interval: 0, token: 'token', user_id: 'user_root_1' }))();

	expect(getNotionUserMock).toHaveBeenCalledWith('user_root_1');

	expect(context.cache_init_tracker).not.toBeUndefined();
	expect(context.user_id).toBe(`user_root_1`);
});
