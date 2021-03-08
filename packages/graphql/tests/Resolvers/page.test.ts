import { NotionCache } from '@nishans/cache';
import { NotionGraphqlResolvers } from '../../libs/Resolvers';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('content', () => {
	it(`initialize_cache=false`, async () => {
		const cache_initializer_tracker = {
				block: new Map([ [ 'block_1', false ] ])
			},
			cache = NotionCache.createDefaultCache();
		const block_2: any = { id: 'block_2' };
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => {
				cache.block.set('block_2', block_2);
			});

		const data = await NotionGraphqlResolvers.Page.contents({ content: [ 'block_2' ], id: 'block_1' } as any, {}, {
			cache,
			token: 'token',
			user_id: 'user_root_1',
			cache_initializer_tracker
		} as any);

		expect(cache_initializer_tracker.block.get('block_1')).toBe(true);
		expect(data).toStrictEqual([ block_2 ]);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	});

	it(`initialize_cache=true`, async () => {
		const block_2: any = { id: 'block_2' };
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_2', block_2 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlResolvers.Page.contents({ content: [ 'block_2' ], id: 'block_1' } as any, {}, {
			cache,
			token: 'token',
			user_id: 'user_root_1',
			cache_initializer_tracker: {
				block: new Map([ [ 'block_1', true ] ])
			}
		} as any);

		expect(data).toStrictEqual([ block_2 ]);
		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
	});
});

it(`properties`, () => {
	const title = NotionGraphqlResolvers.Page.properties({ properties: { title: [ [ 'Hello World' ] ] } } as any);
	expect(title).toStrictEqual({ title: 'Hello World' });
});
