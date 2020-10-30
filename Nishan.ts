
import axios from "axios";

import { NishanArg, Predicate } from "./types/types";
import { error } from "./utils/logs";
import Space from "./api/Space";
import Cache from "./api/Cache";
import { GetSpacesResult, ISpace } from './types/api';

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
    setTimeout(async () => {
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
    }, this.interval)
  }

  /**
   * Get a space that is available on the user's account
   * @param arg A predicate filter function or a string
   * @returns The obtained Space object
   */
  async getSpace(arg: Predicate<ISpace> | string) {
    return (await this.getSpaces(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  /**
   * Get multiple space objects on the user's account as an array
   * @param arg empty or A predicate function or a string array of ids
   * @returns An array of space objects
   */
  async getSpaces(arg: undefined | Predicate<ISpace> | string[], multiple: boolean = true) {
    if (!this.init_cache) await this.initializeCache();

    const target_spaces: Space[] = [];
    let i = 0;

    for (const [, space] of this.cache.space) {
      let should_add = false;
      if (arg === undefined)
        should_add = true;
      else if (Array.isArray(arg) && arg.includes(space.id))
        should_add = true;
      else if (typeof arg === "function")
        should_add = await arg(space, i);

      if (should_add) {
        target_spaces.push(new Space({
          type: "space",
          id: space.id,
          interval: this.interval,
          token: this.token,
          cache: this.cache,
          user_id: space.permissions[0].user_id,
          shard_id: space.shard_id,
          space_id: space.id
        }))
      }

      if (!multiple && target_spaces.length === 1) break;
      i++;
    }
    return target_spaces;
  }
}

export default Nishan;
export * from "./utils/inlineBlocks";