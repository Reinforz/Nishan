import { NotionCache } from "@nishans/cache";
import { NotionErrors } from "@nishans/errors";
import { NotionIdz } from "@nishans/idz";
import { NotionOperationPluginFunction } from "@nishans/operations";
import { FilterType, FilterTypes, NotionTraverser } from "@nishans/traverser";
import { ICache, ICollection, INotionUser, NotionCacheInitializerTracker, TPage } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { CollectionViewPage, CreateMaps, INotionCoreOptions, Page } from "../";
import { transformToMultiple } from "../utils";
import NotionUser from "./NotionUser";

export default class Nishan {
  token: string;
  interval: number;
  #init_cache: boolean;
  logger: boolean;
  notion_operation_plugins: NotionOperationPluginFunction[];
  cache: ICache;
  cache_init_tracker: NotionCacheInitializerTracker;

  constructor(arg: Pick<INotionCoreOptions, "token" | "interval" | "logger" > & {notion_operation_plugins?: INotionCoreOptions["notion_operation_plugins"], cache?: ICache}) {
    this.token = arg.token;
    this.interval = arg.interval ?? 500;
    this.#init_cache = false;
    this.logger = arg.logger ?? true;
    this.notion_operation_plugins = arg.notion_operation_plugins ?? [];
    this.cache = arg.cache ? NotionCache.validateCache(arg.cache) : NotionCache.createDefaultCache();
    this.cache_init_tracker = NotionCache.createDefaultCacheInitializeTracker()
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
  }

  getProps(){
    return {
      token: this.token,
      cache: this.cache,
      interval: this.interval,
      logger: this.logger,
      notion_operation_plugins: this.notion_operation_plugins,
      cache_init_tracker: this.cache_init_tracker
    }
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
      notion_user_ids.push(notion_user_id)
    }
    return await NotionTraverser.get<INotionUser, INotionUser, NotionUser[]>(args, (id)=>this.cache.notion_user.get(id), {
      ...this.getProps(),
      multiple,
      child_ids: notion_user_ids,
      child_type: 'notion_user',
      container: [],
      parent_id: '',
      parent_type: 'notion_user',
    }, (id, _, container)=>container.push(new NotionUser({ ...this.getProps(), user_id: id, id, space_id: "0", shard_id: 0 })));
  }

  async getPagesById(ids: string[]) {
    await this.#initializeCache();
    ids = ids.map(id=>NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(id)));
    const page_map = CreateMaps.page();
    await NotionCache.updateCacheIfNotPresent(ids.map(id=>[id, 'block']), {...this.getProps(), user_id: ''});
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index], page = this.cache.block.get(id) as TPage;
      await NotionCache.initializeCacheForSpecificData(page.id, "block", {...this.getProps(), user_id: page.created_by_id});
      if (page.type === "page") {
        const page_obj = new Page({ ...this.getProps(), user_id: page.created_by_id, id: page.id, space_id: page.space_id, shard_id: page.shard_id })
        page_map.page.set(page.id, page_obj)
        page_map.page.set(NotionUtils.extractInlineBlockContent(page.properties.title), page_obj);
      } else if (page.type === "collection_view_page"){
        const cvp_obj = new CollectionViewPage({ ...this.getProps(),user_id: page.created_by_id, id: page.id, space_id: page.space_id, shard_id: page.shard_id });
        const collection = this.cache.collection.get(page.collection_id) as ICollection;
        page_map.collection_view_page.set(collection.name[0][0], cvp_obj);
        page_map.collection_view_page.set(page.id, cvp_obj);
      }
      else
        throw new NotionErrors.unsupported_block_type((page as any).type,['page', 'collection_view_page'])
    }
    return page_map;
  }
}