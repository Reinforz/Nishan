import { NotionCache } from '@nishans/cache';
import { createExecuteOperationsMock } from '../../../../utils/tests';
import {
  default_nishan_arg,
  last_edited_props,
  o
} from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
  jest.restoreAllMocks();
});

it('deleteDiscussions', async () => {
  const discussion_1: any = {
      context: [['Context']],
      resolved: false
    },
    block_1: any = { id: 'block_1', discussions: ['discussion_1'] },
    cache: any = {
      ...NotionCache.createDefaultCache(),
      block: new Map([['block_1', block_1]]),
      discussion: new Map([['discussion_1', discussion_1]])
    },
    initializeCacheForSpecificDataMock = jest
      .spyOn(NotionCache, 'initializeCacheForSpecificData')
      .mockImplementation(async () => ({} as any)),
    { e1 } = createExecuteOperationsMock();

  const discussions = await NotionDiscourse.Discussions.delete(
    'block_1',
    ['discussion_1'],
    {
      ...default_nishan_arg,
      cache_init_tracker: {
        ...NotionCache.createDefaultCacheInitializeTracker(),
        block: new Map([['block_1', true]])
      },
      cache,
      multiple: false
    }
  );

  expect(discussions).toStrictEqual([discussion_1]);
  expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([
    'block_1',
    'block'
  ]);
  e1([
    o.b.lr('block_1', ['discussions'], { id: 'discussion_1' }),
    o.b.u('block_1', [], last_edited_props)
  ]);
  expect(block_1.discussions).toStrictEqual([]);
});
