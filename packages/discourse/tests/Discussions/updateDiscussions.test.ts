import { NotionCache } from '@nishans/cache';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('updateDiscussions', () => {
	const init = () => {
		const discussion_1: any = {
				context: [ [ 'Context' ] ],
				resolved: false
			},
			cache: any = {
				...NotionCache.createDefaultCache(),
				discussion: new Map([ [ 'discussion_1', discussion_1 ] ])
			},
			fetchMultipleDataOrReturnCachedMock = jest
				.spyOn(NotionCache, 'fetchMultipleDataOrReturnCached')
				.mockImplementationOnce(async () => ({} as any)),
			executeOperationsMock = jest
				.spyOn(NotionOperations, 'executeOperations')
				.mockImplementation(async () => undefined);
		return {
			discussion_1,
			cache,
			fetchMultipleDataOrReturnCachedMock,
			executeOperationsMock
		};
	};

	it(`custom input`, async () => {
		const { discussion_1, cache, fetchMultipleDataOrReturnCachedMock, executeOperationsMock } = init();

		await NotionDiscourse.Discussions.update(
			[ { id: 'discussion_1', resolved: true, context: [ [ 'New Context' ] ] } ],
			{
				...default_nishan_arg,
				cache
			}
		);
		expect(discussion_1).toStrictEqual({
			context: [ [ 'New Context' ] ],
			resolved: true
		});
		expect(fetchMultipleDataOrReturnCachedMock.mock.calls[0][0]).toStrictEqual([ [ 'discussion_1', 'discussion' ] ]);
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.d.u('discussion_1', [], {
				context: [ [ 'New Context' ] ],
				resolved: true
			})
		]);
	});

	it(`default input`, async () => {
		const { discussion_1, cache, fetchMultipleDataOrReturnCachedMock, executeOperationsMock } = init();

		await NotionDiscourse.Discussions.update([ { id: 'discussion_1' } ], {
			...default_nishan_arg,
			cache
		});
		expect(discussion_1).toStrictEqual(discussion_1);
		expect(fetchMultipleDataOrReturnCachedMock.mock.calls[0][0]).toStrictEqual([ [ 'discussion_1', 'discussion' ] ]);
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([ o.d.u('discussion_1', [], discussion_1) ]);
	});
});
