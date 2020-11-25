import Nishan from '../../Nishan';
import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1500
  });
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');
  const monthly_page = (await space.getRootPage((page) => {
    return page.properties.title[0][0] === 'Monthly';
  }));

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

    async function getTableView(title: string) {
      const collection_view_page = await space.getRootCollectionViewPage((collection_view_page) => {
        return space.cache.collection.get(collection_view_page.collection_id)?.name[0][0] === title
      })

      const collection_view_page_data = collection_view_page?.getCachedData();
      const collection_id = (collection_view_page_data?.collection_id && space.cache.collection.get(collection_view_page_data.collection_id)?.id) as string;
      const collection_block = await page?.createLinkedDBContent(collection_id);
      return await collection_block?.getTableView();
    }

    if (page) {
      const date = `2020-11-${index < 10 ? "0" + index : index}`;

      const objfn = (name: string) => ({ name, format: [true, 100] as [boolean, number] })

      const daily_table_view = await getTableView("Daily");

      await daily_table_view?.update([
        {
          name: "Date",
          filter: [["string_is", "exact", date]],
          format: [true, 150],
        },
        objfn("Github"),
        objfn("GMail"),
        objfn("Twitter"),
        objfn("Codepen"),
        objfn("Youtube"),
        objfn("Reddit"),
        objfn("Stack Overflow"),
        objfn("Hashnode"),
        objfn("Dev.to"),
        objfn("Medium"),
        objfn("Stackshare"),
        objfn("Percentage"),
        {
          name: "Total",
          format: false
        }
      ]);

      const tasks_table_view = await getTableView("Tasks");
      await tasks_table_view?.update([
        {
          name: "On",
          sort: "ascending",
          filter: [["date_is", "exact", {
            start_date: date,
            type: "date"
          }]],
          format: [true, 250]
        },
        {
          name: "Task",
          format: [true, 250],
          aggregation: "count"
        },
        { name: "Purpose", format: [true, 150], aggregation: "unique" },
        { name: "Subject", format: [true, 350], aggregation: "unique" },
        { name: "Source", format: [true, 150], aggregation: "unique" },
        { name: "Goals", format: [true, 350] },
        { name: "Steps", format: [true, 50], aggregation: "sum" },
        { name: "Created", format: false },
        { name: "Custom", format: false },
      ])

      const todo_table_view = await getTableView("Todo");
      await todo_table_view?.update([
        {
          name: "Todo",
          format: [true, 300]
        },
        {
          name: "Done",
          format: 50,
          filter: [["checkbox_is", "exact", true]]
        },
        {
          name: "Priority",
          format: [true, 150]
        },
        {
          name: "Completed At",
          format: false,
          sort: "descending",
          filter: [["date_is", "exact", {
            start_date: date,
            type: "date"
          }]]
        },
        {
          name: "Priority Order",
          format: false,
          sort: "descending"
        },
        {
          name: "Created At",
          format: false
        },
      ])

      console.log(`Done with Day:${date}`);
    }
  }
}())