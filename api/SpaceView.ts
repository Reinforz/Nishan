import Data from './Data';

import { ISpace, ISpaceView, NishanArg, RepositionParams, IOperation, TPage, ISpaceViewUpdateInput, TSpaceViewUpdateKeys, UpdateTypes } from '../types';
import Space from './Space';
import { Operation } from '../utils';

/**
 * A class to represent spaceview of Notion
 * @noInheritDoc
 */
class SpaceView extends Data<ISpaceView> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "space_view" });
  }

  async reposition(arg: RepositionParams, execute?: boolean) {
    this.logger && this.logger("UPDATE", "SpaceView", this.id);
    await this.executeUtil([this.addToChildArray(this.id, arg)], [this.user_id, "user_root"], execute)
  }

  /**
   * Update the current space view
   * @param arg Options to update the spaceView
   */
  async update(arg: ISpaceViewUpdateInput, execute?: boolean) {
    const [op, update] = this.updateCacheLocally(arg, TSpaceViewUpdateKeys)
    this.logger && this.logger("UPDATE", "SpaceView", this.id);
    await this.executeUtil([
      op
    ], [], execute);
    update();
  }

  /**
   * Get the corresponding space associated with this space view
   * @returns The corresponding space object
   */
  async getSpace(return_object: boolean = true) {
    const data = this.getCachedData();
    let target_space: ISpace = null as any;
    for (let [, space] of this.cache.space) {
      if (data && space.id === data.space_id) {
        target_space = space;
        break;
      }
    }
    if (return_object) {
      this.logger && this.logger("READ", "Space", target_space.id);
      return new Space({
        id: target_space.id,
        ...this.getProps()
      });
    }
    else return target_space
  }

  /**
  * Toggle a single page from the bookmark list
  * @param arg id string or a predicate filter function
  */
  async updateBookmarkedPage(arg: UpdateTypes<TPage, boolean>, execute?: boolean) {
    await this.updateBookmarkedPages(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  /**
   * Toggle multiple pages from the bookmark list
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async updateBookmarkedPages(args: UpdateTypes<TPage, boolean>, execute?: boolean, multiple?: boolean) {
    const target_space_view = this.getCachedData(), ops: IOperation[] = [];
    await this.updateIterate<TPage, boolean>(args, {
      child_ids: this.cache.space.get(target_space_view.space_id)?.pages ?? [],
      subject_type: "Page",
      multiple,
    }, (id) => this.cache.block.get(id) as TPage, (id, tpage, new_favourite_status) => {
      ops.push((!new_favourite_status ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
        id
      }))
    });
    this.executeUtil(ops, [[target_space_view.id, "space_view"]], execute)
  }
}

export default SpaceView;
