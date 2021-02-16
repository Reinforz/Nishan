import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import deepEqual from 'deep-equal';
import { NotionData, SpaceView } from '../../src';
import { createDefaultCache } from '../../utils/createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, () => {
	const cache: ICache = {
			...createDefaultCache(),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ]),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ])
		},
		stack: IOperation[] = [];

	const space_view = new SpaceView({
		cache,
		id: 'space_view_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const parent_data = space_view.getCachedParentData();
	expect(deepEqual(parent_data, { space_views: [ 'space_view_1' ] })).toBe(true);
});

it(`reposition`, () => {
	const cache: ICache = {
			...createDefaultCache(),
			space_view: new Map([
				[
					'space_view_1',
					{
						bookmarked_pages: [ 'block_1' ]
					} as any
				]
			]),
			user_root: new Map([ [ 'user_root_1', { id: 'user_root_1', space_views: [ 'space_view_1' ] } as any ] ])
		},
		stack: IOperation[] = [];

	const space_view = new SpaceView({
		cache,
		id: 'space_view_2',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});
	const addToChildArrayMock = jest.spyOn(NotionData.prototype, 'addToChildArray' as any);

	space_view.reposition(0);
	expect(addToChildArrayMock).toHaveBeenCalledTimes(1);
	expect(addToChildArrayMock).toHaveBeenCalledWith(
		'user_root',
		{
			id: 'user_root_1',
			space_views: [ 'space_view_2', 'space_view_1' ]
		},
		0
	);
});

it(`update`, () => {
	const cache = createDefaultCache(),
		stack: IOperation[] = [];

	const space_view = new SpaceView({
		cache,
		id: 'space_view_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest.spyOn(NotionData.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
		return {} as any;
	});

	space_view.update({
		joined: false
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			joined: false
		},
		[ 'notify_desktop', 'notify_email', 'notify_mobile', 'joined', 'created_getting_started' ]
	);
});

it(`getSpace`, () => {
	const cache: ICache = {
			...createDefaultCache(),
			space_view: new Map([ [ 'space_view_1', { id: 'space_view_1', space_id: 'space_1' } as any ] ]),
			space: new Map([ [ 'space_2', { id: 'space_2' } as any ], [ 'space_1', { id: 'space_1' } as any ] ])
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space_view = new SpaceView({
		cache,
		logger: logger_spy,
		id: 'space_view_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const space = space_view.getSpace();
	expect(logger_spy).toHaveBeenCalledTimes(1);
	expect(logger_spy).toHaveBeenCalledWith('READ', 'space', 'space_1');
	expect(deepEqual(space.getCachedData(), { id: 'space_1' })).toBe(true);
});

it(`getBookmarkedPage`, async () => {
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([
				[
					'block_1',
					{ id: 'block_1', type: 'collection_view_page', collection_id: 'collection_1', view_ids: [] } as any
				]
			]),
			collection: new Map([ [ 'collection_1', { name: [ [ 'Collection One' ] ] } as any ] ]),
			space_view: new Map([ [ 'space_view_1', { id: 'space_view_1', bookmarked_pages: [ 'block_1' ] } as any ] ])
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space_view = new SpaceView({
		cache,
		logger: logger_spy,
		id: 'space_view_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const page_map = await space_view.getBookmarkedPage('block_1');
	expect(page_map.collection_view_page.get('Collection One')).not.toBeUndefined();
});

it(`updateBookmarkedPages`, async () => {
	const space_view_1 = { id: 'space_view_1', bookmarked_pages: [ 'block_1' ] },
		cache: ICache = {
			...createDefaultCache(),
			block: new Map([
				[ 'block_1', { type: 'page', id: 'block_1', properties: { title: [ [ 'Block One' ] ] } } as any ],
				[ 'block_2', { type: 'page', id: 'block_2', properties: { title: [ [ 'Block Two' ] ] } } as any ]
			]),
			space_view: new Map([ [ 'space_view_1', space_view_1 as any ] ])
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space_view = new SpaceView({
		cache,
		logger: logger_spy,
		id: 'space_view_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const page_map = await space_view.updateBookmarkedPages([ [ 'block_1', false ], [ 'block_2', true ] ]);

	expect(page_map.page.get('Block One')).not.toBeUndefined();
	expect(page_map.page.get('block_2')).not.toBeUndefined();

	expect(space_view_1).toMatchSnapshot({
		bookmarked_pages: [ 'block_2' ],
		id: 'space_view_1',
		last_edited_time: expect.any(Number),
		last_edited_by_table: 'notion_user',
		last_edited_by_id: 'user_root_1'
	});

	expect(stack.length).toBe(3);

	await space_view.updateBookmarkedPage([ 'block_1', false ]);
});
