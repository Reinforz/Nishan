import Permission from "./Permission";
import Page from "./Page";

import { NishanArg } from "../types/types";
import { IPage } from "../types/block";

/**
 * A class to represent RootPage type block of Notion
 * @noInheritDoc
 */


class RootPage extends Permission(Page as any)<IPage> {
  constructor(arg: NishanArg) {
    super(arg);
  }
}

export default RootPage;