import { NotionQueries, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { RecordMap } from '@nishans/types';
import { ICache, NotionCacheObject } from '../libs';

const notion_request_configs = {
	token: 'token',
	interval: 0
};

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCacheObject.createDefaultCache`, () => {
	expect(NotionCacheObject.validateCache(NotionCacheObject.createDefaultCache())).toBeTruthy();
});

describe('fetchDataOrReturnCached', () => {
	it(`data exists in cache`, async () => {
		const block_1 = {
				id: 'block_1'
			},
			cache: ICache = {
				block: new Map([ [ 'block_1', block_1 ] ])
			} as any;
		const data = await NotionCacheObject.fetchDataOrReturnCached('block', 'block_1', notion_request_configs, cache);
		expect(data).toBe(block_1);
	});

	it(`fetches from db`, async () => {
		const block_1 = {
				id: 'block_1'
			},
			cache: ICache = {
				block: new Map()
			} as any;
		const syncRecordValuesMock = jest.spyOn(NotionQueries, 'syncRecordValues');
		syncRecordValuesMock.mockImplementationOnce(async () => {
			return {
				recordMap: {
					block: {
						block_1: {
							value: block_1
						}
					}
				}
			} as any;
		});
		const data = await NotionCacheObject.fetchDataOrReturnCached('block', 'block_1', notion_request_configs, cache);
		expect(data).toBe(block_1);
		expect(syncRecordValuesMock).toHaveBeenCalledWith(
			{
				requests: [
					{
						id: 'block_1',
						table: 'block',
						version: 0
					}
				]
			},
			notion_request_configs
		);
	});
});

it('saveToCache', () => {
	const recordMap: RecordMap = {
		block: {
			block_2: {
				value: {
					id: 'block_2'
				}
			}
		}
	} as any;

	const cache = {
		block: new Map([
			[
				'block_1',
				{
					id: 'block_1'
				}
			]
		])
	} as any;

	// Save data to internal cache
	NotionCacheObject.saveToCache(recordMap, cache);

	// After saving data to cache it should exist in the internal cache
	expect(cache.block.get('block_2')).toStrictEqual(recordMap.block['block_2'].value);
	// Unknown data should not exist in the internal cache
	expect(cache.block.get('block_3')).toBeUndefined();
});

describe('constructSyncRecordsParams', () => {
	it(`sync_record_values is not empty`, async () => {
		const cache = NotionCacheObject.createDefaultCache(),
			sync_record_values_response = {
				recordMap: {
					data: 'data'
				}
			} as any;

		const syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCacheObject.constructSyncRecordsParams([ [ '123', 'block' ] ], notion_request_configs, cache);

		expect(syncRecordValuesMock).toHaveBeenCalledWith(
			{
				requests: [
					{
						table: 'block',
						id: '123',
						version: 0
					}
				]
			},
			notion_request_configs
		);
		expect(saveToCacheMock.mock.calls[0][0]).toStrictEqual(sync_record_values_response.recordMap);
	});

	it(`sync_record_values is empty`, async () => {
		const cache = NotionCacheObject.createDefaultCache(),
			sync_record_values_response = {
				recordMap: {
					data: 'data'
				}
			} as any;

		const syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCacheObject.constructSyncRecordsParams([], notion_request_configs, cache);

		expect(syncRecordValuesMock).not.toHaveBeenCalled();
		expect(saveToCacheMock).not.toHaveBeenCalled();
	});
});

it(`returnNonCachedData`, () => {
	const recordMap: RecordMap = {
		block: {
			block_1: {
				role: 'editor',
				value: { id: 'block_1' } as any
			}
		}
	} as any;

	const cache = {
		block: new Map([
			[
				'block_1',
				{
					id: 'block_1'
				}
			]
		]),
		notion_user: new Map()
	} as any;

	NotionCacheObject.saveToCache(recordMap, cache);

	// Check to see if the data that doesn't exist in the cache returns or not
	const non_cached_data = NotionCacheObject.returnNonCachedData(
		[ [ 'block_1', 'block' ], [ 'notion_user_1', 'notion_user' ] ],
		cache
	);

	expect(non_cached_data).toStrictEqual([ [ 'notion_user_1', 'notion_user' ] ]);
});

describe(`initializeNotionCache`, () => {
	const get_spaces_response: any = {
		space_1: {
			user_root: {
				user_root_1: {
					value: { id: 'user_root_1' }
				}
			},
			space: {
				space_1: {
					value: {
						permissions: [
							{
								user_id: 'user_root_1'
							},
							{
								user_id: 'user_root_2'
							}
						]
					}
				}
			},
			block: {
				block_1: {
					value: { id: 'block_1' }
				}
			},
			collection: {
				collection_1: {
					value: { id: 'collection_1' }
				}
			}
		}
	};

	it(`Fetches external notion_user data,external user = 1`, async () => {
		const cache = NotionCacheObject.createDefaultCache();
		const sync_record_values_response = {
			recordMap: {
				notion_user: {
					user_root_2: {
						value: { id: 'user_root_2' }
					}
				}
			}
		} as any;
		const getSpacesMock = jest
				.spyOn(NotionQueries, 'getSpaces')
				.mockImplementationOnce(async () => get_spaces_response),
			syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCacheObject.initializeNotionCache(notion_request_configs, cache);

		expect(getSpacesMock.mock.calls[0][0]).toBe(notion_request_configs);
		expect(saveToCacheMock).toHaveBeenCalledTimes(2);
		expect(saveToCacheMock.mock.calls[0][0]).toBe(get_spaces_response.space_1);
		expect(saveToCacheMock.mock.calls[1][0]).toBe(sync_record_values_response.recordMap);
		expect(syncRecordValuesMock).toHaveBeenCalledWith(
			{
				requests: [
					{
						table: 'notion_user',
						id: 'user_root_2',
						version: -1
					}
				]
			},
			notion_request_configs
		);
	});

	it(`Fetches external notion_user data,external user = 0`, async () => {
		get_spaces_response.space_1.space.space_1.value.permissions.pop();
		const cache = NotionCacheObject.createDefaultCache();
		const sync_record_values_response = {
			recordMap: {
				notion_user: {
					user_root_2: {
						value: { id: 'user_root_2' }
					}
				}
			}
		} as any;

		const getSpacesMock = jest
				.spyOn(NotionQueries, 'getSpaces')
				.mockImplementationOnce(async () => get_spaces_response),
			syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCacheObject.initializeNotionCache(notion_request_configs, cache);

		expect(getSpacesMock.mock.calls[0][0]).toBe(notion_request_configs);
		expect(saveToCacheMock).toHaveBeenCalledTimes(1);
		expect(saveToCacheMock.mock.calls[0][0]).toBe(get_spaces_response.space_1);
		expect(syncRecordValuesMock).not.toHaveBeenCalled();
	});
});

it(`updateCacheManually`, async () => {
	const update_cache_manually_args: UpdateCacheManuallyParam = [ [ 'collection_1', 'collection' ] ];
	const constructSyncRecordsParamsMock = jest
		.spyOn(NotionCacheObject, 'constructSyncRecordsParams')
		.mockImplementationOnce(async () => undefined);
	await NotionCacheObject.updateCacheManually(
		update_cache_manually_args,
		notion_request_configs,
		NotionCacheObject.createDefaultCache()
	);
	expect(constructSyncRecordsParamsMock.mock.calls[0][0]).toBe(update_cache_manually_args);
	expect(constructSyncRecordsParamsMock.mock.calls[0][1]).toBe(notion_request_configs);
});

it(`updateCacheIfNotPresent method`, async () => {
	const cache: ICache = {
		...NotionCacheObject.createDefaultCache(),
		collection: new Map([ [ 'collection_1', { id: 'collection_1' } as any ] ])
	};

	const syncRecordValuesMock = jest
		.spyOn(NotionCacheObject, 'constructSyncRecordsParams')
		.mockImplementationOnce(async () => undefined);

	await NotionCacheObject.updateCacheIfNotPresent(
		[ [ 'block_2', 'block' ], [ 'collection_1', 'collection' ] ],
		notion_request_configs,
		cache
	);

	expect(syncRecordValuesMock.mock.calls[0][0]).toStrictEqual([ [ 'block_2', 'block' ] ]);
	expect(syncRecordValuesMock.mock.calls[0][1]).toBe(notion_request_configs);
});

describe('initializeCacheForSpecificData', () => {
	it(`type=block.page`, async () => {
		const block_1: any = {
				content: [ 'block_2', 'block_3', 'block_4' ],
				id: 'block_1',
				type: 'page'
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		};

		const updateCacheManuallyMock = jest.spyOn(NotionCacheObject, 'updateCacheManually');

		updateCacheManuallyMock.mockImplementationOnce(async () => {
			cache.block.set('block_2', block_2);
			cache.block.set('block_3', block_3);
			cache.block.set('block_4', block_4);
		});

		updateCacheManuallyMock.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('block_1', 'block', notion_request_configs, cache);
		expect(updateCacheManuallyMock).toHaveBeenCalledTimes(2);
		expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_2', 'block' ],
			[ 'block_3', 'block' ],
			[ 'block_4', 'block' ]
		]);
		expect(updateCacheManuallyMock.mock.calls[0][1]).toBe(notion_request_configs);
		expect(updateCacheManuallyMock.mock.calls[1][0]).toStrictEqual([
			[ 'collection_1', 'collection' ],
			[ 'collection_view_1', 'collection_view' ],
			[ 'collection_2', 'collection' ],
			[ 'collection_view_2', 'collection_view' ]
		]);
		expect(updateCacheManuallyMock.mock.calls[1][1]).toBe(notion_request_configs);
	});

	it(`type=collection_view_page`, async () => {
		const block_1: any = {
				id: 'block_1',
				type: 'collection_view_page',
				collection_id: 'collection_1',
				view_ids: [ 'collection_view_1' ]
			},
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const updateCacheManuallyMock = jest
			.spyOn(NotionCacheObject, 'updateCacheManually')
			.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('block_1', 'block', notion_request_configs, cache);

		expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([
			[ 'collection_view_1', 'collection_view' ],
			[ 'collection_1', 'collection' ]
		]);
	});

	it(`Should work for type space`, async () => {
		const space_1: any = {
				permissions: [
					{
						user_id: 'user_root_1'
					},
					{
						user_id: 'user_root_2'
					}
				],
				id: 'space_1',
				pages: [ 'block_1' ]
			},
			cache: ICache = { ...NotionCacheObject.createDefaultCache(), space: new Map([ [ 'space_1', space_1 ] ]) };

		const updateCacheManuallyMock = jest
			.spyOn(NotionCacheObject, 'updateCacheManually')
			.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('space_1', 'space', notion_request_configs, cache);
		expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_1', 'block' ],
			[ 'user_root_1', 'notion_user' ],
			[ 'user_root_2', 'notion_user' ]
		]);
	});

	it(`Should work for type user_root`, async () => {
		const user_root_1: any = {
				space_views: [ 'space_view_1' ],
				id: 'user_root_1'
			},
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				user_root: new Map([ [ 'user_root_1', user_root_1 ] ])
			};

		const updateCacheManuallyMock = jest
			.spyOn(NotionCacheObject, 'updateCacheManually')
			.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('user_root_1', 'user_root', notion_request_configs, cache);
		expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ 'space_view_1', 'space_view' ] ]);
	});

	describe('space_view', () => {
		it(`bookmarked_pages=[id]`, async () => {
			const space_view_1: any = {
					id: 'user_root_1',
					bookmarked_pages: [ 'block_1' ]
				},
				cache: ICache = {
					...NotionCacheObject.createDefaultCache(),
					space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
				};

			const updateCacheManuallyMock = jest
				.spyOn(NotionCacheObject, 'updateCacheManually')
				.mockImplementationOnce(async () => undefined);

			await NotionCacheObject.initializeCacheForSpecificData(
				'space_view_1',
				'space_view',
				notion_request_configs,
				cache
			);
			expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
		});

		it(`bookmarked_pages=undefined`, async () => {
			const space_view_1: any = {
					id: 'user_root_1'
				},
				cache: ICache = {
					...NotionCacheObject.createDefaultCache(),
					space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
				};

			const updateCacheManuallyMock = jest
				.spyOn(NotionCacheObject, 'updateCacheManually')
				.mockImplementationOnce(async () => undefined);

			await NotionCacheObject.initializeCacheForSpecificData(
				'space_view_1',
				'space_view',
				notion_request_configs,
				cache
			);
			expect(updateCacheManuallyMock).not.toHaveBeenCalled();
		});
	});

	describe('collection', () => {
		it(`template_pages=[]`, async () => {
			const collection_1 = {
					id: 'collection_1',
					template_pages: [ 'block_1' ]
				} as any,
				cache = {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				},
				query_collection_response = {
					recordMap: {
						something: 'something'
					}
				} as any;

			const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheManuallyMock = jest
				.spyOn(NotionCacheObject, 'updateCacheManually')
				.mockImplementationOnce(async () => undefined);
			const queryCollectionMock = jest.spyOn(NotionQueries, 'queryCollection').mockImplementationOnce(async () => {
				return query_collection_response;
			});

			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				notion_request_configs,
				cache
			);

			expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual({
				collectionId: 'collection_1',
				collectionViewId: '',
				query: {},
				loader: {
					type: 'table',
					loadContentCover: true
				}
			});
			expect(saveToCacheMock.mock.calls[0][0]).toBe(query_collection_response.recordMap);
			expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
		});

		it(`template_pages=undefined`, async () => {
			const collection_1 = {
					id: 'collection_1'
				} as any,
				cache = {
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				},
				query_collection_response = {
					recordMap: {
						something: 'something'
					}
				} as any;

			const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheManuallyMock = jest
				.spyOn(NotionCacheObject, 'updateCacheManually')
				.mockImplementationOnce(async () => undefined);
			const queryCollectionMock = jest.spyOn(NotionQueries, 'queryCollection').mockImplementationOnce(async () => {
				return query_collection_response;
			});

			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				notion_request_configs,
				cache
			);

			expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual({
				collectionId: 'collection_1',
				collectionViewId: '',
				query: {},
				loader: {
					type: 'table',
					loadContentCover: true
				}
			});
			expect(saveToCacheMock.mock.calls[0][0]).toBe(query_collection_response.recordMap);
			expect(updateCacheManuallyMock).not.toHaveBeenCalled();
		});
	});

	it(`Should throw error for unsupported data`, async () => {
		const cache = NotionCacheObject.createDefaultCache();

		expect(() =>
			NotionCacheObject.initializeCacheForSpecificData(
				'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c',
				'unknown' as any,
				notion_request_configs,
				cache
			)
		).rejects.toThrow(`unknown data is not supported`);
	});
});

describe('validateCache', () => {
	it(`Should fail if cache_item is not a Map`, () => {
		expect(() =>
			NotionCacheObject.validateCache({
				...NotionCacheObject.createDefaultCache(),
				block: true
			} as any)
		).toThrow(`block is not an instance of Map`);
	});

	it(`Should fail if cache_item is not passed`, () => {
		expect(() =>
			NotionCacheObject.validateCache({
				block: new Map(),
				collection: new Map(),
				space: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space_view: new Map(),
				user_root: new Map()
			} as any)
		).toThrow(`user_settings must be present in Cache argument`);
	});

	it(`Should fail if an unknown cache_item is passed`, () => {
		expect(() =>
			NotionCacheObject.validateCache({
				...NotionCacheObject.createDefaultCache(),
				unknown: new Map()
			} as any)
		).toThrow(`Unknown key unknown passed`);
	});

	it(`Should return cache if no error is thrown`, () => {
		expect(
			NotionCacheObject.validateCache({
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ '4b4bb21d-f68b-4113-b342-830687a5337b', { value: {} } ] as any ])
			})
		).toBeTruthy();
	});
});
