import Data from './Data';

import { ISpace, ISpaceView, UpdatableSpaceViewParam, NishanArg, RepositionParams, IOperation, IRootPage, TRootPage, FilterType, FilterTypes } from '../types';
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

  async reposition(arg: RepositionParams) {
    const op = this.addToChildArray(this.id, arg);
    await this.saveTransactions([op]);
    this.logger && this.logger("UPDATE", "SpaceView", this.id);
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
    this.logger && this.logger("UPDATE", "SpaceView", this.id);
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
        id: (target_space as any).id,
        ...this.getProps()
      });
    }
    else return target_space
  }

  /**
  * Toggle a single page from the bookmark list
  * @param arg id string or a predicate filter function
  */
  async toggleFavourite(arg?: FilterType<TRootPage>) {
    await this.toggleFavourites(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Toggle multiple pages from the bookmark list
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async toggleFavourites(args?: FilterTypes<TRootPage>, multiple?: boolean) {
    multiple = multiple ?? true;
    const target_space_view = this.getCachedData(), target_space = await this.getSpace(false) as ISpace, ops: IOperation[] = [];
    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const page_id = args[index];
        if (target_space.pages.includes(page_id)) {
          const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
          ops.push((is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
            id: page_id
          }))
          this.logger && this.logger("UPDATE", "RootPage", page_id);
        }
        if (!multiple && ops.length === 1) break;
      }
    } else if (typeof args === "function") {
      for (let index = 0; index < target_space.pages.length; index++) {
        const page_id = target_space.pages[index];
        const page = this.getCachedData<IRootPage>(page_id);
        if (page.parent_id === target_space.id && await args(page, index)) {
          const is_bookmarked = target_space_view?.bookmarked_pages?.includes(page_id);
          ops.push((is_bookmarked ? this.listRemoveOp : this.listBeforeOp)(["bookmarked_pages"], {
            id: page_id
          }));
          this.logger && this.logger("UPDATE", "RootPage", page_id);
        }
        if (!multiple && ops.length === 1) break;
      }
    }

    if (ops.length !== 0) {
      await this.saveTransactions(ops);
      await this.updateCacheManually([[target_space_view.id, "space_view"]]);
    }
  }
}

export default SpaceView;
