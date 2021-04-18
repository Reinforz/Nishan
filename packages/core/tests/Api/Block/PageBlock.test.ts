import { NotionCache } from '@nishans/cache';
import { createExecuteOperationsMock } from '../../../../../utils/tests';
import { NotionCore } from '../../../libs';
import { default_nishan_arg, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('toggleFollow', async () => {
	const { e1 } = createExecuteOperationsMock();
	const follow_1 = {
			id: 'follow_1',
			navigable_block_id: 'block_1',
			following: true
		},
		cache: any = {
			...NotionCache.createDefaultCache(),
			follow: new Map([ [ 'follow_1', follow_1 ] ])
		};
	const pageBlock = new NotionCore.Api.PageBlock({ ...default_nishan_arg, cache });
	await pageBlock.toggleFollow();
	e1([ o.f.s('follow_1', [ 'following' ], false) ]);
	expect(follow_1).toStrictEqual({
		...follow_1,
		following: false
	});
});
