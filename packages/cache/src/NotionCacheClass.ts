import { NotionRequestConfigs, UpdateCacheManuallyParam } from '@nishans/endpoints';
import { RecordMap, TDataType } from '@nishans/types';
import { NotionCacheObject } from '../src';
import { CtorArgs, ICache } from './types';

export class NotionCacheClass {
	cache: ICache;
	token: string;
	interval: number;
	user_id?: string;

	constructor ({ cache, token, interval, user_id }: Omit<CtorArgs, 'shard_id' | 'space_id'>) {
    // Validate the cache first if its passed, otherwise store a default one
		this.cache = (cache && NotionCacheObject.validateCache(cache)) || NotionCacheObject.createDefaultCache();
    if(!token)
      throw new Error(`Token not provided`);
		this.token = token;
		this.interval = interval ?? 500;
		this.user_id = user_id ?? '';
	}

  /**
   * Get the internal configs passed to the constructor
   */
	getConfigs = (): NotionRequestConfigs => {
		return {
			token: this.token,
			user_id: this.user_id,
			interval: this.interval
		};
	};

/**
 * Save all the items of a recordMap in internal cache
 * @param recordMap The recordMap to save to cache
 */
	saveToCache (recordMap: Partial<RecordMap>) {
    NotionCacheObject.saveToCache(recordMap, this.cache);
	}

  /**
   * Returns the id and data_type tuple passed that is not present in the cache
   * @param update_cache_param Array of tuple of id and data_type to look for in the cache
   * @returns
   */
	returnNonCachedData (update_cache_param: UpdateCacheManuallyParam) {
    return NotionCacheObject.returnNonCachedData(update_cache_param, this.cache);
  }
  
  /**
   * Initialize the cache by sending a post request to the `getSpaces` endpoint 
   */
  async initializeNotionCache(){
    await NotionCacheObject.initializeNotionCache(this.getConfigs(), this.cache);
  }

  /**
   * Fetches data from notions server and store within the cache
   * @param args The array of id and data_type tuple to fetch and store
   */
	async updateCacheManually (args: UpdateCacheManuallyParam) {
		await NotionCacheObject.updateCacheManually(args, this.getConfigs(), this.cache);
	}

  /**
   * Fetches notion data only if it doesnt exist in the cache
   * @param arg Array of id and data_type tuple to fetch from notion and store
   */
	async updateCacheIfNotPresent (args: UpdateCacheManuallyParam) {
		await NotionCacheObject.updateCacheIfNotPresent(args, this.getConfigs(), this.cache);
  }
  
  /**
   * Initialize cache of specific type of data
   * @param id The id of the data
   * @param type The type of data
   */
  async initializeCacheForSpecificData(id: string, type: TDataType){
		await NotionCacheObject.initializeCacheForSpecificData(id, type, this.getConfigs(), this.cache);
  }

  async fetchDataOrReturnCached(table: TDataType, id: string){
		return await NotionCacheObject.fetchDataOrReturnCached(table, id, this.getConfigs(), this.cache,);
  }
}
