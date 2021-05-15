import { createDbs } from './createDbs';
import { deleteDbs } from './deleteDbs';
import { getTables } from './getTables';
import { updateDbs } from './updateDbs';

export const NotionOrmDb = {
  create: createDbs,
  getTables: getTables,
  delete: deleteDbs,
  update: updateDbs
};
