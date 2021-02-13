import { ICache } from '@nishans/endpoints';
import { IOperation, IPage, ISpace, TBlock, TPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { iterateAndDeleteChildren, iterateAndGetChildren, iterateAndUpdateChildren, iterateChildren } from '../../src';
import colors from 'colors';

describe('iterateChildren', () => {
	describe('method=UPDATE', () => {
		describe('args=[[id, {}]]', () => {
			it('multiple=false', async () => {
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

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'UPDATE',
						args: [
							[ 'child_one_id', { content: 'content1' } ],
							[ 'child_two_id', { content: 'content2' } ],
							[ 'child_three_id', { content: 'content3' } ]
						],
						cb: (id, prev_data, new_data) => spyfn(id, prev_data, new_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						multiple: false,
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(1);
				expect(spyfn).toHaveBeenNthCalledWith(
					1,
					'child_two_id',
					{
						id: 'child_two_id'
					},
					{ content: 'content2' }
				);

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_one_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});

			it('multiple=true', async () => {
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
						],
						[
							'child_four_id',
							{
								id: 'child_four_id'
							}
						]
					])
				} as any;

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'UPDATE',
						args: [
							[ 'child_one_id', { content: 'content1' } ],
							[ 'child_two_id', { content: 'content2' } ],
							[ 'child_three_id', { content: 'content3' } ],
							[ 'child_four_id', { content: 'content4' } ],
							[ 'child_five_id', { content: 'content5' } ]
						],
						cb: (id, prev_data, new_data) => spyfn(id, prev_data, new_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(2);
				expect(spyfn).toHaveBeenNthCalledWith(
					1,
					'child_one_id',
					{
						id: 'child_one_id'
					},
					{ content: 'content1' }
				);

				expect(spyfn).toHaveBeenNthCalledWith(
					2,
					'child_two_id',
					{
						id: 'child_two_id'
					},
					{ content: 'content2' }
				);

				expect(console_log_spy).toHaveBeenCalledTimes(4);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_three_id does not exist in the cache')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					2,
					colors.yellow.bold('block:child_four_id is not a child of block:parent_one_id')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					3,
					colors.yellow.bold('block:child_five_id does not exist in the cache')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					4,
					colors.yellow.bold('block:child_five_id is not a child of block:parent_one_id')
				);
				console_log_spy.mockClear();
			});
		});

		describe('args=cb', () => {
			it('multiple=false', async () => {
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

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'UPDATE',
						args: (page) => {
							switch (page.id) {
								case 'child_one_id':
									return { content: 'content1' };
								case 'child_two_id':
									return { content: 'content2' };
								case 'child_three_id':
									return { content: 'content3' };
							}
						},
						cb: (id, prev_data, new_data) => spyfn(id, prev_data, new_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						multiple: false,
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(1);
				expect(spyfn).toHaveBeenNthCalledWith(
					1,
					'child_two_id',
					{
						id: 'child_two_id'
					},
					{ content: 'content2' }
				);

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_one_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});

			it('multiple=true', async () => {
				const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id', 'child_five_id' ];

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
							'child_four_id',
							{
								id: 'child_four_id'
							}
						],
						[
							'child_five_id',
							{
								id: 'child_five_id'
							}
						]
					])
				} as any;

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'UPDATE',
						args: (page) => {
							switch (page.id) {
								case 'child_one_id':
									return { content: 'content1' };
								case 'child_two_id':
									return { content: 'content2' };
								case 'child_three_id':
									return { content: 'content3' };
								case 'child_four_id':
									return { content: 'content4' };
								case 'child_five_id':
									return false;
							}
						},
						cb: (id, prev_data, new_data) => spyfn(id, prev_data, new_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(2);
				expect(spyfn).toHaveBeenNthCalledWith(
					1,
					'child_one_id',
					{
						id: 'child_one_id'
					},
					{ content: 'content1' }
				);

				expect(spyfn).toHaveBeenNthCalledWith(
					2,
					'child_two_id',
					{
						id: 'child_two_id'
					},
					{ content: 'content2' }
				);

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_three_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});
		});
	});

	describe('method=READ | DELETE', () => {
		describe('args=[[id, {}]]', () => {
			it('multiple=false', async () => {
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

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'READ',
						args: [ 'child_one_id', 'child_two_id', 'child_three_id' ],
						cb: (id, current_data) => spyfn(id, current_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						multiple: false,
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(1);
				expect(spyfn).toHaveBeenNthCalledWith(1, 'child_two_id', {
					id: 'child_two_id'
				});

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_one_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});

			it('multiple=true', async () => {
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
						],
						[
							'child_four_id',
							{
								id: 'child_four_id'
							}
						]
					])
				} as any;

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'READ',
						args: [ 'child_one_id', 'child_two_id', 'child_three_id', 'child_four_id', 'child_five_id' ],
						cb: (id, prev_data) => spyfn(id, prev_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(2);
				expect(spyfn).toHaveBeenNthCalledWith(1, 'child_one_id', {
					id: 'child_one_id'
				});

				expect(spyfn).toHaveBeenNthCalledWith(2, 'child_two_id', {
					id: 'child_two_id'
				});

				expect(console_log_spy).toHaveBeenCalledTimes(4);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_three_id does not exist in the cache')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					2,
					colors.yellow.bold('block:child_four_id is not a child of block:parent_one_id')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					3,
					colors.yellow.bold('block:child_five_id does not exist in the cache')
				);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					4,
					colors.yellow.bold('block:child_five_id is not a child of block:parent_one_id')
				);
				console_log_spy.mockClear();
			});
		});

		describe('args=cb', () => {
			it('multiple=false', async () => {
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

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'READ',
						args: (page) => {
							switch (page.id) {
								case 'child_one_id':
									return true;
								case 'child_two_id':
									return true;
								case 'child_three_id':
									return true;
							}
						},
						cb: (id, prev_data) => spyfn(id, prev_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						multiple: false,
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(1);
				expect(spyfn).toHaveBeenNthCalledWith(1, 'child_two_id', {
					id: 'child_two_id'
				});

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_one_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});

			it('multiple=true', async () => {
				const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id', 'child_five_id' ];

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
							'child_four_id',
							{
								id: 'child_four_id'
							}
						],
						[
							'child_five_id',
							{
								id: 'child_five_id'
							}
						]
					])
				} as any;

				const spyfn = jest.fn();
				const console_log_spy = jest.spyOn(console, 'log');

				await iterateChildren<TPage>(
					{
						method: 'READ',
						args: (page) => {
							switch (page.id) {
								case 'child_one_id':
									return true;
								case 'child_two_id':
									return true;
								case 'child_three_id':
									return true;
								case 'child_four_id':
									return true;
								case 'child_five_id':
									return false;
							}
						},
						cb: (id, prev_data) => spyfn(id, prev_data)
					},
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: 'parent_one_id',
						parent_type: 'block',
						child_type: 'block',
						child_ids
					}
				);

				expect(spyfn).toHaveBeenCalledTimes(2);
				expect(spyfn).toHaveBeenNthCalledWith(1, 'child_one_id', {
					id: 'child_one_id'
				});

				expect(spyfn).toHaveBeenNthCalledWith(2, 'child_two_id', {
					id: 'child_two_id'
				});

				expect(console_log_spy).toHaveBeenCalledTimes(1);
				expect(console_log_spy).toHaveBeenNthCalledWith(
					1,
					colors.yellow.bold('block:child_three_id does not exist in the cache')
				);
				console_log_spy.mockClear();
			});
		});
	});
});

describe('iterateAndGetChildren', () => {
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
			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					},
					{
						id: 'child_two_id'
					}
				])
			).toBe(true);
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

			const container = await iterateAndGetChildren<IPage, IPage, IPage[]>(
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

			expect(
				deepEqual(container, [
					{
						id: 'child_one_id'
					},
					{
						id: 'child_two_id'
					}
				])
			).toBe(true);
		});
	});
});

describe('iterateAndDeleteChildren', () => {
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
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number)
			});
			expect(cb_spy).toHaveBeenNthCalledWith(2, 'child_two_id', {
				id: 'child_two_id',
				alive: false,
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number)
			});

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

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
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
					user_id: 'user_id'
				},
				(id, data, container) => {
					container.push(data);
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

			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
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
					user_id: 'user_id'
				},
				(id, data, container) => {
					data.alive = false;
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toMatchSnapshot({
				content: [ 'child_one_id', 'child_two_id', 'child_three_id' ],
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(deleted_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false
				},
				{
					id: 'child_two_id',
					alive: false
				}
			]);

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
			const deleted_data = await iterateAndDeleteChildren<IPage, TBlock>(
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
					user_id: 'user_id'
				} as any,
				(_, data, container) => container.push(data)
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

			await iterateAndDeleteChildren<IPage, TBlock>([ 'child_one_id' ], (id) => cache.block.get(id), {
				container: [],
				cache,
				child_ids: 'content',
				child_type: 'block',
				parent_id: 'parent_one_id',
				parent_type: 'block',
				stack,
				user_id: 'user_id'
			} as any);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data as any).toMatchSnapshot({
				id: 'parent_one_id',
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_id',
				last_edited_time: expect.any(Number)
			});

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
	});
});

describe('iterateAndUpdateChildren', () => {
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

			const updated_data = await iterateAndUpdateChildren<IPage, TBlock, TBlock>(
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
					user_id: 'user_id',
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
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
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
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				},
				{
					content: 'child2'
				}
			);

			expect(parent_data).toMatchSnapshot({
				content: child_ids,
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(updated_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					content: 'child1',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				},
				{
					id: 'child_two_id',
					content: 'child2',
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
						content: 'child1',
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						content: 'child2',
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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

			const updated_data = await iterateAndUpdateChildren<IPage, TBlock, TBlock>(
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
					user_id: 'user_id'
				},
				(id, data, update_data, container) => {
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toMatchSnapshot({
				content: child_ids,
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(updated_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					content: 'child1',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'user_id',
					last_edited_time: expect.any(Number)
				},
				{
					id: 'child_two_id',
					content: 'child2',
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
						content: 'child1',
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
					}
				},
				{
					command: 'update',
					table: 'block',
					id: 'child_two_id',
					path: [],
					args: {
						content: 'child2',
						last_edited_by_table: 'notion_user',
						last_edited_by_id: 'user_id',
						last_edited_time: expect.any(Number)
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

			const updated_data = await iterateAndUpdateChildren<IPage, TBlock, TBlock>(
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
					user_id: 'user_id',
					manual: true
				},
				(id, data, update_data, container) => {
					data.alive = false;
					container.push(data);
				}
			);
			const parent_data = cache.block.get('parent_one_id') as IPage;

			expect(parent_data).toMatchSnapshot({
				content: child_ids,
				last_edited_by_id: 'user_id',
				last_edited_by_table: 'notion_user',
				last_edited_time: expect.any(Number)
			});

			expect(updated_data).toMatchSnapshot([
				{
					id: 'child_one_id',
					alive: false
				},
				{
					id: 'child_two_id',
					alive: false
				}
			]);

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
	});
});
