import { TBlockInput } from '@nishans/fabricator';
import { v4 as uuidv4 } from 'uuid';
import { CollectionViewPage, Page } from '../../../libs';
import { CommonMultiSelectSchema, goalViewItem } from '../util';

const months = [
  ['January', 31],
  ['February', 29],
  ['March', 31],
  ['April', 30],
  ['May', 31],
  ['June', 30],
  ['July', 31],
  ['August', 30],
  ['September', 31],
  ['October', 30],
  ['November', 31],
  ['December', 30]
] as [string, number][];

export default async function step4(target_page: Page) {

  const { collection_view_page } = await target_page.getBlocks((block) => block.type === 'collection_view_page');
  const getCollectionId = (title: string) =>
    (collection_view_page.get(title) as CollectionViewPage).getCachedData().collection_id;

  const articles_cvp_id = getCollectionId('Articles'),
    daily_cvp_id = getCollectionId('Daily'),
    tasks_cvp_id = getCollectionId('Tasks'),
    todo_cvp_id = getCollectionId('Todo');

  const { page } = await target_page.createBlocks([
    {
      type: 'page',
      properties: {
        title: [['Yearly Overview']]
      },
      format: {
        page_full_width: true
      },
      contents: []
    }
  ]);

  const yearly_page = page.get("Yearly Overview");
  if (yearly_page) {
    for (let year = 2020; year <= 2021; year++) {
      const month_page_uuids = Array(12).fill(null).map(() => uuidv4())

      const checkboxSchemaUnit = (name: string) => ({ name, type: "checkbox" as const, format: [true, 100] as [boolean, number] });
      const { page } = await yearly_page.createBlocks([
        {
          type: 'page',
          properties: {
            title: [[year.toString()]]
          },
          format: {
            page_full_width: true
          },
          contents: []
        },
      ]);

      const year_page = page.get(year.toString());
      if (year_page) {
        for (let index = 0; index < month_page_uuids.length; index++) {
          const month_page_uuid = month_page_uuids[index], [month_name, month_days] = months[index], day_page_uuids = Array(month_days).fill(null).map(() => uuidv4())
          await year_page.createBlocks([{
            id: month_page_uuid,
            type: "page",
            format: {
              page_full_width: true
            },
            properties: {
              title: [[month_name]]
            },
            contents: Array(month_days).fill(null).map((_, i) => {
              const previous_id = day_page_uuids[i === 0 ? month_days - 1 : i - 1], next_id = day_page_uuids[i === month_days - 1 ? 0 : i + 1];
              i += 1;
              const date = `${year}-${index + 1}-${i < 10 ? "0" + i : i}`;
              return {
                id: day_page_uuids[i - 1],
                type: "page",
                properties: {
                  title: [[`Day ${i}`]]
                },
                format: {
                  page_icon: "☝️",
                  page_full_width: true
                },
                contents: [
                  {
                    type: "column_list",
                    contents: [
                      {
                        type: "link_to_page",
                        page_id: previous_id
                      },
                      {
                        type: "link_to_page",
                        page_id: next_id
                      },
                    ]
                  },
                  {
                    type: "linked_db",
                    collection_id: daily_cvp_id,
                    views: [
                      {
                        type: "table",
                        name: "Table View",
                        schema_units: [
                          {
                            type: "title",
                            name: "Date",
                            format: [true, 150],
                          },
                          checkboxSchemaUnit("Github"),
                          checkboxSchemaUnit("Gmail"),
                          checkboxSchemaUnit("Twitter"),
                          checkboxSchemaUnit("Codepen"),
                          checkboxSchemaUnit("Youtube"),
                          checkboxSchemaUnit("Reddit"),
                          checkboxSchemaUnit("Stack Overflow"),
                          checkboxSchemaUnit("Hashnode"),
                          checkboxSchemaUnit("Dev.to"),
                          checkboxSchemaUnit("Medium"),
                          checkboxSchemaUnit("Stackshare"),
                          checkboxSchemaUnit("Percentage Checked")
                        ],
                        filters: [
                          {
                            type: "title",
                            name: "Date",
                            filter: {
                              operator: "string_is",
                              value: {
                                type: "exact",
                                value: date
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: "linked_db",
                    collection_id: tasks_cvp_id,
                    views: [
                      {
                        type: 'table',
                        name: "Tasks",
                        schema_units: [
                          {
                            type: 'formula',
                            name: 'On',
                            sort: 'descending'
                          },
                          {
                            type: 'title',
                            name: 'Task',
                            format: 300,
                            aggregation: 'count'
                          },
                          ...CommonMultiSelectSchema,
                          ...goalViewItem(1),
                          ...goalViewItem(2),
                          ...goalViewItem(3)
                        ],
                        filters: [
                          {
                            name: "On",
                            filter: {
                              operator: "date_is",
                              value: {
                                type: "exact",
                                value: {
                                  start_date: date,
                                  type: "date"
                                }
                              }
                            },
                            type: "formula"
                          },
                        ]
                      }
                    ]
                  },
                  {
                    type: "linked_db",
                    collection_id: todo_cvp_id,
                    views: [
                      {
                        type: "table",
                        name: "Table View",
                        schema_units: [
                          {
                            name: "Todo",
                            format: 300,
                            aggregation: "count",
                            type: "title",
                            sort: "ascending"
                          },
                          {
                            name: "Priority",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                          {
                            name: "Difficulty",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                        ],
                        filters: [
                          {
                            name: "Completed At",
                            filter: {
                              operator: "date_is",
                              value: {
                                type: "exact",
                                value: {
                                  start_date: date,
                                  type: "date"
                                }
                              }
                            },
                            type: "date"
                          },
                          {
                            name: "Done",
                            type: "formula",
                            filter: {
                              operator: "checkbox_is",
                              value: {
                                type: "exact",
                                value: true
                              }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: "linked_db",
                    collection_id: articles_cvp_id,
                    views: [
                      {
                        filter_operator: "or",
                        type: "table",
                        name: "Article Table",
                        schema_units: [
                          {
                            name: "Title",
                            aggregation: "count",
                            type: "title"
                          },
                          {
                            name: "Urgency",
                            format: 50,
                            sort: "descending",
                            aggregation: "average",
                            type: "number"
                          },
                          {
                            name: "Completed",
                            format: 50,
                            aggregation: "percent_checked",
                            type: "formula"
                          },
                          {
                            name: "Subject",
                            format: 150,
                            aggregation: "unique",
                            type: "multi_select"
                          },
                          {
                            name: "Provider",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                          {
                            name: "Source",
                            format: 350,
                            type: "url"
                          },
                          {
                            name: "Priority",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                          {
                            name: "Status",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                          {
                            name: "Phase",
                            format: 150,
                            aggregation: "unique",
                            type: "select"
                          },
                          {
                            name: "Learn Range",
                            format: 150,
                            aggregation: "percent_not_empty",
                            type: "date"
                          },
                          {
                            name: "Revise Range",
                            type: "date",
                            format: 150,
                            aggregation: "percent_not_empty"
                          },
                          {
                            name: "Practice Range",
                            format: 150,
                            aggregation: "percent_not_empty",
                            type: "date"
                          },
                        ],
                        filters: [
                          {
                            name: "Learn Range",
                            type: "date",
                            filter: {
                              operator: "date_is",
                              value: {
                                type: "exact",
                                value: {
                                  type: "date",
                                  start_date: date
                                }
                              }
                            }
                          },
                          {
                            name: "Revise Range",
                            type: "date",
                            filter: {
                              operator: "date_is",
                              value: {
                                type: "exact",
                                value: {
                                  type: "date",
                                  start_date: date
                                }
                              }
                            }
                          },
                          {
                            name: "Practice Range",
                            type: "date",
                            filter: {
                              operator: "date_is",
                              value: {
                                type: "exact",
                                value: {
                                  type: "date",
                                  start_date: date
                                }
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              } as TBlockInput
            })
          }])
          console.log(`Done with ${month_name}, ${year}`)
        };
      }
    }
  }
};
