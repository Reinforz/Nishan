import { INotionEndpointsOptions } from '@nishans/endpoints';
import { INotionCache, NotionCacheInitializerTracker } from '@nishans/types';
export interface INotionCacheOptions extends INotionEndpointsOptions {
	cache: INotionCache;
	cache_init_tracker: NotionCacheInitializerTracker;
}
