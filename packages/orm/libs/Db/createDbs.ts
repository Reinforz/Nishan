import { NotionCore } from '@nishans/core';
import { TTextFormat } from '@nishans/types';

export async function createDbs(
  titles: TTextFormat[],
  space: InstanceType<typeof NotionCore.Api.Space>
) {
  await space.createRootPages(
    titles.map((title) => ({
      type: 'page',
      contents: [],
      properties: {
        title
      }
    }))
  );
}
