import { NotionCore } from '@nishans/core';
import { ITableInfo } from '../';

export async function createTables(
  tableInfos: ITableInfo[],
  db: InstanceType<typeof NotionCore.Api.Page>
) {
  await db.createBlocks(
    tableInfos.map(({ name, schema }) => ({
      type: 'collection_view_page',
      name: [[name]],
      rows: [],
      views: [
        {
          type: 'table',
          name: 'Table View',
          schema_units: [
            {
              name: schema.find((schema) => schema.type === 'title')!.name,
              type: 'title'
            }
          ]
        }
      ],
      schema
    }))
  );
}
