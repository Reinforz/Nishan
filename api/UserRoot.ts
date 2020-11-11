import Data from "./Data";
import { IUserRoot, NishanArg } from "../types";

import GetItems from '../mixins/GetItems';

class UserRoot extends GetItems<IUserRoot>(Data) {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "notion_user" });
  }


}

export default UserRoot;