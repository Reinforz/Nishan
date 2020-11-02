import { v4 as uuidv4 } from 'uuid';

import { blockListRemove, blockSet, blockListAfter, spaceSet, spaceListRemove } from '../utils/chunk';

import Data from "./Data";

import { TBasicBlockType, NishanArg } from "../types/types"
import { BlockRepostionArg, CreateBlockArg } from "../types/function";
import { TBlock, TBlockInput } from '../types/block';

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Reposition a block to a new position
   * @param arg number of new index or `BlockRepostionArg`
   */
  async reposition(arg: number | BlockRepostionArg) {
    const data = this.getCachedData(this.id);
    const [block_content_op, update] = this.addToChildArray(this.id, arg, [data.parent_id, data.parent_table as ("page" | "space")]);
    await this.saveTransactions([block_content_op]);
    update();
    await this.updateCacheManually([data.parent_id]);
  }

  // ? FEAT:1:M Take a position arg
  /**
   * Duplicate the current block
   * @returns The duplicated block object
   */
  async duplicate() {
    const data = this.getCachedData();
    const $gen_block_id = uuidv4();
    await this.saveTransactions(
      [
        this.createBlock({ $block_id: $gen_block_id, type: 'copy_indicator', parent_id: data.parent_id }),
        blockListAfter(data.parent_id, ['content'], {
          after: data.id,
          id: $gen_block_id
        }),
      ]
    );

    await this.enqueueTask({
      eventName: 'duplicateBlock',
      request: {
        sourceBlockId: data.id,
        targetBlockId: $gen_block_id,
        addCopyName: true
      }
    });

    return new Block({
      type: "block",
      id: $gen_block_id,
      ...this.getProps()
    })
  }

  // ? FIX:1:M Update cache
  /**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
  async update(args: Partial<A>) {
    const data = this.getCachedData();

    const { format = data.format, properties = data.properties } = args;
    await this.saveTransactions(
      [
        this.updateOp([], {
          properties,
          format,
          last_edited_time: Date.now()
        }),
      ]
    )
  }

  /**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
  async convertTo(type: TBasicBlockType) {
    const data = this.getCachedData();
    await this.saveTransactions([
      this.updateOp([], { type })
    ]);

    const cached_value = this.cache.block.get(data.id);
    if (cached_value) {
      data.type = type;
      cached_value.type = type;
      this.cache.block.set(data.id, cached_value);
    }
  }

  /**
   * Delete the current block
   */
  async delete() {
    const data = this.getCachedData();
    const current_time = Date.now();
    const is_root_page = data.parent_table === "space" && data.type === "page";
    await this.saveTransactions(
      [
        this.updateOp([], {
          alive: false,
          last_edited_time: current_time
        }),
        is_root_page ? spaceListRemove(data.space_id, ['pages'], { id: data.id }) : blockListRemove(data.parent_id, ['content'], { id: data.id }),
        is_root_page ? spaceSet(data.space_id, ['last_edited_time'], current_time) : blockSet(data.parent_id, ['last_edited_time'], current_time)
      ]
    );
  }

  /**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
  async transfer(new_parent_id: string) {
    const data = this.getCachedData();
    const current_time = Date.now();
    await this.saveTransactions(
      [
        this.updateOp([], { last_edited_time: current_time, permissions: null, parent_id: new_parent_id, parent_table: 'block', alive: true }),
        blockListRemove(data.parent_id, ['content'], { id: data.id }),
        blockListAfter(new_parent_id, ['content'], { after: '', id: data.id }),
        blockSet(data.parent_id, ['last_edited_time'], current_time),
        blockSet(new_parent_id, ['last_edited_time'], current_time)
      ]
    )

  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  createBlock({ $block_id, type, properties = {}, format = {}, parent_id, parent_table = 'block' }: CreateBlockArg) {
    const data = this.getCachedData();
    const current_time = Date.now();
    const arg: any = {
      id: $block_id,
      properties,
      format,
      type,
      parent_id: parent_id || data.id,
      parent_table,
      alive: true,
      created_time: current_time,
      created_by_id: this.user_id,
      created_by_table: 'notion_user',
      last_edited_time: current_time,
      last_edited_by_id: this.user_id,
      last_edited_by_table: 'notion_user',
    };
    return this.updateOp([], arg);

  }
}

export default Block;
