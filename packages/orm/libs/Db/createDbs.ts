import { NotionCore } from '@nishans/core';

export async function createDbs(
  titles: string[],
  space: InstanceType<typeof NotionCore.Api.Space>
) {
  const page_map = await space.createRootPages(
    titles.map((title) => ({
      type: 'page',
      contents: [],
      properties: {
        title: [[title]]
      }
    }))
  );
  return page_map.page;
}
