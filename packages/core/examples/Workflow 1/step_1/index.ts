import { CheckboxSchemaUnit } from "@nishans/types";
import { v4 as uuidv4 } from 'uuid';
import Nishan, { Page, TViewCreateInput, TViewSchemaUnitsCreateInput } from '../../../src';
import '../../env';
import { difficulty, priority } from '../data';
import { adders, counterFormula, curriculumInfoSchemaUnits, propertyChecked, status_phase_combos } from '../util';

const daily_sites = [
	'Github',
	'Gmail',
	'Twitter',
	'Codepen',
	'Youtube',
	'Reddit',
	'Stack Overflow',
	'Hashnode',
	'Dev.to',
	'Medium',
	'Stackshare'
];

export default async function step1(user_family_name: string, space_name: string) {
	const nishan = new Nishan({
		token: process.env.NOTION_TOKEN as string,
    logger: false
  });

  const user = await nishan.getNotionUser((user) => user.family_name === user_family_name);
  
  const space = await user.getSpace((space) => space.name === space_name);
	const { page } = await space.createRootPages([
    {
      type: "page",
      properties: {
        title: [["Examples"]]
      },
      format:{
        page_full_width: true
      }
    }
  ]);

  const target_page = page.get("Examples");
	await target_page?.createBlocks([
    {
      type: 'collection_view_page',
      name: [ [ 'Articles' ] ],
      icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4d4.svg',
      schema: [
        {
          type: 'select',
          name: 'Provider',
          options: []
        },
        {
          type: 'url',
          name: 'Source'
        },
        ...curriculumInfoSchemaUnits
      ],
      views: [
        ...status_phase_combos.map(([ status, phase, gerund ]) => {
          const data: TViewCreateInput = {
            name: `${status} ${gerund} Articles`,
            type: 'table',
            schema_units: [
              {
                type: 'title',
                format: 300,
                name: 'Title',
                sort: 'ascending'
              },
              {
                type: 'formula',
                name: 'Urgency',
                sort: [ 'descending', 0 ],
                format: 50
              },
              {
                type: 'formula',
                name: 'Completed',
                format: 50
              },
              {
                type: 'multi_select',
                name: 'Subject',
                format: 150
              },
              {
                type: 'select',
                name: 'Provider',
                format: 100
              },
              {
                type: 'url',
                name: 'Source'
              },
              {
                type: 'select',
                name: 'Priority',
                format: 100
              },
              {
                type: 'select',
                name: 'Status',
                format: 100
              },
              {
                type: 'select',
                name: 'Phase',
                format: 100
              }
            ],
            filters: [
              {
                type: 'select',
                name: 'Phase',
                filter: {
                  operator: 'enum_is',
                  value: {
                    type: 'exact',
                    value: phase
                  }
                }
              },
              {
                type: 'select',
                name: 'Status',
                filter: {
                  operator: 'enum_is',
                  value: {
                    type: 'exact',
                    value: status
                  }
                }
              }
            ]
          };
          return data;
        })
      ]
    },
    {
      type: 'collection_view_page',
      name: [ [ 'Todo' ] ],
      icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/2611-fe0f.svg',
      schema: [
        {
          type: 'title',
          name: 'Todo'
        },
        
        {
          type: 'select',
          name: 'Priority',
          options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
        },
        {
          type: 'select',
          name: 'Difficulty',
          options: difficulty.map((difficulty) => ({ ...difficulty, id: uuidv4() }))
        },
        {
          type: 'date',
          name: 'Completed At'
        },
        {
          type: 'formula',
          name: 'Done',
          formula: [
            [ 'not', [['empty', [{ property: 'Completed At' }]]]]
          , 'array']
        },
        {
          type: 'formula',
          name: 'Priority Counter',
          formula: counterFormula('Priority', [ 'High', 'Medium' ])
        },
        {
          type: 'formula',
          name: 'Difficulty Counter',
          formula: counterFormula('Difficulty', [ 'Easy', 'Medium' ])
        },
        {
          type: 'formula',
          name: 'Urgency',
          formula: adders([{property: 'Difficulty Counter'}, {property: 'Priority Counter'}])
        },
      ],
      views: [
        {
          name: 'Todo',
          type: 'table',
          schema_units: [
            {
              type: 'title',
              format: 350,
              name: 'Todo'
            },
            {
              type: 'select',
              name: 'Priority'
            },
            {
              type: 'select',
              name: 'Difficulty'
            },
            {
              type: 'date',
              name: 'Completed At'
            },
            {
              type: 'formula',
              name: 'Urgency',
              format: false,
              sort: 'descending'
            },
            {
              type: 'formula',
              name: 'Done',
              format: false
            }
          ],
          filters: [
            {
              type: 'formula',
              name: 'Done',
              filter: {
                operator: 'checkbox_is',
                value: {
                  type: 'exact',
                  value: false
                }
              }
            }
          ]
        },
        {
          name: 'Done',
          type: 'table',
          schema_units: [
            {
              type: 'title',
              format: 350,
              name: 'Todo'
            },
            {
              type: 'select',
              name: 'Priority'
            },
            {
              type: 'select',
              name: 'Difficulty'
            },
            {
              type: 'date',
              name: 'Completed At',
              format: 150,
              sort: 'descending'
            },
            {
              type: 'formula',
              name: 'Done',
              format: false
            }
          ],
          filters: [
            {
              type: 'formula',
              name: 'Done',
              filter: { operator: 'checkbox_is', value: { type: 'exact', value: true } }
            }
          ]
        }
      ]
    },
    {
      type: 'collection_view_page',
      name: [ [ 'Daily' ] ],
      icon: "https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/270a-1f3fc.svg",
      schema: [
        {
          type: 'title',
          name: 'Date'
        },
        {
          type: 'date',
          name: 'Created At'
        },
        ...daily_sites.map((name) => ({ type: 'checkbox', name, aggregations: "checked" } as CheckboxSchemaUnit)),
        {
          type: "formula",
          name: "Total Checked",
          formula: adders(daily_sites.map(site => propertyChecked(site)))
        },
        {
          type: "formula",
          name: "Percentage Checked",
          formula: [[
            'round', [
              ['multiply', [
                ['divide', [
                  {
                    property: "Total Checked"
                  },
                  9
                ]],
                100
              ]
            ]]
          ],'array']
        }
      ],
      views: [
        {
          type: 'table',
          name: 'All',
          schema_units: [
            {
              type: 'title',
              name: 'Date',
              sort: 'descending',
              format: 150
            },
            {
              type: "formula",
              name: "Percentage Checked",
              format: 100
            },
            ...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
          ]
        },
        {
          type: 'table',
          name: 'Today',
          schema_units: [
            {
              type: 'title',
              name: 'Date'
            },
            {
              type: 'date',
              name: 'Created At',
              sort: 'descending',
              format: false
            },
            {
              type: "formula",
              name: "Percentage Checked",
              format: 100
            },
            ...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
          ],
          filters: [
            {
              type: 'date',
              name: 'Created At',
              filter: { operator: 'date_is', value: { value: 'today', type: 'relative' } }
            }
          ]
        },
        {
          type: 'table',
          name: 'Yesterday',
          schema_units: [
            {
              type: 'title',
              name: 'Date'
            },
            {
              type: 'date',
              name: 'Created At',
              sort: 'descending',
              format: false
            },
            {
              type: "formula",
              name: "Percentage Checked",
              format: 100
            },
            ...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
          ],
          filters: [
            {
              type: 'date',
              name: 'Created At',
              filter: { operator: 'date_is', value: { value: 'yesterday', type: 'relative' } }
            }
          ]
        },
        {
          type: 'table',
          name: 'One Week Ago',
          schema_units: [
            {
              type: 'title',
              name: 'Date',
              sort: "descending"
            },
            {
              type: 'date',
              name: 'Created At',
              sort: 'descending',
              format: false
            },
            {
              type: "formula",
              name: "Percentage Checked",
              format: 100
            },
            ...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
          ],
          filters: [
            {
              type: 'date',
              name: 'Created At',
              filter: { operator: 'date_is', value: { value: 'one_week_ago', type: 'relative' } }
            }
          ]
        }
      ]
    }
  ]);
  // fs.writeFileSync(__dirname+"/data.json", JSON.stringify(target_page?.stack), 'utf-8');
  await target_page?.Operations.executeOperation();
  return target_page as Page;
};
