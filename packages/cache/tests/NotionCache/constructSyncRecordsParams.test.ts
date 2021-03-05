import { NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('constructSyncRecordsParams', () => {
	it(`should work correctly`, async () => {
		const result = NotionCache.constructSyncRecordsParams([ [ '123', 'block' ] ]);
		expect(result).toStrictEqual([
			{
				table: 'block',
				id: '123',
				version: 0
			}
		]);
	});
});
