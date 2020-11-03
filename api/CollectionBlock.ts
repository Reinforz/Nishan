import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { collectionViewSet } from '../utils/chunk';

import { TBlockInput, TCollectionBlock } from '../types/block';
import { NishanArg, Predicate, TView } from '../types/types';

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Block<TCollectionBlock, TBlockInput> {
  constructor(arg: NishanArg & { type: "collection_view" | "collection_view_page" }) {
    super({ ...arg });
  }

  // TODO RF:1:H Same view options as Page.createLinkedDBContent
  /**
   * Create a new view for the collection block
   * @returns The newly created view object
   */
  async createView() {
    const data = this.getCachedData();
    const $view_id = uuidv4();
    await this.saveTransactions(
      [
        collectionViewSet($view_id, [], {
          id: $view_id,
          version: 1,
          name: 'Table View',
          type: 'table',
          format: { [`table_properties`]: [] },
          parent_table: 'block',
          alive: true,
          parent_id: data.id
        }),
        this.listAfterOp(['view_ids'], { after: '', id: $view_id }),
        this.setOp(['last_edited_time'], Date.now())
      ]
    );

    return new View({
      ...this.getProps(),
      id: $view_id,
    });
  }

  /**
   * Fetch the corresponding collection of the collection block using the collection_id
   * @returns The corresponding collection object
   */
  async fetchCollection() {
    const data = this.getCachedData();
    const ICached_data = this.cache.collection.get((data as TCollectionBlock).collection_id);
    if (ICached_data)
      return new Collection({
        ...this.getProps(),
        id: (data as TCollectionBlock).collection_id,
      });

    return new Collection({
      ...this.getProps(),
      id: (data as TCollectionBlock).collection_id,
    });
  }

  /**
   * Get a single view present in the collection block
   * @param arg string representating id or a predicate function passed each element and index
   */
  async getView(arg: string | Predicate<TView>) {
    return (await this.getViews(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  // ? FEAT:2:M Add a predicate function for filtering
  /**
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  async getViews(arg: undefined | string[] | Predicate<TView>, multiple: boolean = true) {
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
