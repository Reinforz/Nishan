import { v4 as uuidv4 } from 'uuid';

import { Operation } from '../utils';

import Data from "./Data";

import { TBlock, TBlockInput, CreateBlockArg, TBasicBlockType, NishanArg, RepositionParams, IOperation, UpdateCacheManuallyParam } from "../types"

/**
 * A class to represent block of Notion
 * @noInheritDoc
 */
class Block<T extends TBlock, A extends TBlockInput> extends Data<T> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "block" });
  }

  async reposition(arg: RepositionParams) {
    await this.saveTransactions([this.addToChildArray(this.id, arg) as any]);
  }

  // ? FEAT:1:M Take a position arg
  /**
   * Duplicate the current block
   * @returns The duplicated block object
   */

  async duplicate(times?: number, positions?: RepositionParams[]) {
    times = times ?? 1;
    const block_map = this.createBlockMap(), data = this.getCachedData(), ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [];
    for (let index = 0; index < times; index++) {
      const $gen_block_id = uuidv4();
      sync_records.push($gen_block_id);
      if (data.type === "collection_view" || data.type === "collection_view_page") {
        ops.push(
          Operation.block.update($gen_block_id, [], {
            id: $gen_block_id,
            type: "copy_indicator",
            parent_id: data.parent_id,
            parent_table: "block",
            alive: true,
          })
        )
        await this.enqueueTask({
          eventName: 'duplicateBlock',
          request: {
            sourceBlockId: data.id,
            targetBlockId: $gen_block_id,
            addCopyName: true
          }
        });
      } else {
        ops.push(
          Operation.block.update($gen_block_id, [], {
            ...data,
            id: $gen_block_id,
            copied_from: data.id,
          }),
          this.addToParentChildArray($gen_block_id, positions ? positions[index] : undefined)
        )
      }

      block_map[data.type].push(await this.createClass(data.type, $gen_block_id));
    }

    await this.saveTransactions(ops);
    await this.updateCacheManually([...sync_records, data.parent_id])
    return block_map;
  }

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
    await this.updateCacheManually([data.id]);
  }

  /**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
  async convertTo(type: TBasicBlockType) {
    const data = this.getCachedData() as any;
    await this.saveTransactions([
      this.updateOp([], { type })
    ]);

    data.type = type;
    await this.updateCacheManually([data.id]);
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
        is_root_page ? Operation.space.listRemove(data.space_id, ['pages'], { id: data.id }) : Operation.block.listRemove(data.parent_id, ['content'], { id: data.id }),
        is_root_page ? Operation.space.set(data.space_id, ['last_edited_time'], current_time) : Operation.block.set(data.parent_id, ['last_edited_time'], current_time)
      ]
    );
    this.cache.block.delete(this.id);
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
        Operation.block.listRemove(data.parent_id, ['content'], { id: data.id }),
        Operation.block.listAfter(new_parent_id, ['content'], { after: '', id: data.id }),
        Operation.block.set(data.parent_id, ['last_edited_time'], current_time),
        Operation.block.set(new_parent_id, ['last_edited_time'], current_time)
      ]
    )
    await this.updateCacheManually([this.id, data.parent_id, new_parent_id]);
  }

  // ? TD:1:H Add type definition propertoes and format for specific block types
  protected createBlock({ $block_id, type, properties = {}, format = {}, parent_id, parent_table = 'block' }: CreateBlockArg) {
    const data = this.getCachedData();
    const current_time = Date.now();
    const arg: any = {
      id: $block_id,
      properties,
      format,
      type,
      parent_id: parent_id ?? data.id,
      parent_table,
      alive: true,
      created_time: current_time,
      created_by_id: this.user_id,
      created_by_table: 'notion_user',
      last_edited_time: current_time,
      last_edited_by_id: this.user_id,
      last_edited_by_table: 'notion_user',
    };
    return Operation.block.update($block_id, [], arg);
  }
}

export default Block;
