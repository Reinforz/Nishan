import {
	CreatedProps,
	ICollection,
	ISpacePermission,
	IUserPermission,
	LastEditedProps,
	NotionNode,
	ParentProps,
	TBlock,
	TLocale,
	TPermissionRole,
	TPlanType,
	TView
} from './';
import { IActivityData } from './activity';
import { SpaceShardProps } from './block';
import { TTextFormat } from './inlineformat';
import { INotificationData } from './notifications';

export interface INotionData<T> {
	[key: string]: {
		role: TPermissionRole;
		value: T;
	};
}

export type IBlockData = INotionData<TBlock>;
export type ISpaceData = INotionData<ISpace>;
export type ISpaceViewData = INotionData<ISpaceView>;
export type ICollectionData = INotionData<ICollection>;
export type IViewData = INotionData<TView>;
export type INotionUserData = INotionData<INotionUser>;
export type IUserRootData = INotionData<IUserRoot>;
export type IUserSettingsData = INotionData<IUserSettings>;

export interface ISpace extends CreatedProps, LastEditedProps {
	beta_enabled: boolean;
	icon?: string;
	id: string;
	invite_link_code: string;
	invite_link_enabled: boolean;
	name: string;
	pages: string[];
	permissions: (ISpacePermission | IUserPermission)[];
	plan_type: TPlanType;
	shard_id: number;
	version: number;
	disable_public_access?: boolean;
	disable_guests?: boolean;
	disable_move_to_space?: boolean;
	disable_export?: boolean;
	domain?: string;
}

export interface ISpaceView extends NotionNode {
	created_getting_started: boolean;
	created_onboarding_templates?: boolean;
	joined: boolean;
	notify_desktop: boolean;
	notify_email: boolean;
	notify_mobile: boolean;
	sidebar_hidden_templates?: string[];
	space_id: string;
	visited_templates?: string[];
	bookmarked_pages?: string[];
	parent_table: 'user_root';
	parent_id: string;
}

export interface INotionUser {
	email: string;
	family_name: string;
	given_name: string;
	id: string;
	onboarding_completed: boolean;
	profile_photo: string;
	version: number;
}

export interface IUserRoot {
	id: string;
	space_views: string[];
	version: number;
	left_spaces?: string[];
}

export interface IUserSettings {
	id: string;
	version: number;
	settings: IUserSettingsSettings;
	time_zone?: string;
	locale?: TLocale;
	preferred_locale?: TLocale;
	preferred_locale_origin?: string;
	start_day_of_week?: number;
}

export type TPersona = 'personal' | 'student';
export type TPreferredLocaleOrigin = 'autodetect' | 'legacy';
export interface IUserSettingsSettings {
	locale: TLocale;
	persona: TPersona;
	preferred_locale: TLocale;
	preferred_locale_origin: TPreferredLocaleOrigin;
	signup_time: number;
	start_day_of_week?: number;
	time_zone: string;
	type: 'personal';
	used_desktop_web_app: boolean;
}

export interface ISlackIntegration {
	channel: string;
	channel_id: string;
	configuration_url: string;
	enabled: boolean;
	id: string;
	parent_id: string;
	parent_table: 'block';
	team_name: string;
	version: number;
	webhook_url: string;
}

export type ISlackIntegrationData = INotionData<ISlackIntegration>;

export interface IPageVisits {
	id: string;
	parent_id: string;
	parent_table: 'block';
	shard_id: number;
	space_id: string;
	user_id: string;
	version: number;
	visited_at: number;
}

export type IPageVisitsData = INotionData<IPageVisits>;

export interface IFollow {
	created_time: number;
	following: boolean;
	id: string;
	navigable_block_id: string;
	user_id: string;
	version: number;
}

export type IFollowData = INotionData<IFollow>;

export interface IComment extends NotionNode, SpaceShardProps, CreatedProps, LastEditedProps {
	text: TTextFormat;
	parent_id: string;
	parent_table: 'collection';
}

export type ICommentData = INotionData<IComment>;

export interface IDiscussion extends SpaceShardProps, ParentProps {
	text: TTextFormat;
	id: string;
	version: number;
	resolved: boolean;
	context: [[string]];
	comments: string[];
	parent_table: 'block';
}

export type IDiscussionData = INotionData<IDiscussion>;

export interface RecordMap {
	block: IBlockData;
	collection: ICollectionData;
	collection_view: IViewData;
	space: ISpaceData;
	notion_user: INotionUserData;
	space_view: ISpaceViewData;
	user_root: IUserRootData;
	user_settings: IUserSettingsData;
	discussion: IDiscussionData;
	comment: ICommentData;
	follow: IFollowData;
	slack_integration: ISlackIntegrationData;
	page_visits: IPageVisitsData;
	activity: IActivityData;
	notification: INotificationData;
}
