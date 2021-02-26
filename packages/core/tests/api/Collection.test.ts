import { NotionCacheObject } from '@nishans/cache';
import { CreateData, IPageCreateInput, TSchemaUnitInput } from '@nishans/fabricator';
import { IOperation, Schema } from '@nishans/types';
import { Collection, ICollectionUpdateInput, NotionData, TCollectionUpdateKeys } from '../../libs';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getRowPageIds`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', type: 'page', parent_table: 'collection', parent_id: 'collection_1' } ],
			[ 'block_2', { id: 'block_2', type: 'page', parent_table: 'block', parent_id: 'block_1' } ]
		])
	} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
	});

	const updateCacheLocallyMock = jest
		.spyOn(NotionData.prototype, 'updateCacheLocally')
		.mockImplementationOnce(() => {});

	const collection_update_args: ICollectionUpdateInput = {
		description: [ [ 'New Description' ] ]
	};

	collection.update(collection_update_args);

	expect(updateCacheLocallyMock).toHaveBeenCalledWith(collection_update_args, TCollectionUpdateKeys);
});

it(`createTemplates`, async () => {
	const collection_1 = {
			id: 'collection_1',
			parent_id: 'block_1'
		},
		block_1 = { id: 'block_1', type: 'page' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
	});

	const updateCacheLocallyMock = jest.spyOn(CreateData, 'contents').mockImplementationOnce(async () => {
		return undefined;
	});

	const create_templates_params: IPageCreateInput[] = [
		{
			type: 'page',
			properties: {
				title: [ [ 'Page' ] ]
			},
			contents: []
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
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
	});

	const updateIterateMock = jest
		.spyOn(NotionData.prototype, 'updateIterate' as any)
		.mockImplementationOnce(async (a, b, c: any, d: any) => {
			c();
			d('block1', undefined, undefined, []);
			return [];
		});

	const update_template_args = [ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ] as any;

	await collection.updateTemplate(update_template_args);

	expect(updateIterateMock.mock.calls[0][0]).toStrictEqual([ update_template_args ]);
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
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
	});

	const updateCacheLocallyMock = jest.spyOn(CreateData, 'contents').mockImplementationOnce(async () => {});

	const create_row_params: IPageCreateInput[] = [
		{
			type: 'page',
			properties: {
				title: [ [ 'Page' ] ]
			},
			contents: []
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
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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
			...NotionCacheObject.createDefaultCache(),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any;

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1'
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

	const updaterow_args = [ 'block_1', { properties: { name: [ [ 'New Name' ] ] } } ] as any;

	await collection.updateRow(updaterow_args);

	expect(getRowPageIdsMock).toHaveBeenCalledTimes(1);
	expect(updateIterateMock.mock.calls[0][0]).toStrictEqual([ updaterow_args ]);
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1',
		stack
	});

	const getRowPageIdsMock = jest.spyOn(Collection.prototype, 'getRowPageIds').mockImplementationOnce(async () => {
		return [ 'block_1' ];
	});

	jest.spyOn(NotionData.prototype, 'initializeCacheForThisData').mockImplementationOnce(async () => {});

	await collection.deleteRow('block_1');

	expect(getRowPageIdsMock).toHaveBeenCalledTimes(1);
	expect(stack[0]).toStrictEqual(
		o.b.u('block_1', [], {
			alive: false,
			...last_edited_props
		})
	);

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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1',
		stack
	});

	const createSchemaUnitsArgs: TSchemaUnitInput[] = [
		{
			type: 'checkbox',
			name: 'Checkbox'
		}
	];

	await collection.createSchemaUnits(createSchemaUnitsArgs);

	expect(stack[0]).toEqual(
		o.c.u(
			'collection_1',
			[ 'schema' ],
			expect.objectContaining({
				title: {
					type: 'title',
					name: 'Title'
				}
			})
		)
	);
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1',
		stack
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1',
		stack
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
	expect(stack[0]).toEqual(
		o.c.u('collection_1', [ 'schema' ], {
			title: {
				type: 'checkbox',
				name: 'Checkbox'
			}
		})
	);
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const collection = new Collection({
		...default_nishan_arg,
		cache,
		id: 'collection_1',
		stack
	});

	await collection.deleteSchemaUnit('Checkbox');

	expect(current_schema).toStrictEqual({
		title: {
			type: 'title',
			name: 'Title'
		}
	});
	expect(stack[0]).toEqual(
		o.c.u('collection_1', [ 'schema' ], {
			title: {
				type: 'title',
				name: 'Title'
			}
		})
	);
});
