import axios from "axios";

import { warn } from "../utils/logs";
import { LoadUserContentResult, Space, Entity } from "../types";

class Nishan {
  token: string;
  interval: number;
  user_id: string;
  shard_id: number;
  space_id: string;
  headers: {
    headers: {
      cookie: string
    }
  };
  cache: Record<string, Map<string, any>>;

  constructor({ token, interval, user_id, shard_id, space_id }: {
    token: string,
    interval: number,
    user_id: string,
    shard_id: number,
    space_id: string,
  }) {
    this.token = token;
    this.interval = interval || 1000;
    this.user_id = user_id;
    this.shard_id = shard_id;
    this.space_id = space_id;
    this.headers = {
      headers: {
        cookie: `token_v2=${token}`
      }
    };
    this.cache = {
      block: new Map(),
      collection: new Map(),
      space: new Map(),
      collection_view: new Map()
    }
  }

  async getBlock(block_id: string) {
    const Block = require("./Block");
    const cache_data = this.cache.block.get(block_id);
    if (cache_data) return cache_data;
    const { data: { recordMap } } = await axios.post(
      'https://www.notion.so/api/v3/getBacklinksForBlock',
      { blockId: block_id },
      this.headers
    );
    this.saveToCache(recordMap);
    const target = recordMap.block[block_id];
    if (!target) {
      warn(`No block with the id ${block_id} exists`);
      return undefined;
    }
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(new Block({
          block_data: recordMap.block[block_id].value,
          token: this.token,
          interval: this.interval,
          user_id: this.user_id,
          shard_id: this.shard_id,
          space_id: this.space_id,
          headers: this.headers,
        }));
      }, this.interval)
    );
  }

  async getSpace(fn: (space: Space) => boolean) {
    const { data: { recordMap: { space } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      {
        headers: {
          cookie: `token_v2=${this.token};`
        }
      }
    ) as { data: LoadUserContentResult };
    let target_space = null;

    target_space = Object.values(space).find((space) => fn(space.value));
    target_space = (target_space || Object.values(space)[0].value) as Space;
    return target_space;
  }

  setSpace(space: Space) {
    Transaction.setStatic({
      shardId: space.shard_id,
      spaceId: space.id
    });
  }

  async getSetSpace(fn: (space: Space) => boolean) {
    const target_space = await this.getSpace(fn);
    this.setSpace(target_space);
  }

  async setRootUser() {
    const { data: { recordMap: { user_root } } } = await axios.post(
      'https://www.notion.so/api/v3/loadUserContent',
      {},
      this.headers
    ) as { data: LoadUserContentResult };
    this.user_id = Object.values(user_root)[0].value.id;
  }

  saveToCache(recordMap: Record<string, Entity>) {
    Object.keys(this.cache).forEach((key) => {
      if (recordMap[key])
        Object.entries(recordMap[key]).forEach(([record_id, record_value]) => {
          this.cache[key].set(record_id, record_value.value);
        });
    });
  }
}

export default Nishan;
