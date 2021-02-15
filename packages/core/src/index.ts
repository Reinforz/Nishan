import {NotionCacheClass} from "@nishans/cache";
import { INotionUser } from "@nishans/types";

import Block from "./Block";
import Collection from "./Collection";
import CollectionViewPage from "./CollectionViewPage";
import CollectionView from "./CollectionView";
import NotionUser from "./NotionUser";
import Page from "./Page";
import UserSettings from "./UserSettings";
import UserRoot from "./UserRoot";
import SpaceView from "./SpaceView";
import Space from "./Space";
import SchemaUnit from "./SchemaUnit";
import CollectionBlock from "./CollectionBlock";
import NotionPermissions from "./Permissions";
export * from "./View";
import { constructLogger, error, iterateAndGetChildren, transformToMultiple } from "../utils";
import {Logger, NishanArg,FilterType, FilterTypes} from "../types";

class Nishan extends NotionCacheClass {
  token: string;
  interval: number;
  init_cache: boolean;
  logger: Logger;

  constructor(arg: Pick<NishanArg, "token"> & { interval?: number, logger?: Logger }) {
    super(arg);
    this.token = arg.token;
    this.interval = arg.interval ?? 500;
    this.init_cache = false;
    this.logger = constructLogger(arg.logger)
  }

  #initializeCache = async () => {
    if (!this.init_cache) {
      await this.initializeNotionCache();
      this.init_cache = true;
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

    const common_props = {
      token: this.token,
      cache: this.cache,
      interval: this.interval,
      logger: this.logger,
      stack: [],
    }

    const notion_user_ids: string[] = [];
    for (const [notion_user_id] of this.cache.notion_user) {
      notion_user_ids.push(notion_user_id)
    }

    return await iterateAndGetChildren<INotionUser, INotionUser, NotionUser[]>(args, (id)=>this.cache.notion_user.get(id), {
      ...common_props,
      multiple,
      child_ids: notion_user_ids,
      child_type: 'notion_user',
      container: [],
      parent_id: '',
      parent_type: 'notion_user'
    }, (id, _, container)=>container.push(new NotionUser({ ...common_props, user_id: id, id, space_id: "0", shard_id: 0 })));
  }
}

export default Nishan;
export * from "../types";
export * from "../utils";

export {
  Block,
  Collection,
  CollectionViewPage,
  CollectionView,
  NotionUser,
  Page,
  UserSettings,
  UserRoot,
  SpaceView,
  Space,
  SchemaUnit,
  CollectionBlock,
  NotionPermissions
}