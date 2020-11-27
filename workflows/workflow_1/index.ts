import Nishan from '../../Nishan';
import colors from 'colors'
import "../env"

(async function () {
  // Change the interval between each request to your desire, 
  // but be warned this might result in a 502 Bad Gateway error
  // for me 1000ms works fine

  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000
  });
  // Get your own notion user and space 
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  // Make sure Monthly page exists as a root page
  const monthly_page = (await space.getRootPage((page) => {
    return page.properties.title[0][0] === 'Monthly';
  }));

  // Make sure November page exists inside monthly page
  const november_db = await monthly_page?.getPageBlock(page => page.properties.title[0][0] === "November");

  for (let index = 25; index <= 25; index++) {
    // Add your specific title and page_icon
    const page = await november_db?.createPageContent({
      properties: {
        title: [[`Day ${index}`]]
      },
      format: {
        page_icon: "☝️",
        page_full_width: true
      }
    })

    async function getRootCVPCollectionId(title: string) {
      const collection_view_page = await space.getRootCollectionViewPage((collection_view_page) => {
        return space.cache.collection.get(collection_view_page.collection_id)?.name[0][0] === title
      })
      return (await collection_view_page?.getCollection())?.id as string;
    }

    if (page) {
      const date = `2020-11-${index < 10 ? "0" + index : index}`;

      const objfn = (name: string) => ({ name, type: "checkbox" as const, format: [true, 100] as [boolean, number] })

      // collection_id of all the collection corresponding to the collection_view_pages with the mentioned titles
      const collection_ids = [await getRootCVPCollectionId("Daily"), await getRootCVPCollectionId("Tasks"), await getRootCVPCollectionId("Todo"), await getRootCVPCollectionId("Articles")];

      // Add any sort of views you want
      // A simple table works best for me
      await page?.createLinkedDBContents([{
        collection_id: collection_ids[0],
        views: [
          {
            // You can modify the view type, name etc
            type: "table",
            name: "Table View",
            view: [
              // This is the order the properties will be stored in the view
              {
                type: "title",
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
                type: "number",
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
                // Add your specific sort, filter, format and aggregation
                type: "date",
                name: "On",
                sort: "ascending",
                filter: [["date_is", "exact", {
                  start_date: date,
                  type: "date"
                }]],
                format: [true, 250]
              },
              {
                type: "title",
                name: "Task",
                format: [true, 250],
                aggregation: "count"
              },
              { name: "Purpose", type: "select", format: [true, 150], aggregation: "unique" },
              { name: "Subject", type: "select", format: [true, 350], aggregation: "unique" },
              { name: "Source", type: "select", format: [true, 150], aggregation: "unique" },
              { name: "Goals", type: "relation", format: [true, 300] },
              { name: "Steps", type: "number", format: [true, 50], aggregation: "sum" },
              { name: "Created", type: "created_time", format: false },
              { name: "Custom", type: "formula", format: false },
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
              }
            ]
          }
        ]
      }, {
        collection_id: collection_ids[3],
        views: [
          {
            filter_operator: "or",
            type: "table",
            name: "Article Table",
            view: [
              {
                name: "Title",
                format: 250,
                aggregation: "count",
              },
              {
                name: "Urgency",
                format: 50,
                sort: "descending",
                aggregation: "average"
              },
              {
                name: "Completed",
                format: 50,
                aggregation: "percent_checked"
              },
              {
                name: "Subject",
                format: 150,
                aggregation: "unique"
              },
              {
                name: "Provider",
                format: 150,
                aggregation: "unique"
              },
              {
                name: "Source",
                format: 350,
              },
              {
                name: "Priority",
                format: 150,
                aggregation: "unique"
              },
              {
                name: "Status",
                format: 150,
                aggregation: "unique"
              },
              {
                name: "Phase",
                format: 150,
                aggregation: "unique"
              },
              {
                name: "Learn Date",
                format: 150,
                aggregation: "percent_not_empty",
                filter: [["date_is", "exact", {
                  type: "date",
                  start_date: date
                }]]
              },
              {
                name: "Revise Date",
                format: 150,
                aggregation: "percent_not_empty",
                filter: [["date_is", "exact", {
                  type: "date",
                  start_date: date
                }]]
              },
              {
                name: "Practice Date",
                format: 150,
                aggregation: "percent_not_empty",
                filter: [["date_is", "exact", {
                  type: "date",
                  start_date: date
                }]]
              },
              {
                name: "Priority Counter",
                format: false,
              },
              {
                name: "Status Counter",
                format: false,
              },
              {
                name: "Phase Counter",
                format: false,
              },
            ]
          }
        ]
      }]);
      console.log(colors.green.bold(`Done with Day:${date}`));
    }
  }
}())