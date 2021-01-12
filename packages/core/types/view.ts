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
	IViewAggregationsAggregators
} from '@nishans/types';
import { RepositionParams } from './block';
import { TViewFilterCreateInput } from './filter';

export interface IViewCreateInput {
	id?: string;
	type: TViewType;
	name: string;
	schema_units: TViewSchemaUnitsCreateInput[];
	position?: RepositionParams;
	filter_operator?: TViewGroupFilterOperator;
	filters?: TViewFilterCreateInput[];
}

export interface TableViewCreateInput extends IViewCreateInput, Partial<Omit<ITableViewFormat, 'table_properties'>> {
	type: 'table';
}

export interface ListViewCreateInput extends IViewCreateInput {
	type: 'list';
}

export interface BoardViewCreateInput extends IViewCreateInput, Partial<Omit<IBoardViewFormat, 'board_properties'>> {
	type: 'board';
	group_by: string;
}

export interface GalleryViewCreateInput
	extends IViewCreateInput,
		Partial<Omit<IGalleryViewFormat, 'gallery_properties'>> {
	type: 'gallery';
}

export interface CalendarViewCreateInput extends IViewCreateInput {
	type: 'calendar';
	calendar_by: string;
}

export interface TimelineViewCreateInput
	extends IViewCreateInput,
		Partial<Omit<ITimelineViewFormat, 'timeline_properties' | 'timeline_table_properties'>> {
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
