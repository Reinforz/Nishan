import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, last_edited_props, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

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
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionDiscourse.Comments.delete([ comment_id ], options);

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.s(comment_id, [ 'alive' ], false),
		o.d.lr('discussion_1', [ 'comments' ], {
			id: comment_id
		}),
		o.cm.u(comment_id, [], last_edited_props)
	]);
	expect(comment_data.alive).toBe(false);
	expect(discussion_data.comments).toStrictEqual([]);
});
