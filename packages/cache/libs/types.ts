import { NotionRequestConfigs } from '@nishans/endpoints';
import { ICollection, INotionUser, ISpace, ISpaceView, IUserRoot, IUserSettings, TBlock, TView } from '@nishans/types';
export interface ICache {
	block: Map<string, TBlock>;
	collection: Map<string, ICollection>;
	collection_view: Map<string, TView>;
	space: Map<string, ISpace>;
	notion_user: Map<string, INotionUser>;
	space_view: Map<string, ISpaceView>;
	user_root: Map<string, IUserRoot>;
	user_settings: Map<string, IUserSettings>;
}
export interface NotionCacheConfigs extends NotionRequestConfigs {
	cache: ICache;
}
