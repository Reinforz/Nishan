import { NotionCacheClass, NotionCacheObject } from '../src';

import { RecordMap } from '@nishans/types';

afterEach(() => {
	jest.clearAllMocks();
});

describe('NotionCache class', () => {
	it(`constructor`, () => {
		// It should throw if cache passed is not correct
		expect(
			() =>
				new NotionCacheClass({
					cache: {
						block: new Map()
					}
				} as any)
		).toThrow();

		expect(() => new NotionCacheClass({} as any)).toThrow(`Token not provided`);
	});

	it(`getConfigs method`, () => {
		const notion_cache = new NotionCacheClass({
			token: 'token'
		});

		expect(notion_cache.getConfigs()).toStrictEqual({
			token: 'token',
			user_id: '',
			interval: 500
		});
	});

	it(`saveToCache`, () => {
		const notion_cache = new NotionCacheClass({
			token: 'token'
		});
		const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => {
			return {} as any;
		});
		notion_cache.saveToCache({
			block: 'block'
		} as any);
		expect(saveToCacheMock.mock.calls.length).toBe(1);
		expect(saveToCacheMock.mock.calls[saveToCacheMock.mock.calls.length - 1][0]).toStrictEqual({
			block: 'block'
		});
	});

	it(`returnNonCachedData`, () => {
		const notion_cache = new NotionCacheClass({
			token: 'token',
			interval: 0
		});
		const returnNonCachedDataMock = jest.spyOn(NotionCacheObject, 'returnNonCachedData').mockImplementationOnce(() => {
			return {} as any;
		});
		notion_cache.returnNonCachedData([ [ '123', 'block' ] ]);
		expect(returnNonCachedDataMock.mock.calls.length).toBe(1);
		expect(returnNonCachedDataMock.mock.calls[returnNonCachedDataMock.mock.calls.length - 1][0]).toStrictEqual([
			[ '123', 'block' ]
		]);
	});

	it(`initializeNotionCache`, async () => {
		const notion_cache = new NotionCacheClass({
			token: 'token',
			interval: 0
		});
		const initializeNotionCacheMock = jest
			.spyOn(NotionCacheObject, 'initializeNotionCache')
			.mockImplementationOnce(() => {
				return {} as any;
			});
		await notion_cache.initializeNotionCache();
		expect(initializeNotionCacheMock.mock.calls.length).toBe(1);
		expect(initializeNotionCacheMock.mock.calls[initializeNotionCacheMock.mock.calls.length - 1][0]).toStrictEqual({
			interval: 0,
			token: 'token',
			user_id: ''
		});
	});

	it(`updateCacheManually`, async () => {
		const notion_cache = new NotionCacheClass({
			token: 'token',
			interval: 0
		});
		const updateCacheManuallyMock = jest.spyOn(NotionCacheObject, 'updateCacheManually').mockImplementationOnce(() => {
			return {} as any;
		});
		await notion_cache.updateCacheManually([ [ '123', 'block' ] ]);
		expect(updateCacheManuallyMock.mock.calls.length).toBe(1);
		expect(updateCacheManuallyMock.mock.calls[updateCacheManuallyMock.mock.calls.length - 1][0]).toStrictEqual([
			[ '123', 'block' ]
		]);
		expect(updateCacheManuallyMock.mock.calls[updateCacheManuallyMock.mock.calls.length - 1][1]).toStrictEqual({
			interval: 0,
			token: 'token',
			user_id: ''
		});
	});

	it(`updateCacheIfNotPresent`, async () => {
		const notion_cache = new NotionCacheClass({
			token: 'token',
			interval: 0
		});
		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCacheObject, 'updateCacheIfNotPresent')
			.mockImplementationOnce(() => {
				return {} as any;
			});
		await notion_cache.updateCacheIfNotPresent([ [ '123', 'block' ] ]);
		expect(updateCacheIfNotPresentMock.mock.calls.length).toBe(1);
		expect(updateCacheIfNotPresentMock.mock.calls[updateCacheIfNotPresentMock.mock.calls.length - 1][0]).toStrictEqual([
			[ '123', 'block' ]
		]);
		expect(updateCacheIfNotPresentMock.mock.calls[updateCacheIfNotPresentMock.mock.calls.length - 1][1]).toStrictEqual({
			interval: 0,
			token: 'token',
			user_id: ''
		});
	});

	it(`initializeCacheForSpecificData`, async () => {
		const notion_cache = new NotionCacheClass({
			token: 'token',
			interval: 0,
			user_id: '123'
		});
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCacheObject, 'initializeCacheForSpecificData')
			.mockImplementationOnce(() => {
				return {} as any;
			});
		await notion_cache.initializeCacheForSpecificData('123', 'block');
		expect(initializeCacheForSpecificDataMock.mock.calls.length).toBe(1);
		expect(
			initializeCacheForSpecificDataMock.mock.calls[initializeCacheForSpecificDataMock.mock.calls.length - 1][0]
		).toStrictEqual('123');
		expect(
			initializeCacheForSpecificDataMock.mock.calls[initializeCacheForSpecificDataMock.mock.calls.length - 1][1]
		).toStrictEqual('block');
		expect(
			initializeCacheForSpecificDataMock.mock.calls[initializeCacheForSpecificDataMock.mock.calls.length - 1][2]
		).toStrictEqual({
			interval: 0,
			token: 'token',
			user_id: '123'
		});
	});
});
