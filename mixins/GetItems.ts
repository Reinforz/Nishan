import { ISpace, IUserRoot, Predicate, TBlock, TData, UpdateCacheManuallyParam, } from "../types";
import Data from "../api/Data";

type Constructor<T extends TData, E = Data<T>> = new (...args: any[]) => E;

export default function GetItems<T extends TData>(Base: Constructor<T>) {
  return class GetItems extends Base {
    init_cache: boolean;
    path: keyof T = "" as any;

    constructor(...args: any[]) {
      super(args[0]);
      this.init_cache = false;
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          this.path = "content" as any
        else if (data.type === "collection_view" || data.type === "collection_view_page")
          this.path = "view_ids" as any
      } else if (this.type === "space")
        this.path = "pages" as any
      else if (this.type === "user_root")
        this.path = "space_views" as any
    }

    async initializeCache() {
      if (!this.init_cache) {
        let container: UpdateCacheManuallyParam = []
        if (this.type === "block") {
          const data = this.getCachedData() as TBlock;
          if (data.type === "page")
            container = data.content ?? [];
          if (data.type === "collection_view" || data.type === "collection_view_page")
            container = data.view_ids.map((view_id) => [view_id, "collection_view"]) ?? []
        } else if (this.type === "space") {
          container = (this.getCachedData() as ISpace).pages ?? [];
        } else if (this.type === "user_root")
          container = (this.getCachedData() as IUserRoot).space_views ?? []

        const non_cached: UpdateCacheManuallyParam = container.filter(info =>
          Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
        );

        if (non_cached.length !== 0)
          await this.updateCacheManually(non_cached);

        this.init_cache = true;
      }
    }

    async getItems(arg: undefined | string[] | Predicate<T>, multiple: boolean = true, cb: (T: T) => Promise<T>) {
      const data = this.getCachedData(), blocks: T[] = [], container: string[] = data[this.path] as any ?? [];
      await this.initializeCache();

      if (Array.isArray(arg)) {
        for (let index = 0; index < arg.length; index++) {
          const block_id = arg[index], block = this.getCachedData(block_id);
          let should_add = container.includes(block_id);
          if (should_add)
            blocks.push(await cb(block));
          if (!multiple && blocks.length === 1) break;
        }
      } else if (typeof arg === "function" || arg === undefined) {
        for (let index = 0; index < container.length; index++) {
          const block_id = container[index], block: T = this.getCachedData(block_id);
          let should_add = typeof arg === "function" ? await arg(block, index) : true;
          if (should_add) blocks.push(await cb(block))
          if (!multiple && blocks.length === 1) break;
        }
      }
      return blocks;
    }

    async deleteItems() {

    }
  }

}