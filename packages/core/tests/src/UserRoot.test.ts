import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { UserRoot } from '../../src';
import { o } from '../utils';
import { default_nishan_arg } from '../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`get space_views`, async () => {
	const cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ]),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ])
		},
		stack: IOperation[] = [];

	const user_root = new UserRoot({
		...default_nishan_arg,
		cache,
		id: 'user_root_1',
		stack
	});

	const space_view = await user_root.getSpaceView('space_view_1');
	expect(space_view.getCachedData()).toStrictEqual({ alive: true });
});

it(`update space_views`, async () => {
	const cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ]),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ])
		},
		stack: IOperation[] = [];

	const user_root = new UserRoot({
		...default_nishan_arg,
		cache,
		id: 'user_root_1',
		stack
	});

	const space_view = await user_root.updateSpaceView([ 'space_view_1', { joined: false } ]);
	expect(space_view.getCachedData()).toStrictEqual({
		alive: true,
		joined: false
	} as any);

	expect(stack).toStrictEqual([
		o.sv.u('space_view_1', [], {
			joined: false
		})
	] as any);
});
