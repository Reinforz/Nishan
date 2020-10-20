import { v4 as uuidv4 } from 'uuid';

import { blockUpdate, blockListRemove, blockSet, blockListAfter, spaceSet, spaceListRemove } from '../utils/chunk';

import Getters from "./Getters";

import { IBlockType, ContentBlockType, NishanArg, PageFormat, PageProps, TBlock } from "../types"

class Block<T extends TBlock> extends Getters {
  block_data: T;

  constructor(arg: NishanArg & { block_data: T }) {
    super(arg);
    this.block_data = arg.block_data;
  }

  /**
   * Duplicate the current block
   */
  async duplicate() {
    const $gen_block_id = uuidv4();
    await this.saveTransactions(
      [
        this.createBlock({ $block_id: $gen_block_id, type: 'copy_indicator', parent_id: this.block_data.parent_id }),
        blockListAfter(this.block_data.parent_id, ['content'], {
          after: this.block_data.id,
          id: $gen_block_id
        }),
      ]
    );

    await this.enqueueTask({
      eventName: 'duplicateBlock',
      request: {
        sourceBlockId: this.block_data.id,
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
      block_data: block[$gen_block_id].value,
      ...this.getProps()
    })
  }

  // ? TD:1:H IBlockType specific arg properties and format
  // ? FEAT:2:M Add Permission to args
  /**
   * Update a block properties and format
   * @param args Block update format and properties options
   */
  async update(args: { format?: Partial<PageFormat>, properties?: Partial<PageProps> } = {}) {
    const { format = {}, properties = {} } = args;
    // ? FIX:2:H Handle when args does not have appropriate shape eg: when format is not given, use the current value
    await this.saveTransactions(
      [
        blockUpdate(this.block_data.id, [], {
          properties,
          format,
          last_edited_time: Date.now()
        }),
      ]
    )
  }

  async convertTo(type: ContentBlockType) {
    await this.saveTransactions([
      blockUpdate(this.block_data.id, [], { type })
    ]);

    const cached_value = this.cache.block.get(this.block_data.id);
    if (cached_value) {
      this.block_data.type = type;
      cached_value.type = type;
      this.cache.block.set(this.block_data.id, cached_value);
    }
  }

  /**
   * Delete the current block, whether its a page or regular block
   */
  async delete() {
    const current_time = Date.now();
    const is_root_page = this.block_data.parent_table === "space" && this.block_data.type === "page";
    await this.saveTransactions(
      [
        blockUpdate(this.block_data.id, [], {
          alive: false
        }),
        is_root_page ? spaceListRemove(this.block_data.space_id, ['pages'], { id: this.block_data.id }) : blockListRemove(this.block_data.parent_id, ['content'], { id: this.block_data.id }),
        blockSet(this.block_data.id, ['last_edited_time'], current_time),
        is_root_page ? spaceSet(this.block_data.space_id, ['last_edited_time'], current_time) : blockSet(this.block_data.parent_id, ['last_edited_time'], current_time)
      ]
    );
    this.cache.block.delete(this.block_data.id);
    return new Promise((resolve) => setTimeout(() => resolve(undefined), this.interval));
  }

  /**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
  async transfer(new_parent_id: string) {
    const current_time = Date.now();
    await this.saveTransactions(
      [
        blockUpdate(this.block_data.id, [], { last_edited_time: current_time, permissions: null, parent_id: new_parent_id, parent_table: 'block', alive: true }),
        blockListRemove(this.block_data.parent_id, ['content'], { id: this.block_data.id }),
        blockListAfter(new_parent_id, ['content'], { after: '', id: this.block_data.id }),
        blockSet(this.block_data.parent_id, ['last_edited_time'], current_time),
        blockSet(new_parent_id, ['last_edited_time'], current_time)
      ]
    )
  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  createBlock({ $block_id, type, properties = {}, format = {}, parent_id }: { $block_id: string, type: IBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string }) {
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
