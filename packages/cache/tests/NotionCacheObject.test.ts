import { RecordMap } from '@nishans/types';
import deepEqual from 'deep-equal';
import { ICache, NotionCacheObject } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

const constructDefaultCache = () => {
	return {
		block: new Map(),
		collection: new Map(),
		space: new Map(),
		collection_view: new Map(),
		notion_user: new Map(),
		space_view: new Map(),
		user_root: new Map(),
		user_settings: new Map()
	} as ICache;
};

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
	expect(deepEqual(cache.block.get('block_2'), recordMap.block['block_2'].value)).toBe(true);
	// Unknown data should not exist in the internal cache
	expect(cache.block.get('block_3')).toBeUndefined();
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

	// Check to see if the data that doesnot exist in the cache returns or not
	const non_cached_data = NotionCacheObject.returnNonCachedData(
		[ [ 'block_1', 'block' ], [ 'notion_user_1', 'notion_user' ] ],
		cache
	);

	// the 2nd argument to deepEqual represents the data that doesnot exist in the internal cache
	expect(deepEqual(non_cached_data, [ [ 'notion_user_1', 'notion_user' ] ])).toBe(true);
});

describe(`initializeCache`, () => {
	const mock_reply = {
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
		mock.onPost(`/getSpaces`).replyOnce(200, mock_reply);

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				notion_user: {
					user_root_2: {
						value: { id: 'user_root_2' }
					}
				}
			}
		});

		const cache = {
			block: new Map(),
			collection: new Map(),
			space: new Map(),
			user_root: new Map(),
			notion_user: new Map()
		} as any;

		await NotionCacheObject.initializeNotionCache(
			{
				token: 'token'
			},
			cache
		);

		expect(deepEqual(cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
		expect(deepEqual(cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);
		expect(deepEqual(cache.notion_user.get('user_root_2'), { id: 'user_root_2' })).toBe(true);
		expect(cache.notion_user.get('user_root_3')).toBeUndefined();
	});

	it(`Fetches external notion_user data,external user = 0`, async () => {
		mock_reply.space_1.space.space_1.value.permissions.pop();
		mock.onPost(`/getSpaces`).replyOnce(200, mock_reply);

		const cache = {
			block: new Map(),
			collection: new Map(),
			space: new Map(),
			user_root: new Map(),
			notion_user: new Map()
		} as any;

		await NotionCacheObject.initializeNotionCache(
			{
				token: 'token'
			},
			cache
		);
	});
});

it(`updateCacheManually`, async () => {
	mock.onPost(`/syncRecordValues`).replyOnce(200, {
		recordMap: {
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
	});

	const cache = {
		block: new Map(),
		collection: new Map()
	} as any;

	await NotionCacheObject.updateCacheManually(
		[ [ 'collection_1', 'collection' ] ],
		{
			token: 'token'
		},
		cache
	);
	expect(deepEqual(cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
	expect(deepEqual(cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);
});

it(`updateCacheIfNotPresent method`, async () => {
	const cache = {
		collection: new Map(),
		block: new Map()
	} as any;

	NotionCacheObject.saveToCache(
		{
			collection: {
				collection_1: {
					role: 'editor',
					value: { id: 'collection_1' } as any
				}
			}
		},
		cache
	);

	mock.onPost(`/syncRecordValues`).replyOnce(200, {
		recordMap: {
			block: {
				block_2: {
					role: 'editor',
					value: { id: 'block_2' } as any
				},
				block_1: {
					role: 'editor',
					value: { id: 'block_1' } as any
				}
			}
		}
	});

	await NotionCacheObject.updateCacheIfNotPresent(
		[ [ 'block_2', 'block' ], [ 'collection_1', 'collection' ] ],
		{
			token: 'token'
		},
		cache
	);

	expect(deepEqual(cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
	expect(deepEqual(cache.block.get('block_2'), { id: 'block_2' })).toBe(true);
	expect(deepEqual(cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);
	// Using empty arguments to check for else coverage
	await NotionCacheObject.updateCacheIfNotPresent(
		[],
		{
			token: 'token'
		},
		cache
	);
});

describe('initializeCacheForSpecificData', () => {
	it(`type=block.page`, async () => {
		const cache = {
			block: new Map(),
			collection: new Map()
		} as any;

		const block_1: any = {
				content: [ 'block_2', 'block_3', 'block_4' ],
				id: 'block_1',
				type: 'page'
			},
			block_2: any = {
				id: 'block_2',
				type: 'collection_view_page',
				collection_id: 'collection_1'
			},
			block_3: any = {
				id: 'block_3',
				type: 'collection_view',
				collection_id: 'collection_1'
			},
			block_4: any = {
				id: 'block_4',
				type: 'header'
			},
			collection_1: any = { id: 'collection_1' };

		// Removing certain data so that they are not loaded in the cache initially
		NotionCacheObject.saveToCache(
			{
				block: {
					block_1: {
						value: block_1
					}
				} as any
			},
			cache
		);

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				block: {
					block_2: {
						value: block_2
					},
					block_3: {
						value: block_3
					},
					block_4: {
						value: block_4
					}
				},
				collection: {
					collection_1: {
						value: collection_1
					}
				}
			}
		});
		await NotionCacheObject.initializeCacheForSpecificData(
			'block_1',
			'block',
			{
				token: 'token'
			},
			cache
		);
		expect(deepEqual(cache.block.get('block_1'), block_1)).toBe(true);
		expect(deepEqual(cache.block.get('block_2'), block_2)).toBe(true);
		expect(deepEqual(cache.block.get('block_3'), block_3)).toBe(true);
		expect(deepEqual(cache.collection.get('collection_1'), collection_1)).toBe(true);
	});

	it(`type=collection_view_page`, async () => {
		const cache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map()
		} as any;

		const block_1: any = {
				value: {
					id: 'block_2',
					type: 'collection_view_page',
					collection_id: 'collection_1',
					view_ids: [ 'collection_view_1' ]
				}
			},
			collection_view_1 = {
				value: {
					id: 'collection_view_1'
				}
			},
			collection_1: any = {
				value: { id: 'collection_1' }
			};

		NotionCacheObject.saveToCache(
			{
				block: {
					block_1
				}
			},
			cache
		);

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				collection_view: {
					collection_view_1
				},
				collection: {
					collection_1
				}
			}
		});
		await NotionCacheObject.initializeCacheForSpecificData(
			'block_1',
			'block',
			{
				token: 'token'
			},
			cache
		);
		// The collection and collection_view data should be present in the cache when cvp data is initialized
		expect(deepEqual(cache.collection.get('collection_1'), collection_1.value)).toBe(true);
		expect(deepEqual(cache.collection_view.get('collection_view_1'), collection_view_1.value)).toBe(true);
	});

	it(`Should work for type space`, async () => {
		const cache = constructDefaultCache();

		const space_1: any = {
				value: {
					permissions: [
						{
							user_id: 'user_root_1'
						},
						{
							user_id: 'user_root_2'
						}
					],
					id: 'space_1',
					pages: [ 'block_1', 'block_2' ]
				}
			},
			block_1 = {
				value: {
					id: 'block_1'
				}
			},
			block_2: any = {
				value: { id: 'block_2' }
			};

		NotionCacheObject.saveToCache(
			{
				space: {
					space_1
				},
				user_root: {
					user_root_1: {
						value: { id: 'user_root_1' }
					} as any
				}
			},
			cache
		);

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				block: {
					block_1,
					block_2
				}
			}
		});

		await NotionCacheObject.initializeCacheForSpecificData(
			'space_1',
			'space',
			{
				token: 'token'
			},
			cache
		);
		// All the pages of the space should be loaded in the cache
		expect(deepEqual(cache.block.get('block_1'), block_1.value)).toBe(true);
		expect(deepEqual(cache.block.get('block_2'), block_2.value)).toBe(true);
	});

	it(`Should work for type user_root`, async () => {
		const cache = constructDefaultCache(),
			user_root_1 = {
				value: {
					space_views: [ 'space_view_1' ],
					id: 'user_root_1'
				}
			} as any,
			space_view_1 = {
				value: {
					id: 'space_view_1'
				}
			} as any;
		NotionCacheObject.saveToCache({ user_root: { user_root_1 } }, cache);
		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				space_view: { space_view_1 }
			}
		});
		await NotionCacheObject.initializeCacheForSpecificData(
			'user_root_1',
			'user_root',
			{
				token: 'token'
			},
			cache
		);
		expect(deepEqual(cache.space_view.get('space_view_1'), space_view_1.value)).toBe(true);
	});

	it(`space_view`, async () => {
		const cache = constructDefaultCache(),
			block_1 = {
				value: {
					id: 'block_1'
				}
			} as any,
			space_view_1 = {
				value: {
					id: 'space_view_1',
					bookmarked_pages: [ 'block_1' ]
				}
			} as any,
			space_view_2 = {
				value: {
					id: 'space_view_2'
				}
			} as any;

		NotionCacheObject.saveToCache(
			{
				space_view: {
					space_view_1,
					space_view_2
				}
			},
			cache
		);

		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				block: { block_1 }
			}
		});
		await NotionCacheObject.initializeCacheForSpecificData(
			'space_view_1',
			'space_view',
			{
				token: 'token'
			},
			cache
		);
		expect(deepEqual(cache.block.get('block_1'), block_1.value)).toBe(true);

		await NotionCacheObject.initializeCacheForSpecificData(
			'space_view_1',
			'space_view',
			{
				token: 'token'
			},
			cache
		);
	});
	describe('collection', () => {
		it(`template_pages=[]`, async () => {
			const cache = constructDefaultCache(),
				collection_1 = {
					value: {
						id: 'collection_1',
						template_pages: [ 'block_1' ]
					}
				} as any,
				block_1 = {
					value: {
						id: 'block_1'
					}
				} as any,
				block_2 = {
					value: {
						id: 'block_2'
					}
				} as any;

			NotionCacheObject.saveToCache({ collection: { collection_1 } }, cache);
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: {
						block_1
					}
				}
			});

			mock.onPost(`/queryCollection`).replyOnce(200, {
				recordMap: {
					block: {
						block_2
					}
				}
			});

			// This collection contains template pages
			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				{
					token: 'token'
				},
				cache
			);

			expect(deepEqual(cache.block.get('block_1'), block_1.value)).toBe(true);
			expect(deepEqual(cache.block.get('block_2'), block_2.value)).toBe(true);
		});

		it(`template_pages=undefined`, async () => {
			const cache = constructDefaultCache(),
				collection_1 = {
					value: {
						id: 'collection_1'
					}
				} as any,
				block_1 = {
					value: {
						id: 'block_1'
					}
				} as any;

			NotionCacheObject.saveToCache({ collection: { collection_1 } }, cache);

			mock.onPost(`/queryCollection`).replyOnce(200, {
				recordMap: {
					block: {
						block_1
					}
				}
			});

			// This collection contains template pages
			await NotionCacheObject.initializeCacheForSpecificData(
				'collection_1',
				'collection',
				{
					token: 'token'
				},
				cache
			);

			expect(deepEqual(cache.block.get('block_1'), block_1.value)).toBe(true);
		});
	});

	it(`Should throw error for unsupported data`, async () => {
		const cache = constructDefaultCache();

		expect(() =>
			NotionCacheObject.initializeCacheForSpecificData(
				'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c',
				'unknown' as any,
				{
					token: 'token'
				},
				cache
			)
		).rejects.toThrow(`unknown data is not supported`);
	});
});
