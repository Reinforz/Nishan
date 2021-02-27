import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCacheClass, NotionCacheObject } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const notion_request_configs = {
	token: 'token',
	interval: 0,
	user_id: 'user_id'
};

describe('NotionCache class', () => {
	it(`constructor`, () => {
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
			interval: 500,
			user_id: ''
		});
	});

	it(`saveToCache`, () => {
		const notion_cache = new NotionCacheClass({
			token: 'token'
		});
		const saveToCacheMock = jest.spyOn(NotionCacheObject, 'saveToCache').mockImplementationOnce(() => undefined);
		const save_to_cache_arg = {
			block: 'block'
		} as any;
		notion_cache.saveToCache(save_to_cache_arg);
		expect(saveToCacheMock.mock.calls.length).toBe(1);
		expect(saveToCacheMock.mock.calls[saveToCacheMock.mock.calls.length - 1][0]).toBe(save_to_cache_arg);
	});

	it(`returnNonCachedData`, () => {
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const returnNonCachedDataMock = jest
			.spyOn(NotionCacheObject, 'returnNonCachedData')
			.mockImplementationOnce(() => []);
		const return_noncached_data_arg: UpdateCacheManuallyParam = [ [ '123', 'block' ] ];
		notion_cache.returnNonCachedData(return_noncached_data_arg);
		expect(returnNonCachedDataMock.mock.calls.length).toBe(1);
		expect(returnNonCachedDataMock.mock.calls[0][0]).toBe(return_noncached_data_arg);
	});

	it(`initializeNotionCache`, async () => {
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const initializeNotionCacheMock = jest
			.spyOn(NotionCacheObject, 'initializeNotionCache')
			.mockImplementationOnce(() => {
				return {} as any;
			});
		await notion_cache.initializeNotionCache();
		expect(initializeNotionCacheMock.mock.calls.length).toBe(1);
		expect(initializeNotionCacheMock.mock.calls[0][0]).toStrictEqual(notion_request_configs);
	});

	it(`updateCacheManually`, async () => {
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const updateCacheManuallyMock = jest
			.spyOn(NotionCacheObject, 'updateCacheManually')
			.mockImplementationOnce(async () => undefined);
		await notion_cache.updateCacheManually([ [ '123', 'block' ] ]);
		expect(updateCacheManuallyMock.mock.calls.length).toBe(1);
		expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ '123', 'block' ] ]);
		expect(updateCacheManuallyMock.mock.calls[0][1]).toStrictEqual(notion_request_configs);
	});

	it(`updateCacheIfNotPresent`, async () => {
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const updateCacheIfNotPresentMock = jest
			.spyOn(NotionCacheObject, 'updateCacheIfNotPresent')
			.mockImplementationOnce(async () => undefined);
		await notion_cache.updateCacheIfNotPresent([ [ '123', 'block' ] ]);
		expect(updateCacheIfNotPresentMock.mock.calls.length).toBe(1);
		expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([ [ '123', 'block' ] ]);
		expect(updateCacheIfNotPresentMock.mock.calls[0][1]).toStrictEqual(notion_request_configs);
	});

	it(`initializeCacheForSpecificData`, async () => {
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCacheObject, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined);
		await notion_cache.initializeCacheForSpecificData('123', 'block');
		expect(initializeCacheForSpecificDataMock.mock.calls.length).toBe(1);
		expect(initializeCacheForSpecificDataMock.mock.calls[0][0]).toStrictEqual('123');
		expect(initializeCacheForSpecificDataMock.mock.calls[0][1]).toStrictEqual('block');
		expect(initializeCacheForSpecificDataMock.mock.calls[0][2]).toStrictEqual(notion_request_configs);
	});

	it(`fetchDataOrReturnCached`, async () => {
		const block_1: any = {
			id: 'block_1'
		};
		const notion_cache = new NotionCacheClass(notion_request_configs);
		const fetchDataOrReturnCachedMock = jest
			.spyOn(NotionCacheObject, 'fetchDataOrReturnCached')
			.mockImplementationOnce(async () => block_1);
		await notion_cache.fetchDataOrReturnCached('block', 'block_1');
		expect(fetchDataOrReturnCachedMock.mock.calls[0][0]).toBe('block');
		expect(fetchDataOrReturnCachedMock.mock.calls[0][1]).toBe('block_1');
	});
});
