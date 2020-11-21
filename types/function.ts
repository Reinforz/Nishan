import { INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, PageFormat, PageProps, TBlockInput, TBlockType, IDate, IDateRange, IDateTime, IDateTimeRange, TViewAggregationsAggregators, TViewType, TSchemaUnitType, TDataType, TViewFiltersOperator, TViewFiltersType, TViewFiltersValue } from "./";
import { TSchemaUnit } from "./schema";

export type UserViewFilterParams = [string, string, string, string]
export interface UserViewArg {
  id?: string,
  sorts?: [string, number][],
  aggregations?: [string, TViewAggregationsAggregators][],
  filters?: UserViewFilterParams[],
  properties?: [string, boolean, number][],
  name: string,
  type: TViewType,
  wrap?: boolean
}

export interface TableViewCreateParams {
  cb: (T: TSchemaUnit & { key: string }) => {
    sorts?: [("ascending" | "descending"), number],
    aggregations?: [TViewAggregationsAggregators, number],
    filters?: [TViewFiltersOperator, TViewFiltersType, TViewFiltersValue, number][],
    properties?: [boolean, number, number]
  } | undefined,
  wrap: boolean,
  name: string,
  position: RepositionParams
}

export interface CreateRootCollectionViewPageParams extends CreateRootPageArgs {
  views?: UserViewArg[],
  schema?: ([string, TSchemaUnitType] | [string, TSchemaUnitType, Record<string, any>])[]
}

export interface CreateBlockArg {
  parent_table?: "block" | "collection" | "space", $block_id: string, type: TBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export type RepositionParams = {
  id: string,
  position: "before" | "after"
} | number | undefined;

export interface CreateRootPageArgs {
  properties: Partial<PageProps>; format: Partial<PageFormat>; isPrivate?: boolean, position?: RepositionParams
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
  position?: RepositionParams
}

export type CreateTRootPagesParams = ({
  type: "page",
} & CreateRootPageArgs | {
  type: "collection_view_page"
} & CreateRootCollectionViewPageParams)

export type Predicate<T> = (T: T, index: number) => Promise<boolean>;
export type FilterTypes<T> = undefined | string[] | Predicate<T>
export type FilterType<T> = undefined | string | Predicate<T>
