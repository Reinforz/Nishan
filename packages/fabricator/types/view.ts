import {
	IBoardViewFormat,
	ICalendarViewFormat,
	IGalleryViewFormat,
	IListViewFormat,
	ITableViewFormat,
	ITimelineViewFormat,
	IViewAggregationsAggregators,
	TSchemaUnitType,
	TSortValue,
	TViewGroupFilterOperator,
	TViewType
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
	timeline_by: string;
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
}

export interface TimelineViewFormatCreateInput
	extends IViewFormatCreateInput,
		Partial<Omit<ITimelineViewFormat, 'timeline_properties' | 'timeline_table_properties'>> {
	type: 'timeline';
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
	position?: RepositionParams;
	filters?: TViewFilterCreateInput[];
	name: string;
}

export interface TableViewCreateInput extends IViewCreateInput, TableViewQuery2CreateInput, TableViewFormatCreateInput {
	type: 'table';
	schema_units: TViewSchemaUnitsCommonCreateInput<boolean | number | [boolean, number]>[];
}

export interface ListViewCreateInput extends IViewCreateInput, ListViewQuery2CreateInput, ListViewFormatCreateInput {
	type: 'list';
	schema_units: TViewSchemaUnitsCommonCreateInput<boolean>[];
}

export interface BoardViewCreateInput extends IViewCreateInput, BoardViewQuery2CreateInput, BoardViewFormatCreateInput {
	type: 'board';
	schema_units: TViewSchemaUnitsCommonCreateInput<boolean>[];
}

export interface GalleryViewCreateInput
	extends IViewCreateInput,
		GalleryViewQuery2CreateInput,
		GalleryViewFormatCreateInput {
	type: 'gallery';
	schema_units: TViewSchemaUnitsCommonCreateInput<boolean>[];
}

export interface CalendarViewCreateInput
	extends IViewCreateInput,
		CalendarViewQuery2CreateInput,
		CalendarViewFormatCreateInput {
	type: 'calendar';
	schema_units: TViewSchemaUnitsCommonCreateInput<boolean>[];
}

export interface TimelineViewCreateInput
	extends IViewCreateInput,
		TimelineViewQuery2CreateInput,
		TimelineViewFormatCreateInput {
	type: 'timeline';
	schema_units: TViewSchemaUnitsCommonCreateInput<{
		table: boolean | number | [boolean, number];
		timeline: boolean;
	}>[];
}

export type TViewCreateInput =
	| TableViewCreateInput
	| ListViewCreateInput
	| BoardViewCreateInput
	| GalleryViewCreateInput
	| CalendarViewCreateInput
	| TimelineViewCreateInput;

export type SortCreateInput = undefined | TSortValue | [TSortValue, number];

export type IViewSchemaUnitsCommonCreateInput<SUT extends TSchemaUnitType, F extends any> = {
	name: string;
	type: SUT;
	sort?: SortCreateInput;
	aggregation?: IViewAggregationsAggregators[SUT];
	format?: F;
};

export type TViewSchemaUnitsCommonCreateInput<F extends any> =
	| IViewSchemaUnitsCommonCreateInput<'text', F>
	| IViewSchemaUnitsCommonCreateInput<'title', F>
	| IViewSchemaUnitsCommonCreateInput<'number', F>
	| IViewSchemaUnitsCommonCreateInput<'select', F>
	| IViewSchemaUnitsCommonCreateInput<'multi_select', F>
	| IViewSchemaUnitsCommonCreateInput<'date', F>
	| IViewSchemaUnitsCommonCreateInput<'person', F>
	| IViewSchemaUnitsCommonCreateInput<'file', F>
	| IViewSchemaUnitsCommonCreateInput<'checkbox', F>
	| IViewSchemaUnitsCommonCreateInput<'url', F>
	| IViewSchemaUnitsCommonCreateInput<'email', F>
	| IViewSchemaUnitsCommonCreateInput<'phone_number', F>
	| IViewSchemaUnitsCommonCreateInput<'formula', F>
	| IViewSchemaUnitsCommonCreateInput<'relation', F>
	| IViewSchemaUnitsCommonCreateInput<'rollup', F>
	| IViewSchemaUnitsCommonCreateInput<'created_time', F>
	| IViewSchemaUnitsCommonCreateInput<'created_by', F>
	| IViewSchemaUnitsCommonCreateInput<'last_edited_time', F>
	| IViewSchemaUnitsCommonCreateInput<'last_edited_by', F>;
