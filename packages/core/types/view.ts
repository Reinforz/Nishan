import {
	TViewType,
	ITableViewFormat,
	IBoardViewFormat,
	IGalleryViewFormat,
	ITimelineViewFormat,
	TTimelineViewTimelineby,
	TSchemaUnitType,
	TSortValue,
	TViewGroupFilterOperator,
	IViewAggregationsAggregators,
	IListViewFormat,
	ICalendarViewFormat
} from '@nishans/types';
import { RepositionParams } from './block';
import { TViewFilterCreateInput } from './filter';

export interface IViewQuery2CreateInput {
	type: TViewType;
	filter_operator?: TViewGroupFilterOperator;
}

export interface TableViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'table';
}

export interface ListViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'list';
}

export interface BoardViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'board';
	group_by: string;
}

export interface GalleryViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'gallery';
}

export interface CalendarViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'calendar';
	calendar_by: string;
}

export interface TimelineViewQuery2CreateInput extends IViewQuery2CreateInput {
	type: 'timeline';
	timeline_by: TTimelineViewTimelineby;
}

export type TViewQuery2CreateInput =
	| TableViewQuery2CreateInput
	| ListViewQuery2CreateInput
	| BoardViewQuery2CreateInput
	| GalleryViewQuery2CreateInput
	| CalendarViewQuery2CreateInput
	| TimelineViewQuery2CreateInput;

export interface IViewFormatCreateInput {
	type: TViewType;
}

export interface TableViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<ITableViewFormat, 'table_properties'>> {
	type: 'table';
}

export interface ListViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<IListViewFormat, 'list_properties'>> {
	type: 'list';
}

export interface BoardViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<IBoardViewFormat, 'board_properties'>> {
	type: 'board';
	group_by: string;
}

export interface GalleryViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<IGalleryViewFormat, 'gallery_properties'>> {
	type: 'gallery';
}

export interface CalendarViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<ICalendarViewFormat, 'calendar_properties'>> {
	type: 'calendar';
	calendar_by: string;
}

export interface TimelineViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<ITimelineViewFormat, 'timeline_properties' | 'timeline_table_properties'>> {
	type: 'timeline';
	timeline_by: TTimelineViewTimelineby;
}

export type TViewFormatCreateInput =
	| TableViewFormatCreateInput
	| ListViewFormatCreateInput
	| BoardViewFormatCreateInput
	| GalleryViewFormatCreateInput
	| CalendarViewFormatCreateInput
	| TimelineViewFormatCreateInput;

export interface IViewCreateInput extends IViewQuery2CreateInput {
	id?: string;
	schema_units: TViewSchemaUnitsCreateInput[];
	position?: RepositionParams;
	filters?: TViewFilterCreateInput[];
	name: string;
}

export interface TableViewCreateInput extends IViewCreateInput, TableViewQuery2CreateInput, TableViewFormatCreateInput {
	type: 'table';
}

export interface ListViewCreateInput extends IViewCreateInput, ListViewQuery2CreateInput, ListViewFormatCreateInput {
	type: 'list';
}

export interface BoardViewCreateInput extends IViewCreateInput, BoardViewQuery2CreateInput, BoardViewFormatCreateInput {
	type: 'board';
	group_by: string;
}

export interface GalleryViewCreateInput
	extends IViewCreateInput,
		GalleryViewQuery2CreateInput,
		GalleryViewFormatCreateInput {
	type: 'gallery';
}

export interface CalendarViewCreateInput
	extends IViewCreateInput,
		CalendarViewQuery2CreateInput,
		CalendarViewFormatCreateInput {
	type: 'calendar';
	calendar_by: string;
}

export interface TimelineViewCreateInput
	extends IViewCreateInput,
		TimelineViewQuery2CreateInput,
		TimelineViewFormatCreateInput {
	type: 'timeline';
	timeline_by: TTimelineViewTimelineby;
}

export type TViewCreateInput =
	| TableViewCreateInput
	| ListViewCreateInput
	| BoardViewCreateInput
	| GalleryViewCreateInput
	| CalendarViewCreateInput
	| TimelineViewCreateInput;

interface IViewSchemaUnitsCreateInput<SUT extends TSchemaUnitType> {
	// name of the schema unit
	name: string;
	// schemaunit type
	type: SUT;
	// sort targetting the schemaunit
	sort?: TSortValue | [TSortValue, number];
	// format targetting the schemaunit
	format?: boolean | number | [boolean, number];
	// aggregation targetting the schemaunit
	aggregation?: IViewAggregationsAggregators[SUT];
}

export type TViewSchemaUnitsCreateInput =
	| IViewSchemaUnitsCreateInput<'text'>
	| IViewSchemaUnitsCreateInput<'title'>
	| IViewSchemaUnitsCreateInput<'number'>
	| IViewSchemaUnitsCreateInput<'select'>
	| IViewSchemaUnitsCreateInput<'multi_select'>
	| IViewSchemaUnitsCreateInput<'date'>
	| IViewSchemaUnitsCreateInput<'person'>
	| IViewSchemaUnitsCreateInput<'file'>
	| IViewSchemaUnitsCreateInput<'checkbox'>
	| IViewSchemaUnitsCreateInput<'url'>
	| IViewSchemaUnitsCreateInput<'email'>
	| IViewSchemaUnitsCreateInput<'phone_number'>
	| IViewSchemaUnitsCreateInput<'formula'>
	| IViewSchemaUnitsCreateInput<'relation'>
	| IViewSchemaUnitsCreateInput<'rollup'>
	| IViewSchemaUnitsCreateInput<'created_time'>
	| IViewSchemaUnitsCreateInput<'created_by'>
	| IViewSchemaUnitsCreateInput<'last_edited_time'>
	| IViewSchemaUnitsCreateInput<'last_edited_by'>;
