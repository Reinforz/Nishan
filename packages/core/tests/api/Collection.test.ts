import { NotionCacheObject } from '@nishans/cache';
import { CreateData, IPageCreateInput } from '@nishans/fabricator';
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { NotionOperationsObject } from '@nishans/operations';
import { Schema } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { v4 } from 'uuid';
import { csu, tsu, txsu } from '../../../fabricator/tests/utils';
import { Collection, ICollectionUpdateInput, NotionData, TCollectionUpdateKeys } from '../../libs';
import { default_nishan_arg, o } from '../utils';

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
		.mockImplementationOnce(async () => undefined);

	const collection_update_args: ICollectionUpdateInput = {
		description: [ [ 'New Description' ] ]
	};

	await collection.update(collection_update_args);

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

	const createContentsDataMock = jest.spyOn(CreateData, 'contents').mockImplementationOnce(async () => undefined);

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

	expect(createContentsDataMock.mock.calls[0][0]).toStrictEqual(create_templates_params);
	expect(createContentsDataMock.mock.calls[0][1]).toStrictEqual('collection_1');
	expect(createContentsDataMock.mock.calls[0][2]).toStrictEqual('collection');
});

describe('template pages', () => {
	const templateCrudSetup = () => {
		const collection_1 = {
				id: 'collection_1',
				template_pages: [ 'block_1' ]
			},
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { id: 'block_1' } ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ])
			} as any,
			initializeCacheForSpecificDataMock = jest
				.spyOn(NotionData.prototype, 'initializeCacheForSpecificData')
				.mockImplementationOnce(async () => undefined),
			executeOperationsMock = jest
				.spyOn(NotionOperationsObject, 'executeOperations')
				.mockImplementation(async () => undefined);

		const collection = new Collection({
			...default_nishan_arg,
			cache,
			id: 'collection_1'
		});
		return { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock };
	};

	it(`getTemplates`, async () => {
		const { collection, initializeCacheForSpecificDataMock } = templateCrudSetup();
		const page_obj = await collection.getTemplate('block_1');
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledWith('collection_1', 'collection');
		expect(page_obj.getCachedData()).toStrictEqual(
			expect.objectContaining({
				id: 'block_1'
			})
		);
	});

	it(`updateTemplates`, async () => {
		const { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock } = templateCrudSetup();
		const pages = await collection.updateTemplate([ 'block_1', { alive: true } as any ]);

		expect(initializeCacheForSpecificDataMock).toBeCalledWith('collection_1', 'collection');
		expect(cache.block.get('block_1')).toStrictEqual(
			expect.objectContaining({
				alive: true
			})
		);
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.b.u(
				'block_1',
				[],
				expect.objectContaining({
					alive: true
				})
			)
		]);
		expect(pages.getCachedData()).toStrictEqual(
			expect.objectContaining({
				alive: true
			})
		);
	});

	it(`deleteTemplates`, async () => {
		const { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock } = templateCrudSetup();
		await collection.deleteTemplate('block_1');

		expect(initializeCacheForSpecificDataMock).toBeCalledWith('collection_1', 'collection');
		expect(cache.block.get('block_1')).toStrictEqual(
			expect.objectContaining({
				alive: false
			})
		);
		expect(cache.collection.get('collection_1')).toStrictEqual(
			expect.objectContaining({
				template_pages: []
			})
		);

		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.c.lr('collection_1', [ 'template_pages' ], { id: 'block_1' })
		]);
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.b.u(
				'block_1',
				[],
				expect.objectContaining({
					alive: false
				})
			)
		]);
	});
});

describe('rows', () => {
	const rowCrudSetup = () => {
		const collection_1 = {
				id: 'collection_1'
			},
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([
					[ 'block_1', { id: 'block_1', parent_table: 'collection', parent_id: 'collection_1', type: 'page' } ]
				]),
				collection: new Map([ [ 'collection_1', collection_1 ] ])
			} as any,
			initializeCacheForSpecificDataMock = jest
				.spyOn(NotionData.prototype, 'initializeCacheForSpecificData')
				.mockImplementationOnce(async () => undefined),
			executeOperationsMock = jest
				.spyOn(NotionOperationsObject, 'executeOperations')
				.mockImplementation(async () => undefined);

		const collection = new Collection({
			...default_nishan_arg,
			cache,
			id: 'collection_1'
		});
		return { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock };
	};

	it(`createRows`, async () => {
		const { cache, collection, executeOperationsMock } = rowCrudSetup();
		const block_id = v4();

		await collection.createRows([
			{
				id: block_id,
				type: 'page',
				properties: {
					title: [ [ 'Page' ] ]
				},
				contents: []
			}
		]);

		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.b.u(block_id, [], expect.objectContaining({ id: block_id }))
		]);
		expect(cache.block.get(block_id)).toStrictEqual(expect.objectContaining({ id: block_id }));
	});

	it(`getRow`, async () => {
		const { collection, initializeCacheForSpecificDataMock } = rowCrudSetup();

		const row = await collection.getRow('block_1');

		expect(row.getCachedData()).toStrictEqual(expect.objectContaining({ id: 'block_1' }));
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledWith('collection_1', 'collection');
	});

	it(`updateRow`, async () => {
		const { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock } = rowCrudSetup();

		const row_page = await collection.updateRow([ 'block_1', { alive: true } ] as any);

		expect(cache.block.get('block_1')).toStrictEqual(
			expect.objectContaining({
				alive: true
			})
		);
		expect(row_page.getCachedData()).toStrictEqual(
			expect.objectContaining({
				alive: true
			})
		);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledWith('collection_1', 'collection');
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.b.u(
				'block_1',
				[],
				expect.objectContaining({
					alive: true
				})
			)
		]);
	});

	it(`deleteRow`, async () => {
		const { cache, collection, executeOperationsMock, initializeCacheForSpecificDataMock } = rowCrudSetup();

		await collection.deleteRow('block_1');

		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledWith('collection_1', 'collection');
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.b.u(
				'block_1',
				[],
				expect.objectContaining({
					alive: false
				})
			)
		]);
		expect(cache.block.get('block_1')).toStrictEqual(
			expect.objectContaining({
				alive: false
			})
		);
	});
});

describe('schema unit', () => {
	const schemaUnitCrudSetup = () => {
		const schema: Schema = {
				title: {
					type: 'title',
					name: 'Title'
				},
				checkbox: csu
			},
			collection_1 = {
				id: 'collection_1',
				schema
			},
			cache = {
				...NotionCacheObject.createDefaultCache(),
				collection: new Map([ [ 'collection_1', collection_1 ] ])
			} as any,
			initializeCacheForSpecificDataMock = jest
				.spyOn(NotionData.prototype, 'initializeCacheForSpecificData')
				.mockImplementationOnce(async () => undefined),
			executeOperationsMock = jest
				.spyOn(NotionOperationsObject, 'executeOperations')
				.mockImplementation(async () => undefined);

		const collection = new Collection({
			...default_nishan_arg,
			cache,
			id: 'collection_1'
		});
		return { cache, collection, schema, executeOperationsMock, initializeCacheForSpecificDataMock };
	};

	it(`createSchemaUnits`, async () => {
		const { executeOperationsMock, collection, schema } = schemaUnitCrudSetup();

		await collection.createSchemaUnits([ txsu ]);
		const { schema_id } = NotionUtils.getSchemaMapUnit(generateSchemaMapFromCollectionSchema(schema), 'Text', []);

		expect(executeOperationsMock.mock.calls[0][0]).toEqual([
			o.c.u(
				'collection_1',
				[ 'schema' ],
				expect.objectContaining({
					[schema_id]: txsu
				})
			)
		]);
		expect(schema).toStrictEqual(
			expect.objectContaining({
				[schema_id]: txsu
			})
		);
	});

	it(`getSchemaUnit`, async () => {
		const { collection } = schemaUnitCrudSetup();

		const schema_unit_map = await collection.getSchemaUnit('Title');

		expect(schema_unit_map.title.get('Title')).not.toBeUndefined();
		expect(schema_unit_map.title.get('title')).not.toBeUndefined();
	});

	it(`updateSchemaUnit`, async () => {
		const { executeOperationsMock, collection, schema } = schemaUnitCrudSetup();
		const new_schema = {
			title: {
				type: 'title',
				name: 'title'
			}
		};

		const schema_unit_map = await collection.updateSchemaUnit([ 'Title', { name: 'title' } ]);

		expect(schema_unit_map.title.get('Title')).toBeUndefined();
		expect(schema_unit_map.title.get('title')).not.toBeUndefined();
		expect(schema).toStrictEqual(expect.objectContaining(new_schema));
		expect(executeOperationsMock.mock.calls[1][0]).toEqual([
			o.c.u('collection_1', [ 'schema' ], expect.objectContaining(new_schema))
		]);
	});

	describe('deleteSchemaUnit', () => {
		it(`Work correctly`, async () => {
			const { executeOperationsMock, collection, schema } = schemaUnitCrudSetup();

			await collection.deleteSchemaUnit('Checkbox');

			expect(schema.checkbox).toBeUndefined();
			expect(executeOperationsMock.mock.calls[1][0]).toEqual([
				o.c.u('collection_1', [ 'schema' ], {
					title: tsu
				})
			]);
		});

		it(`throws error when deleting title`, async () => {
			const { collection } = schemaUnitCrudSetup();
			await expect(() => collection.deleteSchemaUnit('Title')).rejects.toThrow();
		});
	});
});
