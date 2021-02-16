import { IOperation } from '@nishans/types';
import { CollectionBlock, CreateData, TViewCreateInput } from '../../src';

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

it(`createViews`, () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			block: new Map([ [ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'view_2' ] } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const createViews_params: TViewCreateInput[] = [
		{
			type: 'table',
			name: 'Table',
			schema_units: [
				{
					type: 'title',
					name: 'Title'
				}
			]
		}
	];

	const createViewsMock = jest.spyOn(CreateData, 'createViews').mockImplementationOnce(() => {
		return [
			[ 'view_1' ],
			{
				table: new Map()
			} as any
		];
	});

	collection_block.createViews(createViews_params);
	expect(createViewsMock).toHaveBeenCalledTimes(1);
	expect(createViewsMock.mock.calls[0][0]).toStrictEqual(collection_1);
	expect(createViewsMock.mock.calls[0][1]).toStrictEqual(createViews_params);

	expect(stack[stack.length - 1]).toStrictEqual({
		command: 'update',
		table: 'block',
		id: 'block_1',
		path: [],
		args: {
			view_ids: [ 'view_2', 'view_1' ]
		}
	});
});

it(`getViews`, async () => {
	const collection_1 = {
			id: 'collection_1'
		}, collection_view_1 = { id: 'collection_view_1', type: 'table', name: "Table" } as any,
		cache = {
			block: new Map([
				[ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ] } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const view_map = await collection_block.getViews(()=>true);
	expect(view_map.table.get("Table")?.getCachedData()).toStrictEqual(collection_view_1);
	expect(view_map.table.get('collection_view_1')?.getCachedData()).toStrictEqual(collection_view_1);
});

it(`updateView`, async () => {
	const collection_1 = {
			id: 'collection_1'
		}, collection_view_1 = { id: 'collection_view_1', type: 'table', name: "Table" } as any,
		cache = {
			block: new Map([
				[ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ] } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const view_map = await collection_block.updateView(['collection_view_1', {type: "board"}]);
	expect(view_map.table.get("Table")?.getCachedData()).toStrictEqual({...collection_view_1, type: "board"});
	expect(view_map.table.get("collection_view_1")?.getCachedData()).toStrictEqual({...collection_view_1, type: "board"});
});

it(`deleteView`, async () => {
	const collection_1 = {
			id: 'collection_1'
		}, collection_view_1 = { id: 'collection_view_1', type: 'table', name: "Table" } as any,
		cache = {
			block: new Map([
				[ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ] } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	await collection_block.deleteView('collection_view_1');
  expect(collection_view_1.alive).toBe(false);
});