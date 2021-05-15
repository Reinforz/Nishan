import { createDbs } from './createDbs';
import { deleteDbs } from './deleteDbs';
import { getTables } from './getTables';

export const NotionOrmDb = {
  create: createDbs,
  getTables: getTables,
  delete: deleteDbs
};
