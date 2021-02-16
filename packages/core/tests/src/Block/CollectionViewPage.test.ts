import { CollectionViewPage } from '../../../src';
import { createDefaultCache } from '../../../utils/createDefaultCache';

it(`getCachedParentData`, () => {
	const cache = {
		...createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1' } ],
			[ 'block_2', { id: 'block_2', parent_id: 'block_1', parent_table: 'block' } ]
		])
	} as any;

	const collection_view_page = new CollectionViewPage({
		cache,
		id: 'block_2',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const parent_data = collection_view_page.getCachedParentData();
	expect(parent_data).toStrictEqual({
		id: 'block_1'
	});
});
