import { NotionCache } from '@nishans/cache';
import { IPageMap, PopulateMap } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('PopulateMap.page', () => {
	it(`type=page`, async () => {
		const page_map: IPageMap = {
			page: new Map(),
			collection_view_page: new Map()
		};

		const cache = NotionCache.createDefaultCache();

		await PopulateMap.page({ id: 'block_1', type: 'page', properties: { title: [ [ 'Page' ] ] } } as any, page_map, {
			...default_nishan_arg,
			cache
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

		const PopulateMapCollectionBlockMock = jest.spyOn(PopulateMap, 'collectionBlock').mockImplementationOnce(() => {
			return undefined as any;
		});

		await PopulateMap.page(block_1 as any, page_map, {
			...default_nishan_arg,
			cache
		});

		expect(PopulateMapCollectionBlockMock).toHaveBeenCalledTimes(1);
		expect(PopulateMapCollectionBlockMock.mock.calls[0][0]).toStrictEqual(block_1);
	});
});
