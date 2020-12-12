import Nishan from '../../Nishan';
import "../env"

(async function () {
  // Change the interval between each request to your desire, 
  // but be warned this might result in a 502 Bad Gateway error
  // for me 1000ms works fine

  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000,
  });
  // Get your own notion user and space 
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  type root_cvp_titles_type = "Tasks" | "Articles" | "Daily" | "Todo";

  const root_cvp_titles = ["Tasks", "Articles", "Daily", "Todo"] as root_cvp_titles_type[];

  const collection_ids: Record<root_cvp_titles_type, string> = {} as any;

  await space.getRootCollections((collection) => {
    const index = root_cvp_titles.indexOf(collection.name[0][0] as any);
    if (index !== -1) collection_ids[collection?.name[0][0] as root_cvp_titles_type] = collection.id;
  })

  // Make sure Monthly page exists as a root page
  const { page: [monthly_page] } = (await space.getTRootPages((page) => {
    return page.type === "page" && page.properties.title[0][0] === 'Monthly'
  }));

  const objfn = (name: string) => ({ name, type: "checkbox" as const, format: [true, 100] as [boolean, number] })

  await monthly_page.createBlocks([
    {
      type: "page",
      properties: {
        title: [["December"]]
      },
      format: {
        page_full_width: true,
        page_icon: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0002/7590/brand.gif?itok=UMmhpECE"
      },
      contents: Array(31).fill(null).map((_, i) => {
        i += 1;
        const date = `2020-12-${i < 10 ? "0" + i : i}`;
        return {
          type: "page",
          properties: {
            title: [[`Day ${i}`]]
          },
          format: {
            page_icon: "☝️",
            page_full_width: true
          },
          contents: [{
            type: "linked_db",
            collection_id: collection_ids["Daily"],
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
            type: "linked_db",
            collection_id: collection_ids["Tasks"],
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
            type: "linked_db",
            collection_id: collection_ids["Todo"],
            views: [
              {
                type: "table",
                name: "Table View",
                view: [
                  {
                    name: "Todo",
                    format: [true, 300],
                    aggregation: "count",
                    type: "title"
                  },
                  {
                    name: "Done",
                    format: false,
                    filter: [["checkbox_is", "exact", true]],
                    type: "checkbox"
                  },
                  {
                    name: "Priority",
                    format: [true, 150],
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Difficulty",
                    format: [true, 150],
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Completed At",
                    format: false,
                    sort: "descending",
                    filter: [["date_is", "exact", {
                      start_date: date,
                      type: "date"
                    }]],
                    type: "date"
                  },
                  {
                    name: "Priority Order",
                    format: false,
                    sort: "descending",
                    type: "formula"
                  },
                  {
                    name: "Difficulty Order",
                    format: false,
                    sort: "descending",
                    type: "formula"
                  }
                ]
              }
            ]
          }, {
            type: "linked_db",
            collection_id: collection_ids["Articles"],
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
                    type: "title"
                  },
                  {
                    name: "Urgency",
                    format: 50,
                    sort: "descending",
                    aggregation: "average",
                    type: "number"
                  },
                  {
                    name: "Completed",
                    format: 50,
                    aggregation: "percent_checked",
                    type: "formula"
                  },
                  {
                    name: "Subject",
                    format: 150,
                    aggregation: "unique",
                    type: "multi_select"
                  },
                  {
                    name: "Provider",
                    format: 150,
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Source",
                    format: 350,
                    type: "url"
                  },
                  {
                    name: "Priority",
                    format: 150,
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Status",
                    format: 150,
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Phase",
                    format: 150,
                    aggregation: "unique",
                    type: "select"
                  },
                  {
                    name: "Learn Range",
                    format: 150,
                    aggregation: "percent_not_empty",
                    filter: [["date_is", "exact", {
                      type: "date",
                      start_date: date
                    }]],
                    type: "date"
                  },
                  {
                    name: "Revise Range",
                    format: 150,
                    aggregation: "percent_not_empty",
                    filter: [["date_is", "exact", {
                      type: "date",
                      start_date: date
                    }]],
                    type: "date"
                  },
                  {
                    name: "Practice Range",
                    format: 150,
                    aggregation: "percent_not_empty",
                    filter: [["date_is", "exact", {
                      type: "date",
                      start_date: date
                    }]],
                    type: "date"
                  },
                  {
                    name: "Priority Counter",
                    format: false,
                    type: "formula"
                  },
                  {
                    name: "Status Counter",
                    format: false,
                    type: "formula"
                  },
                  {
                    name: "Phase Counter",
                    format: false,
                    type: "formula"
                  },
                ]
              }
            ]
          }]
        }
      })
    }
  ]);
}())