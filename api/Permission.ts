import {
  error,
} from "../utils";

import { IPermission, TPermissionRole } from "../types/types";

type Constructor<T = {}> = new (...args: any[]) => T;

export default function Permissioned<TBase extends Constructor>(Base: TBase) {
  return class Permission extends Base {
    constructor(...args: any[]) {
      super(args[0]);
    }
    /**
     * Share page to users with specific permissions
     * @param args array of userid and role of user to share pages to
     */
    async addUsers(args: [string, TPermissionRole][], multiple: boolean = true) {
      const data = (this as any).getCachedData();

      const permissionItems: IPermission[] = [];
      for (let i = 0; i < args.length; i++) {
        const [email, permission] = args[i];
        const notion_user = await (this as any).findUser(email);
        if (!notion_user) throw new Error(error(`User does not have a notion account`));
        else
          permissionItems.push({
            role: permission,
            type: "user_permission",
            user_id: notion_user.id
          });
        if (!multiple && permissionItems.length === 1) break;
      }
      await (this as any).inviteGuestsToSpace({
        blockId: data.id,
        permissionItems,
        spaceId: data.space_id
      })
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
}