import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionCache } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`updateCacheManually`, async () => {
	const update_cache_manually_args: UpdateCacheManuallyParam = [ [ 'collection_1', 'collection' ] ];
	const constructSyncRecordsParamsMock = jest
		.spyOn(NotionCache, 'constructAndSyncRecordsParams')
		.mockImplementationOnce(async () => undefined);
	await NotionCache.updateCacheManually(update_cache_manually_args, {
		cache: NotionCache.createDefaultCache(),
		token: 'token',
		user_id: 'user_root_1'
	});
	expect(constructSyncRecordsParamsMock.mock.calls[0][0]).toStrictEqual(update_cache_manually_args);
	expect(constructSyncRecordsParamsMock.mock.calls[0][1]).toStrictEqual(expect.objectContaining({ token: 'token' }));
});
