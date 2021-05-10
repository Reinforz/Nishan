import { createTables } from './createTables';
import { deleteTables } from './deleteTables';

export const NotionOrmTable = {
  create: createTables,
  delete: deleteTables
};
