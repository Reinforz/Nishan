import { ICache } from '@nishans/cache';
import {
  IBoardViewFormat,
  IBoardViewQuery2,
  ICalendarViewFormat,
  ICalendarViewQuery2,
  IGalleryViewFormat,
  IGalleryViewQuery2,
  IListViewFormat,
  IListViewQuery2,
  IOperation,
  ITableViewFormat,
  ITableViewQuery2,
  ITimelineViewFormat,
  ITimelineViewQuery2,
  Schema,
  ViewSorts
} from '@nishans/types';
import { v4 } from 'uuid';
import { populateSchemaMap } from "../../../src";
import {
  createViews,
  generateViewData,
  populateNonIncludedProperties,
  populateQuery2SortAndAggregations,
  populateViewFormat,
  populateViewProperties,
  populateViewQuery2
} from '../../../utils/CreateData/createViews';
import { createDefaultCache } from '../../createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

const schema: Schema = {
	title: {
		type: 'title',
		name: 'Title'
	},
	number: {
		type: 'number',
		name: 'Number'
	},
	text: {
		type: 'text',
		name: 'Text'
	},
	file: {
		type: 'file',
		name: 'File'
	},
	date: {
		type: 'date',
		name: 'Date'
	},
	select: {
		type: 'select',
		name: 'Select',
		options: [
			{
				color: 'red',
				id: '123',
				value: '123'
			}
		]
	},
	date_formula: {
		type: 'formula',
		name: 'Date Formula',
		formula: {
			type: 'function',
			name: 'now',
			result_type: 'date'
		}
	}
};

const schema_map = populateSchemaMap(schema);

describe('populateViewQuery2', () => {
	describe('Table view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should output correctly for table view custom input`, () => {
					const query2 = populateViewQuery2({
						type: 'table'
					}) as ITableViewQuery2;
					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            sort: [],
            aggregations: []
          });
				});
			});
		});
	});

	describe('List view', () => {
		describe('Output correctly', () => {
			describe('Custom Input', () => {
				it(`Should output correctly for list view custom input`, () => {
					const query2 = populateViewQuery2({
						type: 'list',
						filter_operator: 'or'
					}) as IListViewQuery2;
					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'or',
              filters: []
            },
            sort: []
          });
				});
			});
		});
	});

	describe('Board view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should output correctly for Board view custom input`, () => {
					const query2 = populateViewQuery2(
						{
							type: 'board',
							group_by: 'Select'
						},
						schema_map
					) as IBoardViewQuery2;

					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            aggregations: [],
            sort: [],
            group_by: 'select'
          });
				});
			});
		});

		describe('Throw error', () => {
			it(`Should throw error for using unknown property referenced in board view`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'board',
							group_by: 'unknown'
						},
						schema_map
					)
				).toThrow(`Unknown property unknown referenced in group_by`);
			});

			it(`Should throw error if schema doesnot contain any select | multiselect`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'board',
							group_by: 'Text'
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in group_by is not of the supported types\nGiven type: text\nSupported types: select | multi_select`
				);
			});
		});
	});

	describe('Calendar view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should output correctly for calendar view(date property)`, () => {
					const query2 = populateViewQuery2(
						{
							type: 'calendar',
							calendar_by: 'Date'
						},
						schema_map
					) as ICalendarViewQuery2;
					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            sort: [],
            calendar_by: 'date'
          });
				});

				it(`Should output correctly for calendar view(formula.date property)`, () => {
					const query2 = populateViewQuery2(
						{
							type: 'calendar',
							calendar_by: 'Date Formula'
						},
						schema_map
					) as ICalendarViewQuery2;

					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            sort: [],
            calendar_by: 'date_formula'
          });
				});
			});
		});

		describe('Throw error', () => {
			it(`Should throw error for unknown property reference`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'calendar',
							calendar_by: 'unknown'
						},
						schema_map
					)
				).toThrow(`Unknown property unknown referenced in calendar_by`);
			});

			it(`Should throw error if property is of unsupported type`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'calendar',
							calendar_by: 'Text'
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in calendar_by is not of the supported types\nGiven type: text\nSupported types: last_edited_time | created_time | date | formula`
				);
			});
		});
	});

	describe('Gallery view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for gallery view`, () => {
					const query2 = populateViewQuery2({
						type: 'gallery'
					}) as IGalleryViewQuery2;
					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            sort: []
          });
				});
			});
		});
	});

	describe('Timeline', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for timeline view(Date property)`, () => {
					const query2 = populateViewQuery2(
						{
							type: 'timeline',
							timeline_by: 'Date'
						},
						schema_map
					) as ITimelineViewQuery2;

					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            timeline_by: 'date',
            sort: [],
            aggregations: []
          });
				});

				it(`Should output correctly for calendar view(formula.date property)`, () => {
					const query2 = populateViewQuery2(
						{
							type: 'timeline',
							timeline_by: 'Date Formula'
						},
						schema_map
					) as ITimelineViewQuery2;
					expect(
						query2
					).toStrictEqual({
            filter: {
              operator: 'and',
              filters: []
            },
            sort: [],
            timeline_by: 'date_formula',
            aggregations: []
          });
				});
			});
		});

		describe('Throw error', () => {
			it(`Should throw error for unknown property reference`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'timeline',
							timeline_by: 'unknown'
						},
						schema_map
					)
				).toThrow(`Unknown property unknown referenced in timeline_by`);
			});

			it(`Should throw error if property is of unsupported type`, () => {
				expect(() =>
					populateViewQuery2(
						{
							type: 'timeline',
							timeline_by: 'Text'
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in timeline_by is not of the supported types\nGiven type: text\nSupported types: last_edited_time | created_time | date | formula`
				);
			});
		});
	});
});

describe('populateViewFormat', () => {
	describe('Table view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for table view`, () => {
					const format = populateViewFormat({
						type: 'table',
						table_wrap: false
					}) as ITableViewFormat;

					expect(
						format
					).toStrictEqual({
            table_properties: [],
            table_wrap: false
          });
				});
			});

			describe('Default input', () => {
				it(`Should work for table view`, () => {
					const format = populateViewFormat({
						type: 'table'
					}) as ITableViewFormat;

					expect(
						format
					).toStrictEqual({
            table_properties: [],
            table_wrap: false
          });
				});
			});
		});
	});

	describe('List view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for list view`, () => {
					const format = populateViewFormat({
						type: 'list'
					}) as IListViewFormat;

					expect(
						format
					).toStrictEqual({
            list_properties: []
          });
				});
			});
		});
	});

	describe('Calendar view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for calendar view`, () => {
					const format = populateViewFormat({
						type: 'calendar'
					}) as ICalendarViewFormat;

					expect(
						format
					).toStrictEqual({
            calendar_properties: []
          });
				});
			});
		});
	});

	describe('Gallery view', () => {
		describe('output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for gallery_cover=property`, () => {
					const format = populateViewFormat(
						{
							type: 'gallery',
							gallery_cover: {
								property: 'File',
								type: 'property'
							},
							gallery_cover_aspect: 'cover',
							gallery_cover_size: 'medium'
						},
						schema_map
					) as IGalleryViewFormat;

					expect(
						format
					).toStrictEqual({
            gallery_cover: {
              property: 'file',
              type: 'property'
            },
            gallery_properties: [],
            gallery_cover_aspect: 'cover',
            gallery_cover_size: 'medium'
          });
				});

				it(`Should work for gallery_cover=page_cover`, () => {
					const format = populateViewFormat(
						{
							type: 'gallery',
							gallery_cover: {
								type: 'page_cover'
							},
							gallery_cover_aspect: 'cover',
							gallery_cover_size: 'medium'
						},
						schema_map
					) as IGalleryViewFormat;

					expect(
						format
					).toStrictEqual({
            gallery_cover: {
              type: 'page_cover'
            },
            gallery_properties: [],
            gallery_cover_aspect: 'cover',
            gallery_cover_size: 'medium'
          });
				});
			});

			describe('Default input', () => {
				it(`Should work for gallery view (default)`, () => {
					const format = populateViewFormat(
						{
							type: 'gallery'
						},
						schema_map
					) as IGalleryViewFormat;

					expect(
						format
					).toStrictEqual({
            gallery_cover: { type: 'page_cover' },
            gallery_properties: [],
            gallery_cover_aspect: 'contain',
            gallery_cover_size: 'large'
          });
				});
			});
		});

		describe('Throw error', () => {
			it(`Should throw error for gallery view (unknown property referenced)`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'gallery',
							gallery_cover: {
								property: 'unknown',
								type: 'property'
							}
						},
						schema_map
					)
				).toThrow(`Unknown property unknown referenced in gallery_cover.property`);
			});

			it(`Should throw error for gallery view (property not of type file)`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'gallery',
							gallery_cover: {
								property: 'Text',
								type: 'property'
							}
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in gallery_cover.property is not of the supported types\nGiven type: text\nSupported types: file`
				);
			});
		});
	});

	describe('timeline view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should work for timeline view`, () => {
					const format = populateViewFormat(
						{
							type: 'timeline',
							timeline_show_table: true,
							timeline_preference: {
								centerTimestamp: 2,
								zoomLevel: 'month'
							}
						},
						schema_map
					) as ITimelineViewFormat;

					expect(
						format
					).toStrictEqual({
            timeline_table_properties: [],
            timeline_properties: [],
            timeline_show_table: true,
            timeline_preference: {
              centerTimestamp: 2,
              zoomLevel: 'month'
            }
          });
				});
			});
			describe('Default input', () => {
				it(`Should work for timeline view (default)`, () => {
					const format = populateViewFormat(
						{
							type: 'timeline'
						},
						schema_map
					) as ITimelineViewFormat;

					expect(
						format
					).toStrictEqual({
            timeline_table_properties: [],
            timeline_properties: [],
            timeline_show_table: true,
            timeline_preference: {
              centerTimestamp: 1,
              zoomLevel: 'month'
            }
          });
				});
			});
		});
	});

	describe('board view', () => {
		describe('Output Correct', () => {
			describe('Custom input', () => {
				it(`Should output correctly for custom input board_cover=property`, () => {
					const format = populateViewFormat(
						{
							type: 'board',
							board_cover: {
								property: 'File',
								type: 'property'
							},
							board_cover_aspect: 'cover',
							board_cover_size: 'medium',
							board_groups2: [
								{
									hidden: false,
									property: 'Select',
									value: {
										type: 'select',
										value: '123'
									}
								}
							]
						},
						schema_map
					) as IBoardViewFormat;

					expect(
						format
					).toStrictEqual({
            board_cover: {
              property: 'file',
              type: 'property'
            },
            board_properties: [],
            board_cover_aspect: 'cover',
            board_cover_size: 'medium',
            board_groups2: [
              {
                hidden: false,
                property: 'select',
                value: {
                  type: 'select',
                  value: '123'
                }
              }
            ]
          });
				});

				it(`Should work for board_cover=page_cover`, () => {
					const format = populateViewFormat(
						{
							type: 'board',
							board_cover: {
								type: 'page_cover'
							},
							board_cover_aspect: 'cover',
							board_cover_size: 'medium'
						},
						schema_map
					) as IBoardViewFormat;

					expect(
						format
					).toEqual(expect.objectContaining({
            board_cover: {
              type: 'page_cover'
            },
            board_properties: [],
            board_cover_aspect: 'cover',
            board_cover_size: 'medium'
          }));
				});
			});

			describe('Default input', () => {
				it(`Should work with default input for gallery view`, () => {
					const format = populateViewFormat(
						{
							type: 'board'
						},
						schema_map
					) as IBoardViewFormat;

					expect(
						format
					).toStrictEqual({
            board_cover: { type: 'page_cover' },
            board_properties: [],
            board_cover_aspect: 'contain',
            board_cover_size: 'large',
            board_groups2: [
              {
                hidden: false,
                property: 'select',
                value: {
                  type: 'select'
                }
              },
              {
                hidden: false,
                property: 'select',
                value: {
                  type: 'select',
                  value: '123'
                }
              }
            ]
          });
				});
			});
		});

		describe('Throw error', () => {
			it(`Should throw an error if custom groups2 property is referencing unknown property`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'board',
							board_cover: {
								property: 'File',
								type: 'property'
							},
							board_cover_aspect: 'cover',
							board_cover_size: 'medium',
							board_groups2: [
								{
									hidden: false,
									property: 'unknown',
									value: {
										type: 'select',
										value: '123'
									}
								}
							]
						},
						schema_map
					)
				).toThrow(`Unknown property unknown referenced in board_groups2.[0].property`);
			});

			it(`Should throw an error if custom groups2 property is referencing unsupported type property`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'board',
							board_cover: {
								property: 'File',
								type: 'property'
							},
							board_cover_aspect: 'cover',
							board_cover_size: 'medium',
							board_groups2: [
								{
									hidden: false,
									property: 'Text',
									value: {
										type: 'select',
										value: '123'
									}
								}
							]
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in board_groups2.[0].property is not of the supported types\nGiven type: text\nSupported types: select | multi_select`
				);
			});

			it(`Should throw error for board view (property not of type file)`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'board',
							board_cover: {
								property: 'Text',
								type: 'property'
							}
						},
						schema_map
					)
				).toThrow(
					`Property Text referenced in board_cover.property is not of the supported types\nGiven type: text\nSupported types: file`
				);
			});

			it(`Should throw error for board view (unknown property referenced)`, () => {
				expect(() =>
					populateViewFormat(
						{
							type: 'board',
							board_cover: {
								property: 'file',
								type: 'property'
							}
						},
						schema_map
					)
				).toThrow(`Unknown property file referenced in board_cover.property`);
			});

			it(`Should throw error for board view (schema doesnot contain any select or multiselect)`, () => {
				const custom_schema = JSON.parse(JSON.stringify(schema));
				delete custom_schema.select;
				const custom_schema_map = populateSchemaMap(custom_schema);
				expect(() =>
					populateViewFormat(
						{
							type: 'board'
						},
						custom_schema_map
					)
				).toThrow(`Schema doesnot contain any property of type select | multi_select`);
			});

			it(`Should throw error for board view (select doesnt have any options)`, () => {
				const custom_schema = JSON.parse(JSON.stringify(schema));
				custom_schema.select.options.pop();
				const custom_schema_map = populateSchemaMap(custom_schema);
				expect(() =>
					populateViewFormat(
						{
							type: 'board'
						},
						custom_schema_map
					)
				).toThrow(`Property Select doesnot have any options`);
			});
		});
	});
});

describe('populateViewProperties', () => {
	it(`Should work with number input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' }, 150)
		).toStrictEqual({
      property: 'text',
      visible: true,
      width: 150
    });
	});

	it(`Should work with boolean input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' }, false)
		).toStrictEqual({
      property: 'text',
      visible: false,
      width: 250
    });
	});

	it(`Should work with [boolean] input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' }, [ false ] as any)
		).toStrictEqual({
      property: 'text',
      visible: false,
      width: 250
    });
	});

	it(`Should work with [boolean, number] input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' }, [ false, 120 ])
		).toStrictEqual({
      property: 'text',
      visible: false,
      width: 120
    });
	});

	it(`Should work with [] input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' }, [] as any)
		).toStrictEqual({
      property: 'text',
      visible: true,
      width: 250
    });
	});

	it(`Should work with no input`, () => {
		expect(
			populateViewProperties({ schema_id: 'text' })
		).toStrictEqual({
      property: 'text',
      visible: true,
      width: 250
    });
	});
});

describe('populateQuery2SortAndAggregations', () => {
	it(`Sort undefined, aggregation text`, () => {
		const query2 = {
			aggregations: [],
			sort: []
		};

		populateQuery2SortAndAggregations(
			{
				aggregation: 'count'
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(
			query2
		).toStrictEqual({
      sort: [],
      aggregations: [
        {
          property: 'text',
          aggregator: 'count'
        }
      ]
    });
	});

	it(`Sort text, aggregation text`, () => {
		const query2 = {
			aggregations: [],
			sort: []
		};

		populateQuery2SortAndAggregations(
			{
				sort: 'ascending',
				aggregation: 'count'
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(
			query2
		).toStrictEqual({
      sort: [
        {
          property: 'text',
          direction: 'ascending'
        }
      ],
      aggregations: [
        {
          property: 'text',
          aggregator: 'count'
        }
      ]
    });
	});

	it(`Sort [TSort, number], Aggregation: undefined`, () => {
		const query2 = {
			aggregations: [],
			sort: [
				{
					property: 'number',
					direction: 'descending'
				}
			] as ViewSorts[]
		};

		populateQuery2SortAndAggregations(
			{
				sort: [ 'ascending', 0 ]
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(
			query2
		).toStrictEqual({
      sort: [
        {
          property: 'text',
          direction: 'ascending'
        },
        {
          property: 'number',
          direction: 'descending'
        }
      ],
      aggregations: []
    });
	});
});

describe('populateNonIncludedProperties', () => {
	it(`Should work correctly`, () => {
		expect(
				populateNonIncludedProperties(
					{
						title: {
							type: 'title',
							name: 'Title'
						},
						number: {
							type: 'number',
							name: 'Number'
						}
					},
					[ 'number' ]
			)
		).toStrictEqual([
      {
        property: 'title',
        visible: false,
        width: 250
      }
    ]);
	});
});

describe('generateViewData', () => {
	const id = v4(),
		stack: IOperation[] = [],
		cache: ICache = {
			collection_view: new Map()
		} as any;
	it(`Should work correctly`, () => {
		const view_data = generateViewData(
			{
				id,
				name: 'Table',
				type: 'table'
			},
			{
        user_id: 'user_id',
				stack,
				cache,
				space_id: 'space_id',
				shard_id: 123
			},
			{} as any,
			{} as any,
			'parent_id'
		);
		const expected_view_data = {
			id,
			version: 0,
			type: 'table',
			name: 'Table',
			page_sort: [],
			parent_id: 'parent_id',
			parent_table: 'block',
			alive: true,
			format: {},
			query2: {},
			shard_id: 123,
			space_id: 'space_id'
		};

		expect(view_data).toStrictEqual(expected_view_data);

		expect(
			stack
		).toStrictEqual([
      {
        path: [],
        table: 'collection_view',
        command: 'set',
        args: expected_view_data,
        id
      }
    ]);

		expect(Array.from(cache.collection_view.entries())).toStrictEqual( [ [ id, expected_view_data ] ]);
	});
});

describe('createViews', () => {
	describe('Output correctly', () => {
    it(`Should work correctly`, () => {
      const id = v4(),
      stack: IOperation[] = [],
      cache: ICache = createDefaultCache();
      
      createViews(
        {
          id: 'collection_id',
          schema: {
            title: {
              type: "title",
              name: "Title"
            }
          },
          parent_id: 'collection_parent_id'
        },
        [
          {
            id,
            type: 'table',
            name: 'Table',
            schema_units: [
              {
                name: "Title",
                type: "title",
              }
            ]
          }
        ],
        {
          token: 'token',
          user_id: 'user_id',
          stack,
          cache,
          space_id: 'space_id',
          shard_id: 123,
          logger: ()=>{
            return
          }
        },
        'parent_id'
      );

      
      const expected_view_data = {
        id,
        "version": 0,
        "type": "table",
        "name": "Table",
        "page_sort": [],
        "parent_id": "parent_id",       
        "parent_table": "block",        
        "alive": true,
        "format": {
          "table_properties": [
            {
              "property": "title",      
              "visible": true,
              "width": 250
            }
          ],
          "table_wrap": false
        },
        "query2": {
          "aggregations": [],
          "sort": [],
          "filter": {
            "operator": "and",
            "filters": [{
              property: "title",
              filter: {
                operator: "string_is",
                value: {
                  type: "exact",
                  value: "123"
                }
              }
            }]
          }
        },
        "shard_id": 123,
        "space_id": "space_id"
      };
  
      const [ view_ids, view_map ] = createViews(
        {
          id: 'collection_id',
          schema: {
            title: {
              type: "title",
              name: "Title"
            }
          },
          parent_id: 'parent_id'
        },
        [
          {
            id,
            type: 'table',
            name: 'Table',
            schema_units: [
              {
                name: "Title",
                type: "title",
              }
            ],
            filters: [
              {
                name: "Title",
                type: "title",
                filter: {
                  operator: "string_is",
                  value: {
                    type: "exact",
                    value: "123"
                  }
                }
              }
            ]
          }
        ],
        {
          token: 'token',
          user_id: 'user_id',
          stack,
          cache,
          space_id: 'space_id',
          shard_id: 123,
          logger: ()=>{
            return
          }
        }
      );
      
      expect(view_ids).toStrictEqual([ id ]);
      expect(view_map.table.get(id)?.getCachedData()).toStrictEqual(expected_view_data);
      expect(cache.collection_view.get(id)).toStrictEqual(expected_view_data);
      expect(
        stack
      ).toStrictEqual([
        {
          "path": [],
          "table": "collection_view",
          "command": "set",
          "args": {
            "id": expect.any(String),
            "version": 0,
            "type": "table",
            "name": "Table",
            "page_sort": [],
            "parent_id": "parent_id",
            "parent_table": "block",
            "alive": true,
            "format": {
              "table_properties": [
                {
                  "property": "title",
                  "visible": true,
                  "width": 250
                }
              ],
              "table_wrap": false
            },
            "query2": {
              "aggregations": [],
              "sort": [],
              "filter": {
                "operator": "and",
                "filters": []
              }
            },
            "shard_id": 123,
            "space_id": "space_id"
          },
          "id": expect.any(String)
        },
        {
          "path": [],
          "table": "collection_view",
          "command": "set",
          "args": {
            "id": expect.any(String),
            "version": 0,
            "type": "table",
            "name": "Table",
            "page_sort": [],
            "parent_id": "parent_id",
            "parent_table": "block",
            "alive": true,
            "format": {
              "table_properties": [
                {
                  "property": "title",
                  "visible": true,
                  "width": 250
                }
              ],
              "table_wrap": false
            },
            "query2": {
              "aggregations": [],
              "sort": [],
              "filter": {
                "operator": "and",
                "filters": [
                  {
                    "property": "title",
                    "filter": {
                      "operator": "string_is",
                      "value": {
                        "type": "exact",
                        "value": "123"
                      }
                    }
                  }
                ]
              }
            },
            "shard_id": 123,
            "space_id": "space_id"
          },
          "id": expect.any(String)
        }
      ]);
    });
  });

  it(`Throw error`, () => {
    const id = v4(),
      stack: IOperation[] = [],
      cache = createDefaultCache();
    expect(()=>createViews(
      {
        id: 'collection_id',
        schema: {
          title: {
            type: "title",
            name: "Title"
          }
        },
        parent_id: 'parent_id'
      },
      [
        {
          id,
          type: 'table',
          name: 'Table',
          schema_units: [
            {
              name: "URL",
              type: "url",
            }
          ]
        }
      ],
      {
        token: 'token',
        user_id: 'user_id',
        stack,
        cache,
        space_id: 'space_id',
        shard_id: 123,
        logger: ()=>{
          return
        }
      }
    )).toThrow(`Unknown property URL referenced in name`)
  });
});
