import { ISpace } from "../types/api";
import { IPage, IRootPage, TParentType } from "../types/block";
import { BlockRepostionArg } from "../types/function";
import { NishanArg, TDataType, TData, Operation, Args } from "../types/types";
import { blockListAfter, blockListBefore, blockUpdate, notionUserListAfter, notionUserListBefore, notionUserUpdate, spaceListAfter, spaceListBefore, spaceUpdate, spaceViewListAfter, spaceViewListBefore, spaceViewUpdate, userSettingsListAfter, userSettingsListBefore, userSettingsUpdate } from "../utils/chunk";
import { error } from "../utils/logs";
import Getters from "./Getters";

export default class Data<T extends TData> extends Getters {
  data: T | undefined;
  type: TDataType;
  listBeforeOp: (id: string, path: string[], args: Args) => Operation;
  listAfterOp: (id: string, path: string[], args: Args) => Operation;
  updateOp: (id: string, path: string[], args: Args) => Operation;

  constructor(arg: NishanArg<T>) {
    super(arg);
    this.type = arg.type;
    this.data = arg.data as any;
    switch (this.type) {
      case "space":
        this.listBeforeOp = spaceListBefore;
        this.listAfterOp = spaceListAfter;
        this.updateOp = spaceUpdate;
        break;
      case "block":
        this.listBeforeOp = blockListBefore;
        this.listAfterOp = blockListAfter;
        this.updateOp = blockUpdate;
        break;
      case "space_view":
        this.listBeforeOp = spaceViewListBefore;
        this.listAfterOp = spaceViewListAfter;
        this.updateOp = spaceViewUpdate;
        break;
      case "user_settings":
        this.listBeforeOp = userSettingsListBefore;
        this.listAfterOp = userSettingsListAfter;
        this.updateOp = userSettingsUpdate;
        break;
      case "notion_user":
        this.listBeforeOp = notionUserListBefore;
        this.listAfterOp = notionUserListAfter;
        this.updateOp = notionUserUpdate;
        break;
      default:
        this.listBeforeOp = blockListBefore;
        this.listAfterOp = blockListAfter;
        this.updateOp = blockUpdate;
        break;
    }
  }

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

  getCachedData() {
    if (this.data)
      return this.cache[this.type].get(this.data.id) as T;
    else
      throw new Error(error("Data has been deleted"));
  }

  deleteCachedData() {
    if (this.data) {
      this.cache[this.type].delete(this.data.id);
      this.data = undefined;
    } else
      throw new Error(error("Data has been deleted"));
  }

  addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined): [Operation, (() => void)] {
    if (this.data) {
      const data = this.type === "space" ? this.data as ISpace : this.data as IPage | IRootPage;
      const cached_data = this.type === "space" ? this.cache.space.get(this.data.id) as ISpace : this.cache.block.get(this.data.id) as IPage | IRootPage;
      const container = this.type === "space" ? (data as ISpace).pages : (data as IPage).content;
      const cached_container = this.type === "space" ? (cached_data as ISpace).pages : (cached_data as IPage).content;
      const path = this.type === "space" ? "pages" : "content";
      if (container) {
        let block_list_after_op = this.listAfterOp(data.id, [path], {
          after: '',
          id: $block_id
        });

        if (arg !== undefined) {
          if (typeof arg === "number") {
            const block_id_at_pos = (data as any)?.[path]?.[arg] ?? '';
            block_list_after_op = this.listBeforeOp(data.id, [path], {
              before: block_id_at_pos,
              id: $block_id
            });
          } else
            block_list_after_op = arg.position === "after" ? this.listAfterOp(data.id, [path], {
              after: arg.id,
              id: $block_id
            }) : this.listBeforeOp(data.id, [path], {
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

  updateCache(arg: Partial<T>, keys: (keyof T)[]) {
    if (this.data) {
      const _this = this;
      const cached_data = this.getCachedData();
      const data = arg as T;

      keys.forEach(key => {
        data[key] = arg[key] ?? (_this as any).data[key]
      });

      (data as any).last_edited_time = Date.now();

      return [this.updateOp(this.data.id, this.type === "user_settings" ? ["settings"] : [], data), function () {
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