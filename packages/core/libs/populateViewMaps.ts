import { IBoardView, ITableView, ITimelineView, IViewFilter, Schema, TView, TViewFilters, ViewAggregations, ViewFormatProperties, ViewSorts } from '@nishans/types';
import { ISchemaAggregationMap, ISchemaFiltersMap, ISchemaFormatMap, ISchemaSortsMap } from '../types';
import { initializeViewAggregations, initializeViewFilters, initializeViewSorts } from './initializeView';

export function populateAggregationsMap(data: ITableView | IBoardView | ITimelineView, schema: Schema){
  const aggregations_map: ISchemaAggregationMap = new Map(), aggregations = initializeViewAggregations(data);
  ((data.query2 as any).aggregations as ViewAggregations[]).forEach((aggregation) => {
    const schema_unit = schema[aggregation.property];
    if(!schema_unit)
      throw new Error(`Unknown property ${aggregation.property} referenced`)
    aggregations_map.set(schema_unit.name, {
      schema_id: aggregation.property,
      ...schema_unit,
      aggregation,
    } as any)
  });

  return [aggregations_map, aggregations] as const;
}

export function populateSortsMap(data: TView, schema: Schema){
  const sorts_map: ISchemaSortsMap = new Map(), sorts = initializeViewSorts(data);
  ((data.query2 as any).sort as ViewSorts[]).forEach(sort => {
    const schema_unit = schema[sort.property];
    if(!schema_unit)
      throw new Error(`Unknown property ${sort.property} referenced`)

    sorts_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: sort.property,
      sort: sort.direction
    })
  });

  return [sorts_map, sorts] as const;
}

export function populateFiltersMap(data: TView, schema: Schema){
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

export function populateFormatPropertiesMap(data: TView, schema: Schema){
  const format_properties_map: ISchemaFormatMap = new Map(), format_properties = (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[];
  format_properties.forEach(format_property => {
    const schema_unit = schema[format_property.property];
    if(!schema_unit)
      throw new Error(`Unknown property ${format_property.property} referenced`)
    format_properties_map.set(schema_unit.name, {
      ...schema_unit,
      schema_id: format_property.property,
      format: {
        width: format_property.width,
        visible: format_property.visible
      }
    })
  })
  return [format_properties_map, format_properties] as const;
}