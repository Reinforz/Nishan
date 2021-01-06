import axios from "axios";
import colors from "colors";

import NotionUser from "./api/NotionUser";
import { error } from "./utils/logs";
import Cache from "./api/Cache";
import {  GetSpacesResult, INotionUser, SyncRecordValuesResult } from "@nishans/types";
import {Logger, NishanArg,FilterType, FilterTypes} from "./types";

class Nishan extends Cache {
  token: string;
  interval: number;
  init_cache: boolean;
  logger: Logger;
  defaultExecutionState: boolean

  constructor(arg: Pick<NishanArg, "token"> & { interval?: number, defaultExecutionState?: boolean, logger?: Logger }) {
    super();
    this.token = arg.token;
    this.interval = arg.interval || 500;
    this.init_cache = false;
    this.logger = arg.logger || function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)}:${colors.blue(id)}`);
    };
    this.defaultExecutionState = arg.defaultExecutionState ?? true;
  }

  #initializeCache = async () => {
    if (!this.init_cache) {
      try {
        const { data } = await axios.post(
          'https://www.notion.so/api/v3/getSpaces',
          {},
          {
            headers: {
              cookie: `token_v2=${this.token}`
            }
          }
        ) as { data: GetSpacesResult };

        const external_notion_users: Set<string> = new Set();
        Object.values(data).forEach(data => {
          Object.values(data.space).forEach(space => space.value.permissions.forEach(permission =>
            permission.user_id && external_notion_users.add(permission.user_id)
          ))
          this.saveToCache(data)
        });

        const { data: { recordMap } } = await axios.post(
          `https://www.notion.so/api/v3/syncRecordValues`,
          {
            requests: Array.from(external_notion_users.values()).map(external_notion_user => ({ table: "notion_user", id: external_notion_user, version: -1 }))
          },
          {
            headers: {
              cookie: `token_v2=${this.token}`
            }
          }
        ) as { data: SyncRecordValuesResult };
        this.saveToCache(recordMap);
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
      sync_records: []
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
      this.logger && this.logger(`READ`, 'NotionUser', user_id);
      return new NotionUser({ ...common_props, user_id: user_id, id: user_id, space_id: "0", shard_id: 0, defaultExecutionState: this.defaultExecutionState })
    });
  }
}

export default Nishan;
export * from "./api";
export * from "./types";
export * from "@nishans/types";