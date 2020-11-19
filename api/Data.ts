import { v4 as uuidv4 } from 'uuid';

import { Schema, NishanArg, TDataType, TData, IOperation, Args, BlockRepostionArg, TBlock, TParentType, ICollection, ISpace, ISpaceView, IUserRoot, UpdateCacheManuallyParam, CreateRootCollectionViewPageParams, FilterTypes } from "../types";
import { Operation, error, createViews } from "../utils";
import Getters from "./Getters";

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Getters {
  protected id: string;
  protected type: TDataType;
  protected listBeforeOp: (path: string[], args: Args) => IOperation;
  protected listAfterOp: (path: string[], args: Args) => IOperation;
  protected updateOp: (path: string[], args: Args) => IOperation;
  protected setOp: (path: string[], args: Args) => IOperation;
  protected listRemoveOp: (path: string[], args: Args) => IOperation;
  protected child_path: keyof T = "" as any;
  protected child_type: TDataType = "block" as any;
  #init_cache: boolean = false;
  #init_child_data: boolean;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.listBeforeOp = Operation[arg.type].listBefore.bind(this, this.id);
    this.listAfterOp = Operation[arg.type].listAfter.bind(this, this.id);
    this.updateOp = Operation[arg.type].update.bind(this, this.id)
    this.setOp = Operation[arg.type].set.bind(this, this.id)
    this.listRemoveOp = Operation[arg.type].listRemove.bind(this, this.id);
    this.#init_cache = false;
    this.#init_child_data = false;
  }

  protected initializeChildData() {
    if (!this.#init_child_data) {
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          this.child_path = "content" as any
        else if (data.type === "collection_view" || data.type === "collection_view_page") {
          this.child_path = "view_ids" as any
          this.child_type = "collection_view"
        }
      } else if (this.type === "space")
        this.child_path = "pages" as any;
      else if (this.type === "user_root") {
        this.child_path = "space_views" as any;
        this.child_type = "space_view"
      }
      else if (this.type === "collection")
        this.child_path = "template_pages" as any;
      else if (this.type === "space_view")
        this.child_path = "bookmarked_pages" as any;
      this.#init_child_data = true;
    }
  }

  /**
   * Get the parent of the current data
   */
  protected getParent() {
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
  protected deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg 
   * @returns created Operation and a function to update the cache and the class data
   */
  protected addToChildArray(child_id: string, position: number | BlockRepostionArg | undefined) {
    const data = this.getCachedData();
    this.initializeChildData()
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
  protected updateCacheLocally(arg: Partial<T>, keys: (keyof T)[]) {
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

  protected async initializeCache() {
    if (!this.#init_cache) {
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

      this.#init_cache = true;
    }
  }

  protected async traverseChildren<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (block: Q, should_add: boolean) => Promise<void>, condition?: (Q: Q) => boolean) {
    await this.initializeCache();
    await this.initializeChildData();
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
        const should_add = (condition ? condition(block) : true) && typeof arg === "function" ? await arg(block, index) : true;
        if (should_add) {
          matched.push(block)
          await cb(block, should_add);
        }
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }

  protected async getItems<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true, cb: (Q: Q) => Promise<any>, condition?: (Q: Q) => boolean) {
    const blocks: any[] = [];
    await this.traverseChildren<Q>(arg, multiple, async function (block, matched) {
      if (matched) blocks.push(await cb(block))
    }, condition ?? (() => true))
    return blocks;
  }

  protected async deleteItems<Q extends TData>(arg: FilterTypes<Q>, multiple: boolean = true,) {
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

  protected createCollection(option: Partial<CreateRootCollectionViewPageParams>, parent_id: string) {
    const { properties, format } = option;

    if (!option.views) option.views = [{
      aggregations: [
        ['title', 'count']
      ],
      name: 'Default View',
      type: 'table'
    }];

    if (!option.schema) option.schema = [
      ['Name', 'title']
    ];
    const schema: Schema = {};

    option.schema.forEach(opt => {
      const schema_key = (opt[1] === "title" ? "Title" : opt[0]).toLowerCase().replace(/\s/g, '_');
      schema[schema_key] = {
        name: opt[0],
        type: opt[1],
        ...(opt[2] ?? {})
      } as any;
      /* if (schema[schema_key].options) schema[schema_key].options = (schema[schema_key] as any).options.map(([value, color]: [string, string]) => ({
        id: uuidv4(),
        value,
        color
      })) */
    });

    const views = option.views.map((view) => ({
      ...view,
      id: uuidv4()
    }));

    return { schema, views: createViews(views, parent_id), properties, format }
  }
}