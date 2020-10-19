import Getters from "./Getters";

import { INotionUser, NishanArg } from "../types";

class NotionUser extends Getters {
  notion_user: INotionUser;

  constructor(arg: NishanArg & { notion_user: INotionUser }) {
    super(arg);
    this.notion_user = arg.notion_user;
  }
}

export default NotionUser;