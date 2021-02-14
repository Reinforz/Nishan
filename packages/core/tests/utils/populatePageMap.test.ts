import { IPageMap, populatePageMap } from '../../src';
import { NotionCacheObject } from '@nishans/cache';

afterEach(() => {
	jest.clearAllMocks();
});

it(`type=page`, async () => {
	const page_map: IPageMap = {
		page: new Map(),
		collection_view_page: new Map()
	};

	const cache = {
		collection: new Map(),
		collection_view: new Map(),
		notion_user: new Map(),
		space: new Map(),
		space_view: new Map(),
		user_root: new Map(),
		user_settings: new Map(),
		block: new Map()
	} as any;

	await populatePageMap({ type: 'page', properties: { title: [ [ 'Page' ] ] } } as any, page_map, {
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	expect(page_map.page.get('block_1')).not.toBeUndefined();
	expect(page_map.page.get('Page')).not.toBeUndefined();
});

it(`type=collection_view_page`, async () => {
	const page_map: IPageMap = {
		page: new Map(),
		collection_view_page: new Map()
	};

	const cache = {
		collection: new Map([ [ 'collection_1', { name: [ [ 'Collection' ] ], id: 'collection_1' } ] ]),
		collection_view: new Map(),
		notion_user: new Map(),
		space: new Map(),
		space_view: new Map(),
		user_root: new Map(),
		user_settings: new Map(),
		block: new Map()
	} as any;

	jest.spyOn(NotionCacheObject, 'initializeCacheForSpecificData').mockImplementationOnce(() => {
		return undefined as any;
	});

	await populatePageMap({ type: 'collection_view_page', collection_id: 'collection_1' } as any, page_map, {
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	expect(page_map.collection_view_page.get('block_1')).not.toBeUndefined();
	expect(page_map.collection_view_page.get('Collection')).not.toBeUndefined();

	await populatePageMap({ type: 'collection_view_pages' } as any, page_map, {
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});
});
