import Nishan from '../../Nishan';
import "../env"
import Space from '../../api/Space';

// This method creates the root collection_view_page containing all the relevant stuffs
async function createWebRootCVP(space: Space) {
  await space.createRootCollectionViewPage({
    properties: {
      title: [["Web 2.0"]]
    },
    format: {
      page_icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f310.svg"
    },
    schema: [{ name: "Title", type: "title" }, { name: "Competency", type: "number" }, { name: "Category", type: "select", options: [] }, { name: "Language", type: "select", options: [] }],
    views: [
      {
        type: "table",
        name: "Overview",
        view: [{
          name: "Title",
          aggregation: "count"
        }, {
          name: "Competency",
          aggregation: "average",
        }, {
          name: "Category",
        }, {
          name: "Language"
        }]
      }
    ]
  })
}

async function main() {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000
  });

  // Get your own notion user and space
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  await createWebRootCVP(space);
}

main();