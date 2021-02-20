import { ICache } from '@nishans/cache';
import { IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../utils';
import { last_edited_props } from '../../lastEditedProps';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('ChildTraverser.update', () => {
	describe('args=[ids]', () => {
		it(`manual=false,child_ids=[ids]`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				stack: IOperation[] = [];
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
					],
					[
						'child_three_id',
						{
							id: 'child_three_id'
						}
					]
				])
			} as any;

			const logger_spy = jest.fn(),
				cb_spy = jest.fn();

			const updated_data = await ChildTraverser.update<IPage, TBlock, TBlock>(
				[ [ 'child_one_id', { content: 'child1' } as any ], [ 'child_two_id', { content: 'child2' } as any ] ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_root_1',
					logger: logger_spy
				},
				(id, data, update_data, container) => {
					cb_spy(id, data, update_data);
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(logger_spy).toHaveBeenCalledTimes(2);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE', 'block', 'child_one_id');
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE', 'block', 'child_two_id');

			expect(cb_spy).toHaveBeenCalledTimes(2);
			expect(cb_spy).toHaveBeenNthCalledWith(
				1,
				'child_one_id',
				{
					id: 'child_one_id',
					content: 'child1',
					...last_edited_props
				},
				{
					content: 'child1'
				}
			);
			expect(cb_spy).toHaveBeenNthCalledWith(
				2,
				'child_two_id',
				{
					id: 'child_two_id',
					content: 'child2',
					...last_edited_props
				},
				{
					content: 'child2'
				}
			);

			expect(parent_data).toStrictEqual({
				content: child_ids,
				id: 'parent_one_id',
				...last_edited_props
			});

			expect(updated_data).toStrictEqual([
				{
					id: 'child_one_id',
					content: 'child1',
					...last_edited_props
				},
				{
					id: 'child_two_id',
					content: 'child2',
					...last_edited_props
				}
			]);

			expect(stack).toStrictEqual([
				{
					command: 'update',
					table: 'block',
					id: 'child_one_id',
					path: [],
					args: {
						content: 'child1',
						...last_edited_props
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						content: 'child2',
						...last_edited_props
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'parent_one_id',
					path: [],
					args: last_edited_props
				}
			]);
		});

		it(`manual=false,child_ids=string`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				stack: IOperation[] = [];
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
					],
					[
						'child_three_id',
						{
							id: 'child_three_id'
						}
					]
				])
			} as any;

			const updated_data = await ChildTraverser.update<IPage, TBlock, TBlock>(
				[ [ 'child_one_id', { content: 'child1' } as any ], [ 'child_two_id', { content: 'child2' } as any ] ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_root_1'
				},
				(id, data, update_data, container) => {
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toStrictEqual({
				content: child_ids,
				id: 'parent_one_id',
				...last_edited_props
			});

			expect(updated_data).toStrictEqual([
				{
					id: 'child_one_id',
					content: 'child1',
					...last_edited_props
				},
				{
					id: 'child_two_id',
					content: 'child2',
					...last_edited_props
				}
			]);

			expect(stack).toStrictEqual([
				{
					command: 'update',
					table: 'block',
					id: 'child_one_id',
					path: [],
					args: {
						content: 'child1',
						...last_edited_props
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						content: 'child2',
						...last_edited_props
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'parent_one_id',
					path: [],
					args: last_edited_props
				}
			]);
		});

		it(`manual=true,child_ids=string`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				stack: IOperation[] = [];
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
					],
					[
						'child_three_id',
						{
							id: 'child_three_id'
						}
					]
				])
			} as any;

			const updated_data = await ChildTraverser.update<IPage, TBlock, TBlock>(
				[ [ 'child_one_id', { content: 'child1' } as any ], [ 'child_two_id', { content: 'child2' } as any ] ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_root_1',
					manual: true
				},
				(id, data, update_data, container) => {
					data.alive = false;
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toStrictEqual({
				content: child_ids,
				id: 'parent_one_id',
				...last_edited_props
			});

			expect(updated_data).toStrictEqual([
				{
					id: 'child_one_id',
					alive: false
				},
				{
					id: 'child_two_id',
					alive: false
				}
			]);

			expect(stack).toStrictEqual([
				{
					command: 'update',
					table: 'block',
					id: 'parent_one_id',
					path: [],
					args: last_edited_props
				}
			]);
		});
	});
});
