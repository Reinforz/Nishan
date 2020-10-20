export type SchemaUnitType = 'multi_select' | 'select' | 'number' | 'title' | 'checkbox' | 'formula' | 'relation' | 'rollup' | 'text' | 'date' | 'person' | 'file' | 'url' | 'email' | 'phone' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
export type Entity = BlockData | SpaceData | CollectionData;
export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;
export type OperationCommand = 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter' | 'listRemove' | 'listBefore';
export type OperationTable = 'space' | 'collection_view' | 'collection' | 'collection_view_page' | 'page' | 'block' | 'space_view' | 'notion_user' | 'user_settings' | 'user_root';
export type ViewAggregationsAggregators = "count" | "unique" | "count_values" | "not_empty" | "empty" | "percent_empty" | "percent_not_empty";
export type ViewType = 'table' | 'list' | 'board' | 'gallery' | 'calendar';
export type ViewFormatCover = { type: 'page_content' | 'page_cover' } | { type: 'property', property: string };
export type TMediaBlockType = 'code' | 'image' | 'video' | 'bookmark' | 'audio' | 'file';
export type TBasicBlockType = 'text' | 'header' | 'sub_header' | 'sub_sub_header' | 'to_do' | 'bulleted_list' | 'numbered_list' | 'toggle' | 'quote' | 'divider' | 'callout';
export type TAdvancedBlockType = 'table_of_contents' | 'equation' | 'factory' | 'breadcrumb';
export type IBlockType = TMediaBlockType | TBasicBlockType | TAdvancedBlockType | 'page' | 'collection_view_page' | 'collection_view' | 'link_to_page';
export type TextColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | "pink" | 'red';
export type BGColor = 'default_background' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'green_background' | 'blue_background' | 'purple_background' | "pink_background" | 'red_background';
export type FormatBlockColor = TextColor | BGColor;
export type ExportType = "markdown" | "pdf" | "html";
export type TaskType = "deleteSpace" | "exportBlock" | "duplicateBlock";
export type TLocale = 'en-US' | 'ko-KR';
export type TPermissionRole = 'editor' | 'read_and_write' | 'comment_only' | 'reader';
export type TPermissionType = 'user_permission' | 'space_permission' | 'public_permission';
export type TPage = IPage | IRootPage;
export type TCodeLanguage = "ABAP" | "Arduino" | "Bash" | "BASIC" | "C" | "Clojure" | "CoffeeScript" | "C++" | "C#" | "CSS" | "Dart" | "Diff" | "Docker" | "Elixir" | "Elm" | "Erlang" | "Flow" | "Fortran" | "F#" | "Gherkin" | "GLSL" | "Go" | "GraphQL" | "Groovy" | "Haskell" | "HTML" | "Java" | "JavaScript" | "JSON" | "Kotlin" | "LaTeX" | "Less" | "Lisp" | "LiveScript" | "Lua" | "Makefile" | "Markdown" | "Markup" | "MATLAB" | "Nix" | "Objective-C" | "OCaml" | "Pascal" | "Perl" | "PHP" | "Plain Text" | "PowerShell" | "Prolog" | "Python" | "R" | "Reason" | "Ruby" | "Rust" | "Sass" | "Scala" | "Scheme" | "Scss" | "Shell" | "SQL" | "Swift" | "TypeScript" | "VB.Net" | "Verilog" | "VHDL" | "Visual Basic" | "WebAssembly" | "XML" | "YAML";

export interface ValueArg {
  id: string,
  value: string,
  color: string
};

export interface SchemaUnit {
  name: string,
  type: SchemaUnitType,
  options?: {
    id: string,
    value: string,
    color: TextColor
  }[]
}

export interface Schema {
  [key: string]: SchemaUnit
};

export interface Request {
  requestId: string,
  transactions: Transaction[]
};

export interface Transaction {
  id: string,
  shardId: number,
  spaceId: string,
  operations: Operation[]
};

export interface Operation {
  table: OperationTable,
  id: string,
  command: OperationCommand,
  path: string[],
  args: Args
};

export interface Permission {
  role: TPermissionRole,
  type: TPermissionType,
  user_id: string,
}

export interface Node {
  alive: boolean,
  version: number,
  id: string,
}

export interface ParentProps {
  parent_id: string,
  parent_table: 'block' | 'space' | 'user_root',
}

export interface CreateProps {
  created_by_id: string,
  created_by_table: 'notion_user',
  created_time: number,
}

export interface LastEditedProps {
  last_edited_by_id: string,
  last_edited_by_table: 'notion_user',
  last_edited_time: number,
}

export interface Block extends Node, ParentProps, CreateProps, LastEditedProps {
  permission: Permission[],
  shard_id: number,
  space_id: string,
  collection_id?: string,
  view_ids?: string[],
}

// ? TD: Page format and properties

/* Block Specific Format and Properties */
export interface PageProps {
  title: string[][],
  [k: string]: string[][]
}

export interface PageFormat {
  page_icon: string,
  page_font: string,
  page_full_width: boolean,
  page_small_text: boolean,
  block_locked_by: string,
  block_locked: boolean,
  page_cover: string,
  page_cover_position: number,
  block_color?: FormatBlockColor
}

export interface MediaProps {
  source: string[][],
  caption?: string[][]
}

export interface MediaFormat {
  block_aspect_ratio?: number,
  block_full_width?: boolean,
  block_page_width?: boolean,
  block_preserve_scale?: boolean,
  block_width?: number,
  display_source: string
}

export interface WebBookmarkFormat {
  bookmark_cover: string,
  bookmark_icon: string,
  block_color?: FormatBlockColor
}

export interface WebBookmarkProps {
  link: string[][],
  description: string[][],
  title: string[][],
  caption?: string[][]
}

export interface CodeFormat {
  code_wrap: boolean
}

export interface CodeProps {
  title: string[][],
  language: TCodeLanguage
}

export interface FileProps {
  title: string[][],
  source: string[][],
  caption?: string[][]
}

export interface FileFormat {
  block_color?: FormatBlockColor
}

export interface TodoProps {
  title: string[][],
  checked: ("Yes" | "No")[][]
}
// -----------------

/* Function API Params*/

export interface IPageInput {
  type: 'page',
  properties: PageProps,
  format: PageFormat
}

export interface IVideoInput {
  type: 'video',
  properties: MediaFormat,
  format: MediaFormat
}

export interface IImageInput {
  type: 'image',
  properties: MediaFormat,
  format: MediaFormat
}

export interface IAudioInput {
  type: 'audio',
  properties: MediaFormat,
  format: MediaFormat
}

export interface IWebBookmarkInput {
  type: 'bookmark',
  properties: WebBookmarkProps,
  format: WebBookmarkFormat
}

export interface ICodeInput {
  type: 'code',
  properties: CodeProps,
  format: CodeFormat
}

export interface IFileInput {
  type: 'file',
  properties: FileProps,
  format: FileFormat
}

export interface ICommonTextInput {
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  }
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

export interface IDividerInput {
  type: 'divider',
  properties?: {},
  format?: {}
}

export interface ICalloutInput extends ICommonTextInput {
  type: 'callout',
  format: {
    page_icon: string,
    block_color?: FormatBlockColor
  }
}

export interface ITodoInput {
  type: 'to_do',
  properties: TodoProps,
  format: {
    block_color?: FormatBlockColor
  }
}

export interface ITOCInput {
  type: 'table_of_contents',
  format: {
    block_color?: FormatBlockColor
  },
  properties?: {}
}

export interface IEquationInput {
  type: 'equation',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  }
}

export interface IFactoryInput {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  },
  contents: TBlockInput[]
}

export interface IBreadcrumbInput {
  type: 'breadcrumb',
  properties?: {},
  format?: {},
}

export type TBlockInput = IPageInput | IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput | ITextInput | ITodoInput | IHeaderInput | ISubHeaderInput | ISubSubHeaderInput | IBulletedListInput | INumberedListInput | IToggleInput | IQuoteInput | IDividerInput | ICalloutInput | ITOCInput | IEquationInput | IFactoryInput | IBreadcrumbInput;
// -----------------

export interface IPage extends Block {
  properties: PageProps,
  type: 'page',
  content?: string[],
  format: PageFormat,
  is_template?: boolean
}

export interface IPublicPermission {
  type: 'public_permission',
  role: TPermissionRole,
  allow_duplicate: boolean
}

export interface IRootPage extends IPage {
  permissions: (Permission | IPublicPermission)[]
}

export interface ICollectionBlock extends Block {
  view_ids: string[],
  collection_id: string,
  type: 'collection_view' | 'collection_view_page'
}

export interface ICollectionView extends ICollectionBlock {
  type: 'collection_view',
}

export interface ICollectionViewPage extends ICollectionBlock {
  type: 'collection_view_page',
}

// Media Block Types
export interface IVideo extends Block, IVideoInput { };
export interface IAudio extends Block, IAudioInput { };
export interface IImage extends Block, IImageInput { };
export interface IWebBookmark extends Block, IWebBookmarkInput { };
export interface ICode extends Block, ICodeInput { };
export interface IFile extends Block, IFileInput { };

// Basic Block Types
export interface IText extends ITextInput, Block { }
export interface ITodo extends ITodoInput, Block { }
export interface IHeader extends IHeaderInput, Block { }
export interface ISubHeader extends ISubHeaderInput, Block { }
export interface ISubSubHeader extends ISubSubHeaderInput, Block { }
export interface IBulletedList extends IBulletedListInput, Block { }
export interface INumberedList extends INumberedListInput, Block { }
export interface IToggle extends IToggleInput, Block { }
export interface IQuote extends IQuoteInput, Block { }
export interface IDivider extends IDividerInput, Block { }
export interface ICallout extends ICalloutInput, Block { }

// Advanced block types
export interface ITOC extends ITOCInput, Block { };
export interface IEquation extends IEquationInput, Block { };
export interface IBreadcrumb extends IBreadcrumbInput, Block { };
export interface IFactory extends Block {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format: {
    block_color?: FormatBlockColor
  },
  contents: string[]
}

export type TCollectionBlock = ICollectionView | ICollectionViewPage;

// ? TD:2:H Add all block type
export type TBlock = IRootPage | TCollectionBlock | IPage | IHeader | ISubHeader | ISubSubHeader | IText | ITodo | IBulletedList | INumberedList | IToggle | IQuote | IDivider | ICallout | IVideo | IAudio | IImage | IWebBookmark | ICode | IFile | ITOC | IEquation | IFactory | IBreadcrumb;

export type ParentType = IRootPage | ISpace;

export interface ICollection extends Node, ParentProps {
  description: string[][],
  icon?: string,
  migrated: boolean,
  name: string[][],
  schema: Schema,
  template_pages?: string[]
}

export type TView = TableView | ListView | BoardView | GalleryView | CalendarView;

export interface TableView extends Node, ParentProps {
  name: string,
  type: 'table',
  page_sort: string[],
  format: {
    table_wrap: boolean,
    table_properties: ViewFormatProperties[]
  },
  query2?: {
    aggregations: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface ListView extends Node, ParentProps {
  name: string,
  type: 'list',
  format: {
    list_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface BoardView extends Node, ParentProps {
  type: 'board',
  format: {
    board_cover: ViewFormatCover,
    board_properties: ViewFormatProperties[],
    board_cover_aspect?: 'contain' | 'cover',
    board_cover_size?: 'small' | 'medium' | 'large',
    board_groups2: { hidden: boolean, property: string, value: { type: "select" | "multi_select", value: string } }[]
  },
  query2?: {
    aggregations: ViewAggregations[],
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
    group_by: string
  },
}

export interface GalleryView extends Node, ParentProps {
  type: 'gallery',
  format: {
    gallery_cover?: ViewFormatCover,
    gallery_cover_aspect?: 'contain' | 'cover',
    gallery_cover_size?: 'small' | 'medium' | 'large',
    gallery_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
  },
}

export interface CalendarView extends Node, ParentProps {
  type: 'calendar',
  format: {
    calendar_properties: ViewFormatProperties[]
  },
  query2?: {
    sort: ViewSorts[],
    filter: {
      filters: ViewFilters[]
    },
    calender_by: string
  },
}

export interface INotionUser {
  email: string,
  family_name: string,
  given_name: string,
  id: string,
  onboarding_completed: boolean,
  profile_photo: string,
  version: number
}

export interface ISpace extends CreateProps, LastEditedProps {
  beta_enabled: boolean,
  icon: string,
  id: string,
  invite_link_code: string,
  invite_link_enabled: boolean,
  name: string,
  pages: string[],
  permissions: Permission[],
  plan_type: "personal",
  shard_id: number,
  version: number
}

export interface ISpaceView extends Node {
  created_getting_started: true,
  created_onboarding_templates: true,
  joined: boolean,
  notify_desktop: true,
  notify_email: true,
  notify_mobile: true,
  sidebar_hidden_templates: string[],
  space_id: string,
  visited_templated: string[],
  bookmarked_pages: string[],
}

export interface ViewFormatProperties {
  width?: number,
  visible: boolean,
  property: string
}

export interface ViewAggregations {
  property: string,
  // ? Get all aggregator values
  aggregator: ViewAggregationsAggregators
}

export interface ViewSorts {
  property: string,
  direction: "ascending" | "descending"
}

export interface ViewFilters {

}

export interface UserRoot {
  id: string,
  space_views: string[],
  version: number,
  left_spaces: string[]
}

export interface IUserSettings {
  id: string,
  version: number,
  settings: IUserSettingsSettings
}

export interface IUserSettingsSettings {
  locale: TLocale,
  persona: 'personal',
  preferred_locale: TLocale,
  preferred_locale_origin: "autodetect",
  signup_time: number,
  start_day_of_week: number,
  time_zone: string,
  type: "personal",
  used_desktop_web_app: boolean
}

export interface Cursor {
  stack: Stack[][]
}

export interface Stack {
  id: string,
  index: number,
  table: 'block'
}

/*
  API Interfaces
*/

export interface CollectionViewData {
  [key: string]: {
    role: 'editor',
    value: ICollectionView
  }
};

export interface CollectionViewPageData {
  [key: string]: {
    role: 'editor',
    value: ICollectionViewPage
  }
};

export interface BlockData {
  [key: string]: {
    role: 'editor',
    value: TBlock
  }
}

export interface SpaceData {
  [key: string]: {
    role: 'editor',
    value: ISpace
  }
}

export interface SpaceViewData {
  [key: string]: {
    role: 'editor',
    value: ISpaceView
  }
}

export interface CollectionData {
  [key: string]: {
    role: 'editor',
    value: ICollection
  }
}

export interface ViewData {
  [key: string]: {
    role: 'editor',
    value: TableView | ListView | BoardView | CalendarView | GalleryView
  }
}

export interface NotionUserData {
  [key: string]: {
    role: 'editor',
    value: INotionUser
  }
}

export interface UserRootData {
  [key: string]: {
    role: 'editor',
    value: UserRoot
  }
}

export interface UserSettingsData {
  [key: string]: {
    role: 'editor',
    value: IUserSettings
  }
}

/* Api endpoint result */

export interface SetBookmarkMetadataParams {
  blockId: string,
  url: string
}

export interface QueryCollectionParams {
  collectionId: string,
  collectionViewId: string,
  query: {},
  loader: {
    limit: number,
    searchQuery: string,
    type: 'table'
  }
}

export interface SyncRecordValuesParams {
  id: string,
  table: OperationTable,
  version: number
}

export interface InviteGuestsToSpaceParams {
  blockId: string,
  permissionItems: Permission[],
  spaceId: string
}
export interface FindUserResult {
  value: {
    role: "reader",
    value: INotionUser
  }
}

export interface CreateSpaceParams {
  icon: string,
  initialUseCases: string[],
  name: string,
  planType: "personal"
}

export interface CreateSpaceResult {
  recordMap: {
    space: SpaceData
  },
  spaceId: string
}

export interface QueryCollectionResult {
  recordMap: RecordMap
}

export interface LoadUserContentResult {
  recordMap: RecordMap
}

export interface GetSpacesResult {
  [key: string]: RecordMap
}

export interface GetUserSharePagesResult {
  pages: { id: string, spaceId: string }[],
  recordMap: {
    block: BlockData,
    space: SpaceData,
  }
}

export interface EnqueueTaskResult {
  taskId: string
}

export interface SyncRecordValuesResult {
  recordMap: RecordMap
}

export interface EnqueueTaskParams {
  eventName: TaskType
}

export interface DuplicateBlockTaskParams extends EnqueueTaskParams {
  eventName: "duplicateBlock",
  request: {
    sourceBlockId: string,
    targetBlockId: string,
    addCopyName: boolean
  }
}

export interface ExportBlockTaskParams extends EnqueueTaskParams {
  eventName: "exportBlock",
  request: {
    blockId: string,
    exportOptions: {
      exportType: ExportType,
      locale: "en",
      timeZone: string
    },
    recursive: boolean
  }
}

export interface DeleteSpaceTaskParams extends EnqueueTaskParams {
  eventName: "deleteSpace",
  request: {
    spaceId: string
  }
}

export type TEnqueueTaskParams = DuplicateBlockTaskParams | ExportBlockTaskParams | DeleteSpaceTaskParams;

export interface LoadPageChunkParams {
  chunkNumber: 0,
  cursor: Cursor,
  limit: number,
  pageId: string,
  verticalColumns: boolean
}

export interface LoadPageChunkResult {
  cursor: Cursor,
  recordMap: RecordMap
}

export interface GetBackLinksForBlockResult {
  recordMap: {
    block: BlockData,
  }
}

export interface RecordMap {
  block: BlockData,
  collection: CollectionData,
  collection_view: ViewData,
  space: SpaceData,
  notion_user: NotionUserData,
  space_view: SpaceViewData,
  user_root: UserRootData,
  user_settings: UserSettingsData,
}

/* Nishan Specific */
export interface ICache {
  block: Map<string, TBlock>,
  collection: Map<string, ICollection>,
  collection_view: Map<string, TView>,
  space: Map<string, ISpace>,
  notion_user: Map<string, INotionUser>,
  space_view: Map<string, ISpaceView>,
  user_root: Map<string, UserRoot>,
  user_settings: Map<string, IUserSettings>,
}

export interface NishanArg {
  token: string,
  interval: number,
  user_id: string,
  shard_id: number,
  space_id: string,
  cache: ICache,
}

/* Function args */
export interface UserViewArg {
  id?: string,
  sorts?: [string, number][],
  aggregations?: [string, ViewAggregationsAggregators][],
  filters?: any,
  properties?: [string, number, number][],
  name: string,
  type: ViewType,
  wrap?: boolean
}


export interface CreateBlockArg {
  $block_id: string, type: IBlockType | "copy_indicator", properties?: any, format?: any, parent_id?: string
}
