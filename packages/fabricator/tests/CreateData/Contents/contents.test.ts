import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionOperations } from '@nishans/operations';
import { ICollectionView, IColumn, IColumnList, IFactory, ITodo } from '@nishans/types';
import { v4 } from 'uuid';
import { default_nishan_arg, last_edited_props, o } from '../../../../core/tests/utils';
import { NotionFabricator } from '../../../libs';
import { tsu } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const space_id = 'space_1',
	user_id = 'user_root_1',
	shard_id = 123;

const metadata = {
	created_time: expect.any(Number),
	created_by_id: user_id,
	created_by_table: 'notion_user',
	...last_edited_props,
	space_id,
	shard_id,
	version: 0,
	alive: true
};

it(`is_template=true,contents=[],parent=collection`, async () => {
	const collection_id = v4(),
		collection_1 = { id: collection_id } as any,
		page_id = v4();
	const common_page_snapshot = {
		...metadata,
		type: 'page',
		properties: {
			title: [ [ 'Page' ] ]
		},
		content: [],
		parent_id: space_id,
		parent_table: 'space',
		alive: true,
		format: {
			block_color: 'blue'
		},
		permissions: [
			{
				type: 'user_permission',
				role: 'editor',
				user_id
			}
		]
	};
	const cache = {
			...NotionCache.createDefaultCache(),
			collection: new Map([ [ collection_id, collection_1 ] ])
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const logger_spy = jest.fn();

	await NotionFabricator.CreateData.contents(
		[
			{
				type: 'page',
				properties: { title: [ [ 'Page' ] ] },
				format: {
					block_color: 'blue'
				},
				isPrivate: true,
				is_template: true,
				id: page_id,
				contents: []
			}
		],
		collection_id,
		'collection',
		{
			...default_nishan_arg,
			cache,
			logger: logger_spy
		}
	);

	expect(logger_spy).toHaveBeenCalledTimes(1);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', page_id);
	expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(page_id, [], {
			...common_page_snapshot,
			id: page_id,
			is_template: true,
			parent_id: collection_id,
			parent_table: 'collection'
		})
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([
		o.c.la(collection_id, [ 'template_pages' ], { id: page_id })
	]);
	expect(cache.collection.get(collection_id)).toStrictEqual({
		id: collection_id,
		template_pages: [ page_id ]
	});
});

it(`type=collection_view_page`, async () => {
	const collection_id = v4(),
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { type: 'page', id: 'block_1' } as any ] ])
		},
		row_one_id = v4(),
		cv_id = v4();

	const logger_spy = jest.fn();
	const createDataCollectionMock = jest
			.spyOn(NotionFabricator.CreateData, 'collection')
			.mockImplementationOnce(async () => [ { id: collection_id }, [ { id: 'view_1' } ] ] as any),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionFabricator.CreateData.contents(
		[
			{
				collection_id,
				id: cv_id,
				type: 'collection_view_page',
				name: [ [ 'Collection Name' ] ],
				schema: [ tsu ],
				views: [
					{
						type: 'table',
						name: 'Table',
						schema_units: [ tsu ]
					}
				],
				rows: [
					{
						type: 'page',
						id: row_one_id,
						properties: {
							title: [ [ 'Row one' ] ]
						},
						contents: []
					}
				]
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache,
			logger: logger_spy
		}
	);

	const collection_view = cache.block.get(cv_id) as ICollectionView;

	const collection_view_page_snapshot = {
		id: cv_id,
		type: 'collection_view_page',
		collection_id,
		permissions: [
			{
				type: 'space_permission',
				role: 'editor',
				user_id
			}
		],
		view_ids: [ 'view_1' ],
		parent_id: 'block_1',
		parent_table: 'block',
		...metadata
	};

	expect(collection_view).toEqual(collection_view_page_snapshot);
	expect(createDataCollectionMock).toHaveBeenCalledTimes(1);
	expect(logger_spy).toHaveBeenCalledTimes(2);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', row_one_id);
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'block', collection_view.id);
	expect(cache.block.get(collection_view.id)).toBeTruthy();
	expect(cache.block.get(row_one_id)).toBeTruthy();
	expect(executeOperationsMock).toHaveBeenCalledTimes(4);
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(cv_id, [], { ...collection_view_page_snapshot, view_ids: [] })
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([ o.b.s(cv_id, [ 'view_ids' ], [ 'view_1' ]) ]);
	expect(executeOperationsMock.mock.calls[2][0]).toEqual([
		o.b.u(row_one_id, [], {
			content: [],
			permissions: [
				{
					type: 'space_permission',
					role: 'editor',
					user_id: 'user_root_1'
				}
			],
			id: row_one_id,
			parent_table: 'collection',
			parent_id: collection_id,
			type: 'page',
			properties: {
				title: [ [ 'Row one' ] ]
			},
			...metadata
		})
	]);
	expect(executeOperationsMock.mock.calls[3][0]).toEqual([ o.b.la('block_1', [ 'content' ], { id: cv_id }) ]);
});

it(`type=link_to_page`, async () => {
	const cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionFabricator.CreateData.contents(
		[
			{
				type: 'link_to_page',
				page_id: 'page_to_link'
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache
		}
	);
	expect(executeOperationsMock).toBeCalledTimes(1);
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.la('block_1', [ 'content' ], {
			id: 'page_to_link'
		})
	]);
});

it(`type=column_list`, async () => {
	const cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		cl_id = v4(),
		c1_id = v4(),
		c1_b1_id = v4(),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionFabricator.CreateData.contents(
		[
			{
				id: cl_id,
				type: 'column_list',
				contents: [
					{
						id: c1_id,
						contents: [
							{
								id: c1_b1_id,
								type: 'to_do',
								properties: {
									title: [ [ 'Todo' ] ],
									checked: [ [ 'Yes' ] ]
								}
							}
						]
					}
				]
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache
		}
	);
	const column_list_data = cache.block.get(cl_id) as IColumnList;
	const column_1_data = cache.block.get(c1_id) as IColumn;
	const block_1_data = cache.block.get(c1_b1_id) as ITodo;

	expect(column_list_data).toStrictEqual({
		...metadata,
		id: cl_id,
		parent_table: 'block',
		parent_id: 'block_1',
		type: 'column_list',
		content: [ expect.any(String) ]
	});
	expect(column_1_data).toStrictEqual({
		id: expect.any(String),
		parent_id: cl_id,
		parent_table: 'block',
		type: 'column',
		format: {
			column_ratio: 1
		},
		content: [ expect.any(String) ],
		...metadata
	});
	expect(block_1_data).toStrictEqual({
		...metadata,
		type: 'to_do',
		parent_id: column_1_data.id,
		parent_table: 'block',
		id: c1_b1_id,
		properties: {
			title: [ [ 'Todo' ] ],
			checked: [ [ 'Yes' ] ]
		}
	});
	expect(executeOperationsMock).toHaveBeenCalledTimes(6);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.u(cl_id, [], expect.objectContaining({ id: cl_id }))
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
		o.b.u(c1_id, [], expect.objectContaining({ id: c1_id }))
	]);
	expect(executeOperationsMock.mock.calls[2][0]).toStrictEqual([
		o.b.u(c1_b1_id, [], expect.objectContaining({ id: c1_b1_id }))
	]);
	expect(executeOperationsMock.mock.calls[3][0]).toStrictEqual([ o.b.la(c1_id, [ 'content' ], { id: c1_b1_id }) ]);
	expect(executeOperationsMock.mock.calls[4][0]).toStrictEqual([ o.b.s(cl_id, [ 'content' ], [ c1_id ]) ]);
	expect(executeOperationsMock.mock.calls[5][0]).toStrictEqual([ o.b.la('block_1', [ 'content' ], { id: cl_id }) ]);
});

it(`type=factory`, async () => {
	const fid = v4(),
		c1_id = v4(),
		cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionFabricator.CreateData.contents(
		[
			{
				id: fid,
				type: 'factory',
				properties: {
					title: [ [ 'Template' ] ]
				},
				contents: [
					{
						id: c1_id,
						type: 'to_do',
						properties: {
							title: [ [ 'Todo' ] ],
							checked: [ [ 'Yes' ] ]
						}
					}
				]
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache
		}
	);

	const factory_data = cache.block.get(fid) as IFactory,
		block_data = cache.block.get(c1_id) as ITodo;

	expect(factory_data).toStrictEqual({
		content: [ c1_id ],
		id: fid,
		parent_table: 'block',
		parent_id: 'block_1',
		type: 'factory',
		properties: {
			title: [ [ 'Template' ] ]
		},
		...metadata
	});
	expect(block_data).toStrictEqual({
		id: c1_id,
		parent_table: 'block',
		parent_id: fid,
		type: 'to_do',
		properties: {
			title: [ [ 'Todo' ] ],
			checked: [ [ 'Yes' ] ]
		},
		...metadata
	});
	expect(executeOperationsMock).toHaveBeenCalledTimes(4);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.u(fid, [], expect.objectContaining({ id: fid }))
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
		o.b.u(c1_id, [], expect.objectContaining({ id: c1_id }))
	]);
	expect(executeOperationsMock.mock.calls[2][0]).toStrictEqual([
		o.b.la(fid, [ 'content' ], expect.objectContaining({ id: c1_id }))
	]);
	expect(executeOperationsMock.mock.calls[3][0]).toStrictEqual([
		o.b.la('block_1', [ 'content' ], expect.objectContaining({ id: fid }))
	]);
});

it(`type=linked_db`, async () => {
	const cv_id = v4(),
		cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ]),
			collection: new Map([
				[
					'collection_1',
					{
						name: [ [ 'collection' ] ],
						schema: {
							title: tsu
						},
						id: 'collection_1'
					}
				]
			])
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const createDataViewsMock = jest
		.spyOn(NotionFabricator.CreateData, 'views')
		.mockImplementationOnce(() => [ { id: 'view_1' } ] as any);

	await NotionFabricator.CreateData.contents(
		[
			{
				id: cv_id,
				type: 'linked_db',
				collection_id: 'collection_1',
				views: [
					{
						type: 'table',
						name: 'Table',
						schema_units: [ tsu ]
					}
				]
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache
		}
	);
	const collection_view_data = cache.block.get(cv_id) as ICollectionView;

	expect(executeOperationsMock).toHaveBeenCalledTimes(3);
	expect(createDataViewsMock).toHaveBeenCalledTimes(1);
	expect(collection_view_data).toStrictEqual({
		...metadata,
		id: cv_id,
		parent_id: 'block_1',
		parent_table: 'block',
		view_ids: [ 'view_1' ],
		collection_id: 'collection_1',
		type: 'collection_view'
	});
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.u(cv_id, [], expect.objectContaining({ id: cv_id }))
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([ o.b.s(cv_id, [ 'view_ids' ], [ 'view_1' ]) ]);
	expect(executeOperationsMock.mock.calls[2][0]).toStrictEqual([
		o.b.la('block_1', [ 'content' ], expect.objectContaining({ id: cv_id }))
	]);
});

it(`type=bookmark`, async () => {
	const block_id = v4();
	const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } as any ] ])
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined),
		setBookmarkMetadataMock = jest
			.spyOn(NotionEndpoints.Mutations, 'setBookmarkMetadata')
			.mockImplementation(async () => undefined as any),
		updateCacheManuallyMock = jest.spyOn(NotionCache, 'updateCacheManually').mockImplementation(async () => undefined);

	const logger_spy = jest.fn();

	await NotionFabricator.CreateData.contents(
		[
			{
				type: 'bookmark',
				properties: { link: [ [ 'https://google.com' ] ], title: [ [ 'Page' ] ], description: [ [ '' ] ] },
				id: block_id
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache,
			logger: logger_spy
		}
	);

	expect(logger_spy).toHaveBeenCalledTimes(1);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', block_id);
	expect(setBookmarkMetadataMock).toHaveBeenCalledTimes(1);
	expect(setBookmarkMetadataMock.mock.calls[0][0]).toStrictEqual({
		blockId: block_id,
		url: 'https://google.com'
	});
	expect(updateCacheManuallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ block_id, 'block' ] ]);
	expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(
			block_id,
			[],
			expect.objectContaining({
				id: block_id,
				type: 'bookmark'
			})
		)
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([ o.b.la('block_1', [ 'content' ], { id: block_id }) ]);
});

it(`type=codepen`, async () => {
	const block_id = v4();
	const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } as any ] ])
		},
		getGenericEmbedBlockDataMock = jest.spyOn(NotionEndpoints.Queries, 'getGenericEmbedBlockData').mockImplementation(
			async () =>
				({
					format: {
						display_source: 500
					}
				} as any)
		),
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const logger_spy = jest.fn();

	await NotionFabricator.CreateData.contents(
		[
			{
				type: 'codepen',
				properties: { source: [ [ 'https://google.com' ] ] },
				id: block_id
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache,
			logger: logger_spy
		}
	);

	expect(logger_spy).toHaveBeenCalledTimes(1);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', block_id);
	expect(getGenericEmbedBlockDataMock).toHaveBeenCalledTimes(1);
	expect(getGenericEmbedBlockDataMock.mock.calls[0][0]).toStrictEqual({
		pageWidth: 500,
		source: 'https://google.com',
		type: 'codepen'
	});
	expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(
			block_id,
			[],
			expect.objectContaining({
				id: block_id,
				type: 'codepen',
				format: {
					display_source: 500
				}
			})
		)
	]);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([ o.b.la('block_1', [ 'content' ], { id: block_id }) ]);
});
