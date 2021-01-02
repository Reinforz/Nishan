import { v4 as uuidv4 } from "uuid";

import Nishan from '../../packages/core/dist/Nishan';
import { CheckboxSchemaUnit, TSearchManipViewParam, ViewUpdateParam } from "../../packages/core/dist/Nishan";
import { status, phase, priority, subject, difficulty } from '../data';

import "../env"

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    interval: 1000,
  });

  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developer');

  await space?.createTRootPages([
    {
      type: "collection_view_page",
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
          options: subject.map(({ title, color }) => ({ value: title, color, id: uuidv4() }))
        },
        {
          type: "select",
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
          options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
        },
        {
          type: "select",
          name: "Status",
          options: status.map((status) => ({ ...status, id: uuidv4() }))
        },
        {
          type: "select",
          name: "Phase",
          options: phase.map((phase) => ({ ...phase, id: uuidv4() }))
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
        },
        {
          type: "checkbox",
          name: "Learned",
        },
        {
          type: "checkbox",
          name: "Revised",
        },
        {
          type: "checkbox",
          name: "Practiced",
        }
      ],
      views: [
        ...[
          ["To Complete", "Learn"], ["Completing", "Learn"], ["Completed", "Learn"],
          ["To Complete", "Revise"], ["Completing", "Revise"], ["Completed", "Revise"],
          ["To Complete", "Practice"], ["Completing", "Practice"], ["Completed", "Practice"]
        ].map(([status, phase]) => {
          return {
            name: `${status} ${phase} Articles`,
            type: "table",
            view: [
              {
                type: "title",
                format: 300,
                name: "Title",
                sort: 'ascending'
              },
              {
                type: "formula",
                name: "Urgency",
                sort: ["descending", 0],
                format: 50
              },
              {
                type: "formula",
                name: "Completed",
                format: 50
              },
              {
                type: "multi_select",
                name: "Subject",
                format: 150
              },
              {
                type: "select",
                name: "Provider",
                format: 100
              },
              {
                type: "url",
                name: "Source"
              },
              {
                type: "select",
                name: "Priority",
                format: 100
              },
              {
                type: "select",
                name: "Status",
                format: 100,
                filters: [{
                  operator: "enum_is",
                  type: "exact",
                  value: status
                }]
              },
              {
                type: "select",
                name: "Phase",
                format: 100,
                filters: [{
                  operator: "enum_is",
                  type: "exact",
                  value: phase
                }]
              },
            ]
          } as TSearchManipViewParam
        }) as [TSearchManipViewParam, ...TSearchManipViewParam[]]]
    }, {
      type: "collection_view_page",
      properties: {
        title: [["Todo_"]]
      },
      format: {
        page_full_width: true,
        page_icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/2611-fe0f.svg"
      },
      schema: [
        {
          type: "title",
          name: "Todo"
        },
        {
          type: "checkbox",
          name: "Done"
        },
        {
          type: "select",
          name: "Priority",
          options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
        },
        {
          type: "select",
          name: "Difficulty",
          options: difficulty.map((difficulty) => ({ ...difficulty, id: uuidv4() }))
        },
        {
          type: "formula",
          name: "Priority Counter",
        },
        {
          type: "formula",
          name: "Difficulty Counter",
        },
        {
          type: "date",
          name: "Completed At",
        },
      ],
      views: [
        {
          name: "Todo",
          type: "table",
          view: [
            {
              type: "title",
              format: 350,
              name: "Todo",
            },
            {
              type: "checkbox",
              name: "Done",
              format: 100,
              filters: [{ operator: "checkbox_is", type: "exact", value: false }]
            },
            {
              type: "select",
              name: "Priority",
            },
            {
              type: "select",
              name: "Difficulty",
            },
            {
              type: "date",
              name: "Completed At",
            },
            {
              type: "formula",
              name: "Priority Counter",
              sort: "descending",
              format: false
            },
            {
              type: "formula",
              name: "Difficulty Counter",
              sort: "ascending",
              format: false
            },
          ]
        }
      ]
    }, {
      type: "collection_view_page",
      properties: {
        title: [["Daily_"]]
      },
      format: {
        page_full_width: true,
      },
      schema: [
        {
          type: "title",
          name: "Date"
        },
        ...["Github", "Gmail", "Twitter", "Codepen", "Youtube", "Reddit", "Stack Overflow", "Hashnode", "Dev.to", "Medium", "Stackshare"].map(name => ({ type: "checkbox", name }) as CheckboxSchemaUnit)
      ],
      views: [
        {
          type: "table",
          name: "All",
          view: [
            {
              type: "title",
              name: "Date",
              sort: "descending",
              format: 150
            },
            ...["Github", "Gmail", "Twitter", "Codepen", "Youtube", "Reddit", "Stack Overflow", "Hashnode", "Dev.to", "Medium", "Stackshare"].map(name => ({ type: "checkbox", name, format: 100 }) as ViewUpdateParam),
          ]
        }
      ]
    }]);
}())