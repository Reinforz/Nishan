import { v4 as uuidv4 } from "uuid";

import Nishan, { CheckboxSchemaUnit, TFormulaCreateInput, TSearchManipViewParam, ViewUpdateParam} from '@nishans/core';
import { status, phase, priority, subject, difficulty } from '../data';

import "../env"

function formulaUtil(property: string, levels: [string, string]): TFormulaCreateInput{
  return ['if', [
    ['equal', [{property}, levels[0]]],
    3,
    ['if', [
      ['equal', [{property}, levels[1]]],
      2,
      1
    ]]
  ]]
}

const daily_sites = ["Github", "Gmail", "Twitter", "Codepen", "Youtube", "Reddit", "Stack Overflow", "Hashnode", "Dev.to", "Medium", "Stackshare"];

(async function () {
  const nishan = new Nishan({
    token: process.env.NOTION_TOKEN as string,
    defaultExecutionState: false
  });

  const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
  const space = await user.getSpace((space) => space.name === 'Developers');
  const {page: [page]} = await space.getTRootPage(root_page=>root_page.type==="page" && root_page.properties.title[0][0] === "Hello");
  await page.createBlocks([{
    type: "page",
    properties: {
      title: [["Workflow 1"]]
    },
    contents: [
      {
        type: "collection_view_page",
        properties: {
          title: [["Articles"]]
        },
        format: {
          page_full_width: true,
          page_icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4d4.svg"
        },
        schema: [
          { type: "title", name: "Title" },
          {
            type: "multi_select",
            name: "Subject",
            options: subject.map(({ title, color }) => ({ value: title, color, id: uuidv4() }))
          },
          {
            type:"formula",
            name: "Urgency",
            formula: [
              'add', [{property: 'phase_counter'}, ['add', [{property: "status_counter"}, {property: "priority_counter"}]]]
            ]
          },
          {
            type: "formula",
            name: "Completed",
            formula: [
              'and', [{property: "revised"}, ['and', [{property: "practiced"}, {property: "learned"}]]]
            ]
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
            type: "formula",
            name: "Priority Counter",
            formula: formulaUtil('priority', ["High", "Medium"])
          },
          {
            type: "select",
            name: "Status",
            options: status.map((status) => ({ ...status, id: uuidv4() }))
          },
          {
            type: "formula",
            name: "Status Counter",
            formula: formulaUtil('status', ["Completing", "To Complete"])
          },
          {
            type: "select",
            name: "Phase",
            options: phase.map((phase) => ({ ...phase, id: uuidv4() }))
          },
          {
            type: "formula",
            name: "Phase Counter",
            formula: formulaUtil('phase', ["Practice", "Revise"])
          },
          {
            type: "date",
            name: "Learn Range",
          },
          {
            type: "checkbox",
            name: "Learned",
          },
          {
            type: "date",
            name: "Revise Range",
          },
          {
            type: "checkbox",
            name: "Revised",
          },
          {
            type: "date",
            name: "Practice Range",
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
                },{
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
      }, 
      {
        type: "collection_view_page",
        properties: {
          title: [["Todo"]]
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
            type:"formula",
            name: "Urgency",
            formula: ['add', [{property: "difficulty_counter"}, {property: "priority_counter"}]]
          },
          {
            type: "formula",
            name: "Done",
            formula: ['not', ['empty', {property: 'completed_at'}]]
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
            formula: formulaUtil("priority", ["High", "Medium"])
          },
          {
            type: "formula",
            name: "Difficulty Counter",
            formula: formulaUtil("difficulty", ["Easy", "Medium"])
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
                name: "Urgency",
                format: false,
                sort: "descending"
              },
              {
                type: "formula",
                name: "Done",
                format: false,
                filters: [{ operator: "checkbox_is", type: "exact", value: false }]
              },
            ] as any
          },
          {
            name: "Done",
            type: "table",
            view: [
              {
                type: "title",
                format: 350,
                name: "Todo",
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
                format: 150,
                sort: "descending"
              },
              {
                type: "formula",
                name: "Done",
                format: false,
                filters: [{ operator: "checkbox_is", type: "exact", value: true }]
              },
            ] as any
          }
        ]
      },
      {
        type: "collection_view_page",
        properties: {
          title: [["Daily"]]
        },
        format: {
          page_full_width: true,
        },
        schema: [
          {
            type: "title",
            name: "Date"
          },
          {
            type: "date",
            name: "Created At",
          },
          ...daily_sites.map(name => ({ type: "checkbox", name }) as CheckboxSchemaUnit)
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
              ...daily_sites.map(name => ({ type: "checkbox", name, format: 100 }) as ViewUpdateParam),
            ]
          },
          {
            type: "table",
            name: "Today",
            view: [
              {
                type: "title",
                name: "Date"
              },
              {
                type: "date",
                name: "Created At",
                sort: "descending",
                format: false,
                filters: [{operator: "date_is", value: "today", type: "relative"}]
              },
              ...daily_sites.map(name => ({ type: "checkbox", name, format: 100 }) as ViewUpdateParam),
            ]
          },
          {
            type: "table",
            name: "Yesterday",
            view: [
              {
                type: "title",
                name: "Date"
              },
              {
                type: "date",
                name: "Created At",
                sort: "descending",
                format: false,
                filters: [{operator: "date_is", value: "yesterday", type: "relative"}]
              },
              ...daily_sites.map(name => ({ type: "checkbox", name, format: 100 }) as ViewUpdateParam),
            ]
          },
          {
            type: "table",
            name: "One Week Ago",
            view: [
              {
                type: "title",
                name: "Date"
              },
              {
                type: "date",
                name: "Created At",
                sort: "descending",
                format: false,
                filters: [{operator: "date_is", value: "one_week_ago", type: "relative"}]
              },
              ...daily_sites.map(name => ({ type: "checkbox", name, format: 100 }) as ViewUpdateParam),
            ]
          },
        ]
      }
    ]
  }]);
  // page.printStack()
  await page.executeOperation();
}())