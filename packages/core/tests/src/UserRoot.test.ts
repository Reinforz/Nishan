import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { UserRoot } from '../../src';
import { createDefaultCache } from '../../utils/createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`get space_views`, async () => {
	const cache: ICache = {
			...createDefaultCache(),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ]),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ])
		},
		stack: IOperation[] = [];

	const user_root = new UserRoot({
		cache,
		id: 'user_root_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const space_view = await user_root.getSpaceView('space_view_1');
	expect(space_view.getCachedData()).toStrictEqual({ alive: true });
});

it(`update space_views`, async () => {
	const cache: ICache = {
			...createDefaultCache(),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ]),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ])
		},
		stack: IOperation[] = [];

	const user_root = new UserRoot({
		cache,
		id: 'user_root_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const space_view = await user_root.updateSpaceView([ 'space_view_1', { joined: false } ]);
	expect(space_view.getCachedData()).toMatchSnapshot({
		alive: true,
		last_edited_time: expect.any(Number),
		last_edited_by_table: 'notion_user',
		last_edited_by_id: 'user_root_1',
		joined: false
	} as any);

	expect(stack).toMatchSnapshot([
		{
			table: 'space_view',
			id: 'space_view_1',
			command: 'update',
			path: [],
			args: {
				last_edited_time: expect.any(Number),
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_root_1',
				joined: false
			}
		},
		{
			table: 'user_root',
			id: 'user_root_1',
			command: 'update',
			path: [],
			args: {
				last_edited_time: expect.any(Number),
				last_edited_by_table: 'notion_user',
				last_edited_by_id: 'user_root_1'
			}
		}
	] as any);
});
