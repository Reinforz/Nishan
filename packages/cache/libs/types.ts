import { INotionEndpointsOptions } from '@nishans/endpoints';
import {
	ICollection,
	IComment,
	IDiscussion,
	IFollow,
	INotionUser,
	IPageVisits,
	ISlackIntegration,
	ISpace,
	ISpaceView,
	IUserRoot,
	IUserSettings,
	TActivity,
	TBlock,
	TView
} from '@nishans/types';
export interface ICache {
	block: Map<string, TBlock>;
	collection: Map<string, ICollection>;
	collection_view: Map<string, TView>;
	space: Map<string, ISpace>;
	notion_user: Map<string, INotionUser>;
	space_view: Map<string, ISpaceView>;
	user_root: Map<string, IUserRoot>;
	user_settings: Map<string, IUserSettings>;
	discussion: Map<string, IDiscussion>;
	comment: Map<string, IComment>;
	follow: Map<string, IFollow>;
	slack_integration: Map<string, ISlackIntegration>;
	page_visits: Map<string, IPageVisits>;
	activity: Map<string, TActivity>;
}
export interface INotionCacheOptions extends INotionEndpointsOptions {
	cache: ICache;
}
