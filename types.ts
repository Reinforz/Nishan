interface ValueArg {
  id: string,
  value: string,
  color: string
};

type SchemaUnitType = 'numti_select' | 'select' | 'number' | 'title' | 'checkbox'

interface SchemaUnit {
  name: string,
  type: SchemaUnitType,
}

interface Schema {
  [key: string]: SchemaUnit
};

type Args = { value: ValueArg } | { schema: Schema } | string[][] | number;

interface Operation {
  table: 'collection' | 'block',
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

interface UserContent {
  recordMap: {
    block: {
      [key: string]: {
        role: 'editor',
        value: Block
      }
    },
    collection: {
      [key: string]: {
        role: 'editor',
        value: Collection
      }
    },
    notion_user: {
      [key: string]: {
        role: 'editor',
        value: NotionUser
      }
    },
    space: {
      [key: string]: {
        role: 'editor',
        value: Space
      }
    },
    space_view: {
      [key: string]: {
        role: 'editor',
        value: SpaceView
      }
    },
  }
} 