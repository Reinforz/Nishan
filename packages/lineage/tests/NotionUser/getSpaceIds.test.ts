import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`getSpaceIds`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		space: new Map([ [ 'space_1', {} ], [ 'space_2', {} ] ])
	} as any;

	const space_ids = await NotionLineage.NotionUser.getSpaceIds(cache);

	expect(space_ids).toStrictEqual([ 'space_1', 'space_2' ]);
});
