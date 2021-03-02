import { ViewFormatProperties } from '@nishans/types';
import { PopulateViewData } from '../../../libs';

const default_format_property = {
	property: 'text',
	visible: true,
	width: 250
};

describe('view_type=table', () => {
	it(`Should work with number input`, () => {
		const table_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('table', 'text', { table_properties } as any, 150);
		expect(table_properties).toStrictEqual([
			{
				property: 'text',
				visible: true,
				width: 150
			}
		]);
	});

	it(`Should work with boolean input`, () => {
		const table_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('table', 'text', { table_properties } as any, false);
		expect(table_properties).toStrictEqual([
			{
				property: 'text',
				visible: false,
				width: 250
			}
		]);
	});

	it(`Should work with [boolean, number] input`, () => {
		const table_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('table', 'text', { table_properties } as any, [ false, 120 ]);
		expect(table_properties).toStrictEqual([
			{
				property: 'text',
				visible: false,
				width: 120
			}
		]);
	});

	it(`Should work with [] input`, () => {
		const table_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('table', 'text', { table_properties } as any, [] as any);
		expect(table_properties).toStrictEqual([ default_format_property ]);
	});

	it(`Should work with no input`, () => {
		const table_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('table', 'text', { table_properties } as any);
		expect(table_properties).toStrictEqual([ default_format_property ]);
	});
});

describe('view_type=list', () => {
	it(`Should work with number input`, () => {
		const list_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('list', 'text', { list_properties } as any, false);
		expect(list_properties).toStrictEqual([
			{
				property: 'text',
				visible: false
			}
		]);
	});
});

describe('view_type=timeline', () => {
	it(`Should work with separate format for table and timeline input`, () => {
		const timeline_table_properties: ViewFormatProperties[] = [],
			timeline_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('timeline', 'text', { timeline_table_properties, timeline_properties } as any, {
			table: [ true, 150 ],
			timeline: false
		});
		expect(timeline_table_properties).toStrictEqual([
			{
				width: 150,
				property: 'text',
				visible: true
			}
		]);
		expect(timeline_properties).toStrictEqual([
			{
				property: 'text',
				visible: false
			}
		]);
	});

	it(`Should work with undefined input`, () => {
		const timeline_table_properties: ViewFormatProperties[] = [],
			timeline_properties: ViewFormatProperties[] = [];
		PopulateViewData.format.properties('timeline', 'text', { timeline_table_properties, timeline_properties } as any);
		expect(timeline_table_properties).toStrictEqual([
			{
				width: 250,
				property: 'text',
				visible: true
			}
		]);
		expect(timeline_properties).toStrictEqual([
			{
				property: 'text',
				visible: true
			}
		]);
	});
});
