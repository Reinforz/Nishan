import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionDiscourse.updateComments`, async () => {
	const comment_id = NotionIdz.Generate.id(),
		comment_data: any = { id: comment_id },
		cache = {
			...NotionCache.createDefaultCache(),
			comment: new Map([ [ comment_id, comment_data ] ])
		},
		options = {
			...default_nishan_arg,
			cache
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	await NotionDiscourse.Comments.update(
		[
			{
				comment_id,
				text: [ [ 'New Comment' ] ]
			}
		],
		options
	);

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cm.s(comment_id, [ 'text' ], [ [ 'New Comment' ] ])
	]);
	expect(comment_data.text).toStrictEqual([ [ 'New Comment' ] ]);
});
