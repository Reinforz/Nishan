import { TBlockCreateInput } from "@nishans/fabricator";
import { ElementType, ICollection, INotionUser, ISpace, ISpaceView, IUserRoot, IUserSettingsSettings } from "@nishans/types";

export const TSpaceUpdateKeys = ["name", "icon", "disable_public_access", "disable_guests", "disable_move_to_space", "disable_export", "domain", "invite_link_enabled", "beta_enabled"] as const;
export const TCollectionUpdateKeys = ["name", "icon", "description"] as const;
export const TNotionUserUpdateKeys = ['family_name', 'given_name', 'profile_photo'] as const;
export const TSpaceViewUpdateKeys = ['notify_desktop', 'notify_email', 'notify_mobile', 'joined', 'created_getting_started'] as const;
export const TUserSettingsUpdateKeys = ['start_day_of_week', 'time_zone', 'locale', 'preferred_locale', 'preferred_locale_origin'] as const;
export const TUserRootUpdateKeys = ['space_views'] as const;

export type IUserRootUpdateInput = Partial<Pick<IUserRoot, ElementType<typeof TUserRootUpdateKeys>>>;

export type ISpaceUpdateInput = Partial<Pick<ISpace, ElementType<typeof TSpaceUpdateKeys>>>;
export type ISpaceCreateInput = Partial<Pick<ISpace, Exclude<ElementType<typeof TSpaceUpdateKeys>, "name" | "domain">>> & {name: string, contents: TBlockCreateInput[]};

export type ICollectionUpdateInput = Partial<Pick<ICollection, ElementType<typeof TCollectionUpdateKeys>>>;

export type INotionUserUpdateInput = Partial<Pick<INotionUser, ElementType<typeof TNotionUserUpdateKeys>>>;

export type ISpaceViewUpdateInput = Partial<Pick<ISpaceView, ElementType<typeof TSpaceViewUpdateKeys>>>;

export type IUserSettingsUpdateInput = Partial<Pick<IUserSettingsSettings, ElementType<typeof TUserSettingsUpdateKeys>>>;