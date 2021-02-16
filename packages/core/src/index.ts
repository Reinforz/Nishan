import { NotionCacheClass } from "@nishans/cache";
import { INotionUser } from "@nishans/types";
import { FilterType, FilterTypes, Logger, NishanArg } from "../types";
import { constructLogger, iterateAndGetChildren, transformToMultiple } from "../utils";
import Collection from "./Collection";
import NotionData from "./Data";
import NotionUser from "./NotionUser";
import NotionPermissions from "./Permissions";
import SchemaUnit from "./SchemaUnit";
import Space from "./Space";
import SpaceView from "./SpaceView";
import UserRoot from "./UserRoot";
import UserSettings from "./UserSettings";

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
export * from "./Block";
export * from "./View";
export {
  Collection,
  NotionUser,
  UserSettings,
  UserRoot,
  SpaceView,
  Space,
  SchemaUnit,
  NotionPermissions,
  NotionData
};

