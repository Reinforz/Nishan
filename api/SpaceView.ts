import Data from './Data';

import { ISpace, ISpaceView, UpdatableSpaceViewParam, NishanArg } from '../types';
import Space from './Space';

/**
 * A class to represent spaceview of Notion
 * @noInheritDoc
 */
class SpaceView extends Data<ISpaceView> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "space_view" });
  }

  /**
   * Update the current space view
   * @param arg Options to update the spaceView
   */
  async update(arg: UpdatableSpaceViewParam) {
    const [op, update] = this.updateCacheLocally(arg, ['notify_email',
      'notify_desktop',
      'notify_mobile'])
    await this.saveTransactions([
      op
    ]);
    update();
  }

  /**
   * Get the corresponding space associated with this space view
   * @returns The corresponding space object
   */
  async getSpace() {
    const data = this.getCachedData();
    let target_space: ISpace | null = null;
    for (let [, space] of this.cache.space) {
      if (data && space.id === data.space_id) {
        target_space = space;
        break;
      }
    }
    if (target_space)
      return new Space({
        id: target_space.id,
        ...this.getProps()
      });
  }
}

export default SpaceView;
