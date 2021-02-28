import { NotionCacheObject } from '@nishans/cache';
import { TViewCreateInput } from '@nishans/fabricator';
import { IOperation } from '@nishans/types';
import { tsu } from "../../../../fabricator/tests/utils";
import { CollectionBlock } from "../../../libs";
import { default_nishan_arg, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCollection`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
      ...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', collection_id: 'collection_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
		} as any;

	const collection_block = new CollectionBlock({
    ...default_nishan_arg,
		cache,
	});

	const collection = await collection_block.getCollection();
	expect(collection.getCachedData()).toStrictEqual(collection_1);
});

it(`createViews`, async () => {
	const collection_1 = {
			id: 'collection_1',
      schema: {
        title: tsu
      }
		},
		cache = {
      ...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'view_2' ] } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
    ...default_nishan_arg,
		cache,
		stack,
	});

	const createViews_params: TViewCreateInput[] = [
		{
			type: 'table',
			name: 'Table',
			schema_units: [
				tsu
			]
		}
	];

	const view_map = await collection_block.createViews(createViews_params);

	expect(stack[stack.length - 1]).toStrictEqual(
		o.b.u('block_1', [], {
			view_ids: [ 'view_2', expect.any(String) ]
		}));
  expect(view_map.table.get("Table")).not.toBeUndefined();
});

it(`getViews`, async () => {
	const collection_1 = {
			id: 'collection_1'
		}, collection_view_1 = { id: 'collection_view_1', type: 'table', name: "Table" } as any,
		cache = {
      ...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ], parent_table: 'space', parent_id: 'space_1' } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
      space: new Map([['space_1', {id: 'space_1'}]])
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
    ...default_nishan_arg,
		cache,
		stack,
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
      ...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ], parent_table: 'space', parent_id: 'space_1'  } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
      space: new Map([['space_1', {id: 'space_1'}]])
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
    ...default_nishan_arg,
		cache,
		stack,
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
      ...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { type: 'collection_view_page', id: 'block_1', collection_id: 'collection_1', view_ids: [ 'collection_view_1' ], parent_table: 'space', parent_id: 'space_1'  } ]
			]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ]),
      space: new Map([['space_1', {id: 'space_1'}]])
		} as any,
		stack: IOperation[] = [];

	const collection_block = new CollectionBlock({
    ...default_nishan_arg,
		cache,
		stack,
	});

	await collection_block.deleteView('collection_view_1');
  expect(collection_view_1.alive).toBe(false);
});