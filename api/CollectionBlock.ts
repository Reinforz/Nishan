import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { BlockRepostionArg, UserViewArg, NishanArg, IOperation, Predicate, TView, TCollectionBlock } from '../types';
import { createViews } from '../utils';
import GetItems from '../mixins/GetItems';

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends GetItems<TCollectionBlock>(Block) {
  constructor(arg: NishanArg & { type: "block" }) {
    super({ ...arg });
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
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
  async getCollection() {
    await this.initializeCache();
    const data = this.getCachedData();
    const ICached_data = this.cache.collection.get(data.collection_id);
    if (ICached_data)
      return new Collection({
        ...this.getProps(),
        id: data.collection_id,
      });

    return new Collection({
      ...this.getProps(),
      id: data.collection_id,
    });
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
  async getViews(arg: undefined | string[] | Predicate<TView>, multiple: boolean = true) {
    await this.initializeCache();
    const data = this.getCachedData(), views: View[] = [];
    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const view_id = arg[index];
        let should_add = data.view_ids.includes(view_id);
        if (should_add) views.push(new View({ ...this.getProps(), id: view_id }));
        if (!multiple && views.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < data.view_ids.length; index++) {
        const view_id = data.view_ids[index], view = this.getCachedData<TView>(view_id);
        let should_add = typeof arg === "function" ? await arg(view, index) : true;
        if (should_add) views.push(new View({ id: view_id, ...this.getProps() }))
        if (!multiple && views.length === 1) break;
      }
    }
    return views;
  }
}

export default CollectionBlock;
