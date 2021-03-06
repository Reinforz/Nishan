import { NotionQueries } from '@nishans/endpoints';
import { NotionCache } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('constructAndSyncRecordsParams', () => {
	it(`sync_record_values is not empty`, async () => {
		const cache = NotionCache.createDefaultCache(),
			sync_record_values_response = {
				recordMap: {
					data: 'data'
				}
			} as any;

		const syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCache, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCache.constructAndSyncRecordsParams([ [ '123', 'block' ] ], {
			token: 'token',
			interval: 0,
			cache
		});

		expect(syncRecordValuesMock.mock.calls[0][0]).toStrictEqual({
			requests: [
				{
					table: 'block',
					id: '123',
					version: 0
				}
			]
		});
		expect(syncRecordValuesMock.mock.calls[0][1]).toStrictEqual(
			expect.objectContaining({
				token: 'token',
				interval: 0
			})
		);

		expect(saveToCacheMock.mock.calls[0][0]).toStrictEqual(sync_record_values_response.recordMap);
	});

	it(`sync_record_values is empty`, async () => {
		const cache = NotionCache.createDefaultCache(),
			sync_record_values_response = {
				recordMap: {
					data: 'data'
				}
			} as any;

		const syncRecordValuesMock = jest
				.spyOn(NotionQueries, 'syncRecordValues')
				.mockImplementationOnce(async () => sync_record_values_response),
			saveToCacheMock = jest.spyOn(NotionCache, 'saveToCache').mockImplementationOnce(() => undefined);

		await NotionCache.constructAndSyncRecordsParams([], {
			cache,
			token: 'token',
			interval: 0
		});

		expect(syncRecordValuesMock).not.toHaveBeenCalled();
		expect(saveToCacheMock).not.toHaveBeenCalled();
	});
});
