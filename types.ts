export type SchemaUnitType = 'multi_select' | 'select' | 'number' | 'title' | 'checkbox' | 'formula' | 'relation' | 'rollup' | 'text' | 'date' | 'person' | 'file' | 'url' | 'email' | 'phone' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
export type Entity = BlockData | SpaceData | CollectionData;
export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;
export type OperationCommand = 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter' | 'listRemove' | 'listBefore';
export type OperationTable = 'space' | 'collection_view' | 'collection' | 'collection_view_page' | 'page' | 'block';
export type ViewAggregationsAggregators = "count" | "unique" | "count_values" | "not_empty" | "empty" | "percent_empty" | "percent_not_empty";
export type ViewType = 'table' | 'list' | 'board' | 'gallery' | 'calendar';
type ViewFormatCover = { type: 'page_content' | 'page_cover' } | { type: 'property', property: string };

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
    // ? TD: Add Options Color Enum 
    color: string
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
  role: 'editor',
  type: 'user_permission',
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
  type: 'page' | 'collection_view_page' | 'collection_view'
}

// ? TD: Page format and properties

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
  page_cover_position: number
}
export interface Page extends Block {
  properties: PageProps,
  type: 'page',
  content?: string[],
  format: PageFormat
}

export interface CollectionBlock extends Block {
  view_ids: string[],
  collection_id: string,
  type: 'collection_view' | 'collection_view_page'
}

export interface CollectionView extends CollectionBlock {
  type: 'collection_view',
}

export interface CollectionViewPage extends CollectionBlock {
  type: 'collection_view_page',
}

export type TCollectionBlock = CollectionView | CollectionViewPage;

export type BlockType = TCollectionBlock | Page;
export type ParentType = Page | Space;

export interface Collection extends Node, ParentProps {
  description: string[][],
  icon?: string,
  migrated: boolean,
  name: string[][],
  schema: Schema
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

export interface NotionUser {
  email: string,
  family_name: string,
  given_name: string,
  id: string,
  onboarding_completed: boolean,
  profile_photo: string,
  version: number
}

export interface Space extends CreateProps {
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

export interface SpaceView extends Node {
  created_getting_started: true,
  created_onboarding_templates: true,
  joined: boolean,
  notify_desktop: true,
  notify_email: true,
  notify_mobile: true,
  sidebar_hidden_templates: string[],
  space_id: string,
  visited_templated: string[]
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
  version: number
}

export interface UserSettings {
  locale: 'en-US' | 'en-GB',
  persona: 'personal'
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
    value: CollectionView
  }
};

export interface CollectionViewPageData {
  [key: string]: {
    role: 'editor',
    value: CollectionViewPage
  }
};

export interface BlockData {
  [key: string]: {
    role: 'editor',
    value: Page | CollectionView | CollectionViewPage
  }
}

export interface SpaceData {
  [key: string]: {
    role: 'editor',
    value: Space
  }
}

export interface SpaceViewData {
  [key: string]: {
    role: 'editor',
    value: SpaceView
  }
}

export interface CollectionData {
  [key: string]: {
    role: 'editor',
    value: Collection
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
    value: NotionUser
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
    value: {
      id: string,
      version: number,
      settings: UserSettings
    }
  }
}

/* Api endpoint result */

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
export interface Cache {
  block: Map<string, BlockType>,
  collection: Map<string, Collection>
  collection_view: Map<string, TView>,
  space: Map<string, Space>,
  notion_user: Map<string, NotionUser>,
  space_view: Map<string, SpaceView>,
  user_root: Map<string, UserRoot>,
  user_settings: Map<string, UserSettings>,
}

/*User custom View Arguments */
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