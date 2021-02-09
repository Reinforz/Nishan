import {
	IBoardViewFormat,
	IBoardViewQuery2,
	ICalendarViewFormat,
	ICalendarViewQuery2,
	IGalleryViewFormat,
	IGalleryViewQuery2,
	IListViewFormat,
	IListViewQuery2,
	ITableViewFormat,
	ITableViewQuery2,
	ITimelineViewFormat,
	ITimelineViewQuery2,
	Schema
} from '@nishans/types';
import deepEqual from 'deep-equal';
import { createViews, getSchemaMap, populateViewFormat, populateViewProperties, populateViewQuery2 } from '../../src';

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

const schema_map = getSchemaMap(schema);

describe('populateViewQuery2', () => {
	describe('Table view', () => {
		describe('Output correctly', () => {
			describe('Custom input', () => {
				it(`Should output correctly for table view custom input`, () => {
					const query2 = populateViewQuery2({
						type: 'table'
					}) as ITableViewQuery2;
					expect(
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							sort: [],
							aggregations: []
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'or',
								filters: []
							},
							sort: []
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							aggregations: [],
							sort: [],
							group_by: 'select'
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							sort: [],
							calendar_by: 'date'
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							sort: [],
							calendar_by: 'date_formula'
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							sort: []
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							timeline_by: 'date',
							sort: [],
							aggregations: []
						})
					).toBe(true);
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
						deepEqual(query2, {
							filter: {
								operator: 'and',
								filters: []
							},
							sort: [],
							timeline_by: 'date_formula',
							aggregations: []
						})
					).toBe(true);
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
						deepEqual(format, {
							table_properties: [],
							table_wrap: false
						})
					);
				});
			});
			describe('Default input', () => {
				it(`Should work for table view`, () => {
					const format = populateViewFormat({
						type: 'table'
					}) as ITableViewFormat;

					expect(
						deepEqual(format, {
							table_properties: [],
							table_wrap: true
						})
					);
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
						deepEqual(format, {
							list_properties: []
						})
					);
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
						deepEqual(format, {
							calendar_properties: []
						})
					);
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
						deepEqual(format, {
							gallery_cover: {
								property: 'file',
								type: 'property'
							},
							gallery_properties: [],
							gallery_cover_aspect: 'cover',
							gallery_cover_size: 'medium'
						})
					);
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
						deepEqual(format, {
							gallery_cover: {
								type: 'page_cover'
							},
							gallery_properties: [],
							gallery_cover_aspect: 'cover',
							gallery_cover_size: 'medium'
						})
					);
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
						deepEqual(format, {
							gallery_cover: { type: 'page_cover' },
							gallery_properties: [],
							gallery_cover_aspect: 'contain',
							gallery_cover_size: 'large'
						})
					);
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
						deepEqual(format, {
							timeline_table_properties: [],
							timeline_properties: [],
							timeline_show_table: true,
							timeline_preference: {
								centerTimestamp: 2,
								zoomLevel: 'month'
							}
						})
					);
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
						deepEqual(format, {
							timeline_table_properties: [],
							timeline_properties: [],
							timeline_show_table: true,
							timeline_preference: {
								centerTimestamp: 1,
								zoomLevel: 'month'
							}
						})
					);
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
						deepEqual(format, {
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
						})
					);
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
						deepEqual(format, {
							board_cover: {
								type: 'page_cover'
							},
							board_properties: [],
							board_cover_aspect: 'cover',
							board_cover_size: 'medium'
						})
					);
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
						deepEqual(format, {
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
						})
					);
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
				const custom_schema_map = getSchemaMap(custom_schema);
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
				const custom_schema_map = getSchemaMap(custom_schema);
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
			deepEqual(populateViewProperties({ schema_id: 'text' }, 150), {
				property: 'text',
				visible: true,
				width: 150
			})
		).toBe(true);
	});

	it(`Should work with boolean input`, () => {
		expect(
			deepEqual(populateViewProperties({ schema_id: 'text' }, false), {
				property: 'text',
				visible: false,
				width: 250
			})
		).toBe(true);
	});

	it(`Should work with [boolean] input`, () => {
		expect(
			deepEqual(populateViewProperties({ schema_id: 'text' }, [ false ] as any), {
				property: 'text',
				visible: false,
				width: 250
			})
		).toBe(true);
	});

	it(`Should work with [boolean, number] input`, () => {
		expect(
			deepEqual(populateViewProperties({ schema_id: 'text' }, [ false, 120 ]), {
				property: 'text',
				visible: false,
				width: 120
			})
		).toBe(true);
	});

	it(`Should work with [] input`, () => {
		expect(
			deepEqual(populateViewProperties({ schema_id: 'text' }, [] as any), {
				property: 'text',
				visible: true,
				width: 250
			})
		).toBe(true);
	});

	it(`Should work with no input`, () => {
		expect(
			deepEqual(populateViewProperties({ schema_id: 'text' }), {
				property: 'text',
				visible: true,
				width: 250
			})
		).toBe(true);
	});
});
