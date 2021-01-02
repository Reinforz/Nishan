import Nishan from '../../packages/core/dist/Nishan';
import "../env"
import { v4 as uuidv4 } from "uuid";

const months = [
  ["January", 31],
  ["February", 29],
  ["March", 31],
  ["April", 30],
  ["May", 31],
  ["June", 30],
  ["July", 31],
  ["August", 30],
  ["September", 31],
  ["October", 30],
  ["November", 31],
  ["December", 30],
] as [string, number][];

(async function () {
  // Change the interval between each request to your desire, 
  // but be warned this might result in a 502 Bad Gateway error if too low

  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 500,
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

  const month_page_uuids = Array(12).fill(null).map(() => uuidv4())

  const { page: [page] } = await space.createTRootPages([
    {
      type: "page",
      properties: {
        title: [["Monthly Overview"]]
      },
      format: {
        page_full_width: true
      }
    }
  ]);

  const objfn = (name: string) => ({ name, type: "checkbox" as const, format: [true, 100] as [boolean, number] });

  for (let index = 0; index < month_page_uuids.length; index++) {
    const month_page_uuid = month_page_uuids[index], [month_name, month_days] = months[index], day_page_uuids = Array(month_days).fill(null).map(() => uuidv4())

    await page.createBlocks([{
      id: month_page_uuid,
      type: "page",
      format: {
        page_full_width: true
      },
      properties: {
        title: [[month_name]]
      },
      contents: Array(month_days).fill(null).map((_, i) => {
        const previous_id = day_page_uuids[i === 0 ? month_days - 1 : i - 1], next_id = day_page_uuids[i === month_days - 1 ? 0 : i + 1];
        i += 1;
        const date = `2020-${index + 1}-${i < 10 ? "0" + i : i}`;
        return {
          id: day_page_uuids[i - 1],
          type: "page",
          properties: {
            title: [[`Day ${i}`]]
          },
          format: {
            page_icon: "☝️",
            page_full_width: true
          },
          contents: [
            {
              type: "column_list",
              contents: [
                {
                  type: "link_to_page",
                  page_id: previous_id
                },
                {
                  type: "link_to_page",
                  page_id: next_id
                },
              ]
            },
            {
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
    }])

    console.log(`Done with ${month_name}`)
  };
}())