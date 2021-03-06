import {
	IBoardViewQuery2,
	ICalendarViewQuery2,
	IGalleryViewQuery2,
	IListViewQuery2,
	ITableViewQuery2,
	ITimelineViewQuery2,
	Schema
} from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { PopulateViewData } from '../../../libs';
import { dsu, fsu, nsu, tsu, txsu } from '../../utils';

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

const schema_map = NotionUtils.generateSchemaMap(schema);

describe('Table view', () => {
	it(`Should output correctly for table view custom input`, () => {
		const query2 = PopulateViewData.query2.query2({
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

describe('List view', () => {
	it(`Should output correctly for list view custom input`, () => {
		const query2 = PopulateViewData.query2.query2({
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

describe('Board view', () => {
	describe('Output correctly', () => {
		describe('Custom input', () => {
			it(`Should output correctly for Board view custom input`, () => {
				const query2 = PopulateViewData.query2.query2(
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
		it(`Should throw error if schema doesn't contain any select | multi-select`, () => {
			expect(() =>
				PopulateViewData.query2.query2(
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
	it(`Should output correctly for calendar view(date property)`, () => {
		const query2 = PopulateViewData.query2.query2(
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
});

describe('Gallery view', () => {
	it(`Should work for gallery view`, () => {
		const query2 = PopulateViewData.query2.query2({
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

describe('Timeline', () => {
	it(`Should work for timeline view(Date property)`, () => {
		const query2 = PopulateViewData.query2.query2(
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
});
