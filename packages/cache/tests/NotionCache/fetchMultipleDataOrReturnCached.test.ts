import { NotionQueries } from '@nishans/endpoints';
import { ICache, NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('fetchMultipleDataOrReturnCached', () => {
	it(`works correctly`, async () => {
		const block_1 = {
				id: 'block_1'
			},
			block_2 = {
				id: 'block_2'
			},
			cache: ICache = {
				block: new Map([ [ 'block_1', block_1 ] ])
			} as any;
		const syncRecordValuesMock = jest.spyOn(NotionQueries, 'syncRecordValues');
		syncRecordValuesMock.mockImplementationOnce(async () => {
			return {
				recordMap: {
					block: {
						block_2: {
							value: block_2
						}
					}
				}
			} as any;
		});
		const result_record_map = await NotionCache.fetchMultipleDataOrReturnCached(
			[ [ 'block_1', 'block' ], [ 'block_2', 'block' ] ],
			{ token: 'token' },
			cache
		);
		expect(result_record_map.block[0]).toBe(block_1);
		expect(result_record_map.block[1]).toBe(block_2);
		expect(syncRecordValuesMock).toHaveBeenCalledWith(
			{
				requests: [
					{
						id: 'block_2',
						table: 'block',
						version: 0
					}
				]
			},
			{ token: 'token' }
		);
		expect(cache.block.get('block_1')).toStrictEqual(block_1);
		expect(cache.block.get('block_2')).toStrictEqual(block_2);
	});
});
