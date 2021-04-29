import { NotionCache } from '@nishans/cache';
import { INotionFabricatorOptions, TBlockInput } from '@nishans/fabricator';
import { NotionLogger } from '@nishans/logger';
import {
  NotionOperationPluginFunction,
  NotionOperations
} from '@nishans/operations';
import {
  FilterTypes,
  IterateAndDeleteOptions,
  IterateAndGetOptions,
  IterateAndUpdateOptions,
  NotionTraverser,
  UpdateTypes
} from '@nishans/traverser';
import {
  INotionCache,
  NotionCacheInitializerTracker,
  TData,
  TDataType
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { NotionValidators } from '@nishans/validators';
import { INotionCoreOptions } from '../';

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class NotionData<
  T extends TData,
  U extends Partial<TData | TBlockInput>
> implements INotionCoreOptions {
  id: string;
  type: TDataType;
  logger: boolean;
  user_id: string;
  notion_operation_plugins: NotionOperationPluginFunction[];
  space_id: string;
  interval: number;
  token: string;
  cache: INotionCache;
  cache_init_tracker: NotionCacheInitializerTracker;

  constructor(
    arg: INotionCoreOptions & { cache?: INotionCache; type: TDataType }
  ) {
    this.type = arg.type;
    this.id = arg.id;
    this.logger = arg.logger ?? true;
    this.user_id = arg.user_id;
    this.notion_operation_plugins = arg.notion_operation_plugins ?? [];
    this.space_id = arg.space_id;
    this.interval = arg.interval ?? 500;
    this.cache =
      (arg.cache && NotionCache.validateCache(arg.cache)) ||
      NotionCache.createDefaultCache();
    this.cache_init_tracker =
      arg.cache_init_tracker ||
      NotionCache.createDefaultCacheInitializeTracker();
    if (!arg.token) throw new Error(`Token not provided`);
    this.token = arg.token;
  }

  protected getLastEditedProps() {
    return {
      last_edited_time: Date.now(),
      last_edited_by_table: 'notion_user',
      last_edited_by_id: this.user_id
    };
  }

  protected updateLastEditedProps(data?: TData) {
    return NotionUtils.updateLastEditedProps(
      data ?? (this.getCachedData() as any),
      this.user_id
    );
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData() {
    const data = this.cache[this.type].get(this.id);
    if (!data)
      NotionLogger.method.warn(
        `${this.type}:${this.id} doesnot exist in the cache`
      );
    else if ((data as any).alive === false)
      NotionLogger.method.warn(`${this.type}:${this.id} is not alive`);
    return data as T;
  }

  async updateCachedData() {
    await NotionCache.updateCacheManually(
      [[this.id, this.type]],
      this.getProps()
    );
  }

  /**
   * Delete the cached data using the id
   */
  protected deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  async update(arg: U) {
    const data = this.getCachedData() as T;
    this.logger && NotionLogger.method.info(`UPDATE ${this.type} ${this.id}`);
    if (NotionValidators.dataContainsEditedProps(this.type))
      NotionUtils.deepMerge(arg, this.getLastEditedProps());
    NotionUtils.deepMerge(data, arg);
    await NotionOperations.executeOperations(
      [NotionOperations.Chunk[this.type].update(this.id, [], arg)],
      this.getProps()
    );
  }

  async initializeCacheForThisData() {
    await NotionCache.initializeCacheForSpecificData(
      this.id,
      this.type,
      this.getProps()
    );
  }

  protected async deleteIterate<TD, C = any[]>(
    args: FilterTypes<TD>,
    options: IterateAndDeleteOptions<T, C>,
    transform: (id: string) => TD | undefined | Promise<TD | undefined>,
    cb?: (id: string, data: TD, container: C) => void | Promise<any>
  ) {
    if (options?.initialize_cache ?? true)
      await this.initializeCacheForThisData();
    return await NotionTraverser.delete<T, TD, C>(
      args,
      transform,
      {
        parent_id: this.id,
        parent_type: this.type,
        ...this.getProps(),
        ...options
      },
      cb
    );
  }

  protected async updateIterate<TD, RD, C = any[]>(
    args: UpdateTypes<TD, RD>,
    options: IterateAndUpdateOptions<T, C>,
    transform: (id: string) => TD | undefined | Promise<TD | undefined>,
    cb?: (id: string, data: TD, updated_data: RD, container: C) => any
  ) {
    if (options?.initialize_cache ?? true)
      await this.initializeCacheForThisData();
    return await NotionTraverser.update<T, TD, RD, C>(
      args,
      transform,
      {
        parent_type: this.type,
        parent_id: this.id,
        ...this.getProps(),
        ...options
      },
      cb
    );
  }

  protected async getIterate<RD, C>(
    args: FilterTypes<RD>,
    options: IterateAndGetOptions<T, C>,
    transform: (id: string) => RD | undefined | Promise<RD | undefined>,
    cb?: (id: string, data: RD, container: C) => any
  ) {
    if (options?.initialize_cache ?? true)
      await this.initializeCacheForThisData();
    return await NotionTraverser.get<T, RD, C>(
      args,
      transform,
      {
        parent_id: this.id,
        parent_type: this.type,
        ...this.getProps(),
        ...options
      },
      cb
    );
  }

  getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      space_id: this.space_id,
      cache: this.cache,
      logger: this.logger,
      notion_operation_plugins: this.notion_operation_plugins,
      cache_init_tracker: this.cache_init_tracker
    } as INotionFabricatorOptions;
  }
}
