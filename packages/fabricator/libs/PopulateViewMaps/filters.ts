import { NotionInit } from "@nishans/init";
import { ISchemaFiltersMap, IViewFilter, Schema, TView, TViewFilters } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";

/**
 * Populates and returns a filter map
 * @param data view data
 * @param schema Schema used to check for property reference and get schema_unit
 */
export function filters(data: TView, schema: Schema){
  const filters = NotionInit.View.filter(data),
    filters_map: ISchemaFiltersMap = new Map();
  
  function populateFilterMap(parent: IViewFilter, indexes: number[]){
  // Iterate through each of the filter of the parent
    parent.filters.forEach((filter, index) => {
      // if the filter contains nested filters, pass the filter to the recursive function, and an array of indexes that keeps track of the index
      if((filter as IViewFilter).filters) populateFilterMap((filter as IViewFilter), indexes.concat(index))
      else {
        const target_filter = filter as TViewFilters, 
          // get the referenced schema unit based on the property
          schema_unit = NotionUtils.getSchemaUnit(schema, target_filter.property, ["query2", "filter", "filters", indexes.join(".")]);
          // Set the filter map value using the array of indexes name as key, and attaching the schema_id in the value, parent filter and the child filter for convenience 
          filters_map.set(indexes.concat(index).join("."), {
            ...schema_unit,
            schema_id: target_filter.property,
            parent_filter: parent,
            child_filter: target_filter
          })
      }
    })
  }

  populateFilterMap(filters, []);

  return [filters_map, filters] as const;
}