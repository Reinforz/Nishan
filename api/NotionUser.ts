import Getters from "./Getters";

import { NishanArg } from "../types/types";
import { notionUserUpdate } from "../utils/chunk";
import { INotionUser } from "../types/api";

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
    ]);

    const cached_data = this.cache.notion_user.get(this.notion_user.id);
    if (cached_data) {
      cached_data.family_name = family_name;
      cached_data.given_name = given_name;
      cached_data.profile_photo = profile_photo;
    }
    this.notion_user.family_name = family_name;
    this.notion_user.given_name = given_name;
    this.notion_user.profile_photo = profile_photo;
  }
}

export default NotionUser;