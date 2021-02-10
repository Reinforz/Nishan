import { ICache } from '@nishans/endpoints';
import { IPage, ISpace, ISpaceView, IUserRoot, TBlock, TPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { createPageMap, iterateAndGetChildren, ITPage } from '../../src';
import { nishan, TEST_DATA } from '../constants';
import data from '../data';
import colors from 'colors';

const { cache } = nishan;

describe('iterateAndGetChildren', () => {
	describe('Works correctly', () => {
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
});
