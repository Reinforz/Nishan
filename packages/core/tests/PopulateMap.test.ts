import { NotionCache } from '@nishans/cache';
import { Block, IBlockMap, IPageMap, PopulateMap } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const NishanArgs = {
	interval: 0,
	shard_id: 123,
	space_id: 'space_1',
	stack: [],
	token: 'token',
	user_id: 'user_root_1'
};

it(`PopulateMap.collection_block`, async () => {
	const block_map: IBlockMap = {
			collection_view_page: new Map()
		} as any,
		block_1: any = { id: 'block_1', type: 'collection_view_page', collection_id: 'collection_1' };

	const cache = {
		...NotionCache.createDefaultCache(),
		collection: new Map([ [ 'collection_1', { name: [ [ 'Collection' ] ], id: 'collection_1' } ] ]),
		block: new Map([ [ 'block_1', block_1 ] ])
	} as any;

	const initializeCacheForSpecificDataMock = jest
		.spyOn(NotionCache, 'initializeCacheForSpecificData')
		.mockImplementationOnce(() => {
			return undefined as any;
		});

	await PopulateMap.collection_block(
		block_1,
		{
			cache,
			...NishanArgs
		},
		block_map
	);

	expect(block_map.collection_view_page.get('Collection')).not.toBeUndefined();
	expect(initializeCacheForSpecificDataMock).toBeCalledTimes(1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0][0]).toBe('block_1');
	expect(initializeCacheForSpecificDataMock.mock.calls[0][1]).toBe('block');
});

describe('PopulateMap.page', () => {
	it(`type=page`, async () => {
		const page_map: IPageMap = {
			page: new Map(),
			collection_view_page: new Map()
		};

		const cache = NotionCache.createDefaultCache();

		await PopulateMap.page({ id: 'block_1', type: 'page', properties: { title: [ [ 'Page' ] ] } } as any, page_map, {
			cache,
			...NishanArgs
		});

		expect(page_map.page.get('block_1')).not.toBeUndefined();
		expect(page_map.page.get('Page')).not.toBeUndefined();
	});

	it(`type=collection_view_page`, async () => {
		const page_map: IPageMap = {
				page: new Map(),
				collection_view_page: new Map()
			},
			block_1: any = { id: 'block_1', type: 'collection_view_page', collection_id: 'collection_1' };

		const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ 'collection_1', { name: [ [ 'Collection' ] ], id: 'collection_1' } ] ]),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;

		jest.spyOn(NotionCache, 'initializeCacheForSpecificData').mockImplementationOnce(() => {
			return undefined as any;
		});

		const PopulateMapCollectionBlockMock = jest.spyOn(PopulateMap, 'collection_block').mockImplementationOnce(() => {
			return undefined as any;
		});

		await PopulateMap.page(block_1 as any, page_map, {
			cache,
			...NishanArgs
		});

		expect(PopulateMapCollectionBlockMock).toHaveBeenCalledTimes(1);
		expect(PopulateMapCollectionBlockMock.mock.calls[0][0]).toStrictEqual(block_1);
	});
});

describe('PopulateMap.block', () => {
	it(`type=collection_view_page`, async () => {
		const block_map: any = {
				page: new Map(),
				collection_view_page: new Map()
			},
			block_1: any = { id: 'block_1', type: 'collection_view_page', collection_id: 'collection_1' };

		const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ 'collection_1', { name: [ [ 'Collection' ] ], id: 'collection_1' } ] ]),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;

		jest.spyOn(NotionCache, 'initializeCacheForSpecificData').mockImplementationOnce(() => {
			return undefined as any;
		});

		const PopulateMapPageMock = jest.spyOn(PopulateMap, 'page').mockImplementationOnce(() => {
			return undefined as any;
		});

		await PopulateMap.block(block_1 as any, block_map, {
			cache,
			...NishanArgs
		});

		expect(PopulateMapPageMock).toHaveBeenCalledTimes(1);
		expect(PopulateMapPageMock.mock.calls[0][0]).toStrictEqual(block_1);
	});

	it(`type=header`, async () => {
		const block_map: IBlockMap = {
				header: new Map()
			} as any,
			block_1: any = { id: 'block_1', type: 'header', properties: { title: [ [ 'Hello World' ] ] } };

		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;

		await PopulateMap.block(block_1 as any, block_map, {
			cache,
			...NishanArgs
		});

		expect(block_map.header.get('block_1') instanceof Block).toBe(true);
		expect(block_map.header.get('Hello World') instanceof Block).toBe(true);
	});

	it(`type=header, !title`, async () => {
		const block_map: IBlockMap = {
				header: new Map()
			} as any,
			block_1: any = { id: 'block_1', type: 'header' };

		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;

		await PopulateMap.block(block_1 as any, block_map, {
			cache,
			...NishanArgs
		});

		expect(block_map.header.get('block_1') instanceof Block).toBe(true);
	});

	it(`type=collection_view`, async () => {
		const block_map: IBlockMap = {
				collection_view: new Map()
			} as any,
			block_1: any = { id: 'block_1', type: 'collection_view' };

		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;

		const PopulateMapCollectionBlockMock = jest.spyOn(PopulateMap, 'collection_block').mockImplementationOnce(() => {
			return undefined as any;
		});

		await PopulateMap.block(block_1 as any, block_map, {
			cache,
			...NishanArgs
		});

		expect(PopulateMapCollectionBlockMock).toHaveBeenCalledTimes(1);
		expect(PopulateMapCollectionBlockMock.mock.calls[0][0]).toStrictEqual(block_1);
	});
});
