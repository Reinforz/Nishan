import { NotionCache } from '@nishans/cache';
import { NotionOperationPluginFunction } from '@nishans/operations';
import { FilterType, FilterTypes, NotionTraverser } from '@nishans/traverser';
import {
  INotionCache,
  INotionUser,
  NotionCacheInitializerTracker
} from '@nishans/types';
import { INotionCoreOptions } from '../';
import { transformToMultiple } from '../utils';
import NotionUser from './NotionUser';

export default class Nishan {
  token: string;
  interval: number;
  #init_cache: boolean;
  logger: boolean;
  notion_operation_plugins: NotionOperationPluginFunction[];
  cache: INotionCache;
  cache_init_tracker: NotionCacheInitializerTracker;

  constructor(
    arg: Pick<INotionCoreOptions, 'token' | 'interval' | 'logger'> & {
      notion_operation_plugins?: INotionCoreOptions['notion_operation_plugins'];
      cache?: INotionCache;
    }
  ) {
    this.token = arg.token;
    this.interval = arg.interval ?? 500;
    this.#init_cache = false;
    this.logger = arg.logger ?? true;
    this.notion_operation_plugins = arg.notion_operation_plugins ?? [];
    this.cache = arg.cache
      ? NotionCache.validateCache(arg.cache)
      : NotionCache.createDefaultCache();
    this.cache_init_tracker = NotionCache.createDefaultCacheInitializeTracker();
  }

  #initializeCache = async () => {
    if (!this.#init_cache) {
      await NotionCache.initializeNotionCache({
        interval: this.interval,
        cache: this.cache,
        token: this.token,
        user_id: ''
      });
      this.#init_cache = true;
    }
  };

  getProps() {
    return {
      token: this.token,
      cache: this.cache,
      interval: this.interval,
      logger: this.logger,
      notion_operation_plugins: this.notion_operation_plugins,
      cache_init_tracker: this.cache_init_tracker
    };
  }

  /**
   * Get `INotionUser` and return `NotionUser` by the `args` param
   * @param args An string id, a predicate passed the INotionUser or undefined to indicate everything
   */
  async getNotionUser(arg?: FilterType<INotionUser>) {
    return (await this.getNotionUsers(transformToMultiple(arg), false))[0];
  }

  /**
   * Get `INotionUser[]` and return `NotionUser[]` by the `args` param
   * @param args An array of string ids, a predicate passed the INotionUser or undefined to indicate everything
   */
  async getNotionUsers(args?: FilterTypes<INotionUser>, multiple?: boolean) {
    await this.#initializeCache();

    const notion_user_ids: string[] = [];
    for (const [notion_user_id] of this.cache.notion_user) {
      notion_user_ids.push(notion_user_id);
    }
    return await NotionTraverser.get<INotionUser, INotionUser, NotionUser[]>(
      args,
      (id) => this.cache.notion_user.get(id),
      {
        ...this.getProps(),
        multiple,
        child_ids: notion_user_ids,
        child_type: 'notion_user',
        container: [],
        parent_id: '',
        parent_type: 'notion_user'
      },
      (id, _, container) =>
        container.push(
          new NotionUser({
            ...this.getProps(),
            user_id: id,
            id,
            space_id: '0',
            shard_id: 0
          })
        )
    );
  }
}
