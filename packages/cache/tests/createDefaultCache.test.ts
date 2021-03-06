import { NotionCache } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCache.createDefaultCache`, () => {
	expect(NotionCache.validateCache(NotionCache.createDefaultCache())).toBeTruthy();
});
