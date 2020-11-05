import { BlockData, SpaceData, CollectionData, ISpace, ISpaceView, INotionUser, IUserSettings, UserRoot, RecordMap } from "./api";
import { ICollection, ICollectionViewPage, IPage, IRootCollectionViewPage, IRootPage, TBlock } from "./block";

export type TGenericEmbedBlockType = "figma" | "tweet" | "codepen" | "gist" | "maps";
export type SchemaUnitType = 'multi_select' | 'select' | 'number' | 'title' | 'checkbox' | 'formula' | 'relation' | 'rollup' | 'text' | 'date' | 'person' | 'file' | 'url' | 'email' | 'phone' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
export type Entity = BlockData | SpaceData | CollectionData;
export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;
export type OperationCommand = 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter' | 'listRemove' | 'listBefore' | 'setPermissionItem'
export type OperationTable = 'space' | 'collection_view' | 'collection' | 'collection_view_page' | 'page' | 'block' | 'space_view' | 'notion_user' | 'user_settings' | 'user_root';
export type ViewAggregationsAggregators = "count" | "unique" | "count_values" | "not_empty" | "empty" | "percent_empty" | "percent_not_empty";
export type ViewType = 'table' | 'list' | 'board' | 'gallery' | 'calendar';
export type ViewFormatCover = { type: 'page_content' | 'page_cover' } | { type: 'property', property: string };
export type TMediaBlockType = 'code' | 'image' | 'video' | 'bookmark' | 'audio' | 'file';
export type TBasicBlockType = 'text' | 'header' | 'sub_header' | 'sub_sub_header' | 'to_do' | 'bulleted_list' | 'numbered_list' | 'toggle' | 'quote' | 'divider' | 'callout';
export type TAdvancedBlockType = 'table_of_contents' | 'equation' | 'factory' | 'breadcrumb';
export type TEmbedsBlockType = 'drive' | TGenericEmbedBlockType;
export type TBlockType = TEmbedsBlockType | TMediaBlockType | TBasicBlockType | TAdvancedBlockType | 'page' | 'collection_view_page' | 'collection_view' | 'link_to_page';
export type TextColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'teal' | 'blue' | 'purple' | "pink" | 'red';
export type BGColor = 'default_background' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'teal_background' | 'blue_background' | 'purple_background' | "pink_background" | 'red_background';
export type FormatBlockColor = TextColor | BGColor;
export type ExportType = "markdown" | "pdf" | "html";
export type TaskType = "deleteSpace" | "exportBlock" | "duplicateBlock";
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
export type Predicate<T> = (T: T, index: number) => Promise<boolean>;
export type TCreditType = "web_login" | "desktop_login" | "mobile_login";
export type TPlanType = "personal";
export type TCollectionViewBlock = "collection_view" | "collection_view_page";

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
  operations: IOperation[]
};

export interface IOperation {
  table: OperationTable,
  id: string,
  command: OperationCommand,
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

export interface Block extends Node, ParentProps, CreateProps, LastEditedProps {
  permission: IPermission[],
  shard_id: number,
  space_id: string,
  collection_id?: string,
  view_ids?: string[],
}

/* Block Specific Format and Properties */

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

export type TData = TBlock | ICollection | TView | ISpace | INotionUser | ISpaceView | UserRoot | IUserSettings
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
  id: string
}