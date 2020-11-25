import Nishan from '../../Nishan';
import colors from 'colors'
import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000
  });
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');
  const monthly_page = (await space.getRootPage((page) => {
    return page.properties.title[0][0] === 'Monthly';
  }));

  const november_db = await monthly_page?.getPageBlock(page => page.properties.title[0][0] === "November");

  for (let index = 1; index <= 30; index++) {
    const page = await november_db?.createPageContent({
      properties: {
        title: [[`Day ${index}`]]
      },
      format: {
        page_icon: "☝️",
        page_full_width: true
      }
    })

    async function getCollectionId(title: string) {
      const collection_view_page = await space.getRootCollectionViewPage((collection_view_page) => {
        return space.cache.collection.get(collection_view_page.collection_id)?.name[0][0] === title
      })
      return (await collection_view_page?.getCollection())?.id as string;
    }

    if (page) {
      const date = `2020-11-${index < 10 ? "0" + index : index}`;

      const objfn = (name: string) => ({ name, format: [true, 100] as [boolean, number] })

      const collection_ids = [await getCollectionId("Daily"), await getCollectionId("Tasks"), await getCollectionId("Todo")];

      await page?.createLinkedDBContents([{
        collection_id: collection_ids[0],
        views: [
          {
            type: "table",
            name: "Table View",
            view: [
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
            ]
          }
        ]
      }, {
        collection_id: collection_ids[1],
        views: [
          {
            type: "table",
            name: "Task Table",
            view: [
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
              { name: "Goals", format: [true, 300] },
              { name: "Steps", format: [true, 50], aggregation: "sum" },
              { name: "Created", format: false },
              { name: "Custom", format: false },
            ]
          }
        ]
      }, {
        collection_id: collection_ids[2],
        views: [
          {
            type: "table",
            name: "Table View",
            view: [
              {
                name: "Todo",
                format: [true, 300],
                aggregation: "count"
              },
              {
                name: "Done",
                format: false,
                filter: [["checkbox_is", "exact", true]]
              },
              {
                name: "Priority",
                format: [true, 150],
                aggregation: "unique"
              },
              {
                name: "Difficulty",
                format: [true, 150],
                aggregation: "unique"
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
                name: "Difficulty Order",
                format: false,
                sort: "descending"
              },
              {
                name: "Created At",
                format: false
              },
            ]
          }
        ]
      }]);
      console.log(colors.green.bold(`Done with Day:${date}`));
    }
  }
}())