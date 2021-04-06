import { NotionCore } from '@nishans/core';
import { ApolloServer } from 'apollo-server';
import { NotionGraphql } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('server', async () => {
	const getNotionUserMock = jest
		.spyOn(NotionCore.Api.Nishan.prototype, 'getNotionUser')
		.mockImplementationOnce(async () => undefined as any);

	const server = await NotionGraphql.server({ logger: false, interval: 0, token: 'token', user_id: 'user_root_1' });

	expect(getNotionUserMock).toHaveBeenCalledWith('user_root_1');
	expect(server instanceof ApolloServer).toBe(true);
});
