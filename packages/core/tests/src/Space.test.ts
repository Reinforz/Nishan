import { ICache } from '@nishans/cache';
import { Mutations, Queries } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import colors from "colors";
import { v4 } from 'uuid';
import { NotionData, Space, TSpaceUpdateKeys } from '../../src';
import { createSpaceIterateArguments } from '../../src/Space';
import { createDefaultCache } from '../createDefaultCache';

afterAll(()=>{
  jest.restoreAllMocks();
})

describe('createSpaceIterateArguments', () => {
  it(`type=page`, async()=>{
    const cache = {
      block: new Map([
        ['block_1', {type: "page", id: "block_1"}],
        ['block_2', {type: "header", id: "block_1"}]
      ])
    } as any;
    const data = await createSpaceIterateArguments('block_1', cache, 'token');
    expect(data).toStrictEqual({id: "block_1", type: "page"});
  })

  it(`type=collection_view_page,collection in cache`, async()=>{
    const cache = {
      collection: new Map([['collection_1', {id: 'collection_1'}]]),
      block: new Map([['block_1', {type: "collection_view_page", id: "block_1", collection_id: 'collection_1'}]])
    } as any;
    const data = await createSpaceIterateArguments('block_1', cache, 'token');
    expect(data).toStrictEqual({collection: {id: 'collection_1'}, type: "collection_view_page", id: "block_1", collection_id: 'collection_1'})
    await createSpaceIterateArguments('block_2', cache, 'token');
  })

  it(`data=undefined,type=header`, async ()=>{
    const cache = {
      block: new Map([
        ['block_1', {type: "page", id: "block_1"}],
        ['block_2', {type: "header", id: "block_1"}]
      ])
    } as any;
    await createSpaceIterateArguments('block_3', cache, 'token');
    await createSpaceIterateArguments('block_2', cache, 'token');
  })
})

it(`getSpaceView`, async () => {
	const cache: ICache = {
			...createDefaultCache(),
			space_view: new Map([
				[ 'space_view_2', { alive: true, space_id: 'space_2', id: 'space_view_2' } as any ],
				[ 'space_view_1', { alive: true, space_id: 'space_1', id: 'space_view_1' } as any ]
			]),
		},
		stack: IOperation[] = [];
	const logger_spy = jest.fn();
	const space = new Space({
		cache,
		id: 'space_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1',
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

it(`update`, () => {
	const cache = createDefaultCache(),
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1'
	});

	const updateCacheLocallyMock = jest.spyOn(NotionData.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
		return {} as any;
	});

	space.update({
		beta_enabled: false
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			beta_enabled: false
		},
		TSpaceUpdateKeys
	);
});

it(`delete`, async () => {
	const cache = createDefaultCache(),
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const enqueueTaskMock = jest.spyOn(Mutations, 'enqueueTask').mockImplementationOnce(() => {
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
			...createDefaultCache(),
			space: new Map([ [ 'space_1', { id: 'space_1' } as any ] ]),
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
	});

	const block_map = await space.createRootPages([
		{
			type: 'page',
			id: block_id,
			properties: {
				title: [ [ 'Page One' ] ]
			}
		}
	]);

	expect(block_map.page.get('Page One')).not.toBeUndefined();
	expect(cache.block.get(block_id)).not.toBeUndefined();
	expect(stack.length).toBe(2);
});

it(`getRootPage`, async () => {
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([
				[ 'block_1', { type: 'page', id: 'block_1', properties: { title: [ [ 'Block One' ] ] } } as any ],
			]),
			notion_user: new Map([ [ 'user_root_1', { id: 'user_root_1' } as any ] ]),
			space: new Map([
				[
					'space_1',
					{
						id: 'space_1',
						pages: [ 'block_1' ],
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
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: logger_spy
	});

	const page_map_1 = await space.getRootPage('block_1');
	expect(page_map_1.page.get('Block One')?.getCachedData()).toStrictEqual({
		type: 'page',
		id: 'block_1',
		properties: { title: [ [ 'Block One' ] ] }
	});
});

it(`updateRootPage`, async()=>{
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [] } as any ] ]),
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
	});

	const block_map = await space.updateRootPage(['block_1',
		{
			properties: {
				title: [ [ 'Page Two' ] ]
			},
      type: "page"
		}
	]);

	expect(block_map.page.get('Page One')).not.toBeUndefined();
	expect(cache.block.get('block_1')).not.toBeUndefined();
})

it(`deleteRootPage`, async()=>{
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [] } as any ] ]),
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
	});

	await space.deleteRootPage('block_1');

	expect(cache.block.get('block_1')?.alive).toBe(false);
});

it(`addMembers`, async()=>{
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      } ] } as any ] ]),
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
	});

  const findUser = jest.spyOn(Queries, 'findUser').mockImplementationOnce(()=>{
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
  expect(findUser).toHaveBeenNthCalledWith(1, {email: 'user_root_2@gmail.com'}, {
    interval: 0,
    token: 'token',
    user_id: 'user_root_1'
  });
  expect(cache.space.get('space_1')?.permissions).toStrictEqual([{
    user_id: 'user_root_1'
  }, { role: 'editor', type: "user_permission", user_id: 'user_root_2' }]);
  expect(notion_users).toStrictEqual([
    {
      id: 'user_root_2'
    }
  ]);

  jest.spyOn(Queries, 'findUser').mockImplementationOnce(()=>{
    return {
      value: {}
    } as any;
  });

  const console_log_spy = jest.spyOn(console, 'log');

	await space.addMembers([['user_root_2@gmail.com', 'editor']]);

  expect(console_log_spy).toHaveBeenCalledTimes(1);
  expect(console_log_spy).toHaveBeenCalledWith(colors.red.bold(`User does not have a notion account`));

  jest.spyOn(Queries, 'findUser').mockImplementationOnce(()=>{
    return {
    } as any;
  });

	await space.addMembers([['user_root_2@gmail.com', 'editor']]);

});

it(`removeUsers`, async()=>{
	const cache: ICache = {
			...createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      }, {
        user_id: 'user_root_2'
      } ] } as any ] ]),
		},
		stack: IOperation[] = [];

	const space = new Space({
		cache,
		id: 'space_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
	});

  const removeUsersFromSpaceMock = jest.spyOn(Mutations, 'removeUsersFromSpace').mockImplementationOnce(()=>{
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
  }])
});
