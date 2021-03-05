import { RecordMap } from '@nishans/types';
import { NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('saveToCache', () => {
	const recordMap: RecordMap = {
		block: {
			block_2: {
				value: {
					id: 'block_2'
				}
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
		])
	} as any;

	// Save data to internal cache
	NotionCache.saveToCache(recordMap, cache);

	// After saving data to cache it should exist in the internal cache
	expect(cache.block.get('block_2')).toStrictEqual(recordMap.block['block_2'].value);
	// Unknown data should not exist in the internal cache
	expect(cache.block.get('block_3')).toBeUndefined();
});
