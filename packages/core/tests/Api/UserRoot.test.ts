import { NotionCache } from '@nishans/cache';
import { NotionOperations } from '@nishans/operations';
import { INotionCache } from '@nishans/types';
import { NotionCore } from '../../libs';
import { default_nishan_arg, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`get space_views`, async () => {
	const cache: INotionCache = {
		...NotionCache.createDefaultCache(),
		user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ]),
		space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ])
	};

	const user_root = new NotionCore.Api.UserRoot({
		...default_nishan_arg,
		cache,
		id: 'user_root_1'
	});

	const space_view = await user_root.getSpaceView('space_view_1');
	expect(space_view.getCachedData()).toStrictEqual({ alive: true });
});

it(`update space_views`, async () => {
	const cache: INotionCache = {
			...NotionCache.createDefaultCache(),
			space_view: new Map([ [ 'space_view_1', { alive: true } as any ] ]),
			user_root: new Map([ [ 'user_root_1', { space_views: [ 'space_view_1' ] } as any ] ])
		},
		executeOperations = jest.spyOn(NotionOperations, 'executeOperations').mockImplementationOnce(async () => undefined);

	const user_root = new NotionCore.Api.UserRoot({
		...default_nishan_arg,
		cache,
		id: 'user_root_1'
	});

	const space_view = await user_root.updateSpaceView([ 'space_view_1', { joined: false } ]);
	expect(space_view.getCachedData()).toStrictEqual({
		alive: true,
		joined: false
	} as any);

	expect(executeOperations.mock.calls[0][0]).toStrictEqual([
		o.sv.u('space_view_1', [], {
			joined: false
		})
	] as any);
});
