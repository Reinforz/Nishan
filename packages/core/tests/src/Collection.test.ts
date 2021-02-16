import { IOperation, Schema } from '@nishans/types';
import {
	Collection,
	createBlockMap,
	CreateData,
	IPageCreateInput,
	ISchemaUnitMap,
	TCollectionUpdateKeys,
	TSchemaUnitInput,
	NotionData
} from '../../src';
import { createDefaultCache } from '../../utils/createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getRowPageIds`, async () => {
	const cache = {
		...createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', type: 'page', parent_table: 'collection', parent_id: 'collection_1' } ],
			[ 'block_2', { id: 'block_2', type: 'page', parent_table: 'block', parent_id: 'block_1' } ]
		])
	} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementationOnce(async () => {
			cache.block.set('block_3', {
				id: 'block_3',
				type: 'page',
				parent_table: 'collection',
				parent_id: 'collection_1',
				is_template: true
			});
		});

	const row_page_ids = await collection.getRowPageIds();
	expect(row_page_ids).toStrictEqual([ 'block_1' ]);
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
});

it(`getCachedParentData`, async () => {
	const collection_1 = {
			id: 'collection_1',
			parent_id: 'block_1'
		},
		block_1 = { id: 'block_1', type: 'page' },
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const parent_data = collection.getCachedParentData();
	expect(parent_data).toStrictEqual(block_1);
});

it(`update`, async () => {
	const collection_1 = {
			id: 'collection_1',
			parent_id: 'block_1'
		},
		block_1 = { id: 'block_1', type: 'page' },
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest
		.spyOn(NotionData.prototype, 'updateCacheLocally')
		.mockImplementationOnce(() => {});

	collection.update({
		description: [ [ 'New Description' ] ]
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			description: [ [ 'New Description' ] ]
		},
		TCollectionUpdateKeys
	);
});

it(`createTemplates`, async () => {
	const collection_1 = {
			id: 'collection_1',
			parent_id: 'block_1'
		},
		block_1 = { id: 'block_1', type: 'page' },
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest.spyOn(CreateData, 'createContents').mockImplementationOnce(async () => {
		return createBlockMap();
	});

	const create_templates_params: IPageCreateInput[] = [
		{
			type: 'page',
			properties: {
				title: [ [ 'Page' ] ]
			}
		}
	];

	await collection.createTemplates(create_templates_params);

	expect(updateCacheLocallyMock.mock.calls[0][0]).toStrictEqual(create_templates_params);

	expect(updateCacheLocallyMock.mock.calls[0][1]).toStrictEqual('collection_1');

	expect(updateCacheLocallyMock.mock.calls[0][2]).toStrictEqual('collection');
});

it(`getTemplates`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			...createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const getIterateMock = jest
		.spyOn(NotionData.prototype, 'getIterate' as any)
		.mockImplementationOnce(async (a, b, c: any, d: any) => {
			c();
			d('block1', undefined, []);
			return [];
		});

	await collection.getTemplate('block_1');

	expect(getIterateMock.mock.calls[0][0]).toStrictEqual([ 'block_1' ]);
	expect(getIterateMock.mock.calls[0][1]).toStrictEqual({
		child_ids: 'template_pages',
		multiple: false,
		child_type: 'block',
		container: []
	});
});

it(`updateTemplates`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			...createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateIterateMock = jest
		.spyOn(NotionData.prototype, 'updateIterate' as any)
		.mockImplementationOnce(async (a, b, c: any, d: any) => {
			c();
			d('block1', undefined, undefined, []);
			return [];
		});

	await collection.updateTemplate([ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ]);

	expect(updateIterateMock.mock.calls[0][0]).toStrictEqual([
		[ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ]
	]);

	expect(updateIterateMock.mock.calls[0][1]).toStrictEqual({
		child_ids: 'template_pages',
		multiple: false,
		child_type: 'block',
		container: []
	});
});

it(`deleteTemplates`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			...createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const deleteIterateMock = jest
		.spyOn(NotionData.prototype, 'deleteIterate' as any)
		.mockImplementationOnce(async (a, b, c: any) => {
			c();
		});

	await collection.deleteTemplate('block_1');

	expect(deleteIterateMock.mock.calls[0][0]).toStrictEqual([ 'block_1' ]);

	expect(deleteIterateMock.mock.calls[0][1]).toStrictEqual({
		child_ids: 'template_pages',
		multiple: false,
		child_type: 'block',
		child_path: 'template_pages',
		container: []
	});
});

it(`createRows`, async () => {
	const collection_1 = {
			id: 'collection_1',
			parent_id: 'block_1'
		},
		block_1 = { id: 'block_1', type: 'page' },
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest.spyOn(CreateData, 'createContents').mockImplementationOnce(async () => {
		return createBlockMap();
	});

	const create_row_params: IPageCreateInput[] = [
		{
			type: 'page',
			properties: {
				title: [ [ 'Page' ] ]
			}
		}
	];

	await collection.createRows(create_row_params);

	expect(updateCacheLocallyMock.mock.calls[0][0]).toStrictEqual(create_row_params);

	expect(updateCacheLocallyMock.mock.calls[0][1]).toStrictEqual('collection_1');

	expect(updateCacheLocallyMock.mock.calls[0][2]).toStrictEqual('collection');
});

it(`getRow`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			...createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const getIterateMock = jest
		.spyOn(NotionData.prototype, 'getIterate' as any)
		.mockImplementationOnce(async (a, b, c: any, d: any) => {
			c();
			d('block1', undefined, []);
			return [];
		});

	const getRowPageIdsMock = jest.spyOn(Collection.prototype, 'getRowPageIds').mockImplementationOnce(async () => {
		return [ 'block_1' ];
	});

	await collection.getRow('block_1');

	expect(getRowPageIdsMock).toHaveBeenCalledTimes(1);

	expect(getIterateMock.mock.calls[0][0]).toStrictEqual([ 'block_1' ]);
	expect(getIterateMock.mock.calls[0][1]).toStrictEqual({
		child_ids: [ 'block_1' ],
		multiple: false,
		child_type: 'block',
		container: []
	});
});

it(`updateRow`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		cache = {
			...createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateIterateMock = jest
		.spyOn(NotionData.prototype, 'updateIterate' as any)
		.mockImplementationOnce(async (a, b, c: any, d: any) => {
			c();
			d('block1', undefined, undefined, []);
			return [];
		});

	const getRowPageIdsMock = jest.spyOn(Collection.prototype, 'getRowPageIds').mockImplementationOnce(async () => {
		return [ 'block_1' ];
	});

	await collection.updateRow([ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ]);

	expect(getRowPageIdsMock).toHaveBeenCalledTimes(1);

	expect(updateIterateMock.mock.calls[0][0]).toStrictEqual([
		[ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ]
	]);

	expect(updateIterateMock.mock.calls[0][1]).toStrictEqual({
		child_ids: [ 'block_1' ],
		multiple: false,
		child_type: 'block',
		container: []
	});
});

it(`deleteRow`, async () => {
	const collection_1 = {
			id: 'collection_1'
		},
		block_1 = { id: 'block_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const getRowPageIdsMock = jest.spyOn(Collection.prototype, 'getRowPageIds').mockImplementationOnce(async () => {
		return [ 'block_1' ];
	});

	jest.spyOn(NotionData.prototype, 'initializeCacheForThisData').mockImplementationOnce(async () => {});

	await collection.deleteRow('block_1');

	expect(getRowPageIdsMock).toHaveBeenCalledTimes(1);
	expect(stack[0]).toMatchSnapshot({
		command: 'update',
		table: 'block',
		path: [],
		id: 'block_1',
		args: {
			alive: false,
			last_edited_time: expect.any(Number),
			last_edited_by_table: 'notion_user',
			last_edited_by_id: 'user_root_1'
		}
	});

	expect(block_1.alive).toBe(false);
});

it(`createSchemaUnits`, async () => {
	const current_schema: Schema = {
		title: {
			type: 'title',
			name: 'Title'
		}
	};
	const collection_1 = {
			id: 'collection_1',
			name: [ [ 'Collection' ] ],
			schema: current_schema
		},
		block_1 = { id: 'block_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const createSchemaMock = jest.spyOn(CreateData, 'createSchema').mockImplementationOnce(async () => {
		return [ {} as Schema, new Map() as any, new Map() as any ];
	});

	const createSchemaUnitsArgs: TSchemaUnitInput[] = [
		{
			type: 'checkbox',
			name: 'Checkbox'
		}
	];

	await collection.createSchemaUnits(createSchemaUnitsArgs);

	expect(createSchemaMock.mock.calls[0][0]).toStrictEqual(createSchemaUnitsArgs);
	expect(createSchemaMock.mock.calls[0][1].name).toStrictEqual([ [ 'Collection' ] ]);
	expect(createSchemaMock.mock.calls[0][1].parent_collection_id).toBe('collection_1');
	expect(createSchemaMock.mock.calls[0][1].current_schema).toStrictEqual(current_schema);
	expect(stack[0].command).toBe('update');
	expect(stack[0].table).toBe('collection');
	expect(stack[0].id).toBe('collection_1');
});

it(`getSchemaUnit`, async () => {
	const current_schema: Schema = {
		title: {
			type: 'title',
			name: 'Title'
		}
	};
	const collection_1 = {
			id: 'collection_1',
			name: [ [ 'Collection' ] ],
			schema: current_schema
		},
		block_1 = { id: 'block_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const schema_unit_map = await collection.getSchemaUnit('Title');
	expect(schema_unit_map.title.get('Title')).not.toBeUndefined();
	expect(schema_unit_map.title.get('title')).not.toBeUndefined();
});

it(`updateSchemaUnit`, async () => {
	const current_schema: Schema = {
		title: {
			type: 'title',
			name: 'Title'
		}
	};
	const collection_1 = {
			id: 'collection_1',
			name: [ [ 'Collection' ] ],
			schema: current_schema
		},
		block_1 = { id: 'block_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	const schema_unit_map = await collection.updateSchemaUnit([ 'Title', { type: 'checkbox', name: 'Checkbox' } ]);

	expect(schema_unit_map.checkbox.get('Checkbox')).not.toBeUndefined();
	expect(schema_unit_map.checkbox.get('title')).not.toBeUndefined();
	expect(current_schema).toStrictEqual({
		title: {
			type: 'checkbox',
			name: 'Checkbox'
		}
	});
	expect(stack[0].command).toBe('update');
	expect(stack[0].table).toBe('collection');
});

it(`deleteSchemaUnit`, async () => {
	const current_schema: Schema = {
		title: {
			type: 'title',
			name: 'Title'
		},
		checkbox: {
			type: 'checkbox',
			name: 'Checkbox'
		}
	};
	const collection_1 = {
			id: 'collection_1',
			name: [ [ 'Collection' ] ],
			schema: current_schema
		},
		block_1 = { id: 'block_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		cache,
		id: 'collection_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	await collection.deleteSchemaUnit('Checkbox');

	expect(current_schema).toStrictEqual({
		title: {
			type: 'title',
			name: 'Title'
		}
	});
	expect(stack[0].command).toBe('update');
	expect(stack[0].table).toBe('collection');
});
