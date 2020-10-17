import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { Page as IPage, LoadUserContentResult, PageFormat, PageProps, Space, RecordMap, NishanArg } from "./types";
import { error, warn } from "./utils/logs";
import { lastEditOperations, createOperation, spaceListBefore, blockUpdate, blockSet } from './utils/chunk';
import Page from "./api/Page";
import Getters from "./api/Getters";
import createTransaction from "./utils/createTransaction";

class Nishan extends Getters {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Return a new block by its id
   * @param block_id The id of the block to obtain
   */
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
      return new Block({
        block_data: recordMap.block[block_id].value,
        ...this.getProps()
      });
  }

  /**
   * Obtain a collection using its id
   * @param collection_id The id of the collection to obtain
   */
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

    const { data: { recordMap } } = await axios.post(
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

    this.saveToCache(recordMap);

    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Collection({
        ...this.getProps(),
        collection_data
      });
  }

  /**
   * Obtain a page using the passed id
   * @param page_id Id of the page to obtain 
   */
  async getPage(page_id: string) {
    const cache_data = this.cache.block.get(page_id) as IPage;
    if (cache_data) return new Page({
      block_data: cache_data,
      ...this.getProps()
    });

    try {
      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/getBacklinksForBlock',
        { blockId: page_id },
        this.headers
      );

      this.saveToCache(recordMap);
      const target = recordMap.block[page_id];
      if (!target)
        throw new Error(warn(`No page with the id ${page_id} exists`));

      return new Page(
        {
          block_data: recordMap.block[page_id].value,
          ...this.getProps()
        }
      );
    } catch (err) {
      throw new Error(error(err.response.data));
    }
  }

  // ? FEAT: getSpace method using function or id
  async getSpace() {

  }

  /**
   * Create a new page using passed properties and formats
   * @param opts format and properties of the new page
   */
  async createPage(opts = {} as { properties: PageProps, format: PageFormat }) {
    const { properties = {}, format = {} } = opts;
    const { default: Page } = await import("./api/Page");
    const $block_id = uuidv4();
    if (this.space_id && this.user_id) {
      await this.saveTransactions([
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
      ]);

      const { data: { recordMap } } = await axios.post(
        'https://www.notion.so/api/v3/getBacklinksForBlock',
        { blockId: $block_id },
        this.headers
      );
      this.saveToCache(recordMap);
      return new Page({
        ...this.getProps(),
        block_data: recordMap.block[$block_id].value
      });
    } else
      throw new Error(error("Space and User id not provided"))
  }

  /**
   * The the internal space of the instance using a predicate or string id
   * @param arg A string representing the space id or a predicate function
   */
  async setSpace(arg: (space: Space) => boolean | string) {
    try {
      const { data: { recordMap, recordMap: { space } } } = await axios.post(
        'https://www.notion.so/api/v3/loadUserContent',
        {},
        this.headers
      ) as { data: LoadUserContentResult };

      this.saveToCache(recordMap);
      const target_space: Space = (Object.values(space).find((space) => typeof arg === "string" ? space.value.id === arg : arg(space.value))?.value || Object.values(space)[0].value);
      if (!target_space) error(`No space matches the criteria`);
      else {
        this.shard_id = target_space.shard_id;
        this.space_id = target_space.id;
        this.user_id = target_space.permissions[0].user_id;
        this.createTransaction = createTransaction.bind(this, target_space.shard_id, target_space.id);
      }
    } catch (err) {
      throw new Error(error(err.response.data))
    }
  }

  /**
   * Sets the root user of the instance
   */
  async setRootUser() {
    const { data: { recordMap, recordMap: { user_root } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };
    this.saveToCache(recordMap);
    this.user_id = Object.values(user_root)[0].value.id;
  }
}

export default Nishan;
