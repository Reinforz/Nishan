import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, spaceSet, spaceListRemove, blockListBefore } from '../utils/chunk';

import Data from "./Data";

import { TBasicBlockType, NishanArg } from "../types/types"
import { BlockRepostionArg, CreateBlockArg } from "../types/function";
import { TBlock, IPage, TBlockInput } from '../types/block';
import { error } from '../utils/logs';

class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
  constructor(arg: NishanArg<T>) {
    super(arg);
  }

  /**
   * Reposition a block to a new position
   * @param arg number of new index
   */
  async reposition(arg: number | BlockRepostionArg) {
    if (this.data) {
      const parent = this.cache.block.get(this.data.parent_id) as IPage;
      if (parent) {
        if (parent.content) {
          if (typeof arg === "number") {
            const block_id_at_pos = parent.content[arg];
            await this.saveTransactions([
              blockListAfter(this.data.parent_id, ["content"], { after: block_id_at_pos, id: this.data.id })
            ]);
          } else
            await this.saveTransactions([
              arg.position === "after" ? blockListAfter(this.data.parent_id, ["content"], { after: arg.id, id: this.data.id }) : blockListBefore(this.data.parent_id, ["content"], { after: arg.id, id: this.data.id })
            ]);
        } else
          throw new Error(error("Block parent doesn't have any children"))
      } else
        throw new Error(error("Block doesn't have a parent"))
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Duplicate the current block
   */
  async duplicate() {
    if (this.data) {
      const $gen_block_id = uuidv4();
      await this.saveTransactions(
        [
          this.createBlock({ $block_id: $gen_block_id, type: 'copy_indicator', parent_id: this.data.parent_id }),
          blockListAfter(this.data.parent_id, ['content'], {
            after: this.data.id,
            id: $gen_block_id
          }),
        ]
      );

      await this.enqueueTask({
        eventName: 'duplicateBlock',
        request: {
          sourceBlockId: this.data.id,
          targetBlockId: $gen_block_id,
          addCopyName: true
        }
      });

      const { recordMap: { block } } = await this.syncRecordValues([
        {
          id: $gen_block_id,
          table: 'block',
          version: -1
        }
      ]);
      return new Block({
        type: "block",
        data: block[$gen_block_id].value,
        ...this.getProps()
      })
    } else
      throw new Error(error('Data has been deleted'))
  }

  // ? FEAT:2:M Add Permission to args
  // ? FIX:1:M Update cache
  /**
   * Update a block properties and format
   * @param args Block update format and properties options
   */
  async update(args: Partial<A> = {}) {
    if (this.data) {
      const { format = {}, properties = {} } = args;
      await this.saveTransactions(
        [
          blockUpdate(this.data.id, [], {
            properties,
            format,
            last_edited_time: Date.now()
          }),
        ]
      )
    } else
      throw new Error(error('Data has been deleted'))
  }

  async convertTo(type: TBasicBlockType) {
    if (this.data) {
      await this.saveTransactions([
        blockUpdate(this.data.id, [], { type })
      ]);

      const cached_value = this.cache.block.get(this.data.id);
      if (cached_value) {
        this.data.type = type;
        cached_value.type = type;
        this.cache.block.set(this.data.id, cached_value);
      }
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Delete the current block, whether its a page or regular block
   */
  async delete() {
    if (this.data) {
      const current_time = Date.now();
      const is_root_page = this.data.parent_table === "space" && this.data.type === "page";
      await this.saveTransactions(
        [
          blockUpdate(this.data.id, [], {
            alive: false
          }),
          is_root_page ? spaceListRemove(this.data.space_id, ['pages'], { id: this.data.id }) : blockListRemove(this.data.parent_id, ['content'], { id: this.data.id }),
          blockSet(this.data.id, ['last_edited_time'], current_time),
          is_root_page ? spaceSet(this.data.space_id, ['last_edited_time'], current_time) : blockSet(this.data.parent_id, ['last_edited_time'], current_time)
        ]
      );
      this.cache.block.delete(this.data.id);
      this.deleteCompletely();
    } else
      throw new Error(error('Data has been deleted'))
  }

  /**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
  async transfer(new_parent_id: string) {
    if (this.data) {
      const current_time = Date.now();
      await this.saveTransactions(
        [
          blockUpdate(this.data.id, [], { last_edited_time: current_time, permissions: null, parent_id: new_parent_id, parent_table: 'block', alive: true }),
          blockListRemove(this.data.parent_id, ['content'], { id: this.data.id }),
          blockListAfter(new_parent_id, ['content'], { after: '', id: this.data.id }),
          blockSet(this.data.parent_id, ['last_edited_time'], current_time),
          blockSet(new_parent_id, ['last_edited_time'], current_time)
        ]
      )
    } else
      throw new Error(error('Data has been deleted'))
  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  createBlock({ $block_id, type, properties = {}, format = {}, parent_id }: CreateBlockArg) {
    if (this.data) {
      const current_time = Date.now();
      const arg: any = {
        id: $block_id,
        properties,
        format,
        type,
        parent_id: parent_id || this.data.id,
        parent_table: 'block',
        alive: true,
        created_time: current_time,
        created_by_id: this.user_id,
        created_by_table: 'notion_user',
        last_edited_time: current_time,
        last_edited_by_id: this.user_id,
        last_edited_by_table: 'notion_user',
      };
      return blockUpdate($block_id, [], arg);
    } else
      throw new Error(error('Data has been deleted'))
  }
}

export default Block;
