import { INotionUser, ISpace, ISpaceView, IUserSettingsSettings } from "./api";
import { ICollection, PageFormat, PageProps, TBlockInput } from "./block";
import { TBlockType, IDate, IDateRange, IDateTime, IDateTimeRange, TViewAggregationsAggregators, TViewType, SchemaUnitType, TDataType } from "./types";

export interface UserViewArg {
  id?: string,
  sorts?: [string, number][],
  aggregations?: [string, TViewAggregationsAggregators][],
  filters?: [string, string, string, string][],
  properties?: [string, boolean, number][],
  name: string,
  type: TViewType,
  wrap?: boolean
}

export interface CreateRootCollectionViewPageParams extends CreateRootPageArgs {
  views?: UserViewArg[],
  schema?: ([string, SchemaUnitType] | [string, SchemaUnitType, Record<string, any>])[]
}

export interface CreateBlockArg {
  parent_table?: "block" | "collection" | "space", $block_id: string, type: TBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export interface BlockRepostionArg {
  id: string,
  position: "before" | "after"
}

export interface CreateRootPageArgs {
  properties: Partial<PageProps>; format: Partial<PageFormat>; isPrivate?: boolean, position?: number | BlockRepostionArg
}

export type UpdatableSpaceKeys = 'name' | 'beta_enabled' | 'icon';
export type SpaceUpdateParam = Partial<Pick<ISpace, UpdatableSpaceKeys>>;

export type UpdatableCollectionKeys = "name" | "icon" | "description";
export type UpdatableCollectionUpdateParam = Partial<Pick<ICollection, UpdatableCollectionKeys>>;

export type UpdatableNotionUserKeys = 'family_name' | 'given_name' | 'profile_photo';
export type UpdatableNotionUserParam = Partial<Pick<INotionUser, UpdatableNotionUserKeys>>;

export type UpdatableSpaceViewKeys = 'notify_desktop' | 'notify_email' | 'notify_mobile';
export type UpdatableSpaceViewParam = Partial<Pick<ISpaceView, UpdatableSpaceViewKeys>>;

export type UpdatableUserSettingsKeys = 'start_day_of_week' | 'time_zone' | 'locale' | 'preferred_locale' | 'preferred_locale_origin';
export type UpdatableUserSettingsParam = Partial<Pick<IUserSettingsSettings, UpdatableUserSettingsKeys>>;

export type UpdateCacheManuallyParam = (string | [string, TDataType])[]

export type PageCreateContentParam = TBlockInput & {
  position?: number | BlockRepostionArg
}

export type CreateTRootPagesParams = ({
  type: "page",
} & CreateRootPageArgs | {
  type: "collection_view_page"
} & CreateRootCollectionViewPageParams)