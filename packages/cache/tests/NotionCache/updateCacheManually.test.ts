import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`updateCacheManually`, async () => {
	const update_cache_manually_args: UpdateCacheManuallyParam = [ [ 'collection_1', 'collection' ] ];
	const constructSyncRecordsParamsMock = jest
		.spyOn(NotionCache, 'constructAndSyncRecordsParams')
		.mockImplementationOnce(async () => undefined);
	await NotionCache.updateCacheManually(
		update_cache_manually_args,
		{ token: 'token' },
		NotionCache.createDefaultCache()
	);
	expect(constructSyncRecordsParamsMock.mock.calls[0][0]).toBe(update_cache_manually_args);
	expect(constructSyncRecordsParamsMock.mock.calls[0][1]).toBe({ token: 'token' });
});
