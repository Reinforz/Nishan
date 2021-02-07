import { ICollection, ISpace, ISpaceView, IUserRoot, RecordMap, SyncRecordValues, TBlock, TDataType } from '@nishans/types';
import { validateCache, constructNotionHeaders } from '../utils';
import { getSpaces, queryCollection, syncRecordValues } from '../src';
import { Configs, CtorArgs, ICache, NotionHeaders, UpdateCacheManuallyParam } from './types';

export default class Cache {
	cache: ICache;
	token: string;
	interval: number;
	headers: NotionHeaders;
	user_id: string;

	constructor ({ cache, token, interval, user_id }: Omit<CtorArgs, 'shard_id' | 'space_id'>) {
    // Validate the cache first if its passed, otherwise store a default one
		this.cache = (cache && validateCache(cache)) || {
			block: new Map(),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		};
		this.headers = constructNotionHeaders({token, user_id});
		this.token = token;
		this.interval = interval ?? 500;
		this.user_id = this.headers.headers["x-notion-active-user-header"];
	}

  /**
   * Get the internal configs passed to the constructor
   */
	getConfigs = (): Configs => {
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
    // Loop through each of the cache keys
    // Store all the values of that particular key thats present in the recordMap in the cache 
		([
      "block",
      "collection",
      "space",
      "collection_view",
      "notion_user",
      "space_view",
      "user_root",
      "user_settings",
    ] as ((keyof ICache)[])).forEach((key) => {
			if (recordMap[key])
				Object.entries(recordMap[key] as Record<any, any>).forEach(([ record_id, record_value ]) => {
					this.cache[key].set(record_id, record_value.value);
				});
		});
	}

  /**
   * Returns the id and data_type tuple passed that is not present in the cache
   * @param update_cache_param Array of tuple of id and data_type to look for in the cache
   * @returns
   */
	returnNonCachedData (update_cache_param: UpdateCacheManuallyParam): UpdateCacheManuallyParam {
		return update_cache_param.filter(
			(info) => !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
		);
  }
  
  /**
   * Initialize the cache by sending a post request to the `getSpaces` endpoint 
   */
  async initializeCache(){
    const data = await getSpaces({token: this.token, interval: 0});
    // Contains a set of external notion user that has access to the space 
    const external_notion_users: Set<string> = new Set();

    // Going through each recordMap and storing them in cache
    Object.values(data).forEach(recordMap => {
      // Getting the user_root id
      const user_root_id = Object.keys(recordMap.user_root)[0];
      // In the space's permission check if external user has any access to the space, 
      // if it does and its not the user_root it needs to be added to the set created earlier 
      Object.values(recordMap.space).forEach(space => space.value.permissions.forEach(permission =>
        permission.user_id && permission.user_id !== user_root_id && external_notion_users.add(permission.user_id)
      ))
      this.saveToCache(recordMap)
    });

    // If the number of external_notion_users in not zero continue
    if(external_notion_users.size !== 0){
      // Send a api request to syncRecordValues endpoint to fetch the external notion users
      const { recordMap } = await syncRecordValues({
        requests: Array.from(external_notion_users.values()).map(external_notion_user => ({ table: "notion_user", id: external_notion_user, version: -1 }))
      }, {token: this.token, interval: 0});
      // Save the fetched external notion user to cache
      this.saveToCache(recordMap);
    }
  }

  /**
   * Fetches data from notions server and store within the cache
   * @param args The array of id and data_type tuple to fetch and store
   */
	async updateCacheManually (args: UpdateCacheManuallyParam | string) {
		const sync_record_values: SyncRecordValues[] = [];
		if (Array.isArray(args)){
      // Iterate through the passed array argument and construct sync_record argument
      args.forEach((arg: string | [string, TDataType]) => {
				if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
				else if (typeof arg === 'string')
          sync_record_values.push({ id: arg, table: 'block', version: 0 })
        else
          throw new Error(`Unsupported argument passed`)
			});
    }
    else if (typeof args === 'string') sync_record_values.push({ id: args, table: 'block', version: 0 });
    else
      throw new Error(`Unsupported argument passed`);

    // fetch and save notion data to cache
    if (sync_record_values.length){
      const {recordMap} = await syncRecordValues({ requests: sync_record_values }, {token: this.token, interval: 0});
      this.saveToCache(recordMap);
    }
	}

  /**
   * Fetches notion data only if it doesnt exist in the cache
   * @param arg Array of id and data_type tuple to fetch from notion and store
   */
	async updateCacheIfNotPresent (arg: UpdateCacheManuallyParam) {
		const sync_record_values: SyncRecordValues[] = [];
		arg.forEach((arg: string | [string, TDataType]) => {
      // Checks to see if the data requests exists in the internal cache or not
			if (Array.isArray(arg) && !this.cache[arg[1]].get(arg[0]))
				sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
			else if (typeof arg === 'string' && !this.cache.block.get(arg))
				sync_record_values.push({ id: arg, table: 'block', version: 0 });
		});
		if (sync_record_values.length) {
      const data = await syncRecordValues({ requests: sync_record_values }, {token: this.token, interval: 0});
      this.saveToCache(data.recordMap);
    }
  }
  
  /**
   * Initialize cache of specific type of data
   * @param id The id of the data
   * @param type The type of data
   */
  async initializeCacheForSpecificData(id: string, type: TDataType){
    const container: UpdateCacheManuallyParam = [];
    if (type === "block") {
      const data = this.cache[type].get(id) as TBlock;
      // If the type is block and page, fetch its content
      if (data.type === "page")
        container.push(...data.content);
      // If the type is block and cvp or cv, fetch its views and collection
      if (data.type === "collection_view" || data.type === "collection_view_page") {
        data.view_ids.map((view_id) => container.push([view_id, "collection_view"]))
        container.push([data.collection_id, "collection"])
      }
    } else if (type === "space") {
      // If the type is space, fetch its pages and notion_user
      const data = this.cache[type].get(id) as ISpace;
      container.push(...data.pages);
      data.permissions.forEach((permission) => container.push([permission.user_id, "notion_user"]))
    } else if (type === "user_root"){
      // If the type is user_root, fetch its space_view
      const data = this.cache[type].get(id) as IUserRoot;
      data.space_views.map((space_view => container.push([space_view, "space_view"])))
    }
    else if (type === "collection") {
      // If the type is collection, fetch its template_pages and all of its row_pages
      const data = this.cache[type].get(id) as ICollection;
      if((data as ICollection).template_pages)
        container.push(...data.template_pages as string[])
      // Fetching the row_pages of collection
      const {recordMap} = await queryCollection({
        collectionId: id,
        collectionViewId: "",
        query: {},
        loader: {
          type: "table",
          loadContentCover: true
        }
      }, {
        token: this.token,
        interval: 0
      })
      this.saveToCache(recordMap);
    }
    else if (type === "space_view"){
      // If the type is space_view, fetch its bookmarked_pages
      const data = this.cache[type].get(id) as ISpaceView;
      if(data.bookmarked_pages)
        container.push(...data.bookmarked_pages)
    }
    else
      throw new Error(`${type} data is not supported`);

    // Filters data that doesnt exist in the cache
    const non_cached = this.returnNonCachedData(container);
    
    await this.updateCacheManually(non_cached);

    // If the block is a page, for all the collection block contents, fetch the collection attached with it as well
    if(type === "block"){
      const data = this.cache[type].get(id) as TBlock;
      if(data.type === "page"){
        const collection_blocks_ids: UpdateCacheManuallyParam = [];
        for (let index = 0; index < data.content.length; index++) {
          // since the contents of the page has been fetched and stored in the cached it exists in the cache
          const content_id = data.content[index],
            content = this.cache.block.get(content_id)
          if(content && (content.type === "collection_view_page" || content.type === "collection_view"))
            collection_blocks_ids.push([content.collection_id, "collection"])
        }
        await this.updateCacheManually(this.returnNonCachedData(collection_blocks_ids));
      }
    }
  }
}
