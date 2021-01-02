import { CollectionBlock, CollectionViewPage, Page, SchemaUnit, TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView, Block, Collection } from "./api";

import { TViewGroupFilterOperator, IViewAggregationsAggregators, IBoardViewFormat, IGalleryViewFormat, ITimelineViewFormat, TSchemaUnitType, INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, IDate, IDateRange, IDateTime, IDateTimeRange, TViewType, TDataType, TTimelineViewTimelineby, TSortValue, ITableViewFormat, IViewFilterData, CheckboxSchemaUnit, CreatedBySchemaUnit, CreatedTimeSchemaUnit, DateSchemaUnit, EmailSchemaUnit, FileSchemaUnit, FormulaSchemaUnit, IAudio, IBreadcrumb, IBulletedList, ICallout, ICode, ICodepen, IColumn, IColumnList, IDivider, IDrive, IEmbed, IEquation, IFactory, IFigma, IFile, IGist, IHeader, IImage, IMaps, INumberedList, IQuote, ISubHeader, IText, ITOC, ITodo, IToggle, ITweet, IVideo, IWebBookmark, LastEditedBySchemaUnit, LastEditedTimeSchemaUnit, MultiSelectSchemaUnit, NumberSchemaUnit, PersonSchemaUnit, PhoneNumberSchemaUnit, RelationSchemaUnit, RollupSchemaUnit, SelectSchemaUnit, TextSchemaUnit, TitleSchemaUnit, UrlSchemaUnit, IOperation, IUserRoot, IUserSettings, TBlock, TView, CodeFormat, CodeProps, FileFormat, FileProps, ICollectionViewPage, MediaFormat, MediaProps, PageFormat, PageProps, TFormatBlockColor, TodoProps, TSchemaUnit, WebBookmarkFormat, WebBookmarkProps, TBlockType } from "@nishan/types";

export interface ITPage {
  collection_view_page: CollectionViewPage[],
  page: Page[]
}

export interface ITSchemaUnit {
  text: SchemaUnit<TextSchemaUnit>[],
  number: SchemaUnit<NumberSchemaUnit>[],
  select: SchemaUnit<SelectSchemaUnit>[],
  multi_select: SchemaUnit<MultiSelectSchemaUnit>[],
  title: SchemaUnit<TitleSchemaUnit>[],
  date: SchemaUnit<DateSchemaUnit>[],
  person: SchemaUnit<PersonSchemaUnit>[],
  file: SchemaUnit<FileSchemaUnit>[],
  checkbox: SchemaUnit<CheckboxSchemaUnit>[],
  url: SchemaUnit<UrlSchemaUnit>[],
  email: SchemaUnit<EmailSchemaUnit>[],
  phone_number: SchemaUnit<PhoneNumberSchemaUnit>[],
  formula: SchemaUnit<FormulaSchemaUnit>[],
  relation: SchemaUnit<RelationSchemaUnit>[],
  rollup: SchemaUnit<RollupSchemaUnit>[],
  created_time: SchemaUnit<CreatedTimeSchemaUnit>[],
  created_by: SchemaUnit<CreatedBySchemaUnit>[],
  last_edited_time: SchemaUnit<LastEditedTimeSchemaUnit>[],
  last_edited_by: SchemaUnit<LastEditedBySchemaUnit>[],
}

export interface ITView {
  table: TableView[],
  gallery: GalleryView[],
  list: ListView[],
  board: BoardView[],
  timeline: TimelineView[],
  calendar: CalendarView[],
}

// ? TD:1:M Add link_to_page block tds
export interface ITBlock {
  link_to_page: Block<any, any>[],
  embed: Block<IEmbed, IEmbedInput>[],
  video: Block<IVideo, IVideoInput>[];
  audio: Block<IAudio, IAudioInput>[];
  image: Block<IImage, IImageInput>[];
  bookmark: Block<IWebBookmark, IWebBookmarkInput>[];
  code: Block<ICode, ICodeInput>[];
  file: Block<IFile, IFileInput>[];
  tweet: Block<ITweet, ITweetInput>[];
  gist: Block<IGist, IGistInput>[];
  codepen: Block<ICodepen, ICodepenInput>[];
  maps: Block<IMaps, IMapsInput>[];
  figma: Block<IFigma, IFigmaInput>[];
  drive: Block<IDrive, IDriveInput>[];
  text: Block<IText, ITextInput>[];
  table_of_contents: Block<ITOC, ITOCInput>[];
  equation: Block<IEquation, IEquationInput>[];
  breadcrumb: Block<IBreadcrumb, IBreadcrumbInput>[];
  factory: {
    block: Block<IFactory, IFactoryInput>,
    contents: ITBlock
  }[];
  page: Page[];
  to_do: Block<ITodo, ITodoInput>[];
  header: Block<IHeader, IHeaderInput>[];
  sub_header: Block<ISubHeader, ISubHeaderInput>[];
  sub_sub_header: Block<ISubHeader, ISubHeaderInput>[];
  bulleted_list: Block<IBulletedList, IBulletedListInput>[];
  numbered_list: Block<INumberedList, INumberedListInput>[];
  toggle: Block<IToggle, IToggleInput>[];
  quote: Block<IQuote, IQuoteInput>[];
  divider: Block<IDivider, IDividerInput>[];
  callout: Block<ICallout, ICalloutInput>[];
  collection_view: ITCollectionBlock[],
  collection_view_page: ITCollectionBlock[],
  linked_db: ITCollectionBlock[],
  column_list: Block<IColumnList, IColumnListInput>[],
  column: Block<IColumn, any>[]
}

export type ITCollectionBlock = {
  block: CollectionBlock,
  collection: Collection,
  views: ITView
}

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export type RepositionParams = {
  id: string,
  position: "before" | "after"
} | number | undefined;

export const TSpaceUpdateKeys = ["name", "icon", "disable_public_access", "disable_guests", "disable_move_to_space", "disable_export", "domain", "invite_link_enabled", "beta_enabled"] as const;
export const TCollectionUpdateKeys = ["name", "icon", "description"] as const;
export const TNotionUserUpdateKeys = ['family_name', 'given_name', 'profile_photo'] as const;
export const TSpaceViewUpdateKeys = ['notify_desktop', 'notify_email', 'notify_mobile', 'joined', 'created_getting_started'] as const;
export const TUserSettingsUpdateKeys = ['start_day_of_week', 'time_zone', 'locale', 'preferred_locale', 'preferred_locale_origin'] as const;

export type ISpaceUpdateInput = Partial<Pick<ISpace, ElementType<typeof TSpaceUpdateKeys>>>;

export type ICollectionUpdateInput = Partial<Pick<ICollection, ElementType<typeof TCollectionUpdateKeys>>>;

export type INotionUserUpdateInput = Partial<Pick<INotionUser, ElementType<typeof TNotionUserUpdateKeys>>>;

export type ISpaceViewUpdateInput = Partial<Pick<ISpaceView, ElementType<typeof TSpaceViewUpdateKeys>>>;

export type IUserSettingsUpdateInput = Partial<Pick<IUserSettingsSettings, ElementType<typeof TUserSettingsUpdateKeys>>>;

export type UpdateCacheManuallyParam = (string | [string, TDataType])[]

export type PageCreateContentParam = TBlockInput & {
  position?: RepositionParams
}

export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean | void | null | undefined;
export type FilterTypes<T> = undefined | string[] | Predicate<T>
export type FilterType<T> = undefined | string | Predicate<T>
export type UpdateTypes<T1, T2> = [string, T2][] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
export type UpdateType<T1, T2> = [string, T2] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);

export interface SearchManipViewParam {
  id?: string,
  type: TViewType,
  name: string,
  view: [ViewUpdateParam, ...ViewUpdateParam[]],
  position?: RepositionParams,
  filter_operator?: "or" | "and"
}

export interface TableSearchManipViewParam extends SearchManipViewParam, Partial<Omit<ITableViewFormat, "table_properties">> {
  type: "table",
}

export interface ListSearchManipViewParam extends SearchManipViewParam {
  type: "list"
}

export interface BoardSearchManipViewParam extends SearchManipViewParam, Partial<Omit<IBoardViewFormat, "board_properties">> {
  type: "board",
  group_by: string
}

export interface GallerySearchManipViewParam extends SearchManipViewParam, Partial<Omit<IGalleryViewFormat, "gallery_properties">> {
  type: "gallery",
}

export interface CalendarSearchManipViewParam extends SearchManipViewParam {
  type: "calendar",
  calendar_by: string
}

export interface TimelineSearchManipViewParam extends SearchManipViewParam, Partial<Omit<ITimelineViewFormat, "timeline_properties" | "timeline_table_properties">> {
  type: "timeline",
  timeline_by: TTimelineViewTimelineby
}

export type TSearchManipViewParam = TableSearchManipViewParam | ListSearchManipViewParam | BoardSearchManipViewParam | GallerySearchManipViewParam | CalendarSearchManipViewParam | TimelineSearchManipViewParam

export interface ViewFilterCreateInput<T extends TSchemaUnitType> {
  operator: IViewFilterData<T>["operator"],
  type: IViewFilterData<T>["type"],
  value: IViewFilterData<T>["value"],
  position?: number,
  filters?: ViewFilterCreateInputFilters<TSchemaUnitType>[],
  filter_operator?: TViewGroupFilterOperator
}

interface ViewFilterCreateInputFilters<T extends TSchemaUnitType> extends ViewFilterCreateInput<T> {
  schema_unit: T,
  property: string
}

interface ViewUpdateGenericParam<T extends TSchemaUnitType> {
  name: string,
  type: T,
  sort?: TSortValue | [TSortValue, number],
  format?: boolean | number | [boolean, number],
  filters?: ViewFilterCreateInput<T>[],
  filter_operator?: TViewGroupFilterOperator,
  aggregation?: IViewFilterData<T>["aggregator"]
}

export type ViewUpdateParam =
  ViewUpdateGenericParam<"text"> |
  ViewUpdateGenericParam<"title"> |
  ViewUpdateGenericParam<"number"> |
  ViewUpdateGenericParam<"select"> |
  ViewUpdateGenericParam<"multi_select"> |
  ViewUpdateGenericParam<"date"> |
  ViewUpdateGenericParam<"person"> |
  ViewUpdateGenericParam<"file"> |
  ViewUpdateGenericParam<"checkbox"> |
  ViewUpdateGenericParam<"url"> |
  ViewUpdateGenericParam<"email"> |
  ViewUpdateGenericParam<"phone_number"> |
  ViewUpdateGenericParam<"formula"> |
  ViewUpdateGenericParam<"relation"> |
  ViewUpdateGenericParam<"rollup"> |
  ViewUpdateGenericParam<"created_time"> |
  ViewUpdateGenericParam<"created_by"> |
  ViewUpdateGenericParam<"last_edited_time"> |
  ViewUpdateGenericParam<"last_edited_by">

interface ViewFilterCreateGenericParam<T extends TSchemaUnitType> {
  schema_type: T,
  operator: IViewFilterData<T>["operator"],
  type: IViewFilterData<T>["type"],
  value: IViewFilterData<T>["value"],
  position?: number,
  name: string
}

interface ViewAggregationsCreateGenericParam<T extends TSchemaUnitType> {
  schema_type: T,
  name: string,
  aggregator: IViewAggregationsAggregators[T]
}

export type UserViewAggregationsCreateParams =
  ViewAggregationsCreateGenericParam<"text"> |
  ViewAggregationsCreateGenericParam<"title"> |
  ViewAggregationsCreateGenericParam<"number"> |
  ViewAggregationsCreateGenericParam<"select"> |
  ViewAggregationsCreateGenericParam<"multi_select"> |
  ViewAggregationsCreateGenericParam<"date"> |
  ViewAggregationsCreateGenericParam<"person"> |
  ViewAggregationsCreateGenericParam<"file"> |
  ViewAggregationsCreateGenericParam<"checkbox"> |
  ViewAggregationsCreateGenericParam<"url"> |
  ViewAggregationsCreateGenericParam<"email"> |
  ViewAggregationsCreateGenericParam<"phone_number"> |
  ViewAggregationsCreateGenericParam<"formula"> |
  ViewAggregationsCreateGenericParam<"relation"> |
  ViewAggregationsCreateGenericParam<"rollup"> |
  ViewAggregationsCreateGenericParam<"created_time"> |
  ViewAggregationsCreateGenericParam<"created_by"> |
  ViewAggregationsCreateGenericParam<"last_edited_time"> |
  ViewAggregationsCreateGenericParam<"last_edited_by">


export type UserViewFilterCreateParams =
  ViewFilterCreateGenericParam<"text"> |
  ViewFilterCreateGenericParam<"title"> |
  ViewFilterCreateGenericParam<"number"> |
  ViewFilterCreateGenericParam<"select"> |
  ViewFilterCreateGenericParam<"multi_select"> |
  ViewFilterCreateGenericParam<"date"> |
  ViewFilterCreateGenericParam<"person"> |
  ViewFilterCreateGenericParam<"file"> |
  ViewFilterCreateGenericParam<"checkbox"> |
  ViewFilterCreateGenericParam<"url"> |
  ViewFilterCreateGenericParam<"email"> |
  ViewFilterCreateGenericParam<"phone_number"> |
  ViewFilterCreateGenericParam<"formula"> |
  ViewFilterCreateGenericParam<"relation"> |
  ViewFilterCreateGenericParam<"rollup"> |
  ViewFilterCreateGenericParam<"created_time"> |
  ViewFilterCreateGenericParam<"created_by"> |
  ViewFilterCreateGenericParam<"last_edited_time"> |
  ViewFilterCreateGenericParam<"last_edited_by">

export interface ICache {
  block: Map<string, TBlock>,
  collection: Map<string, ICollection>,
  collection_view: Map<string, TView>,
  space: Map<string, ISpace>,
  notion_user: Map<string, INotionUser>,
  space_view: Map<string, ISpaceView>,
  user_root: Map<string, IUserRoot>,
  user_settings: Map<string, IUserSettings>,
}

export type TSubjectType = "NotionUser" | "View" | "Block" | "Space" | "UserSettings" | "UserRoot" | "SchemaUnit" | "Page" | "CollectionView" | "CollectionViewPage" | "Collection" | "SpaceView";

export type TMethodType = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type Logger = false | ((method: TMethodType, subject: TSubjectType, id: string) => void)
export interface NishanArg {
  token: string,
  interval: number,
  user_id: string,
  shard_id: number,
  space_id: string,
  cache: ICache,
  id: string,
  logger: Logger,
  defaultExecutionState?: boolean,
  stack: IOperation[],
  sync_records: UpdateCacheManuallyParam
}

export interface ICollectionBlockInput extends IInput {
  views: [TSearchManipViewParam, ...TSearchManipViewParam[]],
  schema: TSchemaUnit[],
  properties: PageProps,
  format?: Partial<PageFormat>,
  rows?: Omit<IPageCreateInput, "type">[]
}

export interface ICollectionViewInput extends ICollectionBlockInput {
  type: "collection_view",
}

export interface ICollectionViewPageInput extends ICollectionBlockInput {
  type: "collection_view_page",
  isPrivate?: boolean
}

export interface ILinkedDBInput extends IInput {
  type: "linked_db",
  collection_id: string,
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
  views: TSearchManipViewParam[],
}

export type TCollectionBlockInput = ICollectionViewInput | ICollectionViewPageInput | ILinkedDBInput;

// -----------------

// Media IBlock Input
export interface IMediaInput extends IInput {
  properties: MediaProps,
  format?: MediaFormat,
  file_ids: string[]
}

export interface IVideoInput extends IMediaInput {
  type: 'video',
}

export interface IImageInput extends IMediaInput {
  type: 'image',
}

export interface IAudioInput extends IMediaInput {
  type: 'audio',
}

export interface IWebBookmarkInput extends IInput {
  type: 'bookmark',
  properties: WebBookmarkProps,
  format?: WebBookmarkFormat
}

// Basic block input
export interface ICodeInput extends IInput {
  type: 'code',
  properties: CodeProps,
  format?: CodeFormat
}

export interface IFileInput extends IInput {
  type: 'file',
  properties: FileProps,
  format?: FileFormat
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic IBlock Input

export interface IColumnListInput extends IInput {
  type: "column_list",
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
  contents: TBlockInput[]
}

export interface IPageCreateInput extends IInput {
  type: 'page',
  properties: PageProps,
  format?: Partial<PageFormat>,
  isPrivate?: boolean,
  contents?: TBlockInput[]
}

export type IPageUpdateInput = Partial<Omit<IPageCreateInput, "contents">>;
export type ICollectionViewPageUpdateInput = Partial<Pick<ICollectionViewPage, "properties" | "format">>
export interface ICommonTextInput extends IInput {
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  }
}
export interface ILinkToPageInput extends IInput {
  type: "link_to_page",
  page_id: string,
  format?: Record<string, unknown>,
  properties?: Record<string, unknown>
}

export interface ITextInput extends ICommonTextInput {
  type: 'text'
}

export interface IHeaderInput extends ICommonTextInput {
  type: 'header'
}

export interface ISubHeaderInput extends ICommonTextInput {
  type: 'sub_header'
}

export interface ISubSubHeaderInput extends ICommonTextInput {
  type: 'sub_sub_header'
}

export interface INumberedListInput extends ICommonTextInput {
  type: 'numbered_list'
}

export interface IBulletedListInput extends ICommonTextInput {
  type: 'bulleted_list'
}

export interface IToggleInput extends ICommonTextInput {
  type: 'toggle'
}

export interface IQuoteInput extends ICommonTextInput {
  type: 'quote'
}

interface IInput {
  id?: string,
  type: TBlockType
}

export interface IDividerInput extends IInput {
  type: 'divider',
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>
}

export interface ICalloutInput extends ICommonTextInput {
  type: 'callout',
  format?: {
    page_icon: string,
    block_color?: TFormatBlockColor
  }
}

export interface ITodoInput extends IInput {
  type: 'to_do',
  properties: TodoProps,
  format?: {
    block_color?: TFormatBlockColor
  }
}
// ? TD:2:M Add td for TCollectionBlockInput

export type TBasicBlockInput = ILinkToPageInput | IPageCreateInput | ITodoInput | ICalloutInput | IDividerInput | IQuoteInput | IToggleInput | IBulletedListInput | INumberedListInput | ISubSubHeaderInput | ISubHeaderInput | IHeaderInput | ITextInput;
// Advanced block input
export interface ITOCInput extends IInput {
  type: 'table_of_contents',
  format?: {
    block_color?: TFormatBlockColor
  },
  properties?: Record<string, unknown>
}

export interface IEquationInput extends IInput {
  type: 'equation',
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  }
}

export interface IFactoryInput extends IInput {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  },
  contents: TBlockInput[]
}

export interface IBreadcrumbInput extends IInput {
  type: 'breadcrumb',
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IEmbedInput extends IInput {
  type: "embed",
  properties: MediaProps,
  format?: MediaFormat,
}

export interface IDriveInput extends IInput {
  type: 'drive',
  properties?: Record<string, unknown>,
  format?: {
    drive_properties: {
      file_id: string,
      icon: string,
      modified_time: number,
      title: string,
      trashed: boolean,
      url: string,
      user_name: string,
    },
    drive_status: {
      authed: boolean,
      last_fetched: number
    }
  },
  file_id: string
}

export interface ITweetInput extends IInput {
  type: 'tweet',
  properties: {
    source: string[][]
  },
  format?: Record<string, unknown>,
}

export interface ICodepenInput extends IInput {
  type: 'codepen',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export interface IMapsInput extends IInput {
  type: 'maps',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export interface IGistInput extends IInput {
  type: 'gist',
  properties: {
    source: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor,
    display_source: null
  },
}

export interface IFigmaInput extends IInput {
  type: 'figma',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export type TEmbedBlockInput = IEmbedInput | IFigmaInput | IMapsInput | ICodepenInput | IDriveInput | IGistInput | ITweetInput;

export type TBlockInput = TMediaBlockInput | TBasicBlockInput | TAdvancedBlockInput | TEmbedBlockInput | TCollectionBlockInput | IColumnListInput;