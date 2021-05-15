import { NotionCore } from '@nishans/core';
import { NotionLogger } from '@nishans/logger';
import { ITableInfo } from '../';

export async function createTables(
  tableInfos: ITableInfo[],
  db: InstanceType<typeof NotionCore.Api.Page>
) {
  const tableInputMap: Record<string, true> = {};
  tableInfos.forEach((tableInfo) => (tableInputMap[tableInfo.name] = true));
  const block_map = await db.getBlock((block) => {
    if (block.type === 'collection_view_page') {
      const collection = db.cache.collection.get(block.collection_id)!;
      return tableInputMap[collection.name[0][0]];
    }
  });
  const collection_view_page_block_entries = Array.from(
    block_map.collection_view_page.entries()
  );

  if (collection_view_page_block_entries.length !== 0) {
    const collection = db.cache.collection.get(
      collection_view_page_block_entries[0][1].getCachedData().collection_id
    )!;
    const msg = `${collection.name[0][0]} database already exists`;
    NotionLogger.error(msg);
  }

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
