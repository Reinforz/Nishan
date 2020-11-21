import { v4 as uuidv4 } from 'uuid';
import { TableViewCreateParams, TSchemaUnit, TViewFilters, TViewType, ViewAggregations, ViewFormatProperties, ViewSorts } from '../types';

export default function (param: Partial<(TableViewCreateParams)>, schema_entries: [string, TSchemaUnit][], type: TViewType, parent_id: string) {
  const view_id = uuidv4()
  const { cb, wrap, name = `Default ${type}` } = param;

  const common_props = {
    id: view_id,
    version: 0,
    type,
    name,
    page_sort: [],
    parent_id,
    parent_table: 'block',
    alive: true,
    format: {
      [`${type}_properties`]: Array(schema_entries.length).fill(null) as ViewFormatProperties[],
      [`${type}_wrap`]: wrap
    },
    query2: {
      sort: [] as ViewSorts[],
      filter: {
        operator: "and",
        filters: [] as TViewFilters[]
      },
      aggregations: [] as ViewAggregations[]
    },
  }

  const properties = common_props.format[`${type}_properties`] as ViewFormatProperties[];
  const { sort: sorts, filter: { filters }, aggregations } = common_props.query2

  schema_entries.forEach(([key, value], index) => {
    const data = cb ? (cb({ ...value, key }) ?? {}) : {};
    const custom_properties = {
      property: key,
      visible: data?.properties?.[0] ?? true,
      width: data?.properties?.[1] ?? 250,
    }
    if (data?.properties?.[2]) properties.splice(data?.properties[2], 0, custom_properties)
    else
      properties[index] = custom_properties;

    if (data.sorts)
      if (data?.sorts?.[1]) sorts.splice(data.sorts?.[1], 0, { property: key, direction: data.sorts?.[0] ?? "ascending" })
      else sorts.push({ property: key, direction: data.sorts?.[0] ?? "ascending" })

    if (data.aggregations)
      if (data?.aggregations?.[1]) aggregations.splice(data.aggregations?.[1], 0, { property: key, aggregator: data.aggregations[0] ?? "count" })
      else aggregations.push({ property: key, aggregator: data.aggregations[0] })

    if (data.filters)
      data.filters.forEach(filter => {
        const custom_filter = {
          property: key,
          filter: {
            operator: filter?.[0] as any,
            value: {
              type: filter?.[1] as any,
              value: filter?.[2] as any
            }
          }
        }
        if (filter?.[3]) filters.splice(filter?.[3], 0, custom_filter)
        else filters.push(custom_filter)
      })
  });
  return [view_id, common_props] as [string, typeof common_props];
}