import { createDbs } from './createDbs';
import { getTables } from './getTables';

export const NotionOrmDb = {
  create: createDbs,
  getTables: getTables
};
