import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`getFollowId`, () => {
	const follow_1: any = { navigable_block_id: 'block_2', id: 'follow_2' },
		follow_2: any = { navigable_block_id: 'block_1', id: 'follow_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			follow: new Map([ [ 'follow_1', follow_1 ], [ 'follow_2', follow_2 ] ])
		};

	const follow_id = NotionLineage.Page.getFollowId('block_1', cache);
	expect(follow_id).toStrictEqual('follow_1');
});
