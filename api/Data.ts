import { IPage, IRootPage, TParentType } from "../types/block";
import { BlockRepostionArg } from "../types/function";
import { NishanArg, TData } from "../types/types";
import { error } from "../utils/logs";
import Getters from "./Getters";

export default class Data<T extends TData> extends Getters {
  data: T;
  constructor(arg: NishanArg<T>) {
    super(arg);
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

  addToContentArray($block_id: string, arg: number | BlockRepostionArg | undefined) {
    const data = this.data as IPage | IRootPage;
    const cached_data = this.cache.block.get(this.data.id) as IPage | IRootPage;

    if (data.content) {
      if (arg === undefined) {
        cached_data.content.push($block_id);
        data.content.push($block_id);
      }
      else {
        if (typeof arg === "number") {
          data.content.splice(arg, 0, $block_id);
          cached_data.content.splice(arg, 0, $block_id);
        }
        else {
          const target_index = data.content.indexOf(arg.id);
          data.content.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
          cached_data.content.splice(target_index + (arg.position === "before" ? -1 : 1), 0, $block_id);
        }
      }
    } else
      throw new Error("The data is not of type page")
  }

  updateCache(key: "space_view" | "notion_user" | "user_settings" | "space" | "block" | "collection", items: [keyof T, any][]) {
    const cached_data = this.cache[key].get(this.data.id) as T;
    if (cached_data) items.forEach(([key, value]) => {
      cached_data[key] = value;
      this.data[key] = value;
    })
  }
}