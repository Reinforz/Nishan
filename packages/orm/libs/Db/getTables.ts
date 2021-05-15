import { NotionCore } from '@nishans/core';

export async function getTables(db: InstanceType<typeof NotionCore.Api.Page>) {
  const block_map = await db.getBlocks(
    (block) => block.type === 'collection_view_page'
  );
  return block_map.collection_view_page;
}
