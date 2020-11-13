import Data from "./Data";
import { ISpaceView, IUserRoot, NishanArg, Predicate } from "../types";

import SpaceView from "./SpaceView";

class UserRoot extends Data<IUserRoot> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "user_root" });
  }

  /**
   * Get multiple Space views from the user root
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
  async getSpaceViews(arg: undefined | string[] | Predicate<ISpaceView>, multiple: boolean = true): Promise<SpaceView[]> {
    const props = this.getProps();
    return this.getItems<ISpaceView>(arg, multiple, async function (space_view) {
      return new SpaceView({
        id: space_view.id,
        ...props
      })
    });
  }

  /**
   * Get a single space view from the user root
   * @param arg criteria to filter pages by
   * @returns A page object matching the passed criteria
   */
  async getSpaceView(arg: string | Predicate<ISpaceView>) {
    return (await this.getSpaceViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }
}

export default UserRoot;