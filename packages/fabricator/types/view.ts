import { INotionRepositionParams } from '@nishans/lineage';
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
	position?: INotionRepositionParams;
	filters?: TViewFilterCreateInput[];
	name: string;
}

export type TimelineSchemaUnitFormatCreateInput =
	| undefined
	| {
			table?: boolean | number | [boolean, number];
			timeline?: boolean;
		};

export type ListSchemaUnitFormatCreateInput = undefined | boolean;
export type GallerySchemaUnitFormatCreateInput = undefined | boolean;
export type BoardSchemaUnitFormatCreateInput = undefined | boolean;
export type CalendarSchemaUnitFormatCreateInput = undefined | boolean;
export type TableSchemaUnitFormatCreateInput = undefined | boolean | number | [boolean, number];

export type TViewSchemaUnitFormatCreateInput =
	| TableSchemaUnitFormatCreateInput
	| ListSchemaUnitFormatCreateInput
	| BoardSchemaUnitFormatCreateInput
	| GallerySchemaUnitFormatCreateInput
	| CalendarSchemaUnitFormatCreateInput
	| TimelineSchemaUnitFormatCreateInput;

export interface TableViewCreateInput extends IViewCreateInput, TableViewQuery2CreateInput, TableViewFormatCreateInput {
	type: 'table';
	schema_units: TViewSchemaUnitsCreateInput<TableSchemaUnitFormatCreateInput>[];
}

export interface ListViewCreateInput extends IViewCreateInput, ListViewQuery2CreateInput, ListViewFormatCreateInput {
	type: 'list';
	schema_units: TViewSchemaUnitsCreateInput<ListSchemaUnitFormatCreateInput>[];
}

export interface BoardViewCreateInput extends IViewCreateInput, BoardViewQuery2CreateInput, BoardViewFormatCreateInput {
	type: 'board';
	schema_units: TViewSchemaUnitsCreateInput<BoardSchemaUnitFormatCreateInput>[];
}

export interface GalleryViewCreateInput
	extends IViewCreateInput,
		GalleryViewQuery2CreateInput,
		GalleryViewFormatCreateInput {
	type: 'gallery';
	schema_units: TViewSchemaUnitsCreateInput<GallerySchemaUnitFormatCreateInput>[];
}

export interface CalendarViewCreateInput
	extends IViewCreateInput,
		CalendarViewQuery2CreateInput,
		CalendarViewFormatCreateInput {
	type: 'calendar';
	schema_units: TViewSchemaUnitsCreateInput<CalendarSchemaUnitFormatCreateInput>[];
}

export interface TimelineViewCreateInput
	extends IViewCreateInput,
		TimelineViewQuery2CreateInput,
		TimelineViewFormatCreateInput {
	type: 'timeline';
	schema_units: TViewSchemaUnitsCreateInput<TimelineSchemaUnitFormatCreateInput>[];
}

export type TViewCreateInput =
	| TableViewCreateInput
	| ListViewCreateInput
	| BoardViewCreateInput
	| GalleryViewCreateInput
	| CalendarViewCreateInput
	| TimelineViewCreateInput;

export type SortCreateInput = undefined | TSortValue | [TSortValue, number];

export type IViewSchemaUnitsCreateInput<SUT extends TSchemaUnitType, F extends TViewSchemaUnitFormatCreateInput> = {
	name: string;
	type: SUT;
	sort?: SortCreateInput;
	aggregation?: IViewAggregationsAggregators[SUT];
	format?: F;
};

export type TViewSchemaUnitsCreateInput<F extends TViewSchemaUnitFormatCreateInput> =
	| IViewSchemaUnitsCreateInput<'text', F>
	| IViewSchemaUnitsCreateInput<'title', F>
	| IViewSchemaUnitsCreateInput<'number', F>
	| IViewSchemaUnitsCreateInput<'select', F>
	| IViewSchemaUnitsCreateInput<'multi_select', F>
	| IViewSchemaUnitsCreateInput<'date', F>
	| IViewSchemaUnitsCreateInput<'person', F>
	| IViewSchemaUnitsCreateInput<'file', F>
	| IViewSchemaUnitsCreateInput<'checkbox', F>
	| IViewSchemaUnitsCreateInput<'url', F>
	| IViewSchemaUnitsCreateInput<'email', F>
	| IViewSchemaUnitsCreateInput<'phone_number', F>
	| IViewSchemaUnitsCreateInput<'formula', F>
	| IViewSchemaUnitsCreateInput<'relation', F>
	| IViewSchemaUnitsCreateInput<'rollup', F>
	| IViewSchemaUnitsCreateInput<'created_time', F>
	| IViewSchemaUnitsCreateInput<'created_by', F>
	| IViewSchemaUnitsCreateInput<'last_edited_time', F>
	| IViewSchemaUnitsCreateInput<'last_edited_by', F>;
