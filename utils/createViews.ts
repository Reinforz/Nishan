import { v4 as uuidv4 } from 'uuid';
import { BoardViewCreateParams, ListViewCreateParams, TableViewCreateParams, TSchemaUnit, TViewFilters, TViewType, ViewAggregations, ViewFormatProperties, ViewSorts } from '../types';

export default function (param: Partial<(TableViewCreateParams | ListViewCreateParams | BoardViewCreateParams)>, schema_entries: [string, TSchemaUnit][], type: TViewType, parent_id: string) {
  const view_id = uuidv4()
  const { cb, name = `Default ${type}` } = param;

  let common_props = {
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
    },
    query2: {
      sort: [] as ViewSorts[],
      filter: {
        operator: "and",
        filters: [] as TViewFilters[]
      }
    }
  } as any;

  switch (type) {
    case "table":
      common_props.format.table_wrap = (param as TableViewCreateParams).wrap ?? false;
      common_props.query2.aggregations = [] as ViewAggregations[];
    case "board":
      const { board_cover = { type: "page_content" }, board_cover_aspect = 'contain', board_cover_size = 'medium' } = param as Partial<BoardViewCreateParams>;
      common_props.format = {
        ...common_props.format,
        board_cover,
        board_cover_aspect,
        board_cover_size
      }

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

    if (type !== "list") {
      const custom_data: any = data;
      if (custom_data.aggregations)
        if (custom_data?.aggregations?.[1]) aggregations.splice(custom_data.aggregations?.[1], 0, { property: key, aggregator: custom_data.aggregations[0] ?? "count" })
        else aggregations.push({ property: key, aggregator: custom_data.aggregations[0] })
    }

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