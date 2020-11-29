import colors from "colors"

import Nishan from '../../Nishan';
import Space from '../../api/Space';
import RootCollectionViewPage from '../../api/RootCollectionViewPage';

import "../env"

import Options from "./data/options";
import rows from "./data/row";
import { PageFormat, PageProps } from '../../types';
import Page from '../../api/Page';

// This method creates the root collection_view_page containing all the relevant stuffs
async function createWebRootCVP(space: Space) {
  return await space.createRootCollectionViewPage({
    properties: {
      title: [["Web 2.0"]]
    },
    format: {
      page_icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f310.svg"
    },
    schema: [{ name: "Title", type: "title" }, { name: "Competency", type: "number" }, { name: "Category", type: "select", options: Options.category }, { name: "Language", type: "select", options: Options.language }],
    views: [
      {
        type: "table",
        name: "Overview",
        view: [{
          type: "text",
          name: "Title",
          sort: "ascending",
          aggregation: "count",
          format: 150
        }, {
          type: "number",
          name: "Competency",
          format: 50,
          aggregation: "average",
        }, {
          type: "select",
          name: "Category",
          sort: ["ascending", 0],
          format: 200
        }, {
          type: "select",
          name: "Language",
          format: 200
        }]
      }
    ]
  })
}

async function createRows(root_cvp: RootCollectionViewPage) {
  const collection = await root_cvp.getCollection();
  const items: { format?: Partial<PageFormat>, properties: PageProps }[] = [];
  rows.forEach(({ language, image, title, category }) => {
    items.push({
      format: {
        page_icon: image,
        page_full_width: true,
      },
      properties: {
        title: [[title]],
        category: [[category]],
        language: [[language ?? ""]],
      }
    })
  });
  return await collection.createPages(items);
}

async function createContent(space: Space, pages: Page[]) {
  type root_cvp_titles_type = "Tasks" | "Articles" | "Reading List" | "Course List" | "Goals";

  const root_cvp_titles = ["Tasks", "Articles", "Reading List", "Course List", "Goals"] as root_cvp_titles_type[];

  const collection_ids: Record<root_cvp_titles_type, string> = {} as any;

  await space.getRootCollectionViewPage((collection_view_page) => {
    const collection = space.cache.collection.get(collection_view_page.collection_id);
    if (collection) {
      const index = root_cvp_titles.indexOf(collection.name[0][0] as any);
      if (index !== -1) collection_ids[collection?.name[0][0] as root_cvp_titles_type] = collection.id;
    }
  })

  for (let index = 0; index < pages.length; index++) {
    const page = pages[index];
    await page.createLinkedDBContents([
      {
        collection_id: collection_ids.Goals,
        views: [
          {
            type: "table",
            name: "Current Goals",
            view: [
              {
                type: "date",
                name: "Created",
                format: 200
              },
              {
                type: "date",
                name: "Completed At",
                format: 150
              },
              {
                type: "formula",
                name: "Progress",
                format: 50,
                aggregation: "average",
              },
              {
                type: "title",
                name: "Goal",
                aggregation: "count",
                format: 300
              },
              {
                type: "multi_select",
                name: "Purpose",
                aggregation: "unique",
                format: 100
              },
              {
                type: "multi_select",
                name: "Subject",
                aggregation: "unique",
                format: 100,
                filter: [["enum_contains", "exact", rows[index].title]]
              },
              {
                type: "multi_select",
                name: "Source",
                aggregation: "unique",
                format: 100
              },
              {
                type: "select",
                name: "Status",
                format: 150,
                filter: [["enum_is", "exact", "Completing"]]
              },
              {
                type: "rollup",
                name: "Total Tasks",
                format: 100,
                aggregation: "sum",
              },
              {
                type: "rollup",
                name: "Completed",
                format: 100,
                aggregation: "sum"
              },
              {
                type: "number",
                name: "Steps",
                format: 100,
                aggregation: "sum"
              },
              {
                type: "number",
                name: "Progress",
                sort: "descending",
                format: false,
                filter: [["number_does_not_equal", "exact", 100]]
              },
            ]
          }
        ]
      },
      {
        collection_id: collection_ids["Course List"],
        views: [
          {
            type: "gallery",
            name: "Completing Courses",
            gallery_cover: { property: "Cover", type: "property" },
            view: [
              {
                type: "title",
                name: "Name",
                sort: "ascending"
              },
              {
                type: "text",
                name: "Instructor"
              },
              {
                type: "select",
                name: "Publisher"
              },
              {
                type: "multi_select",
                name: "Topics",
                filter: [["enum_contains", "exact", rows[index].title]]
              },
              ...["Status", "Phase", "Priority"].map((name) => ({
                name,
                type: "select",
              } as const)),
              {
                type: "formula",
                sort: ["descending", 0],
                format: false,
                name: "Urgency",
              }
            ]
          }
        ]
      },
      {
        collection_id: collection_ids["Reading List"],
        views: [
          {
            type: "gallery",
            name: "Completing EBooks",
            gallery_cover: { property: "Cover", type: "property" },
            view: [
              {
                type: "title",
                name: "Name",
                sort: "ascending"
              },
              {
                type: "text",
                name: "Instructor"
              },
              {
                type: "select",
                name: "Publisher"
              },
              {
                type: "multi_select",
                name: "Topics",
                filter: [["enum_contains", "exact", rows[index].title]]
              },
              ...["Status", "Phase", "Priority"].map((name) => ({
                name,
                type: "select",
              } as const)),
              {
                type: "formula",
                sort: ["descending", 0],
                format: false,
                name: "Urgency",
              }
            ]
          }
        ]
      },
      {
        collection_id: collection_ids.Articles,
        views: [
          {
            type: "table",
            name: "Article Table",
            view: [
              {
                type: "title",
                name: "Title",
                aggregation: "count"
              },
              {
                type: "formula",
                name: "Urgency",
                sort: "ascending",
                format: 50
              },
              {
                type: "checkbox",
                name: "Completed",
                format: 100,
                aggregation: "percent_checked"
              },
              {
                type: "multi_select",
                name: "Subject",
                format: 200,
                filter: [["enum_contains", "exact", rows[index].title]]
              },
              {
                type: "select",
                name: "Provider",
                aggregation: "unique",
                format: 150
              },
              {
                type: "url",
                name: "Source",
                format: 300
              },
              ...["Priority", "Status", "Phase"].map((name) => ({ type: "select" as any, name, format: 150 })),
              ...["Learn", "Revise", "Practice"].map((name) => ({ type: "date" as any, name: `${name} Range`, format: 150, aggregation: "percent_not_empty", })),
            ]
          }
        ]
      },
      {
        collection_id: collection_ids.Tasks,
        views: [
          {
            type: "table",
            name: "Task Table",
            view: [
              {
                type: "date",
                name: "On",
                sort: "descending",
                format: [true, 250]
              },
              {
                type: "title",
                name: "Task",
                format: [true, 250],
                aggregation: "count"
              },
              { name: "Purpose", type: "select", format: [true, 100], aggregation: "unique" },
              { name: "Source", type: "select", format: [true, 100], aggregation: "unique" },
              { name: "Goals", type: "relation", format: [true, 300], aggregation: "count" },
              { name: "Steps", type: "number", format: [true, 50], aggregation: "sum" },
              { name: "Created", type: "created_time", format: false },
              { name: "Custom", type: "formula", format: false },
              { name: "Subject", type: "multi_select", format: false, aggregation: "unique", filter: [["enum_contains", "exact", rows[index].title]] },
            ]
          }
        ]
      },
    ])
    console.log(colors.bold.green(rows[index].title));
  }
}

async function main() {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000
  });

  // Get your own notion user and space
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  const root_cvp = await createWebRootCVP(space);
  const pages = await createRows(root_cvp);
  await createContent(space, pages);
}

main();