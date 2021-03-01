import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { ICollection, IViewFilter, TView, TViewQuery2 } from '@nishans/types';
import { FabricatorProps, TViewCreateInput, TViewFilterCreateInput } from '../';
import { getSchemaMapUnit, PopulateViewData } from '../../';
import { setDefault } from '../../setDefault';
import { generateViewData } from './utils';

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
		const view = views[index];
		setDefault(view, {
			filters: []
		});

		const { schema_units, filters } = view,
			included_units: string[] = [],
			view_query2 = PopulateViewData.query2.query2(view as any, schema_map) as TViewQuery2,
			view_format = PopulateViewData.format.format(view as any, schema_map);

		schema_units.forEach((schema_unit: any) => {
			const { format, name } = schema_unit,
				schema_map_unit = getSchemaMapUnit(schema_map, name, [ 'name' ]);
			included_units.push(schema_map_unit.schema_id);
			PopulateViewData.query2.sort(schema_unit.sort, schema_map_unit.schema_id, view_query2.sort);
			PopulateViewData.query2.aggregation(
				schema_unit.aggregation as any,
				schema_map_unit.schema_id,
				(view_query2 as any).aggregations
			);
			PopulateViewData.format.properties(
				view.type as any,
				schema_map_unit.schema_id,
				view_format as any,
				format as any
			);
		});

		PopulateViewData.query2.filters(
			filters as TViewFilterCreateInput[],
			(view_query2.filter as IViewFilter).filters,
			schema_map
		);

		const view_data = await generateViewData({ ...view, format: view_format, query2: view_query2 }, props, parent_id);
		views_data.push(view_data);
		cb && (await cb(view_data));
	}

	return views_data;
}
