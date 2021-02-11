import { ICache } from '@nishans/endpoints';
import { IOperation, IPage, ISpace, TBlock, TPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { iterateAndDeleteChildren, iterateAndGetChildren } from '../../src';
import colors from 'colors';

describe.skip('iterateAndGetChildren', () => {
	describe('Array of ids', () => {
		it('Multiple false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache,
					multiple: false,
					logger (method, child_type, id) {
						expect(method).toBe('READ');
						expect(child_type).toBe('block');
						expect(id).toBe('child_one_id');
					}
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					}
				])
			);
		});

		it('Return container item', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					},
					{
						id: 'child_two_id'
					}
				])
			);
		});

		it('Works for string child_id path', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<IPage, TBlock, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TBlock,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids: 'content',
					container: [],
					cache
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					},
					{
						id: 'child_two_id'
					}
				])
			);
		});

		it('Shows warning if child doesnt exist in the cache', async () => {
			const child_ids = [ 'child_one_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
						}
					]
				])
			} as any;

			const console_log_spy = jest.spyOn(console, 'log');

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id does not exist in the cache')
			);
			expect(deepEqual(container, [])).toBe(true);
			console_log_spy.mockClear();
		});

		it('Shows warning if child_id is not present in child_ids', async () => {
			const child_ids = [ 'child_one_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
						}
					],
					[
						'child_one_id',
						{
							id: 'child_one_id'
						}
					]
				])
			} as any;

			const console_log_spy = jest.spyOn(console, 'log');
			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				child_ids,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids: [],
					container: [],
					cache
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id is not a child of block:parent_one_id')
			);
			expect(deepEqual(container, [])).toBe(true);
			console_log_spy.mockClear();
		});
	});

	describe('Callbacks', () => {
		it('Multiple false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				() => true,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache,
					multiple: false
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					}
				])
			);
		});

		it('Return container item', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				() => true,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					},
					{
						id: 'child_two_id'
					}
				])
			);
		});

		it('Shows warning if child doesnt exist in the cache', async () => {
			const child_ids = [ 'child_one_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
						}
					]
				])
			} as any;

			const console_log_spy = jest.spyOn(console, 'log');

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				() => true,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id does not exist in the cache')
			);
			expect(deepEqual(container, [])).toBe(true);
			console_log_spy.mockClear();
		});

		it('undefined args', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				undefined,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache,
					multiple: false
				},
				(_, data, container) => container.push(data)
			);

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					}
				])
			);
		});

		it('false args', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ];

			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							contents: child_ids
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

			const container = await iterateAndGetChildren<ISpace, TPage, TBlock[]>(
				() => false,
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids,
					container: [],
					cache,
					multiple: false
				},
				(_, data, container) => container.push(data)
			);

			expect(deepEqual(container, []));
		});
	});
});

describe('iterateAndDeleteChildren', () => {
	describe('Array of ids', () => {
		function constructCache (): ICache {
			return {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							content: [ 'child_one_id', 'child_two_id', 'child_three_id' ]
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
		}

		function checker (parent_data: IPage, deleted_data: TBlock[], stack: IOperation[]) {
			expect(deepEqual(parent_data.content, [ 'child_three_id' ])).toBe(true);
			expect(parent_data.last_edited_time).toBeLessThanOrEqual(Date.now());
			expect(parent_data.last_edited_by_table).toBe('notion_user');
			expect(parent_data.last_edited_by_id).toBe('user_id');

			expect(
				deepEqual(deleted_data, [
					{
						id: 'child_one_id',
						alive: false,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id'
					},
					{
						id: 'child_two_id',
						alive: false,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id'
					}
				])
			).toBe(true);

			expect(
				deepEqual(
					[
						{
							command: 'listRemove',
							table: 'block',
							id: 'parent_one_id',
							path: [ 'contents' ],
							args: {
								id: 'child_one_id'
							}
						},
						{
							command: 'listRemove',
							table: 'block',
							id: 'parent_one_id',
							path: [ 'contents' ],
							args: {
								id: 'child_two_id'
							}
						},
						{
							command: 'update',
							table: 'block',
							id: 'parent_one_id',
							path: [],
							args: {
								last_edited_by_table: 'notion_user',
								last_edited_by_id: 'user_id'
							}
						}
					],
					stack
				)
			).toBe(true);
		}

		it(`Array child_ids`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				stack: IOperation[] = [];
			const cache = constructCache();

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					cache,
					child_ids,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id',
					child_path: 'content',
					logger: (method, child_type, child_id) => {
						expect(method).toBe('DELETE');
						expect(child_type).toBe('block');
						expect(child_id).toBeTruthy();
					}
				},
				(id, data) => {
					expect(id).toBeTruthy();
					expect(data).toBeTruthy();
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;
			// checker(parent_data, deleted_data, stack);
		});

		it(`String child_ids`, async () => {
			const stack: IOperation[] = [];
			const cache = constructCache();

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					cache,
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id',
					child_path: 'content'
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;
			checker(parent_data, deleted_data, stack);
		});

		it(`Multiple false`, async () => {
			const stack: IOperation[] = [];
			const cache = constructCache();

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					cache,
					child_ids: 'content',
					multiple: false,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id',
					child_path: 'content'
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;
			expect(deepEqual(parent_data.content, [ 'child_two_id', 'child_three_id' ])).toBe(true);

			expect(
				deepEqual(deleted_data, [
					{
						id: 'child_one_id',
						alive: false,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id'
					}
				])
			).toBe(true);

			expect(
				deepEqual(stack, [
					{
						command: 'listRemove',
						table: 'block',
						id: 'parent_one_id',
						path: [ 'contents' ],
						args: {
							id: 'child_one_id'
						}
					},
					{
						command: 'update',
						table: 'block',
						id: 'parent_one_id',
						path: [],
						args: {
							last_edited_by_table: 'notion_user',
							last_edited_by_id: 'user_id'
						}
					}
				])
			).toBe(true);
		});
	});
});
