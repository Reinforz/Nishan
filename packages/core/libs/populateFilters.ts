import { ISchemaMap } from '@nishans/notion-formula';
import { IViewFilter, TViewFilters } from '@nishans/types';
import { TViewFilterCreateInput } from '../types';

export function populateFilters (
	filters: TViewFilterCreateInput[],
	parent_filter: IViewFilter['filters'],
	schema_map: ISchemaMap
) {
	function traverse (filter: TViewFilterCreateInput, parent_filter: IViewFilter['filters']) {
		const { name, position, filter: _filter, filter_operator = 'and', children } = filter;
		const schema_unit = schema_map.get(name);
		if (schema_unit) {
			const filter_value = {
				property: schema_unit.schema_id,
				filter: _filter
			} as TViewFilters;

			if (children) {
				const temp_parent_filter = {
					filters: [],
					operator: filter_operator
				} as any;
				parent_filter.push(temp_parent_filter);
				parent_filter = temp_parent_filter.filters;
			}
			if (position !== undefined && position !== null && position < parent_filter.length)
				parent_filter.splice(position, 0, filter_value);
			else parent_filter.push(filter_value);
			children && children.forEach((filter) => traverse(filter, parent_filter));
		} else throw new Error(`Unknown property ${name} referenced`);
	}
	filters.forEach((filter) => traverse(filter, parent_filter));
}
