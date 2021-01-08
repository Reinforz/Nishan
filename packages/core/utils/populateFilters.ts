import { TSchemaUnitType, ISchemaUnit } from "@nishans/types";
import { ViewFilterCreateInput } from "../types";

export function populateFilters (filters: ViewFilterCreateInput<TSchemaUnitType>[], parent_filter: any, parent_property: string, name_map: Map<string, { key: string } & ISchemaUnit>) {
  function traverse(filters: ViewFilterCreateInput<TSchemaUnitType>["filters"], parent_filter: any, parent_property: string) {
    filters?.forEach((filter) => {
      const { operator, type, value, position, property = parent_property, filter_operator = "and", filters: nested_filters } = filter;
      const filter_value = {
        property: name_map.get(filter.property)?.key ?? property,
        filter: {
          operator,
          value: {
            type,
            value
          }
        }
      }

      if (nested_filters) {
        const temp_parent_filter = {
          filters: [],
          operator: filter_operator
        } as any
        parent_filter.push(temp_parent_filter);
        parent_filter = temp_parent_filter.filters;
      }

      if (position !== undefined && position !== null && position < parent_filter.length) parent_filter.splice(position, 0, filter_value)
      else parent_filter.push(filter_value)
      nested_filters && traverse(nested_filters, parent_filter, property);
    })
  }
  traverse(filters as any, parent_filter, parent_property);
}