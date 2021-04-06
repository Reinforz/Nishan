import { NotionCache } from '@nishans/cache';
import { IBlockMap, NotionCore } from '../../libs';
import { Block } from '../../libs/Api/Block';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('NotionCore.PopulateMap.block', () => {
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

		const PopulateMapPageMock = jest.spyOn(NotionCore.PopulateMap, 'page').mockImplementationOnce(() => {
			return undefined as any;
		});

		await NotionCore.PopulateMap.block(block_1 as any, block_map, {
			...default_nishan_arg,
			cache
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

		await NotionCore.PopulateMap.block(block_1 as any, block_map, {
			...default_nishan_arg,
			cache
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

		await NotionCore.PopulateMap.block(block_1 as any, block_map, {
			...default_nishan_arg,
			cache
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

		const PopulateMapCollectionBlockMock = jest
			.spyOn(NotionCore.PopulateMap, 'collectionBlock')
			.mockImplementationOnce(() => {
				return undefined as any;
			});

		await NotionCore.PopulateMap.block(block_1 as any, block_map, {
			...default_nishan_arg,
			cache
		});

		expect(PopulateMapCollectionBlockMock).toHaveBeenCalledTimes(1);
		expect(PopulateMapCollectionBlockMock.mock.calls[0][0]).toStrictEqual(block_1);
	});
});
