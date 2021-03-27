import { NotionCache } from '@nishans/cache';
import { IBlockMap, PopulateMap } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

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

	await PopulateMap.collectionBlock(
		block_1,
		{
			...default_nishan_arg,
			cache
		},
		block_map
	);

	expect(block_map.collection_view_page.get('Collection')).not.toBeUndefined();
	expect(initializeCacheForSpecificDataMock).toBeCalledTimes(1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0][0]).toBe('block_1');
	expect(initializeCacheForSpecificDataMock.mock.calls[0][1]).toBe('block');
});
