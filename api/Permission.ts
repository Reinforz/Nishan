import {
  error,
} from "../utils/logs";
import Block from "./Block";

import { NishanArg, IPermission, TPermissionRole } from "../types/types";
import { ICollectionBlock, IPageInput, IRootPage } from "../types/block";

export default class Permission extends Block<ICollectionBlock | IRootPage, IPageInput>{
  /**
   * Share page to users with specific permissions
   * @param args array of userid and role of user to share pages to
   */
  async addUsers(args: [string, TPermissionRole][], multiple: boolean = true) {
    if (this.data) {
      const permissionItems: IPermission[] = [];
      for (let i = 0; i < args.length; i++) {
        const [email, permission] = args[i];
        const notion_user = await this.findUser(email);
        if (!notion_user) throw new Error(error(`User does not have a notion account`));
        else
          permissionItems.push({
            role: permission,
            type: "user_permission",
            user_id: notion_user.id
          });
        if (!multiple && permissionItems.length === 1) break;
      }
      await this.inviteGuestsToSpace({
        blockId: this.data.id,
        permissionItems,
        spaceId: this.space_id
      })
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Share the current page with the user
   * @param email email of the user to add
   * @param role Role of the added user
   */
  async addUser(email: string, role: TPermissionRole) {
    await this.addUsers([[email, role]], false)
  }
}