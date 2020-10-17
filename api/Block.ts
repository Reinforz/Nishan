import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, lastEditOperations, createOperation, spaceSet, spaceListRemove } from '../utils/chunk';

import { error } from "../utils/logs";

import Getters from "./Getters";

import { Block as IBlock, BlockData, BlockType, GetBackLinksForBlockResult, NishanArg, RecordMap } from "../types"

class Block extends Getters {
  block_data: IBlock;

  constructor(arg: NishanArg & { block_data: IBlock }) {
    super(arg);
    this.block_data = arg.block_data;
  }

  async getBackLinksForBlock(): Promise<{ block: BlockData }> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/getBacklinksForBlock',
            {
              blockId: this.block_data.id
            },
            this.headers
          ) as { data: GetBackLinksForBlockResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  async duplicate() {
    const generated_table_id = uuidv4();

    await this.saveTransactions([
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
    ]);

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

  // ? TD:2:M Better TD for args
  // ? FEAT:2:M Add Permission to args
  async update(args: any) {
    // ? FIX:2:H Handle when args does not have appropriate shape eg: when format is not given, use the current value
    await this.saveTransactions([
      [
        ...Object.entries(args.format).map(([path, arg]) => blockSet(this.block_data.id, ['format', path], arg)),
        ...Object.entries(args.properties).map(([path, arg]) =>
          blockSet(this.block_data.id, ['properties', path], [[arg]])
        ),
        blockSet(this.block_data.id, ['last_edited_time'], Date.now())
      ]
    ])
  }

  /**
   * Delete the current block, whether its a page or regular block
   */
  async delete() {
    const current_time = Date.now();
    const is_root_page = this.block_data.parent_table === "space" && this.block_data.type === "page";
    await this.saveTransactions([
      [
        blockUpdate(this.block_data.id, [], {
          alive: false
        }),
        is_root_page ? spaceListRemove(this.block_data.space_id, ['pages'], { id: this.block_data.id }) : blockListRemove(this.block_data.parent_id, ['content'], { id: this.block_data.id }),
        blockSet(this.block_data.id, ['last_edited_time'], current_time),
        is_root_page ? spaceSet(this.block_data.space_id, ['last_edited_time'], current_time) : blockSet(this.block_data.parent_id, ['last_edited_time'], current_time)
      ]
    ]);
    this.cache.block.delete(this.block_data.id);
    return new Promise((resolve) => setTimeout(() => resolve(undefined), this.interval));
  }

  async transfer(new_parent_id: string) {
    const current_time = Date.now();
    await this.saveTransactions([
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
    ])
  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  createBlock({ $block_id, type, properties, format }: { $block_id: string, type: BlockType, properties: any, format: any }) {
    const current_time = Date.now();

    return blockUpdate($block_id, [], {
      id: $block_id,
      properties,
      format,
      type,
      parent_id: this.block_data.id,
      parent_table: 'block',
      alive: true,
      created_time: current_time,
      created_by_id: this.user_id,
      created_by_table: 'notion_user',
      last_edited_time: current_time,
      last_edited_by_id: this.user_id,
      last_edited_by_table: 'notion_user',
    })
  }
}

export default Block;
