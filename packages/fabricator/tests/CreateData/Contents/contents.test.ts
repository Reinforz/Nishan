import { NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { last_edited_props, o } from '../../../../core/tests/utils';
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
	it(`is_template=false,is_private=true,contents=[{}],parent=space`, async () => {
		const page_id = v4(),
			header_id = v4();

		const cache = { ...NotionCacheObject.createDefaultCache(), space: new Map([ [ 'space_1', {} as any ] ]) },
			stack: IOperation[] = [];

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'page',
					properties: { title: [ [ 'Page' ] ] },
					format: {
						page_font: 'Monaco'
					},
					isPrivate: true,
					id: page_id,
					contents: [
						{
							type: 'header',
							properties: {
								title: [ [ 'Header' ] ]
							},
							format: {
								block_color: 'blue'
							},
							id: header_id
						}
					]
				}
			],
			space_id,
			'space',
			{
				cache,
				interval: 0,
				logger: logger_spy,
				shard_id,
				space_id,
				stack,
				token: 'token',
				user_id
			},
			() => ({})
		);

		const header_snapshot = {
				id: header_id,
				type: 'header',
				properties: {
					title: [ [ 'Header' ] ]
				},
				format: {
					block_color: 'blue'
				},
				parent_id: page_id,
				parent_table: 'block',
				...metadata
			},
			page_snapshot = {
				id: expect.any(String),
				type: 'page',
				properties: {
					title: [ [ 'Page' ] ]
				},
				content: [],
				format: {
					page_font: 'Monaco'
				},
				parent_id: space_id,
				parent_table: 'space',
				alive: true,
				permissions: [
					{
						type: 'user_permission',
						role: 'editor',
						user_id
					}
				],
				created_time: expect.any(Number),
				created_by_id: user_id,
				created_by_table: 'notion_user',
				...last_edited_props,
				space_id,
				shard_id,
				version: 0
			};

		expect(logger_spy).toHaveBeenCalledTimes(2);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', header_id);
		expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'block', page_id);

		expect(stack).toEqual([
			o.b.u(page_id, [], page_snapshot),
			o.b.u(header_id, [], header_snapshot),
			o.b.la(page_id, [ 'content' ], { after: '', id: header_id }),
			o.s.la(space_id, [ 'pages' ], { after: '', id: page_id })
		]);

		expect(cache.space.get(space_id)).toStrictEqual({
			pages: [ page_id ]
		});
	});

	it(`is_template=true,contents=[],parent=collection`, async () => {
		const page_id = '48a3d30c-c259-4047-986f-74d9a6cb1305';

		const cache = { ...NotionCacheObject.createDefaultCache(), collection: new Map([ [ 'collection_1', {} as any ] ]) },
			stack: IOperation[] = [];

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'page',
					properties: { title: [ [ 'Page' ] ] },
					format: {
						page_font: 'Monaco'
					},
					is_template: true,
					id: page_id
				}
			],
			'collection_1',
			'collection',
			{
				cache,
				interval: 0,
				logger: logger_spy,
				shard_id,
				space_id,
				stack,
				token: 'token',
				user_id
			}
		);

		const page_snapshot = {
			id: expect.any(String),
			is_template: true,
			type: 'page',
			properties: {
				title: [ [ 'Page' ] ]
			},
			content: [],
			format: {
				page_font: 'Monaco'
			},
			parent_id: 'collection_1',
			parent_table: 'collection',
			alive: true,
			permissions: [
				{
					type: 'space_permission',
					role: 'editor',
					user_id
				}
			],
			created_time: expect.any(Number),
			created_by_id: user_id,
			created_by_table: 'notion_user',
			...last_edited_props,
			space_id,
			shard_id,
			version: 0
		};

		expect(logger_spy).toHaveBeenCalledTimes(1);
		expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', page_id);

		expect(stack).toEqual([
			o.b.u(page_id, [], page_snapshot),
			o.c.la('collection_1', [ 'template_pages' ], { after: '', id: page_id })
		]);

		expect(cache.collection.get('collection_1')).toStrictEqual({
			template_pages: [ page_id ]
		});
	});
});

describe('type=collection_block', () => {
	it(`type=collection_view_page,rows=[]`, async () => {
		const cache = { ...NotionCacheObject.createDefaultCache(), space: new Map([ [ 'space_1', {} as any ] ]) },
			stack: IOperation[] = [];

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'collection_view_page',
					name: [ [ 'Collection Name' ] ],
					schema: [
						{
							type: 'title',
							name: 'Title'
						}
					],
					views: [
						{
							type: 'table',
							name: 'Table',
							schema_units: [ tsu ]
						}
					]
				}
			],
			space_id,
			'space',
			{
				cache,
				shard_id,
				space_id,
				interval: 0,
				logger: logger_spy,
				stack,
				token: 'token',
				user_id
			}
		);

		// const collection_view_page = (cache.block.get().get(
		//   'Collection Name'
		// ) as CollectionViewPage).getCachedData();

		// expect(logger_spy).toHaveBeenCalledTimes(3);
		// expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'collection_view', collection_view_page.view_ids[0]);
		// expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'collection', collection_view_page.collection_id);
		// expect(logger_spy).toHaveBeenNthCalledWith(3, 'CREATE', 'block', collection_view_page.id);

		const collection_view_page_snapshot = {
			id: expect.any(String),
			type: 'collection_view_page',
			collection_id: expect.any(String),
			view_ids: [ expect.any(String) ],
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
		// expect(collection_view_page).toEqual(collection_view_page_snapshot);

		// expect(cache.block.get(collection_view_page.id)).toBeTruthy();
		// expect(cache.collection.get(collection_view_page.collection_id)).toBeTruthy();
		// expect(cache.collection_view.get(collection_view_page.view_ids[0])).toBeTruthy();
		expect(stack.length).toBe(4);

		expect(stack[2]).toEqual(o.b.u(expect.any(String), [], collection_view_page_snapshot));
	});

	it(`type=collection_view,rows=[{}]`, async () => {
		const cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'page_1', { type: 'page' } as any ] ])
			},
			stack: IOperation[] = [],
			row_one_id = v4();

		const logger_spy = jest.fn();

		await CreateData.contents(
			[
				{
					type: 'collection_view',
					name: [ [ 'Collection Name' ] ],
					schema: [
						{
							type: 'title',
							name: 'Title'
						}
					],
					views: [
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
					],
					rows: [
						{
							type: 'page',
							id: row_one_id,
							properties: {
								title: [ [ 'Row one' ] ]
							}
						}
					]
				}
			],
			'page_1',
			'block',
			{
				cache,
				shard_id,
				space_id,
				interval: 0,
				logger: logger_spy,
				stack,
				token: 'token',
				user_id
			}
		);

		// const collection_view = (block_map.collection_view.get('Collection Name') as CollectionView).getCachedData();

		// expect(logger_spy).toHaveBeenCalledTimes(4);
		// expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'collection_view', collection_view.view_ids[0]);
		// expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'collection', collection_view.collection_id);
		// expect(logger_spy).toHaveBeenNthCalledWith(3, 'CREATE', 'block', row_one_id);
		// expect(logger_spy).toHaveBeenNthCalledWith(4, 'CREATE', 'block', collection_view.id);

		// const collection_view_snapshot = {
		//   id: expect.any(String),
		//   type: 'collection_view',
		//   collection_id: expect.any(String),
		//   view_ids: [ expect.any(String) ],
		//   parent_id: 'page_1',
		//   parent_table: 'block',
		//   ...metadata
		// };
		// expect(collection_view).toEqual(collection_view_snapshot);

		// expect(cache.block.get(collection_view.id)).toBeTruthy();
		// expect(cache.block.get(row_one_id)).toBeTruthy();
		// expect(cache.collection.get(collection_view.collection_id)).toBeTruthy();
		// expect(cache.collection_view.get(collection_view.view_ids[0])).toBeTruthy();

		// expect(stack.length).toBe(5);

		// expect(stack[2]).toEqual(
		//   o.b.u(expect.any(String), [], collection_view_snapshot)
		// );
	});
});

it(`type=link_to_page`, async () => {
	const cache: any = {
			block: new Map([ [ 'page_1', { id: 'page_1', type: 'page' } ] ]),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	await CreateData.contents(
		[
			{
				type: 'link_to_page',
				page_id: 'page_to_link'
			}
		],
		'page_1',
		'block',
		{
			cache,
			shard_id,
			space_id,
			interval: 0,
			logger: false,
			stack,
			token: 'token',
			user_id
		}
	);

	expect(stack).toEqual([
		o.b.la('page_1', [ 'content' ], {
			after: '',
			id: 'page_to_link'
		})
	]);
});

it(`type=column_list`, async () => {
	const cache: any = {
			block: new Map([ [ 'page_id', { id: 'page_id', type: 'page' } ] ]),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];
	await CreateData.contents(
		[
			{
				type: 'column_list',
				contents: [
					{
						type: 'to_do',
						properties: {
							title: [ [ 'Todo' ] ],
							checked: [ [ 'Yes' ] ]
						}
					},
					{
						type: 'to_do',
						properties: {
							title: [ [ 'Todo' ] ],
							checked: [ [ 'No' ] ]
						}
					}
				]
			}
		],
		'page_id',
		'block',
		{
			cache,
			shard_id,
			space_id,
			interval: 0,
			logger: false,
			stack,
			token: 'token',
			user_id
		}
	);
});

it(`type=factory`, async () => {
	const cache: any = {
			block: new Map([ [ 'page_id', { id: 'page_id', type: 'page' } ] ]),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];
	await CreateData.contents(
		[
			{
				type: 'factory',
				properties: {
					title: [ [ 'Template' ] ]
				},
				contents: [
					{
						type: 'to_do',
						properties: {
							title: [ [ 'Todo' ] ],
							checked: [ [ 'Yes' ] ]
						}
					}
				]
			}
		],
		'page_id',
		'block',
		{
			cache,
			shard_id,
			space_id,
			interval: 0,
			logger: false,
			stack,
			token: 'token',
			user_id
		}
	);

	await CreateData.contents(
		[
			{
				type: 'factory',
				properties: {
					title: [ [ 'Template' ] ]
				}
			}
		],
		'page_id',
		'block',
		{
			cache,
			shard_id,
			space_id,
			interval: 0,
			logger: false,
			stack: [],
			token: 'token',
			user_id
		}
	);

	// expect(block_map.to_do.size).toBe(1);
	// expect(block_map.factory.get('Template')).toBeTruthy();
	// expect(block_map.factory.size).toBe(2);
	expect(stack.length).toBe(4);
});

it(`type=linked_db`, async () => {
	const cache: any = {
			block: new Map([ [ 'page_1', { id: 'page_1', type: 'page' } ] ]),
			collection: new Map([
				[
					'collection_id',
					{
						name: [ [ 'collection' ] ],
						schema: {
							title: {
								type: 'title',
								name: 'Title'
							}
						},
						id: 'collection_id'
					}
				]
			]),
			space: new Map([ [ space_id, {} ] ]),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	await CreateData.contents(
		[
			{
				type: 'linked_db',
				collection_id: 'collection_id',
				views: [
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
				]
			}
		],
		'page_1',
		'block',
		{
			cache,
			shard_id,
			space_id,
			interval: 0,
			logger: false,
			stack,
			token: 'token',
			user_id
		}
	);

	// const collection_view = (block_map.collection_view.get('collection') as CollectionView).getCachedData();

	// const collection_view_snapshot = {
	// 	id: expect.any(String),
	// 	type: 'collection_view',
	// 	collection_id: expect.any(String),
	// 	view_ids: [ expect.any(String) ],
	// 	parent_id: 'page_1',
	// 	parent_table: 'block',
	// 	...metadata
	// };
	// expect(collection_view).toEqual(collection_view_snapshot);

	expect(stack.length).toBe(3);
});
