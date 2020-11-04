import {
  error,
} from "../utils";

import { IOperation, IPermission, TPermissionRole, TRootPage } from "../types/types";
import Data from "./Data";
import { ISpace } from "../types/api";
import { IRootPage } from "../types/block";

type Constructor<T = Data<IRootPage | ISpace>> = new (...args: any[]) => T;

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
      const data = this.getCachedData() as TRootPage;

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

    async updateSharedUser(id: string, role: TPermissionRole) {
      return await this.updateSharedUsers([[id, role]]);
    }

    async updateSharedUsers(args: [string, TPermissionRole][]) {
      const ops: IOperation[] = [];
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
      await this.updateCacheManually([this.id]);
    }
  }
}