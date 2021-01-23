import { RecordMap, SyncRecordValues, TDataType } from '@nishans/types';
import { getSpaces, syncRecordValues } from '../src';
import { Configs, CtorArgs, ICache, UpdateCacheManuallyParam } from './types';

export default class Cache {
	cache: ICache;
	token: string;
	interval: number;
	headers: {
		headers: {
			cookie: string;
			['x-notion-active-user-header']: string;
		};
	};
	user_id: string;

	constructor ({ cache, token, interval, user_id }: Omit<CtorArgs, 'shard_id' | 'space_id'>) {
		this.cache = cache || {
			block: new Map(),
			collection: new Map(),
			space: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		};
		this.token = token;
		this.interval = interval || 1000;
		this.headers = {
			headers: {
				cookie: `token_v2=${token};notion_user_id=${user_id};`,
				['x-notion-active-user-header']: user_id ?? ''
			}
		};
		this.user_id = user_id ?? '';
	}

	protected getConfigs = (): Configs => {
		return {
			token: this.token,
			user_id: this.user_id,
			interval: this.interval
		};
	};

	/**
   * Save the passed recordMap to cache
   * @param recordMap RecordMap map to save to cache
   */
	saveToCache (recordMap: Partial<RecordMap>) {
		(Object.keys(this.cache) as (keyof ICache)[]).forEach((key) => {
			if (recordMap[key])
				Object.entries(recordMap[key] || {}).forEach(([ record_id, record_value ]) => {
					this.cache[key].set(record_id, record_value.value);
				});
		});
	}

	returnNonCachedData (ids: UpdateCacheManuallyParam): UpdateCacheManuallyParam {
		return ids.filter(
			(info) => !Boolean(Array.isArray(info) ? this.cache[info[1]].get(info[0]) : this.cache.block.get(info))
		);
  }
  
  async initializeCache(){
    const data = await getSpaces({token: this.token}); 
    const external_notion_users: Set<string> = new Set();
    Object.values(data).forEach(recordMap => {
      Object.values(recordMap.space).forEach(space => space.value.permissions.forEach(permission =>
        permission.user_id && external_notion_users.add(permission.user_id)
      ))
      this.saveToCache(recordMap)
    });

    const { recordMap } = await syncRecordValues({
      requests: Array.from(external_notion_users.values()).map(external_notion_user => ({ table: "notion_user", id: external_notion_user, version: -1 }))
    }, {token: this.token});
    this.saveToCache(recordMap);
  }

	async updateCacheManually (arg: UpdateCacheManuallyParam | string) {
		const sync_record_values: SyncRecordValues[] = [];
		if (Array.isArray(arg))
			arg.forEach((arg: string | [string, TDataType]) => {
				if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
				else if (typeof arg === 'string') sync_record_values.push({ id: arg, table: 'block', version: 0 });
			});
    else if (typeof arg === 'string') sync_record_values.push({ id: arg, table: 'block', version: 0 });
    if (sync_record_values.length){
      const data = await syncRecordValues({ requests: sync_record_values }, this.getConfigs());
      this.saveToCache(data.recordMap);
    }
	}

	async updateCacheIfNotPresent (arg: UpdateCacheManuallyParam) {
		const sync_record_values: SyncRecordValues[] = [];
		arg.forEach((arg: string | [string, TDataType]) => {
			if (Array.isArray(arg) && !this.cache[arg[1]].get(arg[0]))
				sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
			else if (typeof arg === 'string' && !this.cache.block.get(arg))
				sync_record_values.push({ id: arg, table: 'block', version: 0 });
		});
		if (sync_record_values.length) {
      const data = await syncRecordValues({ requests: sync_record_values }, this.getConfigs());
      this.saveToCache(data.recordMap);
    }
	}
}
