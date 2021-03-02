import {
  IBoardViewFormat,
  ICalendarViewFormat,
  IGalleryViewFormat,
  IListViewFormat,
  ITableViewFormat,
  ITimelineViewFormat,
  TView,
  TViewType
} from '@nishans/types';
import {
  BoardSchemaUnitFormatCreateInput,
  CalendarSchemaUnitFormatCreateInput,
  GallerySchemaUnitFormatCreateInput,
  ListSchemaUnitFormatCreateInput,
  TableSchemaUnitFormatCreateInput,
  TimelineSchemaUnitFormatCreateInput,
  TViewSchemaUnitFormatCreateInput
} from '../../';
import { setDefault } from '../../setDefault';
import { populateTableViewFormatProperties } from './utils';


/**
 * * Returns a view view_format_input property based on the passed view_type
 * @param view_type The type of view
 * @param schema_id schema_id of the property referenced
 * @param view_format_input Format input for the property
 */
export function populateViewFormatProperties (
	view_type: 'table',
	schema_id: string,
	view_format: ITableViewFormat,
	view_format_input?: TableSchemaUnitFormatCreateInput
): void;
export function populateViewFormatProperties (
	view_type: Exclude<TViewType, 'table' | 'timeline'>,
	schema_id: string,
	view_format: IListViewFormat | IBoardViewFormat | IGalleryViewFormat | ICalendarViewFormat,
	view_format_input?:
		| ListSchemaUnitFormatCreateInput
		| GallerySchemaUnitFormatCreateInput
		| BoardSchemaUnitFormatCreateInput
		| CalendarSchemaUnitFormatCreateInput
): void;
export function populateViewFormatProperties (
	view_type: 'timeline',
	schema_id: string,
	view_format: ITimelineViewFormat,
	view_format_input?: TimelineSchemaUnitFormatCreateInput
): void;
export function populateViewFormatProperties (
	view_type: TViewType,
	schema_id: string,
	view_format: TView['format'],
	view_format_input?: TViewSchemaUnitFormatCreateInput
) {
	// Create the default property object
	if (view_type === 'table')
		(view_format as ITableViewFormat).table_properties.push(
			populateTableViewFormatProperties(view_format_input as TableSchemaUnitFormatCreateInput, schema_id)
		);
	else if (view_type === 'timeline') {
    view_format_input = setDefault(view_format_input as ITimelineViewFormat ?? {}, {
      timeline: true,
      table: true,
    });
		(view_format as ITimelineViewFormat).timeline_table_properties.push(
			populateTableViewFormatProperties((view_format_input as any).table, schema_id)
		);
		(view_format as ITimelineViewFormat).timeline_properties.push({
			property: schema_id,
			visible: (view_format_input as any).timeline
		});
	} else
    (view_format as any)[`${view_type}_properties`].push({
      property: schema_id,
      visible: (view_format_input as ListSchemaUnitFormatCreateInput)
    });
}
