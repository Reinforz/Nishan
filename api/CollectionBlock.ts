import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { collectionViewSet } from '../utils/chunk';

import { TBlockInput, TCollectionBlock } from '../types/block';
import { NishanArg } from '../types/types';

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Block<TCollectionBlock, TBlockInput> {
  constructor(arg: NishanArg & { type: "collection_view" | "collection_view_page" }) {
    super({ ...arg });
  }

  // ? RF:1:H Same view options as Page.createLinkedDBContent
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
   * Get all the views associated with the collection block
   * @returns An array of view objects of the collectionblock
   */
  async getViews() {
    const data = this.getCachedData();
    const { block } = await this.loadPageChunk({
      chunkNumber: 0,
      limit: 50,
      pageId: data.parent_id,
      cursor: { stack: [] },
      verticalColumns: false
    })
    return (block[data.id].value as TCollectionBlock).view_ids.map(
      (view_id) => new View({
        ...this.getProps(),
        id: view_id,
      })
    );
  }
}

export default CollectionBlock;
