/* import axios from "axios";
import {
  v4 as uuidv4
} from 'uuid'; */
import Page from "./Page";

import {
  error,
} from "../utils/logs";
import { NishanArg, Permission, TPermissionRole } from "../types/types";
import { IRootPage } from "../types/block";

class RootPage extends Page<IRootPage>{
  constructor(arg: NishanArg<IRootPage>) {
    super(arg);
  }

  /**
   * Share page to users
   * @param args array of userid and role of user to share pages to
   */
  async addUsers(args: [string, TPermissionRole][]) {
    if (this.data) {
      const permissionItems: Permission[] = [];
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
      }
      await this.inviteGuestsToSpace({
        blockId: this.data.id,
        permissionItems,
        spaceId: this.space_id
      })
    } else
      throw new Error(error('Data has been deleted'))
  }
}

export default RootPage;