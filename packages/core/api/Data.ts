import { TDataType, TData, TBlock, ISpace, IUserRoot, ICollection, ISpaceView } from '@nishans/types';
import { NishanArg, RepositionParams, UpdateCacheManuallyParam, FilterTypes, UpdateTypes } from '../types';
import { Operation, warn, positionChildren, iterateAndUpdateChildren, iterateAndGetChildren, iterateAndDeleteChildren } from "../utils";
import Operations from "./Operations";
interface IterateAndGetOptions<T>{
  child_type: TDataType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
}

interface IterateAndUpdateOptions<T> extends IterateAndGetOptions<T>{
  manual?:boolean
}

interface IterateAndDeleteOptions<T> extends IterateAndUpdateOptions<T>{
  child_path?: keyof T,
}

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Operations {
  id: string;
  type: TDataType;
  #init_cache = false;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.#init_cache = false;
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
  protected addToChildArray(parent: TData, position: RepositionParams) {
    this.stack.push(positionChildren({ logger: this.logger, child_id: this.id, position, parent, parent_id: this.id, parent_type: this.type }))
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
        }, 0)
      }
      else if (this.type === "space_view")
        container.push(...(this.getCachedData() as ISpaceView).bookmarked_pages ?? [])

      const non_cached = this.returnNonCachedData(container)
      await this.updateCacheManually(non_cached, 0);

      // If the block is a page, for all the collection block contents, fetch the collection attached with it as well
      if(this.type === "block"){
        const data = this.getCachedData() as TBlock;
        if(data.type === "page"){
          const collection_blocks_ids: UpdateCacheManuallyParam = [];
          for (let index = 0; index < data.content.length; index++) {
            const content_id = data.content[index];
            const content = this.cache.block.get(content_id)
            if(content && (content.type === "collection_view_page" || content.type === "collection_view"))
              collection_blocks_ids.push([content.collection_id, "collection"])
          }
          const non_cached = this.returnNonCachedData(collection_blocks_ids)
          await this.updateCacheManually(non_cached, 0);
        }
      }

      this.#init_cache = true;
    }
  }

  protected async deleteIterate<TD>(args: FilterTypes<TD>, options: IterateAndDeleteOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD) => void | Promise<any>) {
    await this.initializeCache()
    return  await iterateAndDeleteChildren<T, TD>(args, transform, {
      parent_id: this.id,
      parent_type: this.type,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async updateIterate<TD, RD>(args: UpdateTypes<TD, RD>, options: IterateAndUpdateOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD, updated_data: RD) => any) {
    await this.initializeCache()
    return await iterateAndUpdateChildren<T, TD, RD>(args, transform, {
      parent_type: this.type,
      parent_id: this.id,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async getIterate<RD>(args: FilterTypes<RD>, options: IterateAndGetOptions<T>, transform: ((id: string) => RD | undefined), cb?: (id: string, data: RD) => any) {
    await this.initializeCache()
    return await iterateAndGetChildren<T,RD>(args, transform, {
      parent_id: this.id,
      parent_type: this.type,
      ...this.getProps(),
      ...options,
    }, cb);
  }

  getProps() {
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
}