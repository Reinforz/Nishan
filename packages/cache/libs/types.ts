import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ICache, NotionCacheInitializerTracker } from '@nishans/types';
export interface INotionCacheOptions extends INotionEndpointsOptions {
	cache: ICache;
	cache_init_tracker: NotionCacheInitializerTracker;
}
