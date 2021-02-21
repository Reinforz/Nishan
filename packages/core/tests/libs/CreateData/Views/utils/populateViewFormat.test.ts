import { IGalleryViewFormat, ITableViewFormat, Schema } from '@nishans/types';
import { populateSchemaMap } from '../../../../../libs';
import { populateViewFormat } from '../../../../../libs/CreateData/Views/utils';

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

describe('Table view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for table view`, () => {
				const format = populateViewFormat({
					type: 'table',
					table_wrap: false
				}) as ITableViewFormat;

				expect(format).toStrictEqual({
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

				expect(format).toStrictEqual({
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
				});

				expect(format).toStrictEqual({
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
				});

				expect(format).toStrictEqual({
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

				expect(format).toStrictEqual({
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

				expect(format).toStrictEqual({
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

				expect(format).toStrictEqual({
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
				);

				expect(format).toStrictEqual({
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
				);

				expect(format).toStrictEqual({
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
				);

				expect(format).toStrictEqual({
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
				);

				expect(format).toEqual(
					expect.objectContaining({
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
				);

				expect(format).toStrictEqual({
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
			).toThrow(`Schema doesn't contain any property of type select | multi_select`);
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
