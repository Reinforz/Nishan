import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { IGalleryViewFormat, ITableViewFormat, Schema } from '@nishans/types';
import { PopulateViewData } from '../../libs';
import { dsu, fsu, nsu, tsu, txsu } from '../utils';

const schema: Schema = {
	title: tsu,
	number: nsu,
	text: txsu,
	file: fsu,
	date: dsu,
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

const schema_map = generateSchemaMapFromCollectionSchema(schema);

describe('Table view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for table view`, () => {
				const format = PopulateViewData.format({
					type: 'table',
					table_wrap: false,
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				}) as ITableViewFormat;

				expect(format).toStrictEqual({
					table_properties: [],
					table_wrap: false,
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				});
			});
		});

		describe('Default input', () => {
			it(`Should work for table view`, () => {
				const format = PopulateViewData.format({
					type: 'table'
				}) as ITableViewFormat;

				expect(format).toStrictEqual({
					table_properties: [],
					table_wrap: false,
					inline_collection_first_load_limit: {
						type: 'load_all'
					}
				});
			});
		});
	});
});

describe('List view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for list view`, () => {
				const format = PopulateViewData.format({
					type: 'list',
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				});

				expect(format).toStrictEqual({
					list_properties: [],
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				});
			});
		});

		describe('Default input', () => {
			it(`Should work for list view`, () => {
				const format = PopulateViewData.format({
					type: 'list'
				});

				expect(format).toStrictEqual({
					list_properties: [],
					inline_collection_first_load_limit: {
						type: 'load_all'
					}
				});
			});
		});
	});
});

describe('Calendar view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for calendar view`, () => {
				const format = PopulateViewData.format({
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
				const format = PopulateViewData.format(
					{
						type: 'gallery',
						gallery_cover: {
							property: 'File',
							type: 'property'
						},
						gallery_cover_aspect: 'cover',
						gallery_cover_size: 'medium',
						inline_collection_first_load_limit: {
							limit: 25,
							type: 'load_limit'
						}
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
					gallery_cover_size: 'medium',
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				});
			});

			it(`Should work for gallery_cover=page_cover`, () => {
				const format = PopulateViewData.format(
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
					gallery_cover_size: 'medium',
					inline_collection_first_load_limit: {
						type: 'load_all'
					}
				});
			});
		});

		describe('Default input', () => {
			it(`Should work for gallery view (default)`, () => {
				const format = PopulateViewData.format(
					{
						type: 'gallery'
					},
					schema_map
				) as IGalleryViewFormat;

				expect(format).toStrictEqual({
					gallery_cover: { type: 'page_cover' },
					gallery_properties: [],
					gallery_cover_aspect: 'contain',
					gallery_cover_size: 'large',
					inline_collection_first_load_limit: {
						type: 'load_all'
					}
				});
			});
		});
	});

	describe('Throw error', () => {
		it(`Should throw error for gallery view (property not of type file)`, () => {
			expect(() =>
				PopulateViewData.format(
					{
						type: 'gallery',
						gallery_cover: {
							property: 'Text',
							type: 'property'
						}
					},
					schema_map
				)
			).toThrow();
		});
	});
});

describe('timeline view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for timeline view`, () => {
				const format = PopulateViewData.format(
					{
						type: 'timeline',
						timeline_show_table: true,
						timeline_preference: {
							centerTimestamp: 2,
							zoomLevel: 'month'
						},
						inline_collection_first_load_limit: {
							limit: 25,
							type: 'load_limit'
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
					},
					inline_collection_first_load_limit: {
						limit: 25,
						type: 'load_limit'
					}
				});
			});
		});
		describe('Default input', () => {
			it(`Should work for timeline view (default)`, () => {
				const format = PopulateViewData.format(
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
					},
					inline_collection_first_load_limit: {
						type: 'load_all'
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
				const format = PopulateViewData.format(
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
				const format = PopulateViewData.format(
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
				const format = PopulateViewData.format(
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
		it(`Should throw an error if custom groups2 property is referencing unsupported type property`, () => {
			expect(() =>
				PopulateViewData.format(
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
			).toThrow();
		});

		it(`Should throw error for board view (property not of type file)`, () => {
			expect(() =>
				PopulateViewData.format(
					{
						type: 'board',
						board_cover: {
							property: 'Text',
							type: 'property'
						}
					},
					schema_map
				)
			).toThrow();
		});

		it(`Should throw error for board view (schema doesn't contain any select or multi-select)`, () => {
			const custom_schema = JSON.parse(JSON.stringify(schema));
			delete custom_schema.select;
			const custom_schema_map = generateSchemaMapFromCollectionSchema(custom_schema);
			expect(() =>
				PopulateViewData.format(
					{
						type: 'board'
					},
					custom_schema_map
				)
			).toThrow();
		});
	});
});
