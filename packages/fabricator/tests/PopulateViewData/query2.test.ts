import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import {
	IBoardViewQuery2,
	ICalendarViewQuery2,
	IGalleryViewQuery2,
	IListViewQuery2,
	ITableViewQuery2,
	ITimelineViewQuery2,
	Schema
} from '@nishans/types';
import { PopulateViewData } from '../../';

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

const schema_map = generateSchemaMapFromCollectionSchema(schema);

describe('Table view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should output correctly for table view custom input`, () => {
				const query2 = PopulateViewData.query2({
					type: 'table'
				}) as ITableViewQuery2;
				expect(query2).toStrictEqual({
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
				const query2 = PopulateViewData.query2({
					type: 'list',
					filter_operator: 'or'
				}) as IListViewQuery2;
				expect(query2).toStrictEqual({
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
				const query2 = PopulateViewData.query2(
					{
						type: 'board',
						group_by: 'Select'
					},
					schema_map
				) as IBoardViewQuery2;

				expect(query2).toStrictEqual({
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
				PopulateViewData.query2(
					{
						type: 'board',
						group_by: 'unknown'
					},
					schema_map
				)
			).toThrow();
		});

		it(`Should throw error if schema doesnot contain any select | multiselect`, () => {
			expect(() =>
				PopulateViewData.query2(
					{
						type: 'board',
						group_by: 'Text'
					},
					schema_map
				)
			).toThrow();
		});
	});
});

describe('Calendar view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should output correctly for calendar view(date property)`, () => {
				const query2 = PopulateViewData.query2(
					{
						type: 'calendar',
						calendar_by: 'Date'
					},
					schema_map
				) as ICalendarViewQuery2;
				expect(query2).toStrictEqual({
					filter: {
						operator: 'and',
						filters: []
					},
					sort: [],
					calendar_by: 'date'
				});
			});

			it(`Should output correctly for calendar view(formula.date property)`, () => {
				const query2 = PopulateViewData.query2(
					{
						type: 'calendar',
						calendar_by: 'Date Formula'
					},
					schema_map
				) as ICalendarViewQuery2;

				expect(query2).toStrictEqual({
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
				PopulateViewData.query2(
					{
						type: 'calendar',
						calendar_by: 'unknown'
					},
					schema_map
				)
			).toThrow();
		});

		it(`Should throw error if property is of unsupported type`, () => {
			expect(() =>
				PopulateViewData.query2(
					{
						type: 'calendar',
						calendar_by: 'Text'
					},
					schema_map
				)
			).toThrow();
		});
	});
});

describe('Gallery view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should work for gallery view`, () => {
				const query2 = PopulateViewData.query2({
					type: 'gallery'
				}) as IGalleryViewQuery2;
				expect(query2).toStrictEqual({
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
				const query2 = PopulateViewData.query2(
					{
						type: 'timeline',
						timeline_by: 'Date'
					},
					schema_map
				) as ITimelineViewQuery2;

				expect(query2).toStrictEqual({
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
				const query2 = PopulateViewData.query2(
					{
						type: 'timeline',
						timeline_by: 'Date Formula'
					},
					schema_map
				) as ITimelineViewQuery2;
				expect(query2).toStrictEqual({
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
				PopulateViewData.query2(
					{
						type: 'timeline',
						timeline_by: 'unknown'
					},
					schema_map
				)
			).toThrow();
		});

		it(`Should throw error if property is of unsupported type`, () => {
			expect(() =>
				PopulateViewData.query2(
					{
						type: 'timeline',
						timeline_by: 'Text'
					},
					schema_map
				)
			).toThrow();
		});
	});
});
