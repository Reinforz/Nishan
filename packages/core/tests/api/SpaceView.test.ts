import { ICache, NotionCache } from '@nishans/cache';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { NotionData, SpaceView } from '../../libs';
import { default_nishan_arg, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, () => {
	const cache: ICache = {
		...NotionCache.createDefaultCache(),
		space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ]),
		user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ])
	};

	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_1'
	});

	const parent_data = space_view.getCachedParentData();
	expect(parent_data).toStrictEqual({ space_views: [ 'space_view_1' ] });
});

it(`reposition`, async () => {
	const cache: ICache = {
		...NotionCache.createDefaultCache(),
		space_view: new Map([
			[
				'space_view_1',
				{
					bookmarked_pages: [ 'block_1' ]
				} as any
			]
		]),
		user_root: new Map([ [ 'user_root_1', { id: 'user_root_1', space_views: [ 'space_view_1' ] } as any ] ])
	};

	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementationOnce(async () => undefined);

	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_2'
	});

	await space_view.reposition();
	expect(executeOperationsMock).toHaveBeenCalledTimes(1);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.ur.la(
			'user_root_1',
			[ 'space_views' ],
			expect.objectContaining({
				id: 'space_view_2'
			})
		)
	]);
});

it(`update`, async () => {
	const cache = NotionCache.createDefaultCache();
	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_1'
	});

	const updateCacheLocallyMock = jest
		.spyOn(NotionData.prototype, 'updateCacheLocally')
		.mockImplementationOnce(async () => undefined);

	await space_view.update({
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
		...NotionCache.createDefaultCache(),
		space_view: new Map([ [ 'space_view_1', { id: 'space_view_1', space_id: 'space_1' } as any ] ]),
		space: new Map([ [ 'space_2', { id: 'space_2' } as any ], [ 'space_1', { id: 'space_1' } as any ] ])
	};

	const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_1'
	});

	const space = space_view.getSpace();
	expect(methodLoggerMock).toHaveBeenCalledTimes(1);
	expect(methodLoggerMock).toHaveBeenCalledWith('READ space space_1');
	expect(space.getCachedData()).toStrictEqual({ id: 'space_1' });
});

it(`getBookmarkedPage`, async () => {
	const cache: ICache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[
				'block_1',
				{
					id: 'block_1',
					type: 'page',
					parent_table: 'space',
					parent_id: 'space_1',
					properties: {
						title: [ [ 'Page One' ] ]
					}
				} as any
			]
		]),
		space_view: new Map([
			[ 'space_view_1', { id: 'space_view_1', bookmarked_pages: [ 'block_1' ], space_id: 'space_1' } as any ]
		]),
		space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ])
	};
	const initializeCacheForSpecificDataMock = jest
		.spyOn(NotionCache, 'initializeCacheForSpecificData')
		.mockImplementation(async () => undefined);

	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_1',
		logger: false
	});

	const page_map = await space_view.getBookmarkedPage('block_1');

	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'space_view_1', 'space_view' ]);
	expect(page_map.page.get('Page One')).not.toBeUndefined();
});

it(`updateBookmarkedPages`, async () => {
	const space_view_1 = { id: 'space_view_1', bookmarked_pages: [ 'block_1' ], space_id: 'space_1' },
		cache: ICache = {
			...NotionCache.createDefaultCache(),
			block: new Map([
				[
					'block_1',
					{
						type: 'page',
						id: 'block_1',
						properties: { title: [ [ 'Block One' ] ] },
						parent_table: 'space',
						parent_id: 'space_1'
					} as any
				],
				[
					'block_2',
					{
						type: 'page',
						id: 'block_2',
						properties: { title: [ [ 'Block Two' ] ] },
						parent_table: 'space',
						parent_id: 'space_1'
					} as any
				]
			]),
			space_view: new Map([ [ 'space_view_1', space_view_1 as any ] ]),
			space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ])
		},
		executeOperationsMock = jest
			.spyOn(NotionOperations, 'executeOperations')
			.mockImplementationOnce(async () => undefined),
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined);

	const space_view = new SpaceView({
		...default_nishan_arg,
		cache,
		id: 'space_view_1',
		logger: false
	});

	const page_map = await space_view.updateBookmarkedPage([ 'block_2', true ]);

	expect(page_map.page.get('block_2')).not.toBeUndefined();

	expect(space_view_1).toStrictEqual({
		bookmarked_pages: [ 'block_1', 'block_2' ],
		id: 'space_view_1',
		space_id: 'space_1'
	});
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'space_view_1', 'space_view' ]);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.sv.la('space_view_1', [ 'bookmarked_pages' ], {
			id: 'block_2'
		})
	]);
});
