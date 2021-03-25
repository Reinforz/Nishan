import { NotionConstants } from '@nishans/constants';
import { NotionCacheInitializerTracker } from '@nishans/types';

export function createDefaultCacheInitializeTracker () {
	const cache_init_tracker: NotionCacheInitializerTracker = {} as any;
	NotionConstants.dataTypes().forEach((data_type) => (cache_init_tracker[data_type] = new Map()));
	return cache_init_tracker;
}
