import { NotionCacheObject } from '@nishans/cache';
import {
	ICollectionView,
	ICollectionViewPage,
	IColumn,
	IColumnList,
	IFactory,
	IOperation,
	ITodo
} from '@nishans/types';
import { v4 } from 'uuid';
import { default_nishan_arg, last_edited_props, o } from '../../../../core/tests/utils';
import { CreateData } from '../../../libs';
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

describe('type=page', () => {
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
		permissions: [
			{
				type: 'user_permission',
				role: 'editor',
				user_id
			}
		]
	};

	it(`is_template=false,is_private=true,contents=[{}],parent=space`, async () => {
		const page_id = v4(),
			header_id = v4();

		const cache = {
				...NotionCacheObject.createDefaultCache(),
				space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ])
			},
			stack: IOperation[] = [];

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'page',
					properties: { title: [ [ 'Page' ] ] },
					format: {
						block_color: 'blue'
					},
					isPrivate: true,
					id: page_id,
					contents: [
						{
							type: 'header',
							properties: {
								title: [ [ 'Header' ] ]
							},
							id: header_id
						}
					]
				}
			],
			space_id,
			'space',
			{
				...default_nishan_arg,
				cache,
				logger: logger_spy,
				stack
			},
			() => ({})
		);

		const header_snapshot = {
			id: header_id,
			type: 'header',
			properties: {
				title: [ [ 'Header' ] ]
			},
			parent_id: page_id,
			parent_table: 'block',
			...metadata
		};

		expect(logger_spy).toHaveBeenCalledTimes(2);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', header_id);
		expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'block', page_id);

		expect(stack).toEqual([
			o.b.u(page_id, [], {
				id: page_id,
				...common_page_snapshot,
				format: {
					block_color: 'blue'
				}
			}),
			o.b.u(header_id, [], header_snapshot),
			o.b.la(page_id, [ 'content' ], { id: header_id }),
			o.s.la(space_id, [ 'pages' ], { id: page_id })
		]);

		expect(cache.space.get(space_id)).toStrictEqual({
			id: 'space_1',
			pages: [ page_id ]
		});
	});

	it(`is_template=true,contents=[],parent=collection`, async () => {
		const collection_1 = { id: 'collection_1' } as any,
			page_id = v4();
		const cache = {
				...NotionCacheObject.createDefaultCache(),
				collection: new Map([ [ 'collection_1', collection_1 ] ])
			},
			stack: IOperation[] = [];

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'page',
					properties: { title: [ [ 'Page' ] ] },
					isPrivate: true,
					is_template: true,
					id: page_id,
					contents: []
				}
			],
			'collection_1',
			'collection',
			{
				...default_nishan_arg,
				cache,
				logger: logger_spy,
				stack
			}
		);

		expect(logger_spy).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', page_id);

		expect(stack).toEqual([
			o.b.u(page_id, [], {
				...common_page_snapshot,
				id: page_id,
				is_template: true,
				parent_id: 'collection_1',
				parent_table: 'collection'
			}),
			o.c.la('collection_1', [ 'template_pages' ], { id: page_id })
		]);

		expect(cache.collection.get('collection_1')).toStrictEqual({
			id: 'collection_1',
			template_pages: [ page_id ]
		});
	});
});

describe('type=collection_block', () => {
	it(`type=collection_view_page,rows=[]`, async () => {
		const cache = {
				...NotionCacheObject.createDefaultCache(),
				space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ])
			},
			stack: IOperation[] = [],
			cvp_id = v4();

		const logger_spy = jest.fn();
		const createDataCollectionMock = jest
			.spyOn(CreateData, 'collection')
			.mockImplementationOnce(async () => [ { id: 'collection_1' }, [ { id: 'view_1' } ] ] as any);

		await CreateData.contents(
			[
				{
					id: cvp_id,
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
					rows: []
				}
			],
			space_id,
			'space',
			{
				...default_nishan_arg,
				cache,
				logger: logger_spy,
				stack
			}
		);

		const collection_view_page = cache.block.get(cvp_id) as ICollectionViewPage;

		expect(createDataCollectionMock).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenCalledWith('CREATE', 'block', collection_view_page.id);

		const collection_view_page_snapshot = {
			id: cvp_id,
			type: 'collection_view_page',
			collection_id: 'collection_1',
			view_ids: [ 'view_1' ],
			parent_id: space_id,
			parent_table: 'space',
			permissions: [
				{
					type: 'space_permission',
					role: 'editor',
					user_id
				}
			],
			...metadata
		};
		expect(collection_view_page).toEqual(collection_view_page_snapshot);
		expect(stack).toEqual([
			o.b.u(expect.any(String), [], collection_view_page_snapshot),
			o.s.la('space_1', [ 'pages' ], { id: cvp_id })
		]);
	});

	it(`type=collection_view,rows=[{}]`, async () => {
		const cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { type: 'page', id: 'block_1' } as any ] ])
			},
			stack: IOperation[] = [],
			row_one_id = v4(),
			cv_id = v4();

		const logger_spy = jest.fn();
		const createDataCollectionMock = jest
			.spyOn(CreateData, 'collection')
			.mockImplementationOnce(async () => [ { id: 'collection_1' }, [ { id: 'view_1' } ] ] as any);

		await CreateData.contents(
			[
				{
					id: cv_id,
					type: 'collection_view',
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
				logger: logger_spy,
				stack
			}
		);

		const collection_view = cache.block.get(cv_id) as ICollectionView;

		expect(createDataCollectionMock).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenCalledTimes(2);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', row_one_id);
		expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'block', collection_view.id);

		const collection_view_snapshot = {
			id: collection_view.id,
			type: 'collection_view',
			collection_id: 'collection_1',
			view_ids: [ 'view_1' ],
			parent_id: 'block_1',
			parent_table: 'block',
			...metadata
		};

		expect(collection_view).toEqual(collection_view_snapshot);

		expect(cache.block.get(collection_view.id)).toBeTruthy();
		expect(cache.block.get(row_one_id)).toBeTruthy();

		expect(stack).toEqual([
			o.b.u(cv_id, [], collection_view_snapshot),
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
				parent_id: 'collection_1',
				type: 'page',
				properties: {
					title: [ [ 'Row one' ] ]
				},
				...metadata
			}),
			o.b.la('block_1', [ 'content' ], { id: cv_id })
		]);
	});
});

it(`type=link_to_page`, async () => {
	const cache: any = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		stack: IOperation[] = [];

	await CreateData.contents(
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
			cache,
			stack
		}
	);

	expect(stack).toEqual([
		o.b.la('block_1', [ 'content' ], {
			id: 'page_to_link'
		})
	]);
});

it(`type=column_list`, async () => {
	const cache: any = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		cl_id = v4(),
		c1_id = v4(),
		c2_id = v4(),
		stack: IOperation[] = [];
	await CreateData.contents(
		[
			{
				id: cl_id,
				type: 'column_list',
				contents: [
					[
						{
							id: c1_id,
							type: 'to_do',
							properties: {
								title: [ [ 'Todo' ] ],
								checked: [ [ 'Yes' ] ]
							}
						}
					],
					[
						{
							id: c2_id,
							type: 'to_do',
							properties: {
								title: [ [ 'Todo' ] ],
								checked: [ [ 'No' ] ]
							}
						}
					]
				]
			}
		],
		'block_1',
		'block',
		{
			...default_nishan_arg,
			cache,
			stack
		}
	);
	const column_list_data = cache.block.get(cl_id) as IColumnList;
	const column_1_data = cache.block.get(column_list_data.content[0]) as IColumn;
	const column_2_data = cache.block.get(column_list_data.content[1]) as IColumn;
	const block_1_data = cache.block.get(column_1_data.content[0]) as ITodo;
	const block_2_data = cache.block.get(column_2_data.content[0]) as ITodo;

	expect(column_list_data).toStrictEqual({
		...metadata,
		id: cl_id,
		parent_table: 'block',
		parent_id: 'block_1',
		type: 'column_list',
		content: [ expect.any(String), expect.any(String) ]
	});

	const common_column_data = {
			id: expect.any(String),
			parent_id: cl_id,
			parent_table: 'block',
			type: 'column',
			format: {
				column_ratio: 0.5
			},
			content: [ expect.any(String) ],
			...metadata
		},
		common_block_data = {
			...metadata,
			type: 'to_do',
			parent_table: 'block'
		};

	expect(column_1_data).toStrictEqual(common_column_data);
	expect(column_2_data).toStrictEqual(common_column_data);
	expect(block_1_data).toStrictEqual({
		...common_block_data,
		id: c1_id,
		parent_id: column_1_data.id,
		properties: {
			title: [ [ 'Todo' ] ],
			checked: [ [ 'Yes' ] ]
		}
	});
	expect(block_2_data).toStrictEqual({
		...common_block_data,
		id: c2_id,
		parent_id: column_2_data.id,
		properties: {
			title: [ [ 'Todo' ] ],
			checked: [ [ 'No' ] ]
		}
	});

	expect(stack).toStrictEqual([
		o.b.u(cl_id, [], expect.objectContaining({ id: column_list_data.id })),

		o.b.u(column_1_data.id, [], expect.objectContaining({ id: column_1_data.id })),
		o.b.u(block_1_data.id, [], expect.objectContaining({ id: block_1_data.id })),
		o.b.la(cl_id, [ 'content' ], { id: column_1_data.id }),
		o.b.la(column_1_data.id, [ 'content' ], { id: block_1_data.id }),

		o.b.u(column_2_data.id, [], expect.objectContaining({ id: column_2_data.id })),
		o.b.u(block_2_data.id, [], expect.objectContaining({ id: block_2_data.id })),
		o.b.la(cl_id, [ 'content' ], { id: column_2_data.id }),
		o.b.la(column_2_data.id, [ 'content' ], { id: block_2_data.id }),

		o.b.la('block_1', [ 'content' ], { id: cl_id })
	]);
});

it(`type=factory`, async () => {
	const fid = v4(),
		c1_id = v4(),
		cache: any = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'page' } ] ])
		},
		stack: IOperation[] = [];
	await CreateData.contents(
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
			cache,
			stack
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

	expect(stack).toStrictEqual([
		o.b.u(fid, [], expect.objectContaining({ id: fid })),
		o.b.u(c1_id, [], expect.objectContaining({ id: c1_id })),
		o.b.la(fid, [ 'content' ], expect.objectContaining({ id: c1_id })),
		o.b.la('block_1', [ 'content' ], expect.objectContaining({ id: fid }))
	]);
});

it(`type=linked_db`, async () => {
	const cv_id = v4(),
		cache: any = {
			...NotionCacheObject.createDefaultCache(),
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
		stack: IOperation[] = [];

	const createDataViewsMock = jest.spyOn(CreateData, 'views').mockImplementationOnce(() => [ { id: 'view_1' } ] as any);

	await CreateData.contents(
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
			cache,
			stack
		}
	);
	const collection_view_data = cache.block.get(cv_id) as ICollectionView;

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
	expect(stack).toStrictEqual([
		o.b.u(cv_id, [], expect.objectContaining({ id: cv_id })),
		o.b.la('block_1', [ 'content' ], expect.objectContaining({ id: cv_id }))
	]);
});
