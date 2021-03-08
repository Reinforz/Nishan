import { NotionCache } from '@nishans/cache';
import { NotionGraphqlResolvers } from '../../libs/Resolvers';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('pages', () => {
	it(`initialize_cache=false`, async () => {
		const cache = NotionCache.createDefaultCache();
		const block_1: any = { id: 'block_1' };
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => {
				cache.block.set('block_1', block_1);
			});

		const data = await NotionGraphqlResolvers.Space.pages(
			{ pages: [ 'block_1' ], id: 'space_1' } as any,
			{},
			{ cache, token: 'token', user_id: 'user_root_1' }
		);

		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'space_1', 'space' ]);
		expect(data).toStrictEqual([ block_1 ]);
	});

	it(`initialize_cache=true`, async () => {
		const block_1: any = { id: 'block_1' };
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlResolvers.Space.pages(
			{ pages: [ 'block_1' ], id: 'space_1' } as any,
			{},
			{ cache, token: 'token', user_id: 'user_root_1' }
		);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual([ block_1 ]);
	});
});
