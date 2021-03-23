import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../../libs';

describe('getDiscussionIds', () => {
	it(`initial discussion ids`, () => {
		const block_1: any = { discussions: [ 'discussion_1' ], content: [ 'block_2', 'block_3', 'block_4' ] },
			block_2: any = { discussions: [ 'discussion_2' ] },
			block_3: any = {},
			cache = {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ] ])
			};

		const discussion_ids = NotionLineage.Page.getDiscussionIds(block_1, cache);
		expect(discussion_ids).toStrictEqual([ 'discussion_1', 'discussion_2' ]);
	});

	it(`empty discussion ids`, () => {
		const block_1: any = { content: [ 'block_2', 'block_3', 'block_4' ] },
			block_2: any = {},
			block_3: any = {},
			cache = {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ] ])
			};

		const discussion_ids = NotionLineage.Page.getDiscussionIds(block_1, cache);
		expect(discussion_ids).toStrictEqual([]);
	});
});
