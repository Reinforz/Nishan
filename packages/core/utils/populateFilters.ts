import { IViewFilter, TSchemaUnit, TViewFilters } from "@nishans/types";
import { IViewCreateInput, TViewFilterCreateInput } from "../types";

export function populateFilters (filters: IViewCreateInput["filters"], parent_filter: IViewFilter["filters"], name_map: Map<string, { schema_id: string } & TSchemaUnit>) {
  function traverse(filter: TViewFilterCreateInput, parent_filter: IViewFilter["filters"]) {
      const { name, position, filter:_filter, filter_operator = "and", children } = filter;
      const filter_value = {
        property: name_map.get(name)?.schema_id ?? name,
        filter: _filter
      } as TViewFilters

      if (children) {
        const temp_parent_filter = {
          filters: [],
          operator: filter_operator
        } as any
        parent_filter.push(temp_parent_filter);
        parent_filter = temp_parent_filter.filters;
      }
      if (position !== undefined && position !== null && position < parent_filter.length) parent_filter.splice(position, 0, filter_value)
      else parent_filter.push(filter_value);
      children && children.forEach(filter=>traverse(filter, parent_filter));
  }
  filters && filters.forEach(filter=>traverse(filter, parent_filter))
}