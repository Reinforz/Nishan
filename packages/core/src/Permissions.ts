import { Queries } from "@nishans/endpoints";
import { Operation } from "@nishans/operations";
import { IPermission, IPublicPermission, IPublicPermissionOptions, ISpacePermission, TDataType, TPage, TPermissionRole, TPublicPermissionRole, TSpacePermissionRole } from "@nishans/types";
import { NishanArg } from "../types";
import { error } from "../utils";
import Data from "./Data";

interface UserIdentifier{
  id?: string, 
  email?: string
}
export default class NotionPermissions extends Data<TPage>{
  constructor(arg: NishanArg, id: string, type: TDataType){
    super({...arg, id, type });
  }

  async addUserPermission(id: UserIdentifier, role: TPermissionRole) {
    await this.addUserPermissions([[id, role]])
  }

  /**
   * Share page to users with specific permissions
   * @param args array of userid and role of user to share pages to
   */
  async addUserPermissions(args: [UserIdentifier, TPermissionRole][]) {
    await this.updateUserPermissions(args)
  }

  /**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
  async updateUserPermission(id: UserIdentifier, role: TPermissionRole) {
    return this.updateUserPermissions([[id, role]]);
  }

  /**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
  async updateUserPermissions(args: [UserIdentifier, TPermissionRole][] ) {
    const data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const [{email, id}, role] = args[index];
      let user_id = id as string;
      if(email){
        const { value } = await Queries.findUser({email}, this.getConfigs());
        if (!value?.value) error(`User does not have a notion account`);
        else
          user_id = value.value.id;
      }
      const permission_data: IPermission = { role, type: "user_permission", user_id }
      this.Operations.stack.push({
        args: permission_data,
        command: "setPermissionItem",
        id: this.id,
        path: ["permissions"],
        table: "block"
      })
      data.permissions.push(permission_data)
    }
    this.updateLastEditedProps();
    this.Operations.stack.push(Operation[this.type].update(this.id, [], this.getLastEditedProps()));
  }

  /**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
  removeUserPermission(id: UserIdentifier) {
    return this.removeUserPermissions([id]);
  }

  /**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
  removeUserPermissions(ids: UserIdentifier[]) {
    return this.updateUserPermissions(ids.map(id => [id, "none"]));
  }

  addPublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions> ) {
    this.updatePublicPermission(role, options)
  }

  updatePublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions>) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as IPublicPermission, permission_data: IPublicPermission = {
      ...(permission ?? {}),
      type: "public_permission",
      role,
      ...(options ?? {})
    };
    this.updateLastEditedProps();
    permission.role = role;
    permission.allow_duplicate = options?.allow_duplicate ?? permission.allow_duplicate;
    permission.allow_search_engine_indexing = options?.allow_search_engine_indexing ?? permission.allow_search_engine_indexing;
    
    this.Operations.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], permission_data))
  }

  removePublicPermission() {
    this.updatePublicPermission("none");
  }

  updateSpacePermission(role: TSpacePermissionRole) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as ISpacePermission;
    permission.role = role;
    this.updateLastEditedProps();
    this.Operations.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "space_permission",
      role,
    }))
  }

  removeSpacePermission() {
    this.updateSpacePermission("none")
  }
}