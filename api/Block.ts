import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, lastEditOperations, createOperation } from '../utils/chunk';

import Transaction from "./Transaction";

import { error, warn } from "../utils/logs";

import { Block as IBlock } from "../types"

import Nishan from "./Nishan";

class Block extends Nishan {
  block_data: IBlock;

  constructor({ token, interval, user_id, shard_id, space_id, block_data }: {
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string,
    block_data: IBlock
  }) {
    super({ token, interval, user_id, shard_id, space_id })
    this.block_data = block_data;
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
      Transaction.createTransaction([
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

  async update(args) {
    // ? Handle when args does not have appropriate shape eg: when format is not given, use the current value
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      Transaction.createTransaction([
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

  async delete() {
    let success = true;
    const current_time = Date.now();
    try {
      await axios.post(
        'https://www.notion.so/api/v3/saveTransactions',
        Transaction.createTransaction([
          [
            blockUpdate(this.block_data.id, [], {
              alive: false
            }),
            blockListRemove(this.block_data.id, ['content'], { id: this.block_data.id }),
            blockSet(this.block_data.id, ['last_edited_time'], current_time),
            blockSet(this.block_data.id, ['last_edited_time'], current_time)
          ]
        ]),
        this.headers
      );
      this.cache.block.delete(this.block_data.id);
      success = true;
    } catch (err) {
      error(err.response.data);
      success = false;
    }

    return new Promise((resolve) => setTimeout(() => resolve(success), this.interval));
  }

  async transfer(new_parent_id: string) {
    const current_time = Date.now();
    await axios.post(
      'https://www.notion.so/api/v3/saveTransactions',
      Transaction.createTransaction([
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
