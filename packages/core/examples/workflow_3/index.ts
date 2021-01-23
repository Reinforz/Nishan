import { v4 as uuidv4 } from 'uuid';

import { ILinkedDBInput, IPageCreateInput, TViewCreateInput, CollectionViewPage, Page } from '../../src';
import { ecosystems, categories, subject } from '../data';
import { CommonMultiSelectSchema,status_phase_combos } from '../util';

function createLinkedDB(collection_id: string, cvp: 'EBooks' | 'Courses', title: string) {
  return {
    type: 'linked_db',
    collection_id,
    views: status_phase_combos.map(
      ([status, phase, geruund]) =>
      ({
        type: 'gallery',
        name: `${status} ${geruund} ${cvp}`,
        gallery_cover: { property: 'Cover', type: 'property' },
        schema_units: [
          {
            type: 'title',
            name: 'Title',
            sort: 'ascending'
          },
          {
            type: 'text',
            name: 'Instructor'
          },
          {
            type: 'select',
            name: 'Publisher'
          },
          {
            type: 'multi_select',
            name: 'Subject',
          },
          {
            name: 'Priority',
            type: 'select'
          },
        ],
        filters: [
          {
            type: "multi_select",
            name: "Subject",
            filter: {
              operator: "enum_contains",
              value: {
                value: title,
                type: "exact"
              }
            }
          },
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
      } as TViewCreateInput)
    )
  } as ILinkedDBInput;
}

export default async function workflow3(target_page: Page) {
  const { collection_view_page } = await target_page.getBlocks((block) => block.type === 'collection_view_page');
  const getCollectionId = (title: string) => (collection_view_page.get(title) as CollectionViewPage).getCachedData().collection_id;

  const articles_cvp_id = getCollectionId('Articles'),
    tasks_cvp_id = getCollectionId('Tasks'),
    goals_cvp_id = getCollectionId('Goals'),
    course_list_cvp_id = getCollectionId('Course List'),
    reading_list_cvp_id = getCollectionId('Reading List');

  function returnSubjectSlice(start: number, end: number) {
    return subject.slice(start, end).map(({ ecosystem, image, title, category }) => (
      {
        format: {
          page_icon: image,
          page_full_width: true,
        },
        properties: {
          title: [[title]],
          category: [[category.join(",")]],
          ecosystem: [[ecosystem?.join(",") ?? ""]],
        },
        contents: [
          {
            type: "linked_db",
            collection_id: goals_cvp_id,
            views: [
              {
                type: "table",
                name: "Current Goals",
                schema_units: [
                  {
                    type: "created_time",
                    name: "Created",
                    format: 200
                  },
                  {
                    type: "formula",
                    name: "Progress",
                    format: 100,
                    aggregation: "average",
                    sort: "descending"
                  },
                  {
                    type: "title",
                    name: "Goal",
                    aggregation: "count",
                    format: 300
                  },
                  ...CommonMultiSelectSchema,
                  {
                    type: "formula",
                    name: "Total Tasks",
                    format: 100,
                    aggregation: "sum",
                  },
                  {
                    type: "formula",
                    name: "Completed Steps",
                    format: 100,
                    aggregation: "sum"
                  },
                  {
                    type: "number",
                    name: "Total Steps",
                    format: 100,
                    aggregation: "sum"
                  },
                ],
                filters: [
                  {
                    type: "multi_select",
                    name: "Subject",
                    filter: {
                      operator: "enum_contains",
                      value: {
                        value: title,
                        type: "exact"
                      }
                    }
                  },
                  {
                    type: "number",
                    name: "Progress",
                    filter: {
                      operator: "number_less_than",
                      value: {
                        value: 100,
                        type: "exact"
                      }
                    }
                  },
                  {
                    type: "select",
                    name: "Status",
                    filter: {
                      operator: "enum_is",
                      value: {
                        type: "exact",
                        value: "Completing"
                      }
                    }
                  }
                ]
              },
              {
                type: "table",
                name: "Completed Goals",
                schema_units: [
                  {
                    type: "created_time",
                    name: "Created",
                    format: 200
                  },
                  {
                    type: "date",
                    name: "Completed At",
                    format: 150,
                    sort: "descending"
                  },
                  {
                    type: "title",
                    name: "Goal",
                    aggregation: "count",
                    format: 300
                  },
                  ...CommonMultiSelectSchema,
                  {
                    type: "formula",
                    name: "Total Tasks",
                    format: 100,
                    aggregation: "sum",
                  },
                  {
                    type: "number",
                    name: "Total Steps",
                    format: 100,
                    aggregation: "sum"
                  },
                ],
                filters: [
                  {
                    type: "multi_select",
                    name: "Subject",
                    filter: {
                      operator: "enum_contains",
                      value: {
                        value: title,
                        type: "exact"
                      }
                    }
                  },
                  {
                    type: "number",
                    name: "Progress",
                    filter: {
                      operator: "number_equals",
                      value: {
                        value: 100,
                        type: "exact"
                      }
                    }
                  },
                  {
                    type: "select",
                    name: "Status",
                    filter: {
                      operator: "enum_is",
                      value: {
                        type: "exact",
                        value: "Completed"
                      }
                    }
                  }
                ]
              }
            ]
          },
          createLinkedDB(course_list_cvp_id, "Courses", title),
          createLinkedDB(reading_list_cvp_id, "EBooks", title),
          {
            type: "linked_db",
            collection_id: articles_cvp_id,
            views: status_phase_combos.map(([status, phase, gerund]) => {
              const data: TViewCreateInput = {
                name: `${status} ${gerund} Articles`,
                type: 'table',
                schema_units: [
                  {
                    type: 'title',
                    format: 300,
                    name: 'Title',
                    sort: 'ascending',
                    aggregation: "count"
                  },
                  {
                    type: 'formula',
                    name: 'Urgency',
                    sort: ['descending', 0],
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
                    type: "multi_select",
                    name: "Subject",
                    filter: {
                      operator: "enum_contains",
                      value: {
                        value: title,
                        type: "exact"
                      }
                    }
                  },
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
          },
          {
            type: "linked_db",
            collection_id: tasks_cvp_id,
            views: [
              {
                type: "table",
                name: "Task Table",
                schema_units: [
                  {
                    type: "formula",
                    name: "On",
                    sort: "descending",
                    format: 250
                  },
                  {
                    type: "title",
                    name: "Task",
                    format: 250,
                    aggregation: "count"
                  },
                  { name: "Purpose", type: "select", format: 100, aggregation: "unique" },
                  { name: "Source", type: "select", format: 100, aggregation: "unique" },
                  { name: "Subject", type: "multi_select", aggregation: "unique" },
                ],
                filters: [
                  {
                    type: "multi_select",
                    name: "Subject",
                    filter: {
                      operator: "enum_contains",
                      value: {
                        value: title,
                        type: "exact"
                      }
                    }
                  },
                ]
              }
            ]
          },
        ]
      } as Omit<IPageCreateInput, "type">))
  }

  const { collection_view_page: created_collection_view_page } = await target_page.createBlocks([
    {
      type: 'collection_view_page',
      properties: {
        title: [['Web 3.0']]
      },
      icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f310.svg',
      schema: [
        { name: 'Title', type: 'title' },
        { name: 'Competency', type: 'number' },
        {
          name: 'Category',
          type: 'multi_select',
          options: categories.map(([value, color]) => ({ value, color, id: uuidv4() }))
        },
        {
          name: 'Ecosystem',
          type: 'multi_select',
          options: ecosystems.map(([value, color]) => ({ value, color, id: uuidv4() }))
        }
      ],
      views: [
        {
          type: 'table',
          name: 'Overview',
          schema_units: [
            {
              type: 'text',
              name: 'Title',
              sort: ['ascending', 0],
              aggregation: 'count',
              format: 250
            },
            {
              type: 'number',
              name: 'Competency',
              format: 50,
              aggregation: 'average'
            },
            {
              type: 'multi_select',
              name: 'Category',
              sort: 'ascending',
              format: 350
            },
            {
              type: 'multi_select',
              name: 'Ecosystem',
              format: 350
            }
          ]
        }
      ]
    }
  ]);
  await target_page.executeOperation();

  const Web3CVP = created_collection_view_page.get("Web 3.0");
  if (Web3CVP) {
    const Web3CVP_collection = await Web3CVP.getCollection()
    const total_batch = Math.floor(subject.length / 10);
    for (let index = 0; index <= total_batch; index++) {
      const start = (10 * index) + 1, end = start + 9;
      await Web3CVP_collection.createPages(returnSubjectSlice(start, end));
      console.log(`Deployed batch ${index + 1}`);
      await target_page.executeOperation();
    }
  }
}
