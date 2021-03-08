import { NotionCache } from '@nishans/cache';
import { NotionGraphqlCollectionResolver } from '../../libs/Resolvers/collection';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rows', () => {
	it(`initialized_collection_cache=false`, async () => {
		const collection_1: any = { id: 'collection_1' },
			block_1: any = {
				type: 'page',
				parent_table: 'collection',
				parent_id: 'collection_1',
				is_template: false
			};
		const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => {
				cache.block.set('block_1', block_1);
			});

		const data = await NotionGraphqlCollectionResolver.rows(
			{ id: 'collection_1' } as any,
			{},
			{ cache, token: 'token', user_id: 'user_root_1' }
		);

		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
		expect(data).toStrictEqual([ block_1 ]);
	});

	it(`initialized_collection_cache=true`, async () => {
		const collection_1: any = { id: 'collection_1' },
			block_1 = {
				type: 'page',
				parent_table: 'collection',
				parent_id: 'collection_1',
				is_template: false
			},
			block_2 = {
				type: 'page',
				parent_table: 'space'
			};
		const cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlCollectionResolver.rows(
			{ id: 'collection_1' } as any,
			{},
			{ cache, token: 'token', user_id: 'user_root_1' }
		);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual([ block_1 ]);
	});
});

describe('templates', () => {
	it(`initialized_collection_cache=true`, async () => {
		const collection_1: any = { id: 'collection_1' },
			block_1: any = {
				id: 'block_1'
			};
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlCollectionResolver.templates(
			{ id: 'collection_1', template_pages: [ 'block_1' ] } as any,
			{},
			{ cache, token: 'token', user_id: 'user_root_1' }
		);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual([ block_1 ]);
	});
});
