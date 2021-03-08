import { NotionCache } from '@nishans/cache';
import { NotionGraphqlCollectionBlockResolver } from '../../libs/Resolvers/collection_block';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('collection', () => {
	it(`initialized_cache=false`, async () => {
		const cache_initializer_tracker = {
				block: new Map([ [ 'block_1', false ] ])
			},
			cache = NotionCache.createDefaultCache();
		const collection_1: any = { id: 'collection_1' };
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => {
				cache.collection.set('collection_1', collection_1);
			});

		const data = await NotionGraphqlCollectionBlockResolver.collection(
			{ collection_id: 'collection_1', id: 'block_1' } as any,
			{},
			{
				cache,
				token: 'token',
				user_id: 'user_root_1',
				cache_initializer_tracker
			} as any
		);

		expect(cache_initializer_tracker.block.get('block_1')).toBe(true);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
		expect(data).toStrictEqual(collection_1);
	});

	it(`initialized_cache=true`, async () => {
		const collection_1: any = { id: 'collection_1' };
		const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlCollectionBlockResolver.collection(
			{ collection_id: 'collection_1', id: 'block_1' } as any,
			{},
			{
				cache,
				token: 'token',
				user_id: 'user_root_1',
				cache_initializer_tracker: {
					block: new Map([ [ 'block_1', true ] ])
				}
			} as any
		);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual(collection_1);
	});
});
