import { ICache } from '@nishans/cache';
import { Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { Space, TSpaceUpdateKeys } from '../src';
import Data from '../src/Data';

it(`getSpaceView`, async () => {
	const cache: ICache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map([
				[ 'space_view_2', { alive: true, space_id: 'space_2', id: 'space_view_2' } as any ],
				[ 'space_view_1', { alive: true, space_id: 'space_1', id: 'space_view_1' } as any ]
			]),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];
	const logger_spy = jest.fn();
	const space = new Space({
		cache,
		id: 'space_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const space_view = space.getSpaceView();
	expect(logger_spy).toHaveBeenCalledWith('READ', 'space_view', 'space_view_1');
	expect(space_view.getCachedData()).toStrictEqual({
		alive: true,
		space_id: 'space_1',
		id: 'space_view_1'
	});
});

it(`update`, () => {
	const cache: ICache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest.spyOn(Data.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
		return {} as any;
	});

	space.update({
		beta_enabled: false
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			beta_enabled: false
		},
		TSpaceUpdateKeys
	);
});

it(`delete`, async () => {
	const cache: ICache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const enqueueTaskMock = jest.spyOn(Mutations, 'enqueueTask').mockImplementationOnce(() => {
		return {} as any;
	});

	await space.delete();

	expect(logger_spy).toHaveBeenCalledWith('DELETE', 'space', 'space_1');

	expect(enqueueTaskMock).toHaveBeenCalledTimes(1);
	expect(enqueueTaskMock).toHaveBeenCalledWith(
		{
			task: {
				eventName: 'deleteSpace',
				request: {
					spaceId: 'space_1'
				}
			}
		},
		{
			token: 'token',
			interval: 0
		}
	);
});

it(`createRootPages`, async () => {
	const block_id = v4();
	const cache: ICache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ]),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const block_map = await space.createRootPages([
		{
			type: 'page',
			id: block_id,
			properties: {
				title: [ [ 'Page One' ] ]
			}
		}
	]);

	expect(block_map.page.get('Page One')).not.toBeUndefined();
	expect(cache.block.get(block_id)).not.toBeUndefined();
	expect(stack.length).toBe(2);
});

it(`getRootPage`, async () => {
	const cache: ICache = {
			block: new Map([
				[ 'block_1', { type: 'page', id: 'block_1', properties: { title: [ [ 'Block One' ] ] } } as any ],
				[
					'block_2',
					{ type: 'collection_view_page', id: 'block_2', collection_id: 'collection_1', view_ids: [] } as any
				]
			]),
			collection: new Map([ [ 'collection_1', { id: 'collection_1', name: [ [ 'Block Two' ] ] } as any ] ]),
			collection_view: new Map(),
			notion_user: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			space: new Map([
				[
					'space_1',
					{
						id: 'space_1',
						pages: [ 'block_1', 'block_2' ],
						permissions: [
							{
								role: 'editor',
								type: 'space_permission',
								user_id: 'user_root_1'
							}
						]
					} as any
				]
			]),
			space_view: new Map(),
			user_root: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const page_map_1 = await space.getRootPage('block_1');
	expect(page_map_1.page.get('Block One')?.getCachedData()).toStrictEqual({
		type: 'page',
		id: 'block_1',
		properties: { title: [ [ 'Block One' ] ] }
	});

	const page_map_2 = await space.getRootPage('block_2');

	expect(page_map_2.collection_view_page.get('Block Two')?.getCachedData()).toStrictEqual({
		type: 'collection_view_page',
		id: 'block_2',
		collection_id: 'collection_1',
		view_ids: [],
	});
});