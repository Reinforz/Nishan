import { RecordMap } from '@nishans/types';
import { NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`returnNonCachedData`, () => {
	const recordMap: RecordMap = {
		block: {
			block_1: {
				role: 'editor',
				value: { id: 'block_1' } as any
			}
		}
	} as any;

	const cache = {
		block: new Map([
			[
				'block_1',
				{
					id: 'block_1'
				}
			]
		]),
		notion_user: new Map()
	} as any;

	NotionCache.saveToCache(recordMap, cache);

	// Check to see if the data that doesn't exist in the cache returns or not
	const non_cached_data = NotionCache.returnNonCachedData(
		[ [ 'block_1', 'block' ], [ 'notion_user_1', 'notion_user' ] ],
		cache
	);

	expect(non_cached_data).toStrictEqual([ [ 'notion_user_1', 'notion_user' ] ]);
});
