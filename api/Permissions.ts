import { INotionUser, TPermissionRole, ICollectionViewPage, IPage, NishanArg, IPermission, IOperation, IPublicPermissionOptions, TPublicPermissionRole, IPublicPermission, TSpacePermissionRole, IPageCreateInput, ICollectionViewPageInput } from "../types"
import { error, Operation } from "../utils";
import Block from "./Block";

export default class Permissions<T extends (ICollectionViewPage | IPage)> extends Block<T, ICollectionViewPageInput | IPageCreateInput>{
  constructor(arg: NishanArg) {
    super(arg);
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
   * Share page to users with specific permissions
   * @param args array of userid and role of user to share pages to
   */
  async addSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData(), notion_users: INotionUser[] = [];
    const permissionItems: IPermission[] = [];
    for (let i = 0; i < args.length; i++) {
      const [email, permission] = args[i];
      const { value: { value: notion_user } } = await this.findUser(email);
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
  async updateSharedUsers(args: [string, TPermissionRole][], execute?: boolean) {
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
    ops.push(this.updateOp([], this.getLastEditedProps()));
    await this.executeUtil(ops, [data.id, [data.space_id, "space"]], execute);
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

  async addPublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions>, execute?: boolean) {
    await this.executeUtil([Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "public_permission",
      role,
      ...(options ?? {})
    })], this.id, execute)
  }

  async updatePublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions>, execute?: boolean) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as IPublicPermission;
    await this.executeUtil([Operation.block.setPermissionItem(this.id, ["permissions"], {
      ...(permission ?? {}),
      type: "public_permission",
      role,
      ...(options ?? {})
    })], this.id, execute)
  }

  async removePublicPermission(execute?: boolean) {
    await this.executeUtil([Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "public_permission",
      role: "none"
    })], this.id, execute)
  }

  async updateSpacePermission(role: TSpacePermissionRole, execute?: boolean) {
    await this.executeUtil([Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "space_permission",
      role,
    })], this.id, execute)
  }

  async removeSpacePermission(execute?: boolean) {
    await this.executeUtil([Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "space_permission",
      role: "none",
    })], this.id, execute)
  }
}