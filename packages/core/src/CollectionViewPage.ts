import { ISpace, IPage, INotionUser, IPermission, IPublicPermission, IPublicPermissionOptions, ISpacePermission, TPermissionRole, TPublicPermissionRole, TSpacePermissionRole, ICollectionViewPage } from '@nishans/types';
import { error, Operation } from '../utils';
import { NishanArg } from '../types';
import CollectionBlock from './CollectionBlock';
import { findUser, inviteGuestsToSpace } from '@nishans/endpoints';

/**
 * A class to represent collectionviewpage of Notion
 * @noInheritDoc
 */
class CollectionViewPage extends CollectionBlock<ICollectionViewPage> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'block' });
	}

	getCachedParentData () {
		const data = this.getCachedData();
		if (data.parent_table === 'space') return this.cache.space.get(data.parent_id) as ISpace;
		else return this.cache.block.get(data.parent_id) as IPage;
  }
  
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
      const { value } = await findUser({email}, this.getConfigs());
      if (!value?.value) error(`User does not have a notion account`);
      else{
        const { value: notion_user } = value;
        permissionItems.push({
          role: permission,
          type: "user_permission",
          user_id: notion_user.id
        });
        notion_users.push(notion_user)
      }
    }
    await inviteGuestsToSpace({
      blockId: data.id,
      permissionItems,
      spaceId: data.space_id
    }, this.getConfigs());
    await this.updateCacheManually([this.id, [data.space_id, "space"]]);
    return notion_users;
  }

  /**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
  async updateSharedUser(id: string, role: TPermissionRole) {
    return this.updateSharedUsers([[id, role]]);
  }

  /**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
  updateSharedUsers(args: [string, TPermissionRole][] ) {
    const data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const permission_data: IPermission = { role: arg[1], type: "user_permission", user_id: arg[0] }
      this.stack.push({
        args: permission_data,
        command: "setPermissionItem",
        id: this.id,
        path: ["permissions"],
        table: "block"
      })
      data.permissions.push(permission_data)
    }
    this.updateLastEditedProps();
    this.stack.push(Operation[this.type].update(this.id, [], this.getLastEditedProps()));
  }

  /**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
  removeSharedUser(id: string) {
    return this.removeSharedUsers([id]);
  }

  /**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
  removeSharedUsers(ids: string[]) {
    return this.updateSharedUsers(ids.map(id => [id, "none"]));
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
    
    this.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], permission_data))
  }

  removePublicPermission() {
    this.updatePublicPermission("none");
  }

  updateSpacePermission(role: TSpacePermissionRole) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as ISpacePermission;
    permission.role = role;
    this.updateLastEditedProps();
    this.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "space_permission",
      role,
    }))
  }

  removeSpacePermission() {
    this.updateSpacePermission("none")
  }
}

export default CollectionViewPage;
