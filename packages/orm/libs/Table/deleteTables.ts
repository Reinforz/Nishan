import { NotionCore } from '@nishans/core';

export async function deleteTables(
  tableNames: string[],
  db: InstanceType<typeof NotionCore.Api.Page>
) {
  await db.deleteBlocks((block) => {
    if (block.type === 'collection_view_page') {
      const collection = db.cache.collection.get(block.collection_id)!;
      return tableNames.includes(collection.name[0][0]);
    }
  });
}
