import { NotionCache } from '@nishans/cache';
import { INotionCoreOptions } from '@nishans/core';

export const creatDefaultNishanArg = () => {
	return {
		cache: NotionCache.createDefaultCache(),
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_root_1',
		logger: true,
		notion_operation_plugins: [],
		cache_init_tracker: NotionCache.createDefaultCacheInitializeTracker()
	} as INotionCoreOptions;
};
