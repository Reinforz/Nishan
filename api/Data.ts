import { ISpace } from "../types/api";
import { IPage, IRootPage, TParentType } from "../types/block";
import { BlockRepostionArg } from "../types/function";
import { NishanArg, TDataType, TData, Operation } from "../types/types";
import { blockListAfter, blockListBefore, spaceListAfter, spaceListBefore } from "../utils/chunk";
import { error } from "../utils/logs";
import Getters from "./Getters";

export default class Data<T extends TData> extends Getters {
  data: T;
  type: TDataType;

  constructor(arg: NishanArg<T>) {
    super(arg);
    this.type = arg.type;
    this.data = arg.data as any;
  }

  getParent() {
    if ((this.data as any).parent_id) {
      const parent = this.cache.block.get((this.data as any).parent_id) as TParentType;
      if (!parent) throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
      return parent;
    } else
      throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
  }

  addToChildArray($block_id: string, arg: number | BlockRepostionArg | undefined): [Operation, (() => void)] {
    const data = this.type === "space" ? this.data as ISpace : this.data as IPage | IRootPage;
    const cached_data = this.type === "space" ? this.cache.space.get(this.data.id) as ISpace : this.cache.block.get(this.data.id) as IPage | IRootPage;
    const container = this.type === "space" ? (data as ISpace).pages : (data as IPage).content;
    const cached_container = this.type === "space" ? (cached_data as ISpace).pages : (cached_data as IPage).content;
    const path = this.type === "space" ? "pages" : "content";
    const listAfter = this.type === "space" ? spaceListAfter : blockListAfter;
    const listBefore = this.type === "space" ? spaceListBefore : blockListBefore;
    if (container) {
      let block_list_after_op = listAfter(data.id, [path], {
        after: '',
        id: $block_id
      });

      if (arg !== undefined) {
        if (typeof arg === "number") {
          const block_id_at_pos = (data as any)?.[path]?.[arg] ?? '';
          block_list_after_op = listBefore(data.id, [path], {
            before: block_id_at_pos,
            id: $block_id
          });
        } else
          block_list_after_op = arg.position === "after" ? listAfter(data.id, [path], {
            after: arg.id,
            id: $block_id
          }) : listBefore(data.id, [path], {
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
  }

  updateCache(items: [keyof T, any][]) {
    const cached_data = this.cache[this.type].get(this.data.id) as T;
    if (cached_data) items.forEach(([key, value]) => {
      cached_data[key] = value;
      this.data[key] = value;
    })
  }
}