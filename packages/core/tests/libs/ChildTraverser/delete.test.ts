import { ICache } from '@nishans/cache';
import { IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { last_edited_props } from '../../utils/lastEditedProps';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('ChildTraverser.delete', () => {
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
							type: 'page',
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

			const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_path: 'content',
					stack,
					user_id: 'user_root_1',
					logger: logger_spy
				},
				(id, data, container) => {
					cb_spy(id, data);
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(logger_spy).toHaveBeenCalledTimes(2);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'DELETE', 'block', 'child_one_id');
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'DELETE', 'block', 'child_two_id');

			expect(cb_spy).toHaveBeenCalledTimes(2);
			expect(cb_spy).toHaveBeenNthCalledWith(1, 'child_one_id', {
				id: 'child_one_id',
				alive: false,
				...last_edited_props
			});
			expect(cb_spy).toHaveBeenNthCalledWith(2, 'child_two_id', {
				id: 'child_two_id',
				alive: false,
				...last_edited_props
			});

			expect(parent_data).toStrictEqual({
				id: 'parent_one_id',
				type: 'page',
				content: [ 'child_three_id' ],
				...last_edited_props
			});

			expect(deleted_data).toStrictEqual([
				{
					id: 'child_one_id',
					alive: false,
					...last_edited_props
				},
				{
					id: 'child_two_id',
					alive: false,
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
						alive: false,
						...last_edited_props
					}
				},
				{
					command: 'listRemove',
					table: 'block',
					id: 'parent_one_id',
					path: [ 'content' ],
					args: {
						id: 'child_one_id'
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						alive: false,
						...last_edited_props
					}
				},
				{
					command: 'listRemove',
					table: 'block',
					id: 'parent_one_id',
					path: [ 'content' ],
					args: {
						id: 'child_two_id'
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

			const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_path: 'content',
					stack,
					user_id: 'user_root_1'
				},
				(id, data, container) => {
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toStrictEqual({
				id: 'parent_one_id',
				content: [ 'child_three_id' ],
				...last_edited_props
			});

			expect(deleted_data).toStrictEqual([
				{
					id: 'child_one_id',
					alive: false,
					...last_edited_props
				},
				{
					id: 'child_two_id',
					alive: false,
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
						alive: false,
						...last_edited_props
					}
				},
				{
					command: 'listRemove',
					table: 'block',
					id: 'parent_one_id',
					path: [ 'content' ],
					args: {
						id: 'child_one_id'
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						alive: false,
						...last_edited_props
					}
				},
				{
					command: 'listRemove',
					table: 'block',
					id: 'parent_one_id',
					path: [ 'content' ],
					args: {
						id: 'child_two_id'
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

			const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_path: 'content',
					stack,
					manual: true,
					user_id: 'user_root_1'
				},
				(id, data, container) => {
					data.alive = false;
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toStrictEqual({
				id: 'parent_one_id',
				content: [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				...last_edited_props
			});

			expect(deleted_data).toStrictEqual([
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

		it(`manual=false,child_path=undefined`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ],
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
					]
				])
			} as any;
			const deleted_data = await ChildTraverser.delete<IPage, TBlock>(
				[ 'child_one_id' ],
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
				} as any,
				(_, data, container) => container.push(data)
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data as any).toStrictEqual({
				id: 'parent_one_id',
				content: [ 'child_one_id', 'child_two_id' ],
				...last_edited_props
			});

			expect(deleted_data as any).toStrictEqual([
				{
					id: 'child_one_id',
					alive: false,
					...last_edited_props
				}
			]);

			expect(stack).toStrictEqual([
				{
					args: {
						alive: false,
						...last_edited_props
					},
					command: 'update',
					id: 'child_one_id',
					path: [],
					table: 'block'
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

		it(`manual=true,child_ids=string,content=undefined`, async () => {
			const stack: IOperation[] = [];
			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id'
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

			await ChildTraverser.delete<IPage, TBlock>([ 'child_one_id' ], (id) => cache.block.get(id), {
				container: [],
				cache,
				child_ids: 'content',
				child_type: 'block',
				parent_id: 'parent_one_id',
				parent_type: 'block',
				stack,
				user_id: 'user_root_1'
			} as any);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data as any).toStrictEqual({
				id: 'parent_one_id',
				...last_edited_props
			});

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
