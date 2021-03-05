import { NotionQueries } from '@nishans/endpoints';
import colors from 'colors';
import { ICache, NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const createUpdateCacheIfNotPresentMock = () =>
	jest.spyOn(NotionCache, 'updateCacheIfNotPresent').mockImplementationOnce(async () => undefined);

describe('initializeCacheForSpecificData', () => {
	it(`type=collection_view`, async () => {
		const block_1: any = {
				id: 'block_1',
				collection_id: 'collection_1'
			},
			collection_view_1 = {
				id: 'collection_view_1',
				parent_id: 'block_1'
			};

		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any;

		const updateCacheIfNotPresentMock = jest.spyOn(NotionCache, 'updateCacheIfNotPresent');

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);
		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

		await NotionCache.initializeCacheForSpecificData('collection_view_1', 'collection_view', { token: 'token', cache });
		expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
		expect(updateCacheIfNotPresentMock.mock.calls[1][0]).toStrictEqual([ [ 'collection_1', 'collection' ] ]);
	});

	it(`type=block.page`, async () => {
		const block_1: any = {
				content: [ 'block_2', 'block_3', 'block_4' ],
				id: 'block_1',
				type: 'page',
				parent_table: 'space',
				parent_id: 'space_1',
				last_edited_by_id: 'notion_user_1',
				created_by_id: 'notion_user_1'
			},
			block_2: any = {
				id: 'block_2',
				type: 'collection_view_page',
				collection_id: 'collection_1',
				view_ids: [ 'collection_view_1' ]
			},
			block_3: any = {
				id: 'block_3',
				type: 'collection_view',
				collection_id: 'collection_2',
				view_ids: [ 'collection_view_2' ]
			},
			block_4: any = {
				id: 'block_4',
				type: 'header'
			};

		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		};

		const updateCacheIfNotPresentMock = jest.spyOn(NotionCache, 'updateCacheIfNotPresent');

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => {
			cache.block.set('block_2', block_2);
			cache.block.set('block_3', block_3);
			cache.block.set('block_4', block_4);
		});

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

		await NotionCache.initializeCacheForSpecificData('block_1', 'block', { token: 'token', cache });
		expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_2', 'block' ],
			[ 'block_3', 'block' ],
			[ 'block_4', 'block' ],
			[ 'notion_user_1', 'notion_user' ],
			[ 'space_1', 'space' ]
		]);
		expect(updateCacheIfNotPresentMock.mock.calls[1][0]).toStrictEqual([
			[ 'collection_1', 'collection' ],
			[ 'collection_view_1', 'collection_view' ],
			[ 'collection_2', 'collection' ],
			[ 'collection_view_2', 'collection_view' ]
		]);
	});

	it(`type=collection_view_page`, async () => {
		const block_1: any = {
				id: 'block_1',
				type: 'collection_view_page',
				collection_id: 'collection_1',
				view_ids: [ 'collection_view_1' ],
				parent_table: 'space',
				parent_id: 'space_1',
				last_edited_by_id: 'notion_user_1',
				created_by_id: 'notion_user_1'
			},
			cache = {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();

		await NotionCache.initializeCacheForSpecificData('block_1', 'block', { token: 'token', cache });

		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'collection_view_1', 'collection_view' ],
			[ 'collection_1', 'collection' ],
			[ 'notion_user_1', 'notion_user' ],
			[ 'space_1', 'space' ]
		]);
	});

	it(`Should work for type space`, async () => {
		const space_1: any = {
				created_by_id: 'notion_user_1',
				last_edited_by_id: 'notion_user_1',
				permissions: [
					{
						type: 'user_permission',
						user_id: 'notion_user_1'
					},
					{
						type: 'user_permission',
						user_id: 'notion_user_2'
					}
				],
				id: 'space_1',
				pages: [ 'block_1' ]
			},
			cache: ICache = { ...NotionCache.createDefaultCache(), space: new Map([ [ 'space_1', space_1 ] ]) };

		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCache, 'updateCacheIfNotPresent')
			.mockImplementationOnce(async () => undefined);

		await NotionCache.initializeCacheForSpecificData('space_1', 'space', { token: 'token', cache });
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_1', 'block' ],
			[ 'notion_user_1', 'notion_user' ],
			[ 'notion_user_2', 'notion_user' ]
		]);
	});

	it(`Should work for type user_root`, async () => {
		const user_root_1: any = {
				space_views: [ 'space_view_1' ],
				id: 'user_root_1'
			},
			cache: ICache = {
				...NotionCache.createDefaultCache(),
				user_root: new Map([ [ 'user_root_1', user_root_1 ] ])
			};

		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCache, 'updateCacheIfNotPresent')
			.mockImplementationOnce(async () => undefined);

		await NotionCache.initializeCacheForSpecificData('user_root_1', 'user_root', { token: 'token', cache });
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'space_view_1', 'space_view' ] ]);
	});

	describe('space_view', () => {
		const createCache = (space_view_1: any) => {
			return {
				...NotionCache.createDefaultCache(),
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as ICache;
		};

		it(`bookmarked_pages=[id]`, async () => {
			const space_view_1: any = {
					id: 'user_root_1',
					bookmarked_pages: [ 'block_1' ],
					space_id: 'space_1',
					parent_id: 'user_root_1'
				},
				cache = createCache(space_view_1);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			await NotionCache.initializeCacheForSpecificData('space_view_1', 'space_view', { token: 'token', cache });
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
				[ 'block_1', 'block' ],
				[ 'space_1', 'space' ],
				[ 'user_root_1', 'user_root' ]
			]);
		});

		it(`bookmarked_pages=undefined`, async () => {
			const space_view_1: any = {
					id: 'user_root_1',
					space_id: 'space_1',
					parent_id: 'user_root_1'
				},
				cache = createCache(space_view_1);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			await NotionCache.initializeCacheForSpecificData('space_view_1', 'space_view', { token: 'token', cache });
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
				[ 'space_1', 'space' ],
				[ 'user_root_1', 'user_root' ]
			]);
		});
	});

	describe('collection', () => {
		const query_collection_payload = {
				collectionId: 'collection_1',
				collectionViewId: '',
				query: {},
				loader: {
					type: 'table',
					loadContentCover: true
				}
			},
			query_collection_response = {
				recordMap: {
					something: 'something'
				}
			} as any,
			createQueryCollectionMock = () =>
				jest.spyOn(NotionQueries, 'queryCollection').mockImplementationOnce(async () => query_collection_response);

		it(`template_pages=[]`, async () => {
			const collection_1 = {
					id: 'collection_1',
					template_pages: [ 'block_2' ],
					parent_id: 'block_1'
				} as any,
				cache = {
					...NotionCache.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				};

			const saveToCacheMock = jest.spyOn(NotionCache, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			const queryCollectionMock = createQueryCollectionMock();

			await NotionCache.initializeCacheForSpecificData('collection_1', 'collection', { token: 'token', cache });

			expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual(query_collection_payload);
			expect(saveToCacheMock.mock.calls[0][0]).toBe(query_collection_response.recordMap);
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
				[ 'block_2', 'block' ],
				[ 'block_1', 'block' ]
			]);
		});

		it(`template_pages=undefined`, async () => {
			const collection_1 = {
					id: 'collection_1',
					parent_id: 'block_1'
				} as any,
				cache = {
					...NotionCache.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				};

			const saveToCacheMock = jest.spyOn(NotionCache, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			const queryCollectionMock = createQueryCollectionMock();

			await NotionCache.initializeCacheForSpecificData('collection_1', 'collection', { token: 'token', cache });

			expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual(query_collection_payload);
			expect(saveToCacheMock.mock.calls[0][0]).toBe(query_collection_response.recordMap);
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
		});
	});

	it(`Should throw error for unsupported data`, async () => {
		const cache = NotionCache.createDefaultCache();

		expect(() =>
			NotionCache.initializeCacheForSpecificData('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c', 'unknown' as any, {
				cache,
				token: 'token'
			})
		).rejects.toThrow(colors.red.bold(`unknown data is not supported`));
	});
});
