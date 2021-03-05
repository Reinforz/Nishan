import { ICache, NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`data exists in cache`, async () => {
	const block_1 = {
			id: 'block_1'
		},
		cache: ICache = {
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any;
	const data = await NotionCache.fetchDataOrReturnCached(
		'block',
		'block_1',
		{
			token: 'token'
		},
		cache
	);
	expect(data).toBe(block_1);
});
