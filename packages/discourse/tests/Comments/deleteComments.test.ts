import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg, last_edited_props, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';
import { createExecuteOperationsMock } from '../utils/createExecuteOperationsMock';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionDiscourse.deleteComments`, async () => {
	const comment_id = NotionIdz.Generate.id(),
		comment_data: any = { id: comment_id, parent_id: 'discussion_1' },
		discussion_data: any = { comments: [ comment_id ], id: 'discussion_1' },
		cache = {
			...NotionCache.createDefaultCache(),
			comment: new Map([ [ comment_id, comment_data ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_data ] ])
		},
		options = {
			...default_nishan_arg,
			cache
		},
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined),
		{ e1 } = createExecuteOperationsMock();

	await NotionDiscourse.Comments.delete('discussion_1', [ comment_id ], options);

	e1([
		o.cm.u(comment_id, [], {
			alive: false,
			...last_edited_props
		}),
		o.d.lr('discussion_1', [ 'comments' ], {
			id: comment_id
		})
	]);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'discussion_1', 'discussion' ]);
	expect(comment_data.alive).toBe(false);
	expect(discussion_data.comments).toStrictEqual([]);
});
