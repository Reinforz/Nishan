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
import { SpaceShardProps } from './block';
import { TTextFormat } from './inlineformat';
import { TData } from './types';

interface Data<T extends TData> {
	[key: string]: {
		role: TPermissionRole;
		value: T;
	};
}

export type BlockData = Data<TBlock>;
export type SpaceData = Data<ISpace>;
export type SpaceViewData = Data<ISpaceView>;
export type CollectionData = Data<ICollection>;
export type ViewData = Data<TView>;
export type NotionUserData = Data<INotionUser>;
export type UserRootData = Data<IUserRoot>;
export type UserSettingsData = Data<IUserSettings>;

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

export interface IComment extends NotionNode, SpaceShardProps, CreatedProps, LastEditedProps {
	text: TTextFormat;
	parent_id: string;
	parent_table: 'collection';
}

export interface IDiscussion extends SpaceShardProps, ParentProps {
	text: TTextFormat;
	id: string;
	version: number;
	resolved: boolean;
	context: [[string]];
	comments: string[];
	parent_table: 'block';
}

export interface RecordMap {
	block: BlockData;
	collection: CollectionData;
	collection_view: ViewData;
	space: SpaceData;
	notion_user: NotionUserData;
	space_view: SpaceViewData;
	user_root: UserRootData;
	user_settings: UserSettingsData;
}
