import Data from "./Data";
import { FilterType, FilterTypes, ISpaceView, ISpaceViewUpdateInput, IUserRoot, NishanArg, UpdateType, UpdateTypes } from "../../types";

import SpaceView from "./SpaceView";

class UserRoot extends Data<IUserRoot> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "user_root" });
  }

  /**
   * Get a single space view from the user root
   * @param arg criteria to filter pages by
   * @returns A page object matching the passed criteria
   */
  async getSpaceView(arg?: FilterType<ISpaceView>) {
    return (await this.getSpaceViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get multiple Space views from the user root
   * @param arg criteria to filter pages by
   * @returns An array of pages object matching the passed criteria
   */
  async getSpaceViews(args?: FilterTypes<ISpaceView>, multiple?: boolean) {
    return (await this.getIterate<ISpaceView>(args, { multiple, subject_type: "SpaceView", child_ids: "space_views" }, (space_id) => this.cache.space_view.get(space_id))).map(({ id }) => new SpaceView({ ...this.getProps(), id }));
  }

  async updateSpaceView(arg: UpdateType<ISpaceView, ISpaceViewUpdateInput>, execute?: boolean) {
    return await this.updateSpaceViews(typeof arg === "function" ? arg : [arg], execute, false)
  }

  async updateSpaceViews(args: UpdateTypes<ISpaceView, ISpaceViewUpdateInput>, execute?: boolean, multiple?: boolean) {
    return (await this.updateIterate<ISpaceView, ISpaceViewUpdateInput>(args, {
      child_ids: this.getCachedData().space_views,
      subject_type: "SpaceView",
      child_type: "space_view",
      updateParent: false,
      execute,
      multiple
    }, (id) => this.cache.space_view.get(id))).map((id) => new SpaceView({ ...this.getProps(), id }))
  }
}

export default UserRoot;