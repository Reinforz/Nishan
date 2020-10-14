import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import Transaction from "./Transaction"
import Collection from './Collection';
import Block from './Block';
import View from './View';

import { createOperation, lastEditOperations, collectionViewSet, blockSet, blockListAfter, blockUpdate } from '../utils/chunk';

import { error, warn } from "../utils/logs";

import { ICollectionBlock, LoadPageChunkResult, Page as IPage, Space as ISpace } from "../types";

class CollectionBlock extends Block {
  parent_data: IPage | ISpace;
  constructor({ token,
    interval,
    user_id,
    shard_id,
    space_id,
    parent_data,
    block_data
  }: {
    parent_data: IPage | ISpace,
    block_data: ICollectionBlock,
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string
  }) {
    super({
      token,
      interval,
      user_id,
      shard_id,
      space_id,
      block_data,
    });
    if (!block_data.type.match(/collection_view/))
      throw new Error(error(`Cannot create collection_block from ${block_data.type} block`));
    this.parent_data = parent_data;
  }

  async createView(options = {}) {
    // ? Page.prototype.createLinkedDBContent view options
    const { type = 'table', name = 'Table View' } = options;
    const $view_id = uuidv4();
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      Transaction.createTransaction([
        [
          collectionViewSet($view_id, [], {
            id: $view_id,
            version: 1,
            name,
            type,
            format: { [`${type}_properties`]: [] },
            parent_table: 'block',
            alive: true,
            parent_id: this.block_data.id
          }),
          blockListAfter(this.block_data.id, ['view_ids'], { after: '', id: $view_id }),
          blockSet(this.block_data.id, ['last_edited_time'], Date.now())
        ]
      ]),
      this.headers
    );
    const { data: { recordMap, recordMap: { collection_view } } } = await axios.post(
      'https://www.notion.so/api/v3/loadPageChunk',
      {
        chunkNumber: 0,
        cursor: { stack: [] },
        limit: 50,
        pageId: this.parent_data.id,
        verticalColumns: false
      },
      this.headers
    ) as { data: LoadPageChunkResult };
    this.saveToCache(recordMap);
    return new View({
      parent_data: this.block_data,
      view_data: collection_view[$view_id].value
    });
  }

  async getCollection(fromCache = true) {
    if (fromCache)
      return new Collection({
        parent_data: this.block_data,
        collection_data: CollectionBlock.cache.collection.get(this.block_data.collection_id)
      });
    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/loadPageChunk',
        {
          chunkNumber: 0,
          limit: 50,
          pageId: this.parent_data.parent_id,
          cursor: { stack: [] },
          verticalColumns: false
        },
        CollectionBlock.headers
      );
      CollectionBlock.saveToCache(recordMap);
      return new Collection({
        parent_data: this.parent_data,
        collection_data: recordMap.collection[this.parent_data.collection_id].value
      });
    } catch (err) {
      error(err.response.data);
    }
  }

  async getViews() {
    /* if (fromCache) {
      return CollectionBlock.cache.block.get(this.block_data.id).view_ids.map(
        (view_id) =>
          new View({
            parent_data: this.block_data,
            view_data: CollectionBlock.cache.collection_view.get(view_id)
          })
      );
    } */
    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/loadPageChunk',
        {
          chunkNumber: 0,
          limit: 50,
          pageId: this.parent_data.id,
          cursor: { stack: [] },
          verticalColumns: false
        },
        CollectionBlock.headers
      );
      CollectionBlock.saveToCache(recordMap);
      return recordMap.block[this.block_data.id].value.view_ids.map(
        (view_id) => new View({ parent_data: this.block_data, view_data: recordMap.collection_view[view_id].value })
      );
    } catch (err) {
      error(err.response.data);
    }
  }

  async addRows(rows) {
    const page_ids = [];
    const Page = require('../Page');
    const ops = [];
    rows.map((row) => {
      const $page_id = uuidv4();
      page_ids.push($page_id);
      ops.push(
        blockSet($page_id, [], {
          type: 'page',
          id: $page_id,
          version: 1,
          properties: row.properties,
          format: row.format
        }),
        blockUpdate($page_id, [], {
          parent_id: this.block_data.collection_id,
          parent_table: 'collection',
          alive: true
        }),
        ...createOperation($page_id, CollectionBlock.user_id),
        ...lastEditOperations($page_id, CollectionBlock.user_id),
        blockSet(this.block_data.id, ['last_edited_time'], Date.now())
      );
    });
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        Transaction.createTransaction([ops]),
        CollectionBlock.headers
      );

      return new Promise((resolve) => {
        setTimeout(async () => {
          const { data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/queryCollection',
            {
              collectionId: this.block_data.collection_id,
              collectionViewId: this.block_data.view_ids[0],
              query: {},
              loader: {
                limit: 1000,
                searchQuery: '',
                type: 'table'
              }
            },
            CollectionBlock.headers
          );
          resolve(page_ids.map((page_id) => new Page(recordMap.block[page_id].value)));
        }, CollectionBlock.interval);
      });
    } catch (err) {
      error(err.response.data);
    }
  }
}

module.exports = CollectionBlock;
