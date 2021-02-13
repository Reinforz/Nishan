import { ICache } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import deepEqual from 'deep-equal';
import { NotionUser } from '../src';

describe('NotionUser', () => {
	describe('get space', () => {
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

		it(`multiple=true`, async () => {
			const spaces = await notion_user.getSpaces([ 'space_1', 'space_2' ]);
			expect(deepEqual(spaces[0].getCachedData(), { id: 'space_1', shard_id: 123 })).toBe(true);
			expect(deepEqual(spaces[1].getCachedData(), { id: 'space_2', shard_id: 123 })).toBe(true);
			expect(spaces[0].id).toBe('space_1');
			expect(spaces[1].id).toBe('space_2');
		});

		it(`multiple=false,arg=string`, async () => {
			const space = await notion_user.getSpace('space_2');
			expect(deepEqual(space.getCachedData(), { id: 'space_2', shard_id: 123 })).toBe(true);
			expect(space.id).toBe('space_2');
		});
	});

	describe('update space', () => {
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

		it(`multiple=true`, async () => {
			const spaces = await notion_user.updateSpaces([
				[ 'space_1', { name: 'Space One' } ],
				[ 'space_2', { name: 'Space Two' } ]
			]);

			expect(spaces[0].getCachedData()).toMatchSnapshot({
				id: 'space_1',
				shard_id: 123,
				name: 'Space One',
				...updated_space_snapshot
			});

			expect(spaces[1].getCachedData()).toMatchSnapshot({
				id: 'space_2',
				shard_id: 123,
				name: 'Space Two',
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
				},
				{
					path: [],
					table: 'space',
					command: 'update',
					args: {
						name: 'Space Two',
						...updated_space_snapshot
					},
					id: 'space_2'
				}
			]);
		});

		/* it(`multiple=false,arg=string`, async () => {
			const space = await notion_user.getSpace('space_2');
			expect(deepEqual(space.getCachedData(), { id: 'space_2', shard_id: 123 })).toBe(true);
			expect(space.id).toBe('space_2');
		}); */
	});
});
