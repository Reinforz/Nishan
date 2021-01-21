import {
	IUserPermission,
	ISpacePermission,
	ICollectionView,
	ICollectionViewPage,
	TBlock,
	ICollection,
	TPlanType,
	Node,
	IBoardView,
	ICalendarView,
	IGalleryView,
	IListView,
	ITableView,
	CreateProps,
	LastEditedProps,
	TLocale,
	TPermissionRole
} from './';

export interface CollectionViewData {
	[key: string]: {
		role: TPermissionRole;
		value: ICollectionView;
	};
}

export interface CollectionViewPageData {
	[key: string]: {
		role: TPermissionRole;
		value: ICollectionViewPage;
	};
}

export interface BlockData {
	[key: string]: {
		role: TPermissionRole;
		value: TBlock;
	};
}

export interface SpaceData {
	[key: string]: {
		role: TPermissionRole;
		value: ISpace;
	};
}

export interface SpaceViewData {
	[key: string]: {
		role: TPermissionRole;
		value: ISpaceView;
	};
}

export interface CollectionData {
	[key: string]: {
		role: TPermissionRole;
		value: ICollection;
	};
}

export interface ViewData {
	[key: string]: {
		role: TPermissionRole;
		value: ITableView | IListView | IBoardView | ICalendarView | IGalleryView;
	};
}

export interface NotionUserData {
	[key: string]: {
		role: TPermissionRole;
		value: INotionUser;
	};
}

export interface UserRootData {
	[key: string]: {
		role: TPermissionRole;
		value: IUserRoot;
	};
}

export interface UserSettingsData {
	[key: string]: {
		role: TPermissionRole;
		value: IUserSettings;
	};
}

export interface ISpace extends CreateProps, LastEditedProps {
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

export interface ISpaceView extends Node {
	created_getting_started: boolean;
	created_onboarding_templates?: boolean;
	joined: boolean;
	notify_desktop: boolean;
	notify_email: boolean;
	notify_mobile: boolean;
	sidebar_hidden_templates?: string[];
	space_id: string;
	visited_templates?: string[];
	bookmarked_pages: string[];
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
