import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { ICollection, IViewFilter, TView, TViewQuery2, ViewFormatProperties } from '@nishans/types';
import { FabricatorProps, TViewCreateInput } from '../';
import { getSchemaMapUnit, populateFilters, PopulateViewData } from '../../';
import { generateViewData, populateQuery2SortAndAggregations } from './utils';

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
export async function views (
	collection: Pick<ICollection, 'id' | 'schema'>,
	views: TViewCreateInput[],
	props: FabricatorProps,
	parent_id: string,
	cb?: ((data: TView) => any)
) {
	const schema_map = generateSchemaMapFromCollectionSchema(collection.schema),
		views_data: TView[] = [];

	if (views.length === 0) throw new Error(`input views array cannot be empty`);
	for (let index = 0; index < views.length; index++) {
		const view = views[index],
			{ type, schema_units } = view,
			included_units: string[] = [],
			query2 = PopulateViewData.query2(view as any, schema_map) as TViewQuery2,
			format = PopulateViewData.format(view as any, schema_map),
			properties: ViewFormatProperties[] = (format as any)[`${view.type}_properties`];

		schema_units.forEach((schema_unit) => {
			const { format, name } = schema_unit,
				schema_map_unit = getSchemaMapUnit(schema_map, name, [ 'name' ]);
			included_units.push(schema_map_unit.schema_id);
			populateQuery2SortAndAggregations(schema_unit, schema_map_unit, query2);
			properties.push(PopulateViewData.format_properties(type as any, schema_map_unit.schema_id, format));
		});

		const input_filters = views[index].filters;
		if (input_filters) populateFilters(input_filters, (query2.filter as IViewFilter).filters, schema_map);

		const view_data = generateViewData({ ...view, format, query2 }, props, parent_id);
		views_data.push(view_data);
		cb && (await cb(view_data));
	}

	return views_data;
}
