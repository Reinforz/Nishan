import { ICache } from '@nishans/cache';
import { TPage } from '@nishans/types';
import colors from 'colors';
import { iterateChildren } from '../../../../libs/ChildTraverser/utils';

afterEach(() => {
	jest.restoreAllMocks();
});

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
