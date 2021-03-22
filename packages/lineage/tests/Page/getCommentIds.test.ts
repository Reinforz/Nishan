import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

it(`NotionLineage.Page.getCommentIds`, () => {
	const discussion_1: any = {
			id: 'discussion_1',
			comments: [ 'comment_1' ]
		},
		block_1: any = { content: [ 'block_2', 'block_3', 'block_4' ] },
		block_2: any = { discussions: [ 'discussion_1', 'discussion_2' ] },
		block_3: any = {},
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ])
		};

	const comment_ids = NotionLineage.Page.getCommentIds(block_1, cache);
	expect(comment_ids).toStrictEqual([ 'comment_1' ]);
});
