import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { createOperation, lastEditOperations, collectionViewSet, blockSet, blockListAfter, blockUpdate } from '../utils/chunk';

import { error } from "../utils/logs";

import { Operation, TView, NishanArg } from "../types/types";
import { TBlockInput, TCollectionBlock } from '../types/block';

class CollectionBlock extends Block<TCollectionBlock, TBlockInput> {
  constructor(arg: NishanArg & {
    block_data: TCollectionBlock,
  }) {
    super(arg);
    if (!arg.block_data.type.match(/collection_view/))
      throw new Error(error(`Cannot create collection_block from ${arg.block_data.type} block`));
  }

  async createView() {
    // ? RF:1:H Same view options as Page.createLinkedDBContent
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
          parent_id: this.block_data.id
        }),
        blockListAfter(this.block_data.id, ['view_ids'], { after: '', id: $view_id }),
        blockSet(this.block_data.id, ['last_edited_time'], Date.now())
      ]
    );

    const { collection_view } = await this.loadPageChunk({
      chunkNumber: 0,
      cursor: { stack: [] },
      limit: 50,
      pageId: this.block_data.parent_id,
      verticalColumns: false
    });
    const data = collection_view[$view_id].value as TView;
    return new View({
      ...this.getProps(),
      view_data: data,
      data
    });
  }

  /**
   * Fetch the collection of the block from the collection_id
   */
  async fetchCollection() {
    const ICached_data = this.cache.collection.get((this.block_data as TCollectionBlock).collection_id);
    if (ICached_data)
      return new Collection({
        ...this.getProps(),
        collection_data: ICached_data,
        data: ICached_data
      });
    const { collection } = await this.loadPageChunk({
      chunkNumber: 0,
      limit: 50,
      pageId: this.block_data.parent_id,
      cursor: { stack: [] },
      verticalColumns: false
    });
    const data = collection[(this.block_data as TCollectionBlock).collection_id].value;

    return new Collection({
      ...this.getProps(),
      collection_data: data,
      data
    });
  }

  async getViews() {
    const { block, collection_view } = await this.loadPageChunk({
      chunkNumber: 0,
      limit: 50,
      pageId: this.block_data.parent_id,
      cursor: { stack: [] },
      verticalColumns: false
    })
    return (block[this.block_data.id].value as TCollectionBlock).view_ids.map(
      (view_id) => new View({
        ...this.getProps(),
        view_data: collection_view[view_id].value,
        data: collection_view[view_id].value
      })
    );
  }

  // ? TD:2:H Better TS Support rather than using any
  async addRows(rows: { format: any, properties: any }[]) {
    const page_ids: string[] = [];
    const Page = require('../Page');
    const ops: Operation[] = [];
    rows.map(({ format, properties }) => {
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
        blockUpdate($page_id, [], {
          parent_id: this.block_data.collection_id,
          parent_table: 'collection',
          alive: true
        }),
        ...createOperation($page_id, this.user_id),
        ...lastEditOperations($page_id, this.user_id),
        blockSet(this.block_data.id, ['last_edited_time'], Date.now())
      );
    });
    await this.saveTransactions(ops)

    const { recordMap } = await this.queryCollection({
      collectionId: this.block_data.collection_id,
      collectionViewId: (this.block_data as TCollectionBlock).view_ids[0],
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
  }
}

export default CollectionBlock;
