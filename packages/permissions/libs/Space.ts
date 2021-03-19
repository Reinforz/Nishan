import { NotionEndpoints } from '@nishans/endpoints';
import { NotionErrors } from "@nishans/errors";
import { NotionLogger } from "@nishans/logger";
import {
  INotionOperationOptions,
  NotionOperationPluginFunction,
  NotionOperations
} from '@nishans/operations';
import {
  INotionUser,
  IOperation, ISpace, IUserPermission, TSpaceMemberPermissionRole
} from '@nishans/types';

type NotionPermissionsCtorArg = INotionOperationOptions & { id: string; cache: { space: Map<string, ISpace> } };

export class NotionBlockPermissions {
	id: string;
	token: string;
	user_id: string;
	interval?: number;
	space_id: string;
	shard_id: number;
	notion_operation_plugins: NotionOperationPluginFunction[];
	cache: { space: Map<string, ISpace> };
  logger: boolean

	constructor (arg: NotionPermissionsCtorArg) {
		this.id = arg.id;
		this.token = arg.token;
		this.user_id = arg.user_id;
		this.interval = arg.interval;
		this.notion_operation_plugins = arg.notion_operation_plugins ?? [];
		this.shard_id = arg.shard_id;
		this.space_id = arg.space_id;
		this.cache = arg.cache;
    this.logger = arg.logger ?? true;
	}

  getProps () {
		return {
			token: this.token,
			interval: this.interval,
			user_id: this.user_id,
			shard_id: this.shard_id,
			space_id: this.space_id,
			cache: this.cache,
			notion_operation_plugins: this.notion_operation_plugins
		} as NotionPermissionsCtorArg;
	}
  
	async addMembers(infos: [string, TSpaceMemberPermissionRole][]) {
    const notion_users: INotionUser[] = [], data = this.cache.space.get(this.id), operations: IOperation[] = []
    for (let i = 0; i < infos.length; i++) {
      const [email, role] = infos[i], { value } = await NotionEndpoints.Queries.findUser({email}, this.getProps());
      if (!value?.value) NotionErrors.Log.error(`User does not have a notion account`);
      else{
        const notion_user = value.value;
        const permission_data = { role, type: "user_permission", user_id: notion_user.id } as IUserPermission;
        operations.push(NotionOperations.Chunk.space.setPermissionItem(this.id, ["permissions"], permission_data));
        data.permissions.push(permission_data)
        notion_users.push(notion_user)
        this.logger && NotionLogger.method.info(`UPDATE space ${this.id}`)
      }
    };
    await NotionOperations.executeOperations(
      operations,
      this.getProps()
    )
    return notion_users;
  }

  // ? FEAT:1:M Empty user ids for all user, a predicate
  /**
   * Remove multiple users from the current space
   * @param userIds ids of the user to remove from the workspace
   */
  async removeUsers(userIds: string[]) {
    const data = this.cache.space.get(this.id)!;
    await NotionEndpoints.Mutations.removeUsersFromSpace({
      removePagePermissions: true,
      revokeUserTokens: false,
      spaceId: data.id,
      userIds
    }, this.getProps());
    data.permissions = data.permissions.filter(permission => !userIds.includes(permission.user_id));
  }
}
