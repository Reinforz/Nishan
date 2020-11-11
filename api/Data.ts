
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
  child_path: keyof T = "" as any;
  child_type: TDataType = "" as any;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.listBeforeOp = Operation[arg.type].listBefore.bind(this, this.id);
    this.listAfterOp = Operation[arg.type].listAfter.bind(this, this.id);
    this.updateOp = Operation[arg.type].update.bind(this, this.id)
    this.setOp = Operation[arg.type].set.bind(this, this.id)
    this.listRemoveOp = Operation[arg.type].listRemove.bind(this, this.id);

    if (this.type === "block") {
      const data = this.getCachedData() as TBlock;
      if (data.type === "page") {
        this.child_type = "block";
        this.child_path = "content" as any
      }
      else if (data.type === "collection_view" || data.type === "collection_view_page") {
        this.child_path = "view_ids" as any
        this.child_type = "collection_view"
      }
    } else if (this.type === "space") {
      this.child_path = "pages" as any;
      this.child_type = "block";
    }
    else if (this.type === "user_root") {
      this.child_path = "space_views" as any;
      this.child_type = "space_view"
    }
    else if (this.type === "collection") {
      this.child_path = "template_pages" as any;
      this.child_type = "block"
    }
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
  addToChildArray(child_id: string, position: number | BlockRepostionArg | undefined) {
    const data = this.getCachedData();
    if (!data[this.child_path]) data[this.child_path] = [] as any;

    const container: string[] = data[this.child_path] as any;

    let where: "before" | "after" = "before", id: string = '';

    if (position !== undefined) {
      if (typeof position === "number") {
        id = container?.[position] ?? '';
        where = container.indexOf(child_id) > position ? "before" : "after";
        container.splice(position, 0, child_id);
      } else {
        where = position.position, id = position.id;
        container.splice(container.indexOf(position.id) + (position.position === "before" ? -1 : 1), 0, child_id);
      }

      return (Operation[this.type] as any)[`list${where.charAt(0).toUpperCase() + where.substr(1)}`](this.id, [this.child_path as string], {
        [where]: id,
        id: child_id
      }) as IOperation
    } else {
      container.push(child_id);
      return Operation[this.type].listAfter(this.id, [this.child_path as string], {
        after: '',
        id: child_id
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