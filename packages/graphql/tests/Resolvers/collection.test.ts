import { NotionCache } from '@nishans/cache';
import { NotionGraphqlCollectionResolver } from '../../libs/Resolvers/collection';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rows', () => {
	it(`initialized_cache=false`, async () => {
		const cache_init_tracker: any = {
				collection: new Map([ [ 'collection_1', false ] ])
			},
			collection_1: any = { id: 'collection_1' },
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

		const data = await NotionGraphqlCollectionResolver.rows({ id: 'collection_1' } as any, {}, {
			cache,
			token: 'token',
			user_id: 'user_root_1',
			cache_init_tracker
		} as any);

		expect(cache_init_tracker.collection.get('collection_1')).toBe(true);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
		expect(data).toStrictEqual([ block_1 ]);
	});

	it(`initialized_cache=true`, async () => {
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

		const data = await NotionGraphqlCollectionResolver.rows({ id: 'collection_1' } as any, {}, {
			cache,
			token: 'token',
			user_id: 'user_root_1',
			cache_init_tracker: {
				collection: new Map([ [ 'collection_1', true ] ])
			}
		} as any);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual([ block_1 ]);
	});
});

describe('templates', () => {
	it(`initialized_cache=true`, async () => {
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
			{
				cache,
				token: 'token',
				user_id: 'user_root_1',
				cache_init_tracker: {
					collection: new Map([ [ 'collection_1', true ] ])
				}
			} as any
		);

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
		expect(data).toStrictEqual([ block_1 ]);
	});

	it(`initialized_cache=false`, async () => {
		const cache_init_tracker = {
				collection: new Map([ [ 'collection_1', false ] ])
			},
			collection_1: any = { id: 'collection_1' },
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
			{
				cache,
				token: 'token',
				user_id: 'user_root_1',
				cache_init_tracker
			} as any
		);

		expect(cache_init_tracker.collection.get('collection_1')).toBe(true);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
		expect(data).toStrictEqual([ block_1 ]);
	});

	it(`initialized_cache=false,template_pages=undefined`, async () => {
		const collection_1: any = { id: 'collection_1' };
		const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		};
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);

		const data = await NotionGraphqlCollectionResolver.templates({ id: 'collection_1' } as any, {}, {
			cache,
			token: 'token',
			user_id: 'user_root_1',
			cache_init_tracker: {
				collection: new Map([ [ 'collection_1', false ] ])
			}
		} as any);

		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
		expect(data).toStrictEqual([]);
	});
});

it(`parent`, async () => {
	const block_1: any = {
			id: 'block_1'
		},
		collection_1: any = { id: 'collection_1' };
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', block_1 ] ]),
		collection: new Map([ [ 'collection_1', collection_1 ] ])
	};
	const fetchDataOrReturnCachedMock = jest
		.spyOn(NotionCache, 'fetchDataOrReturnCached')
		.mockImplementationOnce(async () => block_1);

	const data = await NotionGraphqlCollectionResolver.parent({ id: 'collection_1', parent_id: 'block_1' } as any, {}, {
		cache,
		token: 'token',
		user_id: 'user_root_1'
	} as any);

	expect(fetchDataOrReturnCachedMock.mock.calls[0].slice(0, 2)).toEqual([ 'block', 'block_1' ]);
	expect(data).toStrictEqual(block_1);
});

it(`name`, () => {
	expect(NotionGraphqlCollectionResolver.name({ name: [ [ 'Collection One' ] ] } as any)).toStrictEqual(
		'Collection One'
	);
});
