import { ICache, NotionCache } from '@nishans/cache';
import { Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import deepEqual from 'deep-equal';
import { v4 } from 'uuid';
import { NotionUser } from '../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

describe('NotionUser', () => {
	describe('get space', () => {
		it(`multiple=false,arg=string`, async () => {
			const cache: ICache = {
				block: new Map(),
				collection: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space: new Map([
					[ 'space_1', { id: 'space_1', shard_id: 123 } ],
					[ 'space_2', { id: 'space_2', shard_id: 123 } ]
				] as any),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map()
			};
			const notion_user = new NotionUser({
				cache,
				id: 'user_1',
				stack: [],
				interval: 0,
				shard_id: 123,
				space_id: 'space_1',
				token: 'token',
				user_id: 'user_1'
			});

			const space = await notion_user.getSpace('space_2');
			expect(deepEqual(space.getCachedData(), { id: 'space_2', shard_id: 123 })).toBe(true);
			expect(space.id).toBe('space_2');
		});
	});

	describe('update space', () => {
		it(`multiple=false,arg=string`, async () => {
			const cache: ICache = {
					block: new Map(),
					collection: new Map(),
					collection_view: new Map(),
					notion_user: new Map(),
					space: new Map([
						[ 'space_1', { id: 'space_1', shard_id: 123, name: 'Space 1' } ],
						[ 'space_2', { id: 'space_2', shard_id: 123, name: 'Space 2' } ]
					] as any),
					space_view: new Map(),
					user_root: new Map(),
					user_settings: new Map()
				},
				stack: IOperation[] = [];

			const notion_user = new NotionUser({
				cache,
				id: 'user_1',
				stack,
				interval: 0,
				shard_id: 123,
				space_id: 'space_1',
				token: 'token',
				user_id: 'user_1'
			});

			const updated_space_snapshot = {
				last_edited_time: expect.any(Number),
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_1'
			};

			const space = await notion_user.updateSpace([ 'space_1', { name: 'Space One' } ]);

			expect(space.getCachedData()).toMatchSnapshot({
				id: 'space_1',
				shard_id: 123,
				name: 'Space One',
				...updated_space_snapshot
			});

			expect(stack).toMatchSnapshot([
				{
					path: [],
					table: 'space',
					command: 'update',
					args: {
						name: 'Space One',
						...updated_space_snapshot
					},
					id: 'space_1'
				}
			]);
		});
	});

	it('getUserSettings', () => {
		const cache: ICache = {
				block: new Map(),
				collection: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space: new Map(),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map([ [ 'user_1', { id: 'user_1', name: 'User Settings 1' } ] ] as any)
			},
			stack: IOperation[] = [];

		const notion_user = new NotionUser({
			cache,
			id: 'user_1',
			stack,
			interval: 0,
			shard_id: 123,
			space_id: 'space_1',
			token: 'token',
			user_id: 'user_1'
		});
		const user_settings = notion_user.getUserSettings();
		expect(deepEqual(user_settings.getCachedData(), { id: 'user_1', name: 'User Settings 1' })).toBe(true);
		expect(user_settings.id).toBe('user_1');
	});

	it('getUserRoot', () => {
		const cache: ICache = {
				block: new Map(),
				collection: new Map(),
				collection_view: new Map(),
				notion_user: new Map(),
				space: new Map(),
				space_view: new Map(),
				user_root: new Map([ [ 'user_1', { id: 'user_1', name: 'User Root 1' } ] ] as any),
				user_settings: new Map()
			},
			stack: IOperation[] = [];

		const notion_user = new NotionUser({
			cache,
			id: 'user_1',
			stack,
			interval: 0,
			shard_id: 123,
			space_id: 'space_1',
			token: 'token',
			user_id: 'user_1'
		});
		const user_root = notion_user.getUserRoot();
		expect(deepEqual(user_root.getCachedData(), { id: 'user_1', name: 'User Root 1' })).toBe(true);
		expect(user_root.id).toBe('user_1');
	});

	describe('delete space', () => {
		it(`multiple=false,arg=string`, async () => {
			const cache: ICache = {
					block: new Map(),
					collection: new Map(),
					collection_view: new Map(),
					notion_user: new Map(),
					space: new Map([ [ 'space_1', { id: 'space_1', name: 'Space One' } ] ] as any),
					space_view: new Map(),
					user_root: new Map(),
					user_settings: new Map()
				},
				stack: IOperation[] = [];

			const notion_user = new NotionUser({
				cache,
				id: 'user_1',
				stack,
				interval: 0,
				shard_id: 123,
				space_id: 'space_1',
				token: 'token',
				user_id: 'user_1'
			});

			const enqueuetask_spy = jest.spyOn(Mutations, 'enqueueTask').mockImplementationOnce(async () => {
				return {} as any;
			});

			await notion_user.deleteSpace('space_1');
			expect(enqueuetask_spy).toHaveBeenCalledTimes(1);
			expect(enqueuetask_spy).toHaveBeenCalledWith(
				{
					task: {
						eventName: 'deleteSpace',
						request: {
							spaceId: 'space_1'
						}
					}
				},
				{
					interval: 0,
					token: 'token',
					user_id: 'user_1'
				}
			);
		});
	});

	it.skip('getPagesById', async () => {
		const block_1_id = v4(),
			block_2_id = v4(),
			block_3_id = v4();
		const cache: ICache = {
				block: new Map([
					[ block_1_id, { id: block_1_id, type: 'page', properties: { title: [ [ 'Block One' ] ] } } as any ],
					[ block_2_id, { id: block_2_id, type: 'collection_view_page', collection_id: 'collection_1' } as any ],
					[ block_3_id, { id: block_3_id, type: 'collection_view' } as any ]
				]),
				collection: new Map([
					[ 'collection_1', { id: 'collection_1', type: 'collection', name: [ [ 'Collection One' ] ] } as any ]
				]),
				collection_view: new Map(),
				notion_user: new Map(),
				space: new Map(),
				space_view: new Map(),
				user_root: new Map(),
				user_settings: new Map()
			},
			stack: IOperation[] = [];

		const notion_user = new NotionUser({
			cache,
			id: 'user_1',
			stack,
			interval: 0,
			shard_id: 123,
			space_id: 'space_1',
			token: 'token',
			user_id: 'user_1'
		});

		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache.prototype, 'initializeCacheForSpecificData')
			.mockImplementationOnce(() => {
				return {} as any;
			});

		const page_map = await notion_user.getPagesById([ block_1_id, block_2_id ]);
		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(2);
	});
});
