import colors from "colors";
import {Cache} from "@nishans/endpoints"
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
import Operations from "./Operations";
import CollectionBlock from "./CollectionBlock";
export * from "./View";
import { error, iterateAndGetChildren } from "../utils";
import {Logger, NishanArg,FilterType, FilterTypes} from "../types";

class Nishan extends Cache {
  token: string;
  interval: number;
  init_cache: boolean;
  logger: Logger;

  constructor(arg: Pick<NishanArg, "token"> & { interval?: number, logger?: Logger }) {
    super(arg);
    this.token = arg.token;
    this.interval = arg.interval ?? 500;
    this.init_cache = false;
    this.logger = arg.logger === false ? false : function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)} ${colors.blue(id)}`);
    };
  }

  #initializeCache = async () => {
    if (!this.init_cache) {
      try {
        await this.initializeCache();
        this.init_cache = true;
      } catch (err) {
        throw new Error(error(err.response.data))
      }
    }
  }

  /**
   * Get `INotionUser` and return `NotionUser` by the `args` param
   * @param args An string id, a predicate passed the INotionUser or undefined to indicate everything
   */
  async getNotionUser(arg?: FilterType<INotionUser>) {
    return (await this.getNotionUsers(typeof arg === "string" ? [arg] : arg, false))[0];
  }

  /**
   * Get `INotionUser[]` and return `NotionUser[]` by the `args` param
   * @param args An array of string ids, a predicate passed the INotionUser or undefined to indicate everything
   */
  async getNotionUsers(args?: FilterTypes<INotionUser>, multiple?: boolean) {
    multiple = multiple ?? true;
    await this.#initializeCache();

    const user_ids: string[] = [];
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
      child_ids: user_ids,
      child_type: 'notion_user',
      container: [],
      parent_id: this.user_id ?? '',
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
  Operations,
  CollectionBlock
}