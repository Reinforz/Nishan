import Nishan from '../../Nishan';
import priority from '../data/priority';
import status from '../data/status';
import phase from '../data/phase';

import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000,
    logger: undefined
  });

  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  await space?.createRootCollectionViewPages([{
    properties: {
      title: [["Articles_"]]
    },
    format: {
      page_full_width: true,
      page_icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4d4.svg"
    },
    schema: [
      { type: "title", name: "Title" },
      {
        type: "formula",
        name: "Urgency"
      },
      {
        type: "formula",
        name: "Completed"
      },
      {
        type: "multi_select",
        name: "Subject",
        options: []
      },
      {
        type: "multi_select",
        name: "Provider",
        options: []
      },
      {
        type: "url",
        name: "Source"
      },
      {
        type: "select",
        name: "Priority",
        options: priority
      },
      {
        type: "select",
        name: "Status",
        options: status
      },
      {
        type: "select",
        name: "Phase",
        options: phase
      },
      {
        type: "date",
        name: "Learn Range",
      },
      {
        type: "date",
        name: "Revise Range",
      },
      {
        type: "date",
        name: "Practice Range",
      },
      {
        type: "formula",
        name: "Priority Counter",
      },
      {
        type: "formula",
        name: "Status Counter",
      },
      {
        type: "formula",
        name: "Phase Counter",
      }
    ],
    views: [
      {
        name: "Left Articles",
        type: "table",
        view: [
          {
            type: "title",
            format: 300,
            name: "Title"
          },
          {
            type: "formula",
            name: "Urgency"
          },
          {
            type: "formula",
            name: "Completed"
          },
          {
            type: "multi_select",
            name: "Subject"
          },
          {
            type: "multi_select",
            name: "Provider"
          },
          {
            type: "url",
            name: "Source"
          },
          {
            type: "select",
            name: "Priority",
          }
        ]
      }
    ]
  }])
}())