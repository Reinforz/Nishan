import { ICache, NotionCache } from '../src';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';
import { RecordMap } from '@nishans/types';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('NotionCache class', () => {
	it(`constructor`, () => {
		// It should throw if cache passed is not correct
		expect(
			() =>
				new NotionCache({
					cache: {
						block: new Map()
					}
				} as any)
		).toThrow();

		expect(() => new NotionCache({} as any)).toThrow(`Token not provided`);
	});

	it(`getConfigs method`, () => {
		const notion_cache = new NotionCache({
			token: 'token'
		});

		expect(
			deepEqual(notion_cache.getConfigs(), {
				token: 'token',
				user_id: undefined,
				interval: 500
			})
		).toBe(true);
	});

	it('saveToCache method', () => {
		const recordMap: RecordMap = {
			block: {
				block_1: {
					role: 'editor',
					value: { id: 'block_1' } as any
				}
			}
		} as any;

		const notion_cache = new NotionCache({
			token: 'token'
		});

		// Save data to internal cache
		notion_cache.saveToCache(recordMap);

		// After saving data to cache it should exist in the internal cache
		expect(deepEqual(notion_cache.cache.block.get('block_1'), recordMap.block['block_1'].value)).toBe(true);
		// Unknown data should not exist in the internal cache
		expect(notion_cache.cache.block.get('block_2')).toBeUndefined();
	});

	it(`returnNonCachedData method`, () => {
		const recordMap: RecordMap = {
			block: {
				block_1: {
					role: 'editor',
					value: { id: 'block_1' } as any
				}
			}
		} as any;

		const notion_cache = new NotionCache({
			token: 'token',
			interval: 0
		});

		notion_cache.saveToCache(recordMap);
		// Check to see if the data that doesnot exist in the cache returns or not
		const non_cached_data = notion_cache.returnNonCachedData([
			[ 'block_1', 'block' ],
			[ 'notion_user_1', 'notion_user' ],
			'block_2'
		]);

		// the 2nd argument to deepEqual represents the data that doesnot exist in the internal cache
		expect(deepEqual(non_cached_data, [ [ 'notion_user_1', 'notion_user' ], 'block_2' ])).toBe(true);
	});

	describe(`initializeCache method`, () => {
		it(`Fetches external notion_user data,external user = 1`, async () => {
			mock.onPost(`/getSpaces`).replyOnce(200, {
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
			});

			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					notion_user: {
						user_root_2: {
							value: { id: 'user_root_2' }
						}
					}
				}
			});

			const notion_cache = new NotionCache({
				token: 'token'
			});

			await notion_cache.initializeCache();
			expect(deepEqual(notion_cache.cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
			expect(deepEqual(notion_cache.cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);
			expect(deepEqual(notion_cache.cache.notion_user.get('user_root_2'), { id: 'user_root_2' })).toBe(true);
			expect(notion_cache.cache.notion_user.get('user_root_3')).toBeUndefined();
		});

		it(`Fetches external notion_user data,external user = 0`, async () => {
			mock.onPost(`/getSpaces`).replyOnce(200, {
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
			});

			const notion_cache = new NotionCache({
				token: 'token'
			});

			await notion_cache.initializeCache();
		});
	});

	describe(`updateCacheManually method`, () => {
		it(`Should work correctly when passed array of string arguments`, async () => {
			const notion_cache = new NotionCache({
				token: 'token'
			});
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

			// Array of string, or [id, data_type] tuple should work
			await notion_cache.updateCacheManually([ 'block_1', [ 'collection_1', 'collection' ] ]);
			expect(deepEqual(notion_cache.cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
			expect(deepEqual(notion_cache.cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);

			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: {
						block_2: {
							value: { id: 'block_2' }
						}
					}
				}
			});

			// Single string argument should work as well
			await notion_cache.updateCacheManually('block_2');
			expect(deepEqual(notion_cache.cache.block.get('block_2'), { id: 'block_2' })).toBe(true);
		});

		it(`Should throw an error if passed wrong arguments`, async () => {
			const notion_cache = new NotionCache({
				token: 'token'
			});
			expect(() => notion_cache.updateCacheManually([ true ] as any)).rejects.toThrow(`Unsupported argument passed`);
			expect(() => notion_cache.updateCacheManually(true as any)).rejects.toThrow(`Unsupported argument passed`);
			expect(await notion_cache.updateCacheManually([])).toBeFalsy();
		});
	});

	it(`updateCacheIfNotPresent method`, async () => {
		const notion_cache = new NotionCache({
			token: 'token'
		});

		notion_cache.saveToCache({
			collection: {
				collection_1: {
					role: 'editor',
					value: { id: 'collection_1' } as any
				}
			}
		});

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

		await notion_cache.updateCacheIfNotPresent([ 'block_1', [ 'block_2', 'block' ], [ 'collection_1', 'collection' ] ]);

		expect(deepEqual(notion_cache.cache.block.get('block_1'), { id: 'block_1' })).toBe(true);
		expect(deepEqual(notion_cache.cache.block.get('block_2'), { id: 'block_2' })).toBe(true);
		expect(deepEqual(notion_cache.cache.collection.get('collection_1'), { id: 'collection_1' })).toBe(true);
		// Using empty arguments to check for else coverage
		await notion_cache.updateCacheIfNotPresent([]);
	});

	describe('initializeCacheForSpecificData', () => {
		it(`Should work for block & page type`, async () => {
			const notion_cache = new NotionCache({
				token: 'token'
			});

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
			notion_cache.saveToCache({
				block: {
					block_1: {
						value: block_1
					}
				} as any
			});

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
			await notion_cache.initializeCacheForSpecificData('block_1', 'block');
			expect(deepEqual(notion_cache.cache.block.get('block_1'), block_1)).toBe(true);
			expect(deepEqual(notion_cache.cache.block.get('block_2'), block_2)).toBe(true);
			expect(deepEqual(notion_cache.cache.block.get('block_3'), block_3)).toBe(true);
			expect(deepEqual(notion_cache.cache.collection.get('collection_1'), collection_1)).toBe(true);
		});

		it(`type=collection_view_page`, async () => {
			const notion_cache = new NotionCache({
				token: 'token'
			});

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

			notion_cache.saveToCache({
				block: {
					block_1
				}
			});

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
			await notion_cache.initializeCacheForSpecificData('block_1', 'block');
			// The collection and collection_view data should be present in the cache when cvp data is initialized
			expect(deepEqual(notion_cache.cache.collection.get('collection_1'), collection_1.value)).toBe(true);
			expect(deepEqual(notion_cache.cache.collection_view.get('collection_view_1'), collection_view_1.value)).toBe(
				true
			);
		});

		it(`Should work for type space`, async () => {
			const notion_cache = new NotionCache({
				token: 'token'
			});

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

			notion_cache.saveToCache({
				space: {
					space_1
				},
				user_root: {
					user_root_1: {
						value: { id: 'user_root_1' }
					} as any
				}
			});

			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					block: {
						block_1,
						block_2
					}
				}
			});

			await notion_cache.initializeCacheForSpecificData('space_1', 'space');
			// All the pages of the space should be loaded in the cache
			expect(deepEqual(notion_cache.cache.block.get('block_1'), block_1.value)).toBe(true);
			expect(deepEqual(notion_cache.cache.block.get('block_2'), block_2.value)).toBe(true);
		});

		it(`Should work for type user_root`, async () => {
			const notion_cache = new NotionCache({
					token: 'token'
				}),
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
			notion_cache.saveToCache({ user_root: { user_root_1 } });
			mock.onPost(`/syncRecordValues`).replyOnce(200, {
				recordMap: {
					space_view: { space_view_1 }
				}
			});
			await notion_cache.initializeCacheForSpecificData('user_root_1', 'user_root');
			expect(deepEqual(notion_cache.cache.space_view.get('space_view_1'), space_view_1.value)).toBe(true);
		});

		describe('space_view', () => {
			it(`bookmarked_pages=[]`, async () => {
				const notion_cache = new NotionCache({
						token: 'token'
					}),
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
					} as any;

				notion_cache.saveToCache({
					space_view: {
						space_view_1
					}
				});

				mock.onPost(`/syncRecordValues`).replyOnce(200, {
					recordMap: {
						block: { block_1 }
					}
				});
				await notion_cache.initializeCacheForSpecificData('space_view_1', 'space_view');
				expect(deepEqual(notion_cache.cache.block.get('block_1'), block_1.value)).toBe(true);
			});

			it(`bookmarked_pages=undefined`, async () => {
				const notion_cache = new NotionCache({
						token: 'token'
					}),
					space_view_1 = {
						value: {
							id: 'space_view_1'
						}
					} as any;

				notion_cache.saveToCache({
					space_view: {
						space_view_1
					}
				});

				await notion_cache.initializeCacheForSpecificData('space_view_1', 'space_view');
			});
		});

		describe('collection', () => {
			it(`template_pages=[]`, async () => {
				const notion_cache = new NotionCache({
						token: 'token'
					}),
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

				notion_cache.saveToCache({ collection: { collection_1 } });
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
				await notion_cache.initializeCacheForSpecificData('collection_1', 'collection');

				expect(deepEqual(notion_cache.cache.block.get('block_1'), block_1.value)).toBe(true);
				expect(deepEqual(notion_cache.cache.block.get('block_2'), block_2.value)).toBe(true);
			});

			it(`template_pages=undefined`, async () => {
				const notion_cache = new NotionCache({
						token: 'token'
					}),
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

				notion_cache.saveToCache({ collection: { collection_1 } });

				mock.onPost(`/queryCollection`).replyOnce(200, {
					recordMap: {
						block: {
							block_1
						}
					}
				});

				// This collection contains template pages
				await notion_cache.initializeCacheForSpecificData('collection_1', 'collection');

				expect(deepEqual(notion_cache.cache.block.get('block_1'), block_1.value)).toBe(true);
			});
		});
	});

	it(`Should throw error for unsupported data`, async () => {
		const notion_cache = new NotionCache({
			token: 'token'
		});

		expect(() =>
			notion_cache.initializeCacheForSpecificData('a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c', 'unknown' as any)
		).rejects.toThrow(`unknown data is not supported`);
	});
});
