
import { NishanArg, TDataType, TData, IOperation, Args, BlockRepostionArg, TBlock, TParentType } from "../types";
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
  addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined) {
    const data = this.getCachedData() as any;
    let parent_id: string = "";
    let path: "pages" | "view_ids" | "content" | "space_views" = "pages";
    let parent_type: "space" | "block" | "user_root" = "block";
    switch (this.type) {
      case "block":
        parent_type = data.parent_table;
        parent_id = data.parent_id;
        switch (parent_type) {
          case "block":
            path = "content";
            break;
          case "space":
            path = "pages";
            break;
        }
        break;
      case "space_view":
        parent_type = "user_root";
        path = "space_views";
        parent_id = this.user_id
        break;
      case "collection_view":
        parent_type = "block"
        path = "view_ids"
        parent_id = data.parent_id
        break;
      case "space":
        parent_type = "space";
        path = "pages"
        parent_id = this.id;
    }
    const parent_data = this.cache[parent_type].get(parent_id) as any;
    parent_data[path] = parent_data[path] ?? [];
    const cached_container = parent_data[path];

    let where: "before" | "after" = "before", id: string = '';

    if (arg !== undefined) {
      if (typeof arg === "number") {
        id = parent_data[path]?.[arg] ?? '';
        where = parent_data[path].indexOf($block_id) > arg ? "before" : "after";
        cached_container.splice(arg, 0, $block_id);
      } else {
        where = arg.position, id = arg.id;
        cached_container.splice(cached_container.indexOf(arg.id) + (arg.position === "before" ? -1 : 1), 0, $block_id);
      }

      return (Operation[parent_type] as any)[`list${where.charAt(0).toUpperCase() + where.substr(1)}`](parent_id, [path], {
        [where]: id,
        id: $block_id
      }) as IOperation
    } else {
      cached_container.push($block_id);
      return Operation[parent_type].listAfter(parent_id, [path], {
        after: '',
        id: $block_id
      }) as IOperation;
    }
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg 
   * @param keys 
   */
  updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
    const _this = this;
    const parent_data = this.getCachedData();
    const data = arg as T;

    keys.forEach(key => {
      data[key] = arg[key] ?? (_this as any).data[key]
    });

    (data as any).last_edited_time = Date.now();

    return [this.updateOp(this.type === "user_settings" ? ["settings"] : [], data), function () {
      keys.forEach(key => {
        parent_data[key] = data[key];
        (_this as any).data[key] = data[key];
      })
    }] as [IOperation, (() => void)];
  }
}