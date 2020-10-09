interface ValueArg {
  id: string,
  value: string,
  color: string
};

type SchemaUnitType = 'multi_select' | 'select' | 'number' | 'title' | 'checkbox' | 'formula' | 'relation'

interface SchemaUnit {
  name: string,
  type: SchemaUnitType,
}

interface Schema {
  [key: string]: SchemaUnit
};

type Args = { value: ValueArg } | { schema: Schema } | string[][] | number;

interface Operation {
  table: 'collection' | 'block' | 'collection_view' | 'space',
  id: string,
  command: 'set' | 'update' | 'keyedObjectListAfter' | 'keyedObjectListUpdate' | 'listAfter',
  path: string[],
  args: Args
};

interface Transaction {
  id: string,
  shardId: number,
  spaceId: string,
  operations: Operation[]
};

interface Request {
  requestId: string,
  transactions: Transaction[]
};

interface Permission {
  role: 'editor',
  type: 'user_permission',
  user_id: string,
}

interface Node {
  alive: boolean,
  version: number,
  id: string,
  parent_id: string,
  parent_table: 'block' | 'space' | 'user_root',
}

interface CreatePropertie {
  created_by_id: string,
  created_by_table: 'notion_user',
  created_time: number,
}

interface LastEditedProperties {
  last_edited_by_id: string,
  last_edited_by_table: 'notion_user',
  last_edited_time: number,
}

interface Block extends Node, CreatePropertie, LastEditedProperties {
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

interface NotionUser {
  email: string,
  family_name: string,
  given_name: string,
  id: string,
  onboarding_completed: boolean,
  profile_photo: string,
  version: number
}

interface Space extends CreatePropertie {
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

interface Collection extends Node {
  description: string[][],
  icon: string,
  migrated: boolean,
  name: string[][],
  schema: Schema
}

interface SpaceView extends Node {
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

interface CollectionViewFormatTableProperties {
  width?: number,
  visible: boolean,
  property: string
}

interface CollectionViewFormat {
  table_properties: CollectionViewFormatTableProperties[],
  table_wrap: boolean
}

interface CollectionViewAggregation {
  property: string,
  aggregator: "count"
}

interface CollectionView extends Node {
  format: CollectionViewFormat,
  name: string,
  page_sort: string[],
  query2: {
    aggregation: CollectionViewAggregation[]
  },
  type: 'table'
}

interface UserRoot {
  id: string,
  space_views: string[],
  version: number
}

interface UserSettings {
  locale: 'en-US' | 'en-GB',
  persona: 'personal'
}

interface Cursor {
  stack: Stack[][]
}

interface Stack {
  id: string,
  index: number,
  table: 'block'
}
/*
  API Interfaces
*/

interface BlockData {
  [key: string]: {
    role: 'editor',
    value: Block
  }
}

interface SpaceData {
  [key: string]: {
    role: 'editor',
    value: Space
  }
}

interface SpaceViewData {
  [key: string]: {
    role: 'editor',
    value: SpaceView
  }
}

interface CollectionData {
  [key: string]: {
    role: 'editor',
    value: Collection
  }
}

interface CollectionViewData {
  [key: string]: {
    role: 'editor',
    value: CollectionView
  }
}

interface NotionUserData {
  [key: string]: {
    role: 'editor',
    value: NotionUser
  }
}

interface UserRootData {
  [key: string]: {
    role: 'editor',
    value: UserRoot
  }
}

interface UserSettingsData {
  [key: string]: {
    role: 'editor',
    value: {
      id: string,
      version: number,
      settings: UserSettings
    }
  }
}

interface GetUserContentRes {
  recordMap: UserContent
}

interface GetSpacesRes {
  // key is the id of the user
  [key: string]: UserContent
}

interface GetUserSharePagesRes {
  pages: { id: string, spaceId: string }[],
  recordMap: {
    block: BlockData,
    space: SpaceData,
  }
}

interface LoadPageChunkParam {
  chunkNumber: 0,
  cursor: Cursor,
  limit: number,
  pageId: string,
  verticalColumns: boolean
}

interface LoadPageChunkRes {
  cursor: Cursor,
  recordMap: {
    block: BlockData,
    collection: CollectionData
    collection_view: CollectionViewData,
    space: SpaceData,
  }
}

interface UserContent {
  block: BlockData,
  collection: CollectionData,
  notion_user: NotionUserData,
  space: SpaceData
  space_view: SpaceViewData,
  user_root: UserRootData,
  user_settings: UserSettingsData,
} 