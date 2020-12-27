import { RepositionParams, ICollection, ISchemaUnit, NishanArg, TCollectionBlock, TView, ViewAggregations, ViewFormatProperties, TSchemaUnit, TSortValue, ViewSorts, TViewFilters, ViewUpdateParam, UpdateTypes, FilterTypes, TViewQuery2, IViewFilter, UserViewFilterCreateParams } from "../../types";
import Data from "../Data";

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View<T extends TView> extends Data<T> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection_view" });
  }

  #getCollection = () => {
    return this.cache.collection.get((this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock).collection_id) as ICollection
  }

  #getSortsMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection();
    this.#populateSorts();
    const sorts_map: Record<string, TSchemaUnit & ViewSorts> = {}, sorts = data.query2?.sort as ViewSorts[];
    data.query2?.sort?.forEach(sort => {
      const schema_unit = collection.schema[sort.property];
      sorts_map[schema_unit.name] = {
        ...schema_unit,
        ...sort
      }
    });

    return [sorts_map, sorts] as [Record<string, TSchemaUnit & ViewSorts>, ViewSorts[]]
  }

  #getSchemaMap = () => {
    const collection = this.#getCollection(), schema_map: Record<string, TSchemaUnit & { property: string }> = {};
    Object.entries(collection.schema).forEach(([property, value]) => {
      schema_map[value.name] = {
        property,
        ...value
      }
    })
    return schema_map;
  }

  #populateFilters = () => {
    const data = this.getCachedData();
    if (!data.query2) data.query2 = { filter: { operator: "and", filters: [] } } as any;
    if (!data.query2?.filter) (data.query2 as TViewQuery2).filter = { operator: "and", filters: [] };
    if (!data.query2?.filter.filters) (data.query2 as TViewQuery2).filter.filters = [];
    return (data.query2 as any).filter as IViewFilter
  }

  #populateSorts = () => {
    const data = this.getCachedData();
    if (!data.query2) data.query2 = { sort: [] } as any;
    if (data.query2 && !data.query2?.sort) data.query2.sort = [];
  }

  async reposition(arg: RepositionParams) {
    await this.saveTransactions([this.addToChildArray(this.id, arg)]);
  }

  /**
   * Update the current view
   * @param options Options to update the view
   */
  // ? TD:1:M Use the Data.createViews method
  async update(options: ViewUpdateParam[]) {
    const data = this.getCachedData(), collection = this.cache.collection.get((this.getParent() as TCollectionBlock).collection_id) as ICollection;
    const name_map: Record<string, { key: string } & ISchemaUnit> = {};
    Object.entries(collection.schema).forEach(([key, schema]) => name_map[schema.name] = { key, ...schema })

    const sorts = [] as ViewSorts[], filters = [] as TViewFilters[], aggregations = [] as ViewAggregations[], properties = [] as ViewFormatProperties[];

    for (let index = 0; index < options.length; index++) {
      const { name, format, sort, aggregation, filter } = options[index];
      const { key } = name_map[name];

      if (name) {
        const property: ViewFormatProperties = {
          property: key,
        } as any;
        if (typeof format === "boolean") property.visible = format;
        else if (typeof format === "number") property.width = format;
        else if (Array.isArray(format)) {
          property.width = format?.[1] ?? 250
          property.visible = format?.[0] ?? true;
        }
        if (sort) sorts.push({
          property: key,
          direction: sort as any
        })

        if (aggregation) aggregations.push({
          property: key,
          aggregator: aggregation
        })

        if (filter) {
          filter.forEach((filter: any) => {
            const [operator, type, value] = filter;
            filters.push({
              property: key,
              filter: {
                operator,
                value: {
                  type,
                  value
                }
              } as any
            })
          })
        }
        properties.push(property)
      }
    }

    await this.saveTransactions([this.updateOp([], {
      query2: {
        sort: sorts,
        filter: {
          operator: "and",
          filters
        },
        aggregations
      },
      format: {
        [`${data.type}_properties`]: properties
      }
    })]);
    await this.updateCacheManually(this.id);
  }

  async createSort(arg: ([string, TSortValue, number] | [string, TSortValue]), execute?: boolean) {
    await this.createSorts([arg], execute)
  }

  async createSorts(args: ([string, TSortValue, number] | [string, TSortValue])[], execute?: boolean) {
    const data = this.getCachedData(), schema_map = this.#getSchemaMap(), [, sorts] = this.#getSortsMap();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], target_sort = schema_map[arg[0]];
      if (typeof arg[2] === "number") {
        sorts.splice(arg[2], 0, {
          property: target_sort.property,
          direction: arg[1]
        })
      } else
        sorts.push({
          property: target_sort.property,
          direction: arg[1]
        })
    }

    await this.executeUtil([this.updateOp([], {
      query2: {
        ...data.query2
      }
    })], this.id, execute)
  }

  async updateSort(arg: UpdateTypes<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, execute?: boolean,) {
    await this.updateSorts(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  async updateSorts(args: UpdateTypes<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap()
    await this.updateIterate<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      execute,
      multiple
    }, (id) => sorts_map[id], (_, sort, data) => {
      if (Array.isArray(data)) {
        const index = sorts.findIndex(data => data.property === sort.property);
        const [direction, position] = data;
        if (position !== null && position !== undefined) {
          sorts.splice(index, 1);
          sorts.splice(position, 0, {
            property: sort.property,
            direction
          })
        }
      }
      else {
        const target_sort = sorts.find(data => data.property === sort.property) as ViewSorts;
        target_sort.direction = data
      }
    });
    await this.executeUtil([this.updateOp([], { query2: data.query2 })], this.id, execute)
  }

  async deleteSort(arg: FilterTypes<TSchemaUnit & ViewSorts>, execute?: boolean,) {
    await this.deleteSorts(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  async deleteSorts(args: FilterTypes<TSchemaUnit & ViewSorts>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap();
    await this.deleteIterate<TSchemaUnit & ViewSorts>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      execute,
      multiple
    }, (id) => sorts_map[id], (_, sort) => {
      sorts.splice(sorts.findIndex(data => data.property === sort.property), 1);
    });
    await this.executeUtil([this.updateOp([], { query2: data.query2 })], this.id, execute)
  }

  async createFilter(arg: UserViewFilterCreateParams, execute?: boolean) {
    await this.createFilters([arg], execute)
  }

  async createFilters(args: UserViewFilterCreateParams[], execute?: boolean) {
    const schema_map = this.#getSchemaMap(), data = this.getCachedData(), filters = this.#populateFilters().filters;
    for (let index = 0; index < args.length; index++) {
      const { type, operator, value, name, position } = args[index];
      const filter = {
        property: schema_map[name].property,
        filter: {
          operator,
          value: {
            type,
            value
          }
        }
      };
      if (position !== undefined)
        filters.splice(position, 0, filter as any)
      else filters.push(filter as any)
    }
    await this.executeUtil([this.updateOp([], {
      query2: data.query2
    })], this.id, execute)
  }

  /* async updateFilter(cb: (T: TSchemaUnit & TViewFilters) => UserViewFilterParams | undefined) {
    await this.updateFilters(cb, false);
  }

  async updateFilters(cb: (T: TSchemaUnit & TViewFilters) => UserViewFilterParams | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    this.#populateFilters();
    let total_updated = 0;
    const filters = data.query2?.filter.filters as TViewFilters[];
    const schema_entries = new Map(Object.entries(collection.schema));
    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index], schema = schema_entries.get(filter.property), res = cb({ ...schema, ...filter } as any) ?? undefined;
      if (res) {
        total_updated++;
        const [operator, type, value, position] = res[0];
        const update_filter = {
          property: filter.property,
          filter: {
            operator,
            value: {
              type,
              value
            }
          } as any
        };
        if (position) {
          filters.splice(index, 1)
          filters.splice(position, 0, update_filter)
        }
        else filters[index] = update_filter;
      }
      if (!multiple && total_updated === 1) break;
    }

    if (total_updated) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  } */

  async deleteFilter(cb: (T: TSchemaUnit & TViewFilters) => boolean | undefined) {
    await this.deleteFilters(cb, false);
  }

  async deleteFilters(cb: (T: TSchemaUnit & TViewFilters) => boolean | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    this.#populateFilters();
    let total_deleted = 0;
    const filters = data.query2?.filter.filters as TViewFilters[],
      schema_entries = new Map(Object.entries(collection.schema));

    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index] as TViewFilters,
        schema = schema_entries.get(filter.property),
        should_delete = cb({ ...filter, ...schema } as any) ?? undefined;
      if (should_delete) {
        total_deleted++;
        filters.splice(index, 1)
      }
      if (!multiple && total_deleted === 1) break;
    }

    if (total_deleted) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }

  async updateFormatProperty(cb: (T: TSchemaUnit & ViewFormatProperties) => Partial<[number, boolean, number]> | undefined) {
    await this.updateFormatProperties(cb, false);
  }

  async updateFormatProperties(cb: (T: TSchemaUnit & ViewFormatProperties) => Partial<[number, boolean, number]> | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    let total_effected = 0;
    const properties = (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[], updated_properties = [] as ViewFormatProperties[];
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index], collection_property = collection.schema[property.property];
      const updated_property = cb({ ...property, ...collection_property }),
        position = updated_property?.[2]
      const new_property = {
        width: updated_property?.[0] ?? property.width,
        property: property.property,
        visible: updated_property?.[1] ?? property.visible
      }
      const _index = position ?? index;
      updated_properties[_index] = new_property
      total_effected++;
      if (!multiple && total_effected === 1) break;
    }
    if (total_effected) {
      await this.saveTransactions([this.updateOp([], {
        format: {
          ...data.format,
          [`${data.type}_properties`]: updated_properties
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }
}

export default View;