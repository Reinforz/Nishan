import { NotionCache } from '@nishans/cache';
import { IPage } from '@nishans/types';
import { default_nishan_arg, o } from '../../../../../core/tests/utils';
import { executeOperationAndStoreInCache } from '../../../../libs/CreateData/Contents/utils';

it(`name=string`, async () => {
	const cache = NotionCache.createDefaultCache(),
		data = { id: 'data_id', type: 'page', data: 'data' } as any,
		cb = jest.fn();

	const operation = await executeOperationAndStoreInCache<IPage>(
		data,
		{
			...default_nishan_arg,
			cache
		},
		cb
	);

	expect(operation).toStrictEqual(o.b.u('data_id', [], data));
	expect(cache.block.get('data_id')).toStrictEqual(data);
	expect(cb).toHaveBeenCalledWith(data);
});
