import axios from "axios";
import colors from "colors";
import {syncRecordValues, Cache, getSpaces} from "@nishans/endpoints"
import { INotionUser, SyncRecordValuesResult } from "@nishans/types";

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
import { error } from "../utils/logs";
import {Logger, NishanArg,FilterType, FilterTypes} from "../types";

class Nishan extends Cache {
  token: string;
  interval: number;
  init_cache: boolean;
  logger: Logger;

  constructor(arg: Pick<NishanArg, "token"> & { interval?: number, logger?: Logger }) {
    super(arg);
    this.token = arg.token;
    this.interval = arg.interval || 500;
    this.init_cache = false;
    this.logger = arg.logger || function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)}:${colors.blue(id)}`);
    };
  }

  #initializeCache = async () => {
    if (!this.init_cache) {
      try {
        await this.initializeCache();
        this.init_cache = true;
      } catch (err) {
        console.log(err)
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

    if (Array.isArray(args)) {
      for (let index = 0; index < args.length; index++) {
        const id = args[index], block = this.cache.notion_user.get(id), should_add = notion_user_ids.includes(id);
        if (should_add && block) user_ids.push(block.id);
        if (!multiple && user_ids.length === 1) break;
      }
    } else if (typeof args === "function" || args === undefined) {
      for (let index = 0; index < notion_user_ids.length; index++) {
        const notion_user_id = notion_user_ids[index], notion_user = this.cache.notion_user.get(notion_user_id) as INotionUser, should_add = typeof args === "function" ? await args(notion_user, index) : true;
        if (should_add && notion_user) user_ids.push(notion_user.id);
        if (!multiple && user_ids.length === 1) break;
      }
    }

    return user_ids.map(user_id => {
      this.logger && this.logger(`READ`, 'notion_user', user_id);
      return new NotionUser({ ...common_props, user_id: user_id, id: user_id, space_id: "0", shard_id: 0 })
    });
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