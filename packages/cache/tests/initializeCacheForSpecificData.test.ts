import { NotionEndpoints } from '@nishans/endpoints';
import { INotionCache } from '@nishans/types';
import { NotionCache } from '../libs';

afterEach(() => {
  jest.restoreAllMocks();
});

const createUpdateCacheIfNotPresentMock = () =>
  jest
    .spyOn(NotionCache, 'updateCacheIfNotPresent')
    .mockImplementationOnce(async () => undefined);

describe('initializeCacheForSpecificData', () => {
  it(`type=discussion`, async () => {
    const discussion_1 = {
        id: 'discussion_1',
        parent_id: 'block_1',
        comments: ['comment_1']
      },
      cache_init_tracker = NotionCache.createDefaultCacheInitializeTracker();

    const cache = {
      ...NotionCache.createDefaultCache(),
      discussion: new Map([['discussion_1', discussion_1]])
    } as any;

    const updateCacheIfNotPresentMock = jest.spyOn(
      NotionCache,
      'updateCacheIfNotPresent'
    );

    updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

    await NotionCache.initializeCacheForSpecificData(
      'discussion_1',
      'discussion',
      {
        token: 'token',
        cache,
        user_id: 'user_root_1',
        cache_init_tracker
      }
    );
    expect(cache_init_tracker.discussion.get('discussion_1')).toBe(true);
    expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
      ['comment_1', 'comment'],
      ['block_1', 'block']
    ]);
  });

  it(`type=comment`, async () => {
    const comment_1 = {
        id: 'comment_1',
        parent_id: 'discussion_1',
        parent_table: 'discussion',
        space_id: 'space_1',
        created_by_id: 'notion_user_1',
        last_edited_by_id: 'notion_user_1'
      },
      cache_init_tracker = NotionCache.createDefaultCacheInitializeTracker();

    const cache = {
      ...NotionCache.createDefaultCache(),
      comment: new Map([['comment_1', comment_1]])
    } as any;

    const updateCacheIfNotPresentMock = jest.spyOn(
      NotionCache,
      'updateCacheIfNotPresent'
    );

    updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

    await NotionCache.initializeCacheForSpecificData('comment_1', 'comment', {
      token: 'token',
      cache,
      user_id: 'user_root_1',
      cache_init_tracker
    });
    expect(cache_init_tracker.comment.get('comment_1')).toBe(true);
    expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
      ['notion_user_1', 'notion_user'],
      ['space_1', 'space'],
      ['discussion_1', 'discussion']
    ]);
  });

  it(`type=collection_view`, async () => {
    const block_1: any = {
        id: 'block_1',
        collection_id: 'collection_1'
      },
      collection_view_1 = {
        id: 'collection_view_1',
        parent_id: 'block_1'
      };

    const cache = {
      ...NotionCache.createDefaultCache(),
      block: new Map([['block_1', block_1]]),
      collection_view: new Map([['collection_view_1', collection_view_1]])
    } as any;

    const updateCacheIfNotPresentMock = jest.spyOn(
      NotionCache,
      'updateCacheIfNotPresent'
    );

    updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);
    updateCacheIfNotPresentMock.mockImplementationOnce(async () => undefined);

    await NotionCache.initializeCacheForSpecificData(
      'collection_view_1',
      'collection_view',
      {
        token: 'token',
        cache,
        user_id: 'user_root_1',
        cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
      }
    );
    expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
    expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
      ['block_1', 'block']
    ]);
    expect(updateCacheIfNotPresentMock.mock.calls[1][0]).toStrictEqual([
      ['collection_1', 'collection']
    ]);
  });

  describe(`type=block`, () => {
    it(`type=page, more chunks`, async () => {
      const block_1: any = {
        id: 'block_1',
        type: 'page',
        parent_table: 'space',
        parent_id: 'space_1',
        last_edited_by_id: 'notion_user_1',
        created_by_id: 'notion_user_1',
        space_id: 'space_1'
      };

      const cache = {
        ...NotionCache.createDefaultCache(),
        block: new Map([['block_1', block_1]])
      };

      const updateCacheIfNotPresentMock = jest
          .spyOn(NotionCache, 'updateCacheIfNotPresent')
          .mockImplementationOnce(async () => undefined),
        getActivityLogMock = jest
          .spyOn(NotionEndpoints.Queries, 'getActivityLog')
          .mockImplementationOnce(async () => ({ recordMap: {} } as any)),
        loadPageChunkMock = jest
          .spyOn(NotionEndpoints.Queries, 'loadPageChunk')
          .mockImplementationOnce(
            async () =>
              ({
                recordMap: {
                  block: {
                    block_2: {
                      value: {
                        id: 'block_2'
                      }
                    }
                  }
                },
                cursor: {
                  stack: [[{ index: 5 }]]
                }
              } as any)
          )
          .mockImplementationOnce(
            async () =>
              ({
                recordMap: {
                  block: {
                    block_2: {
                      value: {
                        id: 'block_2'
                      }
                    }
                  }
                },
                cursor: {
                  stack: []
                }
              } as any)
          );

      await NotionCache.initializeCacheForSpecificData('block_1', 'block', {
        token: 'token',
        cache,
        user_id: 'user_root_1',
        cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
      });

      expect(loadPageChunkMock.mock.calls[0][0]).toStrictEqual({
        pageId: 'block_1',
        limit: 100,
        cursor: {
          stack: [
            [
              {
                table: 'block',
                id: 'block_1',
                index: 0
              }
            ]
          ]
        },
        chunkNumber: 1,
        verticalColumns: false
      });
      expect(getActivityLogMock.mock.calls[0][0]).toStrictEqual({
        limit: 100,
        spaceId: 'space_1',
        navigableBlockId: 'block_1'
      });
      expect(loadPageChunkMock.mock.calls[1][0]).toStrictEqual({
        pageId: 'block_1',
        limit: 100,
        cursor: {
          stack: [
            [
              {
                table: 'block',
                id: 'block_1',
                index: 5
              }
            ]
          ]
        },
        chunkNumber: 1,
        verticalColumns: false
      });
      expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['notion_user_1', 'notion_user'],
        ['space_1', 'space']
      ]);
    });

    it(`type=header`, async () => {
      const block_1: any = {
        id: 'block_1',
        type: 'header',
        parent_table: 'space',
        parent_id: 'space_1',
        last_edited_by_id: 'notion_user_1',
        created_by_id: 'notion_user_1'
      };

      const cache = {
        ...NotionCache.createDefaultCache(),
        block: new Map([['block_1', block_1]])
      };

      const updateCacheIfNotPresentMock = jest
        .spyOn(NotionCache, 'updateCacheIfNotPresent')
        .mockImplementationOnce(async () => undefined);

      const loadPageChunkMock = jest
        .spyOn(NotionEndpoints.Queries, 'loadPageChunk')
        .mockImplementationOnce(async () => ({} as any));

      await NotionCache.initializeCacheForSpecificData('block_1', 'block', {
        token: 'token',
        cache,
        user_id: 'user_root_1',
        cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
      });

      expect(loadPageChunkMock).not.toHaveBeenCalled();
      expect(updateCacheIfNotPresentMock).toHaveBeenCalledTimes(2);
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['notion_user_1', 'notion_user'],
        ['space_1', 'space']
      ]);
    });
  });

  it(`Should work for type space`, async () => {
    const space_1: any = {
        created_by_id: 'notion_user_1',
        last_edited_by_id: 'notion_user_1',
        permissions: [
          {
            type: 'user_permission',
            user_id: 'notion_user_1'
          },
          {
            type: 'user_permission',
            user_id: 'notion_user_2'
          }
        ],
        id: 'space_1',
        pages: ['block_1']
      },
      cache: INotionCache = {
        ...NotionCache.createDefaultCache(),
        space: new Map([['space_1', space_1]])
      };

    const updateCacheIfNotPresentMock = jest
      .spyOn(NotionCache, 'updateCacheIfNotPresent')
      .mockImplementationOnce(async () => undefined);

    await NotionCache.initializeCacheForSpecificData('space_1', 'space', {
      token: 'token',
      cache,
      user_id: 'user_root_1',
      cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
    });
    expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
      ['block_1', 'block'],
      ['notion_user_1', 'notion_user'],
      ['notion_user_2', 'notion_user']
    ]);
  });

  it(`Should work for type user_root`, async () => {
    const user_root_1: any = {
        space_views: ['space_view_1'],
        id: 'user_root_1'
      },
      cache: INotionCache = {
        ...NotionCache.createDefaultCache(),
        user_root: new Map([['user_root_1', user_root_1]])
      };

    const updateCacheIfNotPresentMock = jest
      .spyOn(NotionCache, 'updateCacheIfNotPresent')
      .mockImplementationOnce(async () => undefined);

    await NotionCache.initializeCacheForSpecificData(
      'user_root_1',
      'user_root',
      {
        token: 'token',
        cache,
        user_id: 'user_root_1',
        cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
      }
    );
    expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
      ['space_view_1', 'space_view']
    ]);
  });

  describe('space_view', () => {
    const createCache = (space_view_1: any) => {
      return {
        ...NotionCache.createDefaultCache(),
        space_view: new Map([['space_view_1', space_view_1]])
      } as INotionCache;
    };

    it(`bookmarked_pages=[id]`, async () => {
      const space_view_1: any = {
          id: 'space_view_1',
          bookmarked_pages: ['block_1'],
          space_id: 'space_1',
          parent_id: 'user_root_1'
        },
        cache = createCache(space_view_1);
      const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
      await NotionCache.initializeCacheForSpecificData(
        'space_view_1',
        'space_view',
        {
          token: 'token',
          cache,
          user_id: 'user_root_1',
          cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
        }
      );
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['block_1', 'block'],
        ['space_1', 'space'],
        ['user_root_1', 'user_root']
      ]);
    });

    it(`bookmarked_pages=undefined`, async () => {
      const space_view_1: any = {
          id: 'space_view_1',
          space_id: 'space_1',
          parent_id: 'user_root_1'
        },
        cache = createCache(space_view_1);
      const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
      await NotionCache.initializeCacheForSpecificData(
        'space_view_1',
        'space_view',
        {
          token: 'token',
          cache,
          user_id: 'user_root_1',
          cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
        }
      );
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['space_1', 'space'],
        ['user_root_1', 'user_root']
      ]);
    });
  });

  describe('collection', () => {
    const query_collection_payload = {
        collectionId: 'collection_1',
        collectionViewId: '',
        query: {},
        loader: {
          type: 'table',
          loadContentCover: false,
          limit: 10000,
          userTimeZone: ''
        }
      },
      query_collection_response = {
        recordMap: {
          something: 'something'
        }
      } as any,
      createQueryCollectionMock = () =>
        jest
          .spyOn(NotionEndpoints.Queries, 'queryCollection')
          .mockImplementationOnce(async () => query_collection_response);

    it(`template_pages=[]`, async () => {
      const collection_1 = {
          id: 'collection_1',
          template_pages: ['block_2'],
          parent_id: 'block_1'
        } as any,
        cache = {
          ...NotionCache.createDefaultCache(),
          collection: new Map([['collection_1', collection_1]])
        };

      const saveToCacheMock = jest
        .spyOn(NotionCache, 'saveToCache')
        .mockImplementationOnce(() => undefined);
      const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
      const queryCollectionMock = createQueryCollectionMock();

      await NotionCache.initializeCacheForSpecificData(
        'collection_1',
        'collection',
        {
          token: 'token',
          cache,
          user_id: 'user_root_1',
          cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
        }
      );

      expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual(
        query_collection_payload
      );
      expect(saveToCacheMock.mock.calls[0][0]).toBe(
        query_collection_response.recordMap
      );
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['block_2', 'block'],
        ['block_1', 'block']
      ]);
    });

    it(`template_pages=undefined`, async () => {
      const collection_1 = {
          id: 'collection_1',
          parent_id: 'block_1'
        } as any,
        cache = {
          ...NotionCache.createDefaultCache(),
          collection: new Map([['collection_1', collection_1]])
        };

      const saveToCacheMock = jest
        .spyOn(NotionCache, 'saveToCache')
        .mockImplementationOnce(() => undefined);
      const updateCacheIfNotPresentMock = createUpdateCacheIfNotPresentMock();
      const queryCollectionMock = createQueryCollectionMock();

      await NotionCache.initializeCacheForSpecificData(
        'collection_1',
        'collection',
        {
          token: 'token',
          cache,
          user_id: 'user_root_1',
          cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
        }
      );

      expect(queryCollectionMock.mock.calls[0][0]).toStrictEqual(
        query_collection_payload
      );
      expect(saveToCacheMock.mock.calls[0][0]).toBe(
        query_collection_response.recordMap
      );
      expect(updateCacheIfNotPresentMock.mock.calls[0][0]).toStrictEqual([
        ['block_1', 'block']
      ]);
    });
  });

  it(`Should throw error for unsupported data`, async () => {
    const cache = NotionCache.createDefaultCache();
    await NotionCache.initializeCacheForSpecificData(
      'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7c',
      'unknown' as any,
      {
        cache,
        token: 'token',
        user_id: 'user_root_1',
        cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
      }
    );
  });
});
