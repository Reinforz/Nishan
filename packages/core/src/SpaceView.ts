import Data from './Data';

import Space from './Space';
import { createPageMap, Operation } from '../utils';
import Page from './Page';
import CollectionViewPage from './CollectionViewPage';
import { ISpaceView, ISpace, TPage, IUserRoot } from '@nishans/types';
import { NishanArg, RepositionParams, ISpaceViewUpdateInput, TSpaceViewUpdateKeys, FilterType, FilterTypes, UpdateTypes, ITPage } from '../types';

/**
 * A class to represent spaceview of Notion
 * @noInheritDoc
 */
class SpaceView extends Data<ISpaceView> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "space_view" });
  }
  
  getCachedParentData(){
    return this.cache.user_root.get(this.user_id) as IUserRoot
  }

  reposition(arg: RepositionParams) {
    this.addToChildArray(this.getCachedParentData(), arg)
  }

  /**
   * Update the current space view
   * @param arg Options to update the spaceView
   */
  update(arg: ISpaceViewUpdateInput) {
    this.updateCacheLocally(arg, TSpaceViewUpdateKeys)
  }

  /**
   * Get the corresponding space associated with this space view
   * @returns The corresponding space object
   */
  async getSpace() {
    const data = this.getCachedData();
    let target_space: ISpace = null as any;
    for (const [, space] of this.cache.space) {
      if (data && space.id === data.space_id) {
        target_space = space;
        break;
      }
    }
    this.logger && this.logger("READ", "block", target_space.id);
    return new Space({
      id: target_space.id,
      ...this.getProps()
    });
  }

  async getBookmarkedPage(arg: FilterType<TPage>) {
    return await this.getBookmarkedPages(typeof arg === "string" ? [arg] : arg, false)
  }

  async getBookmarkedPages(args: FilterTypes<TPage>, multiple?: boolean) {
    return await this.getIterate<TPage, ITPage>(args, {
      child_ids: this.getCachedData().bookmarked_pages ?? [],
      child_type: "block",
      multiple,
      container: createPageMap()
    }, (id) => this.cache.block.get(id) as TPage, (id, page, tpage_map) => {
      if (page.type === "page") {
        const page_obj = new Page({ ...this.getProps(), id })
        tpage_map.page.set(id, page_obj)
        tpage_map.page.set(page.properties.title[0][0], page_obj)
      }
      else {
        const cvp_obj = new CollectionViewPage({ ...this.getProps(), id });
        tpage_map.collection_view_page.set(id, cvp_obj)
        const collection = this.cache.collection.get(page.collection_id);
        if(collection)
          tpage_map.collection_view_page.set(collection.name[0][0], cvp_obj)
      }
    })
  }

  /**
  * Toggle a single page from the bookmark list
  * @param arg id string or a predicate filter function
  */
  async updateBookmarkedPage(arg: UpdateTypes<TPage, boolean>) {
    await this.updateBookmarkedPages(typeof arg === "string" ? [arg] : arg,  false);
  }

  /**
   * Toggle multiple pages from the bookmark list
   * @param arg string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async updateBookmarkedPages(args: UpdateTypes<TPage, boolean>, multiple?: boolean) {
    const data = this.getCachedData();
    await this.updateIterate<TPage, boolean>(args, {
      child_ids: this.cache.space.get(data.space_id)?.pages ?? [],
      child_type: "block",
      multiple,
      manual: true,
      container: []
    }, (id) => this.cache.block.get(id) as TPage, (id, tpage, updated_favourite_status) => {
      if(!updated_favourite_status) data.bookmarked_pages = data?.bookmarked_pages?.filter(page_id=>page_id !== id);
      else data?.bookmarked_pages?.push(id)
      this.stack.push((!updated_favourite_status ? Operation.space_view.listRemove : Operation.space_view.listBefore)(data.id, ["bookmarked_pages"], {
        id
      }))
    });
  }
}

export default SpaceView;
