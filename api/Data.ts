
import { NishanArg, TDataType, TData, IOperation, Args, BlockRepostionArg, IPage, IRootPage, TBlock, TParentType, ISpace } from "../types";
import { Operation, error } from "../utils";
import Getters from "./Getters";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Getters {
  id: string;
  type: TDataType;
  listBeforeOp: (path: string[], args: Args) => IOperation;
  listAfterOp: (path: string[], args: Args) => IOperation;
  updateOp: (path: string[], args: Args) => IOperation;
  setOp: (path: string[], args: Args) => IOperation;
  listRemoveOp: (path: string[], args: Args) => IOperation;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.listBeforeOp = Operation[arg.type].listBefore.bind(this, this.id);
    this.listAfterOp = Operation[arg.type].listAfter.bind(this, this.id);
    this.updateOp = Operation[arg.type].update.bind(this, this.id)
    this.setOp = Operation[arg.type].set.bind(this, this.id)
    this.listRemoveOp = Operation[arg.type].listRemove.bind(this, this.id);
  }

  /**
   * Get the parent of the current data
   */
  getParent() {
    const data = this.getCachedData() as TBlock;
    if (this.type.match(/(space|block|collection)/) && data?.parent_id) {
      const parent = this.cache.block.get(data.parent_id) as TParentType;
      if (!parent) throw new Error(error(`Block with id ${data.id} doesnot have a parent`));
      return parent;
    } else
      throw new Error(error(`Block with id ${data.id} doesnot have a parent`));
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData<Q extends TData = T>(arg?: string, type?: TDataType) {
    type = type ? type : "block";
    let id = this.id;
    if (typeof arg === "string") id = arg;
    const data = this.cache[arg ? type : this.type].get(id) as Q;
    if (data) return data;
    else if ((data as any).alive === false)
      throw new Error(error("Data has been deleted"));
    else
      throw new Error(error("Data not available in cache"))
  }

  /**
   * Delete the cached data using the id
   */
  deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg 
   * @returns created Operation and a function to update the cache and the class data
   */
  addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined, parent?: [string, "space" | "page" | "collection_view_page" | "collection_view"] | [string, "space" | "page" | "collection_view_page" | "collection_view", string],) {
    const target_id = parent?.[0] ?? this.id;
    const parent_type = parent?.[1] ?? this.type;
    const cached_data = (parent_type) === "space" ? this.cache.space.get(target_id) as ISpace : this.cache.block.get(target_id) as IPage | IRootPage;
    const cached_container = (parent_type) === "space" ? (cached_data as ISpace).pages : (cached_data as IPage).content;
    const path = parent?.[2] ?? (parent_type) === "space" ? "pages" : (parent_type === "collection_view_page" || parent_type === "collection_view") ? "view_ids" : "content";
    if (cached_container) {
      let block_list_pos_op = (path === "pages" ? Operation.space.listAfter : Operation.block.listAfter)((target_id), [path], {
        after: '',
        id: $block_id
      });

      if (arg !== undefined) {
        if (typeof arg === "number") {
          const current_pos = (cached_data as any)?.[path].indexOf($block_id);
          const block_id_at_pos = (cached_data as any)?.[path]?.[arg] ?? '';
          block_list_pos_op = current_pos > arg ? (path === "pages" ? Operation.space.listBefore : Operation.block.listBefore)((target_id), [path], {
            before: block_id_at_pos,
            id: $block_id
          }) : (path === "pages" ? Operation.space.listAfter : Operation.block.listAfter)((target_id), [path], {
            after: block_id_at_pos,
            id: $block_id
          });
        } else
          block_list_pos_op = arg.position === "after" ? (path === "pages" ? Operation.space.listAfter : Operation.block.listAfter)((target_id), [path], {
            after: arg.id,
            id: $block_id
          }) : (path === "pages" ? Operation.space.listBefore : Operation.block.listBefore)((target_id), [path], {
            after: arg.id,
            id: $block_id
          })
      }

      if (arg === undefined)
        cached_container.push($block_id);
      else {
        if (typeof arg === "number")
          cached_container.splice(arg, 0, $block_id);
        else {
          const target_index = cached_container.indexOf(arg.id);
          cached_container.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
        }
      }

      return block_list_pos_op;

    } else
      throw new Error("The data does not contain children")
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg 
   * @param keys 
   */
  updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
    const _this = this;
    const cached_data = this.getCachedData();
    const data = arg as T;

    keys.forEach(key => {
      data[key] = arg[key] ?? (_this as any).data[key]
    });

    (data as any).last_edited_time = Date.now();

    return [this.updateOp(this.type === "user_settings" ? ["settings"] : [], data), function () {
      keys.forEach(key => {
        cached_data[key] = data[key];
        (_this as any).data[key] = data[key];
      })
    }] as [IOperation, (() => void)];
  }
}