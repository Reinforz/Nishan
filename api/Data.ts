import { ISpace } from "../types/api";
import { IPage, IRootPage, TParentType } from "../types/block";
import { BlockRepostionArg } from "../types/function";
import { NishanArg, TDataType, TData, Operation, Args } from "../types/types";
import { blockListAfter, blockListBefore, blockListRemove, blockSet, blockUpdate, notionUserListAfter, notionUserListBefore, notionUserListRemove, notionUserSet, notionUserUpdate, spaceListAfter, spaceListBefore, spaceListRemove, spaceSet, spaceUpdate, spaceViewListAfter, spaceViewListBefore, spaceViewListRemove, spaceViewSet, spaceViewUpdate, userSettingsListAfter, userSettingsListBefore, userSettingsListRemove, userSettingsSet, userSettingsUpdate } from "../utils/chunk";
import { error } from "../utils/logs";
import Getters from "./Getters";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */
export default class Data<T extends TData> extends Getters {
  data: T | undefined;
  type: TDataType;
  listBeforeOp: (path: string[], args: Args) => Operation;
  listAfterOp: (path: string[], args: Args) => Operation;
  updateOp: (path: string[], args: Args) => Operation;
  setOp: (path: string[], args: Args) => Operation;
  listRemoveOp: (path: string[], args: Args) => Operation;

  constructor(arg: NishanArg<T>) {
    super(arg);
    this.type = arg.type;
    this.data = arg.data as any;
    switch (this.type) {
      case "space":
        this.listBeforeOp = spaceListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = spaceListAfter.bind(this, (this.data as any).id);
        this.updateOp = spaceUpdate.bind(this, (this.data as any).id);
        this.setOp = spaceSet.bind(this, (this.data as any).id);
        this.listRemoveOp = spaceListRemove.bind(this, (this.data as any).id);
        break;
      case "block":
        this.listBeforeOp = blockListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = blockListAfter.bind(this, (this.data as any).id);
        this.updateOp = blockUpdate.bind(this, (this.data as any).id);
        this.setOp = blockSet.bind(this, (this.data as any).id);
        this.listRemoveOp = blockListRemove.bind(this, (this.data as any).id);
        break;
      case "space_view":
        this.listBeforeOp = spaceViewListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = spaceViewListAfter.bind(this, (this.data as any).id);
        this.updateOp = spaceViewUpdate.bind(this, (this.data as any).id);
        this.setOp = spaceViewSet.bind(this, (this.data as any).id);
        this.listRemoveOp = spaceViewListRemove.bind(this, (this.data as any).id);
        break;
      case "user_settings":
        this.listBeforeOp = userSettingsListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = userSettingsListAfter.bind(this, (this.data as any).id);
        this.updateOp = userSettingsUpdate.bind(this, (this.data as any).id);
        this.setOp = userSettingsSet.bind(this, (this.data as any).id);
        this.listRemoveOp = userSettingsListRemove.bind(this, (this.data as any).id);
        break;
      case "notion_user":
        this.listBeforeOp = notionUserListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = notionUserListAfter.bind(this, (this.data as any).id);
        this.updateOp = notionUserUpdate.bind(this, (this.data as any).id);
        this.setOp = notionUserSet.bind(this, (this.data as any).id);
        this.listRemoveOp = notionUserListRemove.bind(this, (this.data as any).id);
        break;
      default:
        this.listBeforeOp = blockListBefore.bind(this, (this.data as any).id);
        this.listAfterOp = blockListAfter.bind(this, (this.data as any).id);
        this.updateOp = blockUpdate.bind(this, (this.data as any).id);
        this.setOp = blockSet.bind(this, (this.data as any).id);
        this.listRemoveOp = blockListRemove.bind(this, (this.data as any).id);
        break;
    }
  }

  /**
   * Get the parent of the current data
   */
  getParent() {
    if (this.data) {
      if ((this.data as any).parent_id) {
        const parent = this.cache.block.get((this.data as any).parent_id) as TParentType;
        if (!parent) throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
        return parent;
      } else
        throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
    } else
      throw new Error(error("Data has been deleted"));
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData() {
    if (this.data)
      return this.cache[this.type].get(this.data.id) as T;
    else
      throw new Error(error("Data has been deleted"));
  }

  /**
   * Delete the cached data using the id
   */
  deleteCachedData() {
    if (this.data) {
      this.cache[this.type].delete(this.data.id);
      this.data = undefined;
    } else
      throw new Error(error("Data has been deleted"));
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg 
   * @returns created Operation and a function to update the cache and the class data
   */
  addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined): [Operation, (() => void)] {
    if (this.data) {
      const data = this.type === "space" ? this.data as ISpace : this.data as IPage | IRootPage;
      const cached_data = this.type === "space" ? this.cache.space.get(this.data.id) as ISpace : this.cache.block.get(this.data.id) as IPage | IRootPage;
      const container = this.type === "space" ? (data as ISpace).pages : (data as IPage).content;
      const cached_container = this.type === "space" ? (cached_data as ISpace).pages : (cached_data as IPage).content;
      const path = this.type === "space" ? "pages" : "content";
      if (container) {
        let block_list_after_op = this.listAfterOp([path], {
          after: '',
          id: $block_id
        });

        if (arg !== undefined) {
          if (typeof arg === "number") {
            const block_id_at_pos = (data as any)?.[path]?.[arg] ?? '';
            block_list_after_op = this.listBeforeOp([path], {
              before: block_id_at_pos,
              id: $block_id
            });
          } else
            block_list_after_op = arg.position === "after" ? this.listAfterOp([path], {
              after: arg.id,
              id: $block_id
            }) : this.listBeforeOp([path], {
              after: arg.id,
              id: $block_id
            })
        }

        return [block_list_after_op, function () {
          if (arg === undefined) {
            cached_container.push($block_id);
            container.push($block_id);
          }
          else {
            if (typeof arg === "number") {
              container.splice(arg, 0, $block_id);
              cached_container.splice(arg, 0, $block_id);
            }
            else {
              const target_index = container.indexOf(arg.id);
              container.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
              cached_container.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
            }
          }
        }];

      } else
        throw new Error("The data does not contain children")
    } else
      throw new Error(error("Data has been deleted"));
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg 
   * @param keys 
   */
  updateCache(arg: Partial<T>, keys: (keyof T)[]) {
    if (this.data) {
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
      }] as [Operation, (() => void)];
    } else
      throw new Error(error("Data has been deleted"));
  }

  deleteCompletely() {
    if (this.data) {
      this.deleteCachedData();
      this.data = undefined as any;
    } else
      throw new Error(error("Data has been deleted"));
  }
}