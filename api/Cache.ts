import { Cache as ICache, RecordMap } from "../types";

export default class Cache {
  cache: ICache;

  constructor(cache?: ICache) {
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

  /**
   * Save the passed recordMap to cache
   * @param recordMap RecordMap map to save to cache
   */
  saveToCache(recordMap: Partial<RecordMap>) {
    type keys = keyof ICache;
    (Object.keys(this.cache) as keys[]).forEach((key) => {
      if (recordMap[key])
        Object.entries(recordMap[key] || {}).forEach(([record_id, record_value]) => {
          this.cache[key].set(record_id, record_value.value);
        });
    });
  }
}