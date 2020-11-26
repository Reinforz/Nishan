import Nishan from '../../Nishan';
import colors from 'colors'
import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000
  });
  // Get your own notion user and space 
  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  await space.createRootCollectionViewPage({
    properties: {
      title: [["Web"]]
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
})