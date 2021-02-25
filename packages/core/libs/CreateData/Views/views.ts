import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { ICollection, IViewFilter, TViewQuery2, ViewFormatProperties } from '@nishans/types';
import { CreateMaps, getSchemaMapUnit, populateFilters } from '../../';
import { IViewMap, NishanArg, TViewCreateInput } from '../../../types';
import {
  generateViewData,
  populateNonIncludedProperties,
  populateQuery2SortAndAggregations,
  populateViewFormat,
  populateViewProperties,
  populateViewQuery2
} from './utils';

/**
 * * Iterate through each of the view inputs
 * * Populate the query2.(sort & filter & aggregator) & format.properties
 * * Generate the view data using the populated query2 and format
 * * Push the view create operation to the stack
 * * Add the view data to the cache
 * * Populate the view map using the id and the name of the view
 * @param collection The collection related to the collection view
 * @param views Array of collection view inputs
 * @param props Nishan arg passed to the created view objects
 */
export function views (
	collection: Pick<ICollection, 'id' | 'schema' | 'parent_id'>,
	views: TViewCreateInput[],
	props: Omit<NishanArg, 'id'>,
  parent_id?:string
) {
	const schema_map = generateSchemaMapFromCollectionSchema(collection.schema),
		view_ids: string[] = [],
		view_map = CreateMaps.view();
	const {
		TableView,
		ListView,
		GalleryView,
		BoardView,
		CalendarView,
		TimelineView
	} = require('../../../src/View/index');
	const view_classes = {
		table: TableView,
		list: ListView,
		gallery: GalleryView,
		board: BoardView,
		calendar: CalendarView,
		timeline: TimelineView
	};

	if (views.length === 0) throw new Error(`input views array cannot be empty`);
	for (let index = 0; index < views.length; index++) {
		const view = views[index],
			{ name, type, schema_units } = view,
			included_units: string[] = [],
			query2 = populateViewQuery2(view as any, schema_map) as TViewQuery2,
			format = populateViewFormat(view as any, schema_map),
			properties: ViewFormatProperties[] = (format as any)[`${view.type}_properties`];

		schema_units.forEach((schema_unit) => {
			const { format, name } = schema_unit,
				schema_map_unit = getSchemaMapUnit(schema_map, name, [ 'name' ]);
			included_units.push(schema_map_unit.schema_id);
			populateQuery2SortAndAggregations(schema_unit, schema_map_unit, query2);
			properties.push(populateViewProperties(type as any, schema_map_unit.schema_id, format));
		});

		properties.push(...populateNonIncludedProperties(type, collection.schema, included_units));

		const input_filters = views[index].filters;
		if (input_filters) populateFilters(input_filters, (query2.filter as IViewFilter).filters, schema_map);

		const view_data = generateViewData({ ...view, format, query2 }, props, parent_id ?? collection.parent_id);
		view_ids.push(view_data.id);
		const view_object = new view_classes[type]({ ...props, id: view_data.id });
		view_map[type].set(view_data.id, view_object);
		view_map[type].set(name, view_object);

		props.logger && props.logger('CREATE', 'collection_view', view_data.id);
	}

	return [ view_ids, view_map ] as [string[], IViewMap];
}
