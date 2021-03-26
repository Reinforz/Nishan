import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('getComments', async () => {
	const comment_1: any = {
			context: [ [ 'Context' ] ],
			resolved: false
		},
		discussion_id = NotionIdz.Generate.id(),
		cache: any = {
			...NotionCache.createDefaultCache(),
			discussion: new Map([ [ discussion_id, { id: discussion_id, comments: [ 'comment_1' ] } ] ]),
			comment: new Map([ [ 'comment_1', comment_1 ] ])
		},
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => ({} as any));

	const comments = await NotionDiscourse.Comments.get(discussion_id, [ 'comment_1' ], {
		...default_nishan_arg,
		cache,
		multiple: false
	});

	expect(comments).toStrictEqual([ comment_1 ]);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ discussion_id, 'discussion' ]);
});
