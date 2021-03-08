import { INotionCoreOptions } from '@nishans/core';
import { TDataType } from '@nishans/types';

export type NotionCacheInitializerTracker = Record<TDataType, Map<string, boolean>>;

export interface INotionGraphqlOptions extends INotionCoreOptions {
	cache_initializer_tracker: NotionCacheInitializerTracker;
}
