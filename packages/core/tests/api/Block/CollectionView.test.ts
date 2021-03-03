import { NotionCacheObject } from '@nishans/cache';
import { CollectionView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2', parent_id: 'block_1' } ] ])
	} as any;

	const collection_view = new CollectionView({
		...default_nishan_arg,
		cache,
		id: 'block_2'
	});

	expect(await collection_view.getCachedParentData()).toStrictEqual({
		id: 'block_1'
	});
});
