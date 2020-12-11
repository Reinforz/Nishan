import { Block, BoardView, CalendarView, Collection, CollectionViewPage, GalleryView, ListView, Page, SchemaUnit, TableView, TimelineView } from "../api";
import CollectionBlock from "../api/CollectionBlock";
import { TSchemaUnitType, INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, TBlockInput, TBlockType, IDate, IDateRange, IDateTime, IDateTimeRange, TViewAggregationsAggregators, TViewType, TDataType, TViewFiltersOperator, TViewFiltersType, TViewFiltersValue, TTimelineViewTimelineby, TSortValue, TextViewAggregationsAggregator, NumericViewAggregationsAggregator, EmailViewAggregationsAggregator, CheckboxViewAggregationsAggregator, DateViewAggregationsAggregator, EnumsViewAggregationsAggregator, EnumViewAggregationsAggregator, PersonViewAggregationsAggregator, PhoneViewAggregationsAggregator, UrlViewAggregationsAggregator, FileViewAggregationsAggregator, CreatedByViewAggregationsAggregator, CreatedTimeViewAggregationsAggregator, FormulaViewAggregationsAggregator, LastEditedByViewAggregationsAggregator, LastEditedTimeViewAggregationsAggregator, RelationViewAggregationsAggregator, RollupViewAggregationsAggregator, TitleViewAggregationsAggregator, CheckboxViewFiltersOperator, CheckboxViewFiltersType, CheckboxViewFiltersValue, CreatedByViewFiltersOperator, CreatedByViewFiltersType, CreatedByViewFiltersValue, CreatedTimeViewFiltersOperator, CreatedTimeViewFiltersType, CreatedTimeViewFiltersValue, DateViewFiltersOperator, DateViewFiltersType, DateViewFiltersValue, EmailViewFiltersOperator, EmailViewFiltersType, EmailViewFiltersValue, EnumsViewFiltersOperator, EnumsViewFiltersType, EnumsViewFiltersValue, EnumViewFiltersOperator, EnumViewFiltersType, EnumViewFiltersValue, NumericViewFiltersOperator, NumericViewFiltersType, NumericViewFiltersValue, PersonViewFiltersOperator, PersonViewFiltersType, PersonViewFiltersValue, PhoneViewFiltersOperator, PhoneViewFiltersType, PhoneViewFiltersValue, RelationViewFiltersOperator, RelationViewFiltersType, RelationViewFiltersValue, RollupViewFiltersOperator, RollupViewFiltersType, RollupViewFiltersValue, TextViewFiltersOperator, TextViewFiltersType, TextViewFiltersValue, UrlViewFiltersOperator, UrlViewFiltersType, UrlViewFiltersValue, TitleViewFiltersOperator, TitleViewFiltersType, TitleViewFiltersValue, FileViewFiltersOperator, FileViewFiltersType, FileViewFiltersValue, LastEditedByViewFiltersOperator, LastEditedByViewFiltersType, LastEditedByViewFiltersValue, LastEditedTimeViewFiltersOperator, LastEditedTimeViewFiltersType, LastEditedTimeViewFiltersValue, FormulaViewFiltersOperator, FormulaViewFiltersType, FormulaViewFiltersValue, ITableViewFormat, RollupSchemaUnit, CheckboxSchemaUnit, DateSchemaUnit, FileSchemaUnit, MultiSelectSchemaUnit, NumberSchemaUnit, PersonSchemaUnit, SelectSchemaUnit, TextSchemaUnit, TitleSchemaUnit, UrlSchemaUnit, CreatedTimeSchemaUnit, EmailSchemaUnit, FormulaSchemaUnit, LastEditedBySchemaUnit, LastEditedTimeSchemaUnit, PhoneNumberSchemaUnit, RelationSchemaUnit, CreatedBySchemaUnit, IAudio, IAudioInput, IBreadcrumb, IBreadcrumbInput, IBulletedList, IBulletedListInput, ICallout, ICalloutInput, ICode, ICodeInput, ICodepen, ICodepenInput, IDivider, IDividerInput, IDrive, IDriveInput, IEquation, IEquationInput, IFactory, IFactoryInput, IFigma, IFigmaInput, IFile, IFileInput, IGist, IGistInput, IHeader, IHeaderInput, IImage, IImageInput, IMaps, IMapsInput, INumberedList, INumberedListInput, IQuote, IQuoteInput, ISubHeader, ISubHeaderInput, IText, ITextInput, ITOC, ITOCInput, ITodo, ITodoInput, IToggle, IToggleInput, ITweet, ITweetInput, IVideo, IVideoInput, IWebBookmark, IWebBookmarkInput } from "./";
import { IEmbed, IEmbedInput } from "./block";
import { IBoardViewFormat, IGalleryViewFormat, ITimelineViewFormat } from "./view";

export type UserViewFilterParams = [TViewFiltersOperator, TViewFiltersType, TViewFiltersValue] | [TViewFiltersOperator, TViewFiltersType, TViewFiltersValue, number]

// ? TD:1:M All the schema type rather than Record Any

export interface CreateBlockArg {
  parent_table?: "block" | "collection" | "space", $block_id: string, type: TBlockType, properties?: any, format?: any, parent_id?: string
}

export type InlineDateArg = IDate | IDateTime | IDateTimeRange | IDateRange

export type RepositionParams = {
  id: string,
  position: "before" | "after"
} | number | undefined;

export type UpdatableSpaceKeys = "name" | "icon" |
  "disable_public_access" |
  "disable_guests" |
  "disable_move_to_space" |
  "disable_export" |
  "domain" |
  "invite_link_enabled" |
  "beta_enabled";

export type UpdatableSpaceParams = Partial<Pick<ISpace, UpdatableSpaceKeys>>;

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

export type Predicate<T> = (T: T, index: number) => Promise<boolean> | boolean | void;
export type FilterTypes<T> = undefined | string[] | Predicate<T>
export type FilterType<T> = undefined | string | Predicate<T>

export interface SearchManipViewParam {
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

// ? TD:1:H Add generic type for filter as well
interface ViewUpdateGenericParam<T extends TSchemaUnitType, FO extends TViewFiltersOperator, FT extends TViewFiltersType, FV extends TViewFiltersValue, A extends TViewAggregationsAggregators> {
  name: string,
  type: T,
  sort?: TSortValue | [TSortValue, number],
  format?: boolean | number | [boolean, number],
  filter?: ([FO, FT, FV] | [FO, FT, FV, number])[],
  aggregation?: A
}

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
}

export type ITCollectionBlock = {
  block: CollectionBlock,
  collection: Collection,
  views: ITView
}

export type ViewUpdateParam =
  ViewUpdateGenericParam<"text", TextViewFiltersOperator, TextViewFiltersType, TextViewFiltersValue, TextViewAggregationsAggregator> |
  ViewUpdateGenericParam<"title", TitleViewFiltersOperator, TitleViewFiltersType, TitleViewFiltersValue, TitleViewAggregationsAggregator> |
  ViewUpdateGenericParam<"number", NumericViewFiltersOperator, NumericViewFiltersType, NumericViewFiltersValue, NumericViewAggregationsAggregator> |
  ViewUpdateGenericParam<"select", EnumViewFiltersOperator, EnumViewFiltersType, EnumViewFiltersValue, EnumViewAggregationsAggregator> |
  ViewUpdateGenericParam<"multi_select", EnumsViewFiltersOperator, EnumsViewFiltersType, EnumsViewFiltersValue, EnumsViewAggregationsAggregator> |
  ViewUpdateGenericParam<"date", DateViewFiltersOperator, DateViewFiltersType, DateViewFiltersValue, DateViewAggregationsAggregator> |
  ViewUpdateGenericParam<"person", PersonViewFiltersOperator, PersonViewFiltersType, PersonViewFiltersValue, PersonViewAggregationsAggregator> |
  ViewUpdateGenericParam<"file", FileViewFiltersOperator, FileViewFiltersType, FileViewFiltersValue, FileViewAggregationsAggregator> |
  ViewUpdateGenericParam<"checkbox", CheckboxViewFiltersOperator, CheckboxViewFiltersType, CheckboxViewFiltersValue, CheckboxViewAggregationsAggregator> |
  ViewUpdateGenericParam<"url", UrlViewFiltersOperator, UrlViewFiltersType, UrlViewFiltersValue, UrlViewAggregationsAggregator> |
  ViewUpdateGenericParam<"email", EmailViewFiltersOperator, EmailViewFiltersType, EmailViewFiltersValue, EmailViewAggregationsAggregator> |
  ViewUpdateGenericParam<"phone_number", PhoneViewFiltersOperator, PhoneViewFiltersType, PhoneViewFiltersValue, PhoneViewAggregationsAggregator> |
  ViewUpdateGenericParam<"formula", FormulaViewFiltersOperator, FormulaViewFiltersType, FormulaViewFiltersValue, FormulaViewAggregationsAggregator> |
  ViewUpdateGenericParam<"relation", RelationViewFiltersOperator, RelationViewFiltersType, RelationViewFiltersValue, RelationViewAggregationsAggregator> |
  ViewUpdateGenericParam<"rollup", RollupViewFiltersOperator, RollupViewFiltersType, RollupViewFiltersValue, RollupViewAggregationsAggregator> |
  ViewUpdateGenericParam<"created_time", CreatedTimeViewFiltersOperator, CreatedTimeViewFiltersType, CreatedTimeViewFiltersValue, CreatedTimeViewAggregationsAggregator> |
  ViewUpdateGenericParam<"created_by", CreatedByViewFiltersOperator, CreatedByViewFiltersType, CreatedByViewFiltersValue, CreatedByViewAggregationsAggregator> |
  ViewUpdateGenericParam<"last_edited_time", LastEditedTimeViewFiltersOperator, LastEditedTimeViewFiltersType, LastEditedTimeViewFiltersValue, LastEditedTimeViewAggregationsAggregator> |
  ViewUpdateGenericParam<"last_edited_by", LastEditedByViewFiltersOperator, LastEditedByViewFiltersType, LastEditedByViewFiltersValue, LastEditedByViewAggregationsAggregator>;