import { ISchemaMap, IViewFilter, TViewFilters } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { TViewFilterCreateInput } from '../../';

/**
 * Populate a filter with its children 
 * @param filters The filter input
 * @param parent_filter Parent filter where the nested filter will be added
 * @param schema_map The schema map used to resolve property reference
 */
export function populateViewQuery2Filters (
	filters: TViewFilterCreateInput[],
	parent_filter: IViewFilter['filters'],
	schema_map: ISchemaMap
) {
	function traverse (filter: TViewFilterCreateInput, parent_filter: IViewFilter['filters']) {
		// get the necessary information from the passed filter input
		const { name, position, filter: _filter, filter_operator = 'and', children } = filter;
		const schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map, name, [ 'name' ]);
		// Construct the nested filter object
		const filter_value = {
			property: schema_map_unit.schema_id,
			filter: _filter
		} as TViewFilters;

		if (children) {
			const temp_parent_filter = {
				filters: [],
				operator: filter_operator
			} as any;
			// if filter contains children
			// Push a temporary parent filter object to the original parent filter
			parent_filter.push(temp_parent_filter);
			// Change the reference of the parent filter to the filters of the temporary parent filter
			parent_filter = temp_parent_filter.filters;
		}
		if (position !== undefined && position !== null && position < parent_filter.length)
			parent_filter.splice(position, 0, filter_value);
		else parent_filter.push(filter_value);
		// iterate through each children and populate the parent filter with those
		children && children.forEach((filter) => traverse(filter, parent_filter));
	}
	filters.forEach((filter) => traverse(filter, parent_filter));
}
