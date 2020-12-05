import { TView } from ".";
import { BlockData, SpaceData, CollectionData, ISpace, ISpaceView, INotionUser, IUserSettings, IUserRoot, RecordMap } from "./api";
import { ICollection, ICollectionViewPage, IPage, IRootCollectionViewPage, IRootPage, TBlock } from "./block";

export type TGenericEmbedBlockType = "figma" | "tweet" | "codepen" | "gist" | "maps";
export type Entity = BlockData | SpaceData | CollectionData;
export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;
export type TOperationCommand = 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter' | 'listRemove' | 'listBefore' | 'setPermissionItem'
export type TOperationTable = 'space' | 'collection_view' | 'collection' | 'collection_view_page' | 'page' | 'block' | 'space_view' | 'notion_user' | 'user_settings' | 'user_root';
export type TViewType = 'table' | 'list' | 'board' | 'gallery' | 'calendar' | 'timeline';
export type TViewFormatCover = { type: 'page_content' | 'page_cover' } | { type: 'property', property: string };
export type TMediaBlockType = 'code' | 'image' | 'video' | 'bookmark' | 'audio' | 'file';
export type TBasicBlockType = 'text' | 'header' | 'sub_header' | 'sub_sub_header' | 'to_do' | 'bulleted_list' | 'numbered_list' | 'toggle' | 'quote' | 'divider' | 'callout';
export type TAdvancedBlockType = 'table_of_contents' | 'equation' | 'factory' | 'breadcrumb';
export type TEmbedsBlockType = 'embed' | 'drive' | TGenericEmbedBlockType;
export type TBlockType = TEmbedsBlockType | TMediaBlockType | TBasicBlockType | TAdvancedBlockType | 'page' | 'collection_view_page' | 'collection_view' | 'link_to_page';
export type TTextColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | "pink" | 'red';
export type TBGColor = 'default_background' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'teal_background' | 'blue_background' | 'purple_background' | "pink_background" | 'red_background';
export type TFormatBlockColor = TTextColor | TBGColor;
export type TExportType = "markdown" | "pdf" | "html";
export type TTaskType = "deleteSpace" | "exportBlock" | "duplicateBlock";
export type TLocale = 'en-US' | 'ko-KR';
export type TPermissionRole = 'editor' | 'read_and_write' | 'comment_only' | 'reader' | 'none';
export type TPermissionType = 'user_permission' | 'space_permission' | 'public_permission';
export type TPage = IPage | IRootPage | ICollectionViewPage;
export type TRootPage = IRootPage | IRootCollectionViewPage;
export type TCodeLanguage = "ABAP" | "Arduino" | "Bash" | "BASIC" | "C" | "Clojure" | "CoffeeScript" | "C++" | "C#" | "CSS" | "Dart" | "Diff" | "Docker" | "Elixir" | "Elm" | "Erlang" | "Flow" | "Fortran" | "F#" | "Gherkin" | "GLSL" | "Go" | "GraphQL" | "Groovy" | "Haskell" | "HTML" | "Java" | "JavaScript" | "JSON" | "Kotlin" | "LaTeX" | "Less" | "Lisp" | "LiveScript" | "Lua" | "Makefile" | "Markdown" | "Markup" | "MATLAB" | "Nix" | "Objective-C" | "OCaml" | "Pascal" | "Perl" | "PHP" | "Plain Text" | "PowerShell" | "Prolog" | "Python" | "R" | "Reason" | "Ruby" | "Rust" | "Sass" | "Scala" | "Scheme" | "Scss" | "Shell" | "SQL" | "Swift" | "TypeScript" | "VB.Net" | "Verilog" | "VHDL" | "Visual Basic" | "WebAssembly" | "XML" | "YAML";
export type TDateType = "date" | "datetimerange" | "datetime" | "daterange";
export type TDateFormat = "YYYY/MM/DD" | "ll" | "MM/DD/YYYY" | "DD/MM/YYYY" | "relative";
export type TTimeFormat = "H:mm" | "LT";
export type TDateReminderUnit = "day" | "hour" | "minute";
export type TDataType = keyof RecordMap;
export type TCreditType = "web_login" | "desktop_login" | "mobile_login";
export type TPlanType = "personal";
export type TCollectionViewBlock = "collection_view" | "collection_view_page";
export type TSortValue = "ascending" | "descending";

export interface GoogleDriveFileUser {
  displayName: string,
  emailAddress: string,
  kind: "drive#user",
  me: boolean,
  permissionId: string,
  photoLink: string
}

export interface GoogleDriveFile {
  iconLink: string,
  id: string,
  lastModifyingUser: GoogleDriveFileUser,
  mimeType: string,
  modifiedTime: string,
  name: string,
  thumbnailVersion: "0",
  trashed: boolean,
  webViewLink: string
}

export interface Token {
  id: string,
  accessToken: string
}

export interface Account {
  accountId: string,
  accountName: string,
  token: Token
}

export interface IDateReminder {
  time?: string,
  unit: TDateReminderUnit,
  value: number
}

export interface Date {
  date_format: TDateFormat,
  type: TDateType,
  start_date: string,
  time_format: TTimeFormat,
  reminder: IDateReminder
}

export interface IDate extends Date {
  type: "date",
}

export interface IDateTime extends Date {
  type: "datetime",
  start_time: string,
  time_zone: string,
}

export interface IDateTimeRange extends Date {
  type: "datetimerange",
  end_date: string,
  start_time: string,
  end_time: string,
  time_zone: string,
}

export interface IDateRange extends Date {
  type: "daterange",
  end_date: string
}

export interface ValueArg {
  id: string,
  value: string,
  color: string
};

export interface Request {
  requestId: string,
  transactions: Transaction[]
};

export interface Transaction {
  id: string,
  shardId: number,
  spaceId: string,
  operations: IOperation[]
};

export interface IOperation {
  table: TOperationTable,
  id: string,
  command: TOperationCommand,
  path: string[],
  args: Args
};

export interface IPermission {
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

export interface IBlock extends Node, ParentProps, CreateProps, LastEditedProps {
  permission: IPermission[],
  shard_id: number,
  space_id: string,
  collection_id?: string,
  view_ids?: string[],
}

export interface Cursor {
  stack: Stack[][]
}

export interface Stack {
  id: string,
  index: number,
  table: 'block'
}

/* Api endpoint result */

/* Nishan Specific */

export type TData = TBlock | ICollection | TView | ISpace | INotionUser | ISpaceView | IUserRoot | IUserSettings
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

export type Logger = false | ((method: "CREATE" | "READ" | "UPDATE" | "DELETE", subject: "NotionUser" | "View" | "Block" | "Space" | "UserSettings" | "UserRoot" | "RootPage" | "RowPage" | "SchemaUnit" | "NestedPage" | "CollectionView" | "CollectionViewPage" | "Collection" | "SpaceView", id: string) => void)
export interface NishanArg {
  token: string,
  interval: number,
  user_id: string,
  shard_id: number,
  space_id: string,
  cache: ICache,
  id: string,
  logger: Logger
}