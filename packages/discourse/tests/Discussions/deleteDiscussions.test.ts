import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg, last_edited_props, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';
import { createExecuteOperationsMock } from '../utils/createExecuteOperationsMock';

afterEach(() => {
	jest.restoreAllMocks();
});

it('deleteDiscussions', async () => {
	const discussion_1: any = {
			context: [ [ 'Context' ] ],
			resolved: false
		},
		block_id = NotionIdz.Generate.id(),
		block_1: any = { id: block_id, discussions: [ 'discussion_1' ] },
		cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ block_id, block_1 ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ])
		},
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => ({} as any)),
		{ e1 } = createExecuteOperationsMock();

	const discussions = await NotionDiscourse.Discussions.delete(block_id, [ 'discussion_1' ], {
		...default_nishan_arg,
		cache,
		multiple: false
	});

	expect(discussions).toStrictEqual([ discussion_1 ]);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ block_id, 'block' ]);
	e1([ o.b.lr(block_id, [ 'discussions' ], { id: 'discussion_1' }), o.b.u(block_id, [], last_edited_props) ]);
	expect(block_1.discussions).toStrictEqual([]);
});
