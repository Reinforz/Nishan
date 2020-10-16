import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, lastEditOperations, createOperation, spaceSet, spaceListRemove } from '../utils/chunk';

import { error } from "../utils/logs";

import Cache from "./Cache";

import { Block as IBlock, NishanArg } from "../types"

import createTransaction from "../utils/createTransaction";

class Block extends Cache {
  block_data: IBlock;
  token: string;
  interval: number;
  user_id: string;
  shard_id: number;
  space_id: string;
  headers: {
    headers: {
      cookie: string
    }
  };
  createTransaction: any;

  constructor(arg: NishanArg & { block_data: IBlock }) {
    super();
    this.headers = {
      headers: {
        cookie: `token_v2=${arg.token}`
      }
    };
    this.token = arg.token;
    this.interval = arg.interval;
    this.user_id = arg.user_id;
    this.shard_id = arg.shard_id;
    this.space_id = arg.space_id;
    this.block_data = arg.block_data;
    this.createTransaction = createTransaction.bind(this, arg.shard_id, arg.space_id);
  }

  getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache
    }
  }

  async loadUserChunk(limit = 10) {
    const res = await axios.post(
      'https://www.notion.so/api/v3/loadPageChunk',
      {
        pageId: this.block_data.id,
        limit,
        chunkNumber: 0
      },
      this.headers
    );
    this.saveToCache(res.data.recordMap);
    return res.data;
  }

  async duplicate() {
    const generated_table_id = uuidv4();

    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.createTransaction([
        [
          blockSet(generated_table_id, [], {
            type: 'copy_indicator',
            id: generated_table_id,
            version: 1
          }),
          blockUpdate(generated_table_id, [], {
            parent_id: this.block_data.parent_id,
            parent_table: 'block',
            alive: true
          }),
          blockListAfter(this.block_data.parent_id, ['content'], {
            after: this.block_data.id,
            id: generated_table_id
          }),
          ...lastEditOperations(generated_table_id, this.user_id),
          ...createOperation(generated_table_id, this.user_id)
        ]
      ]),
      this.headers
    );

    await axios.post(
      'https://www.notion.so/api/v3/enqueueTask',
      {
        task: {
          eventName: 'duplicateBlock',
          request: {
            sourceBlockId: this.block_data.id,
            targetBlockId: generated_table_id,
            addCopyName: true
          }
        }
      },
      this.headers
    );
    // ? Return New Block
  }

  // ? TD: Better TD for args
  // ? FEAT: Add Permission to args
  async update(args: any) {
    // ? Handle when args does not have appropriate shape eg: when format is not given, use the current value
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.createTransaction([
        [
          ...Object.entries(args.format).map(([path, arg]) => blockSet(this.block_data.id, ['format', path], arg)),
          ...Object.entries(args.properties).map(([path, arg]) =>
            blockSet(this.block_data.id, ['properties', path], [[arg]])
          ),
          blockSet(this.block_data.id, ['last_edited_time'], Date.now())
        ]
      ]),
      this.headers
    );
  }

  /**
   * Delete the current block, whether its a page or regular block
   */
  async delete() {
    const current_time = Date.now();
    const is_root_page = this.block_data.parent_table === "space" && this.block_data.type === "page";
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        this.createTransaction([
          [
            blockUpdate(this.block_data.id, [], {
              alive: false
            }),
            is_root_page ? spaceListRemove(this.block_data.space_id, ['pages'], { id: this.block_data.id }) : blockListRemove(this.block_data.parent_id, ['content'], { id: this.block_data.id }),
            blockSet(this.block_data.id, ['last_edited_time'], current_time),
            is_root_page ? spaceSet(this.block_data.space_id, ['last_edited_time'], current_time) : blockSet(this.block_data.parent_id, ['last_edited_time'], current_time)
          ]
        ]),
        this.headers
      );
      this.cache.block.delete(this.block_data.id);
    } catch (err) {
      throw new Error(error(err.response.data));
    }
    return new Promise((resolve) => setTimeout(() => resolve(undefined), this.interval));
  }

  async transfer(new_parent_id: string) {
    const current_time = Date.now();
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      this.createTransaction([
        [
          blockUpdate(this.block_data.id, [], { alive: false }),
          blockListRemove(this.block_data.parent_id, ['content'], { id: this.block_data.id }),
          blockUpdate(this.block_data.id, [], { parent_id: new_parent_id, parent_table: 'block', alive: true }),
          blockListAfter(new_parent_id, ['content'], { id: this.block_data.id }),
          blockUpdate(this.block_data.id, [], { permissions: null }),
          blockSet(this.block_data.id, ['last_edited_time'], current_time),
          blockSet(this.block_data.parent_id, ['last_edited_time'], current_time),
          blockSet(new_parent_id, ['last_edited_time'], current_time)
        ]
      ]),
      this.headers
    );
  }
}

export default Block;
