import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { default_nishan_arg, last_edited_props, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('updateDiscussions', async () => {
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

  const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementation(async () => undefined);

	try{
    await NotionDiscourse.Discussions.update(
      block_id,
      [ [ 'discussion_1', { resolved: true, context: [ [ 'New Context' ] ] } ] ],
      {
        ...default_nishan_arg,
        cache,
        multiple: false
      }
    );
  
    expect(discussion_1).toStrictEqual({
      context: [ [ 'New Context' ] ],
      resolved: true
    });
    expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ block_id, 'block' ]);
    expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
      o.d.u('discussion_1', [], {
        context: [ [ 'New Context' ] ],
        resolved: true
      }),
      o.b.u(block_id, [], last_edited_props)
    ]);
  }catch(err){
    console.log(err.message)
  }
});
