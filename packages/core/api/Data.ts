import { TDataType, TData, IOperation, TBlock, ISpace, IUserRoot, ICollection, ISpaceView } from '@nishans/types';
import { TMethodType, NishanArg, RepositionParams, UpdateCacheManuallyParam, FilterTypes, UpdateTypes, TBlockCreateInput } from '../types';
import { Operation, warn, nestedContentPopulate, positionChildren, iterateChildren, detectChildData } from "../utils";
import Operations from "./Operations";

interface CommonIterateOptions<T> {
  child_ids: keyof T | string[],
  child_type: TDataType,
  multiple?: boolean
}

interface UpdateIterateOptions<T> extends CommonIterateOptions<T> { };
interface DeleteIterateOptions<T> extends UpdateIterateOptions<T> {
  child_path?: keyof T
}
interface GetIterateOptions<T> extends CommonIterateOptions<T> {
  method?: TMethodType,
}

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Operations {
  id: string;
  type: TDataType;
  protected child_path: keyof T = "" as any;
  protected child_type: TDataType = "block" as any;
  #init_cache = false;
  #init_child_data = false;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.#init_cache = false;
    this.#init_child_data = false;
  }

  protected getLastEditedProps() {
    return { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: this.user_id }
  }

  protected updateLastEditedProps(data?:TData){
    const target = data ?? this.getCachedData() as any;
    target.last_edited_time = Date.now();
    target.last_edited_by_table = "notion_user";
    target.last_edited_by_id = this.user_id;
  }

  protected initializeChildData() {
    if (!this.#init_child_data) {
      const [child_path, child_type] = detectChildData(this.type, this.getCachedData() as TBlock);
      this.child_path = child_path as any;
      this.child_type = child_type as any;
      this.#init_child_data = true;
    }
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData() {
    const data = this.cache[this.type].get(this.id);
    if ((data as any).alive === false)
      warn(`${this.type}:${this.id} has been deleted`);
    return data as T;
  }

  async updateCachedData(){
    await this.updateCacheManually([[this.id, this.type]])
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
  protected addToChildArray(child_id: string, position: RepositionParams) {
    const data = this.getCachedData();
    this.initializeChildData();
    if (!data[this.child_path]) data[this.child_path] = [] as any;
    const container: string[] = data[this.child_path] as any;
    return positionChildren({ child_id, position, container, child_path: this.child_path as string, parent_id: this.id, parent_type: this.type })
  }

  protected addToParentChildArray(child_id: string, position: RepositionParams) {
    const data = this.getCachedData() as any, parent = (this.cache as any)[data.parent_table].get(data.parent_id),
      child_path = detectChildData(data.parent_table, this.getCachedData() as TBlock)[0], container: string[] = parent[child_path] as any;
    return positionChildren({ child_id, position, container, child_path, parent_id: data.parent_id, parent_type: data.parent_table })
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg
   * @param keys
   */
  updateCacheLocally(arg: Partial<T>, keys: ReadonlyArray<(keyof T)>, appendToStack?: boolean) {
    appendToStack = appendToStack ?? true
    const parent_data = this.getCachedData(), data = arg;

    Object.entries(arg).forEach(([key, value])=>{
      if(keys.includes(key as keyof T))
        parent_data[key as keyof T] = value;
    })

    this.logger && this.logger("UPDATE", this.type as any, this.id)
    if(appendToStack)
      this.stack.push(
        Operation[this.type].update(this.id,this.type === "user_settings" ? ["settings"] : [], data)
      );
  }

  protected async initializeCache() {
    if (!this.#init_cache) {
      const container: UpdateCacheManuallyParam = []
      if (this.type === "block") {
        const data = this.getCachedData() as TBlock;
        if (data.type === "page")
          container.push(...data.content);
        if (data.type === "collection_view" || data.type === "collection_view_page") {
          data.view_ids.map((view_id) => container.push([view_id, "collection_view"]))
          container.push([data.collection_id, "collection"])
        }
      } else if (this.type === "space") {
        const space = this.getCachedData() as ISpace;
        container.push(...space.pages);
        space.permissions.forEach((permission) => container.push([permission.user_id, "notion_user"]))
      } else if (this.type === "user_root")
        (this.getCachedData() as IUserRoot).space_views.map((space_view => container.push([space_view, "space_view"]))) ?? []
      else if (this.type === "collection") {
        container.push(...((this.getCachedData() as ICollection).template_pages ?? []))
        await this.queryCollection({
          collectionId: this.id,
          collectionViewId: "",
          query: {},
          loader: {
            type: "table",
            loadContentCover: true
          }
        })
      }
      else if (this.type === "space_view")
        container.push(...(this.getCachedData() as ISpaceView).bookmarked_pages ?? [])

      const non_cached: UpdateCacheManuallyParam = container.filter(info =>
        !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
      );

      if (non_cached.length !== 0)
        await this.updateCacheManually(non_cached);

      this.#init_cache = true;
    }
  }

  protected async deleteIterate<TD>(args: FilterTypes<TD>, options: DeleteIterateOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD) => void | Promise<any>) {
    await this.initializeCache()
    const { child_type, child_path } = options, updated_props = this.getLastEditedProps(), data = this.getCachedData();
    const ops: IOperation[] = [];
    const matched_ids = await iterateChildren<T, TD>(args, transform, {
      data: this.getCachedData(),
      logger: this.logger,
      method: "DELETE",
      type: this.type,
      ...options
    }, (child_id) => {
      if (child_type) {
        const block = this.cache[child_type].get(child_id) as any;
        block.alive = false;
        this.updateLastEditedProps(block);
        ops.push(Operation[child_type].update(child_id, [], { alive: false, ...updated_props }));
        if (typeof child_path === "string") {
          data[child_path] = (data[child_path] as any).filter((id: string)=>id !== child_id) as any
          ops.push(Operation[this.type].listRemove(this.id, [child_path], { id: child_id }));
        }
      }
    }, cb);
    if (ops.length !== 0) {
      this.updateLastEditedProps();
      ops.push(Operation[this.type].update(this.id, [], { ...updated_props }));
    }
    this.stack.push(...ops);
    return matched_ids;
  }

  protected async updateIterate<TD, RD>(args: UpdateTypes<TD, RD>, options: UpdateIterateOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD, updated_data: RD, index: number) => any) {
    await this.initializeCache()
    const { child_type } = options, updated_props = this.getLastEditedProps();
    const matched_ids: string[] = [], ops: IOperation[] = [];

    await iterateChildren<T, TD, RD>(args, transform, {
      data: this.getCachedData(),
      logger: this.logger,
      type: this.type,
      method: "UPDATE",
      ...options
    }, (child_id, _, updated_data: any) => {
      if (child_type) {
        const block = this.cache[child_type].get(child_id) as any;
        if(updated_data)
          Object.keys(updated_data).forEach((key)=>block[key] = updated_data[key])
        ops.push(Operation[child_type].update(child_id, [], { ...updated_data, ...updated_props }));
      }
    }, cb);

    if (ops.length !== 0) {
      this.updateLastEditedProps();
      ops.push(Operation[this.type].update(this.id, [], { ...updated_props }));
    }
    this.stack.push(...ops);
    return matched_ids;
  }

  protected async getIterate<RD>(args: FilterTypes<RD>, options: GetIterateOptions<T>, transform: ((id: string) => RD | undefined), cb?: (id: string, data: RD) => void | Promise<any>) {
    await this.initializeCache()
    return await iterateChildren<T,RD>(args, transform, {
      data: this.getCachedData(),
      logger: this.logger,
      type: this.type,
      method: 'READ',
      ...options,
    }, undefined, cb);
  }

  protected getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache,
      logger: this.logger,
      stack: this.stack
    }
  }

  protected async nestedContentPopulateAndExecute(options: TBlockCreateInput[], ) {
    const [ops, , block_map] = await nestedContentPopulate(options, this.id, this.type, this.getProps(), this.id);
    this.stack.push(...ops);
    return block_map;
  }
}