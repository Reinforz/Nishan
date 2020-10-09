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

interface SchemaArg {
  [key: string]: SchemaUnit
};

type Args = { value: ValueArg } | { schema: SchemaArg } | string[][] | number;

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

interface Block {
  alive: boolean,
  created_by_id: string,
  created_by_table: 'notion_user',
  created_time: number,
  id: string,
  last_edited_by_id: string,
  last_edited_by_table: 'notion_user',
  last_edited_time: number,
  parent_id: string,
  parent_table: 'block' | 'space',
  permission: Permission[],
  properties: {
    title: string[][]
  },
  shard_id: number,
  space_id: string,
  type: 'block' | 'page',
  version: number
}