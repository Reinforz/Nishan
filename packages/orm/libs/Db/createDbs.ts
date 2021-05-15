import { NotionCore } from '@nishans/core';
import { NotionLogger } from '@nishans/logger';

export async function createDbs(
  titles: string[],
  space: InstanceType<typeof NotionCore.Api.Space>
) {
  const root_page_map = await space.getRootPage(
    (page) =>
      page.type === 'page' && titles.includes(page.properties.title[0][0])
  );
  const root_page_entries = Array.from(root_page_map.page.entries());

  if (root_page_entries.length !== 0) {
    const msg = `${
      root_page_entries[0][1].getCachedData().properties.title[0][0]
    } database already exists`;
    NotionLogger.error(msg);
  }
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
