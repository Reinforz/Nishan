import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { Page as IPage, LoadUserContentResult, PageFormat, PageProps, Space, Cache, RecordMap } from "./types";
import { error, warn } from "./utils/logs";
import { lastEditOperations, createOperation, spaceListBefore, blockUpdate, blockSet } from './utils/chunk';
import createTransaction from "./utils/createTransaction";

class Nishan {
  token: string;
  interval: number;
  user_id: string;
  space_id: string;
  shard_id: number;
  headers: {
    headers: {
      cookie: string
    }
  };
  cache: Cache;
  createTransaction: any;

  constructor({ token, interval, user_id, cache, shard_id, space_id }: {
    token: string,
    user_id: string,
    shard_id: number;
    space_id: string;
    cache?: Cache,
    interval?: number,
  }) {
    this.token = token;
    this.interval = interval || 1000;
    this.user_id = user_id;
    this.headers = {
      headers: {
        cookie: `token_v2=${token}`
      }
    };
    this.shard_id = shard_id;
    this.space_id = space_id;
    this.cache = cache || {
      block: new Map(),
      collection: new Map(),
      space: new Map(),
      collection_view: new Map(),
      notion_user: new Map(),
      space_view: new Map(),
      user_root: new Map(),
      user_settings: new Map(),
    }
    this.createTransaction = createTransaction.bind(this, shard_id, space_id);
  }

  async getBlock(block_id: string) {
    const { default: Block } = await import("./api/Block");
    const cache_data = this.cache.block.get(block_id);
    if (cache_data) return cache_data;
    const { data: { recordMap } } = await axios.post(
      'https://www.notion.so/api/v3/getBacklinksForBlock',
      { blockId: block_id },
      this.headers
    );
    this.saveToCache(recordMap);
    const target = recordMap.block[block_id];
    if (!target) {
      warn(`No block with the id ${block_id} exists`);
      return undefined;
    }
    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      new Block({
        block_data: recordMap.block[block_id].value,
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        cache: this.cache
      });
  }

  async getCollection(collection_id: string) {
    const { default: Collection } = await import("./api/Collection");
    const { data: { recordMap: { collection } } } = await axios.post(
      'https://www.notion.so/api/v3/syncRecordValues',
      {
        requests: [
          {
            id: collection_id,
            table: 'collection',
            version: -1
          }
        ]
      },
      this.headers
    );

    const collection_data = collection[collection_id].value;

    const { data: { recordMap: { block } } } = await axios.post(
      'https://www.notion.so/api/v3/syncRecordValues',
      {
        requests: [
          {
            id: collection_data.parent_id,
            table: 'block',
            version: -1
          }
        ]
      },
      this.headers
    );

    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Collection({
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        collection_data
      });
  }

  async createPage(opts = {} as { properties: PageProps, format: PageFormat }) {
    const { properties = {}, format = {} } = opts;
    const { default: Page } = await import("./api/Page");
    const $block_id = uuidv4();
    if (this.space_id && this.user_id)
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        this.createTransaction([
          [
            blockSet($block_id, [], { type: 'page', id: $block_id, version: 1 }),
            blockUpdate($block_id, [], { permissions: [{ type: 'space_permission', role: 'editor' }] }),
            blockUpdate($block_id, [], {
              parent_id: this.space_id,
              parent_table: 'space',
              alive: true,
              properties,
              format
            }),
            spaceListBefore(this.space_id, ['pages'], { id: $block_id }),
            ...lastEditOperations($block_id, this.user_id),
            ...createOperation($block_id, this.user_id)
          ]
        ]),
        this.headers
      );

    const { data: { recordMap } } = await axios.post(
      'https://www.notion.so/api/v3/getBacklinksForBlock',
      { blockId: $block_id },
      this.headers
    );
    this.saveToCache(recordMap);
    return new Page(recordMap.block[$block_id].value);
  }

  async getPage(arg: string) {
    const Page = require("./api/Page").default;
    const page_id = arg;
    const cache_data = this.cache.block.get(page_id) as IPage;
    if (cache_data) return new Page({
      block_data: cache_data,
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache
    });

    const { data: { recordMap } } = await axios.post(
      'https://www.notion.so/api/v3/getBacklinksForBlock',
      { blockId: page_id },
      this.headers
    );
    this.saveToCache(recordMap);
    const target = recordMap.block[page_id];
    if (!target) {
      warn(`No page with the id ${page_id} exists`);
      return undefined;
    }
    return new Page(
      {
        block_data: recordMap.block[page_id].value,
        token: this.token,
        interval: this.interval,
        user_id: this.user_id,
        shard_id: this.shard_id,
        space_id: this.space_id,
        cache: this.cache
      }
    );
  }

  async setSpace(arg: (space: Space) => boolean | string) {
    const { data: { recordMap, recordMap: { space } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };

    this.saveToCache(recordMap);
    const target_space: Space = (Object.values(space).find((space) => typeof arg === "string" ? space.value.id === arg : arg(space.value))?.value || Object.values(space)[0].value);
    if (!this.user_id) error("User id is not provided");
    if (!target_space) error(`No space matches the criteria`);
    else {
      this.shard_id = target_space.shard_id;
      this.space_id = target_space.id;
      this.user_id = target_space.permissions[0].user_id;
      this.createTransaction = createTransaction.bind(this, target_space.shard_id, target_space.id);
    }
  }

  async setRootUser() {
    const { data: { recordMap, recordMap: { user_root } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };
    this.saveToCache(recordMap);
    this.user_id = Object.values(user_root)[0].value.id;
  }

  saveToCache(recordMap: RecordMap) {
    type keys = keyof Cache;
    (Object.keys(this.cache) as keys[]).forEach((key) => {
      if (recordMap[key])
        Object.entries(recordMap[key]).forEach(([record_id, record_value]) => {
          this.cache[key].set(record_id, record_value.value);
        });
    });
  }
}

export default Nishan;
