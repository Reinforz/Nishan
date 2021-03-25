import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`NotionLineage.Block.getCommentIds`, () => {
	const discussion_1: any = {
			id: 'discussion_1',
			comments: [ 'comment_1' ]
		},
		block_1: any = { discussions: [ 'discussion_1', 'discussion_2' ] },
		block_2: any = {},
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ])
		};

	const comment_ids = NotionLineage.Block.getCommentIds(block_1, cache);
	NotionLineage.Block.getCommentIds(block_2, cache);
	expect(comment_ids).toStrictEqual([ 'comment_1' ]);
});
