import { NotionCore } from '@nishans/core';
import { NotionLogger } from '@nishans/logger';

export async function deleteDbs(
  titles: string[],
  space: InstanceType<typeof NotionCore.Api.Space>
) {
  const root_page_map = await space.getRootPages(
    (page) =>
      page.type === 'page' && titles.includes(page.properties.title[0][0])
  );
  titles.forEach((title) => {
    const root_page = root_page_map.page.get(title);
    if (!root_page) {
      const msg = `${title} database doesn't exist`;
      NotionLogger.error(msg);
    }
  });

  const page_map = await space.deleteRootPages(
    (page) =>
      page.type === 'page' && titles.includes(page.properties.title[0][0])
  );
  return page_map.page;
}
