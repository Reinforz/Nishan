import { NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionLogger } from '@nishans/logger';
import { ICache } from '@nishans/types';
import { v4 } from 'uuid';
import { CollectionViewPage, Nishan, Page } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('get', () => {
	it('arg=cb,multiple=true', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementationOnce(() => undefined as any);

		const nishan = new Nishan({
			...default_nishan_arg,
			notion_operation_plugins: []
		});

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
			return {
				'1': {
					space: {
						'1': {
							value: { permissions: [ { user_id: 'a' } ] }
						}
					},
					notion_user: {
						a: {
							value: { id: 'a', data: 'data' }
						},
						b: {
							value: { id: 'b', data: 'data' }
						}
					},
					user_root: {
						a: {
							value: { id: 'a', data: 'data' }
						}
					}
				}
			} as any;
		});

		const users = await nishan.getNotionUsers((user) => {
			return user.id === 'a';
		});

		expect(methodLoggerMock).toHaveBeenCalledTimes(1);
		expect(methodLoggerMock).toHaveBeenCalledWith('READ notion_user a');

		expect(users[0].getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
	});

	it('arg=cb,multiple=false', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementationOnce(() => undefined as any);
		const nishan = new Nishan(default_nishan_arg);

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
			return {
				'1': {
					space: {
						'1': {
							value: { permissions: [ { user_id: 'a' } ] }
						}
					},
					notion_user: {
						a: {
							value: { id: 'a', data: 'data' }
						},
						b: {
							value: { id: 'b', data: 'data' }
						}
					},
					user_root: {
						a: {
							value: { id: 'a', data: 'data' }
						}
					}
				}
			} as any;
		});

		const user = await nishan.getNotionUser((user) => {
			return user.id === 'b';
		});

		expect(methodLoggerMock).toHaveBeenCalledTimes(1);
		expect(methodLoggerMock).toHaveBeenCalledWith('READ notion_user b');

		expect(user.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
	});

	it('arg=string,multiple=false', async () => {
		const methodLoggerMock = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

		const nishan = new Nishan({
			token: 'token'
		});

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => {
			return {
				'1': {
					space: {
						'1': {
							value: { permissions: [ { user_id: 'a' } ] }
						}
					},
					notion_user: {
						a: {
							value: { id: 'a', data: 'data' }
						},
						b: {
							value: { id: 'b', data: 'data' }
						}
					},
					user_root: {
						a: {
							value: { id: 'a', data: 'data' }
						}
					}
				}
			} as any;
		});

		const user_a = await nishan.getNotionUser('a');
		const user_b = await nishan.getNotionUser('b');

		expect(methodLoggerMock).toHaveBeenCalledTimes(2);
		expect(methodLoggerMock).toHaveBeenNthCalledWith(1, 'READ notion_user a');
		expect(methodLoggerMock).toHaveBeenNthCalledWith(2, 'READ notion_user b');

		expect(user_a.getCachedData()).toStrictEqual({ id: 'a', data: 'data' });
		expect(user_b.getCachedData()).toStrictEqual({ id: 'b', data: 'data' });
	});
});

describe('getPagesById', () => {
	it('Work correctly for type=page & cvp', async () => {
		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => ({}));

		const block_1_id = v4(),
			block_2_id = v4(),
			block_1 = {
				id: block_1_id,
				type: 'page',
				parent_table: 'space',
				parent_id: 'space_1',
				properties: { title: [ [ 'Block One' ] ] },
				space_id: 'space_1',
				shard_id: 123
			} as any,
			block_2 = {
				id: block_2_id,
				parent_table: 'space',
				parent_id: 'space_1',
				type: 'collection_view_page',
				collection_id: 'collection_1',
				view_ids: [ 'collection_view_1' ],
				space_id: 'space_1',
				shard_id: 123
			} as any;

		const notion = new Nishan({
			...default_nishan_arg,
			cache: {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ block_1_id, block_1 ], [ block_2_id, block_2 ] ]),
				space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ]),
				collection: new Map([
					[ 'collection_1', { id: 'collection_1', type: 'collection', name: [ [ 'Collection One' ] ] } as any ]
				]),
				collection_view: new Map([ [ 'collection_view_1', { id: 'collection_view_1' } as any ] ])
			} as any
		});

		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(() => {
				return {} as any;
			});

		const page_map = await notion.getPagesById([ block_1_id, block_2_id ]);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(2);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ block_1_id, 'block' ]);
		expect(initializeCacheForSpecificDataMock.mock.calls[1].slice(0, 2)).toEqual([ block_2_id, 'block' ]);

		expect((page_map.page.get(block_1_id) as Page).id).toStrictEqual(block_1_id);
		const page_obj = page_map.page.get('Block One') as Page;
		expect(page_obj.id).toBe(block_1_id);
		expect(page_obj.space_id).toBe('space_1');
		expect(page_obj.shard_id).toBe(123);
		expect(page_obj.getCachedData()).toStrictEqual(block_1);

		expect((page_map.collection_view_page.get(block_2_id) as CollectionViewPage).id).toStrictEqual(block_2_id);
		const collection_view_page_obj = page_map.collection_view_page.get('Collection One') as CollectionViewPage;
		expect(collection_view_page_obj.getCachedData()).toStrictEqual(block_2);
		expect(collection_view_page_obj.id).toBe(block_2_id);
		expect(collection_view_page_obj.space_id).toBe('space_1');
		expect(collection_view_page_obj.shard_id).toBe(123);
	});

	it('throw an error for type=header', async () => {
		const block_1_id = v4(),
			block_1 = { id: block_1_id, type: 'header' } as any,
			cache: ICache = {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ block_1_id, block_1 ] ])
			};

		jest.spyOn(NotionEndpoints.Queries, 'getSpaces').mockImplementationOnce(async () => ({}));

		const nishan = new Nishan({
			...default_nishan_arg,
			cache
		});

		await expect(nishan.getPagesById([ block_1_id ])).rejects.toThrow();
	});
});
