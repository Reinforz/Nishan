import Nishan from '../../Nishan';
import Space from '../../api/Space';
import RootCollectionViewPage from '../../api/RootCollectionViewPage';

import "../env"

import Options from "./data/options";
import rows from "./data/row";
import { PageFormat, PageProps } from '../../types';

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
          aggregation: "count"
        }, {
          type: "number",
          name: "Competency",
          aggregation: "average",
        }, {
          type: "select",
          name: "Category",
        }, {
          type: "select",
          name: "Language"
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
  await collection.createRows(items);
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
  await createRows(root_cvp)
}

main();