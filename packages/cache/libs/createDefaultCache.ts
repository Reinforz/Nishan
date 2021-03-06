import { ICache } from './';

export function createDefaultCache () {
	return {
		block: new Map(),
		collection: new Map(),
		collection_view: new Map(),
		notion_user: new Map(),
		space: new Map(),
		space_view: new Map(),
		user_root: new Map(),
		user_settings: new Map()
	} as ICache;
}
