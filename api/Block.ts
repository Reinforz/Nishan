import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, spaceSet, spaceListRemove } from '../utils/chunk';

import Getters from "./Getters";

import { BlockType, NishanArg, TBlock } from "../types"
import { RSA_NO_PADDING } from 'constants';

class Block<T extends TBlock> extends Getters {
  block_data: T;

  constructor(arg: NishanArg & { block_data: T }) {
    super(arg);
    this.block_data = arg.block_data;
  }

  async duplicate() {
    const $gen_block_id = uuidv4();
    await this.saveTransactions([
      [
        this.createBlock({ $block_id: $gen_block_id, type: 'copy_indicator', parent_id: this.block_data.parent_id }),
        blockListAfter(this.block_data.parent_id, ['content'], {
          after: this.block_data.id,
          id: $gen_block_id
        }),
      ]
    ]);

    // ? FEAT:1:M Return New Block
    await this.enqueueTask({
      eventName: 'duplicateBlock',
      request: {
        sourceBlockId: this.block_data.id,
        targetBlockId: $gen_block_id,
        addCopyName: true
      }
    });

    const { block } = await this.syncRecordValues([
      {
        id: $gen_block_id,
        table: 'block',
        version: -1
      }
    ]);
    return new Block({
      block_data: block[$gen_block_id].value,
      ...this.getProps()
    })
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
  createBlock({ $block_id, type, properties = {}, format = {}, parent_id }: { $block_id: string, type: BlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string }) {
    const current_time = Date.now();

    return blockUpdate($block_id, [], {
      id: $block_id,
      properties,
      format,
      type,
      parent_id: parent_id || this.block_data.id,
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
