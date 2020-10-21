import Getters from "./Getters";

import { NishanArg } from '../types/types';
import { spaceViewUpdate } from "../utils/chunk";
import { ISpaceView } from "../types/api";

class SpaceView extends Getters {
  space_view_data: ISpaceView
  constructor(arg: NishanArg & { space_view_data: ISpaceView }) {
    super(arg)
    this.space_view_data = arg.space_view_data;
  }

  async update(arg: Partial<Pick<ISpaceView, "notify_desktop" |
    "notify_email" |
    "notify_mobile">>) {
    const { notify_email = this.space_view_data.notify_email, notify_desktop = this.space_view_data.notify_desktop, notify_mobile = this.space_view_data.notify_mobile } = arg;

    await this.saveTransactions([
      spaceViewUpdate(this.space_view_data.id, [], {
        notify_email,
        notify_desktop,
        notify_mobile
      })
    ]);

    const cached_data = this.cache.space_view.get(this.space_view_data.id);
    if (cached_data) {
      cached_data.notify_email = notify_email;
      cached_data.notify_desktop = notify_desktop;
      cached_data.notify_mobile = notify_mobile;
    }
    this.space_view_data.notify_email = notify_email;
    this.space_view_data.notify_desktop = notify_desktop;
    this.space_view_data.notify_mobile = notify_mobile;
  }
}

export default SpaceView;