import { ICache } from '@nishans/endpoints';
import { IOperation, IPage, ISpace, TBlock, TPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { iterateAndDeleteChildren, iterateAndGetChildren, iterateChildren } from '../../src';
import colors from 'colors';

describe('iterateChildren', () => {
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

			const container: string[] = [];
			await iterateChildren<TPage>(child_ids, (id) => container.push(id), (id) => cache.block.get(id) as TPage, {
				parent_id: 'parent_one_id',
				parent_type: 'block',
				child_type: 'block',
				child_ids,
				multiple: false
			});

			expect(deepEqual(container, [ 'child_one_id' ]));
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

			await iterateChildren<TPage>(
				child_ids,
				() => {
					return;
				},
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id does not exist in the cache')
			);
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
			await iterateChildren<TPage>(
				child_ids,
				() => {
					return;
				},
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids: []
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id is not a child of block:parent_one_id')
			);
			console_log_spy.mockClear();
		});
	});

	describe('Callback', () => {
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

			const container: string[] = [];
			await iterateChildren<TPage>(() => true, (id) => container.push(id), (id) => cache.block.get(id) as TPage, {
				parent_id: 'parent_one_id',
				parent_type: 'block',
				child_type: 'block',
				child_ids,
				multiple: false
			});

			expect(deepEqual(container, [ 'child_one_id' ]));
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

			await iterateChildren<TPage>(
				() => true,
				() => {
					return;
				},
				(id) => cache.block.get(id) as TPage,
				{
					parent_id: 'parent_one_id',
					parent_type: 'block',
					child_type: 'block',
					child_ids
				}
			);

			expect(console_log_spy).toHaveBeenCalledTimes(1);
			expect(console_log_spy).toHaveBeenCalledWith(
				colors.yellow.bold('block:child_one_id does not exist in the cache')
			);
			console_log_spy.mockClear();
		});
	});
});

describe('iterateAndGetChildren', () => {
	describe('Array of ids', () => {
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
					cache,
					logger () {
						return;
					}
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
	});

	describe('Callbacks', () => {
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
					child_ids,
					cache,
					child_type: 'block',
					container: []
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
		it(`Array child_ids`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ],
				stack: IOperation[] = [];
			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							type: 'page',
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

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
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
					user_id: 'user_id',
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

			expect(parent_data).toMatchSnapshot({
				content: [ 'child_three_id' ],
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(deleted_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false,
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				},
				{
					id: 'child_two_id',
					alive: false,
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				}
			]);

			expect(stack).toMatchSnapshot([
				{
					command: 'update',
					table: 'block',
					id: 'child_one_id',
					path: [],
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				}
			]);
		});

		it(`String child_ids`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				stack: IOperation[] = [];
			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							type: 'page',
							content: [ 'child_one_id', 'child_two_id' ]
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

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id' ],
				(id) => cache.block.get(id),
				{
					cache,
					container: [],
					child_path: 'content',
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id'
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;
			expect(parent_data).toMatchSnapshot({
				content: [ 'child_two_id' ],
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(deleted_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false,
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				}
			]);

			expect(stack).toMatchSnapshot([
				{
					command: 'update',
					table: 'block',
					id: 'child_one_id',
					path: [],
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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
					id: 'parent_one_id',
					path: [],
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				}
			]);
		});

		it(`Multiple false`, async () => {
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
			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id', 'child_two_id' ],
				(id) => cache.block.get(id),
				{
					container: [],
					child_path: 'content',
					cache,
					child_ids: 'content',
					multiple: false,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id'
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;
			expect(parent_data as any).toMatchSnapshot({
				id: 'parent_one_id',
				content: [ 'child_two_id', 'child_three_id' ],
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number)
			});
			expect(deleted_data as any).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false,
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				}
			]);
			expect(stack).toMatchSnapshot([
				{
					args: {
						alive: false,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					},
					command: 'update',
					id: 'child_one_id',
					path: [],
					table: 'block'
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
					id: 'parent_one_id',
					path: [],
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				}
			]);
		});

		it(`parent doesnt contain child`, async () => {
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
					]
				])
			} as any;
			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>([], (id) => cache.block.get(id), {
				cache,
				child_ids: 'content',
				multiple: false,
				child_type: 'block',
				parent_id: 'parent_one_id',
				parent_type: 'block',
				stack,
				user_id: 'user_id',
				container: [],
				child_path: 'content'
			});
			const parent_data = cache.block.get('parent_one_id') as IPage;
			expect(
				deepEqual(parent_data, {
					id: 'parent_one_id'
				})
			).toBe(true);
			expect(deepEqual(deleted_data, [])).toBe(true);
			expect(deepEqual(stack, [])).toBe(true);
		});

		it(`manual true`, async () => {
			const stack: IOperation[] = [];
			const cache: ICache = {
				block: new Map([
					[
						'parent_one_id',
						{
							id: 'parent_one_id',
							content: [ 'child_one_id' ]
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

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id' ],
				(id) => cache.block.get(id),
				{
					cache,
					container: [],
					child_ids: 'content',
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					manual: true,
					user_id: 'user_id'
				},
				(_, child_data) => (child_data.alive = false)
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data as any).toMatchSnapshot({
				id: 'parent_one_id',
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number),
				content: [ 'child_one_id' ]
			});

			expect(
				deepEqual(deleted_data, [
					{
						id: 'child_one_id',
						alive: false
					}
				])
			).toBe(true);

			expect(stack).toMatchSnapshot([
				{
					command: 'update',
					table: 'block',
					id: 'parent_one_id',
					path: [],
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				}
			]);
		});

		it(`manual false, child_path undefined`, async () => {
			const child_ids = [ 'child_one_id', 'child_two_id' ],
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
					]
				])
			} as any;
			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
				[ 'child_one_id' ],
				(id) => cache.block.get(id),
				{
					container: [],
					cache,
					child_ids: 'content',
					multiple: false,
					child_type: 'block',
					parent_id: 'parent_one_id',
					parent_type: 'block',
					stack,
					user_id: 'user_id'
				} as any
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data as any).toMatchSnapshot({
				id: 'parent_one_id',
				content: [ 'child_one_id', 'child_two_id' ],
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number)
			});

			expect(deleted_data as any).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false,
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				}
			]);

			expect(stack).toMatchSnapshot([
				{
					args: {
						alive: false,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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
					args: {
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				}
			]);
		});
	});
});
