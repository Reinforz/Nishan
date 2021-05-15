import { NotionCore } from '@nishans/core';
import {
  ICollectionViewPageUpdateInput,
  IPageUpdateInput
} from '@nishans/fabricator';
import { NotionLogger } from '@nishans/logger';
import { UpdateTypes } from '@nishans/traverser';
import { TPage } from '@nishans/types';

export async function updateDbs(
  tableUpdateInfos: [string, string][],
  space: InstanceType<typeof NotionCore.Api.Space>
) {
  const titles = tableUpdateInfos.map((tableUpdateInfo) => tableUpdateInfo[0]);
  const root_page_map = await space.getRootPages(
    (page) =>
      page.type === 'page' && titles.includes(page.properties.title[0][0])
  );
  const updateRootPagesInput: UpdateTypes<
    TPage,
    IPageUpdateInput | ICollectionViewPageUpdateInput
  > = [];

  titles.forEach((title, index) => {
    const root_page = root_page_map.page.get(title);
    if (!root_page) {
      const msg = `${title} database doesn't exist`;
      NotionLogger.error(msg);
    } else {
      updateRootPagesInput.push([
        root_page.id,
        {
          properties: {
            title: [[tableUpdateInfos[index][1]]]
          },
          type: 'page'
        }
      ]);
    }
  });

  const page_map = await space.updateRootPages(updateRootPagesInput);
  return page_map.page;
}
