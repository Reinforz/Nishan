import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ICache } from '@nishans/types';
export interface INotionCacheOptions extends INotionEndpointsOptions {
	cache: ICache;
}
