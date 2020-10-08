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