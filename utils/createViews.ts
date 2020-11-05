import { UserViewArg } from "../types/function";
import Operation from "./chunk";

// ? TD: FilterType interface
/**
 * 
 * @param views View Argument
 * @param parent_id id of the parent block
 */
export default function createViews(views: UserViewArg[], parent_id: string) {
  return views.map(({ id, aggregations = [], sorts = [], filters = [], properties = [], wrap = true, type = 'table', name = `Default ${type}` }) => Operation.collection_view.update(id as string, [], {
    id,
    version: 0,
    type,
    name,
    format: {
      [`${type}_properties`]: properties.map((key) => ({
        visible: key[1] ?? true,
        property: key[0],
        width: key[2] ?? 250
      })),
      [`${type}_wrap`]: wrap
    },
    query2: {
      sort: sorts.map((sort) => ({
        property: sort[0],
        direction: sort[1] === -1 ? 'ascending' : 'descending'
      })),
      filter: {
        operator: "and",
        filters: filters.map((filter: any) => ({
          property: filter[0],
          filter: {
            operator: filter[1],
            value: {
              type: filter[2],
              value: filter[3]
            }
          }
        }))
      },
      aggregations: aggregations.map(aggregation => ({ property: aggregation[0], aggregator: aggregation[1] }))
    },
    page_sort: [],
    parent_id,
    parent_table: 'block',
    alive: true
  })
  )
};