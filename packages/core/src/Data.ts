import { TDataType, TData } from '@nishans/types';
import { NishanArg, RepositionParams, FilterTypes, UpdateTypes, Logger } from '../types';
import { Operation, warn, positionChildren, iterateAndUpdateChildren, iterateAndGetChildren, iterateAndDeleteChildren, constructLogger } from "../utils";
import Operations from "./Operations";

export interface IterateOptions<T, C>{
  /**
   * The data type of the child
   */
  child_type: TDataType,
  /**
   * A container of child ids or a key of the parent that stores the child ids
   */
  child_ids: string[] | keyof T,
  /**
   * Matches multiple based on the value
   */
  multiple?: boolean,
  /**
   * A container that stores the data
   */
  container: C
}

export interface IterateAndGetOptions<T, C> extends IterateOptions<T, C>{
}


export type IterateAndDeleteOptions<T, C> = IterateOptions<T, C> & ( {
  /**
   * Whether or not the user will manually handle all the mutations
   */
  manual: true
  /**
   * The key of the parent which contains the child ids
   */
  child_path?: keyof T,
} | {
  manual?: false
  child_path: keyof T,
})

export type IterateAndUpdateOptions<T, C> = IterateOptions<T, C> & {
  /**
   * Whether or not the user will manually handle all the mutations
   */
  manual?: boolean
}

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Operations {
  id: string;
  type: TDataType;
  init_cache = false;
  protected logger: Logger;
  user_id: string

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.init_cache = false;
    this.logger = constructLogger(arg.logger);
    this.user_id = arg.user_id ?? '';
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

  protected addToChildArray(parent_type: TDataType, parent: TData, position: RepositionParams) {
    this.stack.push(positionChildren({ logger: this.logger, child_id: this.id, position, parent, parent_type }))
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

  protected async initializeCacheForThisData() {
    if (!this.init_cache && this.type !== "notion_user") {
      await this.initializeCacheForSpecificData(this.id, this.type)
      this.init_cache = true;
    }
  }

  protected async deleteIterate<TD, C = any[]>(args: FilterTypes<TD>, options: IterateAndDeleteOptions<T, C>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD) => void | Promise<any>) {
    await this.initializeCacheForThisData()
    return  await iterateAndDeleteChildren<T, TD, C>(args, transform, {
      parent_id: this.id,
      parent_type: this.type,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async updateIterate<TD, RD, C = any[]>(args: UpdateTypes<TD, RD>, options: IterateAndUpdateOptions<T, C>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD, updated_data: RD, container: C) => any) {
    await this.initializeCacheForThisData();
    return await iterateAndUpdateChildren<T, TD, RD, C>(args, transform, {
      parent_type: this.type,
      parent_id: this.id,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async getIterate<RD, C>(args: FilterTypes<RD>, options: IterateAndGetOptions<T, C>, transform: ((id: string) => RD | undefined), cb?: (id: string, data: RD, container: C) => any) {
    await this.initializeCacheForThisData();
    return await iterateAndGetChildren<T, RD, C>(args, transform, {
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
      user_id: this.user_id ?? '',
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache,
      logger: this.logger,
      stack: this.stack
    }
  }
}