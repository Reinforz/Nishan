import { NotionLogger } from '@nishans/logger';
import { INotionCache, TPage } from '@nishans/types';
import { iterateChildren } from '../../libs/utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('method=UPDATE', () => {
	describe('args=[[id, {}]]', () => {
		it('multiple=false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_one_id does not exist in the cache');
		});

		it('multiple=true', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(4);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_three_id does not exist in the cache');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(2, 'block:child_four_id is not a child of block:parent_one_id');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(3, 'block:child_five_id does not exist in the cache');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(4, 'block:child_five_id is not a child of block:parent_one_id');
		});
	});

	describe('args=cb', () => {
		it('multiple=false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_one_id does not exist in the cache');
		});

		it('multiple=true', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id', 'child_five_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_three_id does not exist in the cache');
		});
	});
});

describe('method=READ | DELETE', () => {
	describe('args=[[id, {}]]', () => {
		it('multiple=false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_one_id does not exist in the cache');
		});

		it('multiple=true', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(4);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_three_id does not exist in the cache');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(2, 'block:child_four_id is not a child of block:parent_one_id');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(3, 'block:child_five_id does not exist in the cache');
			expect(methodLoggerMock).toHaveBeenNthCalledWith(4, 'block:child_five_id is not a child of block:parent_one_id');
		});
	});

	describe('args=cb', () => {
		it('multiple=false', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_one_id does not exist in the cache');
		});

		it('multiple=true', async () => {
			const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id', 'child_five_id' ];

			const cache: INotionCache = {
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
			const methodLoggerMock = jest.spyOn(NotionLogger.method, 'warn').mockImplementation(() => undefined as any);

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

			expect(methodLoggerMock).toHaveBeenCalledTimes(1);
			expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'block:child_three_id does not exist in the cache');
		});
	});
});
