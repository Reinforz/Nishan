import { NotionCache } from "@nishans/cache";
import { NotionEndpoints } from "@nishans/endpoints";
import { INotionCache } from "@nishans/types";
import colors from "colors";
import { createExecuteOperationsMock } from "../../../utils/tests";
import { default_nishan_arg, o } from "../../core/tests/utils";
import { NotionPermissions } from "../libs";

it(`addMembers`, async()=>{
	const cache: INotionCache = {
			...NotionCache.createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      } ] } as any ] ]),
		},
		{e1} = createExecuteOperationsMock();

	const space = new NotionPermissions.Space({
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
  e1([
    o.s.spi('space_1', ["permissions"], { role: 'editor', type: "user_permission", user_id: 'user_root_2' }),
  ]);
  findUser.mockImplementationOnce(()=>{
    return {
    } as any;
  });
	await expect(()=>space.addMembers([['user_root_2@gmail.com', 'editor']])).rejects.toThrow(colors.red.bold(`User does not have a notion account`));
});

it(`removeUsers`, async()=>{
	const cache: INotionCache = {
			...NotionCache.createDefaultCache(),
			block: new Map([['block_1', {id: 'block_1', type: "page", properties: {title: [['Page One']]}} as any]]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: ['block_1'], permissions: [ {
        user_id: 'user_root_1'
      }, {
        user_id: 'user_root_2'
      } ] } as any ] ]),
		};

	const space = new NotionPermissions.Space({
    ...default_nishan_arg,
		cache,
		id: 'space_1',
    notion_operation_plugins: undefined,
    logger: undefined
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
  }, expect.objectContaining({
    token: 'token',
    interval: 0
  }));
  expect(cache.space.get('space_1')?.permissions).toStrictEqual([{
    user_id: 'user_root_1'
  }]);

});