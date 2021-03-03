import { ICache, NotionCacheObject } from '@nishans/cache';
import { NotionMutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { CollectionViewPage, NotionData, NotionUser, Page } from '../../libs';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
  jest.resetAllMocks();
});

describe('NotionUser', () => {
  it('create space', async () => {
    const logger_spy = jest.fn(), stack: IOperation[] = [];

    const spaceId = v4();
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      user_root: new Map([['user_root_1', { space_views: [] }] as any]),
    };
    const notion_user = new NotionUser({
      ...default_nishan_arg,
      cache,
      logger: logger_spy,
      id: 'user_root_1',
      stack,
    });

    const createSpace_spy = jest.spyOn(NotionMutations, 'createSpace').mockImplementationOnce(async () => {
      return { spaceId } as any;
    });

    const space = await notion_user.createSpace({
      name: 'Space One',
      contents: [
        {
          type: "page",
          properties: {
            title: [["Hello World"]]
          },
          contents: []
        }
      ]
    });

    const space_views = cache.user_root.get('user_root_1')?.space_views ?? [];

    const space_cached_data = space.getCachedData(), space_snapshot_data = {
      created_by_id: 'user_root_1',
      created_by_table: 'notion_user',
      created_time: expect.any(Number),
      ...last_edited_props,
      version: 0,
      id: expect.any(String),
      invite_link_code: '',
      name: 'Space One',
      pages: [expect.any(String)],
      permissions: [],
      plan_type: 'personal',
      shard_id: 123,
      icon: '',
      disable_public_access: false,
      disable_export: false,
      disable_guests: false,
      disable_move_to_space: false,
      beta_enabled: true,
      invite_link_enabled: true,
    }, space_view_snapshot_data = {
      created_getting_started: false,
      created_onboarding_templates: false,
      space_id: expect.any(String),
      notify_mobile: true,
      notify_desktop: true,
      notify_email: true,
      parent_id: 'user_root_1',
      parent_table: 'user_root',
      alive: true,
      joined: true,
      id: expect.any(String),
      version: 1,
      visited_templates: [],
      sidebar_hidden_templates: [],
      bookmarked_pages: []
    };

    expect(logger_spy).toHaveBeenNthCalledWith(1, "CREATE", "space", spaceId);
    expect(logger_spy).toHaveBeenNthCalledWith(2, "CREATE", "space_view", space_views[0]);
    expect(logger_spy).toHaveBeenNthCalledWith(3, "UPDATE", "user_root", 'user_root_1');
    expect(logger_spy).toHaveBeenNthCalledWith(4, "UPDATE", "space", spaceId);

    expect(createSpace_spy).toHaveBeenCalledTimes(1);
    expect(createSpace_spy).toHaveBeenCalledWith(
      { initialUseCases: [], name: 'Space One', planType: 'personal', icon: '' },
      {
        interval: 0,
        user_id: 'user_root_1',
        token: 'token'
      }
    );

    expect(space_views.length).toBe(1);

    expect(cache.space_view.get(space_views[0])).toStrictEqual(space_view_snapshot_data);
    expect(space_cached_data).toStrictEqual(space_snapshot_data);

    expect(stack.slice(0, 3)).toStrictEqual([
      o.s.u(expect.any(String), [], {
        disable_public_access: false,
        disable_export: false,
        disable_guests: false,
        disable_move_to_space: false,
        beta_enabled: true,
        invite_link_enabled: true,
      }),
      o.sv.u(expect.any(String), [], space_view_snapshot_data),
      o.ur.la(expect.any(String), ['space_views'], {
        after: '',
        id: expect.any(String)
      }),
    ]);
  });

  describe('get space', () => {
    it(`multiple=false,arg=string`, async () => {
      const cache: ICache = {
        ...NotionCacheObject.createDefaultCache(),
        space: new Map([
          ['space_1', { id: 'space_1', shard_id: 123 }],
          ['space_2', { id: 'space_2', shard_id: 123 }]
        ] as any),
      };
      const notion_user = new NotionUser({
        ...default_nishan_arg,
        cache,
        id: 'user_root_1',
      });

      const space = await notion_user.getSpace('space_2');
      expect(space.getCachedData()).toStrictEqual( { id: 'space_2', shard_id: 123 });
      expect(space.id).toBe('space_2');
    });
  });

  describe('update space', () => {
    it(`multiple=false,arg=string`, async () => {
      const cache: ICache = {
        ...NotionCacheObject.createDefaultCache(),
        space: new Map([
          ['space_1', { id: 'space_1', shard_id: 123, name: 'Space 1' }],
          ['space_2', { id: 'space_2', shard_id: 123, name: 'Space 2' }]
        ] as any),
      },
        stack: IOperation[] = [];

      const notion_user = new NotionUser({
        ...default_nishan_arg,
        cache,
        id: 'user_root_1',
        stack,
      });

      const space = await notion_user.updateSpace(['space_1', { name: 'Space One' }]);

      expect(space.getCachedData()).toStrictEqual({
        id: 'space_1',
        shard_id: 123,
        name: 'Space One',
        ...last_edited_props,
      });

      expect(stack).toStrictEqual([
        o.s.u('space_1', [], {
          name: 'Space One',
            ...last_edited_props,
        }),
      ]);
    });
  });

  it('getUserSettings', () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      user_settings: new Map([['user_root_1', { id: 'user_root_1', name: 'User Settings 1' }]] as any)
    },
      stack: IOperation[] = [];

    const notion_user = new NotionUser({
      ...default_nishan_arg,
      cache,
      id: 'user_root_1',
      stack,
    });
    const user_settings = notion_user.getUserSettings();
    expect(user_settings.getCachedData()).toStrictEqual({ id: 'user_root_1', name: 'User Settings 1' });
    expect(user_settings.id).toBe('user_root_1');
  });

  it('getUserRoot', () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      user_root: new Map([['user_root_1', { id: 'user_root_1', name: 'User Root 1' }]] as any),
    },
      stack: IOperation[] = [];

    const notion_user = new NotionUser({
      ...default_nishan_arg,
      cache,
      id: 'user_root_1',
      stack,
    });
    const user_root = notion_user.getUserRoot();
    expect(user_root.getCachedData()).toStrictEqual({ id: 'user_root_1', name: 'User Root 1' });
    expect(user_root.id).toBe('user_root_1');
  });

  describe('delete space', () => {
    it(`multiple=false,arg=string`, async () => {
      const cache: ICache = {
        ...NotionCacheObject.createDefaultCache(),
        space: new Map([['space_1', { id: 'space_1', name: 'Space One' }]] as any),
      },
        stack: IOperation[] = [];

      const notion_user = new NotionUser({
        ...default_nishan_arg,
        cache,
        id: 'user_root_1',
        stack,
      });

      const enqueuetask_spy = jest.spyOn(NotionMutations, 'enqueueTask').mockImplementationOnce(async () => {
        return {} as any;
      });

      await notion_user.deleteSpace('space_1');
      expect(enqueuetask_spy).toHaveBeenCalledTimes(1);
      expect(enqueuetask_spy).toHaveBeenCalledWith(
        {
          task: {
            eventName: 'deleteSpace',
            request: {
              spaceId: 'space_1'
            }
          }
        },
        {
          interval: 0,
          token: 'token',
          user_id: 'user_root_1'
        }
      );
    });
  });

  describe('getPagesById', () => {
    it('Work correctly for type=page & cvp', async () => {
      const block_1_id = v4(),
        block_2_id = v4(),
        block_1 = { id: block_1_id, type: 'page', parent_table: 'space', parent_id: 'space_1', properties: { title: [['Block One']] } } as any,
        block_2 = {
          id: block_2_id,parent_table: 'space', parent_id: 'space_1',
          type: 'collection_view_page',
          collection_id: 'collection_1',
          view_ids: ['collection_view_1']
        } as any;
      const cache: ICache = {
        ...NotionCacheObject.createDefaultCache(),
        block: new Map([
          [block_1_id, block_1],
          [block_2_id, block_2]
        ]),
        space: new Map([['space_1', {id: 'space_1'} as any]]),
        collection: new Map([
          ['collection_1', { id: 'collection_1', type: 'collection', name: [['Collection One']] } as any]
        ]),
        collection_view: new Map([['collection_view_1', { id: 'collection_view_1' } as any]]),
      },
        stack: IOperation[] = [];

      const notion_user = new NotionUser({
        cache,
        id: 'user_root_1',
        stack,
        interval: 0,
        shard_id: 123,
        space_id: 'space_1',
        token: 'token',
        user_id: 'user_root_1'
      });

      const initializeCacheForSpecificDataMock = jest
        .spyOn(NotionData.prototype, 'initializeCacheForSpecificData')
        .mockImplementationOnce(() => {
          return {} as any;
        });

      const page_map = await notion_user.getPagesById([block_1_id, block_2_id]);
      expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(2);
      expect(initializeCacheForSpecificDataMock).toHaveBeenNthCalledWith(1, block_1_id, 'block');
      expect(initializeCacheForSpecificDataMock).toHaveBeenNthCalledWith(2, block_2_id, 'block');
      expect((page_map.page.get(block_1_id) as Page).getCachedData()).toStrictEqual(block_1);
      expect((page_map.collection_view_page.get(block_2_id) as CollectionViewPage).getCachedData()).toStrictEqual(block_2);
      expect((page_map.page.get('Block One') as Page).getCachedData()).toStrictEqual(block_1);
      expect((page_map.collection_view_page.get('Collection One') as CollectionViewPage).getCachedData()).toStrictEqual(block_2);
    });

    it('throw an error for type=header', async () => {
      const block_1_id = v4(),
        block_1 = { id: block_1_id, type: 'header' } as any,
      cache: ICache = {
        ...NotionCacheObject.createDefaultCache(),
        block: new Map([
          [block_1_id, block_1]
        ]),
      };

      const notion_user = new NotionUser({
        cache,
        id: 'user_root_1',
        stack: [],
        interval: 0,
        shard_id: 123,
        space_id: 'space_1',
        token: 'token',
        user_id: 'user_root_1'
      });

      await expect(notion_user.getPagesById([block_1_id])).rejects.toThrow();
    });
  })

  it('update', async () => {
    const cache = NotionCacheObject.createDefaultCache(),
      stack: IOperation[] = [];

    const notion_user = new NotionUser({
      ...default_nishan_arg,
      cache,
      id: 'user_root_1',
      stack,
    });

    const updateCacheLocallyMock = jest.spyOn(NotionData.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
      return {} as any;
    });

    notion_user.update({
      family_name: 'Shaheer'
    });

    expect(updateCacheLocallyMock).toHaveBeenCalledTimes(1);
    expect(updateCacheLocallyMock).toHaveBeenCalledWith(
      {
        family_name: 'Shaheer'
      },
      ['family_name', 'given_name', 'profile_photo']
    );
  });
});
