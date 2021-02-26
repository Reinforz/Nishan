import { NotionCacheObject } from '@nishans/cache';
import { IOperation, IPage } from '@nishans/types';
import { o } from '../../../../../core/tests/utils';
import { stackCacheMap } from '../../../../src/CreateData/Contents/utils';

describe('stackCacheMap', () => {
	it(`name=string`, () => {
		const cache = NotionCacheObject.createDefaultCache(),
			stack: IOperation[] = [],
			data = { id: 'data_id', type: 'page', data: 'data' } as any;
		stackCacheMap<IPage>(data, {
			cache,
			stack
		});

		expect(stack).toStrictEqual([ o.b.u('data_id', [], data) ]);
		expect(cache.block.get('data_id')).toStrictEqual(data);
	});
});
