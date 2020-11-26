import Nishan from '../../Nishan';
import "../env"
import Space from '../../api/Space';

async function createWebRootCVP(space: Space) {
  const root_cvp = await space.createRootCollectionViewPage({
    properties: {
      title: [["Web 2.0"]]
    },
    format: {
      page_icon: "🌎"
    },
    schema: [["Title", "title"]],
    views: [
      {
        type: "table",
        name: "Table View",
        view: [{
          name: "Title",
          aggregation: "count"
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