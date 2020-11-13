import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { BlockRepostionArg, UserViewArg, NishanArg, IOperation, Predicate, TView, TCollectionBlock } from '../types';
import { createViews } from '../utils';

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Block<TCollectionBlock, any> {
  constructor(arg: NishanArg & { type: "block" }) {
    super({ ...arg });
  }

  /**
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
  async getCollection(return_cached: boolean = false) {
    await this.initializeCache();
    const data = this.getCachedData();
    const ICached_data = this.cache.collection.get(data.collection_id);
    return return_cached ? ICached_data : new Collection({
      ...this.getProps(),
      id: data.collection_id,
    });
  }

  // TODO RF:1:H Same view options as Page.createLinkedDBContent
  /**
   * Create a new view for the collection block
   * @returns The newly created view object
   */
  async createView(view: UserViewArg, position?: number | BlockRepostionArg) {
    return (await this.createViews([{ view, position }]))[0]
  }

  async createViews(params: { view: UserViewArg, position?: number | BlockRepostionArg }[], multiple: boolean = true) {
    const ops: IOperation[] = [], view_ids: string[] = [];

    for (let index = 0; index < params.length; index++) {
      const param = params[index];
      const view = { ...param.view, id: uuidv4() };
      view_ids.push(view.id);
      const block_list_op = this.addToChildArray(view.id, param.position);
      ops.push(block_list_op, ...createViews([view], this.id));
      if (!multiple && ops.length === 1) break;
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually(view_ids.map(view_id => [view_id, "collection_view"]));
    return view_ids.map(view_id => new View({ id: view_id, ...this.getProps() }))
  }

  /**
   * Get a single view present in the collection block
   * @param arg string representating id or a predicate function passed each element and index
   */
  async getView(arg: string | Predicate<TView>) {
    return (await this.getViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  async getViews(arg: undefined | string[] | Predicate<TView>, multiple: boolean = true): Promise<View[]> {
    const props = this.getProps();
    return this.getItems<TView>(arg, multiple, async function (view) {
      return new View({
        id: view.id,
        ...props
      })
    })
  }

  /**
   * Delete multiple root_pages or root_collection_view_pages
   * @param arg Criteria to filter the pages to be deleted
   * @param multiple whether or not multiple root pages should be deleted
   */
  async deleteViews(arg: string[] | Predicate<TView>, multiple: boolean = true) {
    await this.deleteItems<TView>(arg as any, multiple)
  }

  /**
   * Delete a single root page from the space
   * @param arg Criteria to filter the page to be deleted
   */
  async deleteView(arg: string | Predicate<TView>) {
    return await this.deleteViews(typeof arg === "string" ? [arg] : arg, false);
  }

  // ? FEAT:1:H Create updateView(s) methods, take help from view.updateView method
}

export default CollectionBlock;
