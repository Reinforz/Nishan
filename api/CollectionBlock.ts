import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { createOperation, lastEditOperations, collectionViewSet, blockSet, blockUpdate } from '../utils/chunk';

import { Operation, NishanArg } from "../types/types";
import { IPage, TBlockInput, TCollectionBlock } from '../types/block';
import Page from './Page';

/**
 * A class to represent collectionblock type in Notion
 * @noInheritDoc
 */
class CollectionBlock extends Block<TCollectionBlock, TBlockInput> {
  constructor(arg: NishanArg) {
    super(arg);
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

    /* const { collection_view } = await this.loadPageChunk({
      chunkNumber: 0,
      cursor: { stack: [] },
      limit: 50,
      pageId: data.parent_id,
      verticalColumns: false
    }); */

    return new View({
      ...this.getProps(),
      id: $view_id,
      type: "collection_view"
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
        type: "collection"
      });
    /* const { collection } = await this.loadPageChunk({
      chunkNumber: 0,
      limit: 50,
      pageId: data.parent_id,
      cursor: { stack: [] },
      verticalColumns: false
    }); */

    return new Collection({
      ...this.getProps(),
      id: (data as TCollectionBlock).collection_id,
      type: "collection"
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
        type: "collection_view"
      })
    );

  }

  // ? TD:2:H Better TS Support rather than using any
  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async addRows(rows: { format: any, properties: any }[]): Promise<Page<IPage>[]> {
    // const data = this.getCachedData();
    const page_ids: string[] = [];
    const ops: Operation[] = [];
    rows.map(({ format, properties }) => {
      const data = this.getCachedData();
      const $page_id = uuidv4();
      page_ids.push($page_id);
      ops.push(
        blockSet($page_id, [], {
          type: 'page',
          id: $page_id,
          version: 1,
          properties,
          format,
        }),
        // ? RF:1:E Use a sinle block update operation
        blockUpdate($page_id, [], {
          parent_id: data.collection_id,
          parent_table: 'collection',
          alive: true
        }),
        ...createOperation($page_id, this.user_id),
        ...lastEditOperations($page_id, this.user_id),
        this.setOp(['last_edited_time'], Date.now())
      );
    });
    await this.saveTransactions(ops)

    /* const { recordMap } = await this.queryCollection({
      collectionId: data.collection_id,
      collectionViewId: (data as TCollectionBlock).view_ids[0],
      query: {},
      loader: {
        limit: 100,
        searchQuery: '',
        type: 'table'
      }
    }); */

    return page_ids.map((page_id) => new Page({
      type: "block",
      id: page_id,
      ...this.getProps()
    }));
  }
}

export default CollectionBlock;
