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

  if (tasks_collection_view_page) {
    const tasks_collection_view_page_data = tasks_collection_view_page.getCachedData();
    const tasks_collection_id = tasks_collection_view_page_data.collection_id && space.cache.collection.get(tasks_collection_view_page_data.collection_id)?.id as string

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
      if (page) {
        const collection_block = await page.createLinkedDBContent(tasks_collection_id);
        const table_view = await collection_block.getTableView();
        await table_view.createFilters((schema) => schema.name === "On" ? ["date_is", "exact", {
          start_date: `2020-11-0${index + 1}`,
          type: "date"
        }
        ] : undefined)
        await table_view.createSort((schema) => schema.name === "On" ? ["ascending", 1] : undefined);

        const schema_unit_props: any = new Map(Object.entries(
          {
            "On": [250, true, 0],
            "Task": [350, true, 1],
            "Purpose": [150, true, 2],
            "Subject": [350, true, 3],
            "Source": [150, true, 4],
            "Goals": [350, true, 5],
            "Steps": [50, true, 6],
            "Created": [250, false, 7],
            "Custom": [250, false, 8],
          }
        ));

        await table_view.updateFormatProperties((schema) => {
          return schema_unit_props.get(schema.name)
        });
      }
    }
  }
}())