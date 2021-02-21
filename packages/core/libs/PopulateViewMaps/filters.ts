import { IViewFilter, Schema, TView, TViewFilters } from "@nishans/types";
import { initializeViewFilters } from "..";
import { ISchemaFiltersMap } from "../../src";

export function filters(data: TView, schema: Schema){
  const filters = initializeViewFilters(data),
    filters_map: ISchemaFiltersMap = new Map();

  function populateFilterMap(parent: IViewFilter, indexes: number[]){
    parent.filters.forEach((filter, index) => {
      if((filter as IViewFilter).filters) populateFilterMap((filter as IViewFilter), indexes.concat(index))
      else {
        const target_filter = filter as TViewFilters, 
          schema_unit = schema[target_filter.property];
        if(schema_unit){
          filters_map.set(indexes.concat(index).join("."), {
            ...schema_unit,
            schema_id: target_filter.property,
            parent_filter: parent,
            child_filter: target_filter
          })
        } else
          throw new Error(`Unknown property ${target_filter.property} referenced`)
      }
    })
  }

  populateFilterMap((data.query2 as any).filter as IViewFilter, []);

  return [filters_map, filters] as const;
}