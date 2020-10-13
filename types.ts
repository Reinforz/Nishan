export interface ValueArg {
  id: string,
  value: string,
  color: string
};

type SchemaUnitType = 'multi_select' | 'select' | 'number' | 'title' | 'checkbox' | 'formula' | 'relation'

export type Entity = BlockData | SpaceData | CollectionData;
export interface SchemaUnit {
  name: string,
  type: SchemaUnitType,
}

export interface Schema {
  [key: string]: SchemaUnit
};

export type Args = any /* string | { value: ValueArg } | { schema: Schema } | string[][] | number */;
export type Command = 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter' | 'listRemove' | 'listBefore';
export type Table = 'space' | 'collection_view' | 'collection' | 'collection_view_page' | 'page' | 'block';

export interface Operation {
  table: Table,
  id: string,
  command: Command,
  path: string[],
  args: Args
};

export interface Transaction {
  id: string,
  shardId: number,
  spaceId: string,
  operations: Operation[]
};

export interface Request {
  requestId: string,
  transactions: Transaction[]
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
  parent_id: string,
  parent_table: 'block' | 'space' | 'user_root',
}

export interface CreateProperties {
  created_by_id: string,
  created_by_table: 'notion_user',
  created_time: number,
}

export interface LastEditedProperties {
  last_edited_by_id: string,
  last_edited_by_table: 'notion_user',
  last_edited_time: number,
}

export interface Block extends Node, CreateProperties, LastEditedProperties {
  permission: Permission[],
  properties: {
    title: string[][]
  },
  shard_id: number,
  space_id: string,
  type: 'block' | 'page',
  collection_id?: string,
  view_ids?: string[]
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

export interface Space extends CreateProperties {
  beta_enabled: boolean,
  icon: string,
  id: string,
  invite_link_code: string,
  invite_link_enabled: boolean,
  name: string,
  pages: string[],
  permission: Permission[],
  plan_type: "personal",
  shard_id: number,
  version: number
}

export interface Collection extends Node {
  description: string[][],
  icon: string,
  migrated: boolean,
  name: string[][],
  schema: Schema
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

export interface CollectionViewFormatTableProperties {
  width?: number,
  visible: boolean,
  property: string
}

export interface CollectionViewFormat {
  table_properties: CollectionViewFormatTableProperties[],
  table_wrap: boolean
}

export interface CollectionViewAggregation {
  property: string,
  aggregator: "count"
}

export interface CollectionView extends Node {
  format: CollectionViewFormat,
  name: string,
  page_sort: string[],
  query2: {
    aggregation: CollectionViewAggregation[]
  },
  type: 'table'
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

export interface BlockData {
  [key: string]: {
    role: 'editor',
    value: Block
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

export interface CollectionViewData {
  [key: string]: {
    role: 'editor',
    value: CollectionView
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

export interface LoadUserContentResult {
  recordMap: UserContent
}

export interface GetSpacesRes {
  // key is the id of the user
  [key: string]: UserContent
}

export interface GetUserSharePagesRes {
  pages: { id: string, spaceId: string }[],
  recordMap: {
    block: BlockData,
    space: SpaceData,
  }
}

export interface LoadPageChunkParam {
  chunkNumber: 0,
  cursor: Cursor,
  limit: number,
  pageId: string,
  verticalColumns: boolean
}

export interface LoadPageChunkRes {
  cursor: Cursor,
  recordMap: {
    block: BlockData,
    collection: CollectionData
    collection_view: CollectionViewData,
    space: SpaceData,
  }
}

export interface UserContent {
  block: BlockData,
  collection: CollectionData,
  notion_user: NotionUserData,
  space: SpaceData
  space_view: SpaceViewData,
  user_root: UserRootData,
  user_settings: UserSettingsData,
} 