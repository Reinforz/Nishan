import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`getRowPageIds`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', type: 'page', parent_table: 'collection', parent_id: 'collection_1' } ],
			[ 'block_2', { id: 'block_2', type: 'page', parent_table: 'block', parent_id: 'block_1' } ]
		])
	} as any;

	const initializeCacheForSpecificDataMock = jest
		.spyOn(NotionCache, 'initializeCacheForSpecificData')
		.mockImplementationOnce(async () => {
			cache.block.set('block_3', {
				id: 'block_3',
				type: 'page',
				parent_table: 'collection',
				parent_id: 'collection_1',
				is_template: true
			});
		});

	const row_page_ids = await NotionLineage.Collection.getRowPageIds('collection_1', {
		cache,
		cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker(),
		token: '',
		user_id: 'user_root_1'
	});

	expect(row_page_ids).toStrictEqual([ 'block_1' ]);
	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
});
