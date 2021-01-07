import { CollectionBlock, CollectionViewPage, Page, SchemaUnit, TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView, Block, Collection } from "./api";

import { TViewGroupFilterOperator, ILinkToPage, IViewAggregationsAggregators, IBoardViewFormat, IGalleryViewFormat, ITimelineViewFormat, TSchemaUnitType, INotionUser, ISpace, ISpaceView, IUserSettingsSettings, ICollection, TViewType, TDataType, TTimelineViewTimelineby, TSortValue, ITableViewFormat, IViewFilterData, CheckboxSchemaUnit, CreatedBySchemaUnit, CreatedTimeSchemaUnit, DateSchemaUnit, EmailSchemaUnit, FileSchemaUnit, FormulaSchemaUnit, IAudio, IBreadcrumb, IBulletedList, ICallout, ICode, ICodepen, IColumn, IColumnList, IDivider, IDrive, IEmbed, IEquation, IFactory, IFigma, IFile, IGist, IHeader, IImage, IMaps, INumberedList, IQuote, ISubHeader, IText, ITOC, ITodo, IToggle, ITweet, IVideo, IWebBookmark, LastEditedBySchemaUnit, LastEditedTimeSchemaUnit, MultiSelectSchemaUnit, NumberSchemaUnit, PersonSchemaUnit, PhoneNumberSchemaUnit, RelationSchemaUnit, RollupSchemaUnit, SelectSchemaUnit, TextSchemaUnit, TitleSchemaUnit, UrlSchemaUnit, IOperation, IUserRoot, IUserSettings, TBlock, TView, ICollectionViewPage, TSchemaUnit, TBlockType, IPage, ISubSubHeader, IConstantFormula, TDateConstantValueType } from "@nishans/types";

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
  properties: IPage["properties"],
  format?: Partial<IPage["format"]>,
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

export interface IVideoInput extends IInput {
  type: 'video',
  properties: IVideo["properties"],
  format: IVideo["format"],
}

export interface IImageInput extends IInput {
  type: 'image',
  properties: IImage["properties"],
  format: IImage["format"],
}

export interface IAudioInput extends IInput {
  type: 'audio',
  properties: IAudio["properties"],
  format: IAudio["format"],
}

export interface IWebBookmarkInput extends IInput {
  type: 'bookmark',
  properties: IWebBookmark["properties"],
  format?: IWebBookmark["format"]
}

// Basic block input
export interface ICodeInput extends IInput {
  type: 'code',
  properties: ICode["properties"]
  format?: ICode["format"]
}

export interface IFileInput extends IInput {
  type: 'file',
  properties: IFile["properties"]
  format?: IFile["format"]
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic IBlock Input

export interface IColumnListInput extends IInput {
  type: "column_list",
  properties?: IColumnList["properties"],
  format?: IColumnList["format"],
  contents: TBlockInput[]
}

export interface IPageCreateInput extends IInput {
  type: 'page',
  properties: IPage["properties"],
  format?: Partial<IPage["format"]>,
  isPrivate?: boolean,
  contents?: TBlockInput[]
}

export type IPageUpdateInput = Partial<Omit<IPageCreateInput, "contents">> & {type: "page"};
export type ICollectionViewPageUpdateInput = Partial<Pick<ICollectionViewPage, "format">> & {type: "collection_view_page"}

export interface ITextInput extends IInput {
  properties: IText["properties"],
  format: IText["format"],
  type: 'text'
}

export interface IHeaderInput extends IInput {
  properties: IHeader["properties"],
  format: IHeader["format"],
  type: 'header'
}

export interface ISubHeaderInput extends IInput {
  properties: ISubHeader["properties"],
  format: ISubHeader["format"],
  type: 'sub_header'
}

export interface ISubSubHeaderInput extends IInput {
  properties: ISubSubHeader["properties"],
  format: ISubSubHeader["format"],
  type: 'sub_sub_header'
}

export interface INumberedListInput extends IInput {
  properties: INumberedList["properties"],
  format: INumberedList["format"],
  type: 'numbered_list'
}

export interface IBulletedListInput extends IInput {
  properties: IBulletedList["properties"],
  format: IBulletedList["format"],
  type: 'bulleted_list'
}

export interface IToggleInput extends IInput {
  properties: IToggle["properties"],
  format: IToggle["format"],
  type: 'toggle'
}

export interface IQuoteInput extends IInput {
  properties: IQuote["properties"],
  format: IQuote["format"],
  type: 'quote'
}

export interface ILinkToPageInput extends IInput {
  type: "link_to_page",
  page_id: string,
  format?: ILinkToPage["format"],
  properties?: ILinkToPage["properties"]
}

interface IInput {
  id?: string,
  type: TBlockType
}

export interface IDividerInput extends IInput {
  type: 'divider',
  properties?: IDivider["properties"],
  format?: IDivider["format"]
}

export interface ICalloutInput extends IInput{
  type: 'callout',
  format?: ICallout["format"]
  properties?: ICallout["properties"]
}

export interface ITodoInput extends IInput {
  type: 'to_do',
  properties: ITodo["properties"],
  format?: ITodo["format"]

}
// ? TD:2:M Add td for TCollectionBlockInput

export type TBasicBlockInput = ILinkToPageInput | IPageCreateInput | ITodoInput | ICalloutInput | IDividerInput | IQuoteInput | IToggleInput | IBulletedListInput | INumberedListInput | ISubSubHeaderInput | ISubHeaderInput | IHeaderInput | ITextInput;
// Advanced block input
export interface ITOCInput extends IInput {
  type: 'table_of_contents',
  format?: ITOC["format"],
  properties?: ITOC["properties"]
}

export interface IEquationInput extends IInput {
  type: 'equation',
  properties: IEquation["properties"],
  format?: IEquation["format"]
}

export interface IFactoryInput extends IInput {
  type: 'factory',
  properties: IFactory["properties"],
  format?: IFactory["format"],
  contents: TBlockInput[]
}

export interface IBreadcrumbInput extends IInput {
  type: 'breadcrumb',
  properties?: IBreadcrumb["properties"],
  format?: IBreadcrumb["format"],
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IEmbedInput extends IInput {
  type: "embed",
  properties: IEmbed["properties"],
  format?: IEmbed["format"],
}

export interface IDriveInput extends IInput {
  type: 'drive',
  properties?: IDrive["properties"],
  format?: IDrive["format"],
  file_id: string
}

export interface ITweetInput extends IInput {
  type: 'tweet',
  properties: ITweet["properties"],
  format?: ITweet["format"],
}

export interface ICodepenInput extends IInput {
  type: 'codepen',
  properties: ICodepen["properties"],
  format?: ICodepen["format"],
}

export interface IMapsInput extends IInput {
  type: 'maps',
  properties: IMaps["properties"],
  format?: IMaps["format"],
}

export interface IGistInput extends IInput {
  type: 'gist',
  properties: IGist["properties"],
  format?: IGist["format"],
}

export interface IFigmaInput extends IInput {
  type: 'figma',
  properties: IFigma["properties"],
  format?: IFigma["format"],
}

export type TEmbedBlockInput = IEmbedInput | IFigmaInput | IMapsInput | ICodepenInput | IDriveInput | IGistInput | ITweetInput;

export type TBlockInput = TMediaBlockInput | TBasicBlockInput | TAdvancedBlockInput | TEmbedBlockInput | TCollectionBlockInput | IColumnListInput;

// Formula Inputs
export type TResultType =
	| TCheckboxResultType
	| TTextResultType
	| TNumberResultType
	| TDateResultType;

type Tuple2AnyResultType =
	| Tuple2<TTextResultType>
	| Tuple2<TCheckboxResultType>
	| Tuple2<TDateResultType>
	| Tuple2<TNumberResultType>;

type Tuple2<T extends TResultType> = [T, T];
type Tuple12<T1 extends TResultType, T2 extends TResultType> = [T1, T2, T2];

export type TCheckboxResultType = boolean | TCheckboxFunctionCreateInput | {property: string};
export type TNumberResultType = number | TNumberFunctionCreateInput | {property: string};
export type TDateResultType = TDateFunctionCreateInput | {property: string};
export type TTextResultType = string | TTextFunctionCreateInput | {property: string};

export type NumberIfFunctionCreateInput = [
  'if',
  [ TCheckboxResultType, TNumberResultType, TNumberResultType ] 
]

export type TextIfFunctionCreateInput = [
  'if',
  [ TCheckboxResultType, TTextResultType, TTextResultType ]
]

export type EqualFunctionCreateInput = ['equal', Tuple2AnyResultType]
export type UnequalFunctionCreateInput = ['equal', Tuple2AnyResultType]
export type AddFunctionCreateInput = ['add', Tuple2<TTextResultType> | Tuple2<TNumberResultType>]
export type ReplaceAllFunctionCreateInput = ['replaceAll', 
  | Tuple12<TNumberResultType, TTextResultType>
	| Tuple12<TTextResultType, TTextResultType>
  | Tuple12<TCheckboxResultType, TTextResultType>
];
export type ReplaceFunctionCreateInput = ['replace', 
  | Tuple12<TNumberResultType, TTextResultType>
	| Tuple12<TTextResultType, TTextResultType>
  | Tuple12<TCheckboxResultType, TTextResultType>
];

export type ConcatFunctionCreateInput = ['concat', Tuple2<TTextResultType>];
export type JoinFunctionCreateInput = ['join', Array<IConstantFormula<'text', 'string'>>];
export type SliceFunctionCreateInput = ['slice', Tuple12<string, number>];
export type FormatFunctionCreateInput = ['format', [TResultType]];
export type AndFunctionCreateInput = ['and', Tuple2<TCheckboxResultType>];
export type OrFunctionCreateInput = ['or', Tuple2<TCheckboxResultType>];
export type LargerFunctionCreateInput = ['larger', Tuple2<TCheckboxResultType>];
export type LargerEqFunctionCreateInput = ['largerEq', Tuple2<TCheckboxResultType>];
export type SmallerFunctionCreateInput = ['smaller', Tuple2<TCheckboxResultType>];
export type SmallerEqFunctionCreateInput = ['smallerEq', Tuple2<TCheckboxResultType>];
export type NotFunctionCreateInput = ['not', [TCheckboxResultType]];

export type SubtractFunctionCreateInput = ['subtract', Tuple2<TNumberResultType>];
export type DivideFunctionCreateInput = ['divide', Tuple2<TNumberResultType>];
export type MultipleFunctionCreateInput = ['multiple', Tuple2<TNumberResultType>];
export type PowFunctionCreateInput = ['pow', Tuple2<TNumberResultType>];
export type ModFunctionCreateInput = ['mod', Tuple2<TNumberResultType>];
export type UnaryMinusFunctionCreateInput = ['unaryMinus', [TNumberResultType]];
export type UnaryPlusFunctionCreateInput = ['unaryPlus', [TNumberResultType]];
export type ContainsFunctionCreateInput = ['contains', Tuple2<TTextResultType>];
export type TestFunctionCreateInput = [
	'test',
	| [TNumberResultType, TTextResultType]
	| [TTextResultType, TTextResultType]
	| [TCheckboxResultType, TTextResultType]
];
export type EmptyFunctionCreateInput = [
	'empty',
	[TNumberResultType] | [TTextResultType] | [TDateResultType] | [TCheckboxResultType]
];

export type AbsFunctionCreateInput = ['abs', [TNumberResultType]];
export type CbrtFunctionCreateInput = ['cbrt', [TNumberResultType]];
export type CeilFunctionCreateInput = ['ceil', [TNumberResultType]];
export type ExpFunctionCreateInput = ['exp', [TNumberResultType]];
export type FloorFunctionCreateInput = ['floor', [TNumberResultType]];
export type LnFunctionCreateInput = ['ln', [TNumberResultType]];
export type Log10FunctionCreateInput = ['log10', [TNumberResultType]];
export type Log2FunctionCreateInput = ['log2', [TNumberResultType]];
export type MaxFunctionCreateInput = ['max', [TNumberResultType]];
export type MinFunctionCreateInput = ['min', [TNumberResultType]];
export type RoundFunctionCreateInput = ['round', [TNumberResultType]];
export type SignFunctionCreateInput = ['sign', [TNumberResultType]];
export type SqrtFunctionCreateInput = ['sqrt', [TNumberResultType]];
export type StartFunctionCreateInput = ['start', [TDateResultType]];
export type EndFunctionCreateInput = ['end', [TDateResultType]];
export type DateAddFunctionCreateInput = [
	'dateAdd',
	[TDateResultType, TNumberResultType, TDateConstantValueType]
];
export type DateSubtractFunctionCreateInput = [
	'dateSubtract',
	[TDateResultType, TNumberResultType, TDateConstantValueType]
];

export type DateBetweenFunctionCreateInput = [
	'dateBetween',
	Tuple12<TDateResultType, TDateConstantValueType>
];
export type FormatDateFunctionCreateInput = [
	'formatDate',
	[TDateResultType, string]
];
export type TimestampFunctionCreateInput = ['timestamp', [TDateResultType]];

export type FromTimestampFunctionCreateInput = ['fromTimestamp', [TNumberResultType]];
export type MinuteFunctionCreateInput = ['minute', [TDateResultType]];
export type HourFunctionCreateInput = ['hour', [TDateResultType]];
export type DayFunctionCreateInput = ['day', [TDateResultType]];
export type DateFunctionCreateInput = ['date', [TDateResultType]];
export type MonthFunctionCreateInput = ['month', [TDateResultType]];
export type YearFunctionCreateInput = ['year', [TDateResultType]];
export type LengthFunctionCreateInput = ['length', [TTextResultType]];
export type ToNumberFunctionCreateInput = ['toNumber', [TResultType]];
export type NowFunctionCreateInput = 'now'

export type TTextFunctionCreateInput = 
  | TextIfFunctionCreateInput 
  | AddFunctionCreateInput
  | ReplaceAllFunctionCreateInput
  | ReplaceFunctionCreateInput
  | ConcatFunctionCreateInput
  | JoinFunctionCreateInput
  | SliceFunctionCreateInput
  | FormatFunctionCreateInput;

export type TCheckboxFunctionCreateInput =
	| EqualFunctionCreateInput
	| UnequalFunctionCreateInput
	| AndFunctionCreateInput
	| OrFunctionCreateInput
	| LargerFunctionCreateInput
	| LargerEqFunctionCreateInput
	| SmallerFunctionCreateInput
	| SmallerEqFunctionCreateInput
  | NotFunctionCreateInput
  | EmptyFunctionCreateInput 
  | TestFunctionCreateInput 
  | ContainsFunctionCreateInput;

export type TNumberFunctionCreateInput =
	| SubtractFunctionCreateInput
	| DivideFunctionCreateInput
	| MultipleFunctionCreateInput
	| PowFunctionCreateInput
	| ModFunctionCreateInput
	| UnaryMinusFunctionCreateInput
	| UnaryPlusFunctionCreateInput
  | NumberIfFunctionCreateInput
  | DateBetweenFunctionCreateInput
	| TimestampFunctionCreateInput
	| SqrtFunctionCreateInput
	| SignFunctionCreateInput
	| RoundFunctionCreateInput
	| MinFunctionCreateInput
	| MaxFunctionCreateInput
	| Log2FunctionCreateInput
	| Log10FunctionCreateInput
	| LnFunctionCreateInput
	| FloorFunctionCreateInput
	| ExpFunctionCreateInput
	| CeilFunctionCreateInput
	| CbrtFunctionCreateInput
	| AbsFunctionCreateInput
	| ToNumberFunctionCreateInput
  | LengthFunctionCreateInput;
  
export type TDateFunctionCreateInput =
  | FormatDateFunctionCreateInput
  | DateSubtractFunctionCreateInput
  | DateAddFunctionCreateInput
  | NowFunctionCreateInput
  | StartFunctionCreateInput
  | EndFunctionCreateInput
  | TimestampFunctionCreateInput
  | FromTimestampFunctionCreateInput
  | MinuteFunctionCreateInput
  | HourFunctionCreateInput
  | DayFunctionCreateInput
  | DateFunctionCreateInput
  | MonthFunctionCreateInput
  | YearFunctionCreateInput

export type TFormulaCreateInput = TDateFunctionCreateInput | TTextFunctionCreateInput | TNumberFunctionCreateInput | TCheckboxFunctionCreateInput;

export interface FormulaSchemaUnitInput {
  name: string,
  type: "formula",
  formula: TFormulaCreateInput
}