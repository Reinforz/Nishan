import axios from "axios";

import { LoadUserContentResult, Space, Cache, RecordMap } from "../types";

class Nishan {
  token: string;
  interval: number;
  user_id: string;
  headers: {
    headers: {
      cookie: string
    }
  };
  cache: Cache;

  constructor({ token, interval, user_id, cache }: {
    token: string,
    interval: number,
    user_id: string,
    cache?: Cache
  }) {
    this.token = token;
    this.interval = interval || 1000;
    this.user_id = user_id;
    this.headers = {
      headers: {
        cookie: `token_v2=${token}`
      }
    };
    this.cache = cache || {
      block: new Map(),
      collection: new Map(),
      space: new Map(),
      collection_view: new Map(),
      notion_user: new Map(),
      space_view: new Map(),
      user_root: new Map(),
      user_settings: new Map(),
    }
  }

  async getSpace(fn: (space: Space) => boolean) {
    const { default: Space } = await import("./Space");

    const { data: { recordMap: { space } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };

    const target_space: Space = (Object.values(space).find((space) => fn(space.value))?.value || Object.values(space)[0].value);
    return new Space({ space_data: target_space, interval: this.interval, token: this.token, user_id: this.user_id });
  }

  async setRootUser() {
    const { data: { recordMap, recordMap: { user_root } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };
    this.saveToCache(recordMap)
    return new Nishan({
      user_id: Object.values(user_root)[0].value.id,
      interval: this.interval,
      token: this.token,
      cache: this.cache
    })
  }

  saveToCache(recordMap: RecordMap) {
    type keys = keyof Cache;
    (Object.keys(this.cache) as keys[]).forEach((key) => {
      if (recordMap[key])
        Object.entries(recordMap[key]).forEach(([record_id, record_value]) => {
          this.cache[key].set(record_id, record_value.value);
        });
    });
  }
}

export default Nishan;
