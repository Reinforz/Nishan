import Data from './Data';

import { ISpace, ISpaceView, UpdatableSpaceViewParam, NishanArg, BlockRepostionArg, IOperation, IRootPage, Predicate, TRootPage } from '../types';
import Space from './Space';
import { Operation } from '../utils';
import GetItems from '../mixins/GetItems';

/**
 * A class to represent spaceview of Notion
 * @noInheritDoc
 */
class SpaceView extends GetItems<ISpaceView>(Data) {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "space_view" });
  }

  async reposition(arg: number | BlockRepostionArg) {
    const op = this.addToChildArray(this.id, arg);
    await this.saveTransactions([op]);
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
  async getSpace(return_object: boolean = true) {
    const data = this.getCachedData();
    let target_space: ISpace | null = null;
    for (let [, space] of this.cache.space) {
      if (data && space.id === data.space_id) {
        target_space = space;
        break;
      }
    }
    if (return_object)
      return new Space({
        id: (target_space as any).id,
        ...this.getProps()
      });
    else return target_space
  }

  /**
   * Toggle multiple pages from the bookmark list
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async toggleFavourites(arg: string[] | Predicate<TRootPage>, multiple: boolean = true) {
    const target_space_view = this.getCachedData(), target_space = await this.getSpace(false) as ISpace, ops: IOperation[] = [];
    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const page_id = arg[index];
        if (target_space.pages.includes(page_id)) {
          const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
          ops.push((is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
            id: page_id
          }))
        }
        if (!multiple && ops.length === 1) break;
      }
    } else if (typeof arg === "function") {
      for (let index = 0; index < target_space.pages.length; index++) {
        const page_id = target_space.pages[index];
        const page = this.getCachedData<IRootPage>(page_id);
        if (page.parent_id === target_space.id && await arg(page, index)) {
          const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
          ops.push((is_bookmarked ? this.listRemoveOp : this.listBeforeOp)(["bookmarked_pages"], {
            id: page_id
          }))
        }
        if (!multiple && ops.length === 1) break;
      }
    }

    if (ops.length !== 0) {
      await this.saveTransactions(ops);
      await this.updateCacheManually([[target_space_view.id, "space_view"]]);
    }
  }

  /**
   * Toggle a single page from the bookmark list
   * @param arg id string or a predicate filter function
   */
  async toggleFavourite(arg: string | Predicate<TRootPage>) {
    await this.toggleFavourites(typeof arg === "string" ? [arg] : arg, false);
  }
}

export default SpaceView;
