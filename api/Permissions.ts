import { INotionUser, TPermissionRole, ICollectionViewPage, IPage, NishanArg, IPermission, IOperation } from "../types"
import { error } from "../utils";
import Block from "./Block";

export default class Permissions<T extends (ICollectionViewPage | IPage)> extends Block<T, any>{
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Share page to users with specific permissions
   * @param args array of userid and role of user to share pages to
   */
  async addSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData(), notion_users: INotionUser[] = [];
    const permissionItems: IPermission[] = [];
    for (let i = 0; i < args.length; i++) {
      const [email, permission] = args[i];
      const notion_user = await this.findUser(email);
      if (!notion_user) error(`User does not have a notion account`);
      else
        permissionItems.push({
          role: permission,
          type: "user_permission",
          user_id: notion_user.id
        });
      notion_users.push(notion_user)
    }
    await this.inviteGuestsToSpace({
      blockId: data.id,
      permissionItems,
      spaceId: data.space_id
    });
    await this.updateCacheManually([this.id, [data.space_id, "space"]]);
    return notion_users;
  }

  /**
   * Share the current page with the user
   * @param email email of the user to add
   * @param role Role of the added user
   */
  async addSharedUser(email: string, role: TPermissionRole) {
    return (await this.addSharedUsers([[email, role]]))?.[0]
  }

  /**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
  async updateSharedUser(id: string, role: TPermissionRole) {
    return await this.updateSharedUsers([[id, role]]);
  }

  /**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
  async updateSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData(), ops: IOperation[] = [];
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      ops.push({
        args: { role: arg[1], type: "user_permission", user_id: arg[0] },
        command: "setPermissionItem",
        id: this.id,
        path: ["permissions"],
        table: "block"
      })
    }
    ops.push(this.updateOp(["last_edited_time"], Date.now()));
    await this.saveTransactions(ops);
    await this.updateCacheManually([data.id, [data.space_id, "space"]]);
  }

  /**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
  async removeSharedUser(id: string) {
    return await this.removeSharedUsers([id]);
  }

  /**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
  async removeSharedUsers(ids: string[]) {
    return await this.updateSharedUsers(ids.map(id => [id, "none"]));
  }
}