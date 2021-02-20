import { ICache } from '@nishans/cache';
import { IPage, ISpace, TBlock, TPage } from '@nishans/types';
import { ChildTraverser } from '../../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('ChildTraverser.get', () => {
	describe('args=[ids]', () => {
		it('child_ids=array', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							content: child_ids
						}
					],
					[
						'child_one_id',
						{
							id: 'child_one_id'
						}
					],
					[
						'child_two_id',
						{
							id: 'child_two_id'
						}
					]
				])
			} as any;

			const logger = jest.fn(),
				cb_spy = jest.fn();
			const container = await ChildTraverser.get<ISpace, TPage, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache,
					logger
				},
				(id, data, container) => {
					cb_spy(id, data);
					container.push(data);
				}
			);

			expect(cb_spy).toHaveBeenCalledTimes(2);
			expect(cb_spy).toHaveBeenNthCalledWith(1, 'child_one_id', {
				id: 'child_one_id'
			});
			expect(cb_spy).toHaveBeenNthCalledWith(2, 'child_two_id', {
				id: 'child_two_id'
			});
			expect(logger).toHaveBeenCalledTimes(2);
			expect(logger).toHaveBeenNthCalledWith(1, 'READ', 'block', 'child_one_id');
			expect(logger).toHaveBeenNthCalledWith(2, 'READ', 'block', 'child_two_id');
			expect(container).toStrictEqual([
				{
					id: 'child_one_id'
				},
				{
					id: 'child_two_id'
				}
			]);
		});

		it('child_ids=string', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							content: child_ids
						}
					],
					[
						'child_one_id',
						{
							id: 'child_one_id'
						}
					],
					[
						'child_two_id',
						{
							id: 'child_two_id'
						}
					]
				])
			} as any;

			const container = await ChildTraverser.get<IPage, IPage, IPage[]>(
				child_ids,
				(id) => cache.block.get(id) as IPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids: 'content',
					container: [],
					cache
				},
				(id, data, container) => {
					container.push(data);
				}
			);

			expect(container).toStrictEqual([
				{
					id: 'child_one_id'
				},
				{
					id: 'child_two_id'
				}
			]);
		});
	});
});
