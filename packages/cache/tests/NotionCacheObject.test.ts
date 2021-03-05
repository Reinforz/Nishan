import { NotionQueries, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { RecordMap } from '@nishans/types';
import colors from 'colors';
import { ICache, NotionCacheObject } from '../libs';

const notion_request_configs = {
	token: 'token',
	interval: 0
};

afterEach(() => {
	jest.restoreAllMocks();
});

const createUpdateCacheIfNotPresentMock = () =>
	jest.spyOn(NotionCacheObject, 'updateCacheIfNotPresent').mockImplementationOnce(async () => undefined);

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
		expect(cache.block.get('block_1')).toStrictEqual(block_1);
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
	it(`should work correctly`, async () => {
		const result = NotionCacheObject.constructSyncRecordsParams([ [ '123', 'block' ] ]);
		expect(result).toStrictEqual([
			{
				table: 'block',
				id: '123',
				version: 0
			}
		]);
	});
});

describe('constructAndSyncRecordsParams', () => {
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

		await NotionCacheObject.constructAndSyncRecordsParams([ [ '123', 'block' ] ], notion_request_configs, cache);

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

		await NotionCacheObject.constructAndSyncRecordsParams([], notion_request_configs, cache);

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
			constructAndSyncRecordsParamsMock = jest
				.spyOn(NotionCacheObject, 'constructAndSyncRecordsParams')
				.mockImplementationOnce(async () => sync_record_values_response);

		await NotionCacheObject.initializeNotionCache(notion_request_configs, cache);

		expect(getSpacesMock.mock.calls[0][0]).toBe(notion_request_configs);
		expect(constructAndSyncRecordsParamsMock.mock.calls[0][0]).toStrictEqual([ [ 'user_root_2', 'notion_user' ] ]);
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
			constructAndSyncRecordsParamsMock = jest
				.spyOn(NotionCacheObject, 'constructAndSyncRecordsParams')
				.mockImplementationOnce(async () => sync_record_values_response);

		await NotionCacheObject.initializeNotionCache(notion_request_configs, cache);

		expect(getSpacesMock.mock.calls[0][0]).toBe(notion_request_configs);
		expect(constructAndSyncRecordsParamsMock).not.toHaveBeenCalled();
	});
});

it(`updateCacheManually`, async () => {
	const update_cache_manually_args: UpdateCacheManuallyParam = [ [ 'collection_1', 'collection' ] ];
	const constructSyncRecordsParamsMock = jest
		.spyOn(NotionCacheObject, 'constructAndSyncRecordsParams')
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
		.spyOn(NotionCacheObject, 'constructAndSyncRecordsParams')
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any;

		const updateCacheIfNotPresentMock = jest.spyOn(NotionCacheObject, 'updateCacheIfNotPresent');

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);
		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData(
			'collection_view_1',
			'collection_view',
			notion_request_configs,
			cache
		);
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
				parent_id: 'space_1'
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

		const updateCacheIfNotPresentMock = jest.spyOn(NotionCacheObject, 'updateCacheIfNotPresent');

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => {
			cache.block.set('block_2', block_2);
			cache.block.set('block_3', block_3);
			cache.block.set('block_4', block_4);
		});

		updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('block_1', 'block', notion_request_configs, cache);
		expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_2', 'block' ],
			[ 'block_3', 'block' ],
			[ 'block_4', 'block' ],
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
				parent_id: 'space_1'
			},
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();

		await NotionCacheObject.initializeCacheForSpecificData('block_1', 'block', notion_request_configs, cache);

		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'collection_view_1', 'collection_view' ],
			[ 'collection_1', 'collection' ],
			[ 'space_1', 'space' ]
		]);
	});

	it(`Should work for type space`, async () => {
		const space_1: any = {
				created_by_id: 'user_root_1',
				permissions: [
					{
						user_id: 'notion_user_1'
					},
					{
						user_id: 'notion_user_2'
					}
				],
				id: 'space_1',
				pages: [ 'block_1' ]
			},
			cache: ICache = { ...NotionCacheObject.createDefaultCache(), space: new Map([ [ 'space_1', space_1 ] ]) };

		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCacheObject, 'updateCacheIfNotPresent')
			.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('space_1', 'space', notion_request_configs, cache);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
			[ 'block_1', 'block' ],
			[ 'notion_user_1', 'notion_user' ],
			[ 'notion_user_2', 'notion_user' ],
			[ 'user_root_1', 'user_root' ]
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

		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCacheObject, 'updateCacheIfNotPresent')
			.mockImplementationOnce(async () => undefined);

		await NotionCacheObject.initializeCacheForSpecificData('user_root_1', 'user_root', notion_request_configs, cache);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'space_view_1', 'space_view' ] ]);
	});

	describe('space_view', () => {
		const createCache = (space_view_1: any) => {
			return {
				...NotionCacheObject.createDefaultCache(),
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as ICache;
		};

		it(`bookmarked_pages=[id]`, async () => {
			const space_view_1: any = {
					id: 'user_root_1',
					bookmarked_pages: [ 'block_1' ],
					space_id: 'space_1'
				},
				cache = createCache(space_view_1);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			await NotionCacheObject.initializeCacheForSpecificData(
				'space_view_1',
				'space_view',
				notion_request_configs,
				cache
			);
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
				[ 'block_1', 'block' ],
				[ 'space_1', 'space' ]
			]);
		});

		it(`bookmarked_pages=undefined`, async () => {
			const space_view_1: any = {
					id: 'user_root_1',
					space_id: 'space_1'
				},
				cache = createCache(space_view_1);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			await NotionCacheObject.initializeCacheForSpecificData(
				'space_view_1',
				'space_view',
				notion_request_configs,
				cache
			);
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'space_1', 'space' ] ]);
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
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				};

			const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			const queryCollectionMock = createQueryCollectionMock();

			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				notion_request_configs,
				cache
			);

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
					...NotionCacheObject.createDefaultCache(),
					collection: new Map([ [ 'collection_1', collection_1 ] ])
				};

			const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);
			const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
			const queryCollectionMock = createQueryCollectionMock();

			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				notion_request_configs,
				cache
			);

			expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual(query_collection_payload);
			expect(saveToCacheMock.mock.calls[0][0]).toBe(query_collection_response.recordMap);
			expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
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
		).rejects.toThrow(colors.red.bold(`unknown data is not supported`));
	});
});

describe('validateCache', () => {
	it(`Should fail if cache_item is not a Map`, () => {
		expect(() =>
			NotionCacheObject.validateCache({
				...NotionCacheObject.createDefaultCache(),
				block: true
			} as any)
		).toThrow(colors.red.bold(`block is not an instance of Map`));
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
		).toThrow(colors.red.bold(`user_settings must be present in Cache argument`));
	});

	it(`Should fail if an unknown cache_item is passed`, () => {
		expect(() =>
			NotionCacheObject.validateCache({
				...NotionCacheObject.createDefaultCache(),
				unknown: new Map()
			} as any)
		).toThrow(colors.red.bold(`Unknown key unknown passed`));
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
