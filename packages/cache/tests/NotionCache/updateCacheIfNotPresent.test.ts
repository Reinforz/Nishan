import { ICache, NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`updateCacheIfNotPresent method`, async () => {
	const cache: ICache = {
		...NotionCache.createDefaultCache(),
		collection: new Map([ [ 'collection_1', { id: 'collection_1' } as any ] ])
	};

	const syncRecordValuesMock = jest
		.spyOn(NotionCache, 'constructAndSyncRecordsParams')
		.mockImplementationOnce(async () => undefined);

	await NotionCache.updateCacheIfNotPresent(
		[ [ 'block_2', 'block' ], [ 'collection_1', 'collection' ] ],
		{ token: 'token' },
		cache
	);

	expect(syncRecordValuesMock.mock.calls[0][0]).toStrictEqual([ [ 'block_2', 'block' ] ]);
	expect(syncRecordValuesMock.mock.calls[0][1]).toBe({ token: 'token' });
});
