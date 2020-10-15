import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import Collection from './Collection';
import Block from './Block';
import View from './View';

import { createOperation, lastEditOperations, collectionViewSet, blockSet, blockListAfter, blockUpdate } from '../utils/chunk';

import createTransaction from "../utils/createTransaction"
import { error, warn } from "../utils/logs";

import { ICollectionBlock, LoadPageChunkResult, Operation, Page as IPage, RecordMap, Space as ISpace } from "../types";

class CollectionBlock extends Block {
  parent_id: string;
  Transaction = createTransaction.bind(this, this.shard_id, this.space_id);

  constructor({
    token,
    interval,
    user_id,
    shard_id,
    space_id,
    parent_id,
    block_data
  }: {
    parent_id: string,
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
    this.parent_id = parent_id;
  }

  async createView() {
    // ? Page.prototype.createLinkedDBContent view options
    const $view_id = uuidv4();
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.Transaction([
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
      ]),
      this.headers
    );
    const { data: { recordMap, recordMap: { collection_view } } } = await axios.post(
      'https://www.notion.so/api/v3/loadPageChunk',
      {
        chunkNumber: 0,
        cursor: { stack: [] },
        limit: 50,
        pageId: this.parent_id,
        verticalColumns: false
      },
      this.headers
    ) as { data: LoadPageChunkResult };
    this.saveToCache(recordMap);
    return new View({
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      parent_data: this.block_data,
      view_data: collection_view[$view_id].value
    });
  }

  async fetchCollection() {
    const cached_data = this.cache.collection.get((this.block_data as ICollectionBlock).collection_id);
    if (cached_data)
      return new Collection({
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        collection_data: cached_data
      });
    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/loadPageChunk',
        {
          chunkNumber: 0,
          limit: 50,
          pageId: this.parent_id,
          cursor: { stack: [] },
          verticalColumns: false
        },
        this.headers
      );
      this.saveToCache(recordMap);
      return new Collection({
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        collection_data: recordMap.collection[(this.block_data as ICollectionBlock).collection_id].value
      });
    } catch (err) {
      error(err.response.data);
    }
  }

  async getViews() {
    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/loadPageChunk',
        {
          chunkNumber: 0,
          limit: 50,
          pageId: this.parent_id,
          cursor: { stack: [] },
          verticalColumns: false
        },
        this.headers
      ) as { data: { recordMap: RecordMap } };
      this.saveToCache(recordMap);
      return (recordMap.block[this.block_data.id].value as ICollectionBlock).view_ids.map(
        (view_id) => new View({ parent_data: this.block_data, view_data: recordMap.collection_view[view_id].value })
      );
    } catch (err) {
      error(err.response.data);
    }
  }
  // ? TS: Better TS Support rather than using any
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
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        this.createTransaction([ops]),
        this.headers
      );

      return new Promise((resolve) => {
        setTimeout(async () => {
          const { data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/queryCollection',
            {
              collectionId: this.block_data.collection_id,
              collectionViewId: (this.block_data as ICollectionBlock).view_ids[0],
              query: {},
              loader: {
                limit: 1000,
                searchQuery: '',
                type: 'table'
              }
            },
            this.headers
          );
          resolve(page_ids.map((page_id) => new Page(recordMap.block[page_id].value)));
        }, this.interval);
      });
    } catch (err) {
      error(err.response.data);
    }
  }
}

export default CollectionBlock;
