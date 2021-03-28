import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`NotionLineage.Space.getSpaceView`, () => {
	const space_view_1: any = {
			id: 'space_view_1',
			space_id: 'space_1'
		},
		space_view_2: any = {
			id: 'space_view_2',
			space_id: 'space_2'
		},
		space_1: any = { id: 'space_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			space: new Map([ [ 'space_1', space_1 ] ]),
			space_view: new Map([ [ 'space_view_1', space_view_1 ], [ 'space_view_2', space_view_2 ] ])
		};

	const space_view = NotionLineage.Space.getSpaceView('space_1', cache);
	expect(space_view).toStrictEqual(space_view_1);
});
