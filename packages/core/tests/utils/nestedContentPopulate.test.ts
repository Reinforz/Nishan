import { ICache } from '@nishans/cache';
import { IHeader, IOperation, IPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { v4 } from 'uuid';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import colors from 'colors';

import {
	appendChildToParent,
	Block,
	CollectionView,
	CollectionViewPage,
	fetchAndCacheData,
	IBlockMap,
	IHeaderInput,
	createContents,
	Page,
	stackCacheMap
} from '../../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

const space_id = '322c0b0c-5fb4-4fdc-97eb-84e7142b2a80',
	user_id = '72e85506-b758-481a-92b1-73984a903002',
	shard_id = 731776;

const constructDefaultCache = () => {
	return {
		block: new Map([ [ 'page1_id', {} ], [ 'page2_id', { content: [] } ] ]),
		collection: new Map([ [ 'collection1_id', {} ] ]),
		space: new Map([ [ space_id, {} ] ]),
		collection_view: new Map(),
		notion_user: new Map(),
		space_view: new Map(),
		user_root: new Map(),
		user_settings: new Map()
	} as ICache;
};

const metadata = {
	created_time: expect.any(Number),
	created_by_id: user_id,
	created_by_table: 'notion_user',
	last_edited_time: expect.any(Number),
	last_edited_by_table: 'notion_user',
	last_edited_by_id: user_id,
	space_id,
	shard_id,
	version: 0
};

describe('fetchAndCacheData', () => {
	it('exist in cache', async () => {
		const data = await fetchAndCacheData(
			'block',
			'id',
			{
				block: new Map([ [ 'id', { data: 'data' } ] ])
			} as any,
			'token'
		);
		expect(deepEqual(data, { data: 'data' })).toBe(true);
	});

	it('doesnt exist in cache', async () => {
		const console_log_spy = jest.spyOn(console, 'log');
		mock.onPost(`/syncRecordValues`).replyOnce(200, {
			recordMap: {
				block: {
					id: {
						role: 'editor',
						value: { data: 'data' }
					}
				}
			}
		});
		const data = await fetchAndCacheData(
			'block',
			'id',
			{
				block: new Map()
			} as any,
			'token'
		);
		expect(console_log_spy).toHaveBeenCalledTimes(1);
		expect(console_log_spy).toHaveBeenCalledWith(colors.yellow.bold(`block:id doesnot exist in the cache`));

		expect(deepEqual(data, { data: 'data' })).toBe(true);
	});
});

describe('appendChildToParent', () => {
	describe(`type=block`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					block: new Map([ [ 'parent_id', { content: [] } ] ])
				} as any;
			await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'block',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'content' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.block.get('parent_id'), { content: [ 'child_id' ] })).toBe(true);
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					block: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'block',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'content' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.block.get('parent_id'), { content: [ 'child_id' ] })).toBe(true);
		});
	});

	describe(`type=space`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					space: new Map([ [ 'parent_id', { pages: [] } ] ])
				} as any;
			await appendChildToParent('space', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'space',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'pages' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.space.get('parent_id'), { pages: [ 'child_id' ] })).toBe(true);
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					space: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('space', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'space',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'pages' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.space.get('parent_id'), { pages: [ 'child_id' ] })).toBe(true);
		});
	});

	describe(`type=collection`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					collection: new Map([ [ 'parent_id', { template_pages: [] } ] ])
				} as any;
			await appendChildToParent('collection', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'collection',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'template_pages' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.collection.get('parent_id'), { template_pages: [ 'child_id' ] })).toBe(true);
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					collection: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('collection', 'parent_id', 'child_id', cache, stack, 'token');

			expect(
				deepEqual(stack, [
					{
						table: 'collection',
						command: 'listAfter',
						id: 'parent_id',
						args: {
							after: '',
							id: 'child_id'
						},
						path: [ 'template_pages' ]
					}
				])
			).toBe(true);

			expect(deepEqual(cache.collection.get('parent_id'), { template_pages: [ 'child_id' ] })).toBe(true);
		});
	});
});

describe('stackCacheMap', () => {
	it(`name=string`, () => {
		const cache = constructDefaultCache(),
			stack: IOperation[] = [],
			block_map: IBlockMap = { page: new Map() } as any,
			data = { id: 'data_id', type: 'page', data: 'data' } as any;
		stackCacheMap<IPage>(
			block_map,
			data,
			{
				cache,
				interval: 0,
				logger: false,
				shard_id,
				space_id,
				stack,
				token: 'token',
				user_id
			},
			'name'
		);

		expect(deepEqual(stack, [ data ]));
		expect(deepEqual(cache.block.get('data_id'), data)).toBe(true);
		expect(deepEqual((block_map.page.get('data_id') as Page).getCachedData(), data)).toBe(true);
		expect(deepEqual((block_map.page.get('name') as Page).getCachedData(), data)).toBe(true);
	});
});

describe('createContents', () => {
	// * Assert the loggers
	// * Assert the returned block map
	// * Assert the cache
	// * Assert the stack

	describe('type=page', () => {
		it(`is_template=false,is_private=true,contents=[{}],parent=space`, async () => {
			const page_id = '48a3d30c-c259-4047-986f-74d9a6cb1305',
				header_id = '48a3d30c-c259-4047-986f-74d9a6cb1304';

			const cache = constructDefaultCache(),
				stack: IOperation[] = [];

			const logger_spy = jest.fn();

			const block_map = await createContents(
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
				}
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
					last_edited_time: expect.any(Number),
					last_edited_by_table: 'notion_user',
					last_edited_by_id: user_id,
					space_id,
					shard_id,
					version: 0
				};

			expect(logger_spy).toHaveBeenCalledTimes(2);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', header_id);
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'block', page_id);

			expect((block_map.page.get('Page') as Page).getCachedData()).toMatchSnapshot({
				...page_snapshot,
				content: [ header_id ]
			});

			expect((block_map.header.get(header_id) as Block<IHeader, IHeaderInput>).getCachedData()).toMatchSnapshot(
				header_snapshot
			);

			expect(stack).toMatchSnapshot([
				{
					table: 'block',
					command: 'update',
					path: [],
					id: page_id,
					args: page_snapshot
				},
				{
					table: 'block',
					command: 'update',
					path: [],
					id: header_id,
					args: header_snapshot
				},
				{
					path: [ 'content' ],
					table: 'block',
					command: 'listAfter',
					args: { after: '', id: header_id },
					id: page_id
				},
				{
					path: [ 'pages' ],
					table: 'space',
					command: 'listAfter',
					args: { after: '', id: page_id },
					id: space_id
				}
			]);
			expect(
				deepEqual(cache.space.get(space_id), {
					pages: [ page_id ]
				})
			).toBe(true);
		});

		it(`is_template=true,contents=[],parent=collection`, async () => {
			const page_id = '48a3d30c-c259-4047-986f-74d9a6cb1305';

			const cache = constructDefaultCache(),
				stack: IOperation[] = [];

			const logger_spy = jest.fn();

			const block_map = await createContents(
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
				'collection1_id',
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
				type: 'page',
				properties: {
					title: [ [ 'Page' ] ]
				},
				format: {
					page_font: 'Monaco'
				},
				parent_id: 'collection1_id',
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
				last_edited_time: expect.any(Number),
				last_edited_by_table: 'notion_user',
				last_edited_by_id: user_id,
				space_id,
				shard_id,
				version: 0
			};

			expect(logger_spy).toHaveBeenCalledTimes(1);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'block', page_id);

			expect((block_map.page.get('Page') as Page).getCachedData()).toMatchSnapshot({
				...page_snapshot,
				content: []
			});

			expect(stack).toMatchSnapshot([
				{
					table: 'block',
					command: 'update',
					path: [],
					id: page_id,
					args: page_snapshot
				},
				{
					path: [ 'template_pages' ],
					table: 'collection',
					command: 'listAfter',
					args: { after: '', id: page_id },
					id: 'collection1_id'
				}
			]);

			expect(
				deepEqual(cache.collection.get('collection1_id'), {
					template_pages: [ page_id ]
				})
			).toBe(true);
		});
	});

	describe('type=collection_block', () => {
		it(`type=collection_view_page,rows=[]`, async () => {
			const cache = constructDefaultCache(),
				stack: IOperation[] = [];

			const logger_spy = jest.fn();

			const block_map = await createContents(
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

			const collection_view_page = (block_map.collection_view_page.get(
				'Collection Name'
			) as CollectionViewPage).getCachedData();

			expect(logger_spy).toHaveBeenCalledTimes(3);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'collection_view', collection_view_page.view_ids[0]);
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'collection', collection_view_page.collection_id);
			expect(logger_spy).toHaveBeenNthCalledWith(3, 'CREATE', 'block', collection_view_page.id);

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
			expect(collection_view_page).toMatchSnapshot(collection_view_page_snapshot);

			expect(cache.block.get(collection_view_page.id)).toBeTruthy();
			expect(cache.collection.get(collection_view_page.collection_id)).toBeTruthy();
			expect(cache.collection_view.get(collection_view_page.view_ids[0])).toBeTruthy();
			expect(stack.length).toBe(4);

			expect(stack[2]).toMatchSnapshot({
				path: [],
				table: 'block',
				command: 'update',
				args: collection_view_page_snapshot,
				id: expect.any(String)
			});
		});

		it(`type=collection_view,rows=[{}]`, async () => {
			const cache = constructDefaultCache(),
				stack: IOperation[] = [],
				row_one_id = v4();

			const logger_spy = jest.fn();

			const block_map = await createContents(
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
				'page1_id',
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

			const collection_view = (block_map.collection_view.get('Collection Name') as CollectionView).getCachedData();

			expect(logger_spy).toHaveBeenCalledTimes(4);
			expect(logger_spy).toHaveBeenNthCalledWith(1, 'CREATE', 'collection_view', collection_view.view_ids[0]);
			expect(logger_spy).toHaveBeenNthCalledWith(2, 'CREATE', 'collection', collection_view.collection_id);
			expect(logger_spy).toHaveBeenNthCalledWith(3, 'CREATE', 'block', row_one_id);
			expect(logger_spy).toHaveBeenNthCalledWith(4, 'CREATE', 'block', collection_view.id);

			const collection_view_snapshot = {
				id: expect.any(String),
				type: 'collection_view',
				collection_id: expect.any(String),
				view_ids: [ expect.any(String) ],
				parent_id: 'page1_id',
				parent_table: 'block',
				...metadata
			};
			expect(collection_view).toMatchSnapshot(collection_view_snapshot);

			expect(cache.block.get(collection_view.id)).toBeTruthy();
			expect(cache.block.get(row_one_id)).toBeTruthy();
			expect(cache.collection.get(collection_view.collection_id)).toBeTruthy();
			expect(cache.collection_view.get(collection_view.view_ids[0])).toBeTruthy();

			expect(stack.length).toBe(5);

			expect(stack[2]).toMatchSnapshot({
				path: [],
				table: 'block',
				command: 'update',
				args: collection_view_snapshot,
				id: expect.any(String)
			});
		});
	});

	it(`type=link_to_page`, async () => {
		const cache: any = {
				block: new Map([ [ 'page1_id', { id: 'page1_id' } ] ]),
				collection: new Map(),
				space: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map()
			},
			stack: IOperation[] = [];

		await createContents(
			[
				{
					type: 'link_to_page',
					page_id: 'page_to_link'
				}
			],
			'page1_id',
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

		expect(stack).toMatchSnapshot([
			{
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '',
					id: 'page_to_link'
				},
				id: 'page1_id'
			}
		]);
	});

	it(`type=column_list`, async () => {
		const cache: any = {
				block: new Map([ [ 'page_id', { id: 'page_id' } ] ]),
				collection: new Map(),
				space: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map()
			},
			stack: IOperation[] = [];
		await createContents(
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
				block: new Map([ [ 'page_id', { id: 'page_id' } ] ]),
				collection: new Map(),
				space: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map()
			},
			stack: IOperation[] = [];
		const block_map = await createContents(
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

		await createContents(
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

		expect(block_map.to_do.size).toBe(1);
		expect(block_map.factory.get('Template')).toBeTruthy();
		expect(block_map.factory.size).toBe(2);
		expect(stack.length).toBe(4);
	});

	it(`type=linked_db`, async () => {
		const cache: any = {
				block: new Map([ [ 'page1_id', { id: 'page1_id' } ] ]),
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

		const block_map = await createContents(
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
			'page1_id',
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

		const collection_view = (block_map.collection_view.get('collection') as CollectionView).getCachedData();

		const collection_view_snapshot = {
			id: expect.any(String),
			type: 'collection_view',
			collection_id: expect.any(String),
			view_ids: [ expect.any(String) ],
			parent_id: 'page1_id',
			parent_table: 'block',
			...metadata
		};
		expect(collection_view).toMatchSnapshot(collection_view_snapshot);

		expect(stack.length).toBe(3);
	});
});
