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
import { IActivityRecordMap } from './activity';
import { SpaceProps } from './block';
import { TTextFormat } from './inlineformat';
import { INotificationRecordMap } from './notifications';

export interface INotionRecordMap<T> {
  [key: string]: {
    role: TPermissionRole;
    value: T;
  };
}

export type IBlockRecordMap = INotionRecordMap<TBlock>;
export type ISpaceRecordMap = INotionRecordMap<ISpace>;
export type ISpaceViewRecordMap = INotionRecordMap<ISpaceView>;
export type ICollectionRecordMap = INotionRecordMap<ICollection>;
export type IViewRecordMap = INotionRecordMap<TView>;
export type INotionUserRecordMap = INotionRecordMap<INotionUser>;
export type IUserRootRecordMap = INotionRecordMap<IUserRoot>;
export type IUserSettingsRecordMap = INotionRecordMap<IUserSettings>;

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
  mobile_onboarding_completed: boolean;
  name: string;
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

export type ISlackIntegrationRecordMap = INotionRecordMap<ISlackIntegration>;

export interface IPageVisits {
  id: string;
  parent_id: string;
  parent_table: 'block';
  space_id: string;
  user_id: string;
  version: number;
  visited_at: number;
}

export type IPageVisitsRecordMap = INotionRecordMap<IPageVisits>;

export interface IFollow {
  created_time: number;
  following: boolean;
  id: string;
  navigable_block_id: string;
  user_id: string;
  version: number;
}

export type IFollowRecordMap = INotionRecordMap<IFollow>;

export interface IComment
  extends NotionNode,
    SpaceProps,
    CreatedProps,
    LastEditedProps {
  text: TTextFormat;
  parent_id: string;
  parent_table: 'discussion';
}

export type ICommentRecordMap = INotionRecordMap<IComment>;

export interface IDiscussion
  extends SpaceProps,
    ParentProps,
    CreatedProps,
    LastEditedProps {
  id: string;
  version: number;
  resolved: boolean;
  context?: [[string]];
  comments: string[];
  parent_table: 'block';
}

export type IDiscussionRecordMap = INotionRecordMap<IDiscussion>;

export interface RecordMap {
  block: IBlockRecordMap;
  collection: ICollectionRecordMap;
  collection_view: IViewRecordMap;
  space: ISpaceRecordMap;
  notion_user: INotionUserRecordMap;
  space_view: ISpaceViewRecordMap;
  user_root: IUserRootRecordMap;
  user_settings: IUserSettingsRecordMap;
  discussion: IDiscussionRecordMap;
  comment: ICommentRecordMap;
  follow: IFollowRecordMap;
  slack_integration: ISlackIntegrationRecordMap;
  page_visits: IPageVisitsRecordMap;
  activity: IActivityRecordMap;
  notification: INotificationRecordMap;
}
