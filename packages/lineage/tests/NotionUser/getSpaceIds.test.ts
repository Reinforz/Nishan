import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`getSpaceIds`, () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		space: new Map([ [ 'space_1', {} ], [ 'space_2', {} ] ])
	} as any;

	const space_ids = NotionLineage.NotionUser.getSpaceIds(cache);

	expect(space_ids).toStrictEqual([ 'space_1', 'space_2' ]);
});
