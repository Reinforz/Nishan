import {
	IBoardViewQuery2,
	ICalendarViewQuery2,
	IGalleryViewQuery2,
	IListViewQuery2,
	ITableViewQuery2,
	ITimelineViewQuery2,
	Schema
} from '@nishans/types';
import deepEqual from 'deep-equal';
import { createViews, getSchemaMap, populateViewFormat, populateViewQuery2 } from '../../src';

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
	}
};

const schema_map = getSchemaMap(schema);

describe('populateViewQuery2', () => {
	it(`Should work for table view`, () => {
		const query2 = populateViewQuery2({
			type: 'table'
		}) as ITableViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(deepEqual(query2.sort, [])).toBe(true);
		expect(deepEqual(query2.aggregations, [])).toBe(true);
	});

	it(`Should work for list view`, () => {
		const query2 = populateViewQuery2({
			type: 'list',
			filter_operator: 'or'
		}) as IListViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'or',
				filters: []
			})
		).toBe(true);
		expect(deepEqual(query2.sort, [])).toBe(true);
	});

	it(`Should work for board view`, () => {
		const query2 = populateViewQuery2(
			{
				type: 'board',
				group_by: 'Text'
			},
			schema_map
		) as IBoardViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(deepEqual(query2.aggregations, [])).toBe(true);
		expect(deepEqual(query2.sort, [])).toBe(true);
		expect(query2.group_by).toBe('text');
	});

	it(`Should throw error for unknown property referenced in board view`, () => {
		expect(() =>
			populateViewQuery2(
				{
					type: 'board',
					group_by: 'text'
				},
				schema_map
			)
		).toThrow(`Unknown property text referenced`);
	});

	it(`Should work for calendar view`, () => {
		const query2 = populateViewQuery2(
			{
				type: 'calendar',
				calendar_by: 'Text'
			},
			schema_map
		) as ICalendarViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(deepEqual(query2.sort, [])).toBe(true);
		expect(query2.calendar_by).toBe('text');
	});

	it(`Should throw error for unknown property referenced in calendar view`, () => {
		expect(() =>
			populateViewQuery2(
				{
					type: 'calendar',
					calendar_by: 'text'
				},
				schema_map
			)
		).toThrow(`Unknown property text referenced`);
	});

	it(`Should work for gallery view`, () => {
		const query2 = populateViewQuery2({
			type: 'gallery'
		}) as IGalleryViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(deepEqual(query2.sort, [])).toBe(true);
	});

	it(`Should work for timeline view`, () => {
		const query2 = populateViewQuery2({
			type: 'timeline',
			timeline_by: 'hours'
		}) as ITimelineViewQuery2;
		expect(
			deepEqual(query2.filter, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(query2.timeline_by).toBe('hours');
		expect(deepEqual(query2.sort, [])).toBe(true);
	});
});
