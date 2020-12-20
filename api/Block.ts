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

  /**
   * Reposition the current block within its parent block
   * @param arg number or the specific position to reposition the current block
   * @param execute Boolean to indicate whether to execute the operation or add it for batching
   */

  async reposition(arg: RepositionParams, execute?: boolean) {
    const data = this.getCachedData();
    await this.executeUtil([this.addToChildArray(this.id, arg)], [data.id, data.parent_id], execute);
  }

  /**
   * Duplicate the current block
   * @param infos Array of objects containing information regarding the position and id of the duplicated block
   * @param execute Boolean to indicate whether to execute the operation or add it for batching
   * @returns A block map
   */

  async duplicate(infos: { position: RepositionParams, id?: string }[], execute?: boolean) {
    const block_map = this.createBlockMap(), data = this.getCachedData(), ops: IOperation[] = [], sync_records: UpdateCacheManuallyParam = [];
    for (let index = 0; index < infos.length; index++) {
      const { position, id } = infos[index], $gen_block_id = this.generateId(id);
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
        this.logger && this.logger("CREATE", "Block", $gen_block_id)
      } else {
        ops.push(
          Operation.block.update($gen_block_id, [], {
            ...data,
            id: $gen_block_id,
            copied_from: data.id,
          }),
          this.addToParentChildArray($gen_block_id, position)
        )
        this.logger && this.logger("CREATE", "Block", $gen_block_id)
      }

      block_map[data.type].push(await this.createClass(data.type, $gen_block_id));
    }

    await this.executeUtil(ops, [...sync_records, data.parent_id], execute);
    return block_map;
  }

  /**
   * Update a block's properties and format
   * @param args Block update format and properties options
   */
  async update(args: Partial<A>, execute?: boolean) {
    const data = this.getCachedData();

    const { format = data.format, properties = data.properties } = args;

    this.logger && this.logger("UPDATE", "Block", data.id);

    await this.executeUtil([
      this.updateOp([], {
        properties,
        format,
        last_edited_time: Date.now()
      }),
    ], [data.id], execute)
  }

  /**
   * Convert the current block to a different basic block
   * @param type `TBasicBlockType` basic block types
   */
  async convertTo(type: TBasicBlockType, execute?: boolean) {
    const data = this.getCachedData() as any;
    data.type = type;
    this.logger && this.logger("UPDATE", "Block", data.id);
    await this.executeUtil([
      this.updateOp([], { type })
    ], [data.id], execute)
  }

  /**
   * Delete the current block
   */
  async delete(execute?: boolean) {
    const data = this.getCachedData();
    const current_time = Date.now();
    const is_root_page = data.parent_table === "space" && data.type === "page";

    await this.executeUtil([
      this.updateOp([], {
        alive: false,
        last_edited_time: current_time
      }),
      is_root_page ? Operation.space.listRemove(data.space_id, ['pages'], { id: data.id }) : Operation.block.listRemove(data.parent_id, ['content'], { id: data.id }),
      is_root_page ? Operation.space.set(data.space_id, ['last_edited_time'], current_time) : Operation.block.set(data.parent_id, ['last_edited_time'], current_time)
    ], [this.id], execute)
  }

  /**
   * Transfer a block from one parent page to another page
   * @param new_parent_id Id of the new parent page
   */
  async transfer(new_parent_id: string, execute?: boolean) {
    const data = this.getCachedData();
    const current_time = Date.now();
    await this.executeUtil([
      this.updateOp([], { last_edited_time: current_time, permissions: null, parent_id: new_parent_id, parent_table: 'block', alive: true }),
      Operation.block.listRemove(data.parent_id, ['content'], { id: data.id }),
      Operation.block.listAfter(new_parent_id, ['content'], { after: '', id: data.id }),
      Operation.block.set(data.parent_id, ['last_edited_time'], current_time),
      Operation.block.set(new_parent_id, ['last_edited_time'], current_time)
    ], [this.id, data.parent_id, new_parent_id], execute)
  }
}

export default Block;
