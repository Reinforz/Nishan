import Nishan from '../../Nishan';

import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 500
  });
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');
  const monthly_page = (await space.getRootPage((page) => {
    return page.properties.title[0][0] === 'Monthly';
  }));

  const tasks_collection_view_page = await space.getRootCollectionViewPage((collection_view_page) => {
    return space.cache.collection.get(collection_view_page.collection_id)?.name[0][0] === "Tasks"
  })

  const tasks_collection_id = (tasks_collection_view_page && space.cache.collection.get(tasks_collection_view_page.id)?.id) as string

  const november_db = await monthly_page?.getPageBlock(page => page.properties.title[0][0] === "November");

  for (let index = 1; index <= 1; index++) {
    const page = await november_db?.createPageContent({
      properties: {
        title: [[`Day ${index}`]]
      },
      format: {
        page_icon: "☝️",
        page_full_width: true
      }
    })
    const collection_block = await page?.createLinkedDBContent(tasks_collection_id);
    console.log(collection_block?.getCachedData());
  }
}())