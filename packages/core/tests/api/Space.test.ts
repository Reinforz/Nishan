import { ICache, NotionCache } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { NotionOperations } from '@nishans/operations';
import { v4 } from 'uuid';
import { NotionData, Space, TSpaceUpdateKeys } from '../../libs';
import { createSpaceIterateArguments } from '../../libs/api/Space';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createSpaceIterateArguments', () => {
  it(`type=page`, async()=>{
    const cache = {
      block: new Map([
        ['block_1', {type: "page", id: "block_1"}],
        ['block_2', {type: "header", id: "block_1"}]
      ])
    } as any;
    const data = await createSpaceIterateArguments('block_1', {cache, token: 'token', user_id: 'user_1'});
    expect(data).toStrictEqual({id: "block_1", type: "page"});
  })

  it(`type=collection_view_page,collection in cache`, async()=>{
    const cache = {
      collection: new Map([['collection_1', {id: 'collection_1'}]]),
      block: new Map([['block_1', {type: "collection_view_page", id: "block_1", collection_id: 'collection_1'}]])
    } as any;
    const data = await createSpaceIterateArguments('block_1', {cache, token: 'token', user_id: 'user_1'});
    expect(data).toStrictEqual({collection: {id: 'collection_1'}, type: "collection_view_page", id: "block_1", collection_id: 'collection_1'})
  })

  it(`data=undefined,type=header`, async ()=>{
    const cache = {
      block: new Map([
        ['block_1', {type: "page", id: "block_1"}],
        ['block_2', {type: "header", id: "block_1"}]
      ])
    } as any;
    const data = await createSpaceIterateArguments('block_2', {cache, token: 'token', user_id: 'user_1'});
    expect(data).toBeUndefined();
  })
})

it(`getSpaceView`, async () => {
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			space_view: new Map([
				[ 'space_view_2', { alive: true, space_id: 'space_2', id: 'space_view_2' } as any ],
				[ 'space_view_1', { alive: true, space_id: 'space_1', id: 'space_view_1' } as any ]
			]),
		};
	const logger_spy = jest.fn();
	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
		logger: logger_spy
	});

	const space_view = space.getSpaceView();
	expect(logger_spy).toHaveBeenCalledWith('READ', 'space_view', 'space_view_1');
	expect(space_view.getCachedData()).toStrictEqual({
		alive: true,
		space_id: 'space_1',
		id: 'space_view_1'
	});
});

it(`update`, async () => {
	const cache = NotionCache.createDefaultCache();;

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});

	const updateCacheLocallyMock = jest.spyOn(NotionData.prototype, 'updateCacheLocally').mockImplementationOnce(async () => undefined);

	await space.update({
		beta_enabled: false
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			beta_enabled: false
		},
		TSpaceUpdateKeys
	);
});

it(`delete`, async () => {
	const cache = NotionCache.createDefaultCache();
	const logger_spy = jest.fn();

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
		logger: logger_spy
	});

	const enqueueTaskMock = jest.spyOn(NotionEndpoints.Mutations, 'enqueueTask').mockImplementationOnce(() => {
		return {} as any;
	});

	await space.delete();

	expect(logger_spy).toHaveBeenCalledWith('DELETE', 'space', 'space_1');

	expect(enqueueTaskMock).toHaveBeenCalledTimes(1);
	expect(enqueueTaskMock).toHaveBeenCalledWith(
		{
			task: {
				eventName: 'deleteSpace',
				request: {
					spaceId: 'space_1'
				}
			}
		},
		{
			token: 'token',
			interval: 0
		}
	);
});

it(`createRootPages`, async () => {
	const block_id = v4();
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ]),
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async()=>undefined);

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});

	const block_map = await space.createRootPages([
		{
			type: 'page',
			id: block_id,
			properties: {
				title: [ [ 'Page One' ] ]
			},
      contents: []
		}
	]);

  expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(block_map.page.get('Page One')?.getCachedData()).toStrictEqual(expect.objectContaining({
    id: block_id
  }));
	expect(block_map.page.get(block_id)?.getCachedData()).toStrictEqual(expect.objectContaining({
    id: block_id
  }));
	expect(cache.block.get(block_id)).toStrictEqual(expect.objectContaining({
    id: block_id
  }));
});

it(`getRootPage`, async () => {
	const block_1: any = { type: 'page', id: 'block_1', properties: { title: [ [ 'Block One' ] ] } }, cache: ICache = {
			...NotionCache.createDefaultCache(),
			block: new Map([
				[ 'block_1', block_1 ],
			]),
			notion_user: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			space: new Map([
				[
					'space_1',
					{
						id: 'space_1',
						pages: [ 'block_1' ],
            created_by_id: 'user_root_1',
						permissions: [
							{
								role: 'editor',
								type: 'space_permission',
								user_id: 'user_root_1'
							}
						]
					} as any
				]
			]),
			user_root: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
		},
    initializeCacheForSpecificDataMock = jest.spyOn(NotionCache, 'initializeCacheForSpecificData').mockImplementationOnce(async()=>undefined);

	const logger_spy = jest.fn();

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
		logger: logger_spy
	});

	const page_map_1 = await space.getRootPage('block_1');

  expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual(['space_1', 'space']);
  expect(page_map_1.page.get('Block One')?.getCachedData()).toStrictEqual(block_1);
});

it(`updateRootPage`, async()=>{
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			user_root: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [], created_by_id: 'user_root_1', } as any ] ]),
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async()=>undefined),
    initializeCacheForSpecificDataMock = jest.spyOn(NotionCache, 'initializeCacheForSpecificData').mockImplementationOnce(async()=>undefined);

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});
  const update_arg: any = {
    properties: {
      title: [ [ 'Page Two' ] ]
    }
  }

	const block_map = await space.updateRootPage(['block_1',
		{
			...update_arg,
      type: "page"
		}
	]);
  
  expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual(['space_1', 'space']);
	expect(block_map.page.get('Page One')?.getCachedData()).toStrictEqual(expect.objectContaining({id: 'block_1', ...update_arg}));
	expect(block_map.page.get('block_1')?.getCachedData()).toStrictEqual(expect.objectContaining({id: 'block_1', ...update_arg}));
	expect(cache.block.get('block_1')).toStrictEqual(expect.objectContaining({id: 'block_1', ...update_arg}));
  expect(executeOperationsMock).toHaveBeenCalledTimes(1);
})

it(`deleteRootPage`, async()=>{
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			user_root: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [], created_by_id: 'user_root_1', } as any ] ]),
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async()=>undefined),
    initializeCacheForSpecificDataMock = jest.spyOn(NotionCache, 'initializeCacheForSpecificData').mockImplementationOnce(async()=>undefined);

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});

	await space.deleteRootPage('block_1');

  expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual(['space_1', 'space']);
  expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(cache.block.get('block_1')?.alive).toBe(false);
	expect(cache.space.get('space_1')).toStrictEqual(expect.objectContaining({
    pages: []
  }));
});

it(`addMembers`, async()=>{
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      } ] } as any ] ]),
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async()=>undefined);

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});

  const findUser = jest.spyOn(NotionEndpoints.Queries, 'findUser').mockImplementationOnce(()=>{
    return {
      value: {
        value: {
          id: 'user_root_2' 
        }
      }
    } as any;
  })

	const notion_users = await space.addMembers([['user_root_2@gmail.com', 'editor']]);
  
  expect(findUser).toHaveBeenCalledTimes(1);
  expect(findUser).toHaveBeenNthCalledWith(1, {email: 'user_root_2@gmail.com'}, expect.objectContaining({
    interval: 0,
    token: 'token',
    user_id: 'user_root_1'
  }));
  expect(cache.space.get('space_1')?.permissions).toStrictEqual([
    { user_id: 'user_root_1' },
    { role: 'editor', type: "user_permission", user_id: 'user_root_2' }
  ]);
  expect(notion_users).toStrictEqual([
    {
      id: 'user_root_2'
    }
  ]);
  expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
    o.s.spi('space_1', ["permissions"], { role: 'editor', type: "user_permission", user_id: 'user_root_2' }),
    o.s.u('space_1', [], last_edited_props)
  ]);
  findUser.mockImplementationOnce(()=>{
    return {
    } as any;
  });
	await expect(()=>space.addMembers([['user_root_2@gmail.com', 'editor']])).rejects.toThrow();
});

it(`removeUsers`, async()=>{
	const cache: ICache = {
			...NotionCache.createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      }, {
        user_id: 'user_root_2'
      } ] } as any ] ]),
		},
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async()=>undefined);

	const space = new Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
	});

  const removeUsersFromSpaceMock = jest.spyOn(NotionEndpoints.Mutations, 'removeUsersFromSpace').mockImplementationOnce(()=>{
    return {} as any;
  })

	await space.removeUsers(['user_root_2']);
  expect(removeUsersFromSpaceMock).toHaveBeenCalledTimes(1);
  expect(removeUsersFromSpaceMock).toHaveBeenCalledWith({
    removePagePermissions: true,
    revokeUserTokens: false,
    spaceId: 'space_1',
    userIds: ['user_root_2']
  }, {
    token: 'token',
    interval: 0
  });
  expect(cache.space.get('space_1')?.permissions).toStrictEqual([{
    user_id: 'user_root_1'
  }]);
  expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
    o.s.u('space_1', [], last_edited_props)
  ]);
});
