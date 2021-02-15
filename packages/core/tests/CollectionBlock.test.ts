import { CollectionBlock } from '../src';

it(`getCollection`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			block: new Map([ [ 'block_1', { id: 'block_1', collection_id: 'collection_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		} as any;

	const collection_block = new CollectionBlock({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const collection = await collection_block.getCollection();
	expect(collection.getCachedData()).toStrictEqual(collection_1);
});
