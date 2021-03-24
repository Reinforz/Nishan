import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('getDiscussions', async () => {
	const discussion_1: any = {
			context: [ [ 'Context' ] ],
			resolved: false
		},
		block_id = NotionIdz.Generate.id(),
		cache: any = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ block_id, { id: block_id, discussions: [ 'discussion_1' ] } ] ]),
			discussion: new Map([ [ 'discussion_1', discussion_1 ] ])
		},
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => ({} as any));

	const discussions = await NotionDiscourse.Discussions.get(block_id, [ 'discussion_1' ], {
		...default_nishan_arg,
		cache,
		multiple: false
	});

	expect(discussions).toStrictEqual([ discussion_1 ]);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ block_id, 'block' ]);
});
