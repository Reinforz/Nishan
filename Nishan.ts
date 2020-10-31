
import axios from "axios";

import NotionUser from "./api/NotionUser";
import { NishanArg, Predicate } from "./types/types";
import { error } from "./utils/logs";
import Cache from "./api/Cache";
import { GetSpacesResult, INotionUser, ISpace } from './types/api';

class Nishan extends Cache {
  token: string;
  interval: number;
  init_cache: boolean;

  constructor(arg: Pick<NishanArg, "token" | "interval" | "cache">) {
    super(arg.cache);
    this.token = arg.token;
    this.interval = arg.interval;
    this.init_cache = false;
  }

  async initializeCache() {
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
      Object.values(data).forEach(data => this.saveToCache(data));
      this.init_cache = true;
    } catch (err) {
      throw new Error(error(err.response.data))
    }
  }

  async getUser(arg: string | Predicate<INotionUser>) {
    return (await this.getUsers(typeof arg === "string" ? [arg] : arg, false))[0];
  }

  async getUsers(arg: string[] | Predicate<INotionUser>, multiple: boolean = true) {
    if (!this.init_cache) {
      await this.initializeCache();
      this.init_cache = true;
    }
    const users: NotionUser[] = [], is_arg_array = Array.isArray(arg), is_arg_function = typeof arg === "function";
    let index = 0;
    for (const [, user] of this.cache.notion_user) {
      let should_add = false;
      if (is_arg_array && (arg as string[]).includes(user.id)) should_add = true;
      else if (is_arg_function) should_add = await (arg as Predicate<INotionUser>)(user, index);
      index++
      if (should_add) {
        let space: ISpace | null = null;
        for (let value of this.cache.space.values())
          if (value.permissions.find((perm => perm.user_id === user.id))) space = value;
        if (space)
          users.push(new NotionUser({
            id: user.id,
            type: "notion_user",
            space_id: space.id,
            shard_id: space.shard_id,
            token: this.token,
            user_id: user.id,
            cache: this.cache,
            interval: this.interval
          }));
      }
      if (!multiple && users.length === 1) break;
    }
    return users;
  }
}

export default Nishan;
export * from "./utils/inlineBlocks";