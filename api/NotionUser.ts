import Getters from "./Getters";

import { INotionUser, NishanArg } from "../types";
import { notionUserUpdate } from "../utils/chunk";

class NotionUser extends Getters {
  notion_user: INotionUser;

  constructor(arg: NishanArg & { notion_user: INotionUser }) {
    super(arg);
    this.notion_user = arg.notion_user;
  }

  async update(opt: Partial<Pick<INotionUser, "family_name" | "given_name" | "profile_photo">>) {
    const { family_name = this.notion_user.family_name, given_name = this.notion_user.given_name, profile_photo = this.notion_user.profile_photo } = opt;
    await this.saveTransactions([
      notionUserUpdate(this.notion_user.id, [], {
        family_name,
        given_name,
        profile_photo
      })
    ])
  }
}

export default NotionUser;