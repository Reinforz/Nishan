import { ICollection, IOperation, ISpace, ISpaceView, IUserRoot, Predicate, TBlock, TData, TDataType, UpdateCacheManuallyParam, } from "../types";
import Data from "../api/Data";
import { Operation } from "../utils";

type Constructor<T extends TData, E = Data<T>> = new (...args: any[]) => E;

export default function GetItems<T extends TData>(Base: Constructor<T>) {
  return class GetItems extends Base {
    init_cache: boolean;

    constructor(...args: any[]) {
      super(args[0]);
      this.init_cache = false;
    }

    async initializeCache() {
      if (!this.init_cache) {
        let container: UpdateCacheManuallyParam = []
        if (this.type === "block") {
          const data = this.getCachedData() as TBlock;
          if (data.type === "page")
            container = data.content ?? [];
          if (data.type === "collection_view" || data.type === "collection_view_page") {
            container = data.view_ids.map((view_id) => [view_id, "collection_view"]) ?? []
            container.push([data.collection_id, "collection"])
          }
        } else if (this.type === "space") {
          container = (this.getCachedData() as ISpace).pages ?? [];
        } else if (this.type === "user_root")
          container = (this.getCachedData() as IUserRoot).space_views.map((space_view => [space_view, "space_view"])) ?? []
        else if (this.type === "collection")
          container = (this.getCachedData() as ICollection).template_pages ?? []
        else if (this.type === "space_view")
          container = (this.getCachedData() as ISpaceView).bookmarked_pages ?? []

        const non_cached: UpdateCacheManuallyParam = container.filter(info =>
          !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
        );

        if (non_cached.length !== 0)
          await this.updateCacheManually(non_cached);

        this.init_cache = true;
      }
    }

    async traverseChildren<Q extends TData>(arg: undefined | string[] | Predicate<Q>, multiple: boolean = true, cb: (block: Q, should_add: boolean) => Promise<void>) {
      await this.initializeCache();
      const matched: Q[] = [];
      const data = this.getCachedData(), container: string[] = data[this.child_path] as any ?? [];
      if (Array.isArray(arg)) {
        for (let index = 0; index < arg.length; index++) {
          const block_id = arg[index], block = this.cache[this.child_type].get(block_id) as Q;
          const should_add = container.includes(block_id);
          if (should_add) {
            matched.push(block)
            await cb(block, should_add);
          }
          if (!multiple && matched.length === 1) break;
        }
      } else if (typeof arg === "function" || arg === undefined) {
        for (let index = 0; index < container.length; index++) {
          const block_id = container[index], block = this.cache[this.child_type].get(block_id) as Q;
          const should_add = typeof arg === "function" ? await arg(block, index) : true;
          if (should_add) {
            matched.push(block)
            await cb(block, should_add);
          }
          if (!multiple && matched.length === 1) break;
        }
      }
      return matched;
    }

    async getItems<Q extends TData>(arg: undefined | string[] | Predicate<Q>, multiple: boolean = true, cb: (Q: Q) => Promise<any>) {
      const blocks: any[] = [];
      await this.traverseChildren<Q>(arg, multiple, async function (block, matched) {
        if (matched) blocks.push(await cb(block))
      })
      return blocks;
    }

    async deleteItems<Q extends TData>(arg: undefined | string[] | Predicate<Q>, multiple: boolean = true,) {
      const ops: IOperation[] = [], current_time = Date.now(), _this = this;
      const blocks = await this.traverseChildren(arg, multiple, async function (block, matched) {
        if (matched) {
          ops.push(Operation[_this.child_type as TDataType].update(block.id, [], {
            alive: false,
            last_edited_time: current_time
          }),
            _this.listRemoveOp([_this.child_path as string], { id: block.id })
          )
        }
      })
      if (ops.length !== 0) {
        ops.push(this.setOp(["last_edited_time"], current_time));
        await this.saveTransactions(ops);
        blocks.forEach(blocks => this.cache.block.delete(blocks.id));
      }
    }
  }
}