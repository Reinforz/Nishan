import { NotionCacheObject } from '@nishans/cache';
import { IOperation, IPage } from '@nishans/types';
import { stackCacheMap } from '../../../../../libs/CreateData/Contents/utils';
import { IBlockMap, Page } from '../../../../../src';

describe('stackCacheMap', () => {
	it(`name=string`, () => {
		const cache = NotionCacheObject.createDefaultCache(),
			stack: IOperation[] = [],
			block_map: IBlockMap = { page: new Map() } as any,
			data = { id: 'data_id', type: 'page', data: 'data' } as any;
		stackCacheMap<IPage>(
			block_map,
			data,
			{
				cache,
				interval: 0,
				logger: false,
				shard_id: 123,
				space_id: 'space_1',
				stack,
				token: 'token',
				user_id: 'user_root_1'
			},
			'name'
		);

		expect(stack).toStrictEqual([
			{
				args: data,
				command: 'update',
				id: 'data_id',
				path: [],
				table: 'block'
			}
		]);
		expect(cache.block.get('data_id')).toStrictEqual(data);
		expect((block_map.page.get('data_id') as Page).getCachedData()).toStrictEqual(data);
		expect((block_map.page.get('name') as Page).getCachedData()).toStrictEqual(data);
	});
});
