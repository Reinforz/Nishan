import Permission from "./Permission";

import { NishanArg } from "../types/types";

/**
 * A class to represent RootPage type block of Notion
 * @noInheritDoc
 */

class RootPage extends Permission.page {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default RootPage;