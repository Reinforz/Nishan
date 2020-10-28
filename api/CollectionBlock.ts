import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { createOperation, lastEditOperations, collectionViewSet, blockSet, blockUpdate } from '../utils/chunk';

import { error } from "../utils/logs";

import { Operation, TView, NishanArg } from "../types/types";
import { TBlockInput, TCollectionBlock } from '../types/block';

class CollectionBlock extends Block<TCollectionBlock, TBlockInput> {
  constructor(arg: NishanArg<TCollectionBlock>) {
    super(arg);
    if (!arg.data.type.match(/collection_view/))
      throw new Error(error(`Cannot create collection_block from ${arg.data.type} block`));
  }

  // ? RF:1:H Same view options as Page.createLinkedDBContent
  /**
   * Create a new view for the collection block
   */
  async createView() {
    if (this.data) {
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
            parent_id: this.data.id
          }),
          this.listAfterOp(['view_ids'], { after: '', id: $view_id }),
          this.setOp(['last_edited_time'], Date.now())
        ]
      );

      const { collection_view } = await this.loadPageChunk({
        chunkNumber: 0,
        cursor: { stack: [] },
        limit: 50,
        pageId: this.data.parent_id,
        verticalColumns: false
      });
      const data = collection_view[$view_id].value as TView;
      return new View({
        ...this.getProps(),
        data,
        type: "collection_view"
      });
    } else
      throw new Error(error('Data has been deleted'))

  }

  /**
   * Fetch the corresponding collection of the collection block using the collection_id
   */
  async fetchCollection() {
    if (this.data) {
      const ICached_data = this.cache.collection.get((this.data as TCollectionBlock).collection_id);
      if (ICached_data)
        return new Collection({
          ...this.getProps(),
          data: ICached_data,
          type: "collection"
        });
      const { collection } = await this.loadPageChunk({
        chunkNumber: 0,
        limit: 50,
        pageId: this.data.parent_id,
        cursor: { stack: [] },
        verticalColumns: false
      });
      const data = collection[(this.data as TCollectionBlock).collection_id].value;

      return new Collection({
        ...this.getProps(),
        data,
        type: "collection"
      });
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Get all the views associated with the collection block
   */
  async getViews() {
    if (this.data) {
      const { block, collection_view } = await this.loadPageChunk({
        chunkNumber: 0,
        limit: 50,
        pageId: this.data.parent_id,
        cursor: { stack: [] },
        verticalColumns: false
      })
      return (block[this.data.id].value as TCollectionBlock).view_ids.map(
        (view_id) => new View({
          ...this.getProps(),
          data: collection_view[view_id].value,
          type: "collection_view"
        })
      );
    } else
      throw new Error(error('Data has been deleted'))
  }

  // ? TD:2:H Better TS Support rather than using any
  /**
   * Add rows of data to the collection block
   * @param rows 
   */
  async addRows(rows: { format: any, properties: any }[]) {
    if (this.data) {
      const page_ids: string[] = [];
      const Page = require('../Page');
      const ops: Operation[] = [];
      rows.map(({ format, properties }) => {
        if (this.data) {
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
              parent_id: this.data.collection_id,
              parent_table: 'collection',
              alive: true
            }),
            ...createOperation($page_id, this.user_id),
            ...lastEditOperations($page_id, this.user_id),
            this.setOp(['last_edited_time'], Date.now())
          );
        }
      });
      await this.saveTransactions(ops)

      const { recordMap } = await this.queryCollection({
        collectionId: this.data.collection_id,
        collectionViewId: (this.data as TCollectionBlock).view_ids[0],
        query: {},
        loader: {
          limit: 100,
          searchQuery: '',
          type: 'table'
        }
      });

      return page_ids.map((page_id) => new Page({
        block_data: recordMap.block[page_id].value,
        ...this.getProps()
      }))
    } else
      throw new Error(error('Data has been deleted'))
  }
}

export default CollectionBlock;
